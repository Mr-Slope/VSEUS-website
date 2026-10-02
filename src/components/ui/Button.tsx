'use client';

import React from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

// Look and motion come from the .btn classes in globals.css.
const variantClasses: Record<Variant, string> = {
  primary:   'btn-midnight',
  secondary: 'bg-ice text-midnight hover:bg-ice-400',
  outline:   'btn-outline-dark',
  ghost:     'btn-quiet',
  accent:    'btn-solid',
  // Destructive and irreversible actions only, such as deleting an issue.
  danger:    'bg-red-600 text-white hover:bg-red-700',
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
        'btn',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
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
