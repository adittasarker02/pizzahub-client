import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Payment Cancelled' };

export default function PaymentCancel() {
  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-lg rounded-3xl border-2 border-ink bg-card p-10 text-center shadow-[6px_6px_0_0_var(--ink)]">
        <XCircle className="mx-auto size-16 text-destructive" />
        <h1 className="mt-5 font-display text-3xl font-semibold">Payment cancelled</h1>
        <p className="mt-2 text-muted-foreground">No worries — you were not charged. You can upgrade to Premium whenever you're ready.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Button asChild><Link href="/dashboard/vendor/subscription">Back to subscription</Link></Button>
          <Button asChild variant="outline"><Link href="/dashboard">Go to dashboard</Link></Button>
        </div>
      </div>
    </div>
  );
}
