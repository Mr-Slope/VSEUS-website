'use client';

import React, { useEffect, useRef } from 'react';

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary';

/**
 * An animated cursor: an accent dot that tracks the pointer exactly, and a ring
 * that glides after it. The ring swells over anything clickable and squeezes
 * on press.
 *
 * Only for mouse and trackpad users who haven't asked for reduced motion; touch
 * devices and reduced-motion visitors keep the normal cursor. The native cursor
 * is hidden through a class this component adds to <html>, so if the script
 * never runs the visitor still has a cursor.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduced.matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    const mouse = { x: -100, y: -100 };
    const trail = { x: -100, y: -100 };
    let frame = 0;

    function loop() {
      // Ease the ring a fraction of the way each frame, so it trails the dot.
      trail.x += (mouse.x - trail.x) * 0.18;
      trail.y += (mouse.y - trail.y) * 0.18;
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      ring.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`;
      frame = requestAnimationFrame(loop);
    }

    function onMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      root.classList.add('cursor-visible');
    }
    function onOver(e: MouseEvent) {
      const hit = (e.target as Element | null)?.closest?.(INTERACTIVE);
      root.classList.toggle('cursor-hover', Boolean(hit));
    }
    const onDown = () => root.classList.add('cursor-down');
    const onUp = () => root.classList.remove('cursor-down');
    const onLeave = () => root.classList.remove('cursor-visible');

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      root.classList.remove('has-custom-cursor', 'cursor-visible', 'cursor-hover', 'cursor-down');
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span />
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true">
        <span />
      </div>
    </>
  );
}
