'use client';

import React, { useRef } from 'react';

/** Tilts its contents toward the pointer and settles back when it leaves. */
export function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent) {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateZ(4px)`;
  }

  function onMouseLeave() {
    if (ref.current) ref.current.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="tilt-card h-full"
    >
      {children}
    </div>
  );
}
