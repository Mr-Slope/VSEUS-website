'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { socials } from '@/components/ui/SocialIcons';
import { EXECS, CONTACT_FORM_TO, CONTACT_FORM_CC } from '@/lib/execs';
import { ADDRESS, ADDRESS_MAP_URL } from '@/lib/society';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  /**
   * Hands the message to the visitor's email app, addressed to VP Marketing
   * with the President and VP Administration copied.
   *
   * The site is static with no secrets, so there is no server to post to — the
   * previous version just ran a timer and claimed "Message sent!", which was
   * untrue. This actually delivers. Swapping in a form service (Formspree,
   * Web3Forms) or a Resend route later means replacing this function; the
   * addresses already live in src/lib/execs.ts.
   */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const body = `${form.message}\n\n—\n${form.name}\n${form.email}`;
    const query = [
      `cc=${encodeURIComponent(CONTACT_FORM_CC.join(','))}`,
      `subject=${encodeURIComponent(form.subject)}`,
      `body=${encodeURIComponent(body)}`,
    ].join('&');

    window.location.href = `mailto:${CONTACT_FORM_TO}?${query}`;
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-ice">
      <section className="bg-midnight py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-display text-accent text-sm font-semibold uppercase tracking-widest mb-2">Reach Out</p>
          <h1 className="text-4xl font-black text-offwhite">Contact Us</h1>
        </div>
      </section>

      <section className="py-16 bg-ice">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-offwhite border border-ice-400 rounded-2xl p-7 h-fit">
              <h2 className="text-2xl font-bold text-midnight mb-6">Send a Message</h2>
              {submitted ? (
                <div className="bg-ice border border-ice-400 rounded-2xl p-6 text-center">
                  <svg className="w-10 h-10 text-midnight-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-bold text-midnight mb-1">Your message is ready to send</h3>
                  <p className="text-sm text-muted">
                    We&apos;ve opened it in your email app — hit send there and we&apos;ll reply
                    within 2 to 3 business days. If nothing opened, email{' '}
                    <a href={`mailto:${CONTACT_FORM_TO}`} className="text-midnight font-semibold underline decoration-accent decoration-2 underline-offset-2">
                      {CONTACT_FORM_TO}
                    </a>{' '}
                    directly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      required
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@student.ubc.ca"
                      required
                    />
                  </div>
                  <Input
                    label="Subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                  />
                  <div className="flex flex-col gap-1">
                    <label htmlFor="message" className="text-sm font-medium text-midnight">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      required
                      placeholder="Tell us what's on your mind..."
                      className="w-full rounded-lg border border-ice-400 bg-offwhite px-4 py-2.5 text-sm text-midnight placeholder:text-muted/60 outline-none focus:border-blue focus:ring-2 focus:ring-blue/25 transition-all resize-none"
                    />
                  </div>
                  <Button type="submit" variant="accent" size="lg" fullWidth>
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            {/* Info */}
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-midnight mb-2">Email the Team</h2>
                <p className="text-muted text-sm mb-6">
                  Reach the right person directly. Not sure who you need? Use the form
                  and we&apos;ll route it.
                </p>
                <div className="space-y-2">
                  {EXECS.map((item) => (
                    <a
                      key={item.email}
                      href={`mailto:${item.email}`}
                      className="flex items-center justify-between gap-4 bg-offwhite border border-ice-400 hover:border-accent rounded-xl px-5 py-3.5 transition-colors group"
                    >
                      <div className="min-w-0">
                        <p className="font-display text-xs font-semibold text-muted uppercase tracking-widest">
                          {item.role}
                        </p>
                        <p className="text-midnight font-semibold text-sm mt-0.5 truncate">{item.email}</p>
                      </div>
                      <svg className="w-4 h-4 flex-shrink-0 text-midnight-700 opacity-40 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              <div id="visit" className="anchor-offset">
                <h2 className="text-2xl font-bold text-midnight mb-2">Visit Us</h2>
                <p className="text-muted text-sm mb-4">
                  We&apos;re in the Iona Building on UBC&apos;s Vancouver campus — the same
                  building as the Economics Learning Centre.
                </p>
                <a
                  href={ADDRESS_MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 bg-offwhite border border-ice-400 hover:border-accent rounded-xl px-5 py-4 transition-colors group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="w-11 h-11 rounded-lg bg-midnight text-offwhite group-hover:bg-accent group-hover:text-midnight flex items-center justify-center flex-shrink-0 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display font-semibold text-midnight text-sm">
                        {ADDRESS.street}
                      </span>
                      <span className="block text-muted text-xs mt-0.5">{ADDRESS.locality}</span>
                    </span>
                  </div>
                  <svg className="w-4 h-4 flex-shrink-0 text-midnight-700 opacity-40 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>

              <div id="newsletter" className="anchor-offset">
                <h2 className="text-2xl font-bold text-midnight mb-2">Newsletter</h2>
                <p className="text-muted text-sm mb-4">
                  Stay up to date on events, opportunities, and VSEUS news, delivered right to your inbox.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    aria-label="Email address"
                    placeholder="your@email.com"
                    className="flex-1 rounded-lg border border-ice-400 bg-offwhite px-4 py-2.5 text-sm text-midnight placeholder:text-muted/60 outline-none focus:border-blue focus:ring-2 focus:ring-blue/25"
                  />
                  <Button variant="accent" size="md">Subscribe</Button>
                </div>
              </div>

              <div id="follow" className="anchor-offset">
                <h2 className="text-2xl font-bold text-midnight mb-4">Follow Us</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex items-center gap-3 bg-offwhite border border-ice-400 hover:border-accent hover:bg-accent/10 rounded-xl px-4 py-4 transition-all group"
                    >
                      <span className="w-11 h-11 rounded-lg bg-midnight text-offwhite group-hover:bg-accent group-hover:text-midnight flex items-center justify-center flex-shrink-0 transition-colors">
                        <span className="w-6 h-6 block">{s.icon}</span>
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display font-semibold text-midnight text-sm">{s.label}</span>
                        <span className="block text-muted text-xs truncate">{s.handle}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
