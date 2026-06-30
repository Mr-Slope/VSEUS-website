import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from './index';
import { events, members } from './schema';
import { codeLookup, formatCode, hashCode } from '../lib/codes';
import { MOCK_EVENTS } from '../lib/mockData';
import type { UserRole } from '../types/user';

interface SeedMember {
  code: string;
  name: string;
  studentId: string;
  email: string | null;
  role: UserRole;
}

// Initial accounts. Admins get the lowest numbers; members replace the old
// hardcoded APPROVED_STUDENT_IDS list. Codes are printed once on seed.
const SEED_MEMBERS: SeedMember[] = [
  { code: formatCode(1), name: 'VSEUS Admin', studentId: '000000000', email: 'admin@vseus.ca', role: 'admin' },
  { code: formatCode(2), name: 'Yash Dhaundiyal', studentId: '000000001', email: 'president@vseus.ca', role: 'admin' },
  { code: formatCode(1001), name: 'Member One', studentId: '218945632', email: null, role: 'member' },
  { code: formatCode(1002), name: 'Member Two', studentId: '219034571', email: null, role: 'member' },
  { code: formatCode(1003), name: 'Member Three', studentId: '217856123', email: null, role: 'member' },
  { code: formatCode(1004), name: 'Member Four', studentId: '220112045', email: null, role: 'member' },
  { code: formatCode(1005), name: 'Member Five', studentId: '216789034', email: null, role: 'member' },
];

async function seed() {
  console.log('Seeding members…');
  for (const m of SEED_MEMBERS) {
    await db
      .insert(members)
      .values({
        codeLookup: codeLookup(m.code),
        codeHash: await hashCode(m.code),
        name: m.name,
        studentId: m.studentId,
        email: m.email,
        role: m.role,
      })
      .onConflictDoNothing({ target: members.studentId });
  }

  console.log('Seeding events…');
  for (const e of MOCK_EVENTS) {
    await db.insert(events).values({
      title: e.title,
      description: e.description,
      date: e.date,
      time: e.time,
      location: e.location,
      capacity: e.capacity,
      registeredCount: e.registeredCount,
      isPaid: e.isPaid,
      price: e.price,
      imageUrl: e.imageUrl,
      posterUrl: e.posterUrl,
      category: e.category,
      questions: e.questions,
    });
  }

  console.log('\n=== Seed complete ===');
  console.log('Login codes (store these securely — they are not retrievable later):\n');
  for (const m of SEED_MEMBERS) {
    console.log(`  ${m.code}  ${m.role.toUpperCase().padEnd(6)}  ${m.name}`);
  }
  console.log('');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
