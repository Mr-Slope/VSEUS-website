'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const role = await login(code);
      const callbackUrl = searchParams.get('callbackUrl');
      const fallback = role === 'admin' ? '/admin' : '/portal';
      router.push(callbackUrl || fallback);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-navy-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-navy-100 p-8">
          <div className="text-center mb-7">
            <Link href="/" className="inline-block text-2xl font-black text-navy-700 tracking-tight mb-2">
              VSEUS
            </Link>
            <h1 className="text-xl font-bold text-navy-900">Member sign in</h1>
            <p className="text-sm text-gray-500 mt-1">Enter your membership code to continue</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Membership code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ECON-0000"
              required
              autoComplete="off"
              autoFocus
              autoCapitalize="characters"
              inputMode="text"
            />
            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have a code? Contact a VSEUS exec at{' '}
            <a href="mailto:vseus@ubc.ca" className="text-navy-500 font-semibold hover:text-navy-700">
              vseus@ubc.ca
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  // useSearchParams requires a Suspense boundary.
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
