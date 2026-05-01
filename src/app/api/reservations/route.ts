import { NextRequest, NextResponse } from 'next/server';
import { createReservation, getReservationsByUserId, getAllReservations } from '@/app/lib/db-repository';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const reservations = userRole === 'admin' || userRole === 'staff'
      ? await getAllReservations()
      : await getReservationsByUserId(userId);
    
    return NextResponse.json({ reservations }, { status: 200 });
  } catch (error) {
    console.error('Get reservations error:', error);
    return NextResponse.json({ error: 'Failed to get reservations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { bookId } = await request.json();
    
    if (!bookId) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }
    
    const reservation = await createReservation(userId, bookId);
    
    return NextResponse.json({ message: 'Reservation created', reservation }, { status: 201 });
  } catch (error) {
    console.error('Create reservation error:', error);
    
    if (error instanceof Error && error.message?.includes('already exists')) {
      return NextResponse.json({ error: 'Reservation already exists' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}
