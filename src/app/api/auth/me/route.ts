import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/app/lib/db-repository';

/**
 * GET /api/auth/me
 * Get current authenticated user information
 */
export async function GET(request: NextRequest) {
  try {
    // Get user ID from header (set by middleware)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No user ID in request' },
        { status: 401 }
      );
    }
    
    // Get user from database
    const user = await getUserById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not Found', message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return user data (without password hash)
    const { password_hash, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { user: userWithoutPassword },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to get user' },
      { status: 500 }
    );
  }
}
