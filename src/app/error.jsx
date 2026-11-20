'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GlobalRouteError({ error, reset }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl">🔥</p>
      <h1 className="mt-4 text-3xl font-semibold">Something burned in the oven</h1>
      <p className="mt-3 max-w-md text-muted-foreground">{error?.message && error.message.length < 140 ? error.message : 'An unexpected error occurred. Please try again.'}</p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline"><Link href="/">Go home</Link></Button>
      </div>
    </div>
  );
}
