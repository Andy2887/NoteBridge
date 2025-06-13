-- NoteBridge Database Cleanup Script (Safe Foreign Key Order)
-- This script deletes all data respecting foreign key constraints

-- Delete in reverse dependency order
-- 1. Delete messages (references chats)
DELETE FROM messages;

-- 2. Delete chats (references users)
DELETE FROM chats;

-- 3. Delete files (references users and lessons)
DELETE FROM files;

-- 4. Delete lessons (references users as teacher)
DELETE FROM lessons;

-- 5. Delete users (no dependencies)
DELETE FROM users;

-- Optional: Reset auto-increment counters
ALTER TABLE messages AUTO_INCREMENT = 1;
ALTER TABLE chats AUTO_INCREMENT = 1;
ALTER TABLE files AUTO_INCREMENT = 1;
ALTER TABLE lessons AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;

-- Verification query
SELECT 
    'users' as table_name, COUNT(*) as remaining_rows FROM users
UNION ALL
SELECT 
    'lessons' as table_name, COUNT(*) as remaining_rows FROM lessons
UNION ALL
SELECT 
    'chats' as table_name, COUNT(*) as remaining_rows FROM chats
UNION ALL
SELECT 
    'messages' as table_name, COUNT(*) as remaining_rows FROM messages
UNION ALL
SELECT 
    'files' as table_name, COUNT(*) as remaining_rows FROM files;