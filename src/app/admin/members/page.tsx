import React from 'react';
import { MembersManager } from '@/components/admin/MembersManager';
import { listMembers } from '@/db/queries';

export default async function AdminMembersPage() {
  const members = await listMembers();

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-navy-900">Members</h1>
        <p className="text-gray-500 text-sm mt-1">
          Create members and issue login codes. {members.length} member{members.length !== 1 ? 's' : ''} total.
        </p>
      </div>
      <MembersManager members={members} />
    </div>
  );
}
