'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { saveAdminEvent } from '@/lib/events';
import { Event, EventQuestion } from '@/types/event';

const CATEGORIES = ['Competition', 'Networking', 'Social', 'Workshop', 'Academic', 'Other'];

function newQuestion(): EventQuestion {
  return {
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    text: '',
    type: 'text',
    options: [''],
    required: false,
  };
}

export default function NewEventPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [posterName, setPosterName] = useState('');
  const [questions, setQuestions] = useState<EventQuestion[]>([]);
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

  function handlePosterChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPosterName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPosterUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  // ── Question helpers ──────────────────────────────────────
  function addQuestion() {
    setQuestions((prev) => [...prev, newQuestion()]);
  }

  function removeQuestion(id: string) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  function moveQuestion(id: string, dir: -1 | 1) {
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }

  function updateQuestion(id: string, patch: Partial<EventQuestion>) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...patch } : q))
    );
  }

  function addOption(questionId: string) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, options: [...q.options, ''] } : q
      )
    );
  }

  function updateOption(questionId: string, idx: number, value: string) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const opts = [...q.options];
        opts[idx] = value;
        return { ...q, options: opts };
      })
    );
  }

  function removeOption(questionId: string, idx: number) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        return { ...q, options: q.options.filter((_, i) => i !== idx) };
      })
    );
  }

  // ── Submit ──────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));

    const event: Event = {
      id: `admin-evt-${Date.now()}`,
      title: form.title,
      description: form.description,
      date: form.date,
      time: form.time,
      location: form.location,
      category: form.category,
      capacity: parseInt(form.capacity, 10),
      registeredCount: 0,
      isPaid: form.isPaid,
      price: form.isPaid && form.price ? parseFloat(form.price) : null,
      imageUrl: null,
      posterUrl: posterUrl,
      createdAt: new Date().toISOString(),
      questions: questions.filter((q) => q.text.trim()),
    };

    saveAdminEvent(event);
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
            <Button variant="outline" onClick={() => {
              setSuccess(false);
              setPosterUrl(null);
              setPosterName('');
              setQuestions([]);
              setForm({ title: '', description: '', date: '', time: '', location: '', category: 'Academic', capacity: '', isPaid: false, price: '' });
            }}>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-navy-100 p-6 space-y-5">
          <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">Event Details</h2>

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
            <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} required />
            <Input label="Time" name="time" value={form.time} onChange={handleChange} placeholder="e.g. 6:00 PM" required />
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
              label="Capacity"
              name="capacity"
              type="number"
              value={form.capacity}
              onChange={handleChange}
              placeholder="e.g. 50"
              min="1"
              required
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
        </div>

        {/* Poster upload */}
        <div className="bg-white rounded-2xl border border-navy-100 p-6 space-y-4">
          <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">Event Poster</h2>
          <p className="text-xs text-gray-500">Upload an image to display on the event card.</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePosterChange}
            className="hidden"
          />

          {posterUrl ? (
            <div className="space-y-3">
              <img
                src={posterUrl}
                alt="Poster preview"
                className="w-full max-h-52 object-contain rounded-xl border border-navy-100"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 truncate">{posterName}</p>
                <button
                  type="button"
                  onClick={() => { setPosterUrl(null); setPosterName(''); }}
                  className="text-xs text-red-500 hover:text-red-700 font-medium ml-3 flex-shrink-0"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-navy-200 rounded-xl py-8 text-sm text-gray-400 hover:border-navy-400 hover:text-gray-600 transition-colors flex flex-col items-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Click to upload an image
            </button>
          )}
        </div>

        {/* Question builder */}
        <div className="bg-white rounded-2xl border border-navy-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">Registration Questions</h2>
              <p className="text-xs text-gray-500 mt-0.5">Collect data before members register.</p>
            </div>
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center gap-1.5 text-xs font-semibold text-navy-700 bg-navy-100 hover:bg-navy-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Question
            </button>
          </div>

          {questions.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-4">
              No questions added. Members will register with no additional prompts.
            </p>
          )}

          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id} className="border border-navy-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  {/* Reorder buttons */}
                  <div className="flex flex-col gap-0.5 flex-shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveQuestion(q.id, -1)}
                      className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-20"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      disabled={idx === questions.length - 1}
                      onClick={() => moveQuestion(q.id, 1)}
                      className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-20"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                    placeholder="Question text..."
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-navy-900 placeholder:text-gray-400 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100 transition-all"
                  />

                  <select
                    value={q.type}
                    onChange={(e) =>
                      updateQuestion(q.id, {
                        type: e.target.value as EventQuestion['type'],
                        options: e.target.value === 'multiple_choice' ? [''] : [],
                      })
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-navy-900 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100 transition-all"
                  >
                    <option value="text">Text answer</option>
                    <option value="multiple_choice">Multiple choice</option>
                    <option value="yes_no">Yes / No</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => removeQuestion(q.id)}
                    className="text-red-400 hover:text-red-600 flex-shrink-0 p-1"
                    title="Remove question"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Multiple choice options */}
                {q.type === 'multiple_choice' && (
                  <div className="pl-8 space-y-2">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-navy-300 flex-shrink-0" />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => updateOption(q.id, oi, e.target.value)}
                          placeholder={`Option ${oi + 1}`}
                          className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-navy-900 placeholder:text-gray-400 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100 transition-all"
                        />
                        {q.options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOption(q.id, oi)}
                            className="text-gray-300 hover:text-red-400"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption(q.id)}
                      className="text-xs text-navy-500 hover:text-navy-700 font-medium pl-4"
                    >
                      + Add option
                    </button>
                  </div>
                )}

                {/* Required toggle */}
                <div className="pl-8">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) => updateQuestion(q.id, { required: e.target.checked })}
                      className="w-3.5 h-3.5 accent-navy-700"
                    />
                    <span className="text-xs text-gray-500">Required</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
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
