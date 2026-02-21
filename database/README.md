# USANT LBRS - PostgreSQL Database Setup Guide

## 📋 Prerequisites

- PostgreSQL 14 or higher
- Node.js 18+
- npm or yarn

## 🚀 Quick Start

### 1. Install PostgreSQL

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Follow the installation wizard
- Remember your postgres password

**Verify installation:**
```bash
psql --version
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE lbrs_db;

# Connect to the new database
\c lbrs_db

# Run the schema
\i database/schema.sql

# (Optional) Seed mock data for development
\i database/seed.sql

# Exit
\q
```

### 3. Install Node.js PostgreSQL Client

```bash
npm install pg
npm install @types/pg -D
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=lbrs_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password_here

# Production (optional)
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/lbrs_db
```

## 📁 Database Files

| File | Purpose |
|------|---------|
| `schema.sql` | Database schema (tables, indexes, triggers) |
| `seed.sql` | Mock data for development/testing |
| `cleanup_mock_data.sql` | Safely remove mock data before production |

## 🔧 Common Operations

### Backup Database
```bash
pg_dump -U postgres lbrs_db > backup_$(date +%Y-%m-%d).sql
```

### Restore Database
```bash
psql -U postgres lbrs_db < backup_2026-02-22.sql
```

### Reset Database (Development Only)
```bash
# Drop and recreate
psql -U postgres -c "DROP DATABASE IF EXISTS lbrs_db;"
psql -U postgres -c "CREATE DATABASE lbrs_db;"

# Rebuild schema and seed
psql -U postgres lbrs_db < database/schema.sql
psql -U postgres lbrs_db < database/seed.sql
```

### Remove Mock Data (Before Production)
```bash
psql -U postgres lbrs_db < database/cleanup_mock_data.sql
```

## 📊 Database Schema Overview

### Core Tables

```
users
├── user_id (UUID, PK)
├── username, email, password_hash
├── role (student/faculty/staff/admin)
├── user_type_* (role-specific)
├── course/department
└── approval_status

books
├── book_id (SERIAL, PK)
├── title, author, genre
├── stock_quantity, available_copies
├── location, status
└── borrow_count, views

borrow_records
├── borrow_id (SERIAL, PK)
├── user_id (FK → users)
├── book_id (FK → books)
├── borrowed_date, due_date, returned_date
└── status

reading_lists
├── reading_list_id (SERIAL, PK)
├── faculty_id (FK → users)
├── title, description
└── student_count

reviews
├── review_id (SERIAL, PK)
├── book_id (FK → books)
├── user_id (FK → users)
├── rating (0-5), comment
└── created_at
```

## 🔐 Security Best Practices

1. **Never commit passwords**: Use environment variables
2. **Use parameterized queries**: Prevent SQL injection
3. **Hash passwords**: Use bcrypt or similar
4. **Limit database user permissions**: Principle of least privilege
5. **Regular backups**: Automate daily backups

## 📝 Default Login Credentials (Development Only)

| Role | Email | Password |
|------|-------|----------|
| Student | john@usant.edu | (set during registration) |
| Faculty | rob@usant.edu | (set during registration) |
| Librarian | maria@usant.edu | (set during registration) |
| Admin | admin@usant.edu | (set during registration) |

**⚠️ IMPORTANT**: Change all default passwords before production!

## 🔍 Useful Queries

### View all users
```sql
SELECT user_id, username, email, role, approval_status, is_active
FROM users
ORDER BY created_at DESC;
```

### View active borrows
```sql
SELECT u.username, b.title, br.borrowed_date, br.due_date
FROM active_borrows_view
ORDER BY br.due_date;
```

### View pending account requests
```sql
SELECT request_id, full_name, email, requested_role, course, department, requested_at
FROM account_requests
WHERE status = 'pending'
ORDER BY requested_at DESC;
```

### Book statistics
```sql
SELECT * FROM book_statistics_view
ORDER BY borrow_count DESC
LIMIT 10;
```

## 🐛 Troubleshooting

### Connection refused
```bash
# Check if PostgreSQL is running
pg_ctl status

# Start PostgreSQL (Windows)
net start postgresql-x64-14
```

### Authentication failed
```bash
# Reset postgres password (Windows)
# Run as Administrator:
psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'new_password';"
```

### Database already exists
```bash
psql -U postgres -c "DROP DATABASE IF EXISTS lbrs_db;"
```

## 📞 Support

For database-related issues:
1. Check PostgreSQL logs: `C:\Program Files\PostgreSQL\14\data\log`
2. Verify connection string in `.env.local`
3. Ensure PostgreSQL service is running

---

**Last Updated**: February 22, 2026
**Database Version**: 1.0.0
