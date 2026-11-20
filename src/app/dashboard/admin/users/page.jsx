'use client';
import { useState } from 'react';
import { Ban, Eye, ShieldCheck, Users } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/dashboard/widgets';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';
import { EmptyState, ErrorState, PageLoader } from '@/components/common/states';
import { Pagination } from '@/components/common/pagination';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserAvatar } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input, Select } from '@/components/ui/input';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { useApi, useDebounce } from '@/hooks/use-api';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const dSearch = useDebounce(search);
  const { data, loading, error, refetch } = useApi('/admin/users', { query: { search: dSearch, role, page } });
  const [target, setTarget] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const detail = useApi(detailId ? `/admin/users/${detailId}` : null, { enabled: !!detailId });

  return (
    <>
      <PageHeader title="Manage users" description="Search accounts, review details and block or unblock users." />
      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_220px]">
        <Input placeholder="Search by name or email…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} aria-label="Search users" />
        <Select value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }} aria-label="Filter by role">
          <option value="">All roles</option><option value="vendor">Vendors</option><option value="customer">Customers</option><option value="admin">Admins</option>
        </Select>
      </div>

      {error ? <ErrorState error={error} onRetry={refetch} /> : loading && !data ? <PageLoader label="Loading users…" /> : !data.items.length ? (
        <EmptyState icon={Users} title="No users found" message="Try a different search or role filter." />
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <THead><TR><TH>User</TH><TH>Role</TH><TH>Plan</TH><TH>Joined</TH><TH>Status</TH><TH className="text-right">Actions</TH></TR></THead>
            <TBody>
              {data.items.map((u) => (
                <TR key={u._id}>
                  <TD><div className="flex items-center gap-3"><UserAvatar name={u.name} src={u.image} /><div className="min-w-0"><p className="font-semibold">{u.name}</p><p className="max-w-[210px] truncate text-xs text-muted-foreground">{u.email}</p></div></div></TD>
                  <TD><Badge variant={u.role === 'admin' ? 'success' : 'default'}>{u.role}</Badge></TD>
                  <TD className="capitalize text-muted-foreground">{u.role === 'vendor' ? u.subscriptionPlan || 'free' : '—'}</TD>
                  <TD className="text-muted-foreground">{formatDate(u.createdAt)}</TD>
                  <TD><StatusBadge status={u.isBlocked ? 'blocked' : 'active'} /></TD>
                  <TD>
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setDetailId(u._id)}><Eye /> View</Button>
                      {u.role !== 'admin' && (
                        <Button size="sm" variant="outline" className={u.isBlocked ? '' : 'text-destructive'} onClick={() => setTarget(u)}>
                          {u.isBlocked ? <><ShieldCheck /> Unblock</> : <><Ban /> Block</>}
                        </Button>
                      )}
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      )}
      {data && <Pagination page={data.page} totalPages={data.totalPages} total={data.total} onChange={setPage} />}

      <ConfirmDialog open={!!target} onOpenChange={(o) => !o && setTarget(null)} destructive={!target?.isBlocked}
        title={target?.isBlocked ? `Unblock ${target?.name}?` : `Block ${target?.name}?`} confirmLabel={target?.isBlocked ? 'Unblock user' : 'Block user'}
        description={target?.isBlocked ? 'They will be able to sign in and use the platform again.' : 'They will be signed out and cannot use protected features until unblocked.'}
        onConfirm={async () => {
          try { const r = await api(`/admin/users/${target._id}/block`, { method: 'PATCH', body: { blocked: !target.isBlocked } }); toast.success(r.message); refetch(); }
          catch (e) { toast.error(e.message); }
        }} />

      <Dialog open={!!detailId} onOpenChange={(o) => !o && setDetailId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>User details</DialogTitle><DialogDescription>Account information</DialogDescription></DialogHeader>
          {detail.loading ? <PageLoader className="min-h-40" /> : detail.error ? <ErrorState error={detail.error} /> : detail.data && (() => {
            const u = detail.data.user;
            return (
              <div>
                <div className="flex items-center gap-4"><UserAvatar name={u.name} src={u.image} className="size-16" /><div><p className="font-display text-xl font-semibold">{u.name}</p><p className="text-sm text-muted-foreground">{u.email}</p></div></div>
                <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  {[['Role', u.role], ['Status', u.isBlocked ? 'Blocked' : 'Active'], ['Business', u.businessName || '—'], ['Plan', u.role === 'vendor' ? u.subscriptionPlan || 'free' : '—'],
                    ['Menu items', u.itemCount], ['Orders', u.orderCount], ['Joined', formatDate(u.createdAt)], ['Premium until', u.subscriptionExpiresAt ? formatDate(u.subscriptionExpiresAt) : '—']].map(([k, v]) => (
                    <div key={k}><dt className="text-xs font-bold uppercase text-muted-foreground">{k}</dt><dd className="mt-0.5 font-medium capitalize">{v}</dd></div>
                  ))}
                </dl>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </>
  );
}
