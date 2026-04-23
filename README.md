# VSEUS Website

Official website for the **Vancouver School of Economics Undergraduate Society** at the University of British Columbia.

Built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4. Designed for easy future edits and a clean migration path to Firebase when the society is ready.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth (current) | Mock — `localStorage` + React Context |
| Auth (future) | Firebase Auth (Email/Password + Google OAuth) |
| Hosting | Vercel (planned) |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other commands:

```bash
npm run build   # production build + type check
npm run start   # serve the production build locally
npm run lint    # ESLint
```

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout: Navbar, Footer, AuthProvider, TransitionProvider
│   ├── page.tsx                # Home page
│   ├── about/page.tsx          # Mission, exec orbital diagram, reports, partners
│   ├── services/page.tsx       # Services overview (merch, awards, ELC, initiatives)
│   ├── elc/page.tsx            # Economics Learning Centre dedicated page
│   ├── events/page.tsx         # Public read-only events list
│   ├── contact/page.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx     # Restricted to approved VSEUS member IDs
│   ├── portal/
│   │   ├── layout.tsx          # Auth guard — redirects to /auth/login if not signed in
│   │   ├── page.tsx            # Member dashboard
│   │   ├── events/page.tsx     # Events + registration
│   │   └── profile/page.tsx
│   └── admin/
│       ├── layout.tsx          # Role guard — admin only
│       ├── page.tsx            # Admin dashboard
│       └── events/
│           ├── page.tsx        # Manage events
│           └── new/page.tsx    # Create event form
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky glass navbar, scroll-activated blur, dropdown menus
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── Hero.tsx            # Full-screen hero, staggered headline, scroll-driven SVG curve
│   │   ├── ServicePillars.tsx  # 3D tilt cards with scroll reveal
│   │   ├── StatsBar.tsx        # Animated member/event stats
│   │   ├── SponsorsRow.tsx     # CSS marquee infinite scroll
│   │   └── CalendarSection.tsx # Google Calendar embed placeholder
│   ├── portal/
│   │   ├── EventCard.tsx       # Event tile with register/registered/full states
│   │   ├── RegistrationModal.tsx
│   │   └── DashboardStats.tsx
│   └── ui/
│       ├── Button.tsx          # General button with ripple effect
│       ├── CTAButton.tsx       # Primary CTA — triggers circular page transition
│       ├── Input.tsx
│       ├── Badge.tsx           # "Registered", "Full", "Paid" tags
│       ├── Modal.tsx
│       └── Reveal.tsx          # Scroll reveal wrapper (IntersectionObserver)
│
├── contexts/
│   ├── AuthContext.tsx         # Auth state — Firebase-ready interface
│   └── TransitionContext.tsx   # Circular clip-path page transition engine
│
├── hooks/
│   └── useAuth.ts
│
├── lib/
│   ├── mockAuth.ts             # localStorage auth (swap for firebase.ts later)
│   └── mockData.ts             # Seed events + admin user for development
│
└── types/
    ├── user.ts                 # { id, email, name, studentId, role, registeredEvents }
    └── event.ts                # Event, Registration, EventQuestion, QuestionAnswer
```

---

## Key Features

### Member Portal
- Login and signup gated behind a pre-approved student ID list
- Each student ID can only be linked to one account
- Members can register for events, view their dashboard, and manage their profile
- Admin role unlocks an event management panel

### Admin System (`/admin`)
- Multiple admin accounts supported via `ADMIN_USERS` array in `mockAuth.ts`
- Admins create events with: title, description, date/time, location, category, capacity, paid/free pricing
- **Poster upload** — image selected via file picker, stored as base64 in localStorage (`vseus_events`); displayed on event cards across the public and member views
- **Registration questions** — admins configure per-event questions (text answer, multiple choice, yes/no) with required/optional toggle and drag-reorder; shown to members as a mandatory step before confirming registration
- **Per-event metrics** (`/admin/events/[id]`) — header with poster thumbnail, stat cards (registrations/fill rate/revenue/attendance), and a full registrant table with question answers and attended status
- **QR ticket scanning** (`/admin/events/[id]/scan`) — camera-based QR code reader; admin scans a member's ticket and chooses to Admit or Deny; admitted members are marked `attended: true` with a timestamp stored in `vseus_registrations`
- Admin-created events persist to `vseus_events` in localStorage; seed events (MOCK_EVENTS) are read-only and cannot be deleted
- `getAllEvents()` in `src/lib/events.ts` merges seed + admin events and is the single source of truth used by all pages

### Ticketing System
- After registering, members are prompted for a ticket delivery email (pre-filled with their account email, editable)
- A digital ticket is generated on-screen with a QR code encoding the registration ID
- Tickets are accessible any time from **My Tickets** (`/portal/tickets`) in the member portal
- **Apple Wallet** and **Google Wallet** buttons are present on each ticket

> **Stubs (not wired up — revisit in a future session):**
> - **Email delivery**: The UI shows "A ticket has been sent to [email]" but no email is actually sent. Wiring this requires an email delivery service (Resend or SendGrid) and a backend API route (`/api/send-ticket`).
> - **Apple Wallet**: Requires generating a signed `.pkpass` file server-side using Apple Developer certificates. Not possible client-side.
> - **Google Wallet**: Requires a Google Cloud service account and JWT signing via the Google Wallet API. Not possible client-side.

### Payment Processing
Currently, paid events direct members to pay via e-transfer to events@vseus.ca or at the door — no payment processor is integrated yet.

When ready to wire up online payments, **Stripe** is the recommended path:
- Stripe charges **2.9% + 30¢ CAD** per transaction (same as Square for online payments)
- **Bounce** (the event platform VSEUS has used previously) runs on Stripe under the hood — integrating Stripe directly simply cuts out the Bounce platform fee, with no change in the underlying processor
- Setting up a Stripe account and linking it to a bank account is straightforward and can be done in under an hour through their dashboard (no approval wait times for most accounts)
- On the code side, wiring Stripe requires a backend API route (`/api/checkout`) to create a Payment Intent server-side using the Stripe secret key, and a frontend `<StripeElement>` or redirect to a Stripe-hosted checkout page

### Economics Learning Centre — ELC (`/elc`)
Dedicated page sourced from vseus.ca/elc. Covers: walk-in peer tutoring at IONA 038, Mon–Thu 11am–5pm, no booking required; course list (ECON 101/102/226/301/302/325/326); Canvas enrollment key `9KXL4W`. Linked from Services, the navbar Services dropdown, and the footer.

### Page Transitions
Primary CTA buttons trigger a circular navy overlay that expands from the click coordinates using CSS `clip-path: circle()`, then navigates. Implemented in `TransitionContext.tsx` via direct DOM manipulation to avoid React re-render timing issues.

### Animations
- **Scroll reveal** — `Reveal.tsx` uses `IntersectionObserver`; accepts a `delay` prop for stagger
- **Tilt cards** — `ServicePillars.tsx` uses `mousemove` to apply 3D perspective tilt (±10°)
- **Glass navbar** — activates `backdrop-filter: blur` after 24px of scroll
- **Marquee** — sponsors scroll infinitely via CSS animation, pause on hover
- **Hero** — headline words stagger in with `fadeSlideUp` keyframes; "Curve" has a scroll-driven SVG arc that extends into cubic-bezier squiggles as you scroll
- **Ripple** — all buttons spawn a DOM ripple span on click
- **Exec orbital diagram** — SVG SMIL `animateMotion` traveling dots on connection lines from President to each VP; pulsing rings from center; ambient particles tracing the orbit ring. Filter uses `filterUnits="userSpaceOnUse"` to avoid bounding-box clipping on vertical lines.

### Color Tokens (defined in `globals.css`)
| Token | Value | Use |
|---|---|---|
| `--navy-900` | `#0D1B2A` | Hero background, overlays |
| `--navy-700` | `#1B3A5C` | Navbar |
| `--navy-500` | `#2E6096` | Accents |
| `--navy-100` | `#E8EEF4` | Light section backgrounds |
| `--gold` | `#C9A84C` | CTAs, highlights |
| `--gold-light` | `#DEC06E` | Hover state for gold |

---

## Auth & Membership Gating

The site currently uses a mock auth layer (`src/lib/mockAuth.ts`) backed by `localStorage`. The interface matches what Firebase Auth will expect, so swapping is a single file replacement.

**Membership restriction:** `APPROVED_STUDENT_IDS` in `mockAuth.ts` is a hardcoded `Set` of permitted student IDs for development. On signup, the submitted student ID is checked against this set. Before going live, replace with a Firebase Firestore lookup against the authoritative member list.

**Admin access:** Admin accounts are defined in the `ADMIN_USERS` array in `mockAuth.ts`. Log in with any of those credentials to access `/admin`. Add entries to the array to grant additional admins access.

---

## Firebase Migration (when ready)

> **Database design note:** Before finalising the Firestore schema and ERD, consult **Dr. Ning Nan** (COEC 437 Professor) — she should be able to provide good insights on how to approach the entity-relationship diagram and general database configuration for a society platform of this kind.

```bash
npm install firebase
```

1. Create `src/lib/firebase.ts` implementing the same exports as `mockAuth.ts`: `signUp`, `signIn`, `signOut`, `getSession`, `registerForEvent`
2. Update `AuthContext.tsx` to import from `firebase.ts` instead of `mockAuth.ts`
3. Add `.env.local` with your Firebase project config keys
4. Enable Email/Password (and optionally Google OAuth) in the Firebase console
5. Move `APPROVED_STUDENT_IDS` to a Firestore collection so the exec team can manage it without a code deploy

Firestore collections to create: `users/{uid}`, `events/{eventId}`, `registrations/{regId}`

---

## Deploying to Vercel

Push to `main` on GitHub — Vercel auto-deploys on every push if the project is linked.

Manual deploy:

```bash
npm run build   # verify clean build first
vercel --prod
```

---

## IDEAS

### Google Forms Integration for Event Registration

Instead of collecting registration data through custom in-app questions, admins could link each event to a Google Form. The flow would work as follows:

1. The event host creates a Google Form for their event (questions, dietary restrictions, team size, etc.) and pastes the shareable form URL when creating the event on the VSEUS site.
2. When a member clicks "Register," they are redirected to the Google Form (or shown an embedded iframe). Only after the form is submitted do they return to the VSEUS site to complete registration.
3. All response data lives in the connected Google Sheet in the exec team's Google Drive — no personal data is ever stored in localStorage or the VSEUS database.

**Why this is worth exploring:**
- Zero custom data infrastructure — Google handles validation, storage, and exports.
- Exec team can view and filter responses directly in Google Sheets without touching the website.
- Reduces exposure in a security incident: even if the VSEUS site were compromised, registrant survey answers are not accessible from it.
- Forms are fully customisable per event with no code changes required.

**Implementation sketch (when ready):**
- Add a `googleFormUrl: string | null` field to the `Event` type.
- Show a "Fill out the form to register" step in `RegistrationModal` before confirmation; open the form URL in a new tab.
- Since Google Forms completion cannot be verified programmatically without OAuth, the simplest approach is an honour-system checkbox ("I have submitted the form") before the confirm button unlocks.
- A stricter version would use the Google Forms API or Apps Script webhook to mark a submission, then poll or receive a callback before allowing registration — but this requires a backend.
- Drop the built-in question builder from the admin create form once this is adopted.
