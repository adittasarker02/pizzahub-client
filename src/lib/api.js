'use client';
import { authClient } from './auth-client';

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status, fields) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

// ---- JWT cache: Better Auth issues a 15 min token, we refresh it a minute before it expires ----
let cached = null;
const decodeExp = (jwt) => {
  try {
    return JSON.parse(atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).exp * 1000;
  } catch {
    return Date.now() + 60_000;
  }
};

export async function getToken(force = false) {
  if (!force && cached && cached.exp - 60_000 > Date.now()) return cached.token;
  const { data, error } = await authClient.token();
  if (error || !data?.token) {
    cached = null;
    return null;
  }
  cached = { token: data.token, exp: decodeExp(data.token) };
  return cached.token;
}
export const clearToken = () => {
  cached = null;
};

function buildQuery(params) {
  const q = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.set(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : '';
}

/**
 * Calls the Express API.  auth: true  -> attaches the Better Auth JWT as a Bearer token.
 * Throws ApiError with a human readable message on any failure.
 */
export async function api(path, { method = 'GET', body, query, auth = true, formData, signal } = {}) {
  const run = async (force) => {
    const headers = {};
    if (auth) {
      const token = await getToken(force);
      if (!token) throw new ApiError('Please sign in to continue', 401);
      headers.Authorization = `Bearer ${token}`;
    }
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    let res;
    try {
      res = await fetch(`${API_URL}${path}${buildQuery(query)}`, {
        method,
        headers,
        body: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
        signal,
      });
    } catch (err) {
      if (err?.name === 'AbortError') throw err;
      throw new ApiError('Cannot reach the server. Check your connection and try again.', 0);
    }
    return res;
  };

  let res = await run(false);
  if (res.status === 401 && auth) {
    clearToken();
    res = await run(true); // one retry with a fresh token
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data.message || `Request failed (${res.status})`, res.status, data.fields);
  }
  return data;
}

/** Uploads an image through the server (ImgBB key never reaches the browser). */
export async function uploadImage(file) {
  const compressed = await compressImage(file);
  const fd = new FormData();
  fd.append('image', compressed, compressed.name || 'image.jpg');
  const data = await api('/upload', { method: 'POST', formData: fd });
  return data.url;
}

// Shrinks big photos before upload (keeps requests small enough for serverless limits)
async function compressImage(file, maxSide = 1600, quality = 0.85) {
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.size < 600 * 1024) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', quality));
    return blob ? new File([blob], 'upload.jpg', { type: 'image/jpeg' }) : file;
  } catch {
    return file;
  }
}
