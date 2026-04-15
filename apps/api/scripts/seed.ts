import { auth } from '../src/auth.js';
import { db, schema } from '../src/db/client.js';
import { env } from '../src/env.js';
import { eq } from 'drizzle-orm';

const password = env.SEED_PASSWORD;
if (!password) {
  console.error('❌ set SEED_PASSWORD in env to seed users');
  process.exit(1);
}

const users = [
  { name: 'Eduardo', email: env.SEED_EDUARDO_EMAIL },
  { name: 'Isabella', email: env.SEED_ISABELLA_EMAIL },
];

for (const u of users) {
  const existing = await db.query.user.findFirst({ where: eq(schema.user.email, u.email) });
  if (existing) {
    console.log(`↷ skipping ${u.email} (already exists)`);
    continue;
  }
  await auth.api.signUpEmail({ body: { email: u.email, password, name: u.name } });
  console.log(`✅ created ${u.email}`);
}

console.log('\n🌱 seed complete. Login with:');
for (const u of users) console.log(`   - ${u.email} / ${password}`);
console.log('\n⚠️  Change these passwords after first login.');
process.exit(0);
