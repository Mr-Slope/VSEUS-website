'use client';

import React, { useEffect, useState } from 'react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { UPCOMING_EVENTS } from '@/lib/events';
import type { Event } from '@/types/event';

/**
 * A small notification-style card that slides in from the top-right corner of
 * the home page, surfacing the single closest upcoming event and sending people
 * to /events to register. It sits above the page with no backdrop and no scroll
 * lock, so the home page stays visible and usable while the card is open.
 *
 * "Closest" is worked out from the event dates in src/lib/events.ts: the first
 * event whose date is today or later, ordered ascending. Dates are 'YYYY-MM-DD'
 * strings, so a plain string compare sorts them correctly and sidesteps the
 * UTC-parsing shift that bites `new Date('2026-09-20')`.
 *
 * It shows once per browser session (sessionStorage), keyed by event id, so a
 * visitor who dismisses it isn't nagged on every home-page visit, but a new
 * "closest" event brings it back.
 */

const DISMISS_KEY_PREFIX = 'vseus:event-popup-dismissed:';
const OPEN_DELAY_MS = 900;

function todayIso(): string {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
}

function nextUpcomingEvent(): Event | null {
  const today = todayIso();
  const upcoming = UPCOMING_EVENTS.filter((e) => e.date >= today).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  return upcoming[0] ?? null;
}

/** `new Date('2026-09-20')` parses as UTC midnight; the local-midnight time avoids the day shift. */
function toLocalDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`);
}

function formatFullDate(dateStr: string) {
  return toLocalDate(dateStr).toLocaleDateString('en-CA', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDayNumber(dateStr: string) {
  return toLocalDate(dateStr).getDate();
}

function formatMonthShort(dateStr: string) {
  return toLocalDate(dateStr).toLocaleDateString('en-CA', { month: 'short' }).toUpperCase();
}

function formatWeekday(dateStr: string) {
  return toLocalDate(dateStr).toLocaleDateString('en-CA', { weekday: 'short' }).toUpperCase();
}

function daysUntil(dateStr: string) {
  const start = toLocalDate(todayIso()).getTime();
  const target = toLocalDate(dateStr).getTime();
  return Math.round((target - start) / 86_400_000);
}

function countdownLabel(dateStr: string) {
  const days = daysUntil(dateStr);
  if (days <= 0) return 'Happening today';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
}

export function UpcomingEventPopup() {
  const [event, setEvent] = useState<Event | null>(null);
  const [visible, setVisible] = useState(false);

  // Pick the event and arm the open timer on the client only, so the server
  // render and the first client render match (both render nothing).
  useEffect(() => {
    const next = nextUpcomingEvent();
    if (!next) return;

    try {
      if (sessionStorage.getItem(DISMISS_KEY_PREFIX + next.id) === '1') return;
    } catch {
      // Private mode or storage disabled — fall through and show it.
    }

    const timer = window.setTimeout(() => {
      setEvent(next);
      // Second frame so the entrance transition has a start state to animate from.
      requestAnimationFrame(() => setVisible(true));
    }, OPEN_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  // Wire up Escape to dismiss while the card is mounted. No scroll lock and no
  // focus trap: this is a non-modal notification, so the page stays in charge.
  useEffect(() => {
    if (!event) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  function close() {
    if (event) {
      try {
        sessionStorage.setItem(DISMISS_KEY_PREFIX + event.id, '1');
      } catch {
        // Nothing to do if storage is unavailable.
      }
    }
    setVisible(false);
    // Let the exit transition play before unmounting.
    window.setTimeout(() => setEvent(null), 300);
  }

  if (!event) return null;

  return (
    <div
      className={`fixed top-20 right-0 z-[70] p-4 sm:p-6 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!visible}
    >
      {/* Notification card offset below the sticky navbar. No backdrop: the home
          page stays visible and clickable behind it, so this reads as a
          notification rather than a modal that demands a response. */}
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="upcoming-event-popup-title"
        className={`relative w-[calc(100vw-2rem)] max-w-[22rem] sm:w-[22rem] bg-offwhite rounded-2xl border border-ice-400 shadow-2xl overflow-hidden transition-transform duration-300 ease-out ${
          visible ? 'translate-x-0' : 'translate-x-[calc(100%+1.5rem)]'
        }`}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 p-1.5 rounded-lg text-midnight-700 hover:bg-ice-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="bg-accent-200 px-5 py-2 flex items-center gap-2 border-b border-accent-600/25">
          <svg className="w-3.5 h-3.5 text-accent-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.363 1.118l1.287 3.958c.299.921-.755 1.688-1.539 1.118l-3.367-2.447a1 1 0 00-1.176 0l-3.367 2.447c-.784.57-1.838-.197-1.539-1.118l1.287-3.958a1 1 0 00-.363-1.118L2.062 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.958z" />
          </svg>
          <span className="font-display text-midnight text-[11px] font-bold uppercase tracking-[0.2em]">
            Coming Up Next
          </span>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 w-16 bg-midnight rounded-xl flex flex-col items-center justify-center py-3">
              <span className="font-display text-accent text-2xl font-black leading-none">
                {formatDayNumber(event.date)}
              </span>
              <span className="font-display text-offwhite/55 text-[10px] font-semibold uppercase tracking-widest mt-1">
                {formatMonthShort(event.date)}
              </span>
            </div>
            <div className="min-w-0 pt-0.5">
              <span className="font-display text-xs font-semibold bg-ice text-midnight px-2.5 py-0.5 rounded-full">
                {countdownLabel(event.date)}
              </span>
              <h2
                id="upcoming-event-popup-title"
                className="font-bold text-lg text-midnight mt-2 leading-snug"
              >
                {event.title}
              </h2>
            </div>
          </div>

          <p className="text-sm text-muted mb-4 line-clamp-2">{event.description}</p>

          <div className="space-y-1.5 text-xs text-muted mb-5">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 flex-shrink-0 text-midnight-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22a10 10 0 100-20 10 10 0 000 20z" />
              </svg>
              {formatFullDate(event.date)} · {event.time}
            </div>
            <div className="flex items-start gap-1.5">
              <svg className="w-3.5 h-3.5 flex-shrink-0 text-midnight-700 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {event.location}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <TransitionLink
              href="/events"
              onClick={close}
              className="flex-1 flex items-center justify-center gap-1.5 bg-accent text-midnight font-display text-sm font-semibold px-6 py-3 rounded-lg hover:bg-accent-600 transition-colors"
            >
              View Event &amp; Register
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </TransitionLink>
            <button
              type="button"
              onClick={close}
              className="font-display text-sm font-semibold text-muted px-4 py-3 rounded-lg hover:bg-ice-200 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
