import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config({ path: '.env.local' });
config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function recalculateBorrowCounts() {
  console.log('🔄 Recalculating borrow counts based on actual borrow records...');

  const books = await prisma.book.findMany({
    include: {
      borrowRecords: {
        where: {
          status: 'returned',
        },
      },
    },
  });

  let updated = 0;

  for (const book of books) {
    const actualBorrowCount = book.borrowRecords.length;
    
    if (book.borrowCount !== actualBorrowCount) {
      await prisma.book.update({
        where: { id: book.id },
        data: { borrowCount: actualBorrowCount },
      });
      
      console.log(`📚 ${book.title}: ${book.borrowCount} → ${actualBorrowCount}`);
      updated++;
    }
  }

  console.log(`✅ Updated ${updated} books with correct borrow counts`);
  console.log('🎉 Recalculation completed!');
}

recalculateBorrowCounts()
  .catch((e) => {
    console.error('❌ Recalculation failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
