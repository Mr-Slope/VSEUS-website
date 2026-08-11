'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'Our Mission', href: '/about#mission' },
      { label: 'Executives', href: '/about#executives' },
      { label: 'Reports', href: '/about#reports' },
    ],
  },
  {
    label: 'Resources',
    href: '/resources',
    children: [
      { label: 'Economics Gazette', href: '/resources#gazette' },
      { label: 'Awards & Grants', href: '/resources#awards' },
      { label: 'Economics Learning Centre', href: '/elc' },
      { label: 'Clubs', href: '/clubs' },
    ],
  },
  { label: 'Events', href: '/events' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'navbar-glass' : 'bg-midnight'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/*
          Three columns so the nav is centred against the page, not against the
          space left over by the brand block.
        */}
        <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center h-20 gap-4">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group justify-self-start">
            {/*
              object-contain because the mark is 3211x3131, not quite square.
              eager rather than preload: it sits above the fold on every page but
              is never the LCP element.
            */}
            <Image
              src="/photos/logos/logo.png"
              alt=""
              width={44}
              height={44}
              loading="eager"
              className="w-11 h-11 object-contain flex-shrink-0"
            />
            <span className="font-display text-2xl font-black text-offwhite tracking-tight group-hover:text-accent transition-colors duration-200">
              VSEUS
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 justify-self-center">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {/*
                    A Link, not a button: clicking "About" navigates to /about.
                    The dropdown opens on hover and on keyboard focus, so the
                    child links are reachable without a mouse.
                  */}
                  <Link
                    href={link.href}
                    onFocus={() => setOpenDropdown(link.label)}
                    className="nav-link-draw flex items-center gap-1.5 px-5 py-3 font-display text-base font-medium text-offwhite/85 hover:text-offwhite rounded-lg transition-colors duration-150"
                  >
                    {link.label}
                    <svg
                      className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                  {openDropdown === link.label && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-60 bg-midnight-900/97 backdrop-blur-xl rounded-xl shadow-2xl border border-accent/15 py-2 z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-5 py-2.5 text-sm text-offwhite/75 hover:text-offwhite hover:bg-offwhite/10 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onFocus={() => setOpenDropdown(null)}
                  className="nav-link-draw px-5 py-3 font-display text-base font-medium text-offwhite/85 hover:text-offwhite rounded-lg transition-colors duration-150"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Balances the brand column so the nav sits centred on the page */}
          <div className="hidden md:block justify-self-end" />

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-offwhite rounded-lg hover:bg-offwhite/10 transition-colors justify-self-end col-start-3"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-offwhite/10 bg-midnight-900/97 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className="block px-4 py-3 font-display text-base font-medium text-offwhite/90 hover:text-offwhite hover:bg-offwhite/10 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="ml-4 border-l border-offwhite/10 pl-2 space-y-0.5">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-offwhite/60 hover:text-offwhite hover:bg-offwhite/10 rounded-lg transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
