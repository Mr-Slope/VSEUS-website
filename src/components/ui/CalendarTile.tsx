import React from 'react';

/** `new Date('2026-09-20')` parses as UTC midnight; the local-midnight time avoids the day shift. */
function toLocalDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`);
}

/**
 * An event's date as a tear-off calendar page: the month on a coloured header
 * strip, the day number large below it, then the weekday. Used for the date on
 * every /events card and in the home-page "Coming Up Next" popup.
 *
 * `hosted` gives club and partner events a blue strip to match their lighter
 * date panel. `compact` is a smaller page for tight spots like the popup.
 */
export function CalendarTile({
  date,
  hosted = false,
  compact = false,
}: {
  /** 'YYYY-MM-DD' */
  date: string;
  hosted?: boolean;
  compact?: boolean;
}) {
  const local = toLocalDate(date);
  const month = local.toLocaleDateString('en-CA', { month: 'short' }).toUpperCase();
  const weekday = local.toLocaleDateString('en-CA', { weekday: 'short' }).toUpperCase();

  return (
    <time
      dateTime={date}
      className={`flex-shrink-0 overflow-hidden rounded-xl bg-offwhite text-center ring-1 ring-ice-400 shadow-[0_6px_16px_-6px_rgba(0,0,0,0.5)] ${
        compact ? 'w-20' : 'w-24'
      }`}
    >
      <span
        className={`relative block font-display font-bold uppercase tracking-[0.2em] text-midnight ${
          compact ? 'py-1 text-xs' : 'py-1.5 text-sm'
        } ${hosted ? 'bg-blue-300' : 'bg-accent'}`}
      >
        {/* Binding holes along the top edge. */}
        <span className="absolute left-2.5 top-1 h-1.5 w-1.5 rounded-full bg-midnight/30" aria-hidden="true" />
        <span className="absolute right-2.5 top-1 h-1.5 w-1.5 rounded-full bg-midnight/30" aria-hidden="true" />
        {month}
      </span>
      <span
        className={`block pt-2 font-display font-black leading-none text-midnight ${
          compact ? 'text-4xl' : 'text-5xl'
        }`}
      >
        {local.getDate()}
      </span>
      <span
        className={`block pb-2.5 pt-1.5 font-sans font-semibold uppercase tracking-widest text-muted ${
          compact ? 'text-[10px]' : 'text-xs'
        }`}
      >
        {weekday}
      </span>
    </time>
  );
}
