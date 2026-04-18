import { TrackCreateInput, TrackUpdateInput, type TrackDto } from '@infinitelove/shared';
import { asc, eq, max } from 'drizzle-orm';
import { Hono } from 'hono';
import { db, schema } from '../db/client.js';
import { requireAuth } from '../middleware/require-auth.js';

export const tracksRoute = new Hono().use('*', requireAuth);

function serialize(t: typeof schema.track.$inferSelect): TrackDto {
  return {
    id: t.id,
    spotifyTrackId: t.spotifyTrackId,
    title: t.title,
    artist: t.artist,
    mood: t.mood ?? null,
    position: t.position,
    createdBy: t.createdBy,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  };
}

tracksRoute.get('/', async (c) => {
  const rows = await db.query.track.findMany({
    orderBy: [asc(schema.track.position), asc(schema.track.createdAt)],
  });
  return c.json(rows.map(serialize));
});

tracksRoute.post('/', async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = TrackCreateInput.safeParse(body);
  if (!parsed.success) return c.json({ error: 'invalid', issues: parsed.error.issues }, 400);
  const user = c.get('user');
  const [posRow] = await db.select({ value: max(schema.track.position) }).from(schema.track);
  const nextPos = (posRow?.value ?? -1) + 1;
  const [created] = await db
    .insert(schema.track)
    .values({
      spotifyTrackId: parsed.data.spotifyTrackId,
      title: parsed.data.title,
      artist: parsed.data.artist,
      mood: parsed.data.mood ?? null,
      position: nextPos,
      createdBy: user.id,
    })
    .returning();
  if (!created) return c.json({ error: 'failed to create' }, 500);
  return c.json(serialize(created), 201);
});

tracksRoute.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => null);
  const parsed = TrackUpdateInput.safeParse(body);
  if (!parsed.success) return c.json({ error: 'invalid', issues: parsed.error.issues }, 400);
  const updates: Partial<typeof schema.track.$inferInsert> = { updatedAt: new Date() };
  if (parsed.data.spotifyTrackId !== undefined) updates.spotifyTrackId = parsed.data.spotifyTrackId;
  if (parsed.data.title !== undefined) updates.title = parsed.data.title;
  if (parsed.data.artist !== undefined) updates.artist = parsed.data.artist;
  if (parsed.data.mood !== undefined) updates.mood = parsed.data.mood ?? null;
  if (parsed.data.position !== undefined) updates.position = parsed.data.position;
  const [updated] = await db.update(schema.track).set(updates).where(eq(schema.track.id, id)).returning();
  if (!updated) return c.json({ error: 'not found' }, 404);
  return c.json(serialize(updated));
});

tracksRoute.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const [deleted] = await db.delete(schema.track).where(eq(schema.track.id, id)).returning();
  if (!deleted) return c.json({ error: 'not found' }, 404);
  return c.body(null, 204);
});
