'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { formatPostDate, type PostMeta } from '@/lib/post';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

/** Sentinel for "no filter" — the default. */
const ALL = null;

function TagPill({ tag }: { tag: string }) {
  return (
    <span className="font-display text-[10px] font-semibold uppercase tracking-widest bg-ice text-midnight px-2.5 py-1 rounded-full">
      {tag}
    </span>
  );
}

function Byline({ post, className = '' }: { post: PostMeta; className?: string }) {
  return (
    <p className={`text-xs text-muted ${className}`}>
      {post.author}
      {post.date && <> · {formatPostDate(post.date)}</>}
      {' · '}
      {post.readingTime} min read
    </p>
  );
}

function FilterPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'font-display text-xs font-semibold uppercase tracking-widest',
        'px-4 py-2 rounded-full border transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-midnight focus-visible:ring-offset-2 focus-visible:ring-offset-ice',
        active
          // Accent is a fill with a midnight label — never accent text on light.
          ? 'bg-accent border-accent text-midnight'
          : 'bg-offwhite border-ice-400 text-midnight hover:border-accent',
      ].join(' ')}
    >
      {label}
      <span className={active ? 'opacity-70' : 'text-muted'}> {count}</span>
    </button>
  );
}

function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-offwhite border border-ice-400 hover:border-accent hover:shadow-lg hover:shadow-midnight/10 rounded-2xl overflow-hidden transition-all flex flex-col"
    >
      <ImagePlaceholder label="Cover image" className="w-full h-56 border-0 border-b border-dashed" />
      <div className="p-6 flex flex-col flex-1">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((t) => <TagPill key={t} tag={t} />)}
          </div>
        )}
        <h2 className="text-xl font-bold text-midnight leading-snug mb-2 group-hover:text-midnight-700 transition-colors">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
        )}
        <Byline post={post} className="mt-auto" />
      </div>
    </Link>
  );
}

/**
 * The post index, with tag filtering.
 *
 * Filtering is client-side state rather than a URL parameter: every post is
 * already in the page, so there is nothing to fetch, and the whole site is
 * statically prerendered. The tradeoff is that a filtered view isn't
 * shareable — worth revisiting if the archive grows enough that someone would
 * want to link to "all the Academics posts".
 *
 * The featured treatment only appears unfiltered. Once you've picked a tag
 * you're looking at results, and singling one out is noise.
 */
export function BlogList({ posts, tags }: { posts: PostMeta[]; tags: string[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(ALL);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const post of posts) {
      for (const tag of post.tags) map.set(tag, (map.get(tag) ?? 0) + 1);
    }
    return map;
  }, [posts]);

  const visible = useMemo(
    () => (activeTag === ALL ? posts : posts.filter((p) => p.tags.includes(activeTag))),
    [posts, activeTag],
  );

  if (posts.length === 0) {
    return (
      <div className="bg-offwhite border border-ice-400 rounded-2xl p-12 text-center max-w-xl mx-auto">
        <svg className="w-12 h-12 mx-auto mb-4 text-ice-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
        </svg>
        <h2 className="text-xl font-bold text-midnight mb-2">No posts yet</h2>
        <p className="text-muted text-sm">The first one is on its way. Check back soon.</p>
      </div>
    );
  }

  const [featured, ...rest] = visible;
  const showFeatured = activeTag === ALL;

  return (
    <>
      {tags.length > 0 && (
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="Filter posts by tag">
            <FilterPill
              label="All"
              count={posts.length}
              active={activeTag === ALL}
              onClick={() => setActiveTag(ALL)}
            />
            {tags.map((tag) => (
              <FilterPill
                key={tag}
                label={tag}
                count={counts.get(tag) ?? 0}
                active={activeTag === tag}
                onClick={() => setActiveTag(tag)}
              />
            ))}
          </div>

          {activeTag !== ALL && (
            <p aria-live="polite" className="text-sm text-muted mt-4">
              {visible.length} {visible.length === 1 ? 'post' : 'posts'} tagged{' '}
              <span className="text-midnight font-semibold">{activeTag}</span>.{' '}
              <button
                type="button"
                onClick={() => setActiveTag(ALL)}
                className="text-midnight font-semibold underline decoration-accent decoration-2 underline-offset-2"
              >
                Show all
              </button>
            </p>
          )}
        </div>
      )}

      {showFeatured ? (
        <>
          {/* Newest post gets the full width, unfiltered only */}
          <Link
            href={`/blog/${featured.slug}`}
            className="group block bg-offwhite border border-ice-400 hover:border-accent hover:shadow-xl hover:shadow-midnight/10 rounded-2xl overflow-hidden transition-all mb-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <ImagePlaceholder
                label="Cover image"
                className="w-full h-72 lg:h-full min-h-[360px] border-0 border-b lg:border-b-0 lg:border-r border-dashed"
              />
              <div className="p-8 lg:p-10 flex flex-col">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="font-display text-[10px] font-semibold uppercase tracking-widest bg-accent text-midnight px-2.5 py-1 rounded-full">
                    Latest
                  </span>
                  {featured.tags.map((t) => <TagPill key={t} tag={t} />)}
                </div>
                <h2 className="text-3xl font-black text-midnight leading-tight mb-3 group-hover:text-midnight-700 transition-colors">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="text-muted leading-relaxed mb-5">{featured.excerpt}</p>
                )}
                <Byline post={featured} className="mt-auto" />
                <span className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-midnight mt-4 border-b-2 border-accent pb-0.5 self-start">
                  Read post
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => <PostCard key={post.slug} post={post} />)}
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((post) => <PostCard key={post.slug} post={post} />)}
        </div>
      )}
    </>
  );
}
