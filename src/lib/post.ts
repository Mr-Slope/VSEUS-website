/**
 * Post types and formatting — no Node built-ins, so this is safe to import
 * from client components.
 *
 * The filesystem reading and markdown rendering live in src/lib/blog.ts, which
 * pulls in `fs` and `remark`. Importing that from a client component drags
 * both into the browser bundle and the build fails, so anything shared between
 * server and client belongs here instead.
 */

export interface PostMeta {
  slug: string;
  title: string;
  /** 'YYYY-MM-DD' */
  date: string;
  author: string;
  excerpt: string;
  tags: string[];
  /** Reading time in minutes, estimated from word count. */
  readingTime: number;
  /** Path under public/, e.g. '/photos/Blog/my-post.jpg'. Omit to show a placeholder. */
  cover?: string;
}

export interface Post extends PostMeta {
  /** Rendered HTML from the markdown body. */
  contentHtml: string;
}

export function formatPostDate(date: string): string {
  if (!date) return '';
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
