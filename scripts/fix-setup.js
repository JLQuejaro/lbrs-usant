const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing LBRS-USANT setup issues...\n');

// Issue #1: Check .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ Issue #1: .env.local missing');
  console.log('   Creating from .env.example...');
  fs.copyFileSync(path.join(__dirname, '..', '.env.example'), envPath);
  console.log('   ⚠️  Please edit .env.local with your database credentials\n');
} else {
  console.log('✅ Issue #1: .env.local exists\n');
}

// Issue #2 & #3: Test database connection and create database if needed
console.log('🔍 Testing PostgreSQL connection...');
try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
  
  if (!dbUrlMatch) {
    console.log('❌ DATABASE_URL not found in .env.local');
    process.exit(1);
  }

  const dbUrl = dbUrlMatch[1].trim();
  const urlParts = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+?)(\?|$)/);
  
  if (!urlParts) {
    console.log('❌ Invalid DATABASE_URL format');
    process.exit(1);
  }

  const [, user, password, host, port, dbName] = urlParts;
  
  // Test connection to postgres database
  console.log(`   Testing connection as ${user}@${host}:${port}...`);
  try {
    execSync(`psql -h ${host} -p ${port} -U ${user} -d postgres -c "SELECT 1;" -w`, {
      env: { ...process.env, PGPASSWORD: password },
      stdio: 'pipe'
    });
    console.log('✅ Issue #2: PostgreSQL authentication successful\n');
  } catch (error) {
    console.log('❌ Issue #2: PostgreSQL authentication failed');
    console.log('   Please update the password in .env.local');
    console.log('   Current user:', user);
    console.log('   Current password:', password.replace(/./g, '*'));
    process.exit(1);
  }

  // Check if database exists
  console.log(`🔍 Checking if database '${dbName}' exists...`);
  try {
    const result = execSync(
      `psql -h ${host} -p ${port} -U ${user} -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${dbName}';" -w`,
      {
        env: { ...process.env, PGPASSWORD: password },
        encoding: 'utf8'
      }
    ).trim();

    if (result === '1') {
      console.log(`✅ Issue #3: Database '${dbName}' exists\n`);
    } else {
      console.log(`❌ Issue #3: Database '${dbName}' does not exist`);
      console.log(`   Creating database '${dbName}'...`);
      execSync(
        `psql -h ${host} -p ${port} -U ${user} -d postgres -c "CREATE DATABASE ${dbName};" -w`,
        {
          env: { ...process.env, PGPASSWORD: password },
          stdio: 'inherit'
        }
      );
      console.log(`✅ Database '${dbName}' created\n`);
    }
  } catch (error) {
    console.log('❌ Failed to check/create database');
    console.error(error.message);
    process.exit(1);
  }

} catch (error) {
  console.log('❌ Error reading .env.local');
  console.error(error.message);
  process.exit(1);
}

// Issue #4: Apply migrations
console.log('🔍 Checking Prisma migrations...');
try {
  execSync('npm run db:migrate', { stdio: 'inherit' });
  console.log('✅ Issue #4: Migrations applied\n');
} catch (error) {
  console.log('❌ Issue #4: Migration failed');
  process.exit(1);
}

// Issue #5: Seed database
console.log('🔍 Seeding database...');
try {
  execSync('npm run db:seed', { stdio: 'inherit' });
  console.log('✅ Issue #5: Database seeded\n');
} catch (error) {
  console.log('⚠️  Issue #5: Seeding failed (may already be seeded)\n');
}

console.log('✅ All issues resolved! Run: npm run dev');
