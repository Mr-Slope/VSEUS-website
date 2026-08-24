import React from 'react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { UPCOMING_EVENTS, PAST_EVENT_PHOTOS, BOUNCE_URL } from '@/lib/events';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import type { Event } from '@/types/event';

/**
 * `new Date('2026-09-20')` parses as UTC midnight, so formatting it in a
 * timezone behind UTC (anywhere in North America) rolls it back to the 19th.
 * Appending a local-midnight time avoids that shift.
 */
function toLocalDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`);
}

function formatDate(dateStr: string) {
  return toLocalDate(dateStr).toLocaleDateString('en-CA', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatWeekday(dateStr: string) {
  return toLocalDate(dateStr).toLocaleDateString('en-CA', { weekday: 'short' }).toUpperCase();
}

function formatDayNumber(dateStr: string) {
  return toLocalDate(dateStr).getDate();
}

function formatMonthShort(dateStr: string) {
  return toLocalDate(dateStr).toLocaleDateString('en-CA', { month: 'short' }).toUpperCase();
}

function CategoryChip({ category }: { category: string }) {
  return (
    <span className="font-display text-xs font-semibold bg-ice text-midnight px-2.5 py-0.5 rounded-full">
      {category}
    </span>
  );
}

function PriceChip({ event }: { event: Event }) {
  return event.isPaid ? (
    <span className="font-display text-xs font-semibold text-midnight bg-accent px-2.5 py-0.5 rounded-full">
      ${event.price}
    </span>
  ) : (
    <span className="font-display text-xs font-semibold text-midnight bg-ice-200 border border-ice-400 px-2.5 py-0.5 rounded-full">
      Free
    </span>
  );
}

/**
 * A full-width event panel: a date tile on the left, details on the right.
 * Pass `badge` to stamp an aesthetic header across the top — used to tag
 * every Econ Week panel without needing its own layout.
 */
function EventFeatureCard({ event, badge }: { event: Event; badge?: string }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-ice-400 bg-offwhite">
      {badge && (
        <div className="bg-accent-200 px-5 py-2 flex items-center gap-2 border-b border-accent-600/25">
          <svg className="w-3.5 h-3.5 text-accent-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.363 1.118l1.287 3.958c.299.921-.755 1.688-1.539 1.118l-3.367-2.447a1 1 0 00-1.176 0l-3.367 2.447c-.784.57-1.838-.197-1.539-1.118l1.287-3.958a1 1 0 00-.363-1.118L2.062 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.958z" />
          </svg>
          <span className="font-display text-midnight text-[11px] font-bold uppercase tracking-[0.2em]">
            {badge}
          </span>
        </div>
      )}
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-40 flex-shrink-0 bg-midnight flex sm:flex-col items-center justify-center gap-2 sm:gap-1 py-6">
          <span className="font-display text-accent text-4xl font-black leading-none">
            {formatDayNumber(event.date)}
          </span>
          <span className="font-display text-offwhite/55 text-xs font-semibold uppercase tracking-widest">
            {formatMonthShort(event.date)} · {formatWeekday(event.date)}
          </span>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-3">
            <CategoryChip category={event.category} />
            <PriceChip event={event} />
          </div>
          <h3 className="font-bold text-lg text-midnight mb-1.5 leading-snug">{event.title}</h3>
          <p className="text-sm text-muted mb-4">{event.description}</p>
          <div className="space-y-1.5 text-xs text-muted mb-5">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 flex-shrink-0 text-midnight-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 22a10 10 0 100-20 10 10 0 000 20z" />
              </svg>
              {formatDate(event.date)} · {event.time}
            </div>
            <div className="flex items-start gap-1.5">
              <svg className="w-3.5 h-3.5 flex-shrink-0 text-midnight-700 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {event.location}
            </div>
          </div>
          {event.registrationUrl && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:mt-auto sm:w-fit flex items-center justify-center gap-1.5 bg-accent text-midnight font-display text-sm font-semibold px-6 py-3 rounded-lg hover:bg-accent-600 transition-colors"
            >
              Get Tickets on Bounce
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const econWeekEvents = UPCOMING_EVENTS.filter((e) => e.series === 'Econ Week');
  const otherEvents = UPCOMING_EVENTS.filter((e) => e.series !== 'Econ Week');

  return (
    <div className="min-h-screen bg-ice">
      <section className="bg-midnight py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-display text-accent text-sm font-semibold uppercase tracking-widest mb-2">What&apos;s On</p>
          <h1 className="text-4xl font-black text-offwhite">Upcoming Events</h1>
          <p className="text-offwhite/70 mt-2 text-sm">
            Competitions, networking nights, workshops, and socials run by VSEUS.
          </p>
        </div>
      </section>

      <section className="py-12 bg-ice">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {UPCOMING_EVENTS.length === 0 ? (
            <div className="bg-offwhite border border-ice-400 rounded-2xl p-12 text-center max-w-xl mx-auto">
              <svg className="w-12 h-12 mx-auto mb-4 text-ice-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-xl font-bold text-midnight mb-2">No events scheduled right now</h2>
              <p className="text-muted text-sm mb-6">
                We announce new events on Instagram and through the newsletter. Check back soon.
              </p>
              <TransitionLink
                href="/contact#newsletter"
                className="inline-flex items-center bg-accent text-midnight font-display font-semibold px-6 py-3 rounded-lg hover:bg-accent-600 transition-colors text-sm"
              >
                Join the Newsletter
              </TransitionLink>
            </div>
          ) : (
            <>
              {/* Standalone events not part of a series */}
              {otherEvents.length > 0 && (
                <div className="space-y-6">
                  {otherEvents.map((event) => (
                    <EventFeatureCard key={event.id} event={event} />
                  ))}
                </div>
              )}

              {/* Econ Week */}
              {econWeekEvents.length > 0 && (
                <div>
                  <div className="flex flex-col gap-1 mb-6">
                    <p className="font-display text-midnight-700 text-xs font-semibold uppercase tracking-widest">
                      Sept 20 – 26
                    </p>
                    <h2 className="text-3xl font-black text-midnight">Econ Week</h2>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-midnight rounded-2xl px-6 py-5 mb-8">
                    <div>
                      <p className="font-display text-accent text-xs font-semibold uppercase tracking-widest mb-1">
                        RSVP
                      </p>
                      <p className="text-offwhite font-bold text-base sm:text-lg">
                        Register for Econ Week events on Bounce
                      </p>
                    </div>
                    <a
                      href={BOUNCE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 flex items-center justify-center gap-1.5 bg-accent text-midnight font-display text-sm font-semibold px-6 py-3 rounded-lg hover:bg-accent-600 transition-colors"
                    >
                      Open Bounce
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </div>

                  <div className="space-y-6">
                    {econWeekEvents.map((event) => (
                      <EventFeatureCard key={event.id} event={event} badge="Econ Week" />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Past events gallery */}
      {PAST_EVENT_PHOTOS.length > 0 && (
        <section className="py-16 lg:py-20 bg-midnight">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="font-display text-accent text-xs font-semibold uppercase tracking-widest mb-3">
              Looking Back
            </p>
            <h2 className="text-3xl font-black text-offwhite mb-3">Highlights</h2>
            <p className="text-offwhite/55 text-sm mb-10 max-w-xl">
              A look at what the society has run before: competitions, socials, workshops,
              and the annual gala.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PAST_EVENT_PHOTOS.map((photo) => (
                <figure key={photo.title} className="group">
                  <div className="relative overflow-hidden rounded-2xl">
                    {photo.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo.image}
                        alt={photo.title}
                        className="w-full aspect-[4/3] object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    ) : (
                      /* TODO: add `image` to the entry in src/lib/events.ts once photos exist */
                      <ImagePlaceholder
                        label="Event photo"
                        tone="dark"
                        className="w-full aspect-[4/3] rounded-2xl group-hover:border-accent/60 transition-colors"
                      />
                    )}
                  </div>
                  <figcaption className="mt-3">
                    <p className="text-offwhite font-bold text-base leading-snug">{photo.title}</p>
                    {photo.when && (
                      <p className="font-display text-offwhite/45 text-xs uppercase tracking-widest mt-1">
                        {photo.when}
                      </p>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
