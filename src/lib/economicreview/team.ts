/**
 * The Review's team and alumni, shown on the Our Team tab.
 *
 * Add or remove a person by editing TEAM below; the page lays out whatever is
 * here. People appear under their tier's heading in the order they are listed,
 * and a tier with nobody in it is left off the page.
 *
 * Photos go in public/images/team/ and are referenced from the site root, e.g.
 * '/images/team/ilan-shapiro.jpg'. Any headshot works: it is cut to a circle,
 * and the crop sits a little above centre so a portrait keeps the face in frame.
 */

export type TeamTier = 'vp' | 'avp' | 'analyst';

/** The tiers, most senior first, with the heading each appears under. */
export const TEAM_TIERS: { id: TeamTier; title: string }[] = [
  { id: 'vp', title: 'Vice President' },
  { id: 'avp', title: 'Assistant Vice President' },
  { id: 'analyst', title: 'Research Analysts' },
];

export interface TeamMember {
  name: string;
  role: string;
  tier: TeamTier;
  /** Path under public/, e.g. '/images/team/kyle-yin.jpg'. Omit for the grey silhouette. */
  photo?: string;
  /** CSS object-position for the circular crop. Omit for 'center 20%'. */
  photoPosition?: string;
  /** Degree and school, e.g. 'UBC BA Economics'. Omit to leave the line off. */
  university?: string;
  /** Full profile URL. Omit to leave the icon off. */
  linkedin?: string;
}

export const TEAM: TeamMember[] = [
  // Reuses the headshot in public/exec/, so one person has one face across the site.
  { name: 'Sebastian Contreras', role: 'VP Finance', tier: 'vp', photo: '/exec/sebastian-contreras.jpg' },

  { name: 'Ilan Shapiro', role: 'AVP Finance', tier: 'avp', photo: '/images/team/ilan-shapiro.jpg' },

  { name: 'Amelia Chang', role: 'Research Analyst', tier: 'analyst', photo: '/images/team/amelia-chang.jpg' },
  { name: 'Michael Sakkab', role: 'Research Analyst', tier: 'analyst', photo: '/images/team/michael-sakkab.jpg' },
  { name: 'Javier Burgos', role: 'Research Analyst', tier: 'analyst', photo: '/images/team/javier-burgos.jpg' },
  { name: 'Kyle Yin', role: 'Research Analyst', tier: 'analyst' },
];

export interface AlumniYear {
  /** Academic year, written like the footer's term years, e.g. '2025-2026'. */
  year: string;
  members: { name: string; role: string }[];
}

/** Past teams, newest year first. The page renders them in this order. */
export const ALUMNI: AlumniYear[] = [
  {
    year: '2025-2026',
    members: [
      { name: 'Sebastian Contreras', role: 'Research Analyst' },
      { name: 'Goli Eshtiaghi', role: 'Research Analyst' },
    ],
  },
];
