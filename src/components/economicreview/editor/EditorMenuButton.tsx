'use client';

import React, { useEffect, useId, useRef, useState } from 'react';

interface EditorMenuButtonProps {
  unlocked: boolean;
  onUnlock: () => void;
  /** The archive's "Add issue". Left out on the reader, where the editor moderates comments. */
  onAdd?: () => void;
  onLock: () => void;
}

const ITEM_CLASS = [
  'w-full text-left rounded-lg px-3 py-2 text-sm font-display text-offwhite/85',
  'hover:bg-offwhite/10 hover:text-offwhite transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
].join(' ');

/**
 * The ⋮ button beside Terms in the tab bar.
 *
 * Locked, it goes straight to the password prompt. Unlocked, it turns accent
 * and opens a small menu. The menu is a disclosure, a button that shows and
 * hides a list of plain buttons, rather than an ARIA menu, since two items do
 * not need arrow-key handling.
 *
 * It is quiet on purpose, like Terms beside it: readers have no use for it.
 */
export function EditorMenuButton({ unlocked, onUnlock, onAdd, onLock }: EditorMenuButtonProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  // A session that ends while the menu is open closes it too.
  const showMenu = open && unlocked;

  useEffect(() => {
    if (!showMenu) return;

    function onPointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [showMenu]);

  function choose(action: () => void) {
    setOpen(false);
    action();
  }

  return (
    <div ref={wrapperRef} className="relative flex items-stretch">
      <button
        ref={buttonRef}
        type="button"
        aria-label="Editor tools"
        aria-haspopup={unlocked ? undefined : 'dialog'}
        aria-expanded={unlocked ? showMenu : undefined}
        aria-controls={unlocked ? menuId : undefined}
        onClick={() => {
          if (unlocked) return setOpen((o) => !o);
          // Clear a menu left open when a session ended, so it cannot reappear on unlock.
          setOpen(false);
          onUnlock();
        }}
        className={[
          'flex items-center px-2 min-h-[44px]',
          'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
          unlocked ? 'text-accent hover:text-accent-200' : 'text-offwhite/60 hover:text-offwhite',
        ].join(' ')}
      >
        <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
          />
        </svg>
      </button>

      {showMenu && (
        <div
          id={menuId}
          className="absolute right-0 top-full z-40 mt-1 w-48 rounded-xl border border-offwhite/10 bg-midnight p-1.5 shadow-2xl shadow-midnight/40"
        >
          <p className="px-3 pt-1.5 pb-2 font-display text-[10px] font-semibold uppercase tracking-widest text-offwhite/60">
            Editor
          </p>
          {onAdd && (
            <button type="button" className={ITEM_CLASS} onClick={() => choose(onAdd)}>
              Add issue
            </button>
          )}
          <button type="button" className={ITEM_CLASS} onClick={() => choose(onLock)}>
            Lock editor
          </button>
        </div>
      )}
    </div>
  );
}
