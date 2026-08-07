/**
 * Blog posts are markdown files in content/blog/. Everything here runs at
 * build time only — the published pages are static HTML with no client JS.
 *
 * To publish a post, drop a .md file in content/blog/. The filename becomes
 * the URL slug. See content/README.md for the frontmatter fields.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import type { Post, PostMeta } from './post';

// Re-exported so server code has one import site for everything post-related.
export { formatPostDate } from './post';
export type { Post, PostMeta } from './post';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function readingTimeFor(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Frontmatter is author-supplied, so treat every field as untrusted and fall
 * back rather than throwing — one malformed post shouldn't break the build.
 */
function toMeta(slug: string, data: Record<string, unknown>, body: string): PostMeta {
  const rawDate = data.date;
  const date =
    rawDate instanceof Date
      ? rawDate.toISOString().slice(0, 10)
      : typeof rawDate === 'string'
        ? rawDate.slice(0, 10)
        : '';

  return {
    slug,
    title: typeof data.title === 'string' ? data.title : slug,
    date,
    author: typeof data.author === 'string' ? data.author : 'VSEUS',
    excerpt: typeof data.excerpt === 'string' ? data.excerpt : '',
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingTime: readingTimeFor(body),
  };
}

/**
 * A .md file only counts as a post if it has a `title` in its frontmatter, and
 * isn't underscore-prefixed. That gives two things for free: notes and drafts
 * can live alongside posts without becoming routes, and a file missing its
 * frontmatter block is skipped rather than published as an untitled page.
 */
function postFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((file) => {
    if (!file.endsWith('.md') || file.startsWith('_')) return false;
    const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, file), 'utf8'));
    return typeof data.title === 'string' && data.title.trim() !== '';
  });
}

/** All posts, newest first. Metadata only — no markdown rendering. */
export function getAllPosts(): PostMeta[] {
  return postFiles()
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
      const { data, content } = matter(raw);
      return toMeta(slug, data, content);
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostSlugs(): string[] {
  return postFiles().map((f) => f.replace(/\.md$/, ''));
}

/** A single post with its markdown rendered to HTML. Null if the slug is unknown. */
export async function getPost(slug: string): Promise<Post | null> {
  // Go through postFiles() so drafts and untitled files can't be reached by
  // guessing the URL, not just be absent from the index.
  if (!postFiles().includes(`${slug}.md`)) return null;

  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const processed = await remark().use(html).process(content);

  return {
    ...toMeta(slug, data, content),
    contentHtml: processed.toString(),
  };
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts()) post.tags.forEach((t) => tags.add(t));
  return [...tags].sort();
}
