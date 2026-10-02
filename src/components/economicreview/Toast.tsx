'use client';

import React, { useEffect } from 'react';

export interface ToastMessage {
  /** `success` for something that changed, `info` for something already true. */
  tone: 'success' | 'info';
  title: string;
  body: string;
}

/** Long enough to read two short lines without hurrying. */
const DISMISS_MS = 7000;

/**
 * A single transient confirmation, anchored to the corner of the viewport.
 *
 * Used for outcomes worth confirming but not worth interrupting for: joining
 * or leaving the mailing list, and the archive editor's saves and deletes.
 * Anything the reader can still act on, such as a mistyped address, stays
 * inside the dialog instead, where the field is.
 *
 * The live region is always in the tree and only its contents change, so a
 * screen reader announces the message when it appears. Mounting the region
 * together with the text tends to be missed.
 */
export function Toast({ toast, onDismiss }: { toast: ToastMessage | null; onDismiss: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed z-50 inset-x-4 bottom-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[22rem] pointer-events-none"
    >
      {toast && (
        <div className="pointer-events-auto flex items-start gap-3 rounded-xl bg-midnight border border-accent/25 shadow-2xl shadow-midnight/40 px-4 py-3.5 animate-[fadeIn_0.2s_ease-out] motion-reduce:animate-none">
          <span
            aria-hidden="true"
            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              toast.tone === 'success' ? 'bg-accent text-midnight' : 'bg-offwhite/10 text-accent'
            }`}
          >
            {toast.tone === 'success' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            )}
          </span>

          <div className="min-w-0 flex-1">
            <p className="font-display font-semibold text-sm text-offwhite leading-snug">{toast.title}</p>
            <p className="text-sm text-offwhite/70 leading-relaxed mt-0.5">{toast.body}</p>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="-mt-0.5 -mr-1 p-1 rounded-lg text-offwhite/60 hover:text-offwhite hover:bg-offwhite/10 transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
