import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Authoritative role gate (proxy.ts only checks for a session cookie).
  const user = await getSessionUser();
  if (!user) redirect('/auth/login');
  if (user.role !== 'admin') redirect('/portal');

  return (
    <div className="flex">
      <AdminSidebar userName={user.name ?? 'Admin'} />
      <div className="flex-1 bg-gray-50 min-h-[calc(100vh-64px)]">{children}</div>
    </div>
  );
}
