import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PUBLICATION } from '@/lib/economicreview/content';
import { COMMENT_TERMS_VERSION } from '@/lib/economicreview/comments';
import { formatIssueDate } from '@/lib/economicreview/issues';

export const metadata: Metadata = {
  title: 'Comment Terms and Community Guidelines',
  description:
    'The rules for commenting on Vancouver Economic Review issues: what is allowed, how comments are moderated, and how reader information is handled.',
};

/**
 * The terms every commenter agrees to before posting.
 *
 * Written in the same register as the Review's Terms and Conditions, and using
 * the same name for VSEUS ("the Association"), so the two read as one set.
 * These supplement those terms rather than replace them.
 *
 * The version date at the top is COMMENT_TERMS_VERSION. Change that constant
 * whenever this page changes: each comment records the version in force when
 * it was posted.
 *
 * What the privacy section says is collected and how long it is kept has to
 * stay true to the database. See the comments migration in the economicsgazette
 * repository: the browser key and network address are stored only as hashes,
 * and the network hash is cleared after 30 days.
 */
export default function CommentTermsPage() {
  const email = <a href={`mailto:${PUBLICATION.email}`}>{PUBLICATION.email}</a>;

  return (
    <section className="py-16 lg:py-20 bg-ice">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="font-display text-sm font-semibold text-midnight-700 uppercase tracking-widest mb-3">
            Fine Print
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-midnight leading-tight">
            Comment Terms and Community Guidelines
          </h2>
          <p className="mt-4 text-midnight/80 leading-relaxed">
            Last updated {formatIssueDate(`${COMMENT_TERMS_VERSION}T12:00:00-07:00`)}. These terms apply when you
            comment on, reply to, like, or report anything in the conversations under {PUBLICATION.name} issues. They
            supplement our{' '}
            <a
              href="/economicreview/terms"
              className="font-semibold text-midnight underline decoration-accent decoration-2 underline-offset-2"
            >
              Terms and Conditions
            </a>
            .
          </p>
        </div>

        <article className="bg-offwhite border border-ice-400 rounded-2xl p-7 sm:p-10">
          <div className="prose [&>h2:first-child]:mt-0">
            <h2>The short version</h2>
            <ul>
              <li>Stay on the topic of the issue, and debate ideas, not people.</li>
              <li>No harassment, hate, threats, spam, or anyone&apos;s personal information.</li>
              <li>Everything you post is public, and you are responsible for it.</li>
              <li>We can remove anything, at any time, without notice.</li>
              <li>We collect as little as we can, and never sell it.</li>
            </ul>

            <h2>1. Agreeing to These Terms</h2>
            <p>
              The conversations are run by the Vancouver School of Economics Undergraduate Society (&ldquo;the
              Association&rdquo;). By posting, or by otherwise taking part, you agree to
              these terms. If you do not agree, please do not post. Anything you post, like, or report is a
              &ldquo;contribution&rdquo; in these terms.
            </p>

            <h2>2. Who May Take Part</h2>
            <p>
              You must be at least 13 years old to post. There are no accounts: you choose a display name each time you
              post. Choose one that is not misleading, and do not use the name of another person or organization.
              Names that could be mistaken for the Association, the Review, or its staff are not available.
            </p>

            <h2>3. Community Guidelines</h2>
            <p>Contributions must not:</p>
            <ul>
              <li>harass, bully, threaten, intimidate, or personally attack anyone, including authors and other readers;</li>
              <li>
                promote hatred of, or discriminate against, any person or group on the basis of race, colour, ancestry,
                place of origin, religion, marital or family status, physical or mental disability, sex, sexual
                orientation, gender identity or expression, age, or any other ground protected by law;
              </li>
              <li>
                contain false statements of fact that could harm the reputation of a person or organization, or accuse
                an identifiable person of wrongdoing;
              </li>
              <li>
                share personal information about anyone, yourself included, such as phone numbers, email or home
                addresses, student numbers, or private details;
              </li>
              <li>impersonate anyone, including members of the Association, the Review&apos;s staff, or UBC faculty and staff;</li>
              <li>advertise, solicit, fundraise, or post spam, referral links, or the same message repeatedly;</li>
              <li>
                promote investments or schemes, or offer financial advice for payment. Nothing in the conversations is
                financial advice;
              </li>
              <li>
                share assessment answers or exam content, or offer to complete coursework for others, contrary to
                UBC&apos;s academic integrity rules;
              </li>
              <li>contain sexually explicit, graphically violent, or otherwise obscene material;</li>
              <li>infringe anyone&apos;s copyright or other rights. Short quotations with attribution are fine;</li>
              <li>break the law, or encourage anyone else to.</li>
            </ul>
            <p>
              Links in comments are shown as plain text and are not clickable. A comment may include up to two.
            </p>

            <h2>4. Your Responsibility for What You Post</h2>
            <p>
              You are solely responsible for your contributions. Comments are public: anyone can read them, they may
              be copied or shared, and search engines may index them. Do not post anything you would not want seen
              publicly or connected to you. By posting, you confirm that your contribution is your own or that you
              have the right to share it, and that it follows these terms and the law.
            </p>

            <h2>5. Moderation</h2>
            <p>
              Comments appear without being reviewed first. The Association does not monitor every contribution and
              has no obligation to, but may, at any time and at its sole discretion, without notice or explanation:
            </p>
            <ul>
              <li>hide, remove, or decline to publish any contribution, whether or not it breaks these terms;</li>
              <li>limit or block posting from a browser or network, temporarily or permanently;</li>
              <li>close the conversation on any issue, or on every issue.</li>
            </ul>
            <p>
              To keep the conversations usable, automatic limits apply. Posting too often, repeating a comment, and
              certain words and phrases are refused, and a comment reported by several readers is hidden until a
              moderator reviews it. Moderation decisions are made by the Association&apos;s student volunteers, and are
              final.
            </p>

            <h2>6. Reporting a Comment</h2>
            <p>
              Use Report in a comment&apos;s menu to flag it. Reports are anonymous. If a comment threatens someone,
              shares personal information, or you believe it is defamatory or infringes your rights, also email{' '}
              {email} with a link to the comment (use Share to copy one) so we can act quickly.
            </p>

            <h2>7. Rights in Your Contributions</h2>
            <p>
              You keep ownership of your contributions. By posting, you grant the Association a non-exclusive,
              royalty-free, worldwide licence to host, store, display, reproduce, and distribute each contribution on
              this site and in connection with the Review, including quoting it with your display name. The licence
              ends for the site when the contribution is removed, except for copies kept for legal or safety reasons.
            </p>

            <h2>8. No Endorsement</h2>
            <p>
              Contributions are the views of the people who post them. They do not represent the views of the
              Association, the Review or its editors and authors, the Vancouver School of Economics, or UBC, and their
              presence on the site is not an endorsement.
            </p>

            <h2>9. Privacy</h2>
            <p>There is no account and we never ask for your email. When you take part, we store:</p>
            <ul>
              <li>your display name, your comment, when you posted it, and the version of these terms you agreed to;</li>
              <li>
                a random identifier created by your browser and kept in its local storage. We store only a one-way hash
                of it. It lets you delete your own comments from the same browser, and lets us apply posting limits;
              </li>
              <li>
                a one-way, salted hash of your network (IP) address, used only to limit abuse. It is deleted after 30
                days. We never store the address itself;
              </li>
              <li>your likes and reports, linked to the same hashed identifiers so each counts once.</li>
            </ul>
            <p>
              Your display name and comments are public. Everything else is visible only to the Association&apos;s
              moderators. We use no advertising or tracking cookies for the conversations, and we do not sell, rent, or
              share this information, except where the law requires it. It is stored for us by our database provider,
              Supabase, and may be processed outside Canada. We handle it in line with applicable Canadian privacy law.
            </p>
            <p>
              Comments stay up until you or a moderator takes them down. You can delete your own comment from its menu
              in the browser you posted from. To ask us to remove a comment or for any privacy question, email {email}.
              Because there are no accounts, we may not be able to confirm who wrote a comment, so we decide removal
              requests on the content.
            </p>

            <h2>10. Disclaimer and Limitation of Liability</h2>
            <p>
              The conversations are provided as is. To the maximum extent permitted under Canadian law, the
              Association, its student editors, volunteers, and affiliated parties are not liable for any
              contribution made by a reader, for any reliance on one, or for removing or declining to publish any
              contribution.
            </p>

            <h2>11. Indemnity</h2>
            <p>
              You agree to indemnify the Association, its executives, editors, and volunteers against any claim, loss,
              or expense, including reasonable legal fees, arising from your contributions or your breach of these
              terms.
            </p>

            <h2>12. Changes to These Terms</h2>
            <p>
              We may revise these terms. The date at the top shows the current version, and you will be asked to agree
              again before you next post. The terms that applied when you posted continue to apply to that
              contribution.
            </p>

            <h2>13. Governing Law</h2>
            <p>
              These terms are governed by the laws of the Province of British Columbia and the federal laws of Canada.
              Disputes shall be resolved within the applicable jurisdiction of British Columbia.
            </p>

            <h2>14. Contact Us</h2>
            <p>For questions about these terms, the conversations, or your information, contact us at {email}.</p>
          </div>
        </article>

        <div className="mt-8">
          <Link
            href="/economicreview"
            className="inline-flex items-center gap-2 font-display text-sm font-semibold text-midnight hover:text-midnight-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back to the archive
          </Link>
        </div>
      </div>
    </section>
  );
}
