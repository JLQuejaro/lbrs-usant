import {
  AdminUserType,
  ApprovalStatus as PrismaApprovalStatus,
  FacultyUserType,
  JournalEntryType,
  NotificationType as PrismaNotificationType,
  Prisma,
  StaffUserType,
  StudentUserType,
  UserRole,
} from '@prisma/client';
import { prisma } from './prisma';

// ============================================================
// TYPES
// ============================================================

export interface User {
  user_id: string;
  username: string;
  email: string;
  password_hash: string;
  role: 'student' | 'faculty' | 'staff' | 'admin';
  user_type_student?: string;
  user_type_faculty?: string;
  user_type_staff?: string;
  user_type_admin?: string;
  course?: string;
  department?: string;
  year_level?: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date | null;
  reviewed_by?: string | null;
  reviewed_at?: Date | null;
  review_notes?: string | null;
}

export interface Book {
  book_id: number;
  title: string;
  author: string;
  genre: string;
  description?: string | null;
  pages?: number | null;
  publication_year?: number | null;
  stock_quantity: number;
  available_copies: number;
  status: string;
  location?: string | null;
  color_theme?: string | null;
  borrow_count: number;
  views: number;
  featured: boolean;
  date_added?: Date;
  courses?: string[];
  average_rating?: number | null;
  total_reviews?: number | null;
}

export interface CreateBookInput {
  title: string;
  author: string;
  genre: string;
  description?: string | null;
  pages?: number | null;
  publication_year?: number | null;
  stock_quantity?: number;
  available_copies?: number;
  status?: string;
  location?: string | null;
  color_theme?: string | null;
  featured?: boolean;
  courses?: string[];
}

export interface BorrowRecord {
  borrow_id: number;
  user_id: string;
  book_id: number;
  borrowed_date: Date;
  due_date: Date;
  returned_date?: Date | null;
  status: string;
  title?: string;
  author?: string;
  color_theme?: string | null;
  username?: string;
  email?: string;
}

export interface AccountRequest {
  request_id: string;
  full_name: string;
  email: string;
  requested_role: string;
  user_type: string;
  course?: string | null;
  department?: string | null;
  year_level?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: Date;
  id_document_path?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: Date | null;
  review_notes?: string | null;
}

export interface Journal {
  journal_id: number;
  title: string;
  publisher: string;
  subject: string;
  impact_factor: number | null;
  access_url: string | null;
  journal_type: 'Journal' | 'Reference';
  created_at: Date;
}

export interface ReadingList {
  reading_list_id: number;
  title: string;
  faculty_id: string | null;
  description?: string | null;
  student_count: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  book_ids?: number[];
}

export interface Notification {
  notification_id: number;
  user_id: string;
  title: string;
  message: string;
  notification_type: 'availability' | 'reminder' | 'system';
  book_id?: number | null;
  is_read: boolean;
  created_at: Date;
}

export interface Review {
  review_id: number;
  book_id: number;
  user_id: string | null;
  user_name: string;
  rating: number;
  comment?: string | null;
  created_at: Date;
  updated_at: Date;
}

const studentTypeLabels: Record<StudentUserType, string> = {
  UNDERGRADUATE_STUDENT: 'Undergraduate Student',
  GRADUATE_STUDENT_MASTERS: "Graduate Student (Master's)",
  GRADUATE_STUDENT_PHD: 'Graduate Student (PhD)',
  DISTANCE_ONLINE_LEARNER: 'Distance/Online Learner',
};

const facultyTypeLabels: Record<FacultyUserType, string> = {
  PROFESSOR: 'Professor',
  LECTURER: 'Lecturer',
  RESEARCHER: 'Researcher',
};

const staffTypeLabels: Record<StaffUserType, string> = {
  ADMINISTRATIVE_STAFF: 'Administrative Staff',
  TECHNICAL_SUPPORT_STAFF: 'Technical/Support Staff',
  LIBRARIAN: 'Librarian',
};

const adminTypeLabels: Record<AdminUserType, string> = {
  SYSTEM_ADMINISTRATOR: 'System Administrator',
};

const studentTypeValues = Object.fromEntries(
  Object.entries(studentTypeLabels).map(([key, value]) => [value, key])
) as Record<string, StudentUserType>;

const facultyTypeValues = Object.fromEntries(
  Object.entries(facultyTypeLabels).map(([key, value]) => [value, key])
) as Record<string, FacultyUserType>;

const staffTypeValues = Object.fromEntries(
  Object.entries(staffTypeLabels).map(([key, value]) => [value, key])
) as Record<string, StaffUserType>;

const adminTypeValues = Object.fromEntries(
  Object.entries(adminTypeLabels).map(([key, value]) => [value, key])
) as Record<string, AdminUserType>;

const journalTypeLabels: Record<JournalEntryType, 'Journal' | 'Reference'> = {
  JOURNAL: 'Journal',
  REFERENCE: 'Reference',
};

const bookInclude = {
  courses: {
    select: {
      courseName: true,
    },
  },
} as const;

const borrowInclude = {
  book: {
    select: {
      title: true,
      author: true,
      colorTheme: true,
    },
  },
  user: {
    select: {
      username: true,
      email: true,
    },
  },
} as const;

type BookRecord = Prisma.BookGetPayload<{ include: typeof bookInclude }>;
type BorrowRecordWithRelations = Prisma.BorrowRecordGetPayload<{ include: typeof borrowInclude }>;

function normalizeCourses(courses?: string[]) {
  return Array.from(
    new Set(
      (courses ?? [])
        .map((course) => course.trim())
        .filter(Boolean)
    )
  );
}

function normalizeNonNegativeInteger(value: number | undefined, fallback: number) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, Math.trunc(value));
}

function toUserRole(role: string): UserRole {
  if (role === 'student' || role === 'faculty' || role === 'staff' || role === 'admin') {
    return role;
  }
  throw new Error(`Unsupported role: ${role}`);
}

function toApprovalStatus(status: string): PrismaApprovalStatus {
  if (status === 'pending' || status === 'approved' || status === 'rejected') {
    return status;
  }
  throw new Error(`Unsupported approval status: ${status}`);
}

function mapUserRecord(user: {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  studentType: StudentUserType | null;
  facultyType: FacultyUserType | null;
  staffType: StaffUserType | null;
  adminType: AdminUserType | null;
  course: string | null;
  department: string | null;
  yearLevel: string | null;
  approvalStatus: PrismaApprovalStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
  reviewedById: string | null;
  reviewedAt: Date | null;
  reviewNotes: string | null;
}): User {
  return {
    user_id: user.id,
    username: user.username,
    email: user.email,
    password_hash: user.passwordHash,
    role: user.role,
    user_type_student: user.studentType ? studentTypeLabels[user.studentType] : undefined,
    user_type_faculty: user.facultyType ? facultyTypeLabels[user.facultyType] : undefined,
    user_type_staff: user.staffType ? staffTypeLabels[user.staffType] : undefined,
    user_type_admin: user.adminType ? adminTypeLabels[user.adminType] : undefined,
    course: user.course ?? undefined,
    department: user.department ?? undefined,
    year_level: user.yearLevel ?? undefined,
    approval_status: user.approvalStatus,
    is_active: user.isActive,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
    last_login_at: user.lastLoginAt,
    reviewed_by: user.reviewedById,
    reviewed_at: user.reviewedAt,
    review_notes: user.reviewNotes,
  };
}

async function getReviewStatsForBooks(bookIds: number[]) {
  if (bookIds.length === 0) {
    return new Map<number, { averageRating: number | null; totalReviews: number }>();
  }

  const stats = await prisma.review.groupBy({
    by: ['bookId'],
    where: {
      bookId: {
        in: bookIds,
      },
    },
    _avg: {
      rating: true,
    },
    _count: {
      _all: true,
    },
  });

  return new Map(
    stats.map((stat) => [
      stat.bookId,
      {
        averageRating: stat._avg.rating ? Number(stat._avg.rating) : null,
        totalReviews: stat._count._all,
      },
    ])
  );
}

async function mapBooks(records: BookRecord[]): Promise<Book[]> {
  const stats = await getReviewStatsForBooks(records.map((record) => record.id));

  return records.map((record) => {
    const bookStats = stats.get(record.id);

    return {
      book_id: record.id,
      title: record.title,
      author: record.author,
      genre: record.genre,
      description: record.description,
      pages: record.pages,
      publication_year: record.publicationYear,
      stock_quantity: record.stockQuantity,
      available_copies: record.availableCopies,
      status: record.status,
      location: record.location,
      color_theme: record.colorTheme,
      borrow_count: record.borrowCount,
      views: record.views,
      featured: record.featured,
      date_added: record.dateAdded,
      courses: record.courses.map((course) => course.courseName),
      average_rating: bookStats?.averageRating ?? null,
      total_reviews: bookStats?.totalReviews ?? 0,
    };
  });
}

function mapBorrowRecord(record: BorrowRecordWithRelations): BorrowRecord {
  return {
    borrow_id: record.id,
    user_id: record.userId,
    book_id: record.bookId,
    borrowed_date: record.borrowedDate,
    due_date: record.dueDate,
    returned_date: record.returnedDate,
    status: record.status,
    title: record.book.title,
    author: record.book.author,
    color_theme: record.book.colorTheme,
    username: record.user.username,
    email: record.user.email,
  };
}

function mapAccountRequestRecord(record: {
  id: string;
  fullName: string;
  email: string;
  requestedRole: UserRole;
  userType: string;
  course: string | null;
  department: string | null;
  yearLevel: string | null;
  status: PrismaApprovalStatus;
  requestedAt: Date;
  idDocumentPath: string | null;
  reviewedById: string | null;
  reviewedAt: Date | null;
  reviewNotes: string | null;
}): AccountRequest {
  return {
    request_id: record.id,
    full_name: record.fullName,
    email: record.email,
    requested_role: record.requestedRole,
    user_type: record.userType,
    course: record.course,
    department: record.department,
    year_level: record.yearLevel,
    status: record.status,
    requested_at: record.requestedAt,
    id_document_path: record.idDocumentPath,
    reviewed_by: record.reviewedById,
    reviewed_at: record.reviewedAt,
    review_notes: record.reviewNotes,
  };
}

function mapNotificationRecord(record: {
  id: number;
  userId: string;
  title: string;
  message: string;
  notificationType: PrismaNotificationType;
  bookId: number | null;
  isRead: boolean;
  createdAt: Date;
}): Notification {
  return {
    notification_id: record.id,
    user_id: record.userId,
    title: record.title,
    message: record.message,
    notification_type: record.notificationType,
    book_id: record.bookId,
    is_read: record.isRead,
    created_at: record.createdAt,
  };
}

function mapReviewRecord(record: {
  id: number;
  bookId: number;
  userId: string | null;
  userName: string;
  rating: Prisma.Decimal;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Review {
  return {
    review_id: record.id,
    book_id: record.bookId,
    user_id: record.userId,
    user_name: record.userName,
    rating: Number(record.rating),
    comment: record.comment,
    created_at: record.createdAt,
    updated_at: record.updatedAt,
  };
}

// ============================================================
// USER REPOSITORY
// ============================================================

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user ? mapUserRecord(user) : null;
}

export async function getUserById(userId: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user ? mapUserRecord(user) : null;
}

export async function createUser(
  userData: Partial<User> & { password_hash: string }
): Promise<User> {
  const user = await prisma.user.create({
    data: {
      username: userData.username ?? '',
      email: userData.email ?? '',
      passwordHash: userData.password_hash,
      role: toUserRole(userData.role ?? ''),
      studentType: userData.user_type_student ? studentTypeValues[userData.user_type_student] : undefined,
      facultyType: userData.user_type_faculty ? facultyTypeValues[userData.user_type_faculty] : undefined,
      staffType: userData.user_type_staff ? staffTypeValues[userData.user_type_staff] : undefined,
      adminType: userData.user_type_admin ? adminTypeValues[userData.user_type_admin] : undefined,
      course: userData.course ?? null,
      department: userData.department ?? null,
      yearLevel: userData.year_level ?? null,
      approvalStatus: 'approved',
      isActive: true,
    },
  });

  return mapUserRecord(user);
}

export async function updateUserApprovalStatus(
  userId: string,
  status: 'pending' | 'approved' | 'rejected',
  reviewedBy: string,
  reviewNotes?: string
): Promise<User | null> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      approvalStatus: toApprovalStatus(status),
      reviewedById: reviewedBy,
      reviewedAt: new Date(),
      reviewNotes: reviewNotes ?? null,
    },
  });

  return user ? mapUserRecord(user) : null;
}

export async function getAllUsers(): Promise<User[]> {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return users.map(mapUserRecord);
}

// ============================================================
// BOOK REPOSITORY
// ============================================================

export async function getAllBooks(limit = 100): Promise<Book[]> {
  const books = await prisma.book.findMany({
    take: limit,
    orderBy: {
      title: 'asc',
    },
    include: bookInclude,
  });

  return mapBooks(books);
}

export async function getBooksByIds(bookIds: number[]): Promise<Book[]> {
  if (bookIds.length === 0) {
    return [];
  }

  const books = await prisma.book.findMany({
    where: {
      id: {
        in: bookIds,
      },
    },
    include: bookInclude,
  });

  const mapped = await mapBooks(books);
  const order = new Map(bookIds.map((bookId, index) => [bookId, index]));

  return mapped.sort((left, right) => (order.get(left.book_id) ?? 0) - (order.get(right.book_id) ?? 0));
}

export async function getBookById(bookId: number): Promise<Book | null> {
  const book = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
    include: bookInclude,
  });

  if (!book) {
    return null;
  }

  const [mapped] = await mapBooks([book]);
  return mapped ?? null;
}

export async function searchBooks(searchTerm: string): Promise<Book[]> {
  const books = await prisma.book.findMany({
    where: {
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { author: { contains: searchTerm, mode: 'insensitive' } },
        { genre: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
    orderBy: {
      title: 'asc',
    },
    include: bookInclude,
  });

  return mapBooks(books);
}

export async function getBooksByGenre(genre: string): Promise<Book[]> {
  const books = await prisma.book.findMany({
    where: {
      genre,
    },
    orderBy: {
      title: 'asc',
    },
    include: bookInclude,
  });

  return mapBooks(books);
}

export async function getFeaturedBooks(): Promise<Book[]> {
  const books = await prisma.book.findMany({
    where: {
      featured: true,
    },
    orderBy: {
      title: 'asc',
    },
    include: bookInclude,
  });

  return mapBooks(books);
}

export async function getNewAcquisitions(limit = 10): Promise<Book[]> {
  const books = await prisma.book.findMany({
    take: limit,
    orderBy: {
      dateAdded: 'desc',
    },
    include: bookInclude,
  });

  return mapBooks(books);
}

export async function createBook(bookData: CreateBookInput): Promise<Book> {
  const stockQuantity = Math.max(1, normalizeNonNegativeInteger(bookData.stock_quantity, 1));
  const availableCopies = Math.max(
    0,
    Math.min(stockQuantity, normalizeNonNegativeInteger(bookData.available_copies, stockQuantity))
  );
  const courses = normalizeCourses(bookData.courses);

  const book = await prisma.book.create({
    data: {
      title: bookData.title.trim(),
      author: bookData.author.trim(),
      genre: bookData.genre.trim(),
      description: bookData.description ?? null,
      pages: bookData.pages ?? null,
      publicationYear: bookData.publication_year ?? null,
      stockQuantity,
      availableCopies,
      status: bookData.status ?? (availableCopies > 0 ? 'Available' : 'Borrowed'),
      location: bookData.location ?? null,
      colorTheme: bookData.color_theme ?? null,
      featured: bookData.featured ?? false,
      courses: courses.length > 0
        ? {
            create: courses.map((courseName) => ({
              courseName,
            })),
          }
        : undefined,
    },
    include: bookInclude,
  });

  const [mappedBook] = await mapBooks([book]);
  if (!mappedBook) {
    throw new Error('Failed to map created book.');
  }
  return mappedBook;
}

export async function updateBookFeatured(bookId: number, featured: boolean): Promise<Book> {
  const book = await prisma.book.update({
    where: {
      id: bookId,
    },
    data: {
      featured,
    },
    include: bookInclude,
  });

  const [mappedBook] = await mapBooks([book]);
  if (!mappedBook) {
    throw new Error('Failed to map updated book.');
  }
  return mappedBook;
}

export async function deleteBook(bookId: number): Promise<boolean> {
  try {
    await prisma.book.delete({
      where: {
        id: bookId,
      },
    });

    return true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return false;
    }

    throw error;
  }
}

export async function incrementBookViews(bookId: number): Promise<void> {
  await prisma.book.update({
    where: {
      id: bookId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });
}

// ============================================================
// BORROW RECORD REPOSITORY
// ============================================================

export async function borrowBook(
  userId: string,
  bookId: number,
  dueDate: Date
): Promise<BorrowRecord> {
  const borrow = await prisma.$transaction(async (tx) => {
    const book = await tx.book.findUnique({
      where: { id: bookId },
      select: {
        availableCopies: true,
      },
    });

    if (!book || book.availableCopies <= 0) {
      throw new Error('Book is not available');
    }

    const createdBorrow = await tx.borrowRecord.create({
      data: {
        userId,
        bookId,
        dueDate,
        status: 'active',
      },
      include: borrowInclude,
    });

    await tx.book.update({
      where: {
        id: bookId,
      },
      data: {
        availableCopies: {
          decrement: 1,
        },
        status: book.availableCopies - 1 === 0 ? 'Borrowed' : undefined,
      },
    });

    return createdBorrow;
  });

  return mapBorrowRecord(borrow);
}

export async function returnBook(borrowId: number): Promise<BorrowRecord | null> {
  const borrow = await prisma.$transaction(async (tx) => {
    const existing = await tx.borrowRecord.findUnique({
      where: {
        id: borrowId,
      },
      select: {
        bookId: true,
      },
    });

    if (!existing) {
      return null;
    }

    const updatedBorrow = await tx.borrowRecord.update({
      where: {
        id: borrowId,
      },
      data: {
        returnedDate: new Date(),
        status: 'returned',
      },
      include: borrowInclude,
    });

    await tx.book.update({
      where: {
        id: existing.bookId,
      },
      data: {
        availableCopies: {
          increment: 1,
        },
        status: 'Available',
        borrowCount: {
          increment: 1,
        },
      },
    });

    return updatedBorrow;
  });

  return borrow ? mapBorrowRecord(borrow) : null;
}

export async function getActiveBorrowsByUserId(userId: string): Promise<BorrowRecord[]> {
  const borrows = await prisma.borrowRecord.findMany({
    where: {
      userId,
      status: 'active',
    },
    orderBy: {
      dueDate: 'asc',
    },
    include: borrowInclude,
  });

  return borrows.map(mapBorrowRecord);
}

export async function getBorrowHistoryByUserId(userId: string): Promise<BorrowRecord[]> {
  const borrows = await prisma.borrowRecord.findMany({
    where: {
      userId,
    },
    orderBy: {
      borrowedDate: 'desc',
    },
    include: borrowInclude,
  });

  return borrows.map(mapBorrowRecord);
}

export async function getOverdueBorrows(): Promise<BorrowRecord[]> {
  const borrows = await prisma.borrowRecord.findMany({
    where: {
      status: 'active',
      dueDate: {
        lt: new Date(),
      },
    },
    orderBy: {
      dueDate: 'asc',
    },
    include: borrowInclude,
  });

  return borrows.map(mapBorrowRecord);
}

// ============================================================
// ACCOUNT REQUEST REPOSITORY
// ============================================================

export async function createAccountRequest(
  requestData: Partial<AccountRequest> & {
    full_name: string;
    email: string;
    requested_role: string;
    user_type: string;
  }
): Promise<AccountRequest> {
  const record = await prisma.accountRequest.create({
    data: {
      fullName: requestData.full_name,
      email: requestData.email,
      requestedRole: toUserRole(requestData.requested_role),
      userType: requestData.user_type,
      course: requestData.course ?? null,
      department: requestData.department ?? null,
      yearLevel: requestData.year_level ?? null,
      idDocumentPath:
        requestData.id_document_path ??
        ((requestData as Partial<{ id_document: string }>).id_document ?? null),
    },
  });

  return mapAccountRequestRecord(record);
}

export async function getAllAccountRequests(): Promise<AccountRequest[]> {
  const requests = await prisma.accountRequest.findMany({
    orderBy: {
      requestedAt: 'desc',
    },
  });

  return requests.map(mapAccountRequestRecord);
}

export async function getPendingAccountRequests(): Promise<AccountRequest[]> {
  const requests = await prisma.accountRequest.findMany({
    where: {
      status: 'pending',
    },
    orderBy: {
      requestedAt: 'desc',
    },
  });

  return requests.map(mapAccountRequestRecord);
}

export async function approveAccountRequest(
  requestId: string,
  reviewedBy: string,
  reviewNotes?: string
): Promise<AccountRequest | null> {
  const request = await prisma.accountRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: 'approved',
      reviewedById: reviewedBy,
      reviewedAt: new Date(),
      reviewNotes: reviewNotes ?? null,
    },
  });

  return request ? mapAccountRequestRecord(request) : null;
}

export async function rejectAccountRequest(
  requestId: string,
  reviewedBy: string,
  reviewNotes: string
): Promise<AccountRequest | null> {
  const request = await prisma.accountRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: 'rejected',
      reviewedById: reviewedBy,
      reviewedAt: new Date(),
      reviewNotes,
    },
  });

  return request ? mapAccountRequestRecord(request) : null;
}

// ============================================================
// STATISTICS
// ============================================================

export async function getDatabaseStatistics() {
  const [totalUsers, totalBooks, activeBorrows, pendingRequests] = await Promise.all([
    prisma.user.count(),
    prisma.book.count(),
    prisma.borrowRecord.count({ where: { status: 'active' } }),
    prisma.accountRequest.count({ where: { status: 'pending' } }),
  ]);

  return {
    totalUsers,
    totalBooks,
    activeBorrows,
    pendingRequests,
  };
}

// ============================================================
// JOURNALS
// ============================================================

export async function getJournals(subject?: string): Promise<Journal[]> {
  const journals = await prisma.journal.findMany({
    where: subject
      ? {
          subject,
        }
      : undefined,
    orderBy: {
      title: 'asc',
    },
  });

  return journals.map((journal) => ({
    journal_id: journal.id,
    title: journal.title,
    publisher: journal.publisher,
    subject: journal.subject,
    impact_factor: journal.impactFactor ? Number(journal.impactFactor) : null,
    access_url: journal.accessUrl,
    journal_type: journalTypeLabels[journal.journalType],
    created_at: journal.createdAt,
  }));
}

// ============================================================
// READING LISTS
// ============================================================

export async function getReadingListsByFacultyId(facultyId: string): Promise<ReadingList[]> {
  const readingLists = await prisma.readingList.findMany({
    where: {
      facultyId,
    },
    include: {
      books: {
        select: {
          bookId: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return readingLists.map((list) => ({
    reading_list_id: list.id,
    title: list.title,
    faculty_id: list.facultyId,
    description: list.description,
    student_count: list.studentCount,
    is_active: list.isActive,
    created_at: list.createdAt,
    updated_at: list.updatedAt,
    book_ids: list.books.map((book) => book.bookId),
  }));
}

// ============================================================
// NOTIFICATIONS
// ============================================================

export async function getNotificationsByUserId(
  userId: string,
  unreadOnly = false
): Promise<Notification[]> {
  const notifications = await prisma.notification.findMany({
    where: {
      userId,
      ...(unreadOnly ? { isRead: false } : {}),
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return notifications.map(mapNotificationRecord);
}

// ============================================================
// REVIEWS
// ============================================================

export async function getReviewsByBookId(bookId: number): Promise<Review[]> {
  const reviews = await prisma.review.findMany({
    where: {
      bookId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return reviews.map(mapReviewRecord);
}
