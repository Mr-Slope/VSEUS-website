'use client';

import React from 'react';
import { TransitionLink } from '@/components/ui/TransitionLink';

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

/**
 * The primary call-to-action: a ripple on press, then the page wipe.
 *
 * Renders a real link rather than a button so it behaves like one — the wipe
 * comes from TransitionLink, which leaves cmd-click and friends alone.
 */
export function CTAButton({
  href,
  children,
  variant = 'accent',
  size = 'lg',
  className = '',
}: CTAButtonProps) {
  function ripple(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();

    const dot = document.createElement('span');
    dot.style.cssText = `
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
    el.appendChild(dot);
    setTimeout(() => dot.remove(), 600);
  }

  return (
    <TransitionLink
      href={href}
      onClick={ripple}
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
    </TransitionLink>
  );
}
