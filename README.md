# VSEUS Website

Official website for the **Vancouver School of Economics Undergraduate Society** at the University of British Columbia.

A fully static marketing site: no database, no environment variables, no server-side
secrets. Built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4, and
deployable to Vercel as-is.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Fonts | Barlow (headings) + Montserrat (body), via `next/font/google` |
| Data | Static TypeScript modules in `src/lib/` |
| Blog | Markdown files in `content/blog/`, rendered at build time |
| Hosting | Vercel |

> **Note:** this is a modified Next.js build. Read the relevant guide in
> `node_modules/next/dist/docs/` before writing code — APIs and conventions differ
> from stock Next.js (`middleware` → `proxy.ts`, async `cookies()`/`params`).

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No `.env` file is needed.

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
│   ├── layout.tsx              # Root layout: fonts, Navbar, Footer, TransitionProvider
│   ├── globals.css             # Brand tokens, typography, animations
│   ├── page.tsx                # Home
│   ├── about/page.tsx          # Mission, exec orbital diagram, reports
│   ├── resources/page.tsx      # Gazette, Awards & Grants, ELC, Clubs
│   ├── clubs/page.tsx          # Endorsed clubs
│   ├── elc/page.tsx            # Economics Learning Centre
│   ├── events/page.tsx         # Upcoming events
│   ├── blog/
│   │   ├── page.tsx            # Post index — featured post + grid
│   │   └── [slug]/page.tsx     # Individual post, prerendered per file
│   └── contact/page.tsx        # Form, executive email directory, socials
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky glass navbar, centred nav, hover dropdowns
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── Hero.tsx            # Full-screen hero, scroll-driven SVG curve
│   │   ├── StatsBar.tsx        # Count-up stats
│   │   ├── ServicePillars.tsx  # 2×2 tilt cards with scroll reveal
│   │   ├── MerchStrip.tsx      # Merch promo + shop link
│   │   ├── CalendarSection.tsx # Calendar block (fetches the feed at build)
│   │   └── CalendarEmbed.tsx   # The iframe, targeted at the next event's week
│   └── ui/
│       ├── Button.tsx          # General button with ripple
│       ├── CTAButton.tsx       # Primary CTA — triggers circular page transition
│       ├── Input.tsx
│       ├── Reveal.tsx          # Scroll reveal wrapper (IntersectionObserver)
│       ├── ImagePlaceholder.tsx# Stand-in for artwork not yet supplied
│       └── SocialIcons.tsx     # Shared social links (Footer + Contact)
│
├── contexts/
│   └── TransitionContext.tsx   # Circular clip-path page transition engine
│
├── lib/
│   ├── events.ts               # UPCOMING_EVENTS — the public events list
│   ├── execs.ts                # Executive roster (About + Contact)
│   ├── calendar.ts             # Google Calendar config + build-time ICS read
│   └── blog.ts                 # Build-time markdown loader for content/blog/
│
└── types/
    └── event.ts
```

---

## Editing Content

Everything editable lives in a handful of files. No CMS, no admin login.

| To change | Edit |
|---|---|
| Blog posts | Drop a `.md` file in `content/blog/` — see [`content/README.md`](./content/README.md) |
| Upcoming events | `src/lib/events.ts` — add/remove entries in `UPCOMING_EVENTS` |
| Executive team and their emails | `src/lib/execs.ts` — used by both About and Contact |
| Reports list | `reports` array in `src/app/about/page.tsx` |
| Endorsed clubs | `clubs` array in `src/app/clubs/page.tsx` |
| Resource cards | `resources` array in `src/app/resources/page.tsx` |
| Merch products and shop link | `products` / `SHOP_URL` in `src/components/home/MerchStrip.tsx` |
| Social links | `socials` in `src/components/ui/SocialIcons.tsx` |
| Calendar ID / subscribe link | `src/lib/calendar.ts` |
| ELC hours, courses, Canvas key | `src/app/elc/page.tsx` |

### Blog

Posts are markdown files in `content/blog/`. The filename becomes the URL slug, and
frontmatter supplies the title, date, author, excerpt, and tags. A file only publishes if
it has a `title` and its name doesn't start with `_`, so drafts and stray notes can sit in
the folder without becoming pages — and can't be reached by guessing the URL either.

Reading time is estimated from word count; nothing needs to be set by hand. Post images go
in `public/blog/`. Full authoring guide: [`content/README.md`](./content/README.md).

Markdown is rendered to HTML at build time by `remark`, and styled by the hand-rolled
`.prose` rules in `globals.css` — no `@tailwindcss/typography`, so the type scale and
colours come straight from the brand tokens.

### The Economics Calendar

The home page embeds the public Google Calendar shared across the economics
clubs. Calendar ID, timezone, and the subscribe link live in `src/lib/calendar.ts`.

The embed targets the week of the next upcoming event rather than the current
week, so the frame is never empty. Google's ICS feed sends no CORS headers, so
the browser can't read it — the feed is fetched and parsed at **build time** and
the upcoming dates are baked into the page; the browser then picks the first one
still in the future. Adding events to the Google Calendar shows up in the embed
immediately (the iframe loads live from Google), but the *week targeting* only
catches up on the next deploy. If the feed can't be read at build time the build
still succeeds and the embed falls back to the current week.

The calendar must stay **public** for the embed to work for visitors.

### Events

An event needs a title, description, date (`YYYY-MM-DD`), time, location, category,
and whether it's paid. Add `registrationUrl` — a Google Form, Eventbrite page, or
ticket store — to put a **Register** button on the card. Leave it off and the card is
information only. Delete past events rather than leaving them in place; if the list is
empty the page shows an empty state.

### Outstanding placeholders

Search the codebase for `TODO` to find them all. The main ones:

| Placeholder | Where |
|---|---|
| Logo | `public/logo.svg` → Navbar |
| Hero image | `public/hero.jpg` → Hero |
| Pillar photos | `public/pillars/{academic,community,career,advocacy}.jpg` |
| Exec photos | `public/exec/<name>.jpg` |
| Merch photos | `public/merch/*.jpg` |
| Real email addresses | `src/lib/execs.ts` |
| Social profile URLs | `src/components/ui/SocialIcons.tsx` |
| Merch shop URL | `src/components/home/MerchStrip.tsx` |
| Club names and details | `src/app/clubs/page.tsx` |
| Blog post cover images | `public/blog/` → the index cards currently show placeholders |
| Economics Gazette copy | `src/app/resources/page.tsx` |

Each image placeholder is a single `<ImagePlaceholder />` call, so swapping in a real
image is a one-line change per site.

---

## Design System

### Colour tokens (defined in `src/app/globals.css`)

| Token | Value | Role |
|---|---|---|
| `midnight` | `#032B4A` | Brand. Dark sections, body text on light |
| `midnight-900/800/700` | derived | Footer, elevated cards, mid bands |
| `blue` | `#3AAADF` | Brand. Fills, icons, accents |
| `blue-600` / `blue-300` | derived | Hover; muted text on dark |
| `ice` | `#C1CDDA` | Brand. The page background |
| `ice-400` / `ice-200` | derived | Borders; intermediate fill |
| `offwhite` | `#F7F6F5` | Brand. Card and panel surfaces |
| `accent` | `#EDB187` | Brand. Highlights |
| `accent-600` / `accent-200` | derived | Hover; tint |
| `muted` | `#4A6275` | Body text on light surfaces |

**Two contrast rules constrain how these may be used.** Both are documented inline in
`globals.css`; breaking them produces text nobody can read.

1. **Accent orange is never text on a light surface.** It is 1.3:1 on icy blue and
   1.6:1 on off-white. On light surfaces it appears as a *fill* (a midnight label on an
   orange button is ~8:1), a rule, or an icon chip. As text it belongs on midnight,
   where it reaches ~7:1.
2. **Primary blue is not body-text safe on light.** It is 2.3:1 on off-white. Use it as
   a fill or icon there; as text it belongs on midnight (~5.6:1).

### Typography

Barlow carries headings and display type (`font-display`, and every `h1`–`h6` by
default). Montserrat carries body copy as the default `font-sans`. Both load through
`next/font/google` in the root layout.

### Animations

- **Hero** — staggered word entrance, scroll-driven SVG curve under "Curve"
- **Scroll reveal** — `<Reveal>` wrapper using IntersectionObserver
- **Tilt cards** — mouse-tracked 3D transform on the Four Pillars
- **Page transitions** — circular clip-path expansion from the click point (`CTAButton`)
- **Count-up stats** — number animation triggered on scroll into view

All of it is disabled under `prefers-reduced-motion: reduce`.

---

## Deploying to Vercel

1. Push to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Framework preset: **Next.js**. No environment variables are required.
4. Deploy, then point `vseus.ca` at it in Vercel's domain settings.

Every route prerenders as static content.

---

## Member Login (removed)

The site previously had a member portal and admin system backed by Neon Postgres and
Auth.js: code-based login, event registration, QR tickets, a door scanner, and member
management. It was removed before launch so the published site needs no database,
secrets, or staffed admin surface.

It is fully documented in [`docs/member-login/`](./docs/member-login/) — what was built,
the schema, why it went, and how to restore it. The code remains on
`origin/feat/postgres-auth-codes`.

---

## Ideas

### Google Forms integration for event registration

Rather than rebuilding registration in-house, link each event to a Google Form via
`registrationUrl` (already supported). Responses land in a spreadsheet the exec team
already knows how to use, with no backend to maintain.

### Contact form backend

The contact form currently simulates submission — nothing is sent. Wiring it to a form
service (Formspree, Web3Forms) or a Resend API route would take under an hour and keeps
the site static.
