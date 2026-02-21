import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken } from '@/app/lib/auth';
import { createUser, getUserByEmail } from '@/app/lib/db-repository';

/**
 * POST /api/auth/register
 * Register a new user account
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      username,
      email,
      password,
      role,
      userType,
      course,
      department,
      yearLevel,
    } = body;
    
    // Validation
    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Username, email, password, and role are required' },
        { status: 400 }
      );
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Conflict', message: 'Email already registered' },
        { status: 409 }
      );
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Prepare user data based on role
    const userData: any = {
      username,
      email,
      password_hash: passwordHash,
      role,
    };
    
    // Role-specific fields
    if (role === 'student') {
      userData.user_type_student = userType;
      userData.course = course;
      userData.year_level = yearLevel;
    } else if (role === 'faculty') {
      userData.user_type_faculty = userType;
      userData.department = department;
    } else if (role === 'staff') {
      userData.user_type_staff = userType;
    } else if (role === 'admin') {
      userData.user_type_admin = userType;
    }
    
    // Create user
    const user = await createUser(userData);
    
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
        message: 'Registration successful',
        user: userWithoutPassword,
        token,
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to register user' },
      { status: 500 }
    );
  }
}
