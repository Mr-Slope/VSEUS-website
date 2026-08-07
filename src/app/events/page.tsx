import React from 'react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { UPCOMING_EVENTS, PAST_EVENT_PHOTOS } from '@/lib/events';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-CA', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function EventsPage() {
  const events = UPCOMING_EVENTS;

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {events.length === 0 ? (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-offwhite border border-ice-400 rounded-2xl overflow-hidden hover:border-accent hover:shadow-lg hover:shadow-midnight/10 transition-all flex flex-col">
                  {event.posterUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={event.posterUrl}
                      alt={`${event.title} poster`}
                      className="w-full aspect-video object-cover"
                    />
                  ) : (
                    <div className="h-2 bg-accent" />
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="font-display text-xs font-semibold bg-ice text-midnight px-2.5 py-0.5 rounded-full">
                        {event.category}
                      </span>
                      {event.isPaid ? (
                        <span className="font-display text-xs font-semibold text-midnight bg-accent px-2.5 py-0.5 rounded-full">
                          ${event.price}
                        </span>
                      ) : (
                        <span className="font-display text-xs font-semibold text-midnight bg-ice-200 border border-ice-400 px-2.5 py-0.5 rounded-full">
                          Free
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-lg text-midnight mb-1.5 leading-snug">{event.title}</h3>
                    <p className="text-xs text-muted mb-4 line-clamp-3">{event.description}</p>

                    <div className="space-y-1.5 text-xs text-muted mb-5">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 flex-shrink-0 text-midnight-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

                    {/* Only events with a registration link get a button */}
                    {event.registrationUrl && (
                      <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto flex items-center justify-center gap-1.5 w-full bg-accent text-midnight font-display text-sm font-semibold py-3 rounded-lg hover:bg-accent-600 transition-colors"
                      >
                        Register
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
            <h2 className="text-3xl font-black text-offwhite mb-3">Past Events</h2>
            <p className="text-offwhite/55 text-sm mb-10 max-w-xl">
              A look at what the society has run before — competitions, socials, workshops,
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
