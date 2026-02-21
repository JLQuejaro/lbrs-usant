/**
 * Database Connection Test Script
 * 
 * Usage: npm run db:test
 * 
 * This script tests the PostgreSQL database connection and verifies
 * that all tables exist and are accessible.
 */

import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const dbConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  database: process.env.DATABASE_NAME || 'lbrs_db',
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || '',
};

console.log('🔍 Testing database connection...\n');
console.log('Configuration:');
console.log(`  Host: ${dbConfig.host}`);
console.log(`  Port: ${dbConfig.port}`);
console.log(`  Database: ${dbConfig.database}`);
console.log(`  User: ${dbConfig.user}`);
console.log('');

const pool = new Pool(dbConfig);

async function testConnection() {
  let client;
  
  try {
    // Test 1: Basic connection
    console.log('✅ Test 1: Connecting to database...');
    client = await pool.connect();
    console.log('   ✓ Connection successful!\n');
    
    // Test 2: Query execution
    console.log('✅ Test 2: Executing test query...');
    const result = await client.query('SELECT NOW() as now, version() as version');
    console.log(`   ✓ PostgreSQL Version: ${result.rows[0].version.substring(0, 50)}...`);
    console.log(`   ✓ Current Time: ${result.rows[0].now}\n`);
    
    // Test 3: Check tables exist
    console.log('✅ Test 3: Checking required tables...');
    const tablesQuery = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const requiredTables = [
      'users',
      'account_requests',
      'books',
      'book_courses',
      'journals',
      'reading_lists',
      'reading_list_books',
      'borrow_records',
      'notifications',
      'reviews'
    ];
    
    const existingTables = tablesQuery.rows.map(row => row.table_name);
    
    for (const table of requiredTables) {
      if (existingTables.includes(table)) {
        console.log(`   ✓ Table '${table}' exists`);
      } else {
        console.log(`   ✗ Table '${table}' MISSING`);
      }
    }
    console.log('');
    
    // Test 4: Count records in each table
    console.log('✅ Test 4: Counting records in each table...');
    for (const table of requiredTables) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`   ✓ ${table}: ${countResult.rows[0].count} records`);
      } catch (error) {
        console.log(`   ✗ ${table}: Error counting records`);
      }
    }
    console.log('');
    
    // Test 5: Check views
    console.log('✅ Test 5: Checking database views...');
    const viewsQuery = await client.query(`
      SELECT table_name 
      FROM information_schema.views 
      WHERE table_schema = 'public'
    `);
    
    const requiredViews = ['active_borrows_view', 'book_statistics_view'];
    const existingViews = viewsQuery.rows.map(row => row.table_name);
    
    for (const view of requiredViews) {
      if (existingViews.includes(view)) {
        console.log(`   ✓ View '${view}' exists`);
      } else {
        console.log(`   ⚠ View '${view}' not found (optional)`);
      }
    }
    console.log('');
    
    // Test 6: Test sample query
    console.log('✅ Test 6: Testing sample query (get users)...');
    const usersResult = await client.query(`
      SELECT user_id, username, email, role, approval_status, is_active 
      FROM users 
      LIMIT 5
    `);
    console.log(`   ✓ Found ${usersResult.rows.length} users`);
    if (usersResult.rows.length > 0) {
      console.log('   Sample users:');
      usersResult.rows.forEach(user => {
        console.log(`     - ${user.username} (${user.email}) - ${user.role}`);
      });
    }
    console.log('');
    
    console.log('✅ All tests completed successfully!\n');
    console.log('🎉 Database is ready to use!\n');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    console.error('\n💡 Troubleshooting tips:');
    console.error('   1. Make sure PostgreSQL is running');
    console.error('   2. Check your .env.local database credentials');
    console.error('   3. Verify the database exists: CREATE DATABASE lbrs_db;');
    console.error('   4. Run the schema: psql -U postgres lbrs_db < database/schema.sql');
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

// Run the test
testConnection();
