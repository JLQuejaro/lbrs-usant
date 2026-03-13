export type UserRole = 'student' | 'faculty' | 'staff' | 'admin';

export type UserType =
  | "Undergraduate Student"
  | "Graduate Student (Master's)"
  | "Graduate Student (PhD)"
  | "Distance/Online Learner"
  | "Professor"
  | "Lecturer"
  | "Researcher"
  | "Administrative Staff"
  | "Technical/Support Staff"
  | "Librarian"
  | "System Administrator";

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export const userTypesByRole: Record<UserRole, UserType[]> = {
  student: [
    "Undergraduate Student",
    "Graduate Student (Master's)",
    "Graduate Student (PhD)",
    "Distance/Online Learner",
  ],
  faculty: [
    "Professor",
    "Lecturer",
    "Researcher",
  ],
  staff: [
    "Administrative Staff",
    "Technical/Support Staff",
    "Librarian",
  ],
  admin: [
    "System Administrator",
  ],
};
