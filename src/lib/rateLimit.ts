import { and, gt, inArray, sql } from 'drizzle-orm';
import { db } from '@/db';
import { loginAttempts } from '@/db/schema';

const WINDOW_MS = 60_000; // 1 minute
const MAX_ATTEMPTS = 5; // per window before lockout
const LOCKOUT_MS = 15 * 60_000; // 15 minutes

/** True if any of the given keys is currently locked out. */
export async function isLockedOut(keys: string[]): Promise<boolean> {
  if (keys.length === 0) return false;
  const rows = await db
    .select({ key: loginAttempts.key })
    .from(loginAttempts)
    .where(and(inArray(loginAttempts.key, keys), gt(loginAttempts.lockedUntil, new Date())));
  return rows.length > 0;
}

/**
 * Record a failed login attempt for each key. Resets the counter when the
 * window has elapsed, and applies a lockout once the threshold is exceeded.
 */
export async function recordFailure(keys: string[]): Promise<void> {
  const now = new Date();
  const windowCutoff = new Date(now.getTime() - WINDOW_MS);
  const lockedUntil = new Date(now.getTime() + LOCKOUT_MS);

  for (const key of keys) {
    await db
      .insert(loginAttempts)
      .values({ key, count: 1, windowStart: now, lockedUntil: null })
      .onConflictDoUpdate({
        target: loginAttempts.key,
        set: {
          // New window → reset to 1; otherwise increment.
          count: sql`case when ${loginAttempts.windowStart} < ${windowCutoff} then 1 else ${loginAttempts.count} + 1 end`,
          windowStart: sql`case when ${loginAttempts.windowStart} < ${windowCutoff} then ${now} else ${loginAttempts.windowStart} end`,
          // Lock out once attempts within the window exceed the threshold.
          lockedUntil: sql`case when ${loginAttempts.windowStart} >= ${windowCutoff} and ${loginAttempts.count} + 1 > ${MAX_ATTEMPTS} then ${lockedUntil} else ${loginAttempts.lockedUntil} end`,
        },
      });
  }
}

/** Clear attempt state for keys after a successful login. */
export async function clearAttempts(keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  await db.delete(loginAttempts).where(inArray(loginAttempts.key, keys));
}
