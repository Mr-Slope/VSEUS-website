import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import { PortalSidebar } from '@/components/portal/PortalSidebar';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  // `proxy.ts` already gates unauthenticated access; this is the authoritative check.
  const user = await getSessionUser();
  if (!user) redirect('/auth/login');

  return (
    <div className="flex">
      <PortalSidebar />
      <div className="flex-1 bg-gray-50 min-h-[calc(100vh-64px)]">{children}</div>
    </div>
  );
}
