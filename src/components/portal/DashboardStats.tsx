import React from 'react';

interface Stat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

export function DashboardStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-xl p-5 border border-navy-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-navy-100 text-navy-700 flex items-center justify-center flex-shrink-0">
            {s.icon}
          </div>
          <div>
            <p className="text-xl font-bold text-navy-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
