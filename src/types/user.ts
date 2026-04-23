export type UserRole = 'member' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  studentId: string;
  role: UserRole;
  registeredEvents: string[];
  createdAt: string;
  ticketEmail?: string;
}
