'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { createMember, regenerateCode, setMemberDisabled } from '@/app/actions/members';
import type { AdminMember } from '@/db/queries';
import type { UserRole } from '@/types/user';

function CodeReveal({ code, onDismiss }: { code: string; onDismiss: () => void }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 flex items-center justify-between gap-3">
      <div>
        <p className="text-xs text-green-700 mb-0.5">Login code (copy now — it can&apos;t be shown again):</p>
        <p className="text-lg font-black tracking-widest text-green-900">{code}</p>
      </div>
      <button onClick={onDismiss} className="text-xs text-green-700 hover:text-green-900 font-medium">
        Dismiss
      </button>
    </div>
  );
}

export function MembersManager({ members }: { members: AdminMember[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [revealedCode, setRevealedCode] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', studentId: '', email: '', role: 'member' as UserRole });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setRevealedCode('');
    startTransition(async () => {
      try {
        const { code } = await createMember({
          name: form.name,
          studentId: form.studentId || undefined,
          email: form.email || undefined,
          role: form.role,
        });
        setRevealedCode(code);
        setForm({ name: '', studentId: '', email: '', role: 'member' });
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not create member.');
      }
    });
  }

  function handleRegenerate(id: string) {
    if (!confirm('Issue a new code? The current code will stop working immediately.')) return;
    setError('');
    setRevealedCode('');
    startTransition(async () => {
      try {
        const { code } = await regenerateCode(id);
        setRevealedCode(code);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not regenerate code.');
      }
    });
  }

  function handleToggleDisabled(id: string, disabled: boolean) {
    setError('');
    startTransition(async () => {
      try {
        await setMemberDisabled(id, disabled);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not update member.');
      }
    });
  }

  return (
    <div>
      {revealedCode && <CodeReveal code={revealedCode} onDismiss={() => setRevealedCode('')} />}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {/* Create form */}
      <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-navy-100 p-6 mb-6">
        <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide mb-4">Add Member</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Jane Student"
            required
          />
          <Input
            label="Student ID (optional)"
            value={form.studentId}
            onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
            placeholder="12345678"
          />
          <Input
            label="Email (optional)"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="jane@student.ubc.ca"
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100 transition-all"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <Button type="submit" variant="primary" loading={pending}>
            Create &amp; Generate Code
          </Button>
        </div>
      </form>

      {/* Member table */}
      <div className="bg-white rounded-2xl border border-navy-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-100 text-left">
                <th className="px-5 py-3 font-semibold text-navy-700 text-xs uppercase tracking-wide">Name</th>
                <th className="px-5 py-3 font-semibold text-navy-700 text-xs uppercase tracking-wide">Student ID</th>
                <th className="px-5 py-3 font-semibold text-navy-700 text-xs uppercase tracking-wide">Role</th>
                <th className="px-5 py-3 font-semibold text-navy-700 text-xs uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 font-semibold text-navy-700 text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-navy-900">{m.name}</p>
                    {m.email && <p className="text-xs text-gray-500">{m.email}</p>}
                  </td>
                  <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{m.studentId || '—'}</td>
                  <td className="px-5 py-3">
                    {m.role === 'admin' ? <Badge variant="admin">Admin</Badge> : <span className="text-gray-600">Member</span>}
                  </td>
                  <td className="px-5 py-3">
                    {m.disabled ? (
                      <span className="text-xs font-medium text-red-600">Disabled</span>
                    ) : (
                      <span className="text-xs font-medium text-green-600">Active</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRegenerate(m.id)}
                        disabled={pending}
                        className="text-xs text-navy-500 hover:text-navy-700 font-medium px-2 py-1 rounded hover:bg-navy-50 transition-colors disabled:opacity-50"
                      >
                        New code
                      </button>
                      <button
                        onClick={() => handleToggleDisabled(m.id, !m.disabled)}
                        disabled={pending}
                        className={`text-xs font-medium px-2 py-1 rounded transition-colors disabled:opacity-50 ${
                          m.disabled
                            ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                            : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                        }`}
                      >
                        {m.disabled ? 'Enable' : 'Disable'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {members.length === 0 && (
            <div className="py-16 text-center text-gray-400 text-sm">No members yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
