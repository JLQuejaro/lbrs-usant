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
    
    // Find user by email
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
    // For development/demo accounts with known passwords
    const demoPasswords: Record<string, string> = {
      'admin@usant.edu': 'admin123',
      'john@usant.edu': 'student123',
      'rob@usant.edu': 'faculty123',
      'maria@usant.edu': 'librarian123',
    };

    let isValidPassword = false;

    // Check if it's a demo account
    if (demoPasswords[email]) {
      isValidPassword = password === demoPasswords[email];
    } else if (user.password_hash && user.password_hash.startsWith('$2b$')) {
      // Password is hashed, verify it
      isValidPassword = await verifyPassword(password, user.password_hash);
    } else {
      // Fallback for mock data without hashed passwords (development only)
      console.warn('Development mode: Using fallback authentication for user without hashed password');
      isValidPassword = true;
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
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to login' },
      { status: 500 }
    );
  }
}
