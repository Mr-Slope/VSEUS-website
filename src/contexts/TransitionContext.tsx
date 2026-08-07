'use client';

import React, { createContext, useContext, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface TransitionContextValue {
  triggerTransition: (href: string, x: number, y: number) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  const triggerTransition = useCallback(
    (href: string, x: number, y: number) => {
      if (busy.current) return;
      busy.current = true;

      const overlay = overlayRef.current;
      if (!overlay) {
        router.push(href);
        busy.current = false;
        return;
      }

      // Snap to starting state (no transition)
      overlay.style.transition = 'none';
      overlay.style.clipPath = `circle(0% at ${x}px ${y}px)`;
      overlay.style.pointerEvents = 'all';

      // Force reflow so the browser registers the start keyframe
      void overlay.getBoundingClientRect();

      // Expand circle
      overlay.style.transition = 'clip-path 620ms cubic-bezier(0.4, 0, 0.2, 1)';
      overlay.style.clipPath = `circle(150% at ${x}px ${y}px)`;

      // Navigate once the circle is ~60% expanded
      setTimeout(() => router.push(href), 370);

      // Collapse after new page has had time to render
      setTimeout(() => {
        overlay.style.transition = 'clip-path 520ms cubic-bezier(0.4, 0, 0.2, 1)';
        overlay.style.clipPath = `circle(0% at ${x}px ${y}px)`;
        setTimeout(() => {
          overlay.style.pointerEvents = 'none';
          busy.current = false;
        }, 520);
      }, 820);
    },
    [router]
  );

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
