import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateToken } from '@/app/lib/auth';
import { getUserByEmail } from '@/app/lib/db-repository';

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Email and password are required' },
        { status: 400 }
      );
    }

    try {
      const user = await getUserByEmail(email);

      if (!user) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Check if user is active
      if (!user.is_active) {
        return NextResponse.json(
          { error: 'Forbidden', message: 'Account is deactivated' },
          { status: 403 }
        );
      }

      // Check if user is approved
      if (user.approval_status !== 'approved') {
        return NextResponse.json(
          { 
            error: 'Forbidden', 
            message: `Account is ${user.approval_status}. Please wait for admin approval.` 
          },
          { status: 403 }
        );
      }

      // Verify password
      let isValidPassword = false;

      if (user.password_hash && user.password_hash.startsWith('$2')) {
        isValidPassword = await verifyPassword(password, user.password_hash);
      } else if (user.password_hash) {
        // Fallback for legacy plaintext passwords
        isValidPassword = password === user.password_hash;
      }

      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Generate JWT token
      const token = generateToken({
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      });

      // Return user data (without password hash)
      const { password_hash, ...userWithoutPassword } = user;

      return NextResponse.json(
        {
          message: 'Login successful',
          user: userWithoutPassword,
          token,
        },
        { status: 200 }
      );
    } catch (dbError) {
      console.error('Database login failed:', dbError);
      return NextResponse.json(
        { error: 'Service Unavailable', message: 'Database is unavailable. Please try again.' },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to login' },
      { status: 500 }
    );
  }
}
