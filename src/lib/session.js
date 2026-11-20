import 'server-only';
import { headers } from 'next/headers';
import { auth } from './auth';

/** Server-side session (reads the httpOnly cookie) - used by layouts for role checks. */
export async function getServerSession() {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch {
    return null;
  }
}
