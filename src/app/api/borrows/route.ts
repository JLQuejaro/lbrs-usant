import { NextRequest, NextResponse } from 'next/server';
import { 
  borrowBook, 
  returnBook, 
  getActiveBorrowsByUserId,
  getAllBorrowsByUserId,
  getOverdueBorrows,
  getBorrowById
} from '@/app/lib/db-repository';

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
 * GET /api/borrows
 * Get borrow records for the authenticated user
 * 
 * Query parameters:
 * - status: Filter by status (active, overdue, all, returned)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    // Get user ID from header (set by middleware)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No user ID in request' },
        { status: 401 }
      );
    }
    
    let borrows;
    
    if (status === 'overdue') {
      // Get overdue borrows (admin/librarian function)
      const userRole = request.headers.get('x-user-role');
      if (userRole !== 'admin' && userRole !== 'staff') {
        return NextResponse.json(
          { error: 'Forbidden', message: 'Only staff can view overdue borrows' },
          { status: 403 }
        );
      }
      borrows = await getOverdueBorrows();
    } else if (status === 'all' || status === 'returned') {
      // Get all borrows or filtered by status
      borrows = await getAllBorrowsByUserId(userId, status);
    } else {
      // Default: active borrows only
      borrows = await getActiveBorrowsByUserId(userId);
    }
    
    return NextResponse.json(
      { borrows: borrows.map(mapBorrow), count: borrows.length },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Get borrows error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to get borrows' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/borrows
 * Borrow a book
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookId } = body;
    
    // Validation
    if (!bookId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Book ID is required' },
        { status: 400 }
      );
    }
    
    // Get user ID from header (set by middleware)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No user ID in request' },
        { status: 401 }
      );
    }
    
    // Calculate due date (7 days for students, 30 days for faculty)
    const userRole = request.headers.get('x-user-role');
    const dueDate = new Date();
    const borrowDays = userRole === 'faculty' ? 30 : 7;
    dueDate.setDate(dueDate.getDate() + borrowDays);
    
    // Create borrow record
    const borrow = await borrowBook(userId, bookId, dueDate);
    
    return NextResponse.json(
      { 
        message: 'Book borrowed successfully',
        borrow: mapBorrow(borrow),
        dueDate: borrow.due_date,
      },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('Borrow book error:', error);
    
    // Handle specific errors
    if (error.message?.includes('available')) {
      return NextResponse.json(
        { error: 'Conflict', message: 'Book is not available' },
        { status: 409 }
      );
    }
    
    if (error.message?.includes('unpaid fines')) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Cannot borrow: user has unpaid fines' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to borrow book' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/borrows/:id/return
 * Return a borrowed book
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const borrowId = searchParams.get('id');
    
    if (!borrowId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Borrow ID is required' },
        { status: 400 }
      );
    }
    
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No user ID in request' },
        { status: 401 }
      );
    }
    
    // Fetch borrow record to check ownership
    const existingBorrow = await getBorrowById(borrowId);
    
    if (!existingBorrow) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Borrow record not found' },
        { status: 404 }
      );
    }
    
    // Authorization: only borrower or staff/admin can return
    const isBorrower = existingBorrow.user_id === userId;
    const isStaff = userRole === 'staff' || userRole === 'admin';
    
    if (!isBorrower && !isStaff) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Only the borrower or librarian can return this book' },
        { status: 403 }
      );
    }
    
    // Execute return
    const borrow = await returnBook(borrowId);
    
    return NextResponse.json(
      { message: 'Book returned successfully', borrow: mapBorrow(borrow!) },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Return book error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to return book' },
      { status: 500 }
    );
  }
}
