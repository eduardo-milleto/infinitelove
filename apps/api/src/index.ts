import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { auth } from './auth.js';
import { env, isProd } from './env.js';
import { momentsRoute } from './routes/moments.js';
import { photosRoute } from './routes/photos.js';
import { tracksRoute } from './routes/tracks.js';
import { ensurePhotosRoot } from './lib/storage.js';

process.on('uncaughtException', (err) => {
  console.error('[fatal] uncaughtException:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('[fatal] unhandledRejection:', reason);
  process.exit(1);
});

console.log('[boot] node version:', process.version);
console.log('[boot] NODE_ENV:', env.NODE_ENV, 'PORT:', env.PORT);
console.log('[boot] WEB_URL:', env.WEB_URL);
console.log('[boot] PHOTOS_DIR:', env.PHOTOS_DIR);

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
app.get('/', (c) => c.json({ name: 'infinitelove api', ok: true }));

app.on(['GET', 'POST'], '/api/auth/*', (c) => auth.handler(c.req.raw));

app.route('/api/moments', momentsRoute);
app.route('/api/tracks', tracksRoute);
app.route('/api', photosRoute);

app.onError((err, c) => {
  console.error('[api error]', err);
  return c.json({ error: isProd ? 'internal error' : String(err) }, 500);
});

try {
  console.log('[boot] ensuring photos dir…');
  await ensurePhotosRoot();
  console.log('[boot] photos dir ok');
} catch (err) {
  console.error('[boot] failed to ensure photos dir:', err);
  process.exit(1);
}

serve(
  { fetch: app.fetch, port: env.PORT, hostname: '0.0.0.0' },
  (info) => {
    console.log(`🌱 api listening on http://0.0.0.0:${info.port} (env=${env.NODE_ENV})`);
  },
);
