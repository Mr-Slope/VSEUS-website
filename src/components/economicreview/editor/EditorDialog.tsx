'use client';

import React, { useEffect, useRef } from 'react';

interface EditorDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  titleId: string;
  /** Room for the issue form. The confirmations stay narrow. */
  wide?: boolean;
  children: React.ReactNode;
}

/**
 * The modal shell shared by the archive editor's dialogs.
 *
 * The same native <dialog> approach as SubscribeDialog: showModal() traps
 * focus, handles Escape, and hands focus back to whatever opened it.
 *
 * The contents mount only while the dialog is open, so every opening starts
 * from a clean form with no state carried over from last time. That also
 * means React never sees the fields on first render, so the field marked
 * `data-autofocus` is focused by hand once the dialog is showing.
 *
 * While a request is in flight the form inside marks itself `aria-busy`, and
 * every way of closing (Escape, the backdrop, the close button) waits for it.
 * Closing mid-save would leave the editor unsure whether the save happened.
 */
export function EditorDialog({ open, onClose, title, titleId, wide = false, children }: EditorDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      el.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  const busy = () => Boolean(ref.current?.querySelector('[aria-busy="true"]'));

  function requestClose() {
    if (!busy()) onClose();
  }

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        if (busy()) e.preventDefault();
      }}
      onClose={onClose}
      onClick={(e) => {
        // showModal centres the dialog, so a click landing on the element
        // itself rather than its contents is a click on the backdrop.
        if (e.target === ref.current) requestClose();
      }}
      aria-labelledby={titleId}
      className={[
        'm-auto w-[calc(100%-2rem)] max-h-[90dvh] overflow-y-auto',
        wide ? 'max-w-xl' : 'max-w-md',
        'rounded-2xl border border-ice-400 bg-offwhite p-0 text-midnight',
        'shadow-2xl shadow-midnight/30',
        'backdrop:bg-midnight/70 backdrop:backdrop-blur-sm',
      ].join(' ')}
    >
      {open && (
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4 mb-1">
            <h2 id={titleId} className="text-xl font-bold text-midnight leading-snug">
              {title}
            </h2>
            <button
              type="button"
              onClick={requestClose}
              aria-label="Close"
              className="-mt-1 -mr-1 p-1.5 rounded-lg text-muted hover:text-midnight hover:bg-ice transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {children}
        </div>
      )}
    </dialog>
  );
}
