import type { MomentCreateInput, MomentDto, MomentUpdateInput, PhotoDto } from '@infinitelove/shared';
import { API_URL } from './env';

async function request<T>(
  path: string,
  init: RequestInit = {},
  opts: { json?: boolean } = { json: true },
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...init,
    headers: {
      ...(opts.json ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = typeof data?.error === 'string' ? data.error : `request failed (${res.status})`;
    const err = new Error(msg) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return data as T;
}

export const api = {
  listMoments: () => request<MomentDto[]>('/api/moments'),
  getMoment: (id: string) => request<MomentDto>(`/api/moments/${id}`),
  createMoment: (body: MomentCreateInput) =>
    request<MomentDto>('/api/moments', { method: 'POST', body: JSON.stringify(body) }),
  updateMoment: (id: string, body: MomentUpdateInput) =>
    request<MomentDto>(`/api/moments/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteMoment: (id: string) =>
    request<void>(`/api/moments/${id}`, { method: 'DELETE' }),
  uploadPhotos: async (momentId: string, files: File[]) => {
    const form = new FormData();
    for (const f of files) form.append('files', f);
    return request<PhotoDto[]>(
      `/api/moments/${momentId}/photos`,
      { method: 'POST', body: form },
      { json: false },
    );
  },
  deletePhoto: (id: string) =>
    request<void>(`/api/photos/${id}`, { method: 'DELETE' }),
  photoUrl: (id: string) => `${API_URL}/api/photos/${id}/file`,
};
