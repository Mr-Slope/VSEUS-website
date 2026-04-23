'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { CTAButton } from '@/components/ui/CTAButton';

const navLinks = [
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'Our Mission', href: '/about#mission' },
      { label: 'Executives', href: '/about#executives' },
      { label: 'Financial Reports', href: '/about#reports' },
      { label: 'Partners', href: '/about#partners' },
    ],
  },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Merchandise', href: '/services#merch' },
      { label: 'Awards & Grants', href: '/services#awards' },
      { label: 'Economics Learning Centre', href: '/elc' },
      { label: 'Initiatives', href: '/services#initiatives' },
    ],
  },
  { label: 'Events', href: '/events' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'navbar-glass' : 'bg-navy-700'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <span className="text-2xl font-black text-white tracking-tight group-hover:text-gold transition-colors duration-200">
              VSEUS
            </span>
            <span className="hidden sm:block text-[11px] text-navy-300 font-medium leading-tight max-w-[160px] group-hover:text-white/70 transition-colors duration-200">
              Vancouver School of Economics<br />Undergraduate Society
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="nav-link-draw flex items-center gap-1 px-3 py-2 text-sm text-white/80 hover:text-white rounded-lg transition-colors duration-150">
                    {link.label}
                    <svg
                      className={`w-3 h-3 opacity-60 transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-navy-900/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/10 py-1.5 z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
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
                  href={link.href!}
                  className="nav-link-draw px-3 py-2 text-sm text-white/80 hover:text-white rounded-lg transition-colors duration-150"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href="/portal"
                  className="nav-link-draw px-3 py-2 text-sm text-white/80 hover:text-white transition-colors duration-150"
                >
                  My Portal
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="px-3 py-2 text-sm text-gold hover:text-gold-light transition-colors font-medium"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="border border-white/20 text-white/75 hover:border-white/40 hover:text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-all duration-150"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <CTAButton href="/auth/login" variant="gold" size="md">
                Member Login
              </CTAButton>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-navy-900/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href || '#'}
                className="block px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              {user ? (
                <>
                  <Link href="/portal" className="block px-3 py-2 text-sm text-white/80 hover:bg-white/10 rounded-lg" onClick={() => setMobileOpen(false)}>
                    My Portal
                  </Link>
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-left px-3 py-2 text-sm text-white/60 hover:bg-white/10 rounded-lg">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="block px-3 py-2 text-sm bg-gold text-navy-900 rounded-lg font-semibold text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Member Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
