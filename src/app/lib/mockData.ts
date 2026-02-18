// lib/mockData.ts

export type UserRole = 'student' | 'faculty' | 'staff' | 'admin';

export type UserType = 
  | 'Undergraduate Student' | 'Graduate Student (Master’s)' | 'Graduate Student (PhD)' | 'Distance/Online Learner'
  | 'Professor' | 'Lecturer' | 'Researcher'
  | 'Administrative Staff' | 'Technical/Support Staff' | 'Librarian'
  | 'System Administrator';

// 1. Dynamic Mapping: userTypesByRole
export const userTypesByRole: Record<UserRole, UserType[]> = {
  student: [
    'Undergraduate Student', 
    'Graduate Student (Master’s)', 
    'Graduate Student (PhD)', 
    'Distance/Online Learner'
  ],
  faculty: [
    'Professor', 
    'Lecturer', 
    'Researcher'
  ],
  staff: [
    'Administrative Staff', 
    'Technical/Support Staff', 
    'Librarian'
  ],
  admin: [
    'System Administrator'
  ]
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  userType: UserType;
  course?: string;
  department?: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  color: string;
  rating: number;
  year: number;
  stock: boolean;
  courses: string[];
  description?: string;
  pages?: number;
  status?: string;
  reviewCount?: number;
  dateAdded: string; // For New Acquisitions
  borrowCount: number; // For Analytics
  views: number; // For Analytics
}

export interface Journal {
  id: number;
  title: string;
  publisher: string;
  subject: string;
  impactFactor: number;
  accessUrl: string;
  type: 'Journal' | 'Reference';
}

export interface ReadingList {
  id: number;
  title: string;
  facultyId: string;
  bookIds: number[];
  studentCount: number;
}

export interface BorrowRecord {
  userId: string;
  bookId: number;
  timestamp: string;
}

export interface Notification {
  id: number;
  userId: string;
  title: string;
  message: string;
  type: 'availability' | 'reminder' | 'system';
  timestamp: string;
  read: boolean;
  bookId?: number;
}

export interface Review {
  id: number;
  bookId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: string;
}

// 2. Mock Users
export const MOCK_USERS: User[] = [
  { id: '1', name: 'John Student', email: 'john@usant.edu', role: 'student', userType: 'Undergraduate Student', course: 'Computer Science' },
  { id: '2', name: 'Alice Smith', email: 'alice@usant.edu', role: 'student', userType: 'Undergraduate Student', course: 'Computer Science' },
  { id: '3', name: 'Bob Brown', email: 'bob@usant.edu', role: 'student', userType: 'Graduate Student (Master’s)', course: 'Information Tech' },
  { id: '4', name: 'Charlie Davis', email: 'charlie@usant.edu', role: 'student', userType: 'Undergraduate Student', course: 'Computer Science' },
  { id: '5', name: 'Diana Prince', email: 'diana@usant.edu', role: 'student', userType: 'Undergraduate Student', course: 'Engineering' },
  { id: '6', name: 'Dr. Robert Johnson', email: 'rob@usant.edu', role: 'faculty', userType: 'Professor', department: 'Computer Science' },
];

// 3. Mock Books
export const ALL_BOOKS: Book[] = [
  // Computer Science
  { 
    id: 1, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', genre: 'Computer Science', color: 'bg-red-900', rating: 4.8, year: 2009, stock: true, courses: ['Computer Science'],
    description: "This title covers a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers.", pages: 1312, status: 'Available', reviewCount: 124,
    dateAdded: '2023-01-15', borrowCount: 156, views: 1200
  },
  { 
    id: 2, title: 'Clean Code', author: 'Robert C. Martin', genre: 'Software Engineering', color: 'bg-blue-800', rating: 4.9, year: 2008, stock: true, courses: ['Computer Science', 'Information Tech'],
    description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", pages: 464, status: 'Available', reviewCount: 89,
    dateAdded: '2023-02-20', borrowCount: 210, views: 1500
  },
  { 
    id: 3, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', genre: 'Software Engineering', color: 'bg-slate-700', rating: 4.7, year: 1999, stock: false, courses: ['Computer Science', 'Information Tech'],
    description: "The Pragmatic Programmer is one of those rare tech books you'll read, re-read, and read again over the years.", pages: 352, status: 'Borrowed', reviewCount: 56,
    dateAdded: '2023-03-10', borrowCount: 145, views: 980
  },
  { id: 4, title: 'Design Patterns', author: 'Erich Gamma', genre: 'Computer Science', color: 'bg-emerald-800', rating: 4.6, year: 1994, stock: true, courses: ['Computer Science'], reviewCount: 42, dateAdded: '2023-04-05', borrowCount: 98, views: 760 },
  { id: 19, title: 'Deep Work', author: 'Cal Newport', genre: 'Productivity', color: 'bg-zinc-700', rating: 4.7, year: 2016, stock: true, courses: ['Computer Science', 'General'], reviewCount: 75, dateAdded: '2025-02-01', borrowCount: 85, views: 640 },

  // New Acquisitions
  { id: 21, title: 'AI: A Modern Approach', author: 'Stuart Russell', genre: 'Computer Science', color: 'bg-indigo-700', rating: 4.9, year: 2021, stock: true, courses: ['Computer Science'], dateAdded: '2026-02-10', borrowCount: 5, views: 150 },
  { id: 22, title: 'Modern Operating Systems', author: 'Andrew Tanenbaum', genre: 'Computer Science', color: 'bg-slate-800', rating: 4.7, year: 2022, stock: true, courses: ['Computer Science'], dateAdded: '2026-02-15', borrowCount: 2, views: 80 },

  // Engineering
  { id: 8, title: 'Engineering Mechanics', author: 'J.L. Meriam', genre: 'Engineering', color: 'bg-stone-700', rating: 4.5, year: 2015, stock: true, courses: ['Engineering'], dateAdded: '2023-05-12', borrowCount: 45, views: 320 },
  { id: 9, title: 'Electric Circuits', author: 'James W. Nilsson', genre: 'Electronics', color: 'bg-yellow-700', rating: 4.4, year: 2014, stock: true, courses: ['Engineering'], dateAdded: '2023-06-20', borrowCount: 38, views: 290 },
];

// 4. Journals & References
export const MOCK_JOURNALS: Journal[] = [
  { id: 1, title: 'IEEE Transactions on Software Engineering', publisher: 'IEEE', subject: 'Computer Science', impactFactor: 9.6, accessUrl: '#', type: 'Journal' },
  { id: 2, title: 'ACM Computing Surveys', publisher: 'ACM', subject: 'Computer Science', impactFactor: 14.3, accessUrl: '#', type: 'Journal' },
  { id: 3, title: 'Encyclopedia of Computer Science', publisher: 'Wiley', subject: 'Computer Science', impactFactor: 0, accessUrl: '#', type: 'Reference' },
  { id: 4, title: 'Nature Electronics', publisher: 'Nature', subject: 'Engineering', impactFactor: 33.2, accessUrl: '#', type: 'Journal' },
];

// 5. Reading Lists
export const MOCK_READING_LISTS: ReadingList[] = [
  { id: 1, title: 'CS101: Core Fundamentals', facultyId: '6', bookIds: [1, 2, 4], studentCount: 45 },
  { id: 2, title: 'Advanced Software Patterns', facultyId: '6', bookIds: [4, 2], studentCount: 28 },
];

// 6. Mock Borrow History
export const MOCK_BORROW_HISTORY: BorrowRecord[] = [
  { userId: '2', bookId: 1, timestamp: '2025-01-01' },
  { userId: '2', bookId: 2, timestamp: '2025-01-05' },
];

// 7. Mock Notifications
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, userId: '1', title: 'Book Available', message: 'The book "The Pragmatic Programmer" is now available for borrowing.', type: 'availability', timestamp: '2026-02-18T10:30:00Z', read: false, bookId: 3 },
];

// 8. Mock Reviews
export const MOCK_REVIEWS: Review[] = [
  { id: 1, bookId: 1, userId: '2', userName: 'Alice Smith', rating: 5, comment: "Essential for every CS student.", timestamp: '2025-12-10' },
];

// Helpers
export function getCollaborativeRecommendations(currentUserId: string, limit: number = 4, overriddenCourse?: string): Book[] {
  const currentUser = MOCK_USERS.find(u => u.id === currentUserId);
  if (!currentUser) return [];
  const effectiveCourse = overriddenCourse || currentUser.course;
  const similarUsers = MOCK_USERS.filter(u => u.id !== currentUserId && u.course === effectiveCourse);
  const similarUserIds = similarUsers.map(u => u.id);
  const booksBorrowedBySimilarUsers = MOCK_BORROW_HISTORY.filter(record => similarUserIds.includes(record.userId)).map(record => record.bookId);
  const bookCounts: Record<number, number> = {};
  booksBorrowedBySimilarUsers.forEach(id => { bookCounts[id] = (bookCounts[id] || 0) + 1; });
  const sortedBookIds = Object.keys(bookCounts).map(Number).sort((a, b) => bookCounts[b] - bookCounts[a]);
  const recommendedBooks = sortedBookIds.map(id => ALL_BOOKS.find(b => b.id === id)).filter((b): b is Book => b !== undefined).slice(0, limit);
  return recommendedBooks;
}

export function getLocalWishlist(): number[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('wishlist');
  return saved ? JSON.parse(saved) : [];
}

export function toggleLocalWishlist(bookId: number): number[] {
  if (typeof window === 'undefined') return [];
  const wishlist = getLocalWishlist();
  const index = wishlist.indexOf(bookId);
  let newWishlist;
  if (index === -1) { newWishlist = [...wishlist, bookId]; } else { newWishlist = wishlist.filter(id => id !== bookId); }
  localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  return newWishlist;
}

export function getReviewsByBookId(bookId: number): Review[] {
  return MOCK_REVIEWS.filter(r => r.bookId === bookId);
}
