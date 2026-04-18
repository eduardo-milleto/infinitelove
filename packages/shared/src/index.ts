import { z } from 'zod';

export const RELATIONSHIP_START_ISO = '2025-04-18T00:00:00-03:00';

export const MomentCreateInput = z.object({
  title: z.string().trim().min(1).max(120),
  story: z.string().trim().min(1).max(10_000),
  memeCaption: z.string().trim().max(280).optional().nullable(),
  happenedAt: z.string().datetime({ offset: true }),
});
export type MomentCreateInput = z.infer<typeof MomentCreateInput>;

export const MomentUpdateInput = MomentCreateInput.partial();
export type MomentUpdateInput = z.infer<typeof MomentUpdateInput>;

export const PhotoDto = z.object({
  id: z.string().uuid(),
  momentId: z.string().uuid(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  mime: z.string(),
  position: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
});
export type PhotoDto = z.infer<typeof PhotoDto>;

export const MomentDto = z.object({
  id: z.string().uuid(),
  title: z.string(),
  story: z.string(),
  memeCaption: z.string().nullable(),
  happenedAt: z.string().datetime(),
  createdBy: z.string(),
  createdByName: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  photos: z.array(PhotoDto),
});
export type MomentDto = z.infer<typeof MomentDto>;

export const ALLOWED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export const TrackCreateInput = z.object({
  spotifyTrackId: z.string().trim().min(10).max(64),
  title: z.string().trim().min(1).max(200),
  artist: z.string().trim().min(1).max(200),
  mood: z.string().trim().max(40).optional().nullable(),
});
export type TrackCreateInput = z.infer<typeof TrackCreateInput>;

export const TrackUpdateInput = TrackCreateInput.partial().extend({
  position: z.number().int().nonnegative().optional(),
});
export type TrackUpdateInput = z.infer<typeof TrackUpdateInput>;

export const TrackDto = z.object({
  id: z.string().uuid(),
  spotifyTrackId: z.string(),
  title: z.string(),
  artist: z.string(),
  mood: z.string().nullable(),
  position: z.number().int().nonnegative(),
  createdBy: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type TrackDto = z.infer<typeof TrackDto>;
