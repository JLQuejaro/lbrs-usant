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
];

// 3. Mock Books
export const ALL_BOOKS: Book[] = [
  // Computer Science
  { 
    id: 1, 
    title: 'Introduction to Algorithms', 
    author: 'Thomas H. Cormen', 
    genre: 'Computer Science', 
    color: 'bg-red-900', 
    rating: 4.8, 
    year: 2009, 
    stock: true, 
    courses: ['Computer Science'],
    description: "This title covers a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers.",
    pages: 1312,
    status: 'Available',
    reviewCount: 124
  },
  { 
    id: 2, 
    title: 'Clean Code', 
    author: 'Robert C. Martin', 
    genre: 'Software Engineering', 
    color: 'bg-blue-800', 
    rating: 4.9, 
    year: 2008, 
    stock: true, 
    courses: ['Computer Science', 'Information Tech'],
    description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
    pages: 464,
    status: 'Available',
    reviewCount: 89
  },
  { 
    id: 3, 
    title: 'The Pragmatic Programmer', 
    author: 'Andrew Hunt', 
    genre: 'Software Engineering', 
    color: 'bg-slate-700', 
    rating: 4.7, 
    year: 1999, 
    stock: false, 
    courses: ['Computer Science', 'Information Tech'],
    description: "The Pragmatic Programmer is one of those rare tech books you'll read, re-read, and read again over the years.",
    pages: 352,
    status: 'Borrowed',
    reviewCount: 56
  },
  { id: 4, title: 'Design Patterns', author: 'Erich Gamma', genre: 'Computer Science', color: 'bg-emerald-800', rating: 4.6, year: 1994, stock: true, courses: ['Computer Science'], reviewCount: 42 },
  
  // Information Tech
  { id: 5, title: 'The Phoenix Project', author: 'Gene Kim', genre: 'IT Management', color: 'bg-orange-700', rating: 4.8, year: 2013, stock: true, courses: ['Information Tech', 'Computer Science'], reviewCount: 35 },
  { id: 6, title: 'Network Warrior', author: 'Gary A. Donahue', genre: 'Networking', color: 'bg-indigo-900', rating: 4.6, year: 2011, stock: true, courses: ['Information Tech'], reviewCount: 28 },
  { id: 7, title: 'Web Design with HTML, CSS', author: 'Jon Duckett', genre: 'Web Development', color: 'bg-pink-800', rating: 4.9, year: 2011, stock: true, courses: ['Information Tech', 'Computer Science'], reviewCount: 110 },
  
  // Engineering
  { id: 8, title: 'Engineering Mechanics', author: 'J.L. Meriam', genre: 'Engineering', color: 'bg-stone-700', rating: 4.5, year: 2015, stock: true, courses: ['Engineering'], reviewCount: 15 },
  { id: 9, title: 'Electric Circuits', author: 'James W. Nilsson', genre: 'Electronics', color: 'bg-yellow-700', rating: 4.4, year: 2014, stock: true, courses: ['Engineering'], reviewCount: 22 },
  { id: 10, title: 'Thermodynamics: An Engineering Approach', author: 'Yunus A. Cengel', genre: 'Engineering', color: 'bg-red-800', rating: 4.7, year: 2018, stock: true, courses: ['Engineering'], reviewCount: 31 },
  { id: 11, title: 'Materials Science and Engineering', author: 'William D. Callister', genre: 'Engineering', color: 'bg-gray-600', rating: 4.8, year: 2013, stock: false, courses: ['Engineering'], reviewCount: 19 },

  // Education
  { id: 12, title: 'The First Days of School', author: 'Harry K. Wong', genre: 'Education', color: 'bg-teal-700', rating: 4.9, year: 2018, stock: true, courses: ['Education'], reviewCount: 45 },
  { id: 13, title: 'Mindset: The New Psychology', author: 'Carol S. Dweck', genre: 'Psychology', color: 'bg-blue-600', rating: 4.6, year: 2006, stock: true, courses: ['Education'], reviewCount: 67 },
  { id: 14, title: 'Pedagogy of the Oppressed', author: 'Paulo Freire', genre: 'Education', color: 'bg-purple-800', rating: 4.8, year: 1968, stock: true, courses: ['Education'], reviewCount: 88 },
  
  // General / Fiction / Others
  { id: 15, title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', color: 'bg-amber-700', rating: 4.9, year: 1960, stock: true, courses: ['Education', 'General'], reviewCount: 250 },
  { id: 16, title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'History', color: 'bg-orange-800', rating: 4.5, year: 2011, stock: true, courses: ['History', 'General'], reviewCount: 180 },
  { id: 17, title: 'The Psychology of Money', author: 'Morgan Housel', genre: 'Finance', color: 'bg-green-700', rating: 4.8, year: 2020, stock: true, courses: ['Finance', 'General'], reviewCount: 95 },
  { id: 18, title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', color: 'bg-yellow-600', rating: 4.9, year: 2018, stock: true, courses: ['General', 'Education'], reviewCount: 300 },
  { id: 19, title: 'Deep Work', author: 'Cal Newport', genre: 'Productivity', color: 'bg-zinc-700', rating: 4.7, year: 2016, stock: true, courses: ['Computer Science', 'General'], reviewCount: 75 },
  { id: 20, title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', genre: 'Psychology', color: 'bg-cyan-800', rating: 4.6, year: 2011, stock: true, courses: ['Psychology', 'General'], reviewCount: 140 },
];

// 4. Mock Borrow History (userId, bookId)
export const MOCK_BORROW_HISTORY: BorrowRecord[] = [
  // Alice (Computer Science)
  { userId: '2', bookId: 1, timestamp: '2025-01-01' },
  { userId: '2', bookId: 2, timestamp: '2025-01-05' },
  { userId: '2', bookId: 5, timestamp: '2025-01-10' },
  { userId: '2', bookId: 19, timestamp: '2025-01-15' },

  // Charlie (Computer Science)
  { userId: '4', bookId: 1, timestamp: '2025-01-02' },
  { userId: '4', bookId: 4, timestamp: '2025-01-06' },
  { userId: '4', bookId: 19, timestamp: '2025-01-11' },

  // Bob (Information Tech)
  { userId: '3', bookId: 5, timestamp: '2025-01-03' },
  { userId: '3', bookId: 6, timestamp: '2025-01-07' },
  { userId: '3', bookId: 7, timestamp: '2025-01-12' },

  // Diana (Engineering)
  { userId: '5', bookId: 8, timestamp: '2025-01-04' },
  { userId: '5', bookId: 9, timestamp: '2025-01-08' },
  { userId: '5', bookId: 10, timestamp: '2025-01-13' },
];

// 5. Mock Notifications
export const MOCK_NOTIFICATIONS: Notification[] = [
  { 
    id: 1, 
    userId: '1', 
    title: 'Book Available', 
    message: 'The book "The Pragmatic Programmer" is now available for borrowing.', 
    type: 'availability', 
    timestamp: '2026-02-18T10:30:00Z', 
    read: false,
    bookId: 3 
  },
  { 
    id: 2, 
    userId: '1', 
    title: 'Upcoming Due Date', 
    message: 'Your borrowed book "Introduction to Algorithms" is due in 2 days.', 
    type: 'reminder', 
    timestamp: '2026-02-17T09:00:00Z', 
    read: true,
    bookId: 1 
  },
  { 
    id: 3, 
    userId: '1', 
    title: 'Welcome to LBRS', 
    message: 'Welcome to the USANT Library System! Explore our vast collection.', 
    type: 'system', 
    timestamp: '2026-02-15T08:00:00Z', 
    read: true 
  },
];

// 6. Mock Reviews
export const MOCK_REVIEWS: Review[] = [
  { id: 1, bookId: 1, userId: '2', userName: 'Alice Smith', rating: 5, comment: "Essential for every CS student. Challenging but rewarding.", timestamp: '2025-12-10' },
  { id: 2, bookId: 1, userId: '4', userName: 'Charlie Davis', rating: 4, comment: "A bit dense, but the pseudocode is very clear.", timestamp: '2026-01-05' },
  { id: 3, bookId: 2, userId: '2', userName: 'Alice Smith', rating: 5, comment: "Changed the way I think about writing code. Must read!", timestamp: '2025-11-20' },
  { id: 4, bookId: 3, userId: '3', userName: 'Bob Brown', rating: 5, comment: "Practical advice that you can apply immediately.", timestamp: '2026-01-15' },
  { id: 5, bookId: 5, userId: '3', userName: 'Bob Brown', rating: 4, comment: "Great introduction to DevOps and IT management through a story.", timestamp: '2025-10-05' },
];

// Collaborative Filtering Helper
export function getCollaborativeRecommendations(currentUserId: string, limit: number = 4, overriddenCourse?: string): Book[] {
  const currentUser = MOCK_USERS.find(u => u.id === currentUserId);
  if (!currentUser) return [];

  const effectiveCourse = overriddenCourse || currentUser.course;

  // 1. Find users with similar profile (e.g., same course)
  const similarUsers = MOCK_USERS.filter(u => u.id !== currentUserId && u.course === effectiveCourse);
  const similarUserIds = similarUsers.map(u => u.id);

  // 2. Find books borrowed by these similar users
  const booksBorrowedBySimilarUsers = MOCK_BORROW_HISTORY
    .filter(record => similarUserIds.includes(record.userId))
    .map(record => record.bookId);

  // 3. Count occurrences of each book
  const bookCounts: Record<number, number> = {};
  booksBorrowedBySimilarUsers.forEach(id => {
    bookCounts[id] = (bookCounts[id] || 0) + 1;
  });

  // 4. Sort books by popularity among similar users
  const sortedBookIds = Object.keys(bookCounts)
    .map(Number)
    .sort((a, b) => bookCounts[b] - bookCounts[a]);

  // 5. Get the book objects, excluding ones the current user might have already borrowed
  const recommendedBooks = sortedBookIds
    .map(id => ALL_BOOKS.find(b => b.id === id))
    .filter((b): b is Book => b !== undefined)
    .slice(0, limit);

  return recommendedBooks;
}

// Get Wishlist from localStorage (Client-side helper)
export function getLocalWishlist(): number[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('wishlist');
  return saved ? JSON.parse(saved) : [];
}

// Toggle book in local wishlist
export function toggleLocalWishlist(bookId: number): number[] {
  if (typeof window === 'undefined') return [];
  const wishlist = getLocalWishlist();
  const index = wishlist.indexOf(bookId);
  let newWishlist;
  if (index === -1) {
    newWishlist = [...wishlist, bookId];
  } else {
    newWishlist = wishlist.filter(id => id !== bookId);
  }
  localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  return newWishlist;
}

export function getReviewsByBookId(bookId: number): Review[] {
  return MOCK_REVIEWS.filter(r => r.bookId === bookId);
}
