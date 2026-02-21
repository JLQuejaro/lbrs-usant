# PostgreSQL Setup Instructions for USANT LBRS

## Option 1: Using PostgreSQL Already Installed

### Check if PostgreSQL is installed:
```bash
# Windows - Check common installation paths
dir "C:\Program Files\PostgreSQL"
```

### Start PostgreSQL Service (Windows):
```bash
# Method 1: Using net command
net start postgresql-x64-14

# Method 2: Using Services
# Press Win+R, type "services.msc", find "postgresql-x64-14", right-click → Start
```

### Find your PostgreSQL password:
The default password is usually set during installation. Common defaults:
- `postgres`
- `admin`
- `password`
- (blank/empty)

---

## Option 2: Install PostgreSQL (If Not Installed)

### Download and Install:
1. Go to: https://www.postgresql.org/download/windows/
2. Download PostgreSQL 14 or higher
3. Run the installer
4. During installation:
   - Set password to: `postgres` (or remember what you set)
   - Keep default port: `5432`
   - Install pgAdmin 4 (optional, for GUI management)

### After Installation:
1. PostgreSQL service should start automatically
2. Open Command Prompt and test:
   ```bash
   psql -U postgres -c "SELECT version();"
   ```

---

## Step 3: Create Database

### Using Command Line:
```bash
# Connect to PostgreSQL
psql -U postgres

# If prompted for password, enter the one you set during installation

# Create database
CREATE DATABASE lbrs_db;

# Connect to the database
\c lbrs_db

# Run the schema
\i database/schema.sql

# (Optional) Seed mock data
\i database/seed.sql

# Exit
\q
```

### Using pgAdmin (GUI):
1. Open pgAdmin 4
2. Connect to PostgreSQL (enter password)
3. Right-click "Databases" → Create → Database
4. Name: `lbrs_db`
5. Click OK
6. Right-click `lbrs_db` → Query Tool
7. Open and run `database/schema.sql`
8. (Optional) Run `database/seed.sql`

---

## Step 4: Update .env.local

Edit the `.env.local` file with your actual PostgreSQL password:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=lbrs_db
DATABASE_USER=postgres
DATABASE_PASSWORD=YOUR_ACTUAL_PASSWORD
```

---

## Step 5: Test Database Connection

```bash
npm run db:test
```

Expected output:
```
✅ Test 1: Connecting to database...
   ✓ Connection successful!

✅ Test 2: Executing test query...
   ✓ PostgreSQL Version: PostgreSQL 14.x...

✅ All tests completed successfully!
```

---

## Troubleshooting

### "psql: command not found"
PostgreSQL bin folder is not in PATH. Use full path:
```bash
"C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres
```

### "FATAL: password authentication failed"
Reset PostgreSQL password:
```bash
# Edit pg_hba.conf (usually in C:\Program Files\PostgreSQL\14\data)
# Change "md5" to "trust" for local connections
# Restart PostgreSQL service
# Run: psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'new_password';"
# Change pg_hba.conf back to "md5"
# Restart PostgreSQL service
```

### "Database already exists"
```bash
# Drop and recreate
psql -U postgres -c "DROP DATABASE IF EXISTS lbrs_db;"
psql -U postgres -c "CREATE DATABASE lbrs_db;"
```

### Port 5432 already in use
Another service is using the port. Either:
1. Stop the other service
2. Or change PostgreSQL port in `postgresql.conf`

---

## Quick Test (Without Command Line)

If you prefer a GUI approach:

1. **Install DBeaver** (free database tool): https://dbeaver.io/download/
2. **Create new PostgreSQL connection**:
   - Host: localhost
   - Port: 5432
   - Database: postgres
   - Username: postgres
   - Password: (your password)
3. **Create database**: Right-click → Create → Database → `lbrs_db`
4. **Run SQL files**: Right-click `lbrs_db` → SQL Editor → Open `schema.sql`

---

## Need Help?

1. Check PostgreSQL is running: Open Task Manager → Services → Look for `postgresql-x64-14`
2. Check logs: `C:\Program Files\PostgreSQL\14\data\log`
3. Restart PostgreSQL: Services → postgresql-x64-14 → Restart

---

**After successful setup, run:**
```bash
npm run db:test
npm run dev
```
