'use client';
import { useState } from 'react';
import { Check, Crown, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/dashboard/widgets';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';
import { ErrorState, PageLoader } from '@/components/common/states';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { cn, formatDate } from '@/lib/utils';
import { useApi } from '@/hooks/use-api';

const free = ['Up to 3 active menu items', 'Basic vendor dashboard', 'Order management'];
const premium = ['Unlimited active menu items', 'Premium vendor badge', 'Featured placement on the homepage', 'Everything in Free'];

export default function SubscriptionPage() {
  const { data, loading, error, refetch } = useApi('/payments/status');
  const [busy, setBusy] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  async function upgrade() {
    setBusy(true);
    try {
      const { url } = await api('/payments/checkout', { method: 'POST' });
      window.location.href = url; // Stripe Checkout
    } catch (e) { toast.error(e.message); setBusy(false); }
  }

  if (loading && !data) return <PageLoader label="Loading subscription…" />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  const isPremium = data.plan === 'premium';
  const price = (data.priceCents / 100).toFixed(2);

  return (
    <>
      <PageHeader title="Subscription" description="Choose the plan that fits your restaurant." />
      <div className="grid max-w-4xl gap-6 md:grid-cols-2">
        <Card className={cn('flex flex-col p-7', !isPremium && 'border-ink shadow-[5px_5px_0_0_var(--ink)]')}>
          <div className="flex items-center justify-between"><h2 className="font-display text-2xl font-semibold">Free</h2>{!isPremium && <Badge variant="success">Current plan</Badge>}</div>
          <p className="mt-3 font-display text-4xl font-bold">$0<span className="text-base font-medium text-muted-foreground"> / forever</span></p>
          <ul className="mt-6 flex-1 space-y-3 text-sm">{free.map((f) => <li key={f} className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-basil" />{f}</li>)}</ul>
        </Card>

        <Card className={cn('relative flex flex-col p-7', isPremium && 'border-ink shadow-[5px_5px_0_0_var(--ink)]')}>
          <span className="absolute -top-3 right-6 inline-flex rotate-3 items-center gap-1 rounded-full border-2 border-ink bg-accent px-3 py-1 text-xs font-bold uppercase text-ink"><Sparkles className="size-3" /> Best value</span>
          <div className="flex items-center justify-between"><h2 className="flex items-center gap-2 font-display text-2xl font-semibold"><Crown className="size-5 text-accent" /> Premium</h2>{isPremium && <Badge variant="success">Current plan</Badge>}</div>
          <p className="mt-3 font-display text-4xl font-bold">${price}<span className="text-base font-medium text-muted-foreground"> / month</span></p>
          <ul className="mt-6 flex-1 space-y-3 text-sm">{premium.map((f) => <li key={f} className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-basil" />{f}</li>)}</ul>
          {isPremium ? (
            <div className="mt-7 space-y-3 text-sm">
              <p className="text-muted-foreground">{data.cancelAtPeriodEnd ? <>Ends on <b>{formatDate(data.expiresAt)}</b> — it will not renew.</> : <>Active until <b>{formatDate(data.expiresAt)}</b> and renews automatically.</>}</p>
              {data.cancelAtPeriodEnd ? (
                <Button variant="outline" onClick={async () => { try { toast.success((await api('/payments/resume', { method: 'POST' })).message); refetch(); } catch (e) { toast.error(e.message); } }}>Resume renewal</Button>
              ) : <Button variant="outline" onClick={() => setCancelOpen(true)}>Cancel subscription</Button>}
            </div>
          ) : (
            <Button size="lg" className="mt-7 w-full" onClick={upgrade} loading={busy}>Upgrade to Premium</Button>
          )}
        </Card>
      </div>
      <p className="mt-6 max-w-4xl text-xs text-muted-foreground">Payments are processed securely by Stripe. Premium is activated only after Stripe confirms your payment — this can take a few seconds after checkout.</p>

      <ConfirmDialog open={cancelOpen} onOpenChange={setCancelOpen} title="Cancel Premium?" confirmLabel="Cancel at period end" destructive
        description="You keep Premium until the end of the paid period. After that you return to the Free plan and only your 3 oldest items stay active."
        onConfirm={async () => { try { toast.success((await api('/payments/cancel', { method: 'POST' })).message); refetch(); } catch (e) { toast.error(e.message); } }} />
    </>
  );
}
