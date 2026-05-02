/**
 * Middleware for protecting API routes with JWT authentication and rate limiting
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/app/lib/auth';
import { loginRateLimiter } from '@/app/lib/rate-limiter';

// Ensure JWT_SECRET is available
if (!process.env.JWT_SECRET) {
  console.error('CRITICAL: JWT_SECRET is not defined in middleware');
}

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
];

// Routes that require admin role
const ADMIN_ROUTES = [
  '/api/admin',
  '/api/users',
  '/api/account-requests',
  '/api/stats',
];

// Staff-accessible admin routes
const STAFF_ALLOWED_ROUTES = [
  '/api/users',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rate limiting for login endpoint
  if (pathname === '/api/auth/login') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    try {
      await loginRateLimiter.consume(ip);
    } catch (error) {
      return NextResponse.json(
        { error: 'Too Many Requests', message: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }
  }
  
  // Skip middleware for public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Get token from Authorization header
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.substring(7); // Remove 'Bearer ' prefix
  
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'No token provided' },
      { status: 401 }
    );
  }
  
  // Verify token
  const payload = verifyToken(token);
  
  if (!payload) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Invalid or expired token' },
      { status: 401 }
    );
  }
  
  // Check admin routes
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    const isStaffAllowed = payload.role === 'staff' && STAFF_ALLOWED_ROUTES.some(route => pathname.startsWith(route));
    if (payload.role !== 'admin' && !isStaffAllowed) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Admin access required' },
        { status: 403 }
      );
    }
  }
  
  // Add user info to request headers for API routes to use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.userId);
  requestHeaders.set('x-user-email', payload.email);
  requestHeaders.set('x-user-role', payload.role);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: '/api/:path*',
  runtime: 'nodejs',
};
