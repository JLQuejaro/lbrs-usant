-- Check if isbn column exists and add it if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'books' AND column_name = 'isbn'
    ) THEN
        ALTER TABLE books ADD COLUMN isbn VARCHAR(13) UNIQUE;
        RAISE NOTICE 'Added isbn column to books table';
    ELSE
        RAISE NOTICE 'isbn column already exists';
    END IF;
END $$;

-- Check if cover_url column exists and add it if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'books' AND column_name = 'cover_url'
    ) THEN
        ALTER TABLE books ADD COLUMN cover_url VARCHAR(500);
        RAISE NOTICE 'Added cover_url column to books table';
    ELSE
        RAISE NOTICE 'cover_url column already exists';
    END IF;
END $$;
