import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db, schema } from './db/client.js';
import { env, isProd } from './env.js';

// Gera variantes com e sem "www." de uma URL, pra evitar que um redirect
// www↔apex do DNS/Vercel quebre o CORS do Better Auth.
function originVariants(url: string): string[] {
  try {
    const u = new URL(url);
    const host = u.hostname;
    const other = host.startsWith('www.') ? host.slice(4) : `www.${host}`;
    return [url, `${u.protocol}//${other}${u.port ? ':' + u.port : ''}`];
  } catch {
    return [url];
  }
}

const trustedOrigins = Array.from(new Set([
  ...originVariants(env.WEB_URL),
  ...originVariants(env.BETTER_AUTH_URL),
  'https://eduebellaforever.com',
  'https://www.eduebellaforever.com',
]));

console.log('[auth] trustedOrigins:', trustedOrigins);

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
  // Aceita WEB_URL e BETTER_AUTH_URL + variantes www/apex pra não quebrar
  // quando o DNS redireciona entre www. e domínio nu.
  trustedOrigins,
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
