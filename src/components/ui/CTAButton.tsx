'use client';

import React from 'react';
import { usePageTransition } from '@/contexts/TransitionContext';

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'accent' | 'midnight' | 'outline-light';
  size?: 'md' | 'lg';
  className?: string;
}

// Accent orange is a fill, never a text colour on light — the label on top is
// midnight (~8:1). See the contrast note in globals.css.
const variantStyles: Record<string, string> = {
  accent: 'bg-accent text-midnight hover:bg-accent-600 shadow-lg shadow-accent/20 hover:shadow-accent/40',
  midnight: 'bg-midnight-700 text-offwhite hover:bg-midnight',
  'outline-light': 'border border-offwhite/25 text-offwhite/85 hover:bg-offwhite/10 hover:border-offwhite/40 hover:text-offwhite',
};

const sizeStyles: Record<string, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export function CTAButton({
  href,
  children,
  variant = 'accent',
  size = 'lg',
  className = '',
}: CTAButtonProps) {
  const { triggerTransition } = usePageTransition();

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();

    // Ripple from click point
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;
      left:${e.clientX - rect.left}px;
      top:${e.clientY - rect.top}px;
      width:8px;height:8px;
      border-radius:50%;
      background:rgba(255,255,255,0.3);
      transform:translate(-50%,-50%) scale(1);
      pointer-events:none;
      animation:cta-ripple 0.55s ease-out forwards;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    triggerTransition(href, e.clientX, e.clientY);
  }

  return (
    <button
      onClick={handleClick}
      className={[
        'relative inline-flex items-center justify-center gap-2 overflow-hidden',
        'rounded-lg font-display font-semibold transition-all duration-200 btn-press',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-midnight',
        variantStyles[variant],
        sizeStyles[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
}
