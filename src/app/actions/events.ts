'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { events } from '@/db/schema';
import { toEvent } from '@/db/queries';
import { requireAdmin } from '@/lib/session';
import type { Event, EventQuestion } from '@/types/event';

export interface EventInput {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  isPaid: boolean;
  price: number | null;
  imageUrl: string | null;
  posterUrl: string | null;
  questions: EventQuestion[];
}

function normalize(input: EventInput) {
  return {
    title: input.title.trim(),
    description: input.description.trim(),
    date: input.date,
    time: input.time.trim(),
    location: input.location.trim(),
    category: input.category,
    capacity: input.capacity,
    isPaid: input.isPaid,
    price: input.isPaid ? input.price : null,
    imageUrl: input.imageUrl,
    posterUrl: input.posterUrl,
    questions: input.questions.filter((q) => q.text.trim()),
  };
}

export async function createEvent(input: EventInput): Promise<Event> {
  await requireAdmin();
  const [row] = await db.insert(events).values(normalize(input)).returning();
  revalidatePath('/admin/events');
  revalidatePath('/portal/events');
  revalidatePath('/events');
  return toEvent(row);
}

export async function updateEvent(id: string, input: EventInput): Promise<Event> {
  await requireAdmin();
  const [row] = await db.update(events).set(normalize(input)).where(eq(events.id, id)).returning();
  revalidatePath('/admin/events');
  revalidatePath('/portal/events');
  revalidatePath('/events');
  return toEvent(row);
}

export async function deleteEvent(id: string): Promise<void> {
  await requireAdmin();
  await db.delete(events).where(eq(events.id, id));
  revalidatePath('/admin/events');
  revalidatePath('/portal/events');
  revalidatePath('/events');
}
