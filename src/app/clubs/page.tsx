import React from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

/*
  TODO: replace with the real endorsed clubs once the list is confirmed.
  Each entry needs a name, a one-line focus, a short description, and a link.
*/
const clubs = [
  {
    name: 'Placeholder Club One',
    focus: 'Finance',
    description:
      'A short description of what this club does, who it is for, and what a typical term of programming looks like.',
    href: '#',
  },
  {
    name: 'Placeholder Club Two',
    focus: 'Public Policy',
    description:
      'A short description of what this club does, who it is for, and what a typical term of programming looks like.',
    href: '#',
  },
  {
    name: 'Placeholder Club Three',
    focus: 'Data & Research',
    description:
      'A short description of what this club does, who it is for, and what a typical term of programming looks like.',
    href: '#',
  },
  {
    name: 'Placeholder Club Four',
    focus: 'Case Competitions',
    description:
      'A short description of what this club does, who it is for, and what a typical term of programming looks like.',
    href: '#',
  },
];

const steps = [
  {
    step: '01',
    title: 'Apply',
    body: 'A club executive submits an endorsement request to the VP External, outlining the club\'s mandate, membership, and planned programming for the year.',
  },
  {
    step: '02',
    title: 'Review',
    body: 'The VSEUS executive team reviews the request against our mandate: does the club serve economics students, and does it add something the society does not already provide?',
  },
  {
    step: '03',
    title: 'Endorsement',
    body: 'Endorsed clubs gain access to VSEUS funding, event support, and our channels for reaching every economics undergraduate at UBC.',
  },
];

export default function ClubsPage() {
  return (
    <div className="min-h-screen bg-ice">

      {/* Header */}
      <section className="bg-midnight py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-grid-bg opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-midnight via-midnight/70 to-midnight-700/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-offwhite/40 mb-6">
            <Link href="/resources" className="hover:text-offwhite transition-colors">Resources</Link>
            <span>/</span>
            <span className="text-offwhite/70">Clubs</span>
          </div>
          <p className="font-display text-accent text-xs font-semibold uppercase tracking-widest mb-3">Endorsed by VSEUS</p>
          <h1 className="text-5xl font-black text-offwhite mb-4 leading-tight">
            Clubs We<br />Endorse
          </h1>
          <p className="text-offwhite/60 text-lg max-w-xl leading-relaxed">
            Student-run clubs working across economics, finance, and public policy, backed
            by the society so their programming reaches every VSE student.
          </p>
        </div>
      </section>

      {/* At a glance */}
      <section className="bg-midnight-700 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-offwhite font-bold text-sm">What Endorsement Means</p>
                <p className="text-offwhite/60 text-sm mt-0.5">Funding, event support, and reach</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <div>
                <p className="text-offwhite font-bold text-sm">Who Can Apply</p>
                <p className="text-offwhite/60 text-sm mt-0.5">Any club serving economics students</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <p className="text-offwhite font-bold text-sm">Who to Contact</p>
                <p className="text-offwhite/60 text-sm mt-0.5">VSEUS VP External</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How endorsement works */}
      <section className="py-16 bg-ice">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-midnight mb-10">How Endorsement Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((s) => (
              <div key={s.step}>
                <span className="block font-display text-6xl font-black text-ice-400 leading-none select-none mb-4">
                  {s.step}
                </span>
                <h3 className="text-lg font-bold text-midnight mb-2">{s.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The clubs */}
      <section className="py-16 bg-midnight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-offwhite mb-3">Endorsed Clubs</h2>
          <p className="text-offwhite/55 text-sm mb-10 max-w-xl">
            The clubs below are currently endorsed by VSEUS. Reach out to any of them
            directly to get involved.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {clubs.map((c) => (
              <a
                key={c.name}
                href={c.href}
                className="bg-midnight-800/70 border border-offwhite/10 rounded-2xl p-6 flex gap-5 hover:border-accent/50 hover:bg-midnight-800 transition-all group"
              >
                {/* TODO: replace with the club's logo once supplied */}
                <ImagePlaceholder
                  label="Logo"
                  tone="dark"
                  hideIcon
                  className="w-28 h-28 rounded-xl flex-shrink-0"
                />
                <div className="min-w-0">
                  <span className="inline-block font-display text-[10px] font-semibold uppercase tracking-widest text-accent mb-1.5">
                    {c.focus}
                  </span>
                  <p className="text-offwhite font-bold text-lg leading-tight">{c.name}</p>
                  <p className="text-offwhite/55 text-sm mt-2 leading-relaxed">{c.description}</p>
                </div>
              </a>
            ))}
          </div>
          <p className="text-offwhite/35 text-xs mt-6">
            Running a club that should be on this list? Get in touch with the VP External.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-midnight-700 text-center">
        <h2 className="text-2xl font-black text-offwhite mb-3">Want your club endorsed?</h2>
        <p className="text-offwhite/60 text-sm mb-6 max-w-sm mx-auto">
          Reach out to the VSEUS VP External to start an endorsement request.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center bg-accent text-midnight font-display font-semibold px-6 py-3 rounded-lg hover:bg-accent-600 transition-colors text-sm"
          >
            Contact Us
          </Link>
          <Link
            href="/resources"
            className="inline-flex items-center border border-offwhite/25 text-offwhite/80 font-display font-medium px-6 py-3 rounded-lg hover:bg-offwhite/10 hover:text-offwhite transition-all text-sm"
          >
            Back to Resources
          </Link>
        </div>
      </section>

    </div>
  );
}
