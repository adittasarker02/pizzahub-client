'use client';
import { Clock, DollarSign, Receipt, ShieldCheck, Store, UtensilsCrossed, Users } from 'lucide-react';
import { BarCard, DonutCard, PageHeader, StatCard } from '@/components/dashboard/widgets';
import { ErrorState } from '@/components/common/states';
import { useApi } from '@/hooks/use-api';
import { money } from '@/lib/utils';

export default function AdminOverview() {
  const { data: s, loading, error, refetch } = useApi('/admin/stats');
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  return (
    <>
      <PageHeader title="Admin overview" description="Platform health at a glance." />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Registered users" value={s?.totalUsers} icon={Users} loading={loading} />
        <StatCard label="Vendors" value={s?.totalVendors} icon={Store} tone="orange" loading={loading} />
        <StatCard label="Customers" value={s?.totalCustomers} icon={ShieldCheck} tone="green" loading={loading} />
        <StatCard label="Total menu items" value={s?.totalMenuItems} icon={UtensilsCrossed} tone="brown" loading={loading} />
        <StatCard label="Pending menu items" value={s?.pendingMenuItems} icon={Clock} tone="orange" loading={loading} hint="Waiting for review" />
        <StatCard label="Transactions" value={s?.totalTransactions} icon={Receipt} loading={loading} />
        <StatCard label="Revenue (paid)" value={money(s?.totalRevenue)} icon={DollarSign} tone="green" loading={loading} />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <DonutCard title="Users by role" data={s?.charts.usersByRole} loading={loading} />
        <DonutCard title="Menu items by status" data={s?.charts.itemsByStatus} loading={loading} />
        <BarCard title="Revenue — last 6 months" data={s?.charts.revenueByMonth} dataKey="revenue" prefix="$" color="#2e6b3a" loading={loading} />
      </div>
    </>
  );
}
