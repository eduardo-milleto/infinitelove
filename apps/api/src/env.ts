import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  WEB_URL: z.string().url(),
  PHOTOS_DIR: z.string().min(1).default('./data/photos'),
  SEED_EDUARDO_EMAIL: z.string().email().default('eduardo@infinitelove.local'),
  SEED_ISABELLA_EMAIL: z.string().email().default('isabella@infinitelove.local'),
  SEED_PASSWORD: z.string().min(6).optional(),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === 'production';
