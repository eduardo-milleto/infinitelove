import { MomentCreateInput, MomentUpdateInput, type MomentDto } from '@infinitelove/shared';
import { asc, desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { db, schema } from '../db/client.js';
import { requireAuth } from '../middleware/require-auth.js';
import { deletePhotoFile } from '../lib/storage.js';

export const momentsRoute = new Hono().use('*', requireAuth);

function serialize(
  m: typeof schema.moment.$inferSelect & {
    photos: (typeof schema.photo.$inferSelect)[];
    author: typeof schema.user.$inferSelect | null;
  },
): MomentDto {
  return {
    id: m.id,
    title: m.title,
    story: m.story,
    memeCaption: m.memeCaption ?? null,
    happenedAt: m.happenedAt.toISOString(),
    createdBy: m.createdBy,
    createdByName: m.author?.name ?? null,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
    photos: m.photos
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((p) => ({
        id: p.id,
        momentId: p.momentId,
        width: p.width,
        height: p.height,
        mime: p.mime,
        position: p.position,
        createdAt: p.createdAt.toISOString(),
      })),
  };
}

momentsRoute.get('/', async (c) => {
  const rows = await db.query.moment.findMany({
    orderBy: [desc(schema.moment.happenedAt)],
    with: { photos: { orderBy: asc(schema.photo.position) }, author: true },
  });
  return c.json(rows.map(serialize));
});

momentsRoute.get('/:id', async (c) => {
  const id = c.req.param('id');
  const row = await db.query.moment.findFirst({
    where: eq(schema.moment.id, id),
    with: { photos: { orderBy: asc(schema.photo.position) }, author: true },
  });
  if (!row) return c.json({ error: 'not found' }, 404);
  return c.json(serialize(row));
});

momentsRoute.post('/', async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = MomentCreateInput.safeParse(body);
  if (!parsed.success) return c.json({ error: 'invalid', issues: parsed.error.issues }, 400);
  const user = c.get('user');
  const inserted = await db
    .insert(schema.moment)
    .values({
      title: parsed.data.title,
      story: parsed.data.story,
      memeCaption: parsed.data.memeCaption ?? null,
      happenedAt: new Date(parsed.data.happenedAt),
      createdBy: user.id,
    })
    .returning();
  const created = inserted[0];
  if (!created) return c.json({ error: 'failed to create' }, 500);
  const full = await db.query.moment.findFirst({
    where: eq(schema.moment.id, created.id),
    with: { photos: true, author: true },
  });
  return c.json(serialize(full!), 201);
});

momentsRoute.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => null);
  const parsed = MomentUpdateInput.safeParse(body);
  if (!parsed.success) return c.json({ error: 'invalid', issues: parsed.error.issues }, 400);
  const updates: Partial<typeof schema.moment.$inferInsert> = { updatedAt: new Date() };
  if (parsed.data.title !== undefined) updates.title = parsed.data.title;
  if (parsed.data.story !== undefined) updates.story = parsed.data.story;
  if (parsed.data.memeCaption !== undefined) updates.memeCaption = parsed.data.memeCaption ?? null;
  if (parsed.data.happenedAt !== undefined) updates.happenedAt = new Date(parsed.data.happenedAt);
  const [updated] = await db
    .update(schema.moment)
    .set(updates)
    .where(eq(schema.moment.id, id))
    .returning();
  if (!updated) return c.json({ error: 'not found' }, 404);
  const full = await db.query.moment.findFirst({
    where: eq(schema.moment.id, id),
    with: { photos: true, author: true },
  });
  return c.json(serialize(full!));
});

momentsRoute.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const photos = await db.query.photo.findMany({ where: eq(schema.photo.momentId, id) });
  const [deleted] = await db.delete(schema.moment).where(eq(schema.moment.id, id)).returning();
  if (!deleted) return c.json({ error: 'not found' }, 404);
  await Promise.all(photos.map((p) => deletePhotoFile(p.filePath)));
  return c.body(null, 204);
});
