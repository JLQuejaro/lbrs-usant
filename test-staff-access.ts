import { config } from 'dotenv';

config({ path: '.env.local' });

const API_URL = 'http://localhost:3000';

async function testStaffAccess() {
  console.log('🧪 Testing staff access to book creation...\n');

  // Login as staff
  console.log('1️⃣ Logging in as staff...');
  const loginRes = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'maria@usant.edu.ph',
      password: 'staff123',
    }),
  });

  if (!loginRes.ok) {
    console.error('❌ Login failed');
    return;
  }

  const { token, user } = await loginRes.json();
  console.log('✅ Logged in successfully');
  console.log('   Role:', user.role);
  console.log('   Staff Type:', user.user_type_staff);
  console.log('');

  // Try to create a book
  console.log('2️⃣ Creating a book...');
  const createRes = await fetch(`${API_URL}/api/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: 'Test Book ' + Date.now(),
      author: 'Test Author',
      genre: 'Computer Science',
      publicationYear: 2024,
      stockQuantity: 1,
      availableCopies: 1,
      courses: ['Computer Science'],
    }),
  });

  console.log('   Status:', createRes.status);
  const data = await createRes.json();

  if (createRes.ok) {
    console.log('✅ Book created successfully!');
    console.log('   Book:', data.book.title);
  } else {
    console.error('❌ Failed to create book');
    console.error('   Error:', data.error);
    console.error('   Message:', data.message);
  }
}

testStaffAccess().catch(console.error);
