import React from 'react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { SectionDivider } from '@/components/ui/SectionDivider';

const resources = [
  {
    id: 'awards',
    title: 'Awards & Grants',
    description:
      'VSEUS offers annual awards recognizing outstanding academic achievement and extracurricular contributions, plus research grants to support undergraduate projects.',
    cta: 'Student Grant Application',
    ctaHref: 'https://forms.gle/w1s8gPDV2ckbciw89',
    isExternal: true,
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
      </svg>
    ),
  },
  {
    id: 'learning',
    title: 'Economics Learning Centre',
    description:
      'Free walk-in peer tutoring run by trained undergraduate assistants. Covering ECON 101, 102, 226, 301, 302, 325, and 326. Open Monday to Thursday, 11am to 5pm in IONA 038. No appointment needed. Offered in partnership with the VSE.',
    cta: 'Learn More',
    ctaHref: '/elc',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    id: 'agora',
    title: 'AGORA Mentorship',
    description:
      'Our mentorship program pairs lower-year students with upper-year mentors, and upper-year students with VSE alumni, based on shared academic and career interests. It runs October to December. The mentee guidebook covers the program structure, milestones, an email template for reaching out to your mentor, and FAQs.',
    cta: 'Read the Mentee Guidebook',
    ctaHref: '/guides/agora-mentee-guidebook-2026-27.pdf',
    isFile: true,
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    id: 'career-centre',
    title: 'VSE Career Centre',
    description:
      'The Vancouver School of Economics’ career centre for Bachelor of International Economics (BIE) students. It takes a holistic coaching approach to professional and personal development, during the degree and beyond it, through one-on-one appointments, coaching programs, the Perspectives Program, and networking events with employers.',
    cta: 'Book an Appointment',
    ctaHref: 'https://careercentre.economics.ubc.ca/',
    isExternal: true,
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    id: 'clubs',
    title: 'Clubs',
    description:
      'VSEUS recognizes a group of student-run clubs working across economics, finance, and public policy. Recognition connects them to our funding, spaces, and audience so their programming reaches every VSEUS constituent.',
    cta: 'See the Clubs',
    ctaHref: '/clubs',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
];

const CTA_CLASS =
  'btn btn-outline-dark mt-auto self-start gap-1.5 text-sm px-5 py-2.5';

function ArrowIcon() {
  return (
    <svg className="w-3.5 h-3.5 btn-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-ice">
      <section className="bg-midnight py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-sans text-accent text-sm font-semibold uppercase tracking-widest mb-2">What We Offer</p>
          <h1 className="text-4xl font-black text-offwhite">Our <span className="heading-accent">Resources</span></h1>
        </div>
      </section>

      <SectionDivider from="midnight" to="ice" variant="dip" />
      <section className="py-16 bg-ice">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {resources.map((r) => (
              <div
                key={r.id}
                id={r.id}
                className="bg-offwhite rounded-2xl p-8 border border-ice-400 hover:border-accent hover:shadow-lg hover:shadow-midnight/10 transition-all flex flex-col anchor-offset"
              >
                <div className="w-14 h-14 rounded-xl bg-midnight-700 text-offwhite flex items-center justify-center mb-5">
                  {r.icon}
                </div>
                <h2 className="text-2xl font-bold text-midnight mb-3">{r.title}</h2>
                <p className="text-muted leading-relaxed text-sm mb-5">{r.description}</p>
                {r.isFile || r.isExternal ? (
                  // A PDF in public/ or another site, so skip the page-transition wipe and open it in a new tab.
                  <a href={r.ctaHref} target="_blank" rel="noopener noreferrer" className={CTA_CLASS}>
                    {r.cta}
                    <ArrowIcon />
                  </a>
                ) : (
                  <TransitionLink href={r.ctaHref} className={CTA_CLASS}>
                    {r.cta}
                    <ArrowIcon />
                  </TransitionLink>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
