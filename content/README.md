# Writing a blog post

Drop a `.md` file in `content/blog/`. That's the whole process — the post appears on
`/blog` and gets its own page at `/blog/<filename>` the next time the site builds.

**The filename is the URL.** `why-economics-matters.md` becomes
`vseus.ca/blog/why-economics-matters`. Use lowercase words separated by hyphens, no
spaces, no accents.

A file only becomes a post if it has a `title` in its frontmatter and its name doesn't
start with an underscore. So `_half-finished-draft.md` stays private, and a file you
forgot to add frontmatter to is skipped rather than published untitled. Neither is
reachable by guessing the URL.

## Frontmatter

Every post starts with a block fenced by `---` lines:

```markdown
---
title: Why Economics Matters in 2026
date: 2026-08-01
author: Yash Dhaundiyal
excerpt: One or two sentences shown on the blog index and in link previews.
tags: [Policy, Student Life]
---
```

| Field | Required | Notes |
|---|---|---|
| `title` | Yes | Falls back to the filename if missing |
| `date` | Yes | `YYYY-MM-DD`. Posts sort newest first |
| `author` | No | Defaults to "VSEUS" |
| `excerpt` | No | Shown on the index card and used as the page description |
| `tags` | No | Square brackets, comma-separated. Wrap in quotes if a tag has a space |

A missing or malformed field falls back rather than breaking the build, so a typo in one
post won't take the site down. It will look wrong on the page, though — check your work.

## The body

Everything after the closing `---` is normal markdown:

```markdown
Open with a paragraph. You can use **bold**, _italic_, `inline code`, and
[links](https://vseus.ca).

## A subheading

- Bullet lists
- Work fine

1. So do numbered lists
2. Like this

> Blockquotes are styled with an orange rule down the left.

![Alt text describing the image](/blog/my-image.jpg)
```

**Images** go in `public/blog/` and are referenced as `/blog/filename.jpg` — note the
leading slash and no `public`. Always write alt text; it's what screen readers announce.

## Before you publish

- Read it once out loud. It catches more than a spellchecker does.
- Check the excerpt reads well on its own — it appears without the title around it.
- Reuse an existing tag if one fits rather than inventing a near-duplicate. Tags are
  case-sensitive, so "Policy" and "policy" would show up as two separate tags.
- Run `npm run dev` and open `/blog` to see it before pushing.

## Drafting

Prefix the filename with an underscore — `_next-weeks-post.md` — and it stays out of the
site while you work on it. Rename it without the underscore to publish.

## Removing a post

Delete the file, or rename it with a leading underscore to unpublish without losing it.
Nothing else references it.
