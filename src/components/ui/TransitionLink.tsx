'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePageTransition } from '@/contexts/TransitionContext';

interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

/**
 * A Link that plays the colour wipe on the way to another page.
 *
 * It stays a real <a>, so middle-click, cmd-click, "open in new tab", and
 * keyboard activation all keep working — the wipe is layered on top of normal
 * link behaviour rather than replacing it with a button.
 *
 * Three cases fall through to a plain link instead of wiping:
 *   - external URLs (mailto:, https://, #-only, anything not starting with /)
 *   - links to the page you're already on, where the wipe would cover the
 *     screen for a hash scroll
 *   - modified clicks, which the browser should handle itself
 */
export function TransitionLink({ href, children, onClick, ...rest }: TransitionLinkProps) {
  const { triggerTransition } = usePageTransition();
  const pathname = usePathname();

  const isInternal = href.startsWith('/') && !href.startsWith('//');

  if (!isInternal) {
    return (
      <a href={href} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  const targetPath = href.split('#')[0].split('?')[0];
  const samePage = targetPath === '' || targetPath === pathname;

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;

    // Let the browser own modified clicks and anything but the primary button.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (samePage) return;

    e.preventDefault();

    // Keyboard activation reports 0,0 — start the wipe from the link instead
    // of the top-left corner.
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;

    triggerTransition(href, x, y);
  }

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
