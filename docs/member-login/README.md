# Member Login — Implementation Record

**Status:** Removed from the live site on 2026-08-06. This document records what was
built, how it worked, and why it was taken out.

**Where the code lives:** every commit is preserved at the `archive/postgres-auth`
tag (8 commits, `6b68426`..`e2f0b84`, formerly the `feat/postgres-auth-codes`
branch). Nothing here is lost, see [`restore.md`](./restore.md).

---

## Why it was removed

The site is being published as a public marketing site for VSEUS. Keeping the member
login in production would have required:

- provisioning and paying for a Neon Postgres instance,
- managing three production secrets (`DATABASE_URL`, `AUTH_SECRET`, `CODE_HMAC_SECRET`),
- staffing an admin surface (issuing membership codes, creating events, scanning tickets)
  that no one is currently assigned to run,
- and maintaining a login that, at launch, would have had no members in it.

The public Events page was the only visitor-facing feature that depended on the stack.
It now renders from a static list in `src/lib/events.ts`, so the site has no database,
no environment variables, and no server-side secrets.

This document exists so the *decisions* survive, not just the diff.

---

## Architecture at a glance

```
                 ┌──────────────────────────────────────────┐
   visitor ─────▶│ src/proxy.ts  (optimistic cookie gate)    │
                 │  matcher: /portal/*, /admin/*             │
                 └───────────────┬──────────────────────────┘
                                 │ has session cookie?
                    no ──────────┴────────── yes
                     │                        │
              redirect to                     ▼
              /auth/login          ┌──────────────────────┐
                                   │ page / layout        │
                                   │  admin/layout.tsx    │◀── authoritative
                                   │  re-checks role      │    role check
                                   └──────────┬───────────┘
                                              │
                                   ┌──────────▼───────────┐
                                   │ src/app/actions/*    │ ← server actions,
                                   │  requireMember()     │   admin-guarded
                                   │  requireAdmin()      │
                                   └──────────┬───────────┘
                                              │
                                   ┌──────────▼───────────┐
                                   │ src/db (Drizzle)     │
                                   │  Neon Postgres       │
                                   └──────────────────────┘
```

Two-layer auth was deliberate. `src/proxy.ts` only checked for the *presence* of a
session cookie — no database call, because it runs on every prefetch. The authoritative
role check lived in `src/app/admin/layout.tsx`, a server component, where a DB round trip
is acceptable.

---

## The login: membership codes, not passwords

There was no email/password and no Google sign-in. A member logged in with a single
credential: a code of the form `ECON-####`. Self-service signup was removed —
`/auth/signup` redirected to `/auth/login`.

Admins were ordinary members with `role = 'admin'` (e.g. `ECON-0001`). Role decided the
post-login redirect: admin → `/admin`, member → `/portal`.

### Why codes and not passwords

Members are UBC students who interact with VSEUS a few times a term. A password is
another thing to forget and another reset flow to build. A code can be handed out at an
event, printed on a card, or emailed once — and revoked by flipping one boolean.

### How codes were stored (`src/lib/codes.ts`)

Codes were **never stored in plaintext**. Each member row carried two derived columns:

| Column | Derivation | Purpose |
|---|---|---|
| `code_lookup` | `HMAC-SHA256(code, CODE_HMAC_SECRET)`, hex | Deterministic, indexed, non-reversible. Finds the one candidate row with an equality lookup. |
| `code_hash` | `bcrypt(code, 10 rounds)` | Salted, authoritative verification. |

The split exists because bcrypt is salted and therefore *not* searchable — you cannot
`WHERE code_hash = ?`. The HMAC gives an indexable handle; bcrypt does the actual
verification.

`normalizeCode()` trimmed, uppercased, stripped whitespace, and tolerated a missing dash
(`econ1234` → `ECON-1234`) before validation against `/^ECON-\d{4}$/`.

### The code space problem, and the mitigation

`ECON-####` is only 10,000 possible codes. That is small enough to enumerate. The
defence was rate limiting, implemented in Postgres rather than in memory so limits
survive serverless cold starts (`src/lib/rateLimit.ts`, `login_attempts` table):

- **5 failed attempts per 60-second window**, then a **15-minute lockout**.
- Throttling keyed on **both** `ip:<addr>` and `code:<lookup>`, so neither a single IP
  spraying many codes nor many IPs hammering one code gets through.
- `authorize()` returned a generic `null` on lockout — it never revealed *which* key
  tripped, or whether the code existed.

If this is ever restored at larger scale, widen the code space (6+ characters,
alphanumeric) rather than relying on the lockout alone.

### Session

Auth.js v5 (`next-auth@5.0.0-beta.25`) with a Credentials provider and `strategy: 'jwt'`
(`src/auth.ts`). The JWT carried `id`, `role`, `studentId`, and `ticketEmail`. The `jwt`
callback also honoured `trigger === 'update'`, so a client calling
`useSession().update({ ticketEmail })` refreshed the token without a re-login.

---

## What was built

### Member portal (`/portal`)

| Page | What it did |
|---|---|
| `/portal` | Dashboard — registered event count, upcoming events, quick links |
| `/portal/events` | Browse and register; spot count updated live on registration |
| `/portal/tickets` | QR ticket per registration; inline unregister with confirmation |
| `/portal/profile` | Account info + ticket delivery email preference |

Registration used a multi-step modal (`src/components/portal/RegistrationModal.tsx`):
event questions → confirm ticket email → confirm → ticket displayed. Questions were
per-event and defined by the admin (text / multiple-choice / yes-no, reorderable, each
individually required or optional).

Tickets (`src/components/portal/Ticket.tsx`) were rendered client-side with the `qrcode`
package as a data URL. **The QR payload was the registration's primary key** — see
[`schema.md`](./schema.md).

### Admin portal (`/admin`)

| Page | What it did |
|---|---|
| `/admin` | Stats overview |
| `/admin/events` | Event table; delete (seed events protected) |
| `/admin/events/new` | Create event — poster upload, question builder, required capacity |
| `/admin/events/[id]` | Per-event metrics: fill rate, revenue, attendance, full registrant table with question answers |
| `/admin/events/[id]/scan` | QR ticket scanner |
| `/admin/members` | Create members, issue/rotate codes (shown once), enable/disable |

The scanner used `getUserMedia` for the camera feed and `jsqr` to decode frames from
`ImageData`, then presented an Admit/Deny flow. Admitting set `attended = true` with an
ISO timestamp.

Member codes were displayed **exactly once**, at creation or rotation. There was no way
to recover a code afterwards — only to rotate it — which is the direct consequence of
never storing plaintext.

### Server actions (`src/app/actions/`)

All mutations went through server actions guarded by `src/lib/session.ts`
(`requireMember()` / `requireAdmin()`), never through client-side database access:

- `events.ts` — `createEvent`, `updateEvent`, `deleteEvent`
- `members.ts` — `createMember`, `regenerateCode`, `setMemberDisabled`
- `registrations.ts` — `myRegisteredEventIds`, `registerForEvent`, `unregisterForEvent`
- `profile.ts` — `updateTicketEmail`
- `scan.ts` — `getScanInfo`, `lookupRegistration`, `markAttended`, `listEventRegistrations`

### Data access (`src/db/queries.ts`)

Read queries plus three row→domain mappers — `toEvent`, `toRegistration`, `toUser` —
which defined the contract between the database and the UI types in `src/types/`. If the
stack is restored, those mappers are the seam to preserve.

---

## Environment

```
DATABASE_URL      # Neon pooled connection string
AUTH_SECRET       # Auth.js session secret — openssl rand -base64 33
CODE_HMAC_SECRET  # separate value, same generation — derives code_lookup
```

`CODE_HMAC_SECRET` fell back to `AUTH_SECRET` if unset, but they were deliberately kept
separate: rotating the session secret should not invalidate every membership code.

`src/db/index.ts` deliberately did **not** throw on a missing `DATABASE_URL` at module
load, because `next build` evaluates route modules without env vars present. The cost of
that choice was that a missing URL surfaced as a runtime Neon connection error instead —
which is exactly how the public Events page came to fail silently in development.

---

## What was never built, and why

| Feature | Status | Blocker |
|---|---|---|
| Email ticket delivery | UI showed a "Ticket sent to …" toast, but no email was sent | Needs a Resend or SendGrid account and an API route |
| Apple Wallet passes | Not started | Requires the paid Apple Developer Program ($99 USD/yr) for a Pass Type ID and signing certificate. A free account does not grant this. Worth checking whether UBC has an institutional account. |
| Google Wallet passes | Not started | Requires a Google Cloud service account plus Google's review/approval — days to weeks |
| Payment processing | Stubbed: e-transfer to events@vseus.ca or pay at the door | Stripe recommended (2.9% + 30¢ CAD). Bounce, previously used by VSEUS, runs on Stripe — integrating directly removes the platform fee. ~1 hour of setup, no approval wait. |
| Poster storage | Base64 in `events.poster_url` | Should move to object storage (S3, Cloudflare R2, or equivalent) before any real volume |

---

## Known issues at time of removal

1. **Poster images as base64** bloated every event row and every response that touched one.
2. **Seed events could not be deleted** through the admin UI — protected by design, but
   it meant demo data was permanent once seeded.
3. **No `.env.local` existed in the working tree**, so the public Events page
   (`export const dynamic = 'force-dynamic'` → `listEvents()` → Neon with
   `connectionString: undefined`) threw on every request. This was the bug that
   prompted the audit that led to this removal.

---

## See also

- [`schema.md`](./schema.md) — tables, keys, and the two non-obvious modelling choices
- [`restore.md`](./restore.md) — how to bring the whole stack back
