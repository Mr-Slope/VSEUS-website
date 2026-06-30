import { eq } from 'drizzle-orm';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/db';
import { members } from '@/db/schema';
import { codeLookup, isValidCodeFormat, normalizeCode, verifyCode } from '@/lib/codes';
import { clearAttempts, isLockedOut, recordFailure } from '@/lib/rateLimit';

function clientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return request.headers.get('x-real-ip')?.trim() ?? 'unknown';
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/login' },
  trustHost: true,
  providers: [
    Credentials({
      // Single field: the membership code (e.g. ECON-1234).
      credentials: { code: { label: 'Membership code', type: 'text' } },
      authorize: async (credentials, request) => {
        const code = normalizeCode(String(credentials?.code ?? ''));
        if (!isValidCodeFormat(code)) return null;

        const lookup = codeLookup(code);
        const ipKey = `ip:${clientIp(request)}`;
        const codeKey = `code:${lookup}`;

        // Throttle: never reveal which key tripped — fail generically.
        if (await isLockedOut([ipKey, codeKey])) return null;

        const [member] = await db
          .select()
          .from(members)
          .where(eq(members.codeLookup, lookup))
          .limit(1);

        if (!member || member.disabled || !(await verifyCode(code, member.codeHash))) {
          await recordFailure([ipKey, codeKey]);
          return null;
        }

        await clearAttempts([ipKey, codeKey]);
        return {
          id: member.id,
          name: member.name,
          email: member.email ?? undefined,
          role: member.role,
          studentId: member.studentId ?? '',
          ticketEmail: member.ticketEmail ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.studentId = user.studentId;
        token.ticketEmail = user.ticketEmail;
      }
      // Allow client `useSession().update({ ticketEmail })` to refresh the token.
      if (trigger === 'update' && session && typeof session.ticketEmail === 'string') {
        token.ticketEmail = session.ticketEmail;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as typeof session.user.role;
        session.user.studentId = token.studentId as string;
        session.user.ticketEmail = token.ticketEmail as string | undefined;
      }
      return session;
    },
  },
});
