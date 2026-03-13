import { NextRequest, NextResponse } from 'next/server';
import { getReviewsByBookId } from '@/app/lib/db-repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookIdParam = searchParams.get('bookId');

    if (!bookIdParam) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'bookId is required' },
        { status: 400 }
      );
    }

    const bookId = parseInt(bookIdParam, 10);
    const reviews = await getReviewsByBookId(bookId);
    const mapped = reviews.map(review => ({
      id: review.review_id,
      bookId: review.book_id,
      userId: review.user_id,
      userName: review.user_name,
      rating: Number(review.rating),
      comment: review.comment,
      timestamp: review.created_at,
    }));

    return NextResponse.json(
      { reviews: mapped, count: mapped.length },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to get reviews' },
      { status: 500 }
    );
  }
}
