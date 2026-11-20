'use client';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function PageHeader({ title, description, children }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
        {description && <p className="mt-1.5 text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}

const tones = {
  red: 'bg-primary/12 text-primary',
  orange: 'bg-accent/25 text-[#9a5208] dark:text-accent',
  green: 'bg-basil/15 text-basil',
  brown: 'bg-secondary text-secondary-foreground',
};

export function StatCard({ label, value, icon: Icon, tone = 'red', loading, hint }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {loading ? <Skeleton className="mt-2 h-8 w-20" /> : <p className="mt-1 break-words font-display text-3xl font-bold leading-tight">{value}</p>}
          {hint && !loading && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn('flex size-12 shrink-0 items-center justify-center rounded-2xl', tones[tone])}><Icon className="size-6" /></div>
      </div>
    </Card>
  );
}

export const STATUS_COLORS = {
  pending: '#f28c28', accepted: '#2e6b3a', approved: '#2e6b3a', rejected: '#d62e1f', cancelled: '#9a8272', inactive: '#9a8272',
  vendor: '#d62e1f', customer: '#f28c28', admin: '#2e6b3a',
};
const FALLBACK = ['#d62e1f', '#f28c28', '#2e6b3a', '#8b4a2b', '#e1a456', '#b863a3'];

export function DonutCard({ title, data = [], loading }) {
  const filtered = data.filter((d) => d.value > 0);
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="h-64">
        {loading ? <Skeleton className="size-full" /> : filtered.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={filtered} dataKey="value" nameKey="name" innerRadius={56} outerRadius={88} paddingAngle={3} stroke="var(--card)" strokeWidth={3}>
                {filtered.map((d, i) => <Cell key={d.name} fill={STATUS_COLORS[d.name] || FALLBACK[i % FALLBACK.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '2px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)' }} />
              <Legend iconType="circle" formatter={(v) => <span className="text-xs capitalize text-foreground">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function BarCard({ title, data = [], dataKey = 'value', loading, prefix = '', color = '#d62e1f' }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="h-64">
        {loading ? <Skeleton className="size-full" /> : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'var(--muted)' }} formatter={(v) => `${prefix}${v}`} contentStyle={{ borderRadius: 12, border: '2px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)' }} />
              <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
