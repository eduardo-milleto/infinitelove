import type { MiddlewareHandler } from 'hono';
import { auth, type Session } from '../auth.js';

declare module 'hono' {
  interface ContextVariableMap {
    session: Session['session'];
    user: Session['user'];
  }
}

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const sess = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!sess?.user || !sess.session) {
    return c.json({ error: 'unauthorized' }, 401);
  }
  c.set('session', sess.session);
  c.set('user', sess.user);
  await next();
};
