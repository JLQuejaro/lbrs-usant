import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateToken } from '@/app/lib/auth';
import { getUserByEmail } from '@/app/lib/db-repository';
import { isValidUniversityEmail, getEmailDomainError, logUnauthorizedAttempt } from '@/app/lib/email-validation';
import { prisma } from '@/app/lib/prisma';

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

    // Domain validation
    if (!isValidUniversityEmail(email)) {
      logUnauthorizedAttempt(email, 'login');
      return NextResponse.json(
        { error: 'Forbidden', message: getEmailDomainError() },
        { status: 403 }
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

      // Verify password (bcrypt only)
      const isValidPassword = await verifyPassword(password, user.password_hash);

      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Update last login timestamp
      await prisma.user.update({
        where: { id: user.user_id },
        data: { lastLoginAt: new Date() }
      });

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
