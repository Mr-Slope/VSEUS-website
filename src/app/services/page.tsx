import React from 'react';
import Link from 'next/link';

const services = [
  {
    id: 'merch',
    title: 'Merchandise',
    description:
      'Rep VSEUS with our exclusive student merchandise: hoodies, t-shirts, tote bags, and more. All items are made to order. Proceeds support student programming.',
    cta: 'Shop Now',
    ctaHref: '#',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    id: 'awards',
    title: 'Awards & Grants',
    description:
      'VSEUS offers annual awards recognizing outstanding academic achievement and extracurricular contributions, plus research grants to support undergraduate projects.',
    cta: 'Learn More',
    ctaHref: '/contact',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
      </svg>
    ),
  },
  {
    id: 'learning',
    title: 'Learning Centers',
    description:
      'Access peer tutoring, exam prep sessions, and study groups organized by VSEUS. Our learning centers cover core economics courses from ECON 101 through 400-level.',
    cta: 'Find a Tutor',
    ctaHref: '/contact',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    id: 'initiatives',
    title: 'Initiatives',
    description:
      'VSEUS runs ongoing initiatives including an economics journal, policy brief competition, mentorship program pairing upper-year students with first-years, and a speaker series.',
    cta: 'Get Involved',
    ctaHref: '/contact',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-navy-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">What We Offer</p>
          <h1 className="text-4xl font-black text-white">Our Services</h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((s) => (
              <div
                key={s.id}
                id={s.id}
                className="bg-navy-100 rounded-2xl p-7 border border-navy-100 hover:border-navy-300 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-navy-700 text-white flex items-center justify-center mb-4">
                  {s.icon}
                </div>
                <h2 className="text-xl font-bold text-navy-900 mb-3">{s.title}</h2>
                <p className="text-gray-600 leading-relaxed text-sm mb-5">{s.description}</p>
                <Link
                  href={s.ctaHref}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-500 hover:text-navy-700 transition-colors"
                >
                  {s.cta}
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-navy-700 text-center">
        <h2 className="text-2xl font-black text-white mb-3">Not sure where to start?</h2>
        <p className="text-white/70 mb-6 text-sm">Become a member to unlock all services and features.</p>
        <Link href="/auth/signup" className="inline-flex items-center bg-gold text-navy-900 font-semibold px-6 py-3 rounded-lg hover:bg-gold-light transition-colors text-sm">
          Join VSEUS
        </Link>
      </section>
    </div>
  );
}
