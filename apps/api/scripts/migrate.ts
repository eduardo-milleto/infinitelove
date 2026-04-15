import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from '../src/db/client.js';

await migrate(db, { migrationsFolder: './drizzle' });
console.log('✅ migrations applied');
process.exit(0);
