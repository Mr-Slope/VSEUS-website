'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { READER_PATH, SECTION_TABS } from '@/lib/economicreview/content';

/**
 * An empty slot at the far right of the tab bar that a page may fill with its
 * own controls through a portal. The archive puts its editor button here; the
 * other pages leave it empty and know nothing about it.
 */
export const TAB_BAR_ACTIONS_ID = 'economicreview-tab-actions';

/**
 * The Review's section navigation, sitting directly under the masthead.
 *
 * Plain Links rather than TransitionLink: the colour wipe is reserved for
 * calls to action, and a full-screen cover is friction when someone is just
 * moving between tabs.
 *
 * The archive is the section root, so it matches only on an exact path, plus
 * the reader an issue opens in. The others match their subtree, which keeps
 * the right tab lit if one of them ever grows a child page.
 *
 * The bar is a lighter band than the masthead above it, so the two read as
 * separate tiers. Where the tabs are wider than the screen they scroll
 * sideways instead of wrapping.
 */
export function SectionTabs() {
  const pathname = usePathname();
  const stripRef = useRef<HTMLDivElement>(null);

  /*
    When the tabs scroll, the lit one can start out of view, as Our Team does
    on a narrow phone. Scrolling the strip itself, rather than calling
    scrollIntoView, keeps the page from jumping vertically.
  */
  useEffect(() => {
    const strip = stripRef.current;
    const active = strip?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!strip || !active) return;

    const outOfView =
      active.offsetLeft < strip.scrollLeft ||
      active.offsetLeft + active.offsetWidth > strip.scrollLeft + strip.clientWidth;
    if (outOfView) {
      strip.scrollLeft = active.offsetLeft - (strip.clientWidth - active.offsetWidth) / 2;
    }
  }, [pathname]);

  return (
    <nav
      aria-label="Vancouver Economic Review sections"
      className="bg-midnight-700 border-b border-offwhite/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-stretch justify-between gap-4">
        {/* Relative so it is the offsetParent the effect above measures against. */}
        <div ref={stripRef} className="relative flex items-stretch min-w-0 overflow-x-auto no-scrollbar">
          {SECTION_TABS.map((tab) => {
            const active =
              tab.href === '/economicreview'
                ? pathname === tab.href || pathname === READER_PATH
                : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'relative flex flex-shrink-0 items-center justify-center text-center whitespace-nowrap',
                  'font-display font-semibold tracking-tight',
                  'text-xs sm:text-sm px-3 sm:px-5 min-h-[44px] py-3',
                  'transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
                  // 70% rather than 55%: on the lighter band, 55% falls below 4.5:1.
                  active ? 'text-offwhite' : 'text-offwhite/70 hover:text-offwhite',
                ].join(' ')}
              >
                {tab.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>

          {/*
            Hidden as a whole on phones, not just its contents: an empty group
            still takes the row's gap, and four tabs need that width at 360px.
          */}
          <div className="hidden sm:flex items-stretch">
            {/*
              Terms is fine print, not a peer of the tabs, so it sits apart
              and quieter. It still needs to be reachable from every page, which
              is why it lives here rather than only inside the subscribe dialog.
            */}
            <Link
              href="/economicreview/terms"
              aria-current={pathname === '/economicreview/terms' ? 'page' : undefined}
              className={[
                'hidden sm:flex items-center text-xs font-display px-2 min-h-[44px]',
                'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
                pathname === '/economicreview/terms'
                  ? 'text-offwhite/80 underline underline-offset-4 decoration-accent'
                  : 'text-offwhite/70 hover:text-offwhite',
              ].join(' ')}
            >
              Terms
            </Link>

            {/* Hidden on phones like Terms: the tabs already fill the width. */}
            <div id={TAB_BAR_ACTIONS_ID} className="hidden sm:flex items-stretch" />
          </div>
        </div>
      </div>
    </nav>
  );
}
