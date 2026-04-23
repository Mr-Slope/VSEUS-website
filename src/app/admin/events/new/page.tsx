'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const CATEGORIES = ['Competition', 'Networking', 'Social', 'Workshop', 'Academic', 'Other'];

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Academic',
    capacity: '',
    isPaid: false,
    price: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="p-6 lg:p-8 max-w-lg">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="font-bold text-green-800 text-lg mb-1">Event Created!</h2>
          <p className="text-sm text-green-700 mb-5">
            <span className="font-medium">{form.title}</span> has been added.
            It will appear in the member portal immediately.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="primary" onClick={() => router.push('/admin/events')}>
              View All Events
            </Button>
            <Button variant="outline" onClick={() => { setSuccess(false); setForm({ title: '', description: '', date: '', time: '', location: '', category: 'Academic', capacity: '', isPaid: false, price: '' }); }}>
              Create Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-navy-900">Create New Event</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details below. Members will be able to register immediately.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-navy-100 p-6 space-y-5">
        <Input
          label="Event Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Networking Night with TD Economics"
          required
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
            placeholder="What should members know about this event?"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-navy-900 placeholder:text-gray-400 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100 transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <Input
            label="Time"
            name="time"
            value={form.time}
            onChange={handleChange}
            placeholder="e.g. 6:00 PM"
            required
          />
        </div>

        <Input
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="e.g. Buchanan Tower 1197, UBC Vancouver"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100 transition-all"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <Input
            label="Capacity (leave blank for unlimited)"
            name="capacity"
            type="number"
            value={form.capacity}
            onChange={handleChange}
            placeholder="e.g. 50"
            min="1"
          />
        </div>

        <div className="border border-navy-100 rounded-xl p-4 space-y-3">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              name="isPaid"
              checked={form.isPaid}
              onChange={handleChange}
              className="w-4 h-4 accent-navy-700"
            />
            <span className="text-sm font-medium text-navy-900">This is a paid event</span>
          </label>
          {form.isPaid && (
            <Input
              label="Price (CAD)"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 35"
              min="1"
              required={form.isPaid}
            />
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={() => router.push('/admin/events')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading} fullWidth>
            Create Event
          </Button>
        </div>
      </form>
    </div>
  );
}
