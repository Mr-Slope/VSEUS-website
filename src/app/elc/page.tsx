import React from 'react';
import Link from 'next/link';

const courses = [
  { code: 'ECON 101', name: 'Principles of Microeconomics', year: '1st Year' },
  { code: 'ECON 102', name: 'Principles of Macroeconomics', year: '1st Year' },
  { code: 'ECON 226', name: 'Introduction to Econometrics', year: '2nd Year' },
  { code: 'ECON 301', name: 'Intermediate Microeconomics I',  year: '3rd Year' },
  { code: 'ECON 302', name: 'Intermediate Macroeconomics I',  year: '3rd Year' },
  { code: 'ECON 325', name: 'Introduction to Empirical Economics', year: '3rd Year' },
  { code: 'ECON 326', name: 'Methods of Empirical Research',  year: '3rd Year' },
];

const steps = [
  {
    step: '01',
    title: 'Show Up',
    body: 'Walk in to IONA Room 038 any time during operating hours. No appointment or booking required.',
  },
  {
    step: '02',
    title: 'Check In',
    body: 'Bring your UBC Student ID to check in at the front. It takes less than a minute.',
  },
  {
    step: '03',
    title: 'Get Help',
    body: 'Work through your questions with one of our trained undergraduate peer tutors on a first-come, first-served basis.',
  },
];

export default function ELCPage() {
  return (
    <div className="min-h-screen">

      {/* Header */}
      <section className="bg-navy-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-grid-bg opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-900/70 to-navy-700/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <span>/</span>
            <span className="text-white/70">Economics Learning Centre</span>
          </div>
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">Academic Support</p>
          <h1 className="text-5xl font-black text-white mb-4 leading-tight">
            Economics<br />Learning Centre
          </h1>
          <p className="text-white/55 text-lg max-w-xl leading-relaxed">
            Free walk-in peer tutoring for UBC economics students, staffed by undergraduate assistants who know the courses inside out.
          </p>
        </div>
      </section>

      {/* At a glance */}
      <section className="bg-navy-700 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Location</p>
                <p className="text-white/55 text-sm mt-0.5">IONA Room 038</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Hours</p>
                <p className="text-white/55 text-sm mt-0.5">Mon to Thu, 11:00am to 5:00pm</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Access</p>
                <p className="text-white/55 text-sm mt-0.5">Walk-in only. Bring your Student ID.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-navy-900 mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((s) => (
              <div key={s.step}>
                <span className="block text-6xl font-black text-navy-100 leading-none select-none mb-4">
                  {s.step}
                </span>
                <h3 className="text-lg font-bold text-navy-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses covered */}
      <section className="py-16 bg-navy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-navy-900 mb-3">Courses We Cover</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-xl">
            Our tutors are trained across the following courses. Bring questions from any of these and our peer assistants will work through them with you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((c) => (
              <div key={c.code} className="bg-white rounded-xl border border-navy-100 p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-gold font-black text-[10px] text-center leading-tight px-1">{c.code}</span>
                </div>
                <div>
                  <p className="text-navy-900 font-semibold text-sm leading-tight">{c.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{c.year}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-5">
            Have a question from another economics course? Feel free to bring it in. Tutors will do their best to help.
          </p>
        </div>
      </section>

      {/* Canvas enrollment */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl bg-navy-100 border border-navy-200/60 rounded-2xl p-8">
            <h2 className="text-xl font-black text-navy-900 mb-3">Enroll on Canvas</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-5">
              To receive ELC updates, session announcements, and course resources, enroll in the ELC Canvas course using the self-enroll key below.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="bg-white border border-navy-200 rounded-lg px-5 py-3">
                <p className="text-xs text-gray-400 font-medium mb-0.5">Canvas Enrollment Key</p>
                <p className="text-navy-900 font-black tracking-widest text-lg">9KXL4W</p>
              </div>
              <div className="text-xs text-gray-400 max-w-[220px] leading-relaxed">
                Go to Canvas, click &quot;Join a Course&quot;, and enter the key above.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-navy-700 text-center">
        <h2 className="text-2xl font-black text-white mb-3">Questions about the ELC?</h2>
        <p className="text-white/60 text-sm mb-6 max-w-sm mx-auto">
          Reach out to VSEUS&apos; VP of Academics or drop by during the ELC&apos;s operating hours.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center bg-gold text-navy-900 font-semibold px-6 py-3 rounded-lg hover:bg-gold-light transition-colors text-sm"
          >
            Contact Us
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center border border-white/20 text-white/80 font-medium px-6 py-3 rounded-lg hover:bg-white/10 hover:text-white transition-all text-sm"
          >
            Back to Services
          </Link>
        </div>
      </section>

    </div>
  );
}
