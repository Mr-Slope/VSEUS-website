'use client';

import React, { createContext, useContext, useRef, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Circular colour wipe between pages.
 *
 * The sequence is deliberately ordered so the page swap is never visible:
 *
 *   1. circle expands from the click point until it covers the viewport
 *   2. only once covered, the router navigates
 *   3. the overlay waits for the NEW route to actually commit
 *   4. circle collapses, revealing the new page
 *
 * Step 3 is the part that matters. The old version collapsed on a fixed
 * timer, so on a slow render the colour peeled back off the page you were
 * leaving. Watching `usePathname()` instead ties the reveal to the arrival:
 * the provider lives in the root layout, so it survives navigation and
 * re-renders when the path changes.
 *
 * A safety timer still collapses the overlay if the path never changes, so a
 * failed navigation can't leave the screen covered.
 */

const EXPAND_MS = 560;
const COLLAPSE_MS = 520;
const SAFETY_MS = 2500;
const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

interface TransitionContextValue {
  triggerTransition: (href: string, x: number, y: number) => void;
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
  /** Set while a wipe is in flight; holds where to collapse back to. */
  const pending = useRef<{ targetPath: string; x: number; y: number } | null>(null);
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
      overlay.style.transition = `clip-path ${COLLAPSE_MS}ms ${EASE}`;
      overlay.style.clipPath = `circle(0% at ${state.x}px ${state.y}px)`;
      setTimeout(() => {
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
    (href: string, x: number, y: number) => {
      if (busy.current) return;

      const overlay = overlayRef.current;
      const targetPath = new URL(href, window.location.href).pathname;

      // Same page (a hash jump, say) or reduced motion: just navigate.
      if (!overlay || targetPath === window.location.pathname || prefersReducedMotion()) {
        router.push(href);
        return;
      }

      busy.current = true;
      pending.current = { targetPath, x, y };

      // Snap to the starting circle with no transition...
      overlay.style.transition = 'none';
      overlay.style.clipPath = `circle(0% at ${x}px ${y}px)`;
      overlay.style.pointerEvents = 'all';

      // ...force a reflow so the browser registers it as a keyframe...
      void overlay.getBoundingClientRect();

      // ...then expand.
      overlay.style.transition = `clip-path ${EXPAND_MS}ms ${EASE}`;
      overlay.style.clipPath = `circle(150% at ${x}px ${y}px)`;

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
          backgroundColor: 'var(--midnight)',
          clipPath: 'circle(0% at 50% 50%)',
          pointerEvents: 'none',
        }}
      />
    </TransitionContext.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error('usePageTransition must be inside TransitionProvider');
  return ctx;
}
