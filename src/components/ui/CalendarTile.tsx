import React from 'react';

/** `new Date('2026-09-20')` parses as UTC midnight; the local-midnight time avoids the day shift. */
function toLocalDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`);
}

/**
 * An event's date as a tear-off calendar page: the month on a coloured header
 * strip, the day number large below it, then the weekday.
 *
 * The `panel` variant fills its parent edge to edge, as the date column of
 * every /events card. The `compact` variant is a small standalone page for
 * tight spots like the home-page "Coming Up Next" popup.
 *
 * `hosted` gives club and partner events a blue strip instead of the accent.
 */
export function CalendarTile({
  date,
  hosted = false,
  variant = 'panel',
}: {
  /** 'YYYY-MM-DD' */
  date: string;
  hosted?: boolean;
  variant?: 'panel' | 'compact';
}) {
  const local = toLocalDate(date);
  const month = local.toLocaleDateString('en-CA', { month: 'short' }).toUpperCase();
  const weekday = local.toLocaleDateString('en-CA', { weekday: 'short' }).toUpperCase();
  const panel = variant === 'panel';

  return (
    <time
      dateTime={date}
      className={`flex flex-col bg-offwhite text-center ${
        panel
          ? 'w-full'
          : 'w-20 flex-shrink-0 overflow-hidden rounded-xl ring-1 ring-ice-400 shadow-[0_6px_16px_-6px_rgba(0,0,0,0.5)]'
      }`}
    >
      <span
        className={`relative block font-display font-bold uppercase tracking-[0.2em] text-midnight ${
          panel ? 'py-2 text-sm' : 'py-1 text-xs'
        } ${hosted ? 'bg-blue-300' : 'bg-accent'}`}
      >
        {/* Binding holes along the top edge. */}
        <span className="absolute left-2.5 top-1 h-1.5 w-1.5 rounded-full bg-midnight/30" aria-hidden="true" />
        <span className="absolute right-2.5 top-1 h-1.5 w-1.5 rounded-full bg-midnight/30" aria-hidden="true" />
        {month}
      </span>
      <span className={`flex flex-1 flex-col items-center justify-center ${panel ? 'py-4' : ''}`}>
        <span
          className={`block pt-2 font-display font-black leading-none text-midnight ${
            panel ? 'text-6xl' : 'text-4xl'
          }`}
        >
          {local.getDate()}
        </span>
        <span
          className={`block pb-2.5 pt-1.5 font-sans font-semibold uppercase tracking-widest text-muted ${
            panel ? 'text-sm' : 'text-[10px]'
          }`}
        >
          {weekday}
        </span>
      </span>
    </time>
  );
}
