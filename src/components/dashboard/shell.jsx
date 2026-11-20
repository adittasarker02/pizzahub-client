'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  CreditCard, Crown, LayoutDashboard, ListOrdered, LogOut, Menu, PackageSearch, Pizza, PlusCircle, Receipt, ShoppingBag, UserCog, Users, UtensilsCrossed, X, Home,
} from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from '@/components/common/logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { UserAvatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { clearToken } from '@/lib/api';
import { cn } from '@/lib/utils';

const NAV = {
  vendor: [
    { href: '/dashboard/vendor', label: 'Overview', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/vendor/items', label: 'My Menu Items', icon: Pizza },
    { href: '/dashboard/vendor/items/new', label: 'Add Menu Item', icon: PlusCircle },
    { href: '/dashboard/vendor/orders', label: 'Customer Orders', icon: ListOrdered },
    { href: '/dashboard/vendor/subscription', label: 'Subscription', icon: Crown },
    { href: '/dashboard/profile', label: 'Profile Settings', icon: UserCog },
  ],
  customer: [
    { href: '/dashboard/customer', label: 'Overview', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/customer/orders', label: 'My Orders', icon: ShoppingBag },
    { href: '/dashboard/profile', label: 'Profile Settings', icon: UserCog },
  ],
  admin: [
    { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/admin/users', label: 'Manage Users', icon: Users },
    { href: '/dashboard/admin/items', label: 'Manage Menu Items', icon: UtensilsCrossed },
    { href: '/dashboard/admin/transactions', label: 'Transactions', icon: Receipt },
    { href: '/dashboard/profile', label: 'Profile Settings', icon: UserCog },
  ],
};

export function DashboardShell({ user, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const links = NAV[user.role] || [];
  const isActive = (l) => {
    if (l.exact) return pathname === l.href;
    // "Add Menu Item" must not also highlight "My Menu Items"
    if (l.href === '/dashboard/vendor/items') return pathname === l.href || /^\/dashboard\/vendor\/items\/(?!new)/.test(pathname);
    return pathname === l.href || pathname.startsWith(l.href + '/');
  };

  async function logout() {
    await authClient.signOut();
    clearToken();
    toast.success('Signed out');
    router.push('/');
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-[72px] shrink-0 items-center border-b-2 border-border px-5"><Logo /></div>
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card p-3">
          <UserAvatar name={user.name} src={user.image} className="size-11" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <Badge className="mt-0.5">{user.role}</Badge>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4" aria-label="Dashboard">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            aria-current={isActive(l) ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground/75 transition-colors hover:bg-secondary hover:text-foreground',
              isActive(l) && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
            )}
          >
            <l.icon className="size-[18px]" /> {l.label}
          </Link>
        ))}
      </nav>
      <div className="space-y-1 border-t-2 border-border p-3">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground/75 hover:bg-secondary"><Home className="size-[18px]" /> Back to site</Link>
        <Link href="/menu" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground/75 hover:bg-secondary"><PackageSearch className="size-[18px]" /> Browse menu</Link>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10"><LogOut className="size-[18px]" /> Logout</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r-2 border-border bg-background lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-background shadow-2xl">
            <button className="absolute right-3 top-5 rounded-full p-1.5 hover:bg-secondary" onClick={() => setOpen(false)} aria-label="Close menu"><X className="size-5" /></button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between gap-3 border-b-2 border-border bg-background/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></Button>
            <p className="hidden font-display text-lg font-semibold capitalize sm:block">{user.role} dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/dashboard/profile" className="flex items-center gap-2 rounded-full border-2 border-border bg-card py-1 pl-1 pr-3 hover:border-ink/60">
              <UserAvatar name={user.name} src={user.image} className="size-8" />
              <span className="hidden max-w-[130px] truncate text-sm font-semibold sm:block">{user.name}</span>
            </Link>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
