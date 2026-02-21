import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateToken } from '@/app/lib/auth';
import { getUserByEmail } from '@/app/lib/db-repository';

// Demo accounts for development (works without database)
const DEMO_ACCOUNTS = [
  {
    email: 'admin@usant.edu',
    password: 'admin123',
    user: {
      user_id: '00000000-0000-0000-0000-000000000008',
      username: 'Admin User',
      email: 'admin@usant.edu',
      role: 'admin' as const,
      user_type_admin: 'System Administrator',
      approval_status: 'approved' as const,
      is_active: true,
      created_at: new Date(),
    }
  },
  {
    email: 'john@usant.edu',
    password: 'student123',
    user: {
      user_id: '00000000-0000-0000-0000-000000000001',
      username: 'John Student',
      email: 'john@usant.edu',
      role: 'student' as const,
      user_type_student: 'Undergraduate Student',
      course: 'Computer Science',
      year_level: '4th Year',
      approval_status: 'approved' as const,
      is_active: true,
      created_at: new Date(),
    }
  },
  {
    email: 'rob@usant.edu',
    password: 'faculty123',
    user: {
      user_id: '00000000-0000-0000-0000-000000000006',
      username: 'Dr. Robert Johnson',
      email: 'rob@usant.edu',
      role: 'faculty' as const,
      user_type_faculty: 'Professor',
      department: 'Computer Science',
      approval_status: 'approved' as const,
      is_active: true,
      created_at: new Date(),
    }
  },
  {
    email: 'maria@usant.edu',
    password: 'librarian123',
    user: {
      user_id: '00000000-0000-0000-0000-000000000007',
      username: 'Maria Santos',
      email: 'maria@usant.edu',
      role: 'staff' as const,
      user_type_staff: 'Librarian',
      approval_status: 'approved' as const,
      is_active: true,
      created_at: new Date(),
    }
  },
];

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

    // Check demo accounts first (works without database)
    const demoAccount = DEMO_ACCOUNTS.find(acc => acc.email === email);
    
    if (demoAccount) {
      if (password !== demoAccount.password) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Generate JWT token
      const token = generateToken({
        user_id: demoAccount.user.user_id,
        email: demoAccount.user.email,
        role: demoAccount.user.role,
      });

      return NextResponse.json(
        {
          message: 'Login successful',
          user: demoAccount.user,
          token,
        },
        { status: 200 }
      );
    }

    // If not a demo account, try database
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

      if (user.password_hash && user.password_hash.startsWith('$2b$')) {
        // Password is hashed, verify it
        isValidPassword = await verifyPassword(password, user.password_hash);
      } else if (user.password_hash) {
        // Plain text password (development)
        isValidPassword = password === user.password_hash;
      } else {
        // No password hash (legacy mock data)
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
    } catch (dbError) {
      // Database not available
      console.error('Database login failed, demo account not found:', email);
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid email or password. Database not available.' },
        { status: 401 }
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
