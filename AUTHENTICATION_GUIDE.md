# Authentication System Documentation

## Overview

The USANT LBRS now has a complete authentication system that:
- **Stores user information** when logging in or registering
- **Displays personalized content** based on the logged-in user
- **Persists sessions** across page refreshes
- **Protects routes** with JWT token validation

---

## How It Works

### 1. User Registration

When a user creates an account:
```
User fills form → POST /api/auth/register → 
Database stores user → JWT token generated → 
User data stored in AuthContext + localStorage → 
Redirect to dashboard
```

**Information stored:**
- `user_id` (UUID)
- `username` (full name)
- `email`
- `role` (student/faculty/staff/admin)
- `user_type_*` (specific type based on role)
- `course` (for students)
- `department` (for faculty)
- `year_level` (for students)
- `approval_status`
- `is_active`

### 2. User Login

When a user logs in:
```
User enters credentials → POST /api/auth/login → 
Verify password → JWT token generated → 
User data returned → Stored in AuthContext + localStorage → 
Redirect to role-specific dashboard
```

### 3. Session Persistence

User stays logged in across page refreshes:
- On app mount, AuthContext checks localStorage for `token` and `user`
- If found, user is automatically logged in
- Navbar displays user's name and role
- All pages can access user information via `useAuth()` hook

### 4. User Logout

When user logs out:
- AuthContext clears user data
- localStorage is cleared
- Redirect to login page

---

## File Structure

```
src/app/
├── contexts/
│   └── AuthContext.tsx       # User authentication state management
├── lib/
│   ├── auth.ts               # Password hashing & JWT utilities
│   ├── db.ts                 # Database connection
│   └── db-repository.ts      # Database CRUD operations
├── api/
│   ├── auth/
│   │   ├── register/
│   │   │   └── route.ts      # POST /api/auth/register
│   │   ├── login/
│   │   │   └── route.ts      # POST /api/auth/login
│   │   └── me/
│   │       └── route.ts      # GET /api/auth/me
│   ├── books/
│   │   └── route.ts          # GET/POST /api/books
│   └── borrows/
│       └── route.ts          # GET/POST/PUT /api/borrows
├── components/
│   └── Navbar.tsx            # Now uses AuthContext for user info
├── layout.tsx                # Wraps app with AuthProvider
└── page.tsx                  # Login/Register page
```

---

## Using Authentication in Components

### Access User Information

```tsx
"use client";

import { useAuth } from '@/app/contexts/AuthContext';

export default function MyComponent() {
  const { user, token, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <p>Welcome, {user.username}!</p>
      <p>Role: {user.role}</p>
      {user.role === 'student' && (
        <p>Course: {user.course}</p>
      )}
    </div>
  );
}
```

### Protect Routes

```tsx
"use client";

import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Protected content</div>;
}
```

### Check User Role

```tsx
const { user } = useAuth();

// Check if user is student
if (user?.role === 'student') {
  // Student-specific content
}

// Check if user is faculty
if (user?.role === 'faculty') {
  // Faculty-specific content
}

// Check user type
if (user?.user_type_student === 'Undergraduate Student') {
  // Undergraduate-specific content
}
```

---

## API Endpoints

### POST /api/auth/register

**Request:**
```json
{
  "username": "John Doe",
  "email": "john@usant.edu",
  "password": "password123",
  "role": "student",
  "userType": "Undergraduate Student",
  "course": "Computer Science",
  "yearLevel": "3rd Year"
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "user": {
    "user_id": "uuid...",
    "username": "John Doe",
    "email": "john@usant.edu",
    "role": "student",
    "course": "Computer Science",
    "year_level": "3rd Year"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /api/auth/login

**Request:**
```json
{
  "email": "john@usant.edu",
  "password": "password123"
}
```

**Response:** Same as register

### GET /api/auth/me

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "user": {
    "user_id": "uuid...",
    "username": "John Doe",
    "email": "john@usant.edu",
    "role": "student"
  }
}
```

---

## LocalStorage Keys

| Key | Value |
|-----|-------|
| `token` | JWT token string |
| `user` | JSON stringified user object |

---

## Security Features

### Password Hashing
- All passwords are hashed using bcrypt before storing
- Salt rounds: 10 (configurable via `BCRYPT_SALT_ROUNDS`)

### JWT Tokens
- Signed with secret key (`JWT_SECRET`)
- Expiration: 7 days
- Payload: userId, email, role

### Middleware Protection
- API routes under `/api/*` are protected
- Token verified automatically
- Role-based access control for admin routes

### Development Mode
- Users without hashed passwords can login with any password
- **Important**: Hash all passwords before production

---

## Testing the System

### 1. Register a New User

1. Go to http://localhost:3000
2. Click "Register"
3. Fill in the form:
   - Full Name: Test User
   - Email: test@usant.edu
   - Password: password123
   - Role: Student
   - Course: Computer Science
   - Year Level: 1st Year
4. Click "Create Account"
5. You should be redirected to the student dashboard
6. Navbar should show "Test User" and "Student"

### 2. Login

1. Logout (click Logout in Navbar)
2. Enter your email and password
3. Click "Sign In"
4. You should see your name and role in the Navbar

### 3. Session Persistence

1. Login as any user
2. Refresh the page
3. You should stay logged in
4. Your name and role should still appear in Navbar

---

## Troubleshooting

### User data not showing in Navbar

**Check:**
1. AuthProvider is wrapping the app in `layout.tsx`
2. `useAuth()` is being used in a client component
3. Browser localStorage is enabled

### Login fails with "Database error"

**Check:**
1. PostgreSQL is running
2. `.env.local` has correct database credentials
3. Run `npm run db:test` to verify connection

### "Token expired" error

**Solution:**
- Token expires after 7 days
- Login again to get a new token
- To change expiration, edit `JWT_EXPIRATION` in `src/app/lib/auth.ts`

### User can't access certain pages

**Check:**
- User role has access to that route
- Middleware is not blocking the route
- Token is valid

---

## Migration from Mock Data

### Before (Mock Data):
```tsx
<Navbar userName="John Student" userRole="Student" />
```

### After (Real Authentication):
```tsx
<Navbar />  {/* Gets user from AuthContext */}
```

All Navbar usages have been updated to use the new system.

---

## Next Steps

1. **Set up PostgreSQL database** (see `DATABASE_SETUP.md`)
2. **Run database schema** (`npm run db:seed`)
3. **Test registration** (create a new account)
4. **Test login** (login with created account)
5. **Verify user info** (check Navbar shows your name)

---

**Last Updated:** February 22, 2026  
**Version:** 1.0.0
