/**
 * Cron Job Endpoint: Mark Overdue Borrows
 *
 * Vercel Cron Job endpoint that updates active borrow records past their due date.
 *
 * Security: Protected by Bearer token verification via CRON_SECRET header.
 *
 * Vercel Configuration (vercel.json):
 * {
 *   "crons": {
 *     "mark-overdue-borrows": {
 *       "path": "/api/cron/mark-overdue",
 *       "schedule": "0 2 * * *"
 *     }
 *   }
 * }
 *
 * The schedule "0 2 * * *" runs daily at 2:00 AM UTC.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    console.log('[Cron] Starting overdue borrows update...');

    const result = await prisma.borrowRecord.updateMany({
      where: {
        status: 'active',
        dueDate: {
          lt: new Date(),
        },
      },
      data: {
        status: 'overdue',
      },
    });

    console.log(`[Cron] Complete. Updated ${result.count} borrow(s) to 'overdue' status.`);

    return NextResponse.json({
      success: true,
      message: `Updated ${result.count} borrow(s) to overdue status`,
      count: result.count,
    });
  } catch (error) {
    console.error('[Cron] Error updating overdue borrows:', error);
    return NextResponse.json(
      { error: 'Failed to update overdue borrows' },
      { status: 500 }
    );
  }
}
