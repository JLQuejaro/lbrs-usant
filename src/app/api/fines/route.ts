import { NextRequest, NextResponse } from 'next/server';
import { createFine, markFineAsPaid, getUnpaidFinesByUserId } from '@/app/lib/db-repository';

/**
 * GET /api/fines
 * Get unpaid fines for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No user ID in request' },
        { status: 401 }
      );
    }
    
    const fines = await getUnpaidFinesByUserId(userId);
    
    return NextResponse.json(
      { fines, count: fines.length },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Get fines error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to get fines' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/fines
 * Record a fine for a borrow record
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { borrowId, amount, ratePerDay } = body;
    
    if (!borrowId || amount === undefined || ratePerDay === undefined) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'borrowId, amount, and ratePerDay are required' },
        { status: 400 }
      );
    }
    
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'admin' && userRole !== 'staff') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Only staff can create fines' },
        { status: 403 }
      );
    }
    
    const fine = await createFine(borrowId, amount, ratePerDay);
    
    return NextResponse.json(
      { message: 'Fine created successfully', fine },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Create fine error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to create fine' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/fines?id=:id
 * Mark a fine as paid
 */
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fineId = searchParams.get('id');
    
    if (!fineId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Fine ID is required' },
        { status: 400 }
      );
    }
    
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'admin' && userRole !== 'staff') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Only staff can mark fines as paid' },
        { status: 403 }
      );
    }
    
    const fine = await markFineAsPaid(fineId);
    
    if (!fine) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Fine not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Fine marked as paid', fine },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Mark fine as paid error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to mark fine as paid' },
      { status: 500 }
    );
  }
}
