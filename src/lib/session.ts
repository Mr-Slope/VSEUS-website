import type { Session } from 'next-auth';
import { auth } from '@/auth';

export type SessionUser = Session['user'];

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  return session?.user ?? null;
}

/** Throws if not signed in. Returns the session user. */
export async function requireMember(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error('You must be signed in.');
  return user;
}

/** Throws unless the signed-in user is an admin. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireMember();
  if (user.role !== 'admin') throw new Error('Admin access required.');
  return user;
}
