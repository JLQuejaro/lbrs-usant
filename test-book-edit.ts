// test-book-edit.ts
import { updateBook } from './src/app/lib/db-repository';

async function testBookEdit() {
  try {
    console.log('Testing book edit functionality...\n');

    // Get a book to edit (you'll need to replace with an actual book ID from your database)
    const testBookId = 'YOUR_BOOK_ID_HERE';

    console.log('Updating book with ID:', testBookId);

    const updatedBook = await updateBook(testBookId, {
      title: 'Updated Test Book',
      author: 'Test Author Updated',
      genre: 'Software Engineering',
      description: 'This is an updated test description',
      pages: 500,
      totalCopies: 5,
      availableCopies: 3,
      courses: ['Computer Science', 'Engineering'],
    });

    console.log('\n✅ Book updated successfully!');
    console.log('Updated book:', JSON.stringify(updatedBook, null, 2));

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Uncomment to run: npx tsx test-book-edit.ts
// testBookEdit();

export { testBookEdit };
