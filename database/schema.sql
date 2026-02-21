-- ============================================================
-- USANT Library Book Recommendation System (LBRS)
-- PostgreSQL Database Schema
-- ============================================================
-- Backup Reminder: Always backup before making schema changes
-- pg_dump -U postgres lbrs_db > backup_YYYY-MM-DD.sql
-- ============================================================

-- Enable UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE user_role AS ENUM ('student', 'faculty', 'staff', 'admin');

CREATE TYPE user_type_student AS ENUM (
    'Undergraduate Student',
    'Graduate Student (Master''s)',
    'Graduate Student (PhD)',
    'Distance/Online Learner'
);

CREATE TYPE user_type_faculty AS ENUM (
    'Professor',
    'Lecturer',
    'Researcher'
);

CREATE TYPE user_type_staff AS ENUM (
    'Administrative Staff',
    'Technical/Support Staff',
    'Librarian'
);

CREATE TYPE user_type_admin AS ENUM (
    'System Administrator'
);

CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TYPE notification_type AS ENUM ('availability', 'reminder', 'system');

CREATE TYPE journal_type AS ENUM ('Journal', 'Reference');

-- ============================================================
-- TABLE: users
-- ============================================================

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    
    -- Role-specific fields (nullable based on role)
    user_type_student user_type_student,
    user_type_faculty user_type_faculty,
    user_type_staff user_type_staff,
    user_type_admin user_type_admin,
    
    -- Student-specific
    course VARCHAR(100),
    year_level VARCHAR(20),
    
    -- Faculty-specific
    department VARCHAR(100),
    
    -- Account management
    approval_status approval_status DEFAULT 'pending',
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    
    -- Admin review fields
    reviewed_by UUID REFERENCES users(user_id),
    reviewed_at TIMESTAMP,
    review_notes TEXT
);

-- Indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_approval_status ON users(approval_status);
CREATE INDEX idx_users_course ON users(course);
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ============================================================
-- TABLE: account_requests
-- ============================================================

CREATE TABLE account_requests (
    request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    requested_role user_role NOT NULL,
    user_type VARCHAR(50) NOT NULL,
    
    -- Role-specific fields
    course VARCHAR(100),
    department VARCHAR(100),
    year_level VARCHAR(20),
    
    -- Document verification
    id_document_path VARCHAR(255),
    
    -- Status
    status approval_status DEFAULT 'pending',
    
    -- Timestamps
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Admin review fields
    reviewed_by UUID REFERENCES users(user_id),
    reviewed_at TIMESTAMP,
    review_notes TEXT
);

-- Indexes for account_requests
CREATE INDEX idx_account_requests_email ON account_requests(email);
CREATE INDEX idx_account_requests_status ON account_requests(status);
CREATE INDEX idx_account_requests_requested_at ON account_requests(requested_at);

-- ============================================================
-- TABLE: books
-- ============================================================

CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(150) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    description TEXT,
    pages INTEGER,
    publication_year INTEGER,
    
    -- Inventory
    stock_quantity INTEGER DEFAULT 1,
    available_copies INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'Available',
    
    -- Physical location
    location VARCHAR(100),
    color_theme VARCHAR(30),
    
    -- Analytics
    borrow_count INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    
    -- Timestamps
    date_added DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for books table
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_genre ON books(genre);
CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_books_featured ON books(featured);
CREATE INDEX idx_books_date_added ON books(date_added);

-- ============================================================
-- TABLE: book_courses (Junction table for books and courses)
-- ============================================================

CREATE TABLE book_courses (
    book_id INTEGER REFERENCES books(book_id) ON DELETE CASCADE,
    course_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (book_id, course_name)
);

CREATE INDEX idx_book_courses_course_name ON book_courses(course_name);

-- ============================================================
-- TABLE: journals
-- ============================================================

CREATE TABLE journals (
    journal_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publisher VARCHAR(100) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    impact_factor DECIMAL(4, 2),
    access_url VARCHAR(500),
    journal_type journal_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for journals
CREATE INDEX idx_journals_subject ON journals(subject);
CREATE INDEX idx_journals_type ON journals(journal_type);

-- ============================================================
-- TABLE: reading_lists
-- ============================================================

CREATE TABLE reading_lists (
    reading_list_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    faculty_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    description TEXT,
    student_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for reading_lists
CREATE INDEX idx_reading_lists_faculty_id ON reading_lists(faculty_id);
CREATE INDEX idx_reading_lists_is_active ON reading_lists(is_active);

-- ============================================================
-- TABLE: reading_list_books (Junction table)
-- ============================================================

CREATE TABLE reading_list_books (
    reading_list_id INTEGER REFERENCES reading_lists(reading_list_id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES books(book_id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (reading_list_id, book_id)
);

CREATE INDEX idx_reading_list_books_book_id ON reading_list_books(book_id);

-- ============================================================
-- TABLE: borrow_records
-- ============================================================

CREATE TABLE borrow_records (
    borrow_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES books(book_id) ON DELETE CASCADE,
    borrowed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    returned_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for borrow_records
CREATE INDEX idx_borrow_records_user_id ON borrow_records(user_id);
CREATE INDEX idx_borrow_records_book_id ON borrow_records(book_id);
CREATE INDEX idx_borrow_records_status ON borrow_records(status);
CREATE INDEX idx_borrow_records_due_date ON borrow_records(due_date);
CREATE INDEX idx_borrow_records_borrowed_date ON borrow_records(borrowed_date);

-- Constraint: Ensure due_date is after borrowed_date
ALTER TABLE borrow_records ADD CONSTRAINT chk_dates CHECK (due_date > borrowed_date);

-- ============================================================
-- TABLE: notifications
-- ============================================================

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    notification_type notification_type NOT NULL,
    book_id INTEGER REFERENCES books(book_id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(notification_type);

-- ============================================================
-- TABLE: reviews
-- ============================================================

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(book_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    user_name VARCHAR(100) NOT NULL,
    rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for reviews
CREATE INDEX idx_reviews_book_id ON reviews(book_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Constraint: One review per user per book
CREATE UNIQUE INDEX idx_unique_user_book_review ON reviews(book_id, user_id);

-- ============================================================
-- TRIGGERS AND FUNCTIONS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to books table
CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON books
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to reading_lists table
CREATE TRIGGER update_reading_lists_updated_at
    BEFORE UPDATE ON reading_lists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update book stock when borrowed
CREATE OR REPLACE FUNCTION update_book_stock_on_borrow()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE books 
    SET available_copies = available_copies - 1,
        status = CASE WHEN available_copies - 1 = 0 THEN 'Borrowed' ELSE status END
    WHERE book_id = NEW.book_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update book stock when returned
CREATE OR REPLACE FUNCTION update_book_stock_on_return()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE books 
    SET available_copies = available_copies + 1,
        status = 'Available',
        borrow_count = borrow_count + 1
    WHERE book_id = OLD.book_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- VIEWS
-- ============================================================

-- View: Active borrows with user and book details
CREATE VIEW active_borrows_view AS
SELECT 
    br.borrow_id,
    br.user_id,
    u.username,
    u.email,
    u.role,
    br.book_id,
    b.title AS book_title,
    b.author,
    br.borrowed_date,
    br.due_date,
    br.status
FROM borrow_records br
JOIN users u ON br.user_id = u.user_id
JOIN books b ON br.book_id = b.book_id
WHERE br.status = 'active';

-- View: Book statistics
CREATE VIEW book_statistics_view AS
SELECT 
    b.book_id,
    b.title,
    b.author,
    b.genre,
    b.stock_quantity,
    b.available_copies,
    b.borrow_count,
    b.views,
    COUNT(DISTINCT br.borrow_id) AS total_borrows,
    COUNT(DISTINCT r.review_id) AS total_reviews,
    AVG(r.rating) AS average_rating
FROM books b
LEFT JOIN borrow_records br ON b.book_id = br.book_id
LEFT JOIN reviews r ON b.book_id = r.book_id
GROUP BY b.book_id, b.title, b.author, b.genre, b.stock_quantity, b.available_copies, b.borrow_count, b.views;

-- ============================================================
-- INITIAL DATA (Optional - for testing)
-- ============================================================

-- Note: Mock data insertion is handled separately in seed.sql
-- Run seed.sql only in development environments

-- ============================================================
-- END OF SCHEMA
-- ============================================================
