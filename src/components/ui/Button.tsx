'use client';

import React from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-navy-700 text-white hover:bg-navy-900 focus-visible:ring-navy-500',
  secondary: 'bg-navy-100 text-navy-700 hover:bg-navy-300 hover:text-white focus-visible:ring-navy-300',
  outline:   'border border-navy-700 text-navy-700 bg-transparent hover:bg-navy-700 hover:text-white focus-visible:ring-navy-500',
  ghost:     'text-navy-700 bg-transparent hover:bg-navy-100 focus-visible:ring-navy-300',
  gold:      'bg-gold text-navy-900 hover:bg-gold-light focus-visible:ring-gold font-semibold shadow-md shadow-gold/20',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  children,
  onClick,
  ...props
}: ButtonProps) {
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;
      left:${e.clientX - rect.left}px;
      top:${e.clientY - rect.top}px;
      width:8px;height:8px;border-radius:50%;
      background:rgba(255,255,255,0.3);
      transform:translate(-50%,-50%) scale(1);
      pointer-events:none;
      animation:cta-ripple 0.55s ease-out forwards;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    onClick?.(e);
  }

  return (
    <button
      className={[
        'relative overflow-hidden inline-flex items-center justify-center gap-2',
        'rounded-lg font-medium transition-all duration-150 btn-press',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
