import React from 'react';

interface ImagePlaceholderProps {
  /** Shown inside the box so it's obvious which asset belongs here. */
  label: string;
  /** Where the real file should be dropped, e.g. "public/hero.jpg". */
  hint?: string;
  /** Extra classes — pass sizing here (w-*, h-*, aspect-*, rounded-*). */
  className?: string;
  /** Use on dark sections so the dashed border and label stay legible. */
  tone?: 'light' | 'dark';
  /** Drop the icon when the box is too small to fit it alongside the label. */
  hideIcon?: boolean;
}

/**
 * Stand-in for artwork that hasn't been supplied yet.
 *
 * Every one of these is a single call site, so swapping in the real image is a
 * one-line change: replace <ImagePlaceholder … /> with <Image … />.
 */
export function ImagePlaceholder({
  label,
  hint,
  className = '',
  tone = 'light',
  hideIcon = false,
}: ImagePlaceholderProps) {
  const toneClasses =
    tone === 'dark'
      ? 'border-offwhite/25 bg-offwhite/[0.04] text-offwhite/45'
      : 'border-ice-400 bg-offwhite/60 text-muted/70';

  return (
    <div
      aria-hidden="true"
      className={[
        'flex flex-col items-center justify-center gap-1 border-2 border-dashed',
        'select-none overflow-hidden text-center',
        toneClasses,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {!hideIcon && (
        <svg className="w-6 h-6 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 6h.008v.008H18V6zm2.25 12H3.75A1.5 1.5 0 012.25 16.5v-9A1.5 1.5 0 013.75 6h16.5a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5z" />
        </svg>
      )}
      <span className="text-[11px] font-semibold uppercase tracking-widest px-2">{label}</span>
      {hint && <span className="text-[10px] opacity-70 px-2">{hint}</span>}
    </div>
  );
}
