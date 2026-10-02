import React from 'react';
import type { Metadata } from 'next';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { PUBLICATION } from '@/lib/economicreview/content';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description:
    'Terms and conditions for the Vancouver Economic Review newsletter, published by the Vancouver School of Economics Undergraduate Society.',
};

/**
 * The Review's terms.
 *
 * The clauses are carried over word for word from the publication's existing
 * terms. Every clause refers to "the Newsletter" and "the Association" rather
 * than to the publication by name, so the rename needed no legal edit: only
 * the heading and the page metadata changed.
 *
 * The one other difference is punctuation. Clause 6 used em-dashes around an
 * aside, which the house style in AGENTS.md does not allow, so those became
 * commas. The wording is otherwise untouched.
 *
 * Styled by the shared .prose rules in globals.css, the same ones the blog
 * uses, so the type scale comes from the brand tokens.
 */
export default function EconomicReviewTermsPage() {
  return (
    <section className="py-16 lg:py-20 bg-ice">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="font-display text-sm font-semibold text-midnight-700 uppercase tracking-widest mb-3">
            Fine Print
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-midnight leading-tight">
            Terms and Conditions
          </h2>
        </div>

        <article className="bg-offwhite border border-ice-400 rounded-2xl p-7 sm:p-10">
          <div className="prose [&>h2:first-child]:mt-0">
            <h2>1. Purpose and Use of Content</h2>
            <p>
              All content in the Newsletter, including articles, commentary, data, graphics, and
              images is provided for educational and informational purposes only. Nothing in the
              Newsletter should be construed as professional, legal, or financial advice.
            </p>

            <h2>2. Intellectual Property</h2>
            <p>
              Unless otherwise stated, the intellectual property rights in the original content of
              the Newsletter belong to the Association. You may not reproduce, republish, or
              distribute our original content without written consent, except as permitted under the
              Canadian Copyright Act for personal and non-commercial use.
            </p>

            <h2>3. Use of Third-Party Content and Fair Dealing Notice</h2>
            <p>
              The Newsletter may reference or reflect on third-party articles, academic work, media
              content, or public reports. These references are made strictly for educational,
              critical, or commentary purposes, and are used under the fair dealing provisions of the
              Canadian Copyright Act (R.S.C., 1985, c. C-42), and include proper attribution to the
              original authors and publishers wherever applicable. We do not claim ownership over
              third-party materials. If you are a rights holder and believe content has been used
              inappropriately, please contact us at{' '}
              <a href={`mailto:${PUBLICATION.email}`}>{PUBLICATION.email}</a> and we will address
              your concerns promptly.
            </p>

            <h2>4. Copyright and Image Use</h2>
            <p>
              All images, graphics, and visual assets used in the Newsletter are either original
              works by the Association, are used with permission or licensing, or fall under fair
              dealing or public domain categories. We make every effort to ensure that all images
              respect Canadian and international copyright laws.
            </p>

            <h2>5. Privacy and Data Handling</h2>
            <p>
              We collect and retain subscriber email addresses for the sole purpose of distributing
              the Newsletter.
            </p>
            <ul>
              <li>
                Your data is stored securely and handled in compliance with the Personal Information
                Protection and Electronic Documents Act (PIPEDA).
              </li>
              <li>We do not sell, rent, or share personal data with third parties.</li>
              <li>
                You may unsubscribe at any time by using the link provided in each email or by
                contacting <a href={`mailto:${PUBLICATION.email}`}>{PUBLICATION.email}</a>.
              </li>
            </ul>

            <h2>6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted under Canadian law, the Association, its student
              editors, and affiliated parties shall not be held liable for any damages, direct or
              indirect, arising from your use of, or reliance on, the Newsletter content.
            </p>

            <h2>7. No University Endorsement</h2>
            <p>
              The views expressed in the Newsletter reflect those of the student authors and do not
              represent the official stance of UBC, its departments, or its faculty.
            </p>

            <h2>8. Third-Party Links</h2>
            <p>
              The Newsletter may contain links to third-party websites. We are not responsible for
              the content, policies, or accuracy of those external sites. Accessing them is done at
              your own discretion and risk.
            </p>

            <h2>9. Amendments to These Terms</h2>
            <p>
              We may revise these Terms periodically. Continued use of the Newsletter after such
              changes indicates your acceptance of the revised Terms.
            </p>

            <h2>10. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the Province of British Columbia and the
              federal laws of Canada. Disputes shall be resolved within the applicable jurisdiction
              of British Columbia.
            </p>

            <h2>11. Contact Us</h2>
            <p>
              For questions or concerns regarding these Terms or your data, please contact us at{' '}
              <a href={`mailto:${PUBLICATION.email}`}>{PUBLICATION.email}</a>.
            </p>
          </div>
        </article>

        <div className="mt-8">
          <TransitionLink
            href="/economicreview"
            className="inline-flex items-center gap-2 font-display text-sm font-semibold text-midnight hover:text-midnight-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back to the archive
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
