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
}

// 2. Mock Users
export const MOCK_USERS: User[] = [
  { id: '1', name: 'John Student', email: 'john@usant.edu', role: 'student', userType: 'Undergraduate Student' },
  { id: '2', name: 'Dr. Robert Johnson', email: 'rob@usant.edu', role: 'faculty', userType: 'Professor' },
  { id: '3', name: 'Maria Santos', email: 'maria@usant.edu', role: 'staff', userType: 'Librarian' },
  { id: '4', name: 'Admin User', email: 'admin@usant.edu', role: 'admin', userType: 'System Administrator' },
];