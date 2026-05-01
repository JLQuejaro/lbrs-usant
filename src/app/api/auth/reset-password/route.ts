import { NextRequest, NextResponse } from 'next/server';
import { getPasswordResetToken, deletePasswordResetToken, updateUserPassword } from '@/app/lib/db-repository';
import { hashPassword } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const resetToken = await getPasswordResetToken(token);

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    if (new Date() > resetToken.expiresAt) {
      await deletePasswordResetToken(token);
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    await updateUserPassword(resetToken.userId, passwordHash);
    await deletePasswordResetToken(token);

    return NextResponse.json(
      { message: 'Password reset successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
