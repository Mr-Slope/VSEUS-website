'use client';

import React, { createContext, useContext } from 'react';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import { User, UserRole } from '@/types/user';
import { QuestionAnswer, Registration } from '@/types/event';
import { registerForEvent, unregisterForEvent } from '@/app/actions/registrations';
import { updateTicketEmail } from '@/app/actions/profile';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (code: string) => Promise<UserRole>;
  logout: () => Promise<void>;
  registerEvent: (
    eventId: string,
    answers?: QuestionAnswer[],
    ticketEmail?: string,
  ) => Promise<Registration>;
  unregisterEvent: (eventId: string) => Promise<void>;
  saveTicketEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const LOGIN_FAILED =
  'That code didn’t work, or there have been too many attempts. Please wait a few minutes and try again.';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status, update } = useSession();

  // Adapt the Auth.js session to the existing `User` shape. `registeredEvents`
  // is no longer carried in the session; client views that need it fetch the
  // IDs via the `myRegisteredEventIds` action.
  const user: User | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email ?? '',
        name: session.user.name ?? '',
        studentId: session.user.studentId,
        role: session.user.role,
        registeredEvents: [],
        createdAt: '',
        ticketEmail: session.user.ticketEmail,
      }
    : null;

  async function login(code: string): Promise<UserRole> {
    const res = await signIn('credentials', { code, redirect: false });
    if (!res || res.error) throw new Error(LOGIN_FAILED);
    const fresh = await getSession();
    return fresh?.user?.role ?? 'member';
  }

  async function logout() {
    await signOut({ redirect: false });
  }

  async function registerEvent(
    eventId: string,
    answers: QuestionAnswer[] = [],
    ticketEmail?: string,
  ): Promise<Registration> {
    return registerForEvent(eventId, answers, ticketEmail);
  }

  async function unregisterEvent(eventId: string): Promise<void> {
    await unregisterForEvent(eventId);
  }

  async function saveTicketEmail(email: string): Promise<void> {
    const saved = await updateTicketEmail(email);
    // Refresh the session token so the new ticket email is reflected immediately.
    await update({ ticketEmail: saved });
  }

  return (
    <AuthContext.Provider
      value={{ user, loading: status === 'loading', login, logout, registerEvent, unregisterEvent, saveTicketEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
}
