import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/session';
import { roleHome } from '@/lib/constants';

export const dynamic = 'force-dynamic';

// Users cannot open another role's dashboard by editing the URL
export default async function RoleLayout({ children }) {
  const session = await getServerSession();
  if (!session?.user) redirect('/signin');
  if (session.user.role !== 'customer') redirect(roleHome(session.user.role));
  return children;
}
