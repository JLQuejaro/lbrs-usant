import pool from './db';
import { QueryResult } from 'pg';

// ============================================================
// TYPES
// ============================================================

export interface User {
  user_id: string;
  username: string;
  email: string;
  role: 'student' | 'faculty' | 'staff' | 'admin';
  user_type_student?: string;
  user_type_faculty?: string;
  user_type_staff?: string;
  user_type_admin?: string;
  course?: string;
  department?: string;
  year_level?: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  created_at: Date;
}

export interface Book {
  book_id: number;
  title: string;
  author: string;
  genre: string;
  description?: string;
  pages?: number;
  publication_year?: number;
  stock_quantity: number;
  available_copies: number;
  status: string;
  location?: string;
  borrow_count: number;
  views: number;
  featured: boolean;
}

export interface BorrowRecord {
  borrow_id: number;
  user_id: string;
  book_id: number;
  borrowed_date: Date;
  due_date: Date;
  returned_date?: Date;
  status: string;
}

export interface AccountRequest {
  request_id: string;
  full_name: string;
  email: string;
  requested_role: string;
  user_type: string;
  course?: string;
  department?: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: Date;
}

// ============================================================
// USER REPOSITORY
// ============================================================

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

export async function getUserById(userId: string): Promise<User | null> {
  const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
  return result.rows[0] || null;
}

export async function createUser(userData: Partial<User> & { password_hash: string }): Promise<User> {
  const {
    username,
    email,
    password_hash,
    role,
    user_type_student,
    user_type_faculty,
    user_type_staff,
    user_type_admin,
    course,
    department,
    year_level,
  } = userData;

  const result = await pool.query(
    `INSERT INTO users (
      username, email, password_hash, role, 
      user_type_student, user_type_faculty, user_type_staff, user_type_admin,
      course, department, year_level, approval_status, is_active
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'approved', true)
    RETURNING *`,
    [
      username,
      email,
      password_hash,
      role,
      user_type_student || null,
      user_type_faculty || null,
      user_type_staff || null,
      user_type_admin || null,
      course || null,
      department || null,
      year_level || null,
    ]
  );

  return result.rows[0];
}

export async function updateUserApprovalStatus(
  userId: string,
  status: 'pending' | 'approved' | 'rejected',
  reviewedBy: string,
  reviewNotes?: string
): Promise<User | null> {
  const result = await pool.query(
    `UPDATE users 
     SET approval_status = $1, reviewed_by = $2, reviewed_at = CURRENT_TIMESTAMP, review_notes = $3
     WHERE user_id = $4
     RETURNING *`,
    [status, reviewedBy, reviewNotes, userId]
  );
  return result.rows[0] || null;
}

export async function getAllUsers(): Promise<User[]> {
  const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
  return result.rows;
}

// ============================================================
// BOOK REPOSITORY
// ============================================================

export async function getAllBooks(limit = 100): Promise<Book[]> {
  const result = await pool.query('SELECT * FROM books ORDER BY title LIMIT $1', [limit]);
  return result.rows;
}

export async function getBookById(bookId: number): Promise<Book | null> {
  const result = await pool.query('SELECT * FROM books WHERE book_id = $1', [bookId]);
  return result.rows[0] || null;
}

export async function searchBooks(searchTerm: string): Promise<Book[]> {
  const result = await pool.query(
    `SELECT * FROM books 
     WHERE title ILIKE $1 OR author ILIKE $1 OR genre ILIKE $1
     ORDER BY title`,
    [`%${searchTerm}%`]
  );
  return result.rows;
}

export async function getBooksByGenre(genre: string): Promise<Book[]> {
  const result = await pool.query('SELECT * FROM books WHERE genre = $1 ORDER BY title', [genre]);
  return result.rows;
}

export async function getFeaturedBooks(): Promise<Book[]> {
  const result = await pool.query('SELECT * FROM books WHERE featured = true ORDER BY title');
  return result.rows;
}

export async function getNewAcquisitions(limit = 10): Promise<Book[]> {
  const result = await pool.query(
    'SELECT * FROM books ORDER BY date_added DESC LIMIT $1',
    [limit]
  );
  return result.rows;
}

export async function incrementBookViews(bookId: number): Promise<void> {
  await pool.query('UPDATE books SET views = views + 1 WHERE book_id = $1', [bookId]);
}

// ============================================================
// BORROW RECORD REPOSITORY
// ============================================================

export async function borrowBook(
  userId: string,
  bookId: number,
  dueDate: Date
): Promise<BorrowRecord> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create borrow record
    const borrowResult = await client.query(
      `INSERT INTO borrow_records (user_id, book_id, due_date, status)
       VALUES ($1, $2, $3, 'active')
       RETURNING *`,
      [userId, bookId, dueDate]
    );

    // Update book availability
    await client.query(
      `UPDATE books 
       SET available_copies = available_copies - 1,
           status = CASE WHEN available_copies - 1 = 0 THEN 'Borrowed' ELSE status END
       WHERE book_id = $1`,
      [bookId]
    );

    await client.query('COMMIT');
    return borrowResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function returnBook(borrowId: number): Promise<BorrowRecord | null> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get the book_id from the borrow record
    const borrowResult = await client.query(
      'SELECT book_id FROM borrow_records WHERE borrow_id = $1',
      [borrowId]
    );

    if (borrowResult.rows.length === 0) {
      throw new Error('Borrow record not found');
    }

    const bookId = borrowResult.rows[0].book_id;

    // Update borrow record
    const updateResult = await client.query(
      `UPDATE borrow_records 
       SET returned_date = CURRENT_TIMESTAMP, status = 'returned'
       WHERE borrow_id = $1
       RETURNING *`,
      [borrowId]
    );

    // Update book availability and increment borrow count
    await client.query(
      `UPDATE books 
       SET available_copies = available_copies + 1,
           status = 'Available',
           borrow_count = borrow_count + 1
       WHERE book_id = $1`,
      [bookId]
    );

    await client.query('COMMIT');
    return updateResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release;
  }
}

export async function getActiveBorrowsByUserId(userId: string): Promise<BorrowRecord[]> {
  const result = await pool.query(
    `SELECT br.*, b.title, b.author 
     FROM borrow_records br
     JOIN books b ON br.book_id = b.book_id
     WHERE br.user_id = $1 AND br.status = 'active'
     ORDER BY br.due_date`,
    [userId]
  );
  return result.rows;
}

export async function getBorrowHistoryByUserId(userId: string): Promise<BorrowRecord[]> {
  const result = await pool.query(
    `SELECT br.*, b.title, b.author 
     FROM borrow_records br
     JOIN books b ON br.book_id = b.book_id
     WHERE br.user_id = $1
     ORDER BY br.borrowed_date DESC`,
    [userId]
  );
  return result.rows;
}

export async function getOverdueBorrows(): Promise<BorrowRecord[]> {
  const result = await pool.query(
    `SELECT br.*, b.title, b.author, u.username, u.email
     FROM borrow_records br
     JOIN books b ON br.book_id = b.book_id
     JOIN users u ON br.user_id = u.user_id
     WHERE br.status = 'active' AND br.due_date < CURRENT_TIMESTAMP
     ORDER BY br.due_date`
  );
  return result.rows;
}

// ============================================================
// ACCOUNT REQUEST REPOSITORY
// ============================================================

export async function createAccountRequest(
  requestData: Partial<AccountRequest> & { full_name: string; email: string; requested_role: string; user_type: string }
): Promise<AccountRequest> {
  const {
    full_name,
    email,
    requested_role,
    user_type,
    course,
    department,
    id_document,
  } = requestData;

  const result = await pool.query(
    `INSERT INTO account_requests (
      full_name, email, requested_role, user_type, course, department, id_document_path
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [full_name, email, requested_role, user_type, course || null, department || null, id_document || null]
  );

  return result.rows[0];
}

export async function getAllAccountRequests(): Promise<AccountRequest[]> {
  const result = await pool.query('SELECT * FROM account_requests ORDER BY requested_at DESC');
  return result.rows;
}

export async function getPendingAccountRequests(): Promise<AccountRequest[]> {
  const result = await pool.query(
    "SELECT * FROM account_requests WHERE status = 'pending' ORDER BY requested_at DESC"
  );
  return result.rows;
}

export async function approveAccountRequest(
  requestId: string,
  reviewedBy: string,
  reviewNotes?: string
): Promise<AccountRequest | null> {
  const result = await pool.query(
    `UPDATE account_requests 
     SET status = 'approved', reviewed_by = $1, reviewed_at = CURRENT_TIMESTAMP, review_notes = $2
     WHERE request_id = $3
     RETURNING *`,
    [reviewedBy, reviewNotes, requestId]
  );
  return result.rows[0] || null;
}

export async function rejectAccountRequest(
  requestId: string,
  reviewedBy: string,
  reviewNotes: string
): Promise<AccountRequest | null> {
  const result = await pool.query(
    `UPDATE account_requests 
     SET status = 'rejected', reviewed_by = $1, reviewed_at = CURRENT_TIMESTAMP, review_notes = $2
     WHERE request_id = $3
     RETURNING *`,
    [reviewedBy, reviewNotes, requestId]
  );
  return result.rows[0] || null;
}

// ============================================================
// STATISTICS
// ============================================================

export async function getDatabaseStatistics() {
  const [users, books, activeBorrows, pendingRequests] = await Promise.all([
    pool.query('SELECT COUNT(*) as count FROM users'),
    pool.query('SELECT COUNT(*) as count FROM books'),
    pool.query("SELECT COUNT(*) as count FROM borrow_records WHERE status = 'active'"),
    pool.query("SELECT COUNT(*) as count FROM account_requests WHERE status = 'pending'"),
  ]);

  return {
    totalUsers: parseInt(users.rows[0].count, 10),
    totalBooks: parseInt(books.rows[0].count, 10),
    activeBorrows: parseInt(activeBorrows.rows[0].count, 10),
    pendingRequests: parseInt(pendingRequests.rows[0].count, 10),
  };
}
