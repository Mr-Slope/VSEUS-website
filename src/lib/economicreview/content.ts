/**
 * Static content for the Vancouver Economic Review section.
 *
 * Everything here is editorial copy rather than data: the masthead wording,
 * the section tabs, the four mission pillars, and the history timeline on the
 * About page. The team and alumni live in team.ts, and issues themselves come
 * from Supabase at runtime, see issues.ts.
 *
 * The publication was previously called the Economics Gazette. That name is
 * kept only where it is genuinely historical, such as the timeline entry
 * describing how the publication was revived, and in issue titles that the
 * database already stores under the old name.
 */

export const PUBLICATION = {
  name: 'Vancouver Economic Review',
  tagline:
    'The Vancouver Economic Review is a student-led publication covering financial markets, economics, and public policy.',
  /** Where readers write in. Matches the address the Review already publishes. */
  email: 'finance@vseus.ca',
} as const;

/**
 * The section tabs.
 *
 * Terms is deliberately absent: it is fine print, linked from the masthead and
 * from inside the subscribe dialog rather than given equal billing with the
 * archive.
 */
export const SECTION_TABS = [
  { label: 'Weekly Reports', href: '/economicreview' },
  { label: 'About Us', href: '/economicreview/about' },
  { label: 'Our Mission', href: '/economicreview/mission' },
  { label: 'Our Team', href: '/economicreview/team' },
] as const;

/**
 * The page a single issue is read on. It belongs to the Weekly Reports tab,
 * which stays lit while an issue is open. See readerHref() in issues.ts.
 */
export const READER_PATH = '/economicreview/read';

export interface Pillar {
  title: string;
  body: string;
}

export const MISSION_PILLARS: Pillar[] = [
  {
    title: 'Student Voice and Advocacy',
    body: 'Amplifying student perspectives on pressing economic and financial issues.',
  },
  {
    title: 'Academic and Intellectual Growth',
    body: 'Connecting classroom theory with real-world applications in economics, finance, and policy.',
  },
  {
    title: 'Professional and Career Development',
    body: 'Providing students with a platform to publish research, analysis, and commentary on relevant economic trends.',
  },
  {
    title: 'Community Engagement',
    body: 'Building a collaborative network of students, alumni, and faculty to strengthen the economics community at UBC.',
  },
];

export interface Milestone {
  /** Shown as written, so a range keeps its en-dash: 'April 2022 – June 2025'. */
  date: string;
  title: string;
  body: string;
  /**
   * 'muted' greys the entry out and gives it a hollow marker, for a period
   * when the publication was inactive. 'highlight' marks where it stands now:
   * move it to the newest entry when you add one. Omit for an ordinary entry.
   */
  tone?: 'muted' | 'highlight';
}

/**
 * The timeline on the About page, oldest first. Add a milestone by appending
 * an object; the page renders whatever is here.
 */
export const HISTORY: Milestone[] = [
  {
    date: 'February – March 2022',
    title: 'Early Beginnings',
    body: 'The initiative began as a digital curation project, sharing breaking economics news and insights through social media.',
  },
  {
    date: 'April 2022 – June 2025',
    title: 'Pause',
    body: 'After its initial run, the project was interrupted.',
    tone: 'muted',
  },
  {
    date: 'July 2025',
    title: 'The Economics Gazette',
    body: 'The initiative was revived and restructured as The Economics Gazette, a weekly digest of markets, economics, and policy written exclusively by UBC economics students. It published 30 issues and grew to about 200 subscribers.',
  },
  {
    date: 'October 2026',
    title: 'The Vancouver Economic Review',
    body: 'Marking a shift from summarizing the news to producing original, independent student research, the Gazette was reimagined and relaunched as the Vancouver Economic Review.',
    tone: 'highlight',
  },
];
