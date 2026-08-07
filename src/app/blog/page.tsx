import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts, getAllTags, formatPostDate, type PostMeta } from '@/lib/blog';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

export const metadata: Metadata = {
  title: 'Blog | VSEUS',
  description:
    'Society updates, event recaps, and practical advice for economics students at UBC, written by the VSEUS executive team.',
};

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

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-ice">
      <section className="bg-midnight py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-display text-accent text-sm font-semibold uppercase tracking-widest mb-2">
            Writing
          </p>
          <h1 className="text-4xl font-black text-offwhite">Blog</h1>
          <p className="text-offwhite/70 mt-2 text-sm max-w-xl">
            Society updates, event recaps, and practical advice for economics students at UBC.
          </p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {tags.map((t) => (
                <span
                  key={t}
                  className="font-display text-[10px] font-semibold uppercase tracking-widest border border-offwhite/20 text-offwhite/60 px-2.5 py-1 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-ice">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="bg-offwhite border border-ice-400 rounded-2xl p-12 text-center max-w-xl mx-auto">
              <svg className="w-12 h-12 mx-auto mb-4 text-ice-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
              </svg>
              <h2 className="text-xl font-bold text-midnight mb-2">No posts yet</h2>
              <p className="text-muted text-sm">
                The first one is on its way. Check back soon.
              </p>
            </div>
          ) : (
            <>
              {/* Featured — the newest post gets the full width */}
              <Link
                href={`/blog/${featured.slug}`}
                className="group block bg-offwhite border border-ice-400 hover:border-accent hover:shadow-xl hover:shadow-midnight/10 rounded-2xl overflow-hidden transition-all mb-10"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* TODO: swap for the post's cover image once posts carry one */}
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
                  {rest.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group bg-offwhite border border-ice-400 hover:border-accent hover:shadow-lg hover:shadow-midnight/10 rounded-2xl overflow-hidden transition-all flex flex-col"
                    >
                      <ImagePlaceholder
                        label="Cover image"
                        className="w-full h-56 border-0 border-b border-dashed"
                      />
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
                          <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                        <Byline post={post} className="mt-auto" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
