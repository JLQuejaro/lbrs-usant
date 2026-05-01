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
  const admin = await prisma.user.findUnique({ where: { email: 'admin@usant.edu.ph' } });
  if (!admin) {
    await prisma.user.create({
      data: {
        username: 'Admin User',
        email: 'admin@usant.edu.ph',
        passwordHash: adminPassword,
        role: 'admin',
        adminType: 'SYSTEM_ADMINISTRATOR',
        approvalStatus: 'approved',
        isActive: true,
      },
    });
  }

  // Seed Student
  const student = await prisma.user.findUnique({ where: { email: 'john@usant.edu.ph' } });
  if (!student) {
    await prisma.user.create({
      data: {
        username: 'John Student',
        email: 'john@usant.edu.ph',
        passwordHash: studentPassword,
        role: 'student',
        studentType: 'UNDERGRADUATE_STUDENT',
        course: 'Computer Science',
        yearLevel: '4th Year',
        approvalStatus: 'approved',
        isActive: true,
      },
    });
  }

  // Seed Faculty
  const faculty = await prisma.user.findUnique({ where: { email: 'rob@usant.edu.ph' } });
  if (!faculty) {
    await prisma.user.create({
      data: {
        username: 'Dr. Robert Johnson',
        email: 'rob@usant.edu.ph',
        passwordHash: facultyPassword,
        role: 'faculty',
        facultyType: 'PROFESSOR',
        department: 'Computer Science',
        approvalStatus: 'approved',
        isActive: true,
      },
    });
  }

  // Seed Staff (Librarian)
  const staff = await prisma.user.findUnique({ where: { email: 'maria@usant.edu.ph' } });
  if (!staff) {
    await prisma.user.create({
      data: {
        username: 'Maria Santos',
        email: 'maria@usant.edu.ph',
        passwordHash: staffPassword,
        role: 'staff',
        staffType: 'LIBRARIAN',
        approvalStatus: 'approved',
        isActive: true,
      },
    });
  }

  console.log('✅ Users seeded successfully');

  // Seed Books
  const books = [
    {
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
    const existing = await prisma.book.findFirst({ where: { title: book.title } });
    if (!existing) {
      await prisma.book.create({ data: book });
    }
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
