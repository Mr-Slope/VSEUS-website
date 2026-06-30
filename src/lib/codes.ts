import { createHmac } from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Membership login codes are `ECON-####` (four digits).
 *
 * Codes are never stored in plaintext. For each code we persist two columns:
 *  - `codeLookup`: a deterministic HMAC, so a login attempt can find the one
 *    candidate row with an indexed equality lookup.
 *  - `codeHash`: a salted bcrypt hash, the authoritative verification. Combined
 *    with login rate-limiting/lockout, this defends the small (10k) code space.
 */

export const CODE_PREFIX = 'ECON-';
export const CODE_DIGITS = 4;
export const CODE_REGEX = /^ECON-\d{4}$/;
const BCRYPT_ROUNDS = 10;

function hmacSecret(): string {
  const secret = process.env.CODE_HMAC_SECRET ?? process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('CODE_HMAC_SECRET (or AUTH_SECRET) is not set.');
  }
  return secret;
}

/** Normalize user input: trim, uppercase, tolerate a missing dash. */
export function normalizeCode(raw: string): string {
  const cleaned = raw.trim().toUpperCase().replace(/\s+/g, '');
  if (/^ECON\d{4}$/.test(cleaned)) {
    return `${CODE_PREFIX}${cleaned.slice(4)}`;
  }
  return cleaned;
}

export function isValidCodeFormat(code: string): boolean {
  return CODE_REGEX.test(code);
}

/** Deterministic, non-reversible lookup index for a code. */
export function codeLookup(code: string): string {
  return createHmac('sha256', hmacSecret()).update(code).digest('hex');
}

export function hashCode(code: string): Promise<string> {
  return bcrypt.hash(code, BCRYPT_ROUNDS);
}

export function verifyCode(code: string, hash: string): Promise<boolean> {
  return bcrypt.compare(code, hash);
}

/** Build `ECON-####` from a numeric value (0–9999), zero-padded. */
export function formatCode(num: number): string {
  return `${CODE_PREFIX}${String(num % 10 ** CODE_DIGITS).padStart(CODE_DIGITS, '0')}`;
}
