import React from 'react';
import type { Metadata } from 'next';
import { getAllPosts, getAllTags } from '@/lib/blog';
import { BlogList } from '@/components/blog/BlogList';

export const metadata: Metadata = {
  title: 'Blog | VSEUS',
  description:
    'Society updates, event recaps, and practical advice for economics students at UBC, written by VSEUS\' executive team.',
};

export default function BlogPage() {
  // Read from the filesystem at build time, then handed to a client component
  // that owns the tag filtering.
  const posts = getAllPosts();
  const tags = getAllTags();

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
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-ice">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogList posts={posts} tags={tags} />
        </div>
      </section>
    </div>
  );
}
