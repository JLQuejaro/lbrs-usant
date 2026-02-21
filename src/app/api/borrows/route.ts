import { NextRequest, NextResponse } from 'next/server';
import { 
  borrowBook, 
  returnBook, 
  getActiveBorrowsByUserId, 
  getBorrowHistoryByUserId,
  getOverdueBorrows 
} from '@/app/lib/db-repository';

/**
 * GET /api/borrows
 * Get borrow records for the authenticated user
 * 
 * Query parameters:
 * - status: Filter by status (active, returned, overdue)
 * - history: Get full history (true/false)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const history = searchParams.get('history');
    
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
    } else if (history === 'true') {
      borrows = await getBorrowHistoryByUserId(userId);
    } else {
      borrows = await getActiveBorrowsByUserId(userId);
    }
    
    return NextResponse.json(
      { borrows, count: borrows.length },
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
        borrow,
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
    
    // Execute return
    const borrow = await returnBook(parseInt(borrowId, 10));
    
    if (!borrow) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Borrow record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Book returned successfully', borrow },
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
