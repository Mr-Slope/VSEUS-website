'use server';

import { and, eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { events, members, registrations } from '@/db/schema';
import { getMyRegisteredEventIds, toRegistration } from '@/db/queries';
import { requireMember } from '@/lib/session';
import type { QuestionAnswer, Registration } from '@/types/event';

/** Event IDs the signed-in member is registered for (for client UI state). */
export async function myRegisteredEventIds(): Promise<string[]> {
  const sessionUser = await requireMember();
  return getMyRegisteredEventIds(sessionUser.id);
}

function revalidateAll() {
  revalidatePath('/portal/events');
  revalidatePath('/portal/tickets');
  revalidatePath('/portal');
  revalidatePath('/admin/events');
}

export async function registerForEvent(
  eventId: string,
  answers: QuestionAnswer[] = [],
  ticketEmail?: string,
): Promise<Registration> {
  const sessionUser = await requireMember();

  const created = await db.transaction(async (tx) => {
    const [member] = await tx
      .select()
      .from(members)
      .where(eq(members.id, sessionUser.id))
      .limit(1);
    if (!member) throw new Error('Member not found.');

    // Lock the event row so concurrent registrations can't oversell capacity.
    const [event] = await tx
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1)
      .for('update');
    if (!event) throw new Error('Event not found.');
    if (event.registeredCount >= event.capacity) throw new Error('This event is full.');

    const resolvedTicketEmail = ticketEmail?.trim() || member.ticketEmail || member.email;
    if (!resolvedTicketEmail) {
      throw new Error('A ticket email is required.');
    }

    let row;
    try {
      [row] = await tx
        .insert(registrations)
        .values({
          memberId: member.id,
          eventId,
          userName: member.name,
          userEmail: member.email ?? '',
          userStudentId: member.studentId ?? '',
          ticketEmail: resolvedTicketEmail,
          answers,
        })
        .returning();
    } catch (err) {
      // Unique (member_id, event_id) violation → already registered.
      if (err instanceof Error && /unique|duplicate/i.test(err.message)) {
        throw new Error('You are already registered for this event.');
      }
      throw err;
    }

    await tx
      .update(events)
      .set({ registeredCount: sql`${events.registeredCount} + 1` })
      .where(eq(events.id, eventId));

    return row;
  });

  revalidateAll();
  return toRegistration(created);
}

export async function unregisterForEvent(eventId: string): Promise<void> {
  const sessionUser = await requireMember();

  await db.transaction(async (tx) => {
    const deleted = await tx
      .delete(registrations)
      .where(and(eq(registrations.memberId, sessionUser.id), eq(registrations.eventId, eventId)))
      .returning({ id: registrations.id });

    if (deleted.length > 0) {
      await tx
        .update(events)
        .set({ registeredCount: sql`greatest(${events.registeredCount} - 1, 0)` })
        .where(eq(events.id, eventId));
    }
  });

  revalidateAll();
}
