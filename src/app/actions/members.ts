'use server';

import { randomInt } from 'crypto';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { members } from '@/db/schema';
import { codeLookup, formatCode, hashCode } from '@/lib/codes';
import { requireAdmin } from '@/lib/session';
import type { UserRole } from '@/types/user';

export interface CreateMemberInput {
  name: string;
  studentId?: string;
  email?: string;
  role: UserRole;
  /** Optional fixed code number (0–9999), e.g. 1 → ECON-0001. */
  desiredNumber?: number;
}

const MAX_CODE = 10 ** 4;

async function codeExists(code: string): Promise<boolean> {
  const lookup = codeLookup(code);
  const [row] = await db
    .select({ id: members.id })
    .from(members)
    .where(eq(members.codeLookup, lookup))
    .limit(1);
  return Boolean(row);
}

/** Find an unused ECON-#### code, or use a requested number if free. */
async function allocateCode(desiredNumber?: number): Promise<string> {
  if (desiredNumber !== undefined) {
    const code = formatCode(desiredNumber);
    if (await codeExists(code)) throw new Error(`${code} is already in use.`);
    return code;
  }
  for (let i = 0; i < 200; i++) {
    const code = formatCode(randomInt(0, MAX_CODE));
    if (!(await codeExists(code))) return code;
  }
  throw new Error('Could not allocate a unique code — the code space may be exhausted.');
}

/** Create a member and return the plaintext code ONCE (never retrievable later). */
export async function createMember(input: CreateMemberInput): Promise<{ id: string; code: string }> {
  await requireAdmin();
  const name = input.name.trim();
  if (!name) throw new Error('Name is required.');

  const code = await allocateCode(input.desiredNumber);
  const [row] = await db
    .insert(members)
    .values({
      codeLookup: codeLookup(code),
      codeHash: await hashCode(code),
      name,
      studentId: input.studentId?.trim() || null,
      email: input.email?.trim() || null,
      role: input.role,
    })
    .returning({ id: members.id });

  revalidatePath('/admin/members');
  return { id: row.id, code };
}

/** Issue a fresh code for a member; the old one is instantly invalid. */
export async function regenerateCode(memberId: string): Promise<{ code: string }> {
  await requireAdmin();
  const code = await allocateCode();
  await db
    .update(members)
    .set({ codeLookup: codeLookup(code), codeHash: await hashCode(code) })
    .where(eq(members.id, memberId));
  revalidatePath('/admin/members');
  return { code };
}

/** Soft-disable (or re-enable) a member; preserves their registration history. */
export async function setMemberDisabled(memberId: string, disabled: boolean): Promise<void> {
  await requireAdmin();
  await db.update(members).set({ disabled }).where(eq(members.id, memberId));
  revalidatePath('/admin/members');
}
