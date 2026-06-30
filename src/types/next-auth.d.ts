import type { DefaultSession } from 'next-auth';
import type { UserRole } from '@/types/user';

declare module 'next-auth' {
  interface User {
    role: UserRole;
    studentId: string;
    ticketEmail?: string;
  }

  interface Session {
    user: {
      id: string;
      role: UserRole;
      studentId: string;
      ticketEmail?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    studentId: string;
    ticketEmail?: string;
  }
}
