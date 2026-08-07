# Member Login — Database Schema

Postgres (Neon, serverless driver) via Drizzle ORM. Defined in `src/db/schema.ts`;
migration in `drizzle/0000_left_venom.sql`.

Four tables. Two of the modelling choices are non-obvious and are called out below —
they are the parts most likely to be re-derived incorrectly if this is ever rebuilt.

---

## Entity relationships

```
        ┌─────────────┐                    ┌─────────────┐
        │   members   │                    │   events    │
        ├─────────────┤                    ├─────────────┤
        │ id (uuid)PK │                    │ id (uuid)PK │
        │ code_lookup │◀── unique, indexed │ title       │
        │ code_hash   │                    │ date, time  │
        │ role        │                    │ capacity    │
        │ disabled    │                    │ questions   │
        └──────┬──────┘                    └──────┬──────┘
               │ 1                             1  │
               │                                  │
               │ N        ┌──────────────┐     N  │
               └─────────▶│registrations │◀───────┘
                          ├──────────────┤
                          │ id (uuid) PK │ ← this IS the QR payload
                          │ member_id FK │
                          │ event_id  FK │
                          │ attended     │
                          └──────────────┘
                          UNIQUE(member_id, event_id)

        ┌──────────────────┐
        │  login_attempts  │  standalone — no FKs
        ├──────────────────┤
        │ key   'ip:…' /   │
        │       'code:…'   │
        │ window_start     │
        │ count            │
        │ locked_until     │
        └──────────────────┘
```

---

## `members`

The login credential is a code (`ECON-####`), never stored in plaintext. Admins are
ordinary members with `role = 'admin'`.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | `defaultRandom()` |
| `code_lookup` | `varchar(64)` | **NOT NULL, UNIQUE.** HMAC-SHA256 of the code, hex. The indexed lookup handle. |
| `code_hash` | `text` | **NOT NULL.** bcrypt, 10 rounds. Authoritative verification. |
| `name` | `text` | NOT NULL |
| `student_id` | `varchar(16)` | UNIQUE, nullable |
| `email` | `text` | nullable |
| `role` | `varchar(10)` | NOT NULL, default `'member'`, typed as `UserRole` |
| `ticket_email` | `text` | nullable — where the member wants tickets delivered |
| `disabled` | `boolean` | NOT NULL, default `false`. Revocation without deletion. |
| `created_at` | `timestamptz` | NOT NULL, `defaultNow()` |

Two columns for one credential is intentional: bcrypt is salted and therefore not
searchable, so it cannot serve as a lookup key. The HMAC provides an indexable handle;
bcrypt does the verification. See `src/lib/codes.ts`.

---

## `events`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | `defaultRandom()` |
| `title`, `description` | `text` | NOT NULL |
| `date` | `date` | NOT NULL. Stored as `'YYYY-MM-DD'` strings to match the existing `Event` UI type. |
| `time` | `text` | NOT NULL. Display string (`'6:00 PM'`), not a time type. |
| `location` | `text` | NOT NULL |
| `capacity` | `integer` | **NOT NULL — see below** |
| `registered_count` | `integer` | NOT NULL, default `0` |
| `is_paid` | `boolean` | NOT NULL, default `false` |
| `price` | `integer` | nullable |
| `image_url`, `poster_url` | `text` | nullable. Posters were stored as base64 data URLs — a known problem. |
| `category` | `text` | NOT NULL |
| `questions` | `jsonb` | NOT NULL, default `[]`, typed `EventQuestion[]` |
| `created_at` | `timestamptz` | NOT NULL, `defaultNow()` |

### ⚠️ Non-obvious choice 1: `capacity` is non-nullable

Every event **must** declare a maximum number of registrants; the admin create form
enforces it. This is what makes "N spots left" and the fill-rate metric computable
without a special case for unlimited events. If you ever need an uncapped event, use a
deliberately large number rather than making the column nullable — nullable capacity
would push a null check into every consumer.

---

## `registrations`

A member's registration for an event. Member-facing fields are **denormalized snapshots
taken at registration time**, so a later name or email change does not rewrite history on
an already-issued ticket.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | **This is the QR-code payload — see below** |
| `member_id` | `uuid` FK → `members.id` | NOT NULL, `ON DELETE CASCADE` |
| `event_id` | `uuid` FK → `events.id` | NOT NULL, `ON DELETE CASCADE` |
| `user_name` | `text` | NOT NULL, snapshot |
| `user_email` | `text` | NOT NULL, snapshot |
| `user_student_id` | `text` | NOT NULL, snapshot |
| `ticket_email` | `text` | NOT NULL, snapshot |
| `answers` | `jsonb` | NOT NULL, default `[]`, typed `QuestionAnswer[]` |
| `registered_at` | `timestamptz` | NOT NULL, `defaultNow()` |
| `attended` | `boolean` | NOT NULL, default `false` |
| `attended_at` | `timestamptz` | nullable — set by the door scanner |

**Constraint:** `UNIQUE(member_id, event_id)` — named
`registrations_member_event_unique`. A member can register for a given event at most
once. This is the database-level guarantee behind the registration flow; the UI check is
a convenience, not the enforcement.

### ⚠️ Non-obvious choice 2: the primary key *is* the QR payload

The QR code printed on a member's ticket encodes this row's `id` and nothing else. Two
consequences that must be preserved if this is rebuilt:

1. **The ID must stay opaque and unguessable** — hence `uuid`, not a sequential integer.
   A guessable ticket ID is a forgeable ticket.
2. **The ID must never be recycled or rewritten.** Re-issuing a ticket means a new row,
   not a mutated one.

An earlier localStorage-era implementation used `reg-{timestamp}-{random5}` for this;
the UUID replaced it when the data moved to Postgres.

---

## `login_attempts`

Login throttling state, one row per key. Lives in Postgres rather than memory so limits
survive serverless cold starts.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `key` | `varchar(80)` | NOT NULL, UNIQUE. Either `ip:<addr>` or `code:<lookup>`. |
| `window_start` | `timestamptz` | NOT NULL, `defaultNow()` |
| `count` | `integer` | NOT NULL, default `0` |
| `locked_until` | `timestamptz` | nullable |

Thresholds live in `src/lib/rateLimit.ts`, not the schema: 60-second window, 5 attempts,
15-minute lockout. The increment/reset/lock decision is done in a single
`INSERT … ON CONFLICT DO UPDATE` with `CASE` expressions, so it is atomic under
concurrent attempts.

---

## Row → domain mappers

`src/db/queries.ts` exposed three mappers that formed the contract between the database
and the UI types in `src/types/`. They are worth preserving verbatim if the stack is
restored, because every component was written against their output shape:

| Mapper | Row type | Domain type | Notes |
|---|---|---|---|
| `toEvent` | `EventRow` | `Event` | `createdAt` → ISO string; `questions ?? []` |
| `toRegistration` | `RegistrationRow` | `Registration` | `memberId` → `userId`; timestamps → ISO strings or `null` |
| `toUser` | `MemberRow` | `User` | Takes `registeredEvents: string[]` as a second argument; nulls collapse to `''`/`undefined`. Never exposes `code_lookup` or `code_hash`. |

`toUser` deliberately dropped both credential columns. Any rebuild should keep that
property: the credential columns must not be reachable from a type that gets serialized
to a client.

---

## Seeding

`src/db/seed.ts` (`npm run db:seed`) loaded `.env.local` via `dotenv`, then inserted:

- **Seed members** — `ECON-0001` (VSEUS Admin) and `ECON-0002` (Yash Dhaundiyal) as
  `role: 'admin'`, plus five `ECON-10xx` members. Codes were printed to stdout **once**.
- **Seed events** — from `MOCK_EVENTS` in `src/lib/mockData.ts`, which existed only as a
  seed source by that point.

`MOCK_EVENTS` survived the removal: it became the static `UPCOMING_EVENTS` list in
`src/lib/events.ts` that the public Events page now renders from.
