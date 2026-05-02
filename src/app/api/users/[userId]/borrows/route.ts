import { NextRequest, NextResponse } from 'next/server';
import { getAllBorrowsByUserId } from '@/app/lib/db-repository';

function mapBorrow(record: any) {
  return {
    id: record.borrow_id,
    userId: record.user_id,
    bookId: record.book_id,
    title: record.title || record.book_title,
    author: record.author,
    color: record.color_theme,
    borrowedDate: record.borrowed_date,
    dueDate: record.due_date,
    returnedDate: record.returned_date,
    status: record.status,
    username: record.username,
    email: record.email,
  };
}

/**
 * GET /api/users/[userId]/borrows
 * Get borrow history for a specific user (admin/staff only)
 * 
 * Query parameters:
 * - status: Filter by status (all, returned, active)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userRole = request.headers.get('x-user-role');
    
    // Only admin and staff can view other users' borrow history
    if (userRole !== 'admin' && userRole !== 'staff') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Only admin and staff can view user borrow history' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    
    const borrows = await getAllBorrowsByUserId(params.userId, status);
    
    return NextResponse.json(
      { borrows: borrows.map(mapBorrow), count: borrows.length },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Get user borrows error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to get user borrows' },
      { status: 500 }
    );
  }
}
