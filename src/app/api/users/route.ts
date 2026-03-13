import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers } from '@/app/lib/db-repository';

export async function GET(request: NextRequest) {
  try {
    const role = request.headers.get('x-user-role');
    if (role !== 'admin' && role !== 'staff') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const users = await getAllUsers();
    const sanitized = users.map(user => {
      const { password_hash, ...safe } = user as any;
      return {
        id: user.user_id,
        name: user.username,
        email: user.email,
        role: user.role,
        userType: user.user_type_student || user.user_type_faculty || user.user_type_staff || user.user_type_admin,
        course: user.course,
        department: user.department,
        approvalStatus: user.approval_status,
        isActive: user.is_active,
        createdAt: user.created_at,
        ...safe,
      };
    });

    return NextResponse.json(
      { users: sanitized, count: sanitized.length },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to get users' },
      { status: 500 }
    );
  }
}
