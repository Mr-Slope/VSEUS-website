'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

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
      { label: 'Learning Centers', href: '/services#learning' },
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

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <header className="bg-navy-700 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl font-black text-white tracking-tight">VSEUS</span>
            <span className="hidden sm:block text-xs text-navy-300 font-medium leading-tight max-w-[160px]">
              Vancouver School of Economics<br />Undergraduate Society
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    {link.label}
                    <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-navy-700 hover:bg-navy-100 hover:text-navy-900 transition-colors"
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
                  className="px-3 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href="/portal"
                  className="px-3 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  My Portal
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="px-3 py-2 text-sm text-gold hover:text-gold-light transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout} className="border-white/30 text-white hover:bg-white hover:text-navy-700">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-3 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Button variant="gold" size="sm" onClick={() => router.push('/auth/signup')}>
                  Join VSEUS
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-navy-900">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href || '#'}
                className="block px-3 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              {user ? (
                <>
                  <Link href="/portal" className="block px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg" onClick={() => setMobileOpen(false)}>
                    My Portal
                  </Link>
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-left px-3 py-2 text-sm text-white/70 hover:bg-white/10 rounded-lg">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg" onClick={() => setMobileOpen(false)}>
                    Sign In
                  </Link>
                  <Link href="/auth/signup" className="block px-3 py-2 text-sm bg-gold text-navy-900 rounded-lg font-medium text-center" onClick={() => setMobileOpen(false)}>
                    Join VSEUS
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
