import { NextRequest, NextResponse } from 'next/server';
import {
  getNotificationsByUserId,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '@/app/lib/db-repository';

/**
 * GET /api/notifications
 * Get notifications for the authenticated user
 *
 * Query parameters:
 * - unread: Filter to unread only (true/false)
 */
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

/**
 * PATCH /api/notifications
 * Mark notifications as read
 *
 * Body:
 * - id: Mark specific notification as read
 * - markAll: true to mark all as read
 */
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No user ID in request' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, markAll } = body;

    if (markAll === true) {
      await markAllNotificationsAsRead(userId);
      return NextResponse.json(
        { message: 'All notifications marked as read' },
        { status: 200 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Notification ID or markAll is required' },
        { status: 400 }
      );
    }

    const notification = await markNotificationAsRead(id, userId);

    if (!notification) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Notification marked as read', notification },
      { status: 200 }
    );
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to mark notification as read' },
      { status: 500 }
    );
  }
}
