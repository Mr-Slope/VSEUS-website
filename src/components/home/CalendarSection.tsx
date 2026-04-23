import React from 'react';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';

export function CalendarSection() {
  return (
    <section className="bg-navy-900 py-20 lg:py-28 relative overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 hero-grid-bg opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 via-transparent to-navy-900/80" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          <Reveal>
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-4">
              Stay in the Loop
            </p>
            <h2 className="text-4xl font-black text-white mb-4 leading-tight">
              Never Miss<br />an Event.
            </h2>
            <p className="text-white/50 leading-relaxed mb-8 max-w-md">
              Subscribe to the VSEUS Economics Calendar and get all our events
              (competitions, networking nights, workshops, and socials) delivered
              directly to Google Calendar, Apple Calendar, or Outlook.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-gold text-navy-900 font-semibold px-5 py-2.5 rounded-lg hover:bg-gold-light transition-colors text-sm shadow-lg shadow-gold/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Subscribe to Calendar
              </a>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 border border-white/15 text-white/70 font-medium px-5 py-2.5 rounded-lg hover:bg-white/10 hover:text-white hover:border-white/30 transition-all text-sm"
              >
                View All Events
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03] aspect-video flex items-center justify-center relative group hover:border-white/15 transition-colors duration-300">
              <div className="text-center text-white/25 group-hover:text-white/40 transition-colors duration-300">
                <svg className="w-12 h-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">Google Calendar embed</p>
                <p className="text-xs mt-1 opacity-60">Coming soon</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
