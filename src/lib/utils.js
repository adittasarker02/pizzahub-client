import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const money = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n) || 0);

export const formatDate = (d, opts = { year: 'numeric', month: 'short', day: 'numeric' }) =>
  d ? new Date(d).toLocaleDateString('en-US', opts) : '—';

export const formatDateTime = (d) =>
  d
    ? new Date(d).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : '—';

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || 'P';

/** Only allow same-site relative redirects */
export const safeRedirect = (url, fallback = '/dashboard') =>
  typeof url === 'string' && url.startsWith('/') && !url.startsWith('//') ? url : fallback;
