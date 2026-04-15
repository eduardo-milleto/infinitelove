import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db, schema } from './db/client.js';
import { env, isProd } from './env.js';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  // Vercel faz proxy de /api/* → Railway, então requests chegam same-origin.
  // Aceita tanto o domínio da Vercel quanto o próprio api (health-check, curl, etc).
  trustedOrigins: [env.WEB_URL, env.BETTER_AUTH_URL],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    disableSignUp: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
  advanced: {
    useSecureCookies: isProd,
    defaultCookieAttributes: {
      sameSite: 'lax',
      secure: isProd,
      httpOnly: true,
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 30,
  },
});

export type Session = typeof auth.$Infer.Session;
