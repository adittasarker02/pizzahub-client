'use client';
import Link from 'next/link';
import { Clock, CheckCircle2, Crown, Pizza, UtensilsCrossed } from 'lucide-react';
import { BarCard, DonutCard, PageHeader, StatCard } from '@/components/dashboard/widgets';
import { ErrorState } from '@/components/common/states';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useApi } from '@/hooks/use-api';
import { categoryName } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

export default function VendorOverview() {
  const { data: s, loading, error, refetch } = useApi('/vendor/stats');
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  const premium = s?.plan === 'premium';
  return (
    <>
      <PageHeader title="Vendor overview" description="A quick look at your restaurant's menu, orders and plan.">
        <Button asChild><Link href="/dashboard/vendor/items/new">Add menu item</Link></Button>
      </PageHeader>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total menu items" value={s?.totalItems} icon={Pizza} loading={loading} />
        <StatCard label="Active items" value={s?.activeItems} icon={UtensilsCrossed} tone="green" loading={loading} hint="Approved & visible" />
        <StatCard label="Pending orders" value={s?.pendingOrders} icon={Clock} tone="orange" loading={loading} />
        <StatCard label="Accepted orders" value={s?.acceptedOrders} icon={CheckCircle2} tone="green" loading={loading} />
        <StatCard label="Current plan" value={premium ? 'Premium' : 'Free'} icon={Crown} tone={premium ? 'orange' : 'brown'} loading={loading}
          hint={premium ? `Renews ${formatDate(s.subscriptionExpiresAt)}` : `${s?.usedSlots ?? 0} of ${s?.itemLimit ?? 3} slots used`} />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <DonutCard title="Orders by status" data={s?.charts.ordersByStatus} loading={loading} />
        <BarCard title="Menu items by category" data={s?.charts.itemsByCategory.map((c) => ({ ...c, name: categoryName(c.name).split(' ')[0] }))} loading={loading} color="#f28c28" />
      </div>
      {!loading && !premium && (
        <Card className="mt-6 flex flex-col items-start justify-between gap-4 border-ink bg-accent/20 p-6 sm:flex-row sm:items-center">
          <div><h3 className="font-display text-xl font-semibold">Grow without limits</h3><p className="text-sm text-muted-foreground">Premium unlocks unlimited items, a Premium badge and featured homepage placement.</p></div>
          <Button asChild variant="accent"><Link href="/dashboard/vendor/subscription">Upgrade to Premium</Link></Button>
        </Card>
      )}
    </>
  );
}
