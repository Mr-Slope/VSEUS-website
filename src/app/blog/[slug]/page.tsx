import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPost, getPostSlugs, formatPostDate } from '@/lib/blog';

// Every post is known at build time, so all of them prerender as static HTML.
export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post not found | VSEUS' };

  return {
    title: `${post.title} | VSEUS`,
    description: post.excerpt,
    authors: [{ name: post.author }],
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // "More posts" = everything else, newest first, capped at three.
  const others = getAllPosts().filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-ice">

      {/* Header */}
      <section className="bg-midnight py-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-grid-bg opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-midnight via-midnight/70 to-midnight-700/40" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-offwhite/40 mb-6">
            <Link href="/blog" className="hover:text-offwhite transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-offwhite/70 truncate">{post.title}</span>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="font-display text-[10px] font-semibold uppercase tracking-widest bg-accent text-midnight px-2.5 py-1 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl font-black text-offwhite leading-[1.1] mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-offwhite/55">
            <span className="text-offwhite/85 font-semibold">{post.author}</span>
            {post.date && (
              <>
                <span aria-hidden="true">·</span>
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-14 lg:py-20 bg-ice">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="bg-offwhite border border-ice-400 rounded-2xl p-7 sm:p-10 lg:p-14">
            {post.excerpt && (
              <p className="text-xl text-midnight leading-relaxed font-medium pb-7 mb-9 border-b border-ice-400">
                {post.excerpt}
              </p>
            )}
            {/*
              contentHtml comes from remark rendering markdown we author and commit
              ourselves — there is no user-submitted content anywhere in this pipeline.
            */}
            <div className="prose" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
          </article>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-display text-sm font-semibold text-midnight hover:text-midnight-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              All posts
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center bg-accent text-midnight font-display font-semibold px-5 py-2.5 rounded-lg hover:bg-accent-600 transition-colors text-sm"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* More posts */}
      {others.length > 0 && (
        <section className="py-16 bg-midnight">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-offwhite mb-8">More from VSEUS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="bg-midnight-800/70 border border-offwhite/10 rounded-2xl p-6 hover:border-accent/50 hover:bg-midnight-800 transition-all group"
                >
                  <p className="font-display text-[10px] font-semibold uppercase tracking-widest text-accent mb-2">
                    {p.tags[0] ?? 'Post'}
                  </p>
                  <p className="text-offwhite font-bold text-lg leading-snug mb-2">{p.title}</p>
                  {p.excerpt && (
                    <p className="text-offwhite/55 text-sm leading-relaxed line-clamp-3">{p.excerpt}</p>
                  )}
                  <p className="text-offwhite/35 text-xs mt-4">
                    {formatPostDate(p.date)} · {p.readingTime} min read
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
