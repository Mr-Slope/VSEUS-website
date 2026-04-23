import React from 'react';

const sponsors = [
  'TD Bank',
  'RBC',
  'Scotiabank',
  'Bank of Canada',
  'Deloitte',
  'KPMG',
];

export function SponsorsRow() {
  return (
    <section className="bg-white py-12 border-t border-navy-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">
          Our Partners & Sponsors
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {sponsors.map((name) => (
            <div
              key={name}
              className="text-navy-300 font-bold text-lg tracking-tight hover:text-navy-700 transition-colors cursor-default"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
