import React from 'react';
import Link from 'next/link';

const executives = [
  { name: 'Yash Dhaundiyal', role: 'President', year: '4th Year BIE + Data Science Minor' },
  { name: 'Aiden Ng', role: 'VP Student Life', year: '3rd Year BIE' },
  { name: 'Mishka Balraj', role: 'VP Marketing', year: '3rd Year BIE' },
  { name: 'Sebastian Contreras', role: 'VP Finance', year: '4th Year BA' },
  { name: 'Saloni Karla', role: 'VP Administration', year: '4th Year BA' },
  { name: 'Grace Ding', role: 'VP Academics', year: '2nd Year BIE' },
  { name: 'Nokutenda Dzobo', role: 'VP External', year: '2nd Year BIE' },
];

const reports = [
  { title: 'Annual Report 2024–25', type: 'Annual', href: '#' },
  { title: 'Budget Report — March 2025', type: 'Monthly', href: '#' },
  { title: 'Budget Report — February 2025', type: 'Monthly', href: '#' },
  { title: 'Hiring Statistics 2024–25', type: 'Hiring', href: '#' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-navy-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">About VSEUS</p>
          <h1 className="text-4xl font-black text-white">Who We Are</h1>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-black text-navy-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-4">
              The Vancouver School of Economics Undergraduate Society (VSEUS) was founded in 2014 with a single goal: to ensure that every economics student at UBC has access to the resources, community, and opportunities they need to thrive — both academically and professionally.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe that economics education extends beyond the classroom. Through competitions, workshops, networking events, and advocacy, we help students build the real-world skills and connections that define a successful career in economics, finance, and public policy.
            </p>
          </div>
        </div>
      </section>

      {/* Executives */}
      <section id="executives" className="py-16 bg-navy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-navy-900 mb-8">Executive Team 2024–25</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {executives.map((exec) => (
              <div key={exec.name} className="bg-white rounded-2xl p-5 shadow-sm border border-navy-100">
                <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center text-white font-bold text-lg mb-3">
                  {exec.name.charAt(0)}
                </div>
                <h3 className="font-bold text-navy-900">{exec.name}</h3>
                <p className="text-sm text-navy-500 font-medium">{exec.role}</p>
                <p className="text-xs text-gray-500 mt-1">{exec.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Reports */}
      <section id="reports" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-black text-navy-900 mb-2">Transparency Reports</h2>
            <p className="text-gray-500 mb-8 text-sm">
              VSEUS is committed to full financial transparency. All reports are publicly available.
            </p>
            <div className="space-y-3">
              {reports.map((r) => (
                <a
                  key={r.title}
                  href={r.href}
                  className="flex items-center justify-between bg-navy-100 hover:bg-navy-700 text-navy-900 hover:text-white rounded-xl px-5 py-4 transition-all group"
                >
                  <div>
                    <p className="font-medium text-sm">{r.title}</p>
                    <p className="text-xs opacity-60 mt-0.5">{r.type} Report</p>
                  </div>
                  <svg className="w-4 h-4 opacity-50 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="py-16 bg-navy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-navy-900 mb-4">Our Partners</h2>
          <p className="text-gray-600 mb-8 max-w-2xl">
            We partner with leading financial institutions, consulting firms, and professional organizations to create opportunities for our members.
          </p>
          <div className="flex flex-wrap gap-3">
            {['TD Bank', 'RBC', 'Scotiabank', 'Bank of Canada', 'Deloitte', 'KPMG', 'University of British Columbia', 'Sauder School of Business'].map((p) => (
              <span key={p} className="bg-white border border-navy-100 text-navy-700 font-semibold text-sm px-4 py-2 rounded-full">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-navy-700 text-center">
        <h2 className="text-2xl font-black text-white mb-3">Join Our Team</h2>
        <p className="text-white/70 mb-6 text-sm">Applications for the 2025–26 executive team open in September.</p>
        <Link href="/contact" className="inline-flex items-center bg-gold text-navy-900 font-semibold px-6 py-3 rounded-lg hover:bg-gold-light transition-colors text-sm">
          Get in Touch
        </Link>
      </section>
    </div>
  );
}
