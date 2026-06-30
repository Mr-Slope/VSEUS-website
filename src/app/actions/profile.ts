'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { members } from '@/db/schema';
import { requireMember } from '@/lib/session';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function updateTicketEmail(email: string): Promise<string> {
  const sessionUser = await requireMember();
  const value = email.trim();
  if (!EMAIL_REGEX.test(value)) {
    throw new Error('Please enter a valid email address.');
  }
  await db.update(members).set({ ticketEmail: value }).where(eq(members.id, sessionUser.id));
  revalidatePath('/portal/profile');
  return value;
}
