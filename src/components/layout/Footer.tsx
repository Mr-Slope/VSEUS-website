import React from 'react';
import Link from 'next/link';
import { socials } from '@/components/ui/SocialIcons';
import { ADDRESS, ADDRESS_MAP_URL } from '@/lib/society';

const footerLinks = {
  Organization: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Mission', href: '/about#mission' },
    { label: 'Executive Team', href: '/about#executives' },
    { label: 'Reports', href: '/about#reports' },
  ],
  Resources: [
    { label: 'Events', href: '/events' },
    { label: 'Economics Gazette', href: '/resources#gazette' },
    { label: 'Awards & Grants', href: '/resources#awards' },
    { label: 'Economics Learning Centre', href: '/elc' },
    { label: 'Clubs', href: '/clubs' },
  ],
  Connect: [
    { label: 'Blog', href: '/blog' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Newsletter', href: '/contact#newsletter' },
    { label: 'Follow Us', href: '/contact#follow' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-midnight-900 text-offwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-black tracking-tight mb-1">VSEUS</h2>
            <p className="text-blue-300 text-sm leading-relaxed mb-5 max-w-xs">
              Vancouver School of Economics Undergraduate Society at UBC, empowering economics students since 2014.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-lg bg-offwhite/[0.07] border border-offwhite/10 text-blue-300 hover:text-midnight hover:bg-accent hover:border-accent flex items-center justify-center transition-all duration-200"
                >
                  <span className="w-5 h-5 block">{s.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-display text-xs font-semibold text-accent uppercase tracking-widest mb-3">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-offwhite/70 hover:text-offwhite transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright left, address right — at every width, not just on desktop. */}
        <div className="mt-10 pt-6 border-t border-offwhite/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-offwhite/40">
          <div>
            <p>© {new Date().getFullYear()} VSEUS. All rights reserved.</p>
            <p className="mt-0.5 text-[10px] text-offwhite">
              Website built by Yash Dhaundiyal, VSEUS President 2026&ndash;2027 · Maintained by VSEUS VP Marketing
            </p>
          </div>
          <a
            href={ADDRESS_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-offwhite transition-colors text-right self-end"
          >
            University of British Columbia
            <span className="hidden sm:inline"> · </span>
            <span className="block sm:inline">{ADDRESS.full}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
