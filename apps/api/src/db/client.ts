import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { env, isProd } from '../env.js';
import * as schema from './schema.js';

function shouldUseSSL(url: string): boolean {
  if (!isProd) return false;
  // Railway's internal postgres network doesn't speak SSL
  if (url.includes('.railway.internal')) return false;
  if (url.includes('localhost') || url.includes('127.0.0.1')) return false;
  try {
    const parsed = new URL(url);
    const sslmode = parsed.searchParams.get('sslmode');
    if (sslmode === 'disable') return false;
  } catch {
    // invalid URL — fall through
  }
  return true;
}

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  ssl: shouldUseSSL(env.DATABASE_URL) ? { rejectUnauthorized: false } : false,
  max: 10,
});

export const db = drizzle(pool, { schema });
export type DB = typeof db;
export { schema };
