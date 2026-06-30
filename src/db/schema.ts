import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import type { EventQuestion, QuestionAnswer } from '../types/event';
import type { UserRole } from '../types/user';

/**
 * A member of VSEUS. The login credential is a code (`ECON-####`) which is
 * never stored in plaintext:
 *  - `codeLookup` is a deterministic HMAC of the code, used to find the row.
 *  - `codeHash` is a bcrypt hash of the code, used to verify it.
 * Admins are ordinary members with `role = 'admin'`.
 */
export const members = pgTable('members', {
  id: uuid('id').defaultRandom().primaryKey(),
  codeLookup: varchar('code_lookup', { length: 64 }).notNull().unique(),
  codeHash: text('code_hash').notNull(),
  name: text('name').notNull(),
  studentId: varchar('student_id', { length: 16 }).unique(),
  email: text('email'),
  role: varchar('role', { length: 10 }).notNull().default('member').$type<UserRole>(),
  ticketEmail: text('ticket_email'),
  disabled: boolean('disabled').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  // Stored as 'YYYY-MM-DD' strings, matching the existing Event type.
  date: date('date').notNull(),
  time: text('time').notNull(),
  location: text('location').notNull(),
  capacity: integer('capacity').notNull(),
  registeredCount: integer('registered_count').notNull().default(0),
  isPaid: boolean('is_paid').notNull().default(false),
  price: integer('price'),
  imageUrl: text('image_url'),
  posterUrl: text('poster_url'),
  category: text('category').notNull(),
  questions: jsonb('questions').notNull().default([]).$type<EventQuestion[]>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * A member's registration for an event. The primary key is the QR-code payload
 * scanned at the door, so it must stay an opaque, stable identifier (UUID).
 * Member-facing fields are denormalized snapshots taken at registration time.
 */
export const registrations = pgTable(
  'registrations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    memberId: uuid('member_id')
      .notNull()
      .references(() => members.id, { onDelete: 'cascade' }),
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    userName: text('user_name').notNull(),
    userEmail: text('user_email').notNull(),
    userStudentId: text('user_student_id').notNull(),
    ticketEmail: text('ticket_email').notNull(),
    answers: jsonb('answers').notNull().default([]).$type<QuestionAnswer[]>(),
    registeredAt: timestamp('registered_at', { withTimezone: true }).notNull().defaultNow(),
    attended: boolean('attended').notNull().default(false),
    attendedAt: timestamp('attended_at', { withTimezone: true }),
  },
  (t) => [
    // A member can register for a given event at most once.
    unique('registrations_member_event_unique').on(t.memberId, t.eventId),
  ],
);

/**
 * Login throttling state. One row per key (`ip:<addr>` or `code:<lookup>`).
 * Lives in Postgres so limits survive serverless cold starts.
 */
export const loginAttempts = pgTable('login_attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: varchar('key', { length: 80 }).notNull().unique(),
  windowStart: timestamp('window_start', { withTimezone: true }).notNull().defaultNow(),
  count: integer('count').notNull().default(0),
  lockedUntil: timestamp('locked_until', { withTimezone: true }),
});

export const membersRelations = relations(members, ({ many }) => ({
  registrations: many(registrations),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  registrations: many(registrations),
}));

export const registrationsRelations = relations(registrations, ({ one }) => ({
  member: one(members, {
    fields: [registrations.memberId],
    references: [members.id],
  }),
  event: one(events, {
    fields: [registrations.eventId],
    references: [events.id],
  }),
}));

export type MemberRow = typeof members.$inferSelect;
export type EventRow = typeof events.$inferSelect;
export type RegistrationRow = typeof registrations.$inferSelect;
