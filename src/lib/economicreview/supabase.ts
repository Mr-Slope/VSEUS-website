/**
 * Supabase client for the Vancouver Economic Review section.
 *
 * This is the only part of the site that talks to a database, and it stays
 * that way. The module is imported only by the archive and its editor at
 * /economicreview, and by the issue reader at /economicreview/read. Next
 * code-splits per route, so no other
 * page carries the SDK and no other page gains a runtime data dependency. The
 * rest of the site remains a plain static export.
 *
 * Configuration comes from NEXT_PUBLIC_* variables. Next inlines those into
 * the browser bundle at build time, which is the only option here: under
 * `output: "export"` there is no server left to read them at runtime, so they
 * have to be present when `next build` runs. See the README for how the
 * deploy workflow supplies them.
 *
 * If they are absent the section degrades on its own. getSupabase() returns
 * null, the archive renders its "not configured" state, the build still
 * succeeds, and every other page is untouched.
 *
 * The anon key is a publishable credential: it is designed to sit in client
 * code, and row level security is the real boundary. The service role key must
 * never appear in this repository or in any bundle.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** False when either variable is missing at build time. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let cached: SupabaseClient | null = null;

/**
 * The shared client, created on first use.
 *
 * Creation is lazy and happens only inside browser event handlers and effects.
 * Building the client at module scope would run it during the static export,
 * and the session-persistence options touch `localStorage`, which does not
 * exist there.
 *
 * Readers never sign in. Editors do, and their session is kept in memory
 * only: nothing is persisted, so a reload always locks the editor again. The
 * token is refreshed in the background so an editing session is not cut off
 * when the first access token expires.
 */
export function getSupabase(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (!cached) {
    cached = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: true },
    });
  }
  return cached;
}
