'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

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
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen">
      <section className="bg-navy-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">Reach Out</p>
          <h1 className="text-4xl font-black text-white">Contact Us</h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-6">Send a Message</h2>
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                  <svg className="w-10 h-10 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-bold text-green-800 mb-1">Message sent!</h3>
                  <p className="text-sm text-green-700">We&apos;ll get back to you within 2–3 business days.</p>
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
                    <label className="text-sm font-medium text-gray-700">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      required
                      placeholder="Tell us what's on your mind..."
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-navy-900 placeholder:text-gray-400 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100 transition-all resize-none"
                    />
                  </div>
                  <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            {/* Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-4">Get in Touch</h2>
                <div className="space-y-4">
                  {[
                    { label: 'General Inquiries', value: 'info@vseus.ca' },
                    { label: 'Sponsorships & Partnerships', value: 'partnerships@vseus.ca' },
                    { label: 'Events', value: 'events@vseus.ca' },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{item.label}</p>
                      <a href={`mailto:${item.value}`} className="text-navy-500 hover:text-navy-700 font-medium text-sm transition-colors">
                        {item.value}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div id="newsletter">
                <h2 className="text-xl font-bold text-navy-900 mb-2">Newsletter</h2>
                <p className="text-gray-500 text-sm mb-4">
                  Stay up to date on events, opportunities, and VSEUS news — delivered to your inbox.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
                  />
                  <Button variant="primary" size="md">Subscribe</Button>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-4">Follow Us</h2>
                <div className="flex gap-3">
                  {['Instagram', 'LinkedIn', 'Facebook', 'TikTok'].map((s) => (
                    <a
                      key={s}
                      href="#"
                      className="text-sm font-medium text-navy-500 hover:text-navy-700 bg-navy-100 hover:bg-navy-700 hover:text-white px-3 py-1.5 rounded-lg transition-all"
                    >
                      {s}
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
