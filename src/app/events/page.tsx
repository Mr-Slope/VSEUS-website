import React from 'react';
import Image from 'next/image';
import { getUpcomingEvents, getPastEvents, PAST_EVENT_PHOTOS } from '@/lib/events';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import type { Event, PastEventPhoto } from '@/types/event';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { CALENDAR_SUBSCRIBE_URL } from '@/lib/calendar';
import { getClub } from '@/lib/clubs';
import { getPartner } from '@/lib/partners';

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

/**
 * A "Mon D – D" (or "Mon D – Mon D" across a month boundary) label spanning a
 * list of events, computed from their actual dates rather than hardcoded, so
 * it stays correct when an event's date moves.
 */
function formatDateRangeLabel(events: Event[]): string {
  const dates = events.map((e) => e.date).sort();
  const start = toLocalDate(dates[0]);
  const end = toLocalDate(dates[dates.length - 1]);
  const startMonth = start.toLocaleDateString('en-CA', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-CA', { month: 'short' });
  return startMonth === endMonth
    ? `${startMonth} ${start.getDate()} – ${end.getDate()}`
    : `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}`;
}

function CategoryChip({ category }: { category: string }) {
  return (
    <span className="font-display text-xs font-semibold bg-ice text-midnight px-2.5 py-0.5 rounded-full">
      {category}
    </span>
  );
}

function PriceChip({ event }: { event: Event }) {
  if (!event.isPaid) {
    return (
      <span className="font-display text-xs font-semibold text-midnight bg-ice-200 border border-ice-400 px-2.5 py-0.5 rounded-full">
        Free
      </span>
    );
  }
  return (
    <span className="font-display text-xs font-semibold text-midnight bg-accent px-2.5 py-0.5 rounded-full">
      {event.price != null ? `$${event.price}` : 'Paid'}
    </span>
  );
}

/** Whoever runs an event that isn't VSEUS's own: a recognized club or a partner. */
interface EventHost {
  /** Banner label, e.g. 'Club Event'. */
  label: string;
  name: string;
  href?: string;
  logo?: string;
}

function getHost(event: Event): EventHost | undefined {
  const club = event.club ? getClub(event.club) : undefined;
  if (club) return { label: 'Club Event', name: club.name, href: club.href, logo: club.logo };
  const partner = event.partner ? getPartner(event.partner) : undefined;
  if (partner) return { label: 'Partner Event', ...partner };
  return undefined;
}

/**
 * The header strip on a club or partner event: the host's logo and name, and
 * a link out to its site. Blue rather than the orange of VSEUS's own badges,
 * so these events never read as ones the society is running.
 */
function HostBanner({ host }: { host: EventHost }) {
  const nameClass = 'font-semibold text-midnight';
  return (
    <div className="bg-blue/15 px-5 py-2 flex items-center gap-2.5 border-b border-blue/30">
      {host.logo ? (
        <Image
          src={host.logo}
          alt=""
          width={22}
          height={22}
          className="w-[22px] h-[22px] rounded-full object-cover ring-1 ring-blue/40 flex-shrink-0"
        />
      ) : (
        <span className="w-[22px] h-[22px] rounded-full bg-offwhite ring-1 ring-blue/40 flex items-center justify-center flex-shrink-0">
          <svg className="w-3 h-3 text-midnight-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
          </svg>
        </span>
      )}
      <span className="font-display text-midnight text-[11px] font-bold uppercase tracking-[0.2em] flex-shrink-0">
        {host.label}
      </span>
      <span className="text-midnight/40 text-xs" aria-hidden="true">·</span>
      <span className="text-xs text-muted min-w-0 truncate">
        Hosted by{' '}
        {host.href ? (
          <a
            href={host.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${nameClass} underline decoration-blue/60 underline-offset-2 hover:decoration-midnight transition-colors`}
          >
            {host.name}
          </a>
        ) : (
          <span className={nameClass}>{host.name}</span>
        )}
      </span>
    </div>
  );
}

/**
 * The event's date as a tear-off calendar page: the month on a coloured
 * header strip, the day number large below it, then the weekday. Hosted
 * events get a blue strip to match their lighter date panel.
 */
function CalendarTile({ date, hosted }: { date: string; hosted: boolean }) {
  return (
    <time
      dateTime={date}
      className="w-24 overflow-hidden rounded-xl bg-offwhite text-center shadow-[0_6px_16px_-6px_rgba(0,0,0,0.5)]"
    >
      <span
        className={`relative block py-1.5 font-display text-sm font-bold uppercase tracking-[0.2em] text-midnight ${
          hosted ? 'bg-blue-300' : 'bg-accent'
        }`}
      >
        {/* Binding holes along the top edge. */}
        <span className="absolute left-3 top-1 h-1.5 w-1.5 rounded-full bg-midnight/30" aria-hidden="true" />
        <span className="absolute right-3 top-1 h-1.5 w-1.5 rounded-full bg-midnight/30" aria-hidden="true" />
        {formatMonthShort(date)}
      </span>
      <span className="block pt-2 font-display text-5xl font-black leading-none text-midnight">
        {formatDayNumber(date)}
      </span>
      <span className="block pb-2.5 pt-1.5 font-sans text-xs font-semibold uppercase tracking-widest text-muted">
        {formatWeekday(date)}
      </span>
    </time>
  );
}

/**
 * A full-width event panel: a date tile on the left, details on the right.
 * Pass `badge` to stamp an aesthetic header across the top — used to tag
 * every Econ Week panel without needing its own layout. An event with a
 * `club` or `partner` gets the host's banner instead, and a lighter date tile.
 */
function EventFeatureCard({ event, badge }: { event: Event; badge?: string }) {
  const host = getHost(event);
  return (
    <div
      // Layered shadows and a slightly heavier bottom edge give the card some
      // depth; it lifts a little on hover.
      className={`rounded-2xl overflow-hidden border border-b-[3px] bg-offwhite shadow-[0_2px_4px_-1px_rgba(2,29,51,0.08),0_14px_30px_-12px_rgba(2,29,51,0.32)] transition-[transform,box-shadow] duration-300 ease-out motion-safe:hover:-translate-y-1 hover:shadow-[0_4px_8px_-2px_rgba(2,29,51,0.1),0_24px_44px_-16px_rgba(2,29,51,0.42)] ${
        host ? 'border-blue/40 border-b-blue/60' : 'border-ice-400 border-b-midnight/20'
      }`}
    >
      {host && <HostBanner host={host} />}
      {!host && badge && (
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
        <div
          className={`sm:w-40 flex-shrink-0 flex items-center justify-center py-6 ${
            host ? 'bg-midnight-700' : 'bg-midnight'
          }`}
        >
          <CalendarTile date={event.date} hosted={Boolean(host)} />
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
          {event.registrationUrl ? (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-solid sm:mt-auto sm:w-fit flex justify-center gap-1.5 text-sm px-6 py-3"
            >
              {event.isPaid ? 'Get Tickets' : 'Register'}
              <svg className="w-3.5 h-3.5 btn-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          ) : event.ticketsAvailableSoon ? (
            <span className="sm:mt-auto sm:w-fit flex items-center justify-center gap-1.5 bg-ice-200 border border-ice-400 text-muted font-display text-sm font-semibold px-6 py-3 rounded-full">
              Tickets Available Soon
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const upcomingEvents = getUpcomingEvents();
  const byDate = (a: Event, b: Event) => a.date.localeCompare(b.date);
  const clubEvents = upcomingEvents.filter((e) => e.club).sort(byDate);
  const partnerEvents = upcomingEvents.filter((e) => e.partner && !e.club).sort(byDate);
  const societyEvents = upcomingEvents.filter((e) => !e.club && !e.partner);
  const econWeekEvents = societyEvents.filter((e) => e.series === 'Econ Week').sort(byDate);
  const otherEvents = societyEvents.filter((e) => e.series !== 'Econ Week').sort(byDate);

  // Events whose date has passed drop out of upcomingEvents on their own and
  // land here instead, so they still show up somewhere rather than vanishing.
  // They render ahead of the curated entries in PAST_EVENT_PHOTOS, with the
  // event's `photo` if it has one and a placeholder tile otherwise. Club and
  // partner events are left out, since the gallery covers what the society
  // has run.
  const archivedEvents: PastEventPhoto[] = getPastEvents()
    .filter((event) => !event.club && !event.partner)
    .map((event) => ({
      title: event.title,
      when: toLocalDate(event.date).getFullYear().toString(),
      image: event.photo,
    }));
  const pastEventPhotos = [...archivedEvents, ...PAST_EVENT_PHOTOS];

  return (
    <div className="min-h-screen bg-ice">
      <section className="bg-midnight py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-sans text-accent text-sm font-semibold uppercase tracking-widest mb-2">What&apos;s On</p>
          <h1 className="text-4xl font-black text-offwhite">Upcoming <span className="heading-accent">Events</span></h1>
          <p className="text-offwhite/70 mt-2 text-sm">
            Competitions, networking nights, workshops, and socials run by VSEUS.
          </p>
        </div>
      </section>

      <SectionDivider from="midnight" to="ice" variant="swell" />
      <section className="py-12 bg-ice">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {upcomingEvents.length === 0 ? (
            <div className="bg-offwhite border border-ice-400 rounded-2xl p-12 text-center max-w-xl mx-auto">
              <svg className="w-12 h-12 mx-auto mb-4 text-ice-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-xl font-bold text-midnight mb-2">No events scheduled right now</h2>
              <p className="text-muted text-sm mb-6">
                Subscribe to the Economics Calendar and new events will land in your
                calendar as soon as they're announced.
              </p>
              <a
                href={CALENDAR_SUBSCRIBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-solid px-6 py-3 text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Join the Economics Calendar
              </a>
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
                    <p className="font-sans text-midnight-700 text-xs font-semibold uppercase tracking-widest">
                      {formatDateRangeLabel(econWeekEvents)}
                    </p>
                    <h2 className="text-3xl font-black text-midnight">Econ Week</h2>
                  </div>

                  <div className="space-y-6">
                    {econWeekEvents.map((event) => (
                      <EventFeatureCard key={event.id} event={event} badge="Econ Week" />
                    ))}
                  </div>
                </div>
              )}

              {/* Club events */}
              {clubEvents.length > 0 && (
                <div>
                  <div className="flex flex-col gap-1 mb-6">
                    <p className="font-sans text-midnight-700 text-xs font-semibold uppercase tracking-widest">
                      Recognized Clubs
                    </p>
                    <h2 className="text-3xl font-black text-midnight">From Our Clubs</h2>
                    <p className="text-muted text-sm mt-1 max-w-xl">
                      Events hosted by VSEUS-recognized clubs. Each club organizes its own
                      events independently, so please direct any questions to the hosting club.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {clubEvents.map((event) => (
                      <EventFeatureCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              )}

              {/* Partner events */}
              {partnerEvents.length > 0 && (
                <div>
                  <div className="flex flex-col gap-1 mb-6">
                    <p className="font-sans text-midnight-700 text-xs font-semibold uppercase tracking-widest">
                      Around Campus
                    </p>
                    <h2 className="text-3xl font-black text-midnight">From Our Partners</h2>
                    <p className="text-muted text-sm mt-1 max-w-xl">
                      Events hosted by the Vancouver School of Economics, VSEUS&rsquo;s principal
                      partner. These events are organized by the VSE directly, so please
                      direct any questions to the hosting office.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {partnerEvents.map((event) => (
                      <EventFeatureCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Past events gallery */}
      {pastEventPhotos.length > 0 && (
        <>
          <SectionDivider from="ice" to="midnight" variant="wave" />
          <section className="py-16 lg:py-20 bg-midnight">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="font-sans text-accent text-xs font-semibold uppercase tracking-widest mb-3">
                Looking Back
              </p>
              <h2 className="text-3xl font-black text-offwhite mb-3">Highlights</h2>
              <p className="text-offwhite/55 text-sm mb-10 max-w-xl">
                A look at what the society has run before: competitions, socials, workshops,
                and the annual gala.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEventPhotos.map((photo) => (
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
                        <p className="font-sans text-offwhite/45 text-xs uppercase tracking-widest mt-1">
                          {photo.when}
                        </p>
                      )}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
