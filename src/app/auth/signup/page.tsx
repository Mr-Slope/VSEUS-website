'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SignupPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    studentId: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<typeof form & { general: string }>>({});
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  }

  function validate() {
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required.';
    if (!form.email.trim()) newErrors.email = 'Email is required.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email address.';
    if (!form.studentId.trim()) newErrors.studentId = 'Student ID is required.';
    if (!/^\d{7,10}$/.test(form.studentId)) newErrors.studentId = 'Student ID must be 7–10 digits.';
    if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await register(form.email, form.password, form.name, form.studentId);
      router.push('/portal');
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-navy-100 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-navy-100 p-8">
          <div className="text-center mb-7">
            <Link href="/" className="inline-block text-2xl font-black text-navy-700 tracking-tight mb-2">
              VSEUS
            </Link>
            <h1 className="text-xl font-bold text-navy-900">Create your account</h1>
            <p className="text-sm text-gray-500 mt-1">For verified VSEUS members only</p>
          </div>
          <div className="bg-navy-100 border border-navy-300/30 rounded-xl px-4 py-3 mb-5 text-xs text-navy-700">
            Access is restricted to students on the VSEUS membership list. Your student ID must be registered with us before you can create an account.
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Smith"
              error={errors.name}
              required
              autoComplete="name"
            />
            <Input
              label="UBC Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jsmith@student.ubc.ca"
              error={errors.email}
              required
              autoComplete="email"
            />
            <Input
              label="Student ID"
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              placeholder="e.g. 218945632"
              hint="Your unique UBC student number"
              error={errors.studentId}
              required
              autoComplete="off"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 8 characters"
              error={errors.password}
              required
              autoComplete="new-password"
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
            />

            <Button type="submit" variant="gold" size="lg" fullWidth loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-navy-500 font-semibold hover:text-navy-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
