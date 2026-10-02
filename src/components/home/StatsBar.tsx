'use client';

import React, { useEffect, useRef, useState } from 'react';
import { yearsRunning } from '@/lib/society';

const ICON_PATHS = {
  // A group of students
  students:
    'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
  // A columned building
  building:
    'M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z',
  // A calendar
  calendar:
    'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z',
};

type IconName = keyof typeof ICON_PATHS;

/** `years` is computed per render rather than hardcoded — see src/lib/society.ts. */
function buildStats(years: number) {
  return [
    { value: 950, suffix: '+', label: 'Students Represented', icon: 'students' as IconName },
    { value: 20, suffix: '+', label: 'Annual Events', icon: 'building' as IconName },
    { value: years, suffix: '', label: 'Years Running', icon: 'calendar' as IconName },
  ];
}

function useCountUp(target: number, duration = 1600) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function StatItem({ value, suffix, label, icon }: { value: number; suffix: string; label: string; icon: IconName }) {
  const { count, ref } = useCountUp(value);

  return (
    <div ref={ref} className="text-center px-6 py-14 lg:py-20 group">
      <p className="font-display text-6xl sm:text-7xl lg:text-8xl font-black stats-number mb-2 leading-none">
        {count}
        {suffix}
      </p>
      <p className="font-display text-sm lg:text-base text-offwhite/55 font-semibold uppercase tracking-[0.18em] mt-3">
        {label}
      </p>
      {/* Hops and lights up when the stat is hovered */}
      <span className="mt-6 mx-auto w-14 h-14 rounded-full border border-accent/30 bg-accent/10 text-accent flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1.5 group-hover:bg-accent group-hover:text-midnight group-hover:shadow-[0_10px_28px_-6px_rgba(237,177,135,0.6)]">
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[icon]} />
        </svg>
      </span>
    </div>
  );
}

export function StatsBar() {
  // Only `count` ever reaches the DOM and it starts at 0 on both sides, so
  // deriving this from the clock can't cause a hydration mismatch.
  const stats = buildStats(yearsRunning());

  return (
    <section className="bg-midnight border-y border-offwhite/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 sm:divide-x divide-offwhite/[0.08]">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
