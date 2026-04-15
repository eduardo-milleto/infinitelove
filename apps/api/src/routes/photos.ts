import { eq, max } from 'drizzle-orm';
import { Hono } from 'hono';
import { db, schema } from '../db/client.js';
import { requireAuth } from '../middleware/require-auth.js';
import { HttpError, deletePhotoFile, readPhoto, savePhoto } from '../lib/storage.js';

export const photosRoute = new Hono().use('*', requireAuth);

photosRoute.post('/moments/:id/photos', async (c) => {
  const momentId = c.req.param('id');
  const exists = await db.query.moment.findFirst({ where: eq(schema.moment.id, momentId) });
  if (!exists) return c.json({ error: 'moment not found' }, 404);

  const form = await c.req.formData().catch(() => null);
  if (!form) return c.json({ error: 'expected multipart/form-data' }, 400);

  const allEntries = form.getAll('files');
  // Filter to blob-like entries (not plain strings), cast to any to sidestep TS undici conflict
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const files = allEntries.filter((f) => typeof f !== 'string') as any[];
  if (files.length === 0) return c.json({ error: 'no files' }, 400);
  if (files.length > 20) return c.json({ error: 'too many files (max 20)' }, 400);

  const [posRow] = await db
    .select({ value: max(schema.photo.position) })
    .from(schema.photo)
    .where(eq(schema.photo.momentId, momentId));
  const startPos = posRow?.value ?? -1;

  const created: (typeof schema.photo.$inferSelect)[] = [];
  let pos = (startPos ?? -1) + 1;

  try {
    for (const file of files) {
      const buf = Buffer.from(await file.arrayBuffer());
      const stored = await savePhoto(buf);
      const rows = await db
        .insert(schema.photo)
        .values({
          momentId,
          filePath: stored.relativePath,
          width: stored.width,
          height: stored.height,
          mime: stored.mime,
          position: pos++,
        })
        .returning();
      const row = rows[0];
      if (row) created.push(row);
    }
  } catch (err) {
    if (err instanceof HttpError) return c.json({ error: err.message }, err.status as 400);
    throw err;
  }

  return c.json(
    created.map((p) => ({
      id: p.id,
      momentId: p.momentId,
      width: p.width,
      height: p.height,
      mime: p.mime,
      position: p.position,
      createdAt: p.createdAt.toISOString(),
    })),
    201,
  );
});

photosRoute.get('/photos/:id/file', async (c) => {
  const id = c.req.param('id');
  const row = await db.query.photo.findFirst({ where: eq(schema.photo.id, id) });
  if (!row) return c.json({ error: 'not found' }, 404);
  try {
    const buf = await readPhoto(row.filePath);
    return c.body(new Uint8Array(buf), 200, {
      'Content-Type': row.mime,
      'Cache-Control': 'private, max-age=31536000, immutable',
    });
  } catch {
    return c.json({ error: 'file missing' }, 404);
  }
});

photosRoute.delete('/photos/:id', async (c) => {
  const id = c.req.param('id');
  const rows = await db.delete(schema.photo).where(eq(schema.photo.id, id)).returning();
  const removed = rows[0];
  if (!removed) return c.json({ error: 'not found' }, 404);
  await deletePhotoFile(removed.filePath);
  return c.body(null, 204);
});
