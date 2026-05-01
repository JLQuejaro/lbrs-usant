const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('🔧 LBRS-USANT Setup Wizard\n');
  console.log('This will fix all 5 issues preventing your app from running.\n');

  const envPath = path.join(__dirname, '..', '.env.local');
  
  // Read current .env.local
  let envContent = fs.readFileSync(envPath, 'utf8');
  const currentMatch = envContent.match(/DATABASE_URL=postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+?)(\?|$|\n)/);
  
  if (!currentMatch) {
    console.log('❌ Invalid DATABASE_URL format in .env.local');
    rl.close();
    return;
  }

  const [, user, oldPassword, host, port, dbName] = currentMatch;
  
  console.log('Current PostgreSQL settings:');
  console.log(`  Host: ${host}`);
  console.log(`  Port: ${port}`);
  console.log(`  User: ${user}`);
  console.log(`  Database: ${dbName}`);
  console.log(`  Password: ${oldPassword.replace(/./g, '*')}\n`);

  // Test current password
  console.log('Testing current password...');
  try {
    execSync(`psql -h ${host} -p ${port} -U ${user} -d postgres -c "SELECT 1;" -w`, {
      env: { ...process.env, PGPASSWORD: oldPassword },
      stdio: 'pipe'
    });
    console.log('✅ Current password works!\n');
    await setupDatabase(host, port, user, oldPassword, dbName);
    rl.close();
    return;
  } catch (error) {
    console.log('❌ Current password failed\n');
  }

  // Prompt for new password
  const newPassword = await question('Enter your PostgreSQL password for user "postgres": ');
  
  console.log('\nTesting new password...');
  try {
    execSync(`psql -h ${host} -p ${port} -U ${user} -d postgres -c "SELECT 1;" -w`, {
      env: { ...process.env, PGPASSWORD: newPassword },
      stdio: 'pipe'
    });
    console.log('✅ Password verified!\n');
    
    // Update .env.local
    console.log('Updating .env.local...');
    envContent = envContent.replace(
      /DATABASE_URL=postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+?)(\?[^\n]*)?(\n|$)/,
      `DATABASE_URL=postgresql://${user}:${newPassword}@${host}:${port}/${dbName}\n`
    );
    envContent = envContent.replace(
      /DIRECT_URL=postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+?)(\?[^\n]*)?(\n|$)/,
      `DIRECT_URL=postgresql://${user}:${newPassword}@${host}:${port}/${dbName}\n`
    );
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env.local updated\n');
    
    await setupDatabase(host, port, user, newPassword, dbName);
  } catch (error) {
    console.log('❌ Password verification failed');
    console.log('\nPlease check your PostgreSQL password and try again.');
  }
  
  rl.close();
}

async function setupDatabase(host, port, user, password, dbName) {
  // Check/create database
  console.log(`Checking database '${dbName}'...`);
  try {
    const result = execSync(
      `psql -h ${host} -p ${port} -U ${user} -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${dbName}';" -w`,
      {
        env: { ...process.env, PGPASSWORD: password },
        encoding: 'utf8'
      }
    ).trim();

    if (result !== '1') {
      console.log(`Creating database '${dbName}'...`);
      execSync(
        `psql -h ${host} -p ${port} -U ${user} -d postgres -c "CREATE DATABASE ${dbName};" -w`,
        {
          env: { ...process.env, PGPASSWORD: password },
          stdio: 'inherit'
        }
      );
    }
    console.log(`✅ Database '${dbName}' ready\n`);
  } catch (error) {
    console.log('❌ Database setup failed:', error.message);
    return;
  }

  // Apply migrations
  console.log('Applying Prisma migrations...');
  try {
    execSync('npm run db:migrate', { stdio: 'inherit' });
    console.log('✅ Migrations applied\n');
  } catch (error) {
    console.log('❌ Migration failed\n');
    return;
  }

  // Seed database
  console.log('Seeding database...');
  try {
    execSync('npm run db:seed', { stdio: 'inherit' });
    console.log('✅ Database seeded\n');
  } catch (error) {
    console.log('⚠️  Seeding skipped (may already be seeded)\n');
  }

  console.log('🎉 Setup complete! Run: npm run dev');
}

main().catch(console.error);
