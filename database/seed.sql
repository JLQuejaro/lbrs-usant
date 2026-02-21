-- ============================================================
-- USANT LBRS - Database Seed File
-- ============================================================
-- WARNING: This file contains mock data for development only.
-- DO NOT run in production environments.
-- Backup your database before running this script.
-- ============================================================

-- ============================================================
-- SEED: Admin User (for account approval)
-- ============================================================

INSERT INTO users (user_id, username, email, password_hash, role, user_type_admin, approval_status, is_active)
VALUES 
    ('00000000-0000-0000-0000-000000000008', 'Admin User', 'admin@usant.edu', '$2b$10$placeholder_hash', 'admin', 'System Administrator', 'approved', true);

-- ============================================================
-- SEED: Students
-- ============================================================

INSERT INTO users (user_id, username, email, password_hash, role, user_type_student, course, year_level, approval_status, is_active)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'John Student', 'john@usant.edu', '$2b$10$placeholder_hash', 'student', 'Undergraduate Student', 'Computer Science', '4th Year', 'approved', true),
    ('00000000-0000-0000-0000-000000000002', 'Alice Smith', 'alice@usant.edu', '$2b$10$placeholder_hash', 'student', 'Undergraduate Student', 'Computer Science', '3rd Year', 'approved', true),
    ('00000000-0000-0000-0000-000000000003', 'Bob Brown', 'bob@usant.edu', '$2b$10$placeholder_hash', 'student', 'Graduate Student (Master''s)', 'Information Tech', '2nd Year', 'approved', true),
    ('00000000-0000-0000-0000-000000000004', 'Charlie Davis', 'charlie@usant.edu', '$2b$10$placeholder_hash', 'student', 'Undergraduate Student', 'Computer Science', '2nd Year', 'approved', true),
    ('00000000-0000-0000-0000-000000000005', 'Diana Prince', 'diana@usant.edu', '$2b$10$placeholder_hash', 'student', 'Undergraduate Student', 'Engineering', '3rd Year', 'approved', true);

-- ============================================================
-- SEED: Faculty
-- ============================================================

INSERT INTO users (user_id, username, email, password_hash, role, user_type_faculty, department, approval_status, is_active)
VALUES 
    ('00000000-0000-0000-0000-000000000006', 'Dr. Robert Johnson', 'rob@usant.edu', '$2b$10$placeholder_hash', 'faculty', 'Professor', 'Computer Science', 'approved', true);

-- ============================================================
-- SEED: Staff (Librarian)
-- ============================================================

INSERT INTO users (user_id, username, email, password_hash, role, user_type_staff, approval_status, is_active)
VALUES 
    ('00000000-0000-0000-0000-000000000007', 'Maria Santos', 'maria@usant.edu', '$2b$10$placeholder_hash', 'staff', 'Librarian', 'approved', true);

-- ============================================================
-- SEED: Account Requests (Pending/Approved/Rejected)
-- ============================================================

INSERT INTO account_requests (request_id, full_name, email, requested_role, user_type, course, status, requested_at, id_document)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'Emily Wilson', 'emily.wilson@usant.edu', 'student', 'Undergraduate Student', 'Computer Science', 'pending', '2026-02-20 09:15:00', 'student_id_001.pdf'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Dr. Michael Chen', 'michael.chen@usant.edu', 'faculty', 'Professor', NULL, 'pending', '2026-02-19 14:30:00', 'faculty_credentials_002.pdf'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Sarah Martinez', 'sarah.martinez@usant.edu', 'student', 'Graduate Student (PhD)', 'Engineering', 'pending', '2026-02-18 11:45:00', 'student_id_003.pdf');

INSERT INTO account_requests (request_id, full_name, email, requested_role, user_type, department, status, requested_at, reviewed_by, reviewed_at, review_notes, id_document)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440004', 'Prof. James Anderson', 'james.anderson@usant.edu', 'faculty', 'Lecturer', 'Engineering', 'approved', '2026-02-15 08:00:00', 
     '00000000-0000-0000-0000-000000000008', '2026-02-16 10:30:00', 'Verified faculty credentials. Approved for Engineering department.', 'faculty_credentials_004.pdf'),
    ('550e8400-e29b-41d4-a716-446655440005', 'Invalid User', 'invalid@test.com', 'student', 'Undergraduate Student', NULL, 'rejected', '2026-02-10 16:20:00',
     '00000000-0000-0000-0000-000000000008', '2026-02-11 09:00:00', 'Invalid email domain. Not a USANT affiliated email.', 'invalid_doc_005.pdf');

-- ============================================================
-- SEED: Books
-- ============================================================

INSERT INTO books (book_id, title, author, genre, description, pages, publication_year, stock_quantity, available_copies, status, location, color_theme, borrow_count, views, featured, date_added)
VALUES 
    (1, 'Introduction to Algorithms', 'Thomas H. Cormen', 'Computer Science', 
     'This title covers a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers.', 
     1312, 2009, 3, 2, 'Available', 'Shelf 4B - CS Section', 'bg-red-900', 156, 1200, true, '2023-01-15'),
    
    (2, 'Clean Code', 'Robert C. Martin', 'Software Engineering', 
     'Even bad code can function. But if code isn''t clean, it can bring a development organization to its knees.', 
     464, 2008, 2, 1, 'Available', 'Shelf 4A - SE Section', 'bg-blue-800', 210, 1500, true, '2023-02-20'),
    
    (3, 'The Pragmatic Programmer', 'Andrew Hunt', 'Software Engineering', 
     'The Pragmatic Programmer is one of those rare tech books you''ll read, re-read, and read again over the years.', 
     352, 1999, 2, 0, 'Borrowed', 'Shelf 4A - SE Section', 'bg-slate-700', 145, 980, false, '2023-03-10'),
    
    (4, 'Design Patterns', 'Erich Gamma', 'Computer Science', 
     'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of solutions.', 
     416, 1994, 2, 2, 'Available', 'Shelf 3C - General CS', 'bg-emerald-800', 98, 760, false, '2023-04-05'),
    
    (19, 'Deep Work', 'Cal Newport', 'Productivity', 
     'One of the most valuable skills in our economy is becoming increasingly rare. The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable.', 
     296, 2016, 2, 2, 'Available', 'Shelf 6A - Productivity', 'bg-zinc-700', 85, 640, false, '2025-02-01'),
    
    (21, 'AI: A Modern Approach', 'Stuart Russell', 'Computer Science', 
     'The leading textbook in Artificial Intelligence, used in over 1500 schools in 135 countries.', 
     1136, 2021, 2, 2, 'Available', 'New Arrivals Display', 'bg-indigo-700', 5, 150, false, '2026-02-10'),
    
    (22, 'Modern Operating Systems', 'Andrew Tanenbaum', 'Computer Science', 
     'The authoritative guide to operating systems, covering both principles and practice.', 
     1104, 2022, 2, 2, 'Available', 'New Arrivals Display', 'bg-slate-800', 2, 80, false, '2026-02-15'),
    
    (8, 'Engineering Mechanics', 'J.L. Meriam', 'Engineering', 
     'For more than 60 years, this textbook has been recognized for its accuracy, clarity, and authority.', 
     534, 2015, 2, 2, 'Available', 'Shelf 2A - Engineering', 'bg-stone-700', 45, 320, false, '2023-05-12'),
    
    (9, 'Electric Circuits', 'James W. Nilsson', 'Electronics', 
     'Provides students with a solid foundation of the concepts and methods of circuit analysis.', 
     768, 2014, 2, 2, 'Available', 'Shelf 2B - Electronics', 'bg-yellow-700', 38, 290, false, '2023-06-20');

-- Reset the sequence for books table
SELECT setval('books_book_id_seq', 22, true);

-- ============================================================
-- SEED: Book-Course Associations
-- ============================================================

INSERT INTO book_courses (book_id, course_name)
VALUES 
    (1, 'Computer Science'),
    (2, 'Computer Science'),
    (2, 'Information Tech'),
    (3, 'Computer Science'),
    (3, 'Information Tech'),
    (4, 'Computer Science'),
    (19, 'Computer Science'),
    (19, 'General'),
    (21, 'Computer Science'),
    (22, 'Computer Science'),
    (8, 'Engineering'),
    (9, 'Engineering');

-- ============================================================
-- SEED: Journals
-- ============================================================

INSERT INTO journals (journal_id, title, publisher, subject, impact_factor, access_url, journal_type)
VALUES 
    (1, 'IEEE Transactions on Software Engineering', 'IEEE', 'Computer Science', 9.6, 'https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=32', 'Journal'),
    (2, 'ACM Computing Surveys', 'ACM', 'Computer Science', 14.3, 'https://dl.acm.org/journal/csur', 'Journal'),
    (3, 'Encyclopedia of Computer Science', 'Wiley', 'Computer Science', NULL, 'https://www.wiley.com/encyclopedia-computer-science', 'Reference'),
    (4, 'Nature Electronics', 'Nature', 'Engineering', 33.2, 'https://www.nature.com/natelectron/', 'Journal');

-- Reset the sequence for journals table
SELECT setval('journals_journal_id_seq', 4, true);

-- ============================================================
-- SEED: Reading Lists
-- ============================================================

INSERT INTO reading_lists (reading_list_id, title, faculty_id, description, student_count, is_active)
VALUES 
    (1, 'CS101: Core Fundamentals', '00000000-0000-0000-0000-000000000006', 'Essential reading for introductory computer science courses.', 45, true),
    (2, 'Advanced Software Patterns', '00000000-0000-0000-0000-000000000006', 'Graduate-level reading on software design patterns and architecture.', 28, true);

-- Reset the sequence for reading_lists table
SELECT setval('reading_lists_reading_list_id_seq', 2, true);

-- ============================================================
-- SEED: Reading List Books
-- ============================================================

INSERT INTO reading_list_books (reading_list_id, book_id)
VALUES 
    (1, 1),
    (1, 2),
    (1, 4),
    (2, 4),
    (2, 2);

-- ============================================================
-- SEED: Borrow Records (Mock History)
-- ============================================================

INSERT INTO borrow_records (user_id, book_id, borrowed_date, due_date, status)
VALUES 
    ('00000000-0000-0000-0000-000000000002', 1, '2025-01-01', '2025-01-08', 'returned'),
    ('00000000-0000-0000-0000-000000000002', 2, '2025-01-05', '2025-01-12', 'returned'),
    ('00000000-0000-0000-0000-000000000001', 3, '2026-02-15', '2026-02-22', 'active');

-- ============================================================
-- SEED: Notifications
-- ============================================================

INSERT INTO notifications (user_id, title, message, notification_type, book_id, is_read)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Book Available', 'The book "The Pragmatic Programmer" is now available for borrowing.', 'availability', 3, false),
    ('00000000-0000-0000-0000-000000000001', 'Return Reminder', 'Your borrowed book "The Pragmatic Programmer" is due in 3 days.', 'reminder', 3, false),
    ('00000000-0000-0000-0000-000000000002', 'System Maintenance', 'The library system will undergo maintenance on Feb 25, 2026.', 'system', NULL, true);

-- ============================================================
-- SEED: Reviews
-- ============================================================

INSERT INTO reviews (book_id, user_id, user_name, rating, comment)
VALUES 
    (1, '00000000-0000-0000-0000-000000000002', 'Alice Smith', 5.00, 'Essential for every CS student. Comprehensive and well-explained.'),
    (1, '00000000-0000-0000-0000-000000000003', 'Bob Brown', 4.50, 'Great reference book, though quite dense.'),
    (2, '00000000-0000-0000-0000-000000000001', 'John Student', 5.00, 'Changed the way I write code. Highly recommended!'),
    (4, '00000000-0000-0000-0000-000000000004', 'Charlie Davis', 4.00, 'Classic design patterns. Still relevant today.');

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Run these to verify data was inserted correctly:

-- SELECT COUNT(*) AS total_users FROM users;
-- SELECT COUNT(*) AS total_books FROM books;
-- SELECT COUNT(*) AS total_borrows FROM borrow_records;
-- SELECT COUNT(*) AS pending_requests FROM account_requests WHERE status = 'pending';

-- ============================================================
-- END OF SEED FILE
-- ============================================================
