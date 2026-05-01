@echo off
echo Testing common PostgreSQL passwords...
echo.

set "passwords=postgres root admin password 123456 12345678"

for %%p in (%passwords%) do (
    echo Testing password: %%p
    psql -h localhost -p 5432 -U postgres -d postgres -c "SELECT 1;" -w >nul 2>&1
    set PGPASSWORD=%%p
    psql -h localhost -p 5432 -U postgres -d postgres -c "SELECT 1;" >nul 2>&1
    if !errorlevel! equ 0 (
        echo.
        echo ✅ SUCCESS! Password is: %%p
        echo.
        echo Update your .env.local with:
        echo DATABASE_URL=postgresql://postgres:%%p@localhost:5432/lbrs_db
        echo DIRECT_URL=postgresql://postgres:%%p@localhost:5432/lbrs_db
        exit /b 0
    )
)

echo.
echo ❌ None of the common passwords worked.
echo Please check your PostgreSQL installation or reset the password.
echo.
echo To reset PostgreSQL password:
echo 1. Find pg_hba.conf in your PostgreSQL installation
echo 2. Change 'md5' or 'scram-sha-256' to 'trust' for local connections
echo 3. Restart PostgreSQL service
echo 4. Run: psql -U postgres -c "ALTER USER postgres PASSWORD 'newpassword';"
echo 5. Change pg_hba.conf back to 'md5' or 'scram-sha-256'
echo 6. Restart PostgreSQL service again
