import { NextRequest, NextResponse } from 'next/server';
import { getAllBooks, getBookById, searchBooks, getBooksByGenre, getFeaturedBooks, getNewAcquisitions } from '@/app/lib/db-repository';

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

/**
 * GET /api/books
 * Get all books with optional filters
 * 
 * Query parameters:
 * - search: Search by title, author, or genre
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
    const genre = searchParams.get('genre');
    const featured = searchParams.get('featured');
    const newAcquisitions = searchParams.get('new');
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    
    if (id) {
      const book = await getBookById(parseInt(id, 10));
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
    
    if (search) {
      books = await searchBooks(search);
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
    // TODO: Implement book creation
    // This would require additional repository function
    
    return NextResponse.json(
      { error: 'Not Implemented', message: 'Book creation not yet implemented' },
      { status: 501 }
    );
    
  } catch (error) {
    console.error('Create book error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to create book' },
      { status: 500 }
    );
  }
}
