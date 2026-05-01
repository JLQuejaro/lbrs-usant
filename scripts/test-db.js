/* eslint-disable @typescript-eslint/no-require-imports */
const { config } = require('dotenv');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

config({ path: '.env.local' });
config();

const requiredEnv = ['DATABASE_URL', 'DIRECT_URL'];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Testing Prisma database connection...\n');

  const healthcheck = await prisma.$queryRaw`SELECT NOW() AS now`;
  const [activeBorrowsView] = await prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM active_borrows_view`;
  const [bookStatsView] = await prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM book_statistics_view`;
  console.log('Connection successful.');
  console.log(`Database time: ${healthcheck[0].now}\n`);

  const [users, books, borrows, notifications, accountRequests, journals, readingLists] = await Promise.all([
    prisma.user.count(),
    prisma.book.count(),
    prisma.borrowRecord.count(),
    prisma.notification.count(),
    prisma.accountRequest.count(),
    prisma.journal.count(),
    prisma.readingList.count(),
  ]);

  console.log('Model counts:');
  console.log(`  users: ${users}`);
  console.log(`  books: ${books}`);
  console.log(`  borrow_records: ${borrows}`);
  console.log(`  notifications: ${notifications}`);
  console.log(`  account_requests: ${accountRequests}`);
  console.log(`  journals: ${journals}`);
  console.log(`  reading_lists: ${readingLists}`);
  console.log('');
  console.log('Runtime database objects:');
  console.log(`  active_borrows_view rows: ${activeBorrowsView.count}`);
  console.log(`  book_statistics_view rows: ${bookStatsView.count}`);
  console.log('');

  const sampleUser = await prisma.user.findFirst({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      approvalStatus: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  if (sampleUser) {
    console.log('Sample user:');
    console.log(
      `  ${sampleUser.username} <${sampleUser.email}> (${sampleUser.role}, ${sampleUser.approvalStatus})`
    );
  }

  console.log('\nPrisma validation checks passed.');
}

main()
  .catch((error) => {
    console.error('Prisma database test failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
