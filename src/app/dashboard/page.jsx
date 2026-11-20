import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/session';
import { roleHome } from '@/lib/constants';

export const dynamic = 'force-dynamic';

// /dashboard -> the dashboard that belongs to the signed-in role
export default async function DashboardIndex() {
  const session = await getServerSession();
  if (!session?.user) redirect('/signin');
  redirect(roleHome(session.user.role));
}
