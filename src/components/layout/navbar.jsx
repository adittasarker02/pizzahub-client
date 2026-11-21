'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, LogOut, Menu, UserCog, X } from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from '@/components/common/logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient, useSession } from '@/lib/auth-client';
import { clearToken } from '@/lib/api';
import { roleHome } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Browse Menu' },
    ...(user ? [{ href: roleHome(user.role), label: 'Dashboard' }] : []),
  ];
  const active = (href) => (href === '/' ? pathname === '/' : href.startsWith('/dashboard') ? pathname.startsWith('/dashboard') : pathname.startsWith(href));

  async function logout() {
    await authClient.signOut();
    clearToken();
    toast.success('Signed out. See you soon!');
    router.push('/');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b-2 border-border bg-background/90 backdrop-blur-md">
      <div className="container-page flex h-[72px] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold text-foreground/75 transition-colors hover:bg-secondary hover:text-foreground',
                active(l.href) && 'bg-secondary text-foreground',
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isPending ? (
            <div className="size-10 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border-2 border-border bg-card py-1 pl-1 pr-3 transition hover:border-ink/60" aria-label="Open profile menu">
                  <UserAvatar name={user.name} src={user.image} className="size-8" />
                  <span className="hidden max-w-[110px] truncate text-sm font-semibold sm:block">{user.name?.split(' ')[0]}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3">
                    <UserAvatar name={user.name} src={user.image} className="size-11" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      <Badge variant="default" className="mt-1">{user.role}</Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => router.push(roleHome(user.role))}>
                  <LayoutDashboard /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push('/dashboard/profile')}>
                  <UserCog /> Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={logout} className="text-destructive [&_svg]:text-destructive">
                  <LogOut /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm"><Link href="/signin">Sign In</Link></Button>
              <Button asChild size="sm"><Link href="/signup">Sign Up</Link></Button>
            </div>
          )}
          <Button variant="outline" size="icon" className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t-2 border-border bg-background md:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn('rounded-xl px-4 py-3 font-semibold hover:bg-secondary', active(l.href) && 'bg-secondary')}
              >
                {l.label}
              </Link>
            ))}
            {!user && !isPending && (
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Button asChild variant="outline" onClick={() => setOpen(false)}><Link href="/signin">Sign In</Link></Button>
                <Button asChild onClick={() => setOpen(false)}><Link href="/signup">Sign Up</Link></Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
