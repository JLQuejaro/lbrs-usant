import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

config({ path: '.env.local' });
config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);
  const facultyPassword = await bcrypt.hash('faculty123', 10);
  const staffPassword = await bcrypt.hash('staff123', 10);

  // Seed Admin User
  await prisma.user.upsert({
    where: { email: 'admin@usant.edu' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000008',
      username: 'Admin User',
      email: 'admin@usant.edu',
      passwordHash: adminPassword,
      role: 'admin',
      adminType: 'SYSTEM_ADMINISTRATOR',
      approvalStatus: 'approved',
      isActive: true,
    },
  });

  // Seed Student
  await prisma.user.upsert({
    where: { email: 'john@usant.edu' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      username: 'John Student',
      email: 'john@usant.edu',
      passwordHash: studentPassword,
      role: 'student',
      studentType: 'UNDERGRADUATE_STUDENT',
      course: 'Computer Science',
      yearLevel: '4th Year',
      approvalStatus: 'approved',
      isActive: true,
    },
  });

  // Seed Faculty
  await prisma.user.upsert({
    where: { email: 'rob@usant.edu' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000006',
      username: 'Dr. Robert Johnson',
      email: 'rob@usant.edu',
      passwordHash: facultyPassword,
      role: 'faculty',
      facultyType: 'PROFESSOR',
      department: 'Computer Science',
      approvalStatus: 'approved',
      isActive: true,
    },
  });

  // Seed Staff (Librarian)
  await prisma.user.upsert({
    where: { email: 'maria@usant.edu' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000007',
      username: 'Maria Santos',
      email: 'maria@usant.edu',
      passwordHash: staffPassword,
      role: 'staff',
      staffType: 'LIBRARIAN',
      approvalStatus: 'approved',
      isActive: true,
    },
  });

  console.log('✅ Users seeded successfully');

  // Seed Books
  const books = [
    {
      id: 1,
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      genre: 'Computer Science',
      description: 'This title covers a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers.',
      pages: 1312,
      publicationYear: 2009,
      stockQuantity: 3,
      availableCopies: 2,
      status: 'Available',
      location: 'Shelf 4B - CS Section',
      colorTheme: 'bg-red-900',
      borrowCount: 156,
      views: 1200,
      featured: true,
    },
    {
      id: 2,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      genre: 'Software Engineering',
      description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees.',
      pages: 464,
      publicationYear: 2008,
      stockQuantity: 2,
      availableCopies: 1,
      status: 'Available',
      location: 'Shelf 4A - SE Section',
      colorTheme: 'bg-blue-800',
      borrowCount: 210,
      views: 1500,
      featured: true,
    },
    {
      id: 3,
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt',
      genre: 'Software Engineering',
      description: 'The Pragmatic Programmer is one of those rare tech books you\'ll read, re-read, and read again over the years.',
      pages: 352,
      publicationYear: 1999,
      stockQuantity: 2,
      availableCopies: 0,
      status: 'Borrowed',
      location: 'Shelf 4A - SE Section',
      colorTheme: 'bg-slate-700',
      borrowCount: 145,
      views: 980,
      featured: false,
    },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { id: book.id },
      update: {},
      create: book,
    });
  }

  console.log('✅ Books seeded successfully');

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
