import { asc, eq } from 'drizzle-orm';
import { db } from './index';
import { events, members, registrations } from './schema';
import type { EventRow, MemberRow, RegistrationRow } from './schema';
import type { Event, Registration } from '@/types/event';
import type { User, UserRole } from '@/types/user';

/* ---------- row → domain-type mappers (keep existing UI types stable) ---------- */

export function toEvent(row: EventRow): Event {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    time: row.time,
    location: row.location,
    capacity: row.capacity,
    registeredCount: row.registeredCount,
    isPaid: row.isPaid,
    price: row.price,
    imageUrl: row.imageUrl,
    posterUrl: row.posterUrl,
    category: row.category,
    createdAt: row.createdAt.toISOString(),
    questions: row.questions ?? [],
  };
}

export function toRegistration(row: RegistrationRow): Registration {
  return {
    id: row.id,
    userId: row.memberId,
    eventId: row.eventId,
    userName: row.userName,
    userEmail: row.userEmail,
    userStudentId: row.userStudentId,
    ticketEmail: row.ticketEmail,
    registeredAt: row.registeredAt.toISOString(),
    answers: row.answers ?? [],
    attended: row.attended,
    attendedAt: row.attendedAt ? row.attendedAt.toISOString() : null,
  };
}

export function toUser(row: MemberRow, registeredEvents: string[] = []): User {
  return {
    id: row.id,
    email: row.email ?? '',
    name: row.name,
    studentId: row.studentId ?? '',
    role: row.role,
    registeredEvents,
    createdAt: row.createdAt.toISOString(),
    ticketEmail: row.ticketEmail ?? undefined,
  };
}

/* ---------- events ---------- */

export async function listEvents(): Promise<Event[]> {
  const rows = await db.select().from(events).orderBy(asc(events.date));
  return rows.map(toEvent);
}

export async function getEvent(id: string): Promise<Event | null> {
  const [row] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return row ? toEvent(row) : null;
}

/* ---------- registrations ---------- */

export async function getMyRegistrations(memberId: string): Promise<Registration[]> {
  const rows = await db
    .select()
    .from(registrations)
    .where(eq(registrations.memberId, memberId))
    .orderBy(asc(registrations.registeredAt));
  return rows.map(toRegistration);
}

export async function getMyRegisteredEventIds(memberId: string): Promise<string[]> {
  const rows = await db
    .select({ eventId: registrations.eventId })
    .from(registrations)
    .where(eq(registrations.memberId, memberId));
  return rows.map((r) => r.eventId);
}

/** Admin: every registration for an event (for metrics + scanner). */
export async function getEventRegistrations(eventId: string): Promise<Registration[]> {
  const rows = await db
    .select()
    .from(registrations)
    .where(eq(registrations.eventId, eventId))
    .orderBy(asc(registrations.registeredAt));
  return rows.map(toRegistration);
}

export interface TicketEntry {
  registration: Registration;
  event: Event;
}

/** A member's registrations joined with their events (for tickets/profile). */
export async function getMyTickets(memberId: string): Promise<TicketEntry[]> {
  const rows = await db
    .select()
    .from(registrations)
    .innerJoin(events, eq(registrations.eventId, events.id))
    .where(eq(registrations.memberId, memberId))
    .orderBy(asc(events.date));
  return rows.map((r) => ({
    registration: toRegistration(r.registrations),
    event: toEvent(r.events),
  }));
}

/* ---------- members ---------- */

export async function getMemberById(id: string): Promise<User | null> {
  const [row] = await db.select().from(members).where(eq(members.id, id)).limit(1);
  if (!row) return null;
  const registeredEvents = await getMyRegisteredEventIds(id);
  return toUser(row, registeredEvents);
}

export interface AdminMember {
  id: string;
  name: string;
  email: string | null;
  studentId: string | null;
  role: UserRole;
  disabled: boolean;
  createdAt: string;
}

export async function listMembers(): Promise<AdminMember[]> {
  const rows = await db.select().from(members).orderBy(asc(members.createdAt));
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    studentId: r.studentId,
    role: r.role,
    disabled: r.disabled,
    createdAt: r.createdAt.toISOString(),
  }));
}
