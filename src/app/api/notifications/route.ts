import { NextRequest, NextResponse } from 'next/server';
import { getNotificationsByUserId } from '@/app/lib/db-repository';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No user ID in request' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread') === 'true';

    const notifications = await getNotificationsByUserId(userId, unreadOnly);
    const mapped = notifications.map(notification => ({
      id: notification.notification_id,
      userId: notification.user_id,
      title: notification.title,
      message: notification.message,
      type: notification.notification_type,
      timestamp: notification.created_at,
      read: notification.is_read,
      bookId: notification.book_id,
    }));

    return NextResponse.json(
      { notifications: mapped, count: mapped.length },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to get notifications' },
      { status: 500 }
    );
  }
}
