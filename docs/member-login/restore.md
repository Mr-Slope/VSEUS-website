# Member Login — How to Restore It

The removal was a deletion, not a rewrite. Every file still exists at the
`archive/postgres-auth` tag, commit `e2f0b84` (formerly the tip of the
`feat/postgres-auth-codes` branch, which was deleted once the tag preserved it).
Restoring is a checkout, a dependency install, and a database provision.

Read [`README.md`](./README.md) first — some of what you would be restoring was already
known to need work (base64 posters, a 10,000-code keyspace, no email delivery).

---

## Decide first: restore, or rebuild?

Restore as-is if you need the portal back quickly and accept the known issues.

Rebuild the data layer if any of these are true:

- You want event registration open to non-members (the whole code system assumes a
  closed roster).
- You want payments. Stripe changes the registration flow enough that grafting it onto
  the existing modal is likely more work than reworking the flow.
- You expect more than a few hundred members. Widen the code space first — see
  "If you rebuild" below.

---

## Restoring as-is

### 1. Bring the files back

From the repo root, on a fresh branch:

```bash
git checkout -b feat/restore-member-login

git checkout archive/postgres-auth -- \
  src/auth.ts \
  src/proxy.ts \
  src/db \
  src/app/actions \
  src/app/auth \
  src/app/portal \
  src/app/admin \
  src/app/api/auth \
  src/components/portal \
  src/components/admin \
  src/components/ui/Modal.tsx \
  src/components/ui/Badge.tsx \
  src/contexts/AuthContext.tsx \
  src/hooks/useAuth.ts \
  src/lib/codes.ts \
  src/lib/rateLimit.ts \
  src/lib/session.ts \
  src/lib/mockData.ts \
  src/types/user.ts \
  src/types/next-auth.d.ts \
  drizzle \
  drizzle.config.ts \
  .env.example
```

### 2. Reinstall the dependencies

```bash
npm install next-auth@^5.0.0-beta.25 drizzle-orm@^0.38.3 \
  @neondatabase/serverless@^0.10.4 bcryptjs@^2.4.3 qrcode@^1.5.4 jsqr@^1.4.0 zod@^3.24.1

npm install -D drizzle-kit@^0.30.1 @types/bcryptjs@^2.4.6 @types/qrcode@^1.5.6 \
  tsx@^4.19.2 dotenv@^17.4.2
```

Restore these `scripts` in `package.json`:

```json
"db:generate": "drizzle-kit generate",
"db:migrate":  "drizzle-kit migrate",
"db:push":     "drizzle-kit push",
"db:studio":   "drizzle-kit studio",
"db:seed":     "tsx src/db/seed.ts"
```

### 3. Rewire the app shell

These files were edited (not deleted) during removal, so a checkout will not bring their
integration back. Re-add by hand:

| File | What to restore |
|---|---|
| `src/app/layout.tsx` | Wrap children in `<SessionProvider>` and `<AuthProvider>`, inside the existing `<TransitionProvider>` |
| `src/components/layout/Navbar.tsx` | The auth area: `useAuth()`, "My Portal" link, admin-only "Admin" link, Sign Out button, "Member Login" CTA — plus the mobile-menu equivalents |
| `src/components/layout/Footer.tsx` | "Member Portal" link in the Connect column; the low-opacity "Admin" link in the bottom bar |
| `src/components/home/Hero.tsx` | The `user ? "Go to My Portal" : "Member Login"` CTA fork (currently a single "Explore Resources" button) |
| `src/app/events/page.tsx` | Only if you want the public page reading live rows again — see step 6 |

`src/proxy.ts` needs no rewiring; Next picks it up by file convention. Confirm its
`matcher` still lists every protected route.

### 4. Provision the database

Create a Neon project, then in `.env.local` (never commit it):

```bash
DATABASE_URL="postgresql://…"          # the POOLED connection string
AUTH_SECRET="$(openssl rand -base64 33)"
CODE_HMAC_SECRET="$(openssl rand -base64 33)"   # a SEPARATE value
```

Keep `CODE_HMAC_SECRET` distinct from `AUTH_SECRET`. `code_lookup` is derived from it,
so changing it invalidates **every existing membership code** — you would have to rotate
all of them. Rotating `AUTH_SECRET` should only log people out.

### 5. Migrate and seed

```bash
npm run db:migrate
npm run db:seed      # prints seed codes ONCE — save them immediately
```

The seed prints `ECON-0001` (VSEUS Admin) and `ECON-0002` (Yash Dhaundiyal) as admins,
plus five member codes. They are not recoverable afterwards, only rotatable via
`/admin/members`.

### 6. Point the Events page back at the database

The public page now imports `UPCOMING_EVENTS` from `src/lib/events.ts`. To restore live
data, revert it to:

```ts
import { listEvents } from '@/db/queries';
export const dynamic = 'force-dynamic';
export default async function EventsPage() {
  const events = await listEvents();
  …
}
```

You will also need to restore the fields trimmed from `src/types/event.ts` —
`capacity`, `registeredCount`, `questions`, `imageUrl`, `createdAt` — and the
`Registration` / `EventQuestion` types. `git show archive/postgres-auth:src/types/event.ts`
has the original.

Consider keeping the static list as a fallback rather than deleting it:

```ts
let events;
try { events = await listEvents(); }
catch { events = UPCOMING_EVENTS; }
```

That is what prevents a database outage from taking down a public marketing page —
the failure mode that originally made this page unreachable.

### 7. Verify

```bash
npx tsc --noEmit
npm run lint
npm run build
npm run dev
```

Then walk it end to end: log in with a seed code → register for an event → open
`/portal/tickets` and confirm the QR renders → sign in as admin → scan that QR at
`/admin/events/[id]/scan` → confirm `attended` flips and the timestamp lands.

Also confirm the rate limiter: six bad codes in a row should lock you out for 15
minutes, and the sixth attempt should look identical to the first five.

### 8. Deploy

Set all three env vars in the hosting provider. On Vercel, `DATABASE_URL` must be the
**pooled** Neon string — the direct one exhausts connections under serverless.

---

## If you rebuild rather than restore

Things worth changing on the way back in, roughly in order of value:

1. **Widen the code space.** `ECON-####` is 10,000 codes, defended only by lockout.
   Six alphanumeric characters would make enumeration impractical on its own merits.
2. **Move posters off base64.** Vercel Blob or S3. Base64 in `poster_url` bloats every
   row and every response that reads one.
3. **Wire ticket emails.** Resend is the shortest path; the UI already claims tickets are
   sent, which is currently untrue.
4. **Payments via Stripe**, not Bounce. Bounce runs on Stripe anyway, so going direct
   removes the platform fee. Roughly an hour of setup and no approval wait.
5. **Consult Dr. Ning Nan (COEC 437)** if you want the relational model formalised — the
   schema was designed pragmatically, not from an ERD.

Wallet passes (Apple, Google) remain blocked on external accounts and approvals; see the
table in [`README.md`](./README.md) before promising them to anyone.

---

## Reference points

| What | Where |
|---|---|
| Full implementation | `archive/postgres-auth` @ `e2f0b84` |
| First commit of the stack | `6b68426` `chore(deps): add postgres, drizzle, auth.js, bcrypt deps` |
| The removal commit | `e915f54` (now on `main`) |
| Schema details | [`schema.md`](./schema.md) |
| Why it was removed | [`README.md`](./README.md) |
