import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import {
  type Book as RepositoryBook,
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  getBooksByCourse,
  getBooksByGenre,
  getFeaturedBooks,
  getNewAcquisitions,
  searchBooks,
  updateBook,
  updateBookFeatured,
} from '@/app/lib/db-repository';

function mapBookToUi(book: RepositoryBook) {
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
    isbn: book.isbn,
    coverUrl: book.cover_url,
  };
}

function hasInventoryAccess(request: NextRequest) {
  const role = request.headers.get('x-user-role');
  return role === 'admin' || role === 'staff';
}

function getBookId(request: NextRequest, fallbackId?: unknown) {
  const { searchParams } = new URL(request.url);
  const rawValue = searchParams.get('id') ?? fallbackId;
  return typeof rawValue === 'string' && rawValue.trim() ? rawValue.trim() : null;
}

/**
 * GET /api/books
 * Get all books with optional filters
 *
 * Query parameters:
 * - search: Search by title, author, or genre
 * - course: Filter by course
 * - genre: Filter by genre
 * - featured: Get only featured books (true/false)
 * - new: Get new acquisitions (true/false)
 * - limit: Limit number of results (default: 100)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get('id');
    const search = searchParams.get('search');
    const course = searchParams.get('course');
    const genre = searchParams.get('genre');
    const featured = searchParams.get('featured');
    const newAcquisitions = searchParams.get('new');
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    if (id) {
      const book = await getBookById(id);
      if (!book) {
        return NextResponse.json(
          { error: 'Not Found', message: 'Book not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { book: mapBookToUi(book) },
        { status: 200 }
      );
    }

    let books;

    if (course) {
      books = await getBooksByCourse(course);
    } else if (search) {
      books = await searchBooks(search, course || undefined);
    } else if (genre) {
      books = await getBooksByGenre(genre);
    } else if (featured === 'true') {
      books = await getFeaturedBooks();
    } else if (newAcquisitions === 'true') {
      books = await getNewAcquisitions(limit);
    } else {
      books = await getAllBooks(limit);
    }

    return NextResponse.json(
      { books: books.map(mapBookToUi), count: books.length },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get books error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to get books' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/books
 * Create a new book (Admin/Librarian only)
 */
export async function POST(request: NextRequest) {
  try {
    if (!hasInventoryAccess(request)) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Admin or staff access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const title = typeof body?.title === 'string' ? body.title.trim() : '';
    const author = typeof body?.author === 'string' ? body.author.trim() : '';
    const genre = typeof body?.genre === 'string' ? body.genre.trim() : '';
    const rawPublicationYear = body?.publicationYear ?? body?.year;
    const publicationYear =
      rawPublicationYear === undefined || rawPublicationYear === null || rawPublicationYear === ''
        ? null
        : Number(rawPublicationYear);

    if (!title || !author || !genre) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'title, author, and genre are required' },
        { status: 400 }
      );
    }

    if (publicationYear !== null && !Number.isInteger(publicationYear)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'publicationYear must be a whole number' },
        { status: 400 }
      );
    }

    const stockQuantity = Number.isInteger(Number(body?.stockQuantity))
      ? Number(body.stockQuantity)
      : 1;
    const availableCopies = body?.availableCopies !== undefined
      ? Number(body.availableCopies)
      : body?.stock === false
        ? 0
        : stockQuantity;

    const book = await createBook({
      title,
      author,
      genre,
      publication_year: publicationYear,
      description: typeof body?.description === 'string' ? body.description.trim() : null,
      pages: Number.isInteger(Number(body?.pages)) ? Number(body.pages) : null,
      stock_quantity: stockQuantity,
      available_copies: availableCopies,
      status: typeof body?.status === 'string' ? body.status : undefined,
      location: typeof body?.location === 'string' ? body.location.trim() : null,
      color_theme: typeof body?.colorTheme === 'string'
        ? body.colorTheme
        : typeof body?.color === 'string'
          ? body.color
          : null,
      isbn: typeof body?.isbn === 'string' ? body.isbn.trim() : null,
      cover_url: typeof body?.coverUrl === 'string' ? body.coverUrl.trim() : null,
      featured: Boolean(body?.featured),
      courses: Array.isArray(body?.courses) ? body.courses.map((course: unknown) => String(course)) : [],
    });

    return NextResponse.json(
      {
        message: 'Book created successfully',
        book: mapBookToUi(book),
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create book error:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        message: error instanceof Error ? error.message : 'Failed to create book',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/books
 * Update book metadata (featured status or full book details)
 */
export async function PATCH(request: NextRequest) {
  try {
    if (!hasInventoryAccess(request)) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Admin or staff access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const bookId = getBookId(request, body?.id);

    if (bookId === null) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'A valid book id is required' },
        { status: 400 }
      );
    }

    // If only featured is provided, use the simple update
    if (typeof body?.featured === 'boolean' && Object.keys(body).length <= 2) {
      const book = await updateBookFeatured(bookId, body.featured);
      return NextResponse.json(
        {
          message: 'Book updated successfully',
          book: mapBookToUi(book),
        },
        { status: 200 }
      );
    }

    // Otherwise, perform full update
    const updateData: {
      title?: string;
      author?: string;
      genre?: string;
      description?: string | null;
      pages?: number | null;
      totalCopies?: number;
      availableCopies?: number;
      isbn?: string | null;
      cover_url?: string | null;
      courses?: string[];
    } = {};

    if (typeof body?.title === 'string' && body.title.trim()) {
      updateData.title = body.title;
    }
    if (typeof body?.author === 'string' && body.author.trim()) {
      updateData.author = body.author;
    }
    if (typeof body?.genre === 'string' && body.genre.trim()) {
      updateData.genre = body.genre;
    }
    if (body?.description !== undefined) {
      updateData.description = typeof body.description === 'string' ? body.description.trim() : null;
    }
    if (body?.pages !== undefined) {
      updateData.pages = Number.isInteger(Number(body.pages)) ? Number(body.pages) : null;
    }
    if (body?.totalCopies !== undefined) {
      updateData.totalCopies = Number(body.totalCopies);
    }
    if (body?.availableCopies !== undefined) {
      updateData.availableCopies = Number(body.availableCopies);
    }
    if (body?.isbn !== undefined) {
      updateData.isbn = typeof body.isbn === 'string' ? body.isbn.trim() : null;
    }
    if (body?.coverUrl !== undefined) {
      updateData.cover_url = typeof body.coverUrl === 'string' ? body.coverUrl.trim() : null;
    }
    if (Array.isArray(body?.courses)) {
      updateData.courses = body.courses.map((course: unknown) => String(course));
    }

    const book = await updateBook(bookId, updateData);

    return NextResponse.json(
      {
        message: 'Book updated successfully',
        book: mapBookToUi(book),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update book error:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Not Found', message: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to update book' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/books
 * Delete a book
 */
export async function DELETE(request: NextRequest) {
  try {
    if (!hasInventoryAccess(request)) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Admin or staff access required' },
        { status: 403 }
      );
    }

    const bookId = getBookId(request);

    if (bookId === null) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'A valid book id is required' },
        { status: 400 }
      );
    }

    const deleted = await deleteBook(bookId);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Book deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete book error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to delete book' },
      { status: 500 }
    );
  }
}
