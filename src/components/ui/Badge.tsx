import React from 'react';

type BadgeVariant = 'registered' | 'full' | 'paid' | 'free' | 'category' | 'admin';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

const styles: Record<BadgeVariant, string> = {
  registered: 'bg-green-100 text-green-800 border border-green-200',
  full: 'bg-red-100 text-red-700 border border-red-200',
  paid: 'bg-gold/20 text-yellow-800 border border-gold/40',
  free: 'bg-navy-100 text-navy-700 border border-navy-300/40',
  category: 'bg-gray-100 text-gray-600 border border-gray-200',
  admin: 'bg-navy-700 text-white',
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}
