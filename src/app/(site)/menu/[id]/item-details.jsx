'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BadgeCheck, CreditCard, MapPin, ShieldAlert, ShoppingBag, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field } from '@/components/ui/label';
import { Input, Textarea } from '@/components/ui/input';
import { EmptyState, PageLoader } from '@/components/common/states';
import { useSession } from '@/lib/auth-client';
import { api } from '@/lib/api';
import { categoryName } from '@/lib/constants';
import { money } from '@/lib/utils';
import { useApi } from '@/hooks/use-api';

const today = () => new Date().toISOString().slice(0, 10);

export function ItemDetails({ id }) {
  const { data: session } = useSession();
  const { data, loading, error } = useApi(`/menu/${id}`);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  if (loading) return <PageLoader label="Loading item…" />;
  if (error) {
    return (
      <div className="container-page py-20">
        <EmptyState
          icon={ShieldAlert}
          title={error.status === 404 || error.status === 400 ? 'Menu item not found' : 'Could not load this item'}
          message={error.status === 404 || error.status === 400 ? 'This item does not exist, was removed, or is not available right now.' : error.message}
          action={<Button asChild><Link href="/menu">Back to menu</Link></Button>}
        />
      </div>
    );
  }

  const item = data.item;
  const user = session?.user;
  const vendorName = item.vendor.businessName || item.vendor.name;
  const orderable = item.status === 'approved';
  const isOwner = user && String(item.vendorId) === String(user.id);

  let blocker = null;
  if (!orderable) blocker = `This item is ${item.status} and cannot be ordered.`;
  else if (user?.role === 'vendor') blocker = isOwner ? 'This is your own menu item — vendors cannot order their own items.' : 'Vendor accounts cannot place customer orders.';
  else if (user?.role === 'admin') blocker = 'Admin accounts cannot place customer orders.';

  return (
    <div className="container-page py-10 sm:py-14">
      <Link href="/menu" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to menu
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-3xl border-2 border-ink bg-muted shadow-[6px_6px_0_0_var(--ink)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.images[active]} alt={item.itemName} className="aspect-[4/3] w-full object-cover" />
          </div>
          {item.images.length > 1 && (
            <div className="mt-5 grid grid-cols-4 gap-3">
              {item.images.map((src, i) => (
                <button key={src + i} onClick={() => setActive(i)} aria-label={`Show image ${i + 1}`}
                  className={`overflow-hidden rounded-xl border-2 transition ${i === active ? 'border-primary' : 'border-border opacity-70 hover:opacity-100'}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="normal-case">{categoryName(item.category)}</Badge>
            {item.status !== 'approved' && <StatusBadge status={item.status} />}
            {item.vendor.isPremium && <Badge variant="warning"><Star className="size-3 fill-current" /> Premium vendor</Badge>}
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">{item.itemName}</h1>
          <p className="mt-4 font-display text-3xl font-bold text-primary">{money(item.price)}</p>
          <p className="mt-5 whitespace-pre-line leading-relaxed text-muted-foreground">{item.description}</p>

          <div className="mt-6 flex items-center gap-2 text-sm font-medium"><MapPin className="size-4 text-primary" />{item.location}</div>

          <div className="mt-6 flex items-center gap-4 rounded-2xl border-2 border-border bg-card p-4">
            <UserAvatar name={vendorName} src={item.vendor.image} className="size-12" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sold by</p>
              <p className="flex items-center gap-1.5 font-display text-lg font-semibold">{vendorName}{item.vendor.isPremium && <BadgeCheck className="size-5 text-basil" />}</p>
            </div>
          </div>

          <div className="mt-8">
            {blocker ? (
              <div role="status" className="rounded-2xl border-2 border-dashed border-border bg-muted/50 p-5 text-sm text-muted-foreground">{blocker}</div>
            ) : (
              <Button size="lg" className="w-full sm:w-auto" onClick={() => setOpen(true)}><ShoppingBag /> Order this item</Button>
            )}
          </div>
        </div>
      </div>

      <OrderDialog item={item} open={open} onOpenChange={setOpen} />
    </div>
  );
}

function OrderDialog({ item, open, onOpenChange }) {
  const [form, setForm] = useState({ deliveryDate: '', deliveryAddress: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const next = {};
    if (!form.deliveryDate) next.deliveryDate = 'Choose a delivery date';
    else if (form.deliveryDate < today()) next.deliveryDate = 'Date cannot be in the past';
    if (form.deliveryAddress.trim().length < 8) next.deliveryAddress = 'Enter a full delivery address';
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      const res = await api('/customer/orders', { method: 'POST', body: { itemId: item._id, ...form } });
      toast.success(res.message);
      setDone(true);
    } catch (err) {
      toast.error(err.message);
      if (err.fields) setErrors(err.fields);
    } finally {
      setLoading(false);
    }
  }
  const close = (v) => { onOpenChange(v); if (!v) setTimeout(() => { setDone(false); setForm({ deliveryDate: '', deliveryAddress: '', message: '' }); }, 200); };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        {done ? (
          <div className="py-4 text-center">
            <p className="text-5xl">🎉</p>
            <DialogTitle className="mt-3">Order placed!</DialogTitle>
            <DialogDescription className="mt-2">The restaurant will accept or reject your order soon. Track it from your dashboard.</DialogDescription>
            <div className="mt-6 grid gap-3">
              {/* Customer payment is intentionally just a button (Stripe is used for vendor subscriptions only) */}
              <Button variant="accent" onClick={() => toast.info('Online payment for orders is not part of this demo — pay on delivery.')}><CreditCard /> Pay Now</Button>
              <Button asChild variant="outline"><Link href="/dashboard/customer/orders">View my orders</Link></Button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            <DialogHeader>
              <DialogTitle>Order {item.itemName}</DialogTitle>
              <DialogDescription>{money(item.price)} · from {item.vendor.businessName || item.vendor.name}</DialogDescription>
            </DialogHeader>
            <Field label="Delivery date" htmlFor="deliveryDate" error={errors.deliveryDate}>
              <Input id="deliveryDate" type="date" min={today()} value={form.deliveryDate} onChange={set('deliveryDate')} aria-invalid={!!errors.deliveryDate} />
            </Field>
            <Field label="Delivery address" htmlFor="deliveryAddress" error={errors.deliveryAddress}>
              <Textarea id="deliveryAddress" className="min-h-20" placeholder="House, road, area, city" value={form.deliveryAddress} onChange={set('deliveryAddress')} aria-invalid={!!errors.deliveryAddress} />
            </Field>
            <Field label="Additional message (optional)" htmlFor="message" error={errors.message}>
              <Textarea id="message" className="min-h-20" placeholder="Special instructions for the kitchen" maxLength={500} value={form.message} onChange={set('message')} />
            </Field>
            <Button type="submit" size="lg" className="w-full" loading={loading}>Confirm order</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
