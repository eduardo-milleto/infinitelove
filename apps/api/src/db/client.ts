import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { env, isProd } from '../env.js';
import * as schema from './schema.js';

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  ssl: isProd ? { rejectUnauthorized: false } : undefined,
  max: 10,
});

export const db = drizzle(pool, { schema });
export type DB = typeof db;
export { schema };
