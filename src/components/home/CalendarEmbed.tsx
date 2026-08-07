'use client';

import React, { useSyncExternalStore } from 'react';
import { buildEmbedUrl } from '@/lib/calendar';

// Never fires — the value only ever flips from the server snapshot to the
// client one at hydration, which useSyncExternalStore handles on its own.
const neverChanges = () => () => {};

/**
 * The calendar iframe, pointed at the week of the next upcoming event.
 *
 * `upcomingDates` is baked in at build time (see src/lib/calendar.ts). Which
 * one to focus on can only be decided in the browser, because the server has
 * no idea what "today" is for the visitor — so the frame renders empty on the
 * server and resolves at hydration.
 *
 * useSyncExternalStore is what makes that safe: it hands back the server
 * snapshot during SSR and the client snapshot after hydration, so the two
 * renders never disagree. Computing the date during render instead would make
 * the markup mismatch, and doing it in an effect would load the iframe twice.
 */
export function CalendarEmbed({ upcomingDates }: { upcomingDates: string[] }) {
  const isHydrated = useSyncExternalStore(
    neverChanges,
    () => true,  // client
    () => false, // server
  );

  let src: string | null = null;
  if (isHydrated) {
    const today = new Date().toISOString().slice(0, 10);
    // undefined once the baked list runs out, which buildEmbedUrl reads as
    // "just show the current week".
    src = buildEmbedUrl(upcomingDates.find((d) => d >= today));
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-offwhite/[0.12] bg-offwhite/[0.03] aspect-video min-h-[340px]">
      {src ? (
        <iframe
          src={src}
          title="The Economics Calendar"
          className="w-full h-full border-0"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-offwhite/30">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium">Loading calendar…</p>
          </div>
        </div>
      )}
    </div>
  );
}
