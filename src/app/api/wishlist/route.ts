import { NextRequest, NextResponse } from 'next/server';
import {
  addWishlistItem,
  getBooksByIds,
  getWishlistBookIdsByUserId,
  removeWishlistItem,
  syncWishlistItems,
} from '@/app/lib/db-repository';

function mapBookToUi(book: any) {
  const courses = Array.isArray(book.courses) ? book.courses : [];
  const dateAdded = book.date_added ? new Date(book.date_added).toISOString().split('T')[0] : null;

  return {
    id: book.book_id,
    title: book.title,
    author: book.author,
    genre: book.genre,
    description: book.description,
    pages: book.pages,
    year: book.publication_year,
    stock: (book.available_copies ?? 0) > 0,
    stockQuantity: book.stock_quantity,
    availableCopies: book.available_copies,
    status: book.status,
    location: book.location,
    color: book.color_theme || 'bg-slate-700',
    borrowCount: book.borrow_count ?? 0,
    views: book.views ?? 0,
    featured: book.featured ?? false,
    dateAdded,
    courses,
    rating: book.average_rating ? Number(book.average_rating) : 0,
    reviewCount: book.total_reviews ? Number(book.total_reviews) : 0,
  };
}

function getUserId(request: NextRequest) {
  return request.headers.get('x-user-id');
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No user ID in request' },
        { status: 401 }
      );
    }

    const bookIds = await getWishlistBookIdsByUserId(userId);
    const books = await getBooksByIds(bookIds);

    return NextResponse.json(
      {
        bookIds,
        books: books.map(mapBookToUi),
        count: bookIds.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get wishlist error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to get wishlist' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No user ID in request' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const bookId = Number(body?.bookId);

    if (!Number.isInteger(bookId)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'A valid bookId is required' },
        { status: 400 }
      );
    }

    await addWishlistItem(userId, bookId);
    const bookIds = await getWishlistBookIdsByUserId(userId);

    return NextResponse.json(
      {
        message: 'Wishlist updated',
        bookIds,
        count: bookIds.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add wishlist item error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to add wishlist item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No user ID in request' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const bookId = Number(body?.bookId);

    if (!Number.isInteger(bookId)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'A valid bookId is required' },
        { status: 400 }
      );
    }

    await removeWishlistItem(userId, bookId);
    const bookIds = await getWishlistBookIdsByUserId(userId);

    return NextResponse.json(
      {
        message: 'Wishlist updated',
        bookIds,
        count: bookIds.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Remove wishlist item error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to remove wishlist item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No user ID in request' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const rawBookIds: unknown[] = Array.isArray(body?.bookIds) ? body.bookIds : [];
    const bookIds = rawBookIds
      .map((value: unknown) => Number(value))
      .filter((value): value is number => Number.isInteger(value));

    const syncedBookIds = await syncWishlistItems(userId, bookIds);

    return NextResponse.json(
      {
        message: 'Wishlist synchronized',
        bookIds: syncedBookIds,
        count: syncedBookIds.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Sync wishlist error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to synchronize wishlist' },
      { status: 500 }
    );
  }
}
