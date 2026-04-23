import React from 'react';
import Link from 'next/link';

export function CalendarSection() {
  return (
    <section className="bg-navy-900 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-3">
              Stay in the Loop
            </p>
            <h2 className="text-3xl font-black text-white mb-4">
              Never Miss an Event
            </h2>
            <p className="text-white/70 leading-relaxed mb-6">
              Subscribe to the VSEUS Economics Calendar and get all our events — competitions, networking nights, workshops, and socials — delivered directly to Google Calendar, Apple Calendar, or Outlook.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-gold text-navy-900 font-semibold px-5 py-2.5 rounded-lg hover:bg-gold-light transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Subscribe to Calendar
              </a>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 border border-white/20 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm"
              >
                View All Events
              </Link>
            </div>
          </div>

          {/* Calendar placeholder */}
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 aspect-video flex items-center justify-center">
            <div className="text-center text-white/40">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Google Calendar embed goes here</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
