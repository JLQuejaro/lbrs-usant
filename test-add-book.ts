import { config } from 'dotenv';

config({ path: '.env.local' });

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function testAddBook() {
  console.log('🧪 Testing book creation as staff user...\n');

  // Step 1: Login as staff (librarian)
  console.log('1️⃣ Logging in as staff (maria@usant.edu.ph)...');
  const loginRes = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'maria@usant.edu.ph',
      password: 'staff123',
    }),
  });

  if (!loginRes.ok) {
    console.error('❌ Login failed:', await loginRes.text());
    return;
  }

  const loginData = await loginRes.json();
  console.log('✅ Login successful');
  console.log('   User:', loginData.user?.username || loginData.user?.name);
  console.log('   Role:', loginData.user?.role);
  console.log('   Staff Type:', loginData.user?.staff_type);
  console.log('   Token:', loginData.token.substring(0, 20) + '...');
  console.log('   Full user data:', JSON.stringify(loginData.user, null, 2));
  console.log('');

  // Step 2: Try to add a book
  console.log('2️⃣ Attempting to add a new book...');
  const bookData = {
    title: 'Test Book from Script',
    author: 'Test Author',
    genre: 'Computer Science',
    year: 2024,
    stock: true,
    courses: ['Computer Science'],
    publicationYear: 2024,
    stockQuantity: 1,
    availableCopies: 1,
    status: 'Available',
  };

  const createRes = await fetch(`${API_URL}/api/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${loginData.token}`,
    },
    body: JSON.stringify(bookData),
  });

  console.log('   Response status:', createRes.status);
  const createData = await createRes.json();

  if (!createRes.ok) {
    console.error('❌ Book creation failed:');
    console.error('   Error:', createData.error);
    console.error('   Message:', createData.message);
    console.error('   Full response:', JSON.stringify(createData, null, 2));
  } else {
    console.log('✅ Book created successfully!');
    console.log('   Book ID:', createData.book.id);
    console.log('   Title:', createData.book.title);
    console.log('   Author:', createData.book.author);
  }
}

testAddBook().catch(console.error);
