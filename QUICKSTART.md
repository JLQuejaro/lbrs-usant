# 🚀 Quick Start Guide - USANT LBRS Database & Authentication

## Prerequisites

- PostgreSQL 14+ installed and running
- Node.js 18+ installed
- npm installed

---

## Step 1: Set Up PostgreSQL Database

### Create the database:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE lbrs_db;

# Connect to the new database
\c lbrs_db

# Exit psql
\q
```

### Run the schema:
```bash
psql -U postgres lbrs_db < database/schema.sql
```

### (Optional) Seed mock data for development:
```bash
psql -U postgres lbrs_db < database/seed.sql
```

---

## Step 2: Configure Environment Variables

### Copy the example env file:
```bash
cp .env.example .env.local
```

### Edit `.env.local` with your database credentials:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=lbrs_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your_actual_password_here

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

---

## Step 3: Install Dependencies

```bash
npm install
```

---

## Step 4: Test Database Connection

```bash
npm run db:test
```

**Expected output:**
```
✅ Test 1: Connecting to database...
   ✓ Connection successful!

✅ Test 2: Executing test query...
   ✓ PostgreSQL Version: PostgreSQL 14.x...
   ✓ Current Time: 2026-02-22 10:30:00...

✅ Test 3: Checking required tables...
   ✓ Table 'users' exists
   ✓ Table 'books' exists
   ...

✅ All tests completed successfully!
🎉 Database is ready to use!
```

---

## Step 5: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📝 Default Login Credentials (Development)

After running the seed file, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Student | john@usant.edu | (any password in dev mode) |
| Faculty | rob@usant.edu | (any password in dev mode) |
| Librarian | maria@usant.edu | (any password in dev mode) |
| Admin | admin@usant.edu | (any password in dev mode) |

**⚠️ Note:** In development mode, users without hashed passwords can login with any password. In production, all passwords must be properly hashed.

---

## 🔧 Available npm Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Test database connection
npm run db:test

# Seed mock data
npm run db:seed

# Cleanup mock data
npm run db:cleanup
```

---

## 📁 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Books

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books |
| GET | `/api/books?search=term` | Search books |
| GET | `/api/books?genre=CS` | Filter by genre |
| GET | `/api/books?featured=true` | Get featured books |
| GET | `/api/books?new=true` | Get new acquisitions |

### Borrows

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/borrows` | Get active borrows |
| GET | `/api/borrows?history=true` | Get borrow history |
| POST | `/api/borrows` | Borrow a book |
| PUT | `/api/borrows?id=1` | Return a book |

---

## 🧪 Testing the API

### Register a new user:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Test User",
    "email": "test@usant.edu",
    "password": "password123",
    "role": "student",
    "userType": "Undergraduate Student",
    "course": "Computer Science",
    "yearLevel": "3rd Year"
  }'
```

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@usant.edu",
    "password": "password123"
  }'
```

### Get books (with token):
```bash
curl -X GET http://localhost:3000/api/books \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 🐛 Troubleshooting

### Database connection failed:
```bash
# Check if PostgreSQL is running
pg_ctl status

# Start PostgreSQL (Windows)
net start postgresql-x64-14
```

### Authentication not working:
1. Make sure `.env.local` exists with correct credentials
2. Run `npm run db:test` to verify database connection
3. Check browser console for errors
4. Clear localStorage and try again

### Tables not found:
```bash
# Re-run the schema
psql -U postgres lbrs_db < database/schema.sql
```

---

## 📊 Database Management

### Backup database:
```bash
pg_dump -U postgres lbrs_db > backup_$(date +%Y-%m-%d).sql
```

### Restore database:
```bash
psql -U postgres lbrs_db < backup_2026-02-22.sql
```

### Remove mock data (production):
```bash
npm run db:cleanup
```

---

## 🔐 Security Checklist for Production

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set strong database password
- [ ] Enable SSL for database connection
- [ ] Remove mock data (`npm run db:cleanup`)
- [ ] Set `NODE_ENV=production`
- [ ] Enable rate limiting
- [ ] Configure HTTPS
- [ ] Set up automated backups

---

## 📞 Need Help?

- Check `database/README.md` for detailed database documentation
- Check `database/IMPLEMENTATION_SUMMARY.md` for schema overview
- Review `database/schema.sql` for table structures
- Check Next.js logs for API errors

---

**Last Updated:** February 22, 2026  
**Version:** 1.0.0
