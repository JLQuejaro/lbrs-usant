/* eslint-disable @typescript-eslint/no-require-imports */
const { config } = require('dotenv');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

config({ path: '.env.local' });
config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || '',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.upsert({
    where: { id: '00000000-0000-0000-0000-000000000008' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000008',
      username: 'Admin User',
      email: 'admin@usant.edu.ph',
      passwordHash: '$2b$10$UyPoViHOr./62um1VfbyPucyMrcWWoLDFQMSdyd0FBxKLg3Pmj6t6',
      role: 'admin',
      adminType: 'SYSTEM_ADMINISTRATOR',
      approvalStatus: 'approved',
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      username: 'John Student',
      email: 'john@usant.edu.ph',
      passwordHash: '$2b$10$WNneULUb8dT3l/LCggiK2e3r6WcIBFK07rWJmf0IKSngR2K97kqhC',
      role: 'student',
      studentType: 'UNDERGRADUATE_STUDENT',
      course: 'Computer Science',
      yearLevel: '4th Year',
      approvalStatus: 'approved',
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { id: '00000000-0000-0000-0000-000000000006' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000006',
      username: 'Dr. Robert Johnson',
      email: 'rob@usant.edu.ph',
      passwordHash: '$2b$10$N6dpAt/3KpgtM8Fbm4MBvuzAVF8xa70RW7Yzs0IkyY5akBYtGeyIK',
      role: 'faculty',
      facultyType: 'PROFESSOR',
      department: 'Computer Science',
      approvalStatus: 'approved',
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { id: '00000000-0000-0000-0000-000000000007' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000007',
      username: 'Maria Santos',
      email: 'maria@usant.edu.ph',
      passwordHash: '$2b$10$FeIUVez5/DJPThsypuWIweRvk8ketZDyxO/ni2J6xDq.FvNOrkHXS',
      role: 'staff',
      staffType: 'LIBRARIAN',
      approvalStatus: 'approved',
      isActive: true,
    },
  });

  const accountRequests = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      fullName: 'Emily Wilson',
      email: 'emily.wilson@usant.edu.ph',
      requestedRole: 'student',
      userType: 'Undergraduate Student',
      course: 'Computer Science',
      status: 'pending',
      requestedAt: new Date('2026-02-20T09:15:00Z'),
      idDocumentPath: 'student_id_001.pdf',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      fullName: 'Dr. Michael Chen',
      email: 'michael.chen@usant.edu.ph',
      requestedRole: 'faculty',
      userType: 'Professor',
      status: 'pending',
      requestedAt: new Date('2026-02-19T14:30:00Z'),
      idDocumentPath: 'faculty_credentials_002.pdf',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      fullName: 'Sarah Martinez',
      email: 'sarah.martinez@usant.edu.ph',
      requestedRole: 'student',
      userType: 'Graduate Student (PhD)',
      course: 'Engineering',
      status: 'pending',
      requestedAt: new Date('2026-02-18T11:45:00Z'),
      idDocumentPath: 'student_id_003.pdf',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      fullName: 'Prof. James Anderson',
      email: 'james.anderson@usant.edu.ph',
      requestedRole: 'faculty',
      userType: 'Lecturer',
      department: 'Engineering',
      status: 'approved',
      requestedAt: new Date('2026-02-15T08:00:00Z'),
      reviewedById: '00000000-0000-0000-0000-000000000008',
      reviewedAt: new Date('2026-02-16T10:30:00Z'),
      reviewNotes: 'Verified faculty credentials. Approved for Engineering department.',
      idDocumentPath: 'faculty_credentials_004.pdf',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      fullName: 'Invalid User',
      email: 'invalid@test.com',
      requestedRole: 'student',
      userType: 'Undergraduate Student',
      status: 'rejected',
      requestedAt: new Date('2026-02-10T16:20:00Z'),
      reviewedById: '00000000-0000-0000-0000-000000000008',
      reviewedAt: new Date('2026-02-11T09:00:00Z'),
      reviewNotes: 'Invalid email domain. Not a USANT affiliated email.',
      idDocumentPath: 'invalid_doc_005.pdf',
    },
  ];

  for (const request of accountRequests) {
    await prisma.accountRequest.upsert({
      where: { id: request.id },
      update: request,
      create: request,
    });
  }

  const books = [
    {
      id: 1,
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      genre: 'Computer Science',
      description:
        'This title covers a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers.',
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
      dateAdded: new Date('2023-01-15'),
    },
    {
      id: 2,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      genre: 'Software Engineering',
      description:
        "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
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
      dateAdded: new Date('2023-02-20'),
    },
    {
      id: 3,
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt',
      genre: 'Software Engineering',
      description:
        "The Pragmatic Programmer is one of those rare tech books you'll read, re-read, and read again over the years.",
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
      dateAdded: new Date('2023-03-10'),
    },
    {
      id: 4,
      title: 'Design Patterns',
      author: 'Erich Gamma',
      genre: 'Computer Science',
      description:
        'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of solutions.',
      pages: 416,
      publicationYear: 1994,
      stockQuantity: 2,
      availableCopies: 2,
      status: 'Available',
      location: 'Shelf 3C - General CS',
      colorTheme: 'bg-emerald-800',
      borrowCount: 98,
      views: 760,
      featured: false,
      dateAdded: new Date('2023-04-05'),
    },
    {
      id: 8,
      title: 'Engineering Mechanics',
      author: 'J.L. Meriam',
      genre: 'Engineering',
      description:
        'For more than 60 years, this textbook has been recognized for its accuracy, clarity, and authority.',
      pages: 534,
      publicationYear: 2015,
      stockQuantity: 2,
      availableCopies: 2,
      status: 'Available',
      location: 'Shelf 2A - Engineering',
      colorTheme: 'bg-stone-700',
      borrowCount: 45,
      views: 320,
      featured: false,
      dateAdded: new Date('2023-05-12'),
    },
    {
      id: 9,
      title: 'Electric Circuits',
      author: 'James W. Nilsson',
      genre: 'Electronics',
      description:
        'Provides students with a solid foundation of the concepts and methods of circuit analysis.',
      pages: 768,
      publicationYear: 2014,
      stockQuantity: 2,
      availableCopies: 2,
      status: 'Available',
      location: 'Shelf 2B - Electronics',
      colorTheme: 'bg-yellow-700',
      borrowCount: 38,
      views: 290,
      featured: false,
      dateAdded: new Date('2023-06-20'),
    },
    {
      id: 19,
      title: 'Deep Work',
      author: 'Cal Newport',
      genre: 'Productivity',
      description:
        'One of the most valuable skills in our economy is becoming increasingly rare. The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable.',
      pages: 296,
      publicationYear: 2016,
      stockQuantity: 2,
      availableCopies: 2,
      status: 'Available',
      location: 'Shelf 6A - Productivity',
      colorTheme: 'bg-zinc-700',
      borrowCount: 85,
      views: 640,
      featured: false,
      dateAdded: new Date('2025-02-01'),
    },
    {
      id: 21,
      title: 'AI: A Modern Approach',
      author: 'Stuart Russell',
      genre: 'Computer Science',
      description:
        'The leading textbook in Artificial Intelligence, used in over 1500 schools in 135 countries.',
      pages: 1136,
      publicationYear: 2021,
      stockQuantity: 2,
      availableCopies: 2,
      status: 'Available',
      location: 'New Arrivals Display',
      colorTheme: 'bg-indigo-700',
      borrowCount: 5,
      views: 150,
      featured: false,
      dateAdded: new Date('2026-02-10'),
    },
    {
      id: 22,
      title: 'Modern Operating Systems',
      author: 'Andrew Tanenbaum',
      genre: 'Computer Science',
      description:
        'The authoritative guide to operating systems, covering both principles and practice.',
      pages: 1104,
      publicationYear: 2022,
      stockQuantity: 2,
      availableCopies: 2,
      status: 'Available',
      location: 'New Arrivals Display',
      colorTheme: 'bg-slate-800',
      borrowCount: 2,
      views: 80,
      featured: false,
      dateAdded: new Date('2026-02-15'),
    },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { id: book.id },
      update: book,
      create: book,
    });
  }

  const bookCourses = [
    [1, 'Computer Science'],
    [2, 'Computer Science'],
    [2, 'Information Tech'],
    [3, 'Computer Science'],
    [3, 'Information Tech'],
    [4, 'Computer Science'],
    [19, 'Computer Science'],
    [19, 'General'],
    [21, 'Computer Science'],
    [22, 'Computer Science'],
    [8, 'Engineering'],
    [9, 'Engineering'],
  ];

  for (const [bookId, courseName] of bookCourses) {
    await prisma.bookCourse.upsert({
      where: {
        bookId_courseName: {
          bookId,
          courseName,
        },
      },
      update: {},
      create: {
        bookId,
        courseName,
      },
    });
  }

  const journals = [
    {
      id: 1,
      title: 'IEEE Transactions on Software Engineering',
      publisher: 'IEEE',
      subject: 'Computer Science',
      impactFactor: 9.6,
      accessUrl: 'https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=32',
      journalType: 'JOURNAL',
    },
    {
      id: 2,
      title: 'ACM Computing Surveys',
      publisher: 'ACM',
      subject: 'Computer Science',
      impactFactor: 14.3,
      accessUrl: 'https://dl.acm.org/journal/csur',
      journalType: 'JOURNAL',
    },
    {
      id: 3,
      title: 'Encyclopedia of Computer Science',
      publisher: 'Wiley',
      subject: 'Computer Science',
      impactFactor: null,
      accessUrl: 'https://www.wiley.com/encyclopedia-computer-science',
      journalType: 'REFERENCE',
    },
    {
      id: 4,
      title: 'Nature Electronics',
      publisher: 'Nature',
      subject: 'Engineering',
      impactFactor: 33.2,
      accessUrl: 'https://www.nature.com/natelectron/',
      journalType: 'JOURNAL',
    },
  ];

  for (const journal of journals) {
    await prisma.journal.upsert({
      where: { id: journal.id },
      update: journal,
      create: journal,
    });
  }

  const readingLists = [
    {
      id: 1,
      title: 'CS101: Core Fundamentals',
      facultyId: '00000000-0000-0000-0000-000000000006',
      description: 'Essential reading for introductory computer science courses.',
      studentCount: 45,
      isActive: true,
    },
    {
      id: 2,
      title: 'Advanced Software Patterns',
      facultyId: '00000000-0000-0000-0000-000000000006',
      description: 'Graduate-level reading on software design patterns and architecture.',
      studentCount: 28,
      isActive: true,
    },
  ];

  for (const readingList of readingLists) {
    await prisma.readingList.upsert({
      where: { id: readingList.id },
      update: readingList,
      create: readingList,
    });
  }

  const readingListBooks = [
    [1, 1],
    [1, 2],
    [1, 4],
    [2, 4],
    [2, 2],
  ];

  for (const [readingListId, bookId] of readingListBooks) {
    await prisma.readingListBook.upsert({
      where: {
        readingListId_bookId: {
          readingListId,
          bookId,
        },
      },
      update: {},
      create: {
        readingListId,
        bookId,
      },
    });
  }

  const borrowRecords = [
    {
      id: 1,
      userId: '00000000-0000-0000-0000-000000000001',
      bookId: 1,
      borrowedDate: new Date('2025-01-01T00:00:00Z'),
      dueDate: new Date('2025-01-08T00:00:00Z'),
      returnedDate: new Date('2025-01-08T00:00:00Z'),
      status: 'returned',
    },
    {
      id: 2,
      userId: '00000000-0000-0000-0000-000000000001',
      bookId: 2,
      borrowedDate: new Date('2025-01-05T00:00:00Z'),
      dueDate: new Date('2025-01-12T00:00:00Z'),
      returnedDate: new Date('2025-01-12T00:00:00Z'),
      status: 'returned',
    },
    {
      id: 3,
      userId: '00000000-0000-0000-0000-000000000001',
      bookId: 3,
      borrowedDate: new Date('2026-02-15T00:00:00Z'),
      dueDate: new Date('2026-02-22T00:00:00Z'),
      status: 'active',
    },
  ];

  for (const borrowRecord of borrowRecords) {
    await prisma.borrowRecord.upsert({
      where: { id: borrowRecord.id },
      update: borrowRecord,
      create: borrowRecord,
    });
  }

  const notifications = [
    {
      id: 1,
      userId: '00000000-0000-0000-0000-000000000001',
      title: 'Book Available',
      message: 'The book "The Pragmatic Programmer" is now available for borrowing.',
      notificationType: 'availability',
      bookId: 3,
      isRead: false,
    },
    {
      id: 2,
      userId: '00000000-0000-0000-0000-000000000001',
      title: 'Return Reminder',
      message: 'Your borrowed book "The Pragmatic Programmer" is due in 3 days.',
      notificationType: 'reminder',
      bookId: 3,
      isRead: false,
    },
    {
      id: 3,
      userId: '00000000-0000-0000-0000-000000000001',
      title: 'System Maintenance',
      message: 'The library system will undergo maintenance on Feb 25, 2026.',
      notificationType: 'system',
      bookId: null,
      isRead: true,
    },
  ];

  for (const notification of notifications) {
    await prisma.notification.upsert({
      where: { id: notification.id },
      update: notification,
      create: notification,
    });
  }

  const reviews = [
    {
      id: 1,
      bookId: 1,
      userId: '00000000-0000-0000-0000-000000000001',
      userName: 'John Student',
      rating: 5,
      comment: 'Essential for every CS student. Comprehensive and well-explained.',
    },
    {
      id: 2,
      bookId: 2,
      userId: '00000000-0000-0000-0000-000000000001',
      userName: 'John Student',
      rating: 5,
      comment: 'Changed the way I write code. Highly recommended!',
    },
    {
      id: 3,
      bookId: 4,
      userId: '00000000-0000-0000-0000-000000000001',
      userName: 'John Student',
      rating: 4,
      comment: 'Classic design patterns. Still relevant today.',
    },
  ];

  for (const review of reviews) {
    await prisma.review.upsert({
      where: { id: review.id },
      update: review,
      create: review,
    });
  }

  console.log('Prisma seed completed successfully.');
}

main()
  .catch((error) => {
    console.error('Prisma seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
