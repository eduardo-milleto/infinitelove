import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { auth } from './auth.js';
import { env, isProd } from './env.js';
import { momentsRoute } from './routes/moments.js';
import { photosRoute } from './routes/photos.js';
import { ensurePhotosRoot } from './lib/storage.js';

const app = new Hono();

app.use('*', logger());
app.use('*', secureHeaders());
app.use(
  '*',
  cors({
    origin: env.WEB_URL,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.get('/health', (c) => c.json({ ok: true, env: env.NODE_ENV }));

app.on(['GET', 'POST'], '/api/auth/*', (c) => auth.handler(c.req.raw));

app.route('/api/moments', momentsRoute);
app.route('/api', photosRoute);

app.onError((err, c) => {
  console.error('[api error]', err);
  return c.json({ error: isProd ? 'internal error' : String(err) }, 500);
});

await ensurePhotosRoot();

serve(
  { fetch: app.fetch, port: env.PORT, hostname: '0.0.0.0' },
  (info) => {
    console.log(`🌱 api listening on http://localhost:${info.port} (env=${env.NODE_ENV})`);
  },
);
