CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE VIEW "active_borrows_view" AS
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
FROM "borrow_records" br
JOIN "users" u ON br.user_id = u.user_id
JOIN "books" b ON br.book_id = b.book_id
WHERE br.status = 'active';

CREATE OR REPLACE VIEW "book_statistics_view" AS
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
FROM "books" b
LEFT JOIN "borrow_records" br ON b.book_id = br.book_id
LEFT JOIN "reviews" r ON b.book_id = r.book_id
GROUP BY
    b.book_id,
    b.title,
    b.author,
    b.genre,
    b.stock_quantity,
    b.available_copies,
    b.borrow_count,
    b.views;
