'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { clearToken } from '@/lib/api';

export function SignOutButton() {
  const router = useRouter();
  return (
    <Button className="mt-6" variant="outline" onClick={async () => { await authClient.signOut(); clearToken(); router.push('/'); router.refresh(); }}>
      Sign out
    </Button>
  );
}
