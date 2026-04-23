# VSEUS Website

Official website for the **Vancouver School of Economics Undergraduate Society** at the University of British Columbia.

Built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4. Designed for easy future edits and a clean migration path to Firebase when the club is ready.

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
    └── event.ts                # { id, title, date, location, capacity, registered, paid, price }
```

---

## Key Features

### Member Portal
- Login and signup gated behind a pre-approved student ID list
- Each student ID can only be linked to one account
- Members can register for events, view their dashboard, and manage their profile
- Admin role unlocks an event management panel

### Economics Learning Centre (`/elc`)
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

**Admin access:** The admin account is defined in `src/lib/mockData.ts` (`ADMIN_USER`). Log in with those credentials to access `/admin`.

---

## Firebase Migration (when ready)

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
