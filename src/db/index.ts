import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

// Note: don't throw at module load — `next build` evaluates route modules
// (and their imports) without a DATABASE_URL. The connection is only used at
// request time, where the env var is present; a missing URL surfaces as a
// clear Neon connection error when a query actually runs.
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, { schema });

export { schema };
