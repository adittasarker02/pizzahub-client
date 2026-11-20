'use client';
import Link from 'next/link';
import { CheckCircle2, Clock, ShoppingBag, XCircle } from 'lucide-react';
import { DonutCard, PageHeader, StatCard } from '@/components/dashboard/widgets';
import { ErrorState } from '@/components/common/states';
import { Button } from '@/components/ui/button';
import { useApi } from '@/hooks/use-api';

export default function CustomerOverview() {
  const { data: s, loading, error, refetch } = useApi('/customer/stats');
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  return (
    <>
      <PageHeader title="My overview" description="Everything you've ordered through PizzaHub.">
        <Button asChild><Link href="/menu">Order something tasty</Link></Button>
      </PageHeader>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total orders" value={s?.total} icon={ShoppingBag} loading={loading} />
        <StatCard label="Pending" value={s?.pending} icon={Clock} tone="orange" loading={loading} />
        <StatCard label="Accepted" value={s?.accepted} icon={CheckCircle2} tone="green" loading={loading} />
        <StatCard label="Rejected" value={s?.rejected} icon={XCircle} tone="red" loading={loading} />
      </div>
      <div className="mt-6 max-w-xl"><DonutCard title="Orders by status" data={s?.charts.ordersByStatus} loading={loading} /></div>
    </>
  );
}
