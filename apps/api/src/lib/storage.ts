import { randomUUID } from 'node:crypto';
import { mkdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';
import { ALLOWED_IMAGE_MIME, MAX_UPLOAD_BYTES } from '@infinitelove/shared';
import { env } from '../env.js';

export interface StoredPhoto {
  relativePath: string;
  width: number;
  height: number;
  mime: string;
  bytes: number;
}

const ALLOWED_SET = new Set<string>(ALLOWED_IMAGE_MIME);

async function ensureDir(dir: string) {
  await mkdir(dir, { recursive: true });
}

function photosRoot() {
  return path.resolve(env.PHOTOS_DIR);
}

export async function savePhoto(buffer: Buffer): Promise<StoredPhoto> {
  if (buffer.byteLength > MAX_UPLOAD_BYTES) {
    throw new HttpError(413, 'file too large');
  }

  const detected = await fileTypeFromBuffer(buffer);
  if (!detected || !ALLOWED_SET.has(detected.mime)) {
    throw new HttpError(415, 'unsupported image type');
  }

  // Re-encode to webp (strips EXIF, bounds dimensions, uniform format)
  const img = sharp(buffer, { failOn: 'error' }).rotate();
  const meta = await img.metadata();
  if (!meta.width || !meta.height) {
    throw new HttpError(400, 'invalid image');
  }

  const resized = await img
    .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer({ resolveWithObject: true });

  const id = randomUUID();
  const yearMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const relativePath = path.join(yearMonth, `${id}.webp`);
  const absPath = path.join(photosRoot(), relativePath);
  await ensureDir(path.dirname(absPath));
  await writeFile(absPath, resized.data);

  return {
    relativePath,
    width: resized.info.width,
    height: resized.info.height,
    mime: 'image/webp',
    bytes: resized.info.size,
  };
}

export async function readPhoto(relativePath: string): Promise<Buffer> {
  const safe = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
  const absPath = path.join(photosRoot(), safe);
  if (!absPath.startsWith(photosRoot())) {
    throw new HttpError(400, 'invalid path');
  }
  const { readFile } = await import('node:fs/promises');
  return readFile(absPath);
}

export async function deletePhotoFile(relativePath: string): Promise<void> {
  const safe = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
  const absPath = path.join(photosRoot(), safe);
  if (!absPath.startsWith(photosRoot())) return;
  try {
    await rm(absPath, { force: true });
  } catch {
    // swallow — file may already be gone
  }
}

export async function ensurePhotosRoot() {
  await ensureDir(photosRoot());
  await stat(photosRoot());
}

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
