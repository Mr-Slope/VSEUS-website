# VSEUS Website

Official website for the **Vancouver School of Economics Undergraduate Society** at the University of British Columbia.

A static marketing site with no server and no server-side secrets. Built with Next.js 16
(App Router), TypeScript, and Tailwind CSS v4, and deployed to GitHub Pages as a static
export.

One section talks to a database: the Vancouver Economic Review archive at `/economicreview`
fetches its issue list in the browser after the page loads, and the Review's editors add,
edit, and delete issues from that same page. Every other page, including the Review's own
Mission, Team, and Terms pages, is prerendered with no runtime data dependency. See
[Vancouver Economic Review](#vancouver-economic-review).

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
| Economic Review archive | Supabase, read (and edited by editors) client-side from `/economicreview` only |
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

Open [http://localhost:3000](http://localhost:3000).

No `.env` file is needed to run or build the site. Without one, every page works except
the Economic Review archive, which shows its "not configured" state. To develop that one
section against real data, `cp .env.example .env.local` and fill in the two values.

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
│   ├── resources/page.tsx      # The Review, Awards & Grants, ELC, Clubs
│   ├── economicreview/         # Vancouver Economic Review (see below)
│   │   ├── layout.tsx          # Masthead + section tabs, shared by all four
│   │   ├── page.tsx            # Issue archive (the section landing page)
│   │   ├── read/page.tsx       # One issue: PDF reader + conversation (?issue=<id>)
│   │   ├── comment-terms/page.tsx # Comment Terms and Community Guidelines
│   │   ├── mission/page.tsx
│   │   ├── team/page.tsx
│   │   └── terms/page.tsx
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
│   ├── economicreview/
│   │   ├── SectionTabs.tsx     # Section nav, active tab from the path (client)
│   │   ├── SubscribePanel.tsx  # Masthead subscribe/unsubscribe controls (client)
│   │   ├── SubscribeDialog.tsx # Native <dialog> mailing-list form (client)
│   │   ├── Toast.tsx           # Transient confirmation for list and editor changes (client)
│   │   ├── EditableArchive.tsx # The archive plus its editor, archive page only (client)
│   │   ├── IssueArchive.tsx    # The only runtime data fetch on the site (client)
│   │   ├── IssueCard.tsx       # One issue: cover, date, blurb, Open Report
│   │   ├── IssueCardSkeleton.tsx
│   │   ├── IssueReader.tsx     # The reader page: fetches one issue, title block (client)
│   │   ├── PdfViewer.tsx       # PDF.js viewer: pages, zoom, download (client, no SSR)
│   │   ├── comments/           # Conversation, comment box, comment, report/confirm dialogs
│   │   └── editor/             # ⋮ button, password prompt, issue form, delete confirmation
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
│   ├── economicreview/
│   │   ├── supabase.ts         # Lazy client, config from NEXT_PUBLIC_* vars
│   │   ├── issues.ts           # Issue type, archive query, date + path helpers
│   │   ├── editor.ts           # Editor sign-in, issue writes, file uploads
│   │   ├── comments.ts         # Reader comments: database calls, browser key, terms version
│   │   └── content.ts          # Masthead copy, tabs, pillars, team roster
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

Everything editable lives in a handful of files. No CMS, and one login: Economic Review
issues are managed on the archive page itself by the Review's editors.

| To change | Edit |
|---|---|
| Blog posts | Drop a `.md` file in `content/blog/` — see [`content/README.md`](./content/README.md) |
| Upcoming events | `src/lib/events.ts` — add/remove entries in `UPCOMING_EVENTS` |
| Executive team and their emails | `src/lib/execs.ts` — used by both About and Contact |
| Reports list | `reports` array in `src/app/about/page.tsx` |
| Recognized clubs | `clubs` array in `src/app/clubs/page.tsx` |
| Resource cards | `resources` array in `src/app/resources/page.tsx` |
| Economic Review issues | Not in this repo. The ⋮ button beside Terms on `/economicreview`, see [The editor](#the-editor) |
| Economic Review masthead, tabs, pillars, team | `src/lib/economicreview/content.ts` |
| Economic Review terms | `src/app/economicreview/terms/page.tsx` |
| Economic Review comment terms | `src/app/economicreview/comment-terms/page.tsx`, then bump `COMMENT_TERMS_VERSION` in `src/lib/economicreview/comments.ts` |
| Economic Review comments | Not in this repo. Moderate on each issue's page, see [Reader comments](#reader-comments) |
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

### Vancouver Economic Review

The Review is the society's weekly student publication, living at `/economicreview` with
three sub-pages: `/mission`, `/team`, and `/terms`. A shared layout gives all four the
same masthead and tab bar, so the section reads as a publication inside the site rather
than a separate one bolted on. It uses the site's own tokens, components, and animations
throughout; it introduced no second design system.

It is also **the only part of the site that reads a database.**

**Publishing an issue** means adding a row to the `newsletters` table in Supabase, not
deploying. That is the whole reason the archive fetches in the browser instead of at
build time. The editors do it from the archive page, see [The editor](#the-editor).
`created_at` doubles as the publication date: issues dated in the future are hidden until
their date passes, so a run can be queued ahead.

Rows carry `title`, `description`, `image_path`, `pdf_path`, and `created_at`. The two
paths take one of two forms. Issues added through the editor point at files in the
`newsletters` Supabase Storage bucket by full URL. Older issues point at files committed
to `public/`:

- Covers in `public/newsletter_images/`, referenced as `/newsletter_images/<file>`
- PDFs in `public/newsletter_pdfs/`, referenced as `/newsletter_pdfs/<file>`

Filenames containing spaces or parentheses are fine; `assetUrl()` in
`src/lib/economicreview/issues.ts` encodes them. **Renaming a file means updating the
matching row**, so it is usually easier to leave names alone. Covers are resized to a
1600px long edge, whether committed by hand or uploaded through the editor, which does it
in the browser: they are displayed in a card a few hundred pixels wide, and image
optimization is off for a static export, so a full-resolution photo would be shipped to
phones untouched.

#### The editor

The ⋮ button to the right of Terms in the section's tab bar asks for the editor password.
Once unlocked, every card gets Edit and Delete buttons, scheduled issues appear with a
"Scheduled" label, and the ⋮ menu offers **Add issue** and **Lock editor**. The button is
hidden on phones, like Terms, since the tabs already fill the width.

- **Adding or editing** takes a title, a summary, the date and time the issue goes live,
  a cover, and a PDF. Files are uploaded to Storage under generated names
  (`pdfs/<date>-<title>-<random>.pdf`, `covers/<...>.jpg`), never the uploaded file's own
  name. PDFs are checked for type, size (25 MB) and a real PDF header; covers for type
  and size (20 MB) before resizing.
- **Deleting** asks for confirmation, then removes the row along with any Storage files
  that only that issue used.
- **Files committed to `public/` are never deleted by the editor.** Replacing an older
  issue's cover or PDF points the row at a new upload and leaves the committed file
  where it is. Deleting an older issue removes only its row. Clearing those files out is
  a normal commit.

The session lives in memory only, so **a reload locks the editor again**, and Lock editor
signs out of Supabase rather than just hiding the buttons. The whole editor lives inside
the archive page (`EditableArchive`); the ⋮ button reaches the tab bar through an empty
portal slot, so Mission, Team, and Terms load none of it.

**What actually protects the archive is the database, not the page.** Anyone can open dev
tools and skip a check in the browser, so the page's locked or unlocked state is
presentation only. Row level security in the Review's Supabase project lets a write
through only when the signed-in account is listed in the `newsletter_editors` table, and
the same rule covers uploads to and deletions from the Storage bucket. Signing in with
some other account gets nothing, and a signed-out visitor cannot write at all. The page
signs in as `finance@vseus.ca` because Supabase password sign-in needs an email; that
address names the account and grants nothing by itself. No service role key is involved
anywhere.

**Setting it up** (once, in the Review's Supabase project):

1. Run `supabase/migrations/20260921120000_newsletter_editors.sql` from the
   [vseus-gazette-hub](https://github.com/VSEUSFinance/vseus-gazette-hub) repository in the
   dashboard's SQL editor. It creates the allowlist, the write policies, and the public
   `newsletters` bucket.
2. **Authentication → Users → Add user**: `finance@vseus.ca` with the editor password,
   with "Auto Confirm User" ticked. Then put it on the allowlist:
   `insert into public.newsletter_editors (user_id) select id from auth.users where email = 'finance@vseus.ca';`
3. Recommended: turn off "Allow new users to sign up" under Authentication. New accounts
   could not edit anyway, but there is no reason to accept them.
4. Run `supabase/verify/newsletter_editors_rls.sql` from the same repository in the SQL
   editor. It impersonates a signed-out visitor, a signed-in non-editor, and the editor,
   rolls everything back, and ends with "all checks passed".

**Changing the password** happens in the Supabase dashboard (Authentication → Users). The
site needs no redeploy.

**Configuration.** Two variables, both read at build time:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

The `NEXT_PUBLIC_` prefix is required, since the archive reads the list from the browser.
Under `output: "export"` there is no server left to read them at runtime, so Next inlines
them during `next build`. Locally they come from `.env.local` (see `.env.example`); in CI
they come from GitHub Actions **repository variables**, wired up in
`.github/workflows/nextjs.yml`.

Variables rather than secrets, deliberately. The anon key is a publishable credential
that ends up in the client bundle whichever way it is delivered, and row level security
in Supabase is the actual boundary. Masking it in logs would buy no security and make a
broken build harder to read. **The service role key belongs nowhere in this repository.**

Leave both unset and the site still builds and deploys in full. Only the archive degrades,
to a "not configured" panel. That is on purpose: a missing value for one section must
never take down the site.

The archive has four separate states, and the distinction between the last two matters:
skeleton cards while loading, the grid, an **empty** state for a working query with no
rows, and an **error** state with a retry for a query that failed. An archive that could
not load must never look like an archive with nothing in it.

**Subscriptions** are database writes and nothing else. Subscribing inserts into the
`subscribers` table, and an address already there (Postgres `23505`) is switched back on
instead of rejected, which covers both a repeat signup and someone returning after
unsubscribing. Unsubscribing switches the row off. Reads of `subscribers` are blocked by
row level security so the list cannot be harvested, which is why looking an address up
goes through the `get_subscription_by_email` security-definer function rather than a
select. Switching a row on or off goes through the `set_subscription_status` function
from `supabase/migrations/20261001140000_subscriber_status.sql` in vseus-gazette-hub. A
plain update filtered by email would match no rows under that read policy and still
report success.

**The site sends no email.** Confirmation emails were removed deliberately, so nothing in
the UI claims that anything was sent. The Review's Supabase project still holds a
`send-subscription-email` Edge Function from the old standalone site, but this repository
never calls it.

Outcomes are split by what the reader can still do. A change that went through closes the
dialog and confirms with a toast. Anything fixable, such as an address that is not on the
list, stays in the dialog beside the field that needs editing.

The table lives in a separate Supabase project, which this repository does not contain and
does not deploy. Its migrations, including the editor's, live in
[vseus-gazette-hub](https://github.com/VSEUSFinance/vseus-gazette-hub).

#### Reading an issue

A card's **Open Report** button opens the issue at `/economicreview/read?issue=<id>`, with
its title, summary, and date over the PDF, drawn into the page by PDF.js (through
`react-pdf`). The toolbar has page navigation, zoom, fit to width, and **Download**, the
same link the card used to carry.

The id is in the query string rather than the path because a static export can only have
paths that exist at build time, and issues are published as rows without a deploy. One
static page reads the id in the browser and fetches the row, so a new issue's link works
the moment its row exists.

PDF.js rather than the browser's own viewer in an iframe, which cannot be styled, differs
in every browser, and on Android shows nothing. Only pages near the screen are drawn,
since each canvas costs megabytes and phones run out of memory on a long issue. Text stays
selectable and searchable, and links in the PDF stay clickable, opening in a new tab. The
worker is bundled from `pdfjs-dist` and served from this site, not a CDN. If a PDF ever
fails to load, the reader offers Download and Open in a new tab instead.

#### Reader comments

Under every issue's PDF is a conversation. Readers comment, reply, like, share a link to a
comment, and report, with **no account**: a display name and, the first time, a tick to
agree to the Comment Terms and Community Guidelines at `/economicreview/comment-terms`.
They can delete their own comments from the browser they posted from.

With no accounts and no server, **every rule is enforced in the database**, by
`supabase/migrations/20260930120000_newsletter_comments.sql` in vseus-gazette-hub. The
comment tables are closed to the API, and the site can only call functions that check
each request:

- Rate limits per browser and, looser, per network address, since a whole campus can share
  one. A brake on any single conversation, no repeated comments, at most two links, and a
  blocklist editors can extend from the SQL editor.
- Display names that could pass for the Review or its staff (VSEUS, admin, moderator,
  editor, and so on) are refused.
- A comment reported by three readers, from at least two networks, is hidden until an
  editor reviews it.
- `comments_open` in `newsletter_comment_settings` closes every conversation at once.

Browser keys and network addresses are stored only as hashes, and network hashes are
cleared after 30 days, as the privacy section of the comment terms promises. Change
`COMMENT_TERMS_VERSION` whenever those terms change: readers are asked to agree again, and
each comment records the version its author accepted.

**Moderating.** On any issue's page, unlock the editor from the ⋮ button with the archive's
password; an editor already unlocked on the archive arrives unlocked. Hidden comments then
appear, marked, and each comment's ⋯ menu offers Hide for review, Restore, and Remove. A
removed comment with replies leaves a placeholder so the replies keep their context. As on
the archive, the ⋮ button is hidden on phones.

**For the team's analyst**, two views in the Supabase dashboard's Table Editor or SQL editor:

- `newsletter_comment_activity`: every issue with its comment, thread, reply, and hidden
  counts, open reports, and last comment time, busiest first.
- `newsletter_comment_review`: every comment with its issue, report count and reasons, and
  likes, most reported first.

Delete a comment from the dashboard by deleting its row in `newsletter_comments`; its
replies go with it. The analyst needs access to the Supabase project for the views, or the
editor password to moderate on the site.

**Setting it up** (once): run the migration in the SQL editor, then
`supabase/verify/newsletter_comments.sql`, which ends with "all checks passed" and changes
nothing. Until the migration is run, the conversation says comments are not open yet and
the rest of the reader works as normal.

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
There is nothing to run by hand. Every route prerenders as static content.

The only build-time configuration is the pair of `NEXT_PUBLIC_SUPABASE_*` repository
variables that the Economic Review archive reads. They are set once under
**Settings → Secrets and variables → Actions → Variables**, and the build succeeds with
or without them. See [Vancouver Economic Review](#vancouver-economic-review).

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

What it does **not** rule out is fetching from the browser once a page has loaded. That
is how the Economic Review archive works, and why it needed no server: the page ships as
static HTML and the issue list arrives afterwards, client-side.

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
