'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Reveal } from '@/components/ui/Reveal';

const pillars = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    number: '01',
    title: 'Academic Success',
    description: 'Study groups, tutoring resources, course guides, and research opportunities to help you excel in your economics degree.',
    image: '/photos/Home/honours-thesis-recap.png',
    alt: 'A student presenting an honours thesis poster to two classmates',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    number: '02',
    title: 'Community Connections',
    description: 'Build lasting relationships through social events, society initiatives, and a welcoming community of students who share your passion for economics.',
    image: '/photos/Home/blue-day-group-photo.jpg',
    alt: 'Society members gathered for a group photo at the Blue Day Banquet',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
    number: '03',
    title: 'Career Preparedness',
    description: 'Networking events with industry professionals, resume workshops, interview prep, and exclusive job postings for economics students.',
    image: '/photos/Home/networking.jpg',
    alt: 'Students talking in small groups at a society networking night',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.125m-1.014 8.006A23.91 23.91 0 0118.795 21m.38-1.125A23.91 23.91 0 0020.19 15" />
      </svg>
    ),
    number: '04',
    title: 'Student Advocacy',
    description: 'Representing economics students on university committees, advocating for program improvements, and amplifying student voices.',
    image: '/photos/Home/vseus-social-internal.jpg',
    alt: 'Students seated in rows, listening at a society event',
  },
];

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent) {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateZ(4px)`;
  }

  function onMouseLeave() {
    if (ref.current) ref.current.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="tilt-card h-full"
    >
      {children}
    </div>
  );
}

export function ServicePillars() {
  return (
    <section className="bg-ice py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Reveal className="text-center mb-14">
          <p className="font-display text-xs font-semibold text-midnight-700 uppercase tracking-widest mb-3">What We Do</p>
          <h2 className="text-4xl font-black text-midnight mb-3">Four Pillars.</h2>
          <p className="text-muted max-w-md mx-auto text-sm">
            Every commitment we make to economics students at UBC flows from these four principles.
          </p>
        </Reveal>

        {/* Two by two: each card is wide enough for text beside its image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <TiltCard>
                <div className="group bg-offwhite border border-ice-400 rounded-2xl p-7 h-full flex flex-col gap-5 hover:border-accent hover:shadow-xl hover:shadow-midnight/10 transition-all duration-300 cursor-default">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-ice text-midnight-700 flex items-center justify-center group-hover:bg-midnight-700 group-hover:text-offwhite transition-all duration-300">
                      {p.icon}
                    </div>
                    <span className="font-display text-3xl font-black text-ice-400 group-hover:text-accent transition-colors">
                      {p.number}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-midnight mb-2 text-xl">{p.title}</h3>
                      <p className="text-sm text-muted leading-relaxed">{p.description}</p>
                    </div>
                    {/* fill needs a positioned parent; the box keeps the card's fixed crop */}
                    <div className="relative w-full sm:w-56 h-48 sm:h-56 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={p.image}
                        alt={p.alt}
                        fill
                        sizes="(min-width: 640px) 224px, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Accent rule sweeps in on hover */}
                  <div className="mt-auto h-[3px] w-0 group-hover:w-full bg-accent rounded-full transition-all duration-500" />
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
