import React from 'react';

const sponsors = ['TD Bank', 'RBC', 'Scotiabank', 'Bank of Canada', 'Deloitte', 'KPMG', 'McKinsey & Co.', 'BCG'];

export function SponsorsRow() {
  const doubled = [...sponsors, ...sponsors];

  return (
    <section className="bg-white py-14 border-t border-navy-100 overflow-hidden">
      <p className="text-center text-[10px] font-semibold text-gray-300 uppercase tracking-[0.25em] mb-8">
        Our Partners &amp; Sponsors
      </p>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="marquee-track gap-16 px-8">
          {doubled.map((name, i) => (
            <span
              key={i}
              className="text-navy-200 font-black text-xl tracking-tight flex-shrink-0 hover:text-navy-500 transition-colors duration-300 cursor-default select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
