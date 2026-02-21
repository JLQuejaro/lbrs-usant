-- ============================================================
-- USANT LBRS - Mock Data Cleanup Script
-- ============================================================
-- PURPOSE: Safely remove mock/test data from production database
-- WARNING: Review each section before executing!
-- BACKUP FIRST: pg_dump -U postgres lbrs_db > backup_YYYY-MM-DD.sql
-- ============================================================

-- ============================================================
-- OPTION 1: Remove specific mock users (by email pattern)
-- ============================================================

-- Delete mock students (john, alice, bob, charlie, diana)
DELETE FROM notifications WHERE user_id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000005'
);

DELETE FROM borrow_records WHERE user_id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000005'
);

DELETE FROM reviews WHERE user_id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000005'
);

DELETE FROM users WHERE user_id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000005'
);

-- Delete mock faculty
DELETE FROM notifications WHERE user_id = '00000000-0000-0000-0000-000000000006';
DELETE FROM reading_lists WHERE faculty_id = '00000000-0000-0000-0000-000000000006';
DELETE FROM users WHERE user_id = '00000000-0000-0000-0000-000000000006';

-- Delete mock staff (librarian)
DELETE FROM users WHERE user_id = '00000000-0000-0000-0000-000000000007';

-- ============================================================
-- OPTION 2: Remove mock account requests
-- ============================================================

DELETE FROM account_requests 
WHERE email LIKE '%@test.com' 
   OR email LIKE 'emily.wilson@usant.edu'
   OR email LIKE 'michael.chen@usant.edu'
   OR email LIKE 'sarah.martinez@usant.edu';

-- ============================================================
-- OPTION 3: Remove mock books (if you want to add real inventory)
-- ============================================================

-- WARNING: This will cascade delete related records
-- DELETE FROM books WHERE book_id IN (1, 2, 3, 4, 8, 9, 19, 21, 22);

-- ============================================================
-- OPTION 4: Remove mock journals
-- ============================================================

-- DELETE FROM journals WHERE journal_id IN (1, 2, 3, 4);

-- ============================================================
-- OPTION 5: Remove mock reading lists
-- ============================================================

-- DELETE FROM reading_lists WHERE reading_list_id IN (1, 2);

-- ============================================================
-- OPTION 6: Remove mock borrow records (keep structure)
-- ============================================================

-- DELETE FROM borrow_records WHERE borrowed_date < '2026-01-01';

-- ============================================================
-- OPTION 7: Remove mock notifications
-- ============================================================

DELETE FROM notifications 
WHERE title IN ('Book Available', 'Return Reminder', 'System Maintenance');

-- ============================================================
-- OPTION 8: Remove mock reviews
-- ============================================================

DELETE FROM reviews 
WHERE user_name IN ('Alice Smith', 'John Student', 'Bob Brown', 'Charlie Davis');

-- ============================================================
-- VERIFICATION: Check what remains
-- ============================================================

-- Count remaining users by role
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;

-- Count pending account requests
SELECT COUNT(*) as pending_requests 
FROM account_requests 
WHERE status = 'pending';

-- Count active borrows
SELECT COUNT(*) as active_borrows 
FROM borrow_records 
WHERE status = 'active';

-- ============================================================
-- END OF CLEANUP SCRIPT
-- ============================================================
