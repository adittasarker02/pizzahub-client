import { redirect } from 'next/navigation';
import { ShieldOff } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/shell';
import { getServerSession } from '@/lib/session';
import { SignOutButton } from '@/components/dashboard/sign-out-button';

export const metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }) {
  const session = await getServerSession();
  if (!session?.user) redirect('/signin');
  const user = session.user;

  if (user.isBlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-3xl border-2 border-destructive/40 bg-card p-10 text-center">
          <ShieldOff className="mx-auto size-12 text-destructive" />
          <h1 className="mt-4 font-display text-2xl font-semibold">Account blocked</h1>
          <p className="mt-2 text-muted-foreground">Your account has been blocked by an administrator, so protected features are unavailable. Please contact support.</p>
          <SignOutButton />
        </div>
      </div>
    );
  }

  const plain = { id: user.id, name: user.name, email: user.email, image: user.image || null, role: user.role };
  return <DashboardShell user={plain}>{children}</DashboardShell>;
}
