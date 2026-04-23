'use client';

import React from 'react';
import { usePageTransition } from '@/contexts/TransitionContext';

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'gold' | 'navy' | 'outline-white';
  size?: 'md' | 'lg';
  className?: string;
}

const variantStyles: Record<string, string> = {
  gold: 'bg-gold text-navy-900 hover:bg-gold-light shadow-lg shadow-gold/20 hover:shadow-gold/40',
  navy: 'bg-navy-700 text-white hover:bg-navy-900',
  'outline-white': 'border border-white/25 text-white/85 hover:bg-white/10 hover:border-white/40 hover:text-white',
};

const sizeStyles: Record<string, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export function CTAButton({
  href,
  children,
  variant = 'gold',
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
        'rounded-lg font-semibold transition-all duration-200 btn-press',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900',
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
