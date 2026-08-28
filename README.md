# VSEUS Website

Official website for the **Vancouver School of Economics Undergraduate Society** at the University of British Columbia.

A fully static marketing site: no database, no environment variables, no server-side
secrets. Built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4, and
deployed to GitHub Pages as a static export.

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
| Hosting | GitHub Pages, published by GitHub Actions |
| Build output | Static export (`output: "export"`) written to `out/` |

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
npm run build          # production build + type check, writes the export to out/
npx serve@latest out   # serve that build locally
npm run lint           # ESLint
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
│   ├── clubs/page.tsx          # Recognized clubs
│   ├── elc/page.tsx            # Economics Learning Centre
│   ├── events/page.tsx         # Upcoming events
│   ├── blog/
│   │   ├── page.tsx            # Post index (reads posts, hands off to BlogList)
│   │   └── [slug]/page.tsx     # Individual post, prerendered per file
│   └── contact/page.tsx        # Form, executive email directory, socials
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky glass navbar, centred nav, hover dropdowns
│   │   └── Footer.tsx
│   ├── blog/
│   │   └── BlogList.tsx        # Post grid + tag filtering (client)
│   ├── home/
│   │   ├── Hero.tsx            # Full-screen hero, scroll-driven SVG curve
│   │   ├── StatsBar.tsx        # Count-up stats
│   │   ├── ServicePillars.tsx  # 2×2 tilt cards with scroll reveal
│   │   ├── MerchStrip.tsx      # Merch promo + shop link
│   │   ├── CalendarSection.tsx # Calendar block (fetches the feed at build)
│   │   └── CalendarEmbed.tsx   # The iframe, starting at the next event
│   └── ui/
│       ├── Button.tsx          # General button with ripple
│       ├── CTAButton.tsx       # Primary CTA — triggers circular page transition
│       ├── Input.tsx
│       ├── Reveal.tsx          # Scroll reveal wrapper (IntersectionObserver)
│       ├── ImagePlaceholder.tsx# Stand-in for artwork not yet supplied
│       ├── SocialIcons.tsx     # Shared social links (Footer + Contact)
│       └── TransitionLink.tsx  # Link that plays the colour wipe (CTAs only)
│
├── contexts/
│   └── TransitionContext.tsx   # Circular clip-path page transition engine
│
├── lib/
│   ├── events.ts               # UPCOMING_EVENTS — the public events list
│   ├── execs.ts                # Executive roster (About + Contact)
│   ├── calendar.ts             # Google Calendar config + build-time ICS read
│   ├── society.ts              # Founding year, years-running, address
│   ├── attribution.ts          # Footer builder credit (protected, see AGENTS.md)
│   ├── blog.ts                 # Build-time markdown loader (Node only)
│   └── post.ts                 # Post types + date formatting (browser safe)
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
| Recognized clubs | `clubs` array in `src/app/clubs/page.tsx` |
| Resource cards | `resources` array in `src/app/resources/page.tsx` |
| Merch products and shop link | `products` / `SHOP_URL` in `src/components/home/MerchStrip.tsx` |
| Social links | `socials` in `src/components/ui/SocialIcons.tsx` |
| Calendar ID / subscribe link | `src/lib/calendar.ts` |
| Address, founding year | `src/lib/society.ts` |
| Who the contact form goes to | `CONTACT_FORM_TO` / `CONTACT_FORM_CC` in `src/lib/execs.ts` |
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

Tags double as the index filter: `/blog` shows a pill per tag with a post count,
defaulting to **All**. Filtering is client-side state, not a URL parameter, so a
filtered view isn't shareable — every post is already in the page, so there's nothing
to fetch. Worth moving into the URL if the archive grows. Reuse an existing tag rather
than coining a near-duplicate; they're case-sensitive, so `Policy` and `policy` become
two separate pills.

`src/lib/blog.ts` imports `fs` and `remark`, so it can only be used from server
components. Anything the client needs — the `PostMeta` type, `formatPostDate` — lives in
`src/lib/post.ts` instead. Importing `blog.ts` from a client component drags Node
built-ins into the browser bundle and the build fails.

### The Economics Calendar

The home page embeds the public Google Calendar shared across the economics
clubs. Calendar ID, timezone, and the subscribe link live in `src/lib/calendar.ts`.

The embed is an agenda list starting at the next upcoming event rather than at
today, so the frame is never empty. Agenda rather than a week grid because
Google's embed has no parameter for the starting hour or scroll position, so a
grid would open on empty morning hours — `EMBED_MODE` in `src/lib/calendar.ts`
switches it back to `WEEK` if wanted. Google's ICS feed sends no CORS headers, so
the browser can't read it — the feed is fetched and parsed at **build time** and
the upcoming dates are baked into the page; the browser then picks the first one
still in the future. Adding events to the Google Calendar shows up in the embed
immediately (the iframe loads live from Google), but the *targeting* only
catches up on the next deploy. If the feed can't be read at build time the build
still succeeds and the embed falls back to starting from today.

The calendar must stay **public** for the embed to work for visitors.

### Events

An event needs a title, description, date (`YYYY-MM-DD`), time, location, category,
and whether it's paid. Add `registrationUrl` — a Google Form, Eventbrite page, or
ticket store — to put a **Register** button on the card. Leave it off and the card is
information only. Delete past events rather than leaving them in place; if the list is
empty the page shows an empty state.

### The contact form

There is no backend, so the form doesn't post anywhere. Submitting composes the message
in the visitor's own email app, addressed to VP Marketing with the President and VP
Administration copied — those come from `CONTACT_FORM_TO` / `CONTACT_FORM_CC` in
`src/lib/execs.ts`, derived from the roster so they can't point at a dead inbox.

It works with no account and no secrets, but it does depend on the visitor having a mail
client configured, which is why the confirmation also prints the address to write to. To
send server-side instead, replace `handleSubmit` in `src/app/contact/page.tsx` with a
POST to Formspree or Web3Forms (free tier, keeps the site static). A Resend route is not
an option on GitHub Pages: besides an API key and a verified domain, it needs a server to
run the route on, and a static export has none.

### Site photos and remaining placeholders

Real photography lives under `public/photos/`, grouped by the page that uses it:
`Home/` (the hero banner and the four pillar images), `logos/` (the society mark), and
empty `About/`, `Events/`, `Blog/`, `Contact/`, and `Resources/` folders staged for
images still to come. The navbar logo, the hero image, and the four pillar photos are
already wired in.

Still rendering `<ImagePlaceholder />`, so each is a one-line swap once art is supplied:

| Placeholder | Where |
|---|---|
| Exec headshots | `src/app/about/page.tsx` (the `About/` photos folder is staged) |
| Merch photos | `src/components/home/MerchStrip.tsx`; tiles currently read "Available Soon" |
| Blog cover images | `public/blog/`; index cards show placeholders |
| Club logos | `src/app/clubs/page.tsx` |

Non-image placeholders:

| Placeholder | Where |
|---|---|
| Real email addresses | `src/lib/execs.ts`, currently `role@vseus.ca` |
| Merch shop URL | `SHOP_URL` in `src/components/home/MerchStrip.tsx`, currently `#` |

Search the codebase for `TODO` to find them all.

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
- **Page transitions** — circular clip-path wipe from the click point. It covers fully,
  *then* navigates, then waits for the new route to commit before uncovering, so the swap
  is never visible and the reveal happens on the page you asked for. Applied to CTA
  buttons via `TransitionLink`; navbar, footer, breadcrumbs, and card links navigate
  plainly, since a full-screen cover is friction when you're just browsing
- **Count-up stats** — number animation triggered on scroll into view

All of it is disabled under `prefers-reduced-motion: reduce`.

---

## Deploying

The site is hosted on **GitHub Pages** and deploys itself. Every push to `main` runs
`.github/workflows/nextjs.yml`, which builds the static export and publishes `out/`.
There is nothing to run by hand and no environment variables to set. Every route
prerenders as static content.

The custom domain `vseus.ca` is configured in **Settings → Pages**, with the apex
pointed at GitHub's four Pages IP addresses. Because the domain lives in the repository
settings and the deploy publishes an Actions artifact, `public/` needs no `CNAME` file
and no `.nojekyll` file: the artifact is served as uploaded, so the `_next` directory is
not stripped.

### Do not re-add `static_site_generator`

`next.config.ts` owns `output` and `images.unoptimized`. The workflow deliberately does
**not** pass the `static_site_generator: next` input to `actions/configure-pages`.

That input reads only `next.config.js`/`.mjs`. Finding neither, it writes a fresh
`next.config.js` that shadows `next.config.ts` (Next resolves `.js` first), and it
derives `basePath` from the repository name. That is right for a project site at
`<user>.github.io/VSEUS-website/` and wrong for the apex domain, where the site root is
`/`. It has already broken the site once: every `/VSEUS-website/_next/*` asset returned
404, so no CSS or client JS loaded and the page rendered as raw HTML.

### What a static export rules out

Anything needing a server is unavailable: `redirects()`, `rewrites()`, `headers()`,
route handlers, server actions, and `next/image` optimization. `next start` does not run
against an export either, which is why the local preview above uses a static file
server.

One live consequence: the `/services` to `/resources` redirect from the old page name
cannot run, so `/services` returns 404. The rule is kept commented in `next.config.ts`.
Restoring it needs either a stub `public/services/index.html` with a meta refresh, or a
host that can serve real redirects.

---

## Member Login (removed)

The site previously had a member portal and admin system backed by Neon Postgres and
Auth.js: code-based login, event registration, QR tickets, a door scanner, and member
management. It was removed before launch so the published site needs no database,
secrets, or staffed admin surface.

It is fully documented in [`docs/member-login/`](./docs/member-login/): what was built,
the schema, why it went, and how to restore it. The code is preserved at the
`archive/postgres-auth` tag (commit `e2f0b84`, formerly the `feat/postgres-auth-codes`
branch).

---

## Ideas

### Google Forms integration for event registration

Rather than rebuilding registration in-house, link each event to a Google Form via
`registrationUrl` (already supported). Responses land in a spreadsheet the exec team
already knows how to use, with no backend to maintain.

### Server-side contact form

The form currently hands off to the visitor's email app (see above). A form service such
as Formspree or Web3Forms would let it send directly at the cost of an account, and keeps
the site static. A mail API such as Resend needs a serverless function to hold the API
key, so it would mean moving off GitHub Pages.

### Shareable blog filters

Filtering is client-side state today. Moving it into a URL parameter would make
`/blog?tag=Academics` linkable — worth it once there are enough posts for that to matter.
