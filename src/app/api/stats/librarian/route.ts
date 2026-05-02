import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());

    const [
      overdueCount,
      monthlyBorrowCount,
      lowCirculationCount,
      totalBooksWithBorrows,
    ] = await Promise.all([
      // Overdue materials
      prisma.borrowRecord.count({
        where: {
          status: 'active',
          dueDate: { lt: now },
        },
      }),

      // Monthly borrows
      prisma.borrowRecord.count({
        where: {
          borrowedDate: { gte: startOfMonth },
        },
      }),

      // Low circulation books (not borrowed in 6+ months)
      prisma.book.count({
        where: {
          OR: [
            {
              borrowRecords: {
                none: {},
              },
            },
            {
              borrowRecords: {
                every: {
                  borrowedDate: { lt: sixMonthsAgo },
                },
              },
            },
          ],
        },
      }),

      // Books with at least one borrow
      prisma.book.count({
        where: {
          borrowRecords: {
            some: {},
          },
        },
      }),
    ]);

    return NextResponse.json({
      overdue: overdueCount,
      monthlyBorrows: monthlyBorrowCount,
      lowCirculation: lowCirculationCount,
      totalBooksWithBorrows,
    });
  } catch (error) {
    console.error('Librarian stats error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
