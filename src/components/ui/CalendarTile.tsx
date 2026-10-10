import React from 'react';

/** `new Date('2026-09-20')` parses as UTC midnight; the local-midnight time avoids the day shift. */
function toLocalDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`);
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

/**
 * An event's date as a tear-off calendar page: the month on a coloured header
 * strip, the day number large below it, then the weekday.
 *
 * The `panel` variant spans its parent's width, as the date column of every
 * /events card, at a fixed height so every card's tile matches however tall
 * the card is. The `compact` variant is a small standalone page for
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
  // Fixed three-letter labels: en-CA's short forms vary in length and
  // punctuation ("SEPT.", "MAY"), which left the strips looking uneven.
  const month = MONTHS[local.getMonth()];
  const weekday = WEEKDAYS[local.getDay()];
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
          panel ? 'py-3 text-lg' : 'py-1 text-xs'
        } ${hosted ? 'bg-blue-300' : 'bg-accent'}`}
      >
        {/* Binding holes along the top edge. */}
        <span className="absolute left-2.5 top-1 h-1.5 w-1.5 rounded-full bg-midnight/30" aria-hidden="true" />
        <span className="absolute right-2.5 top-1 h-1.5 w-1.5 rounded-full bg-midnight/30" aria-hidden="true" />
        {month}
      </span>
      <span className={`flex flex-col items-center justify-center ${panel ? 'h-32' : 'flex-1'}`}>
        <span
          className={`block pt-2 font-display font-black leading-none tabular-nums text-midnight ${
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
