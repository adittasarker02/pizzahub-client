import Link from 'next/link';
import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <div className="gingham flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Logo />
      <p className="mt-10 font-display text-[9rem] font-bold leading-none text-primary sm:text-[12rem]">4<span className="inline-block animate-[spin_12s_linear_infinite]">🍕</span>4</p>
      <h1 className="mt-2 text-3xl font-semibold">This slice is missing</h1>
      <p className="mt-3 max-w-md text-muted-foreground">The page you're looking for doesn't exist or has moved. Let's get you back to the good stuff.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg"><Link href="/">Back home</Link></Button>
        <Button asChild size="lg" variant="outline"><Link href="/menu">Browse menu</Link></Button>
      </div>
    </div>
  );
}
