import { NextRequest, NextResponse } from 'next/server';
import { getAllBooks, getBookById, searchBooks, getBooksByGenre, getFeaturedBooks, getNewAcquisitions, incrementBookViews } from '@/app/lib/db-repository';

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
    
    const search = searchParams.get('search');
    const genre = searchParams.get('genre');
    const featured = searchParams.get('featured');
    const newAcquisitions = searchParams.get('new');
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    
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
      { books, count: books.length },
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
