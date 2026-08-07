'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { socials } from '@/components/ui/SocialIcons';
import { EXECS } from '@/lib/execs';

// TODO: replace with the real general inbox once confirmed.
const GENERAL_INQUIRIES = { role: 'General Inquiries', name: 'VSEUS', email: 'info@vseus.ca' };

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // NOTE: no backend yet — this only simulates a send.
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
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
                  <h3 className="font-bold text-midnight mb-1">Message sent!</h3>
                  <p className="text-sm text-muted">We&apos;ll get back to you within 2 to 3 business days.</p>
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
                  <Button type="submit" variant="accent" size="lg" fullWidth loading={loading}>
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
                  Reach the right person directly, or use the general inbox if you&apos;re not sure.
                </p>
                <div className="space-y-2">
                  {[GENERAL_INQUIRIES, ...EXECS].map((item) => (
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

              <div id="newsletter" className="scroll-mt-24">
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

              <div id="follow" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-midnight mb-4">Follow Us</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
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
