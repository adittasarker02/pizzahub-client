'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { formatDate, money } from '@/lib/utils';

// The redirect from Stripe is NOT trusted. We poll our own server, which only turns on Premium
// after the signed Stripe webhook arrived.
export function SuccessView() {
  const sessionId = useSearchParams().get('session_id');
  const [state, setState] = useState({ status: 'checking' });
  const tries = useRef(0);

  useEffect(() => {
    let stop = false;
    async function poll() {
      try {
        const d = await api('/payments/status', { query: { session_id: sessionId } });
        if (stop) return;
        if (d.plan === 'premium') return setState({ status: 'active', data: d });
        if (d.transaction && ['failed', 'expired'].includes(d.transaction.status)) return setState({ status: 'failed' });
      } catch (e) {
        if (!stop && tries.current > 2) return setState({ status: 'error', message: e.message });
      }
      if (++tries.current >= 20) return !stop && setState({ status: 'slow' });
      setTimeout(poll, 2000);
    }
    poll();
    return () => { stop = true; };
  }, [sessionId]);

  const { status, data } = state;
  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-lg rounded-3xl border-2 border-ink bg-card p-10 text-center shadow-[6px_6px_0_0_var(--ink)]">
        {status === 'checking' && (<>
          <Loader2 className="mx-auto size-14 animate-spin text-primary" />
          <h1 className="mt-6 font-display text-3xl font-semibold">Confirming your payment…</h1>
          <p className="mt-2 text-muted-foreground">Waiting for Stripe to confirm. This usually takes a few seconds.</p>
        </>)}
        {status === 'active' && (<>
          <CheckCircle2 className="mx-auto size-16 text-basil" />
          <h1 className="mt-5 font-display text-3xl font-semibold">Payment successful 🎉</h1>
          <p className="mt-2 text-muted-foreground">You are now a <b>Premium</b> vendor{data.transaction && <> · {money(data.transaction.amount)} paid</>}. Premium is active until {formatDate(data.expiresAt)}.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button asChild><Link href="/dashboard/vendor/items/new">Add menu items</Link></Button>
            <Button asChild variant="outline"><Link href="/dashboard/vendor/subscription">View subscription</Link></Button>
          </div>
        </>)}
        {status === 'slow' && (<>
          <h1 className="font-display text-3xl font-semibold">Payment received — activating</h1>
          <p className="mt-2 text-muted-foreground">Stripe hasn't confirmed yet. Premium will switch on automatically as soon as it does. You can safely leave this page.</p>
          <Button asChild className="mt-8"><Link href="/dashboard/vendor/subscription">Go to subscription</Link></Button>
        </>)}
        {(status === 'failed' || status === 'error') && (<>
          <h1 className="font-display text-3xl font-semibold">We couldn't confirm the payment</h1>
          <p className="mt-2 text-muted-foreground">{state.message || 'The payment did not complete. You have not been charged for Premium.'}</p>
          <Button asChild className="mt-8"><Link href="/dashboard/vendor/subscription">Try again</Link></Button>
        </>)}
      </div>
    </div>
  );
}
