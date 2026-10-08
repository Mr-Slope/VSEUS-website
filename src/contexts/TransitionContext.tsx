'use client';

import React, { createContext, useContext, useRef, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Curtain transition between pages: a midnight panel carrying the VSEUS mark
 * rises from the bottom to cover the screen, then carries on upward to reveal
 * the new page.
 *
 * The sequence is deliberately ordered so the page swap is never visible:
 *
 *   1. the panel slides up until it covers the viewport
 *   2. only once covered, the router navigates
 *   3. the overlay waits for the NEW route to actually commit
 *   4. the panel slides off the top, revealing the new page
 *
 * Step 3 is the part that matters. Collapsing on a fixed timer would, on a
 * slow render, peel the panel back off the page you were leaving. Watching `usePathname()` instead ties the reveal to the arrival:
 * the provider lives in the root layout, so it survives navigation and
 * re-renders when the path changes.
 *
 * A safety timer still collapses the overlay if the path never changes, so a
 * failed navigation can't leave the screen covered.
 */

const EXPAND_MS = 520;
const COLLAPSE_MS = 560;
const SAFETY_MS = 2500;
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';
const BELOW = 'translateY(100%)';
const COVERING = 'translateY(0)';
const ABOVE = 'translateY(-100%)';

interface TransitionContextValue {
  triggerTransition: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const overlayRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  /** Set while a transition is in flight; holds the path it's heading to. */
  const pending = useRef<{ targetPath: string } | null>(null);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const collapse = useCallback(() => {
    const overlay = overlayRef.current;
    const state = pending.current;
    pending.current = null;

    if (safetyTimer.current) {
      clearTimeout(safetyTimer.current);
      safetyTimer.current = null;
    }
    if (!overlay || !state) {
      busy.current = false;
      return;
    }

    // A frame's grace so the incoming page has painted behind the overlay
    // before we start peeling it back.
    requestAnimationFrame(() => {
      overlay.style.transition = `transform ${COLLAPSE_MS}ms ${EASE}`;
      overlay.style.transform = ABOVE;
      setTimeout(() => {
        // Park it back below the screen, out of sight, for next time.
        overlay.style.transition = 'none';
        overlay.style.transform = BELOW;
        overlay.style.pointerEvents = 'none';
        busy.current = false;
      }, COLLAPSE_MS);
    });
  }, []);

  // The new route has committed — reveal it.
  useEffect(() => {
    if (pending.current && pending.current.targetPath === pathname) collapse();
  }, [pathname, collapse]);

  const triggerTransition = useCallback(
    (href: string) => {
      if (busy.current) return;

      const overlay = overlayRef.current;
      const targetPath = new URL(href, window.location.href).pathname;

      // Same page (a hash jump, say) or reduced motion: just navigate.
      if (!overlay || targetPath === window.location.pathname || prefersReducedMotion()) {
        router.push(href);
        return;
      }

      busy.current = true;
      pending.current = { targetPath };

      // Snap below the screen with no transition...
      overlay.style.transition = 'none';
      overlay.style.transform = BELOW;
      overlay.style.pointerEvents = 'all';

      // ...force a reflow so the browser registers it as a keyframe...
      void overlay.getBoundingClientRect();

      // ...then rise.
      overlay.style.transition = `transform ${EXPAND_MS}ms ${EASE}`;
      overlay.style.transform = COVERING;

      // Navigate only once the screen is fully covered, so the swap is hidden.
      setTimeout(() => router.push(href), EXPAND_MS);

      // Backstop: never strand the visitor behind a full-screen overlay.
      safetyTimer.current = setTimeout(collapse, EXPAND_MS + SAFETY_MS);
    },
    [router, collapse],
  );

  useEffect(() => {
    return () => {
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
    };
  }, []);

  return (
    <TransitionContext.Provider value={{ triggerTransition }}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--midnight)',
          borderTop: '3px solid var(--accent)',
          transform: BELOW,
          pointerEvents: 'none',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/photos/logos/logo.png" alt="" width={72} height={72} style={{ objectFit: 'contain', opacity: 0.9 }} />
      </div>
    </TransitionContext.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error('usePageTransition must be inside TransitionProvider');
  return ctx;
}
