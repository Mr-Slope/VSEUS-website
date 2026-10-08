'use client';

import React from 'react';
import Link from 'next/link';

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
  accent: 'btn-solid',
  midnight: 'btn-midnight',
  'outline-light': 'btn-outline-light',
};

const sizeStyles: Record<string, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

/**
 * The primary call-to-action: a link styled as a button, with a ripple on
 * press. Renders a real link rather than a button so it behaves like one.
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
    <Link
      href={href}
      onClick={ripple}
      className={[
        // Shape, lift, sheen and focus ring all come from .btn in globals.css.
        'btn',
        variantStyles[variant],
        sizeStyles[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Link>
  );
}
