'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { registrations } from '@/db/schema';
import { getEvent, getEventRegistrations, toRegistration } from '@/db/queries';
import { requireAdmin } from '@/lib/session';
import type { Registration } from '@/types/event';

/** Header info for the scanner screen. */
export async function getScanInfo(
  eventId: string,
): Promise<{ title: string; attendedCount: number } | null> {
  await requireAdmin();
  const event = await getEvent(eventId);
  if (!event) return null;
  const regs = await getEventRegistrations(eventId);
  return { title: event.title, attendedCount: regs.filter((r) => r.attended).length };
}

/**
 * Look up a scanned ticket. Returns null when the QR payload isn't a known
 * registration or belongs to a different event.
 */
export async function lookupRegistration(
  registrationId: string,
  eventId: string,
): Promise<Registration | null> {
  await requireAdmin();
  if (!registrationId) return null;
  const [row] = await db
    .select()
    .from(registrations)
    .where(eq(registrations.id, registrationId))
    .limit(1);
  if (!row || row.eventId !== eventId) return null;
  return toRegistration(row);
}

export async function markAttended(registrationId: string): Promise<Registration | null> {
  await requireAdmin();
  const [row] = await db
    .update(registrations)
    .set({ attended: true, attendedAt: new Date() })
    .where(eq(registrations.id, registrationId))
    .returning();
  if (!row) return null;
  revalidatePath(`/admin/events/${row.eventId}`);
  return toRegistration(row);
}

export async function listEventRegistrations(eventId: string): Promise<Registration[]> {
  await requireAdmin();
  return getEventRegistrations(eventId);
}
