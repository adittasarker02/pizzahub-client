'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/dashboard/widgets';
import { PageLoader } from '@/components/common/states';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserAvatar } from '@/components/ui/avatar';
import { Field } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { authClient, useSession } from '@/lib/auth-client';
import { uploadImage } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const fileRef = useRef(null);
  const [form, setForm] = useState({ name: '', businessName: '' });
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) { setForm({ name: user.name || '', businessName: user.businessName || '' }); setImage(user.image || null); }
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isPending || !user) return <PageLoader label="Loading profile…" />;

  async function onPick(e) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (!f.type.startsWith('image/')) return toast.error('Please choose an image file');
    setUploading(true);
    try { setImage(await uploadImage(f)); toast.success('Image uploaded — press Save to apply'); }
    catch (err) { toast.error(`Image upload failed: ${err.message}`); }
    finally { setUploading(false); }
  }

  async function save(e) {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Enter your name';
    if (user.role === 'vendor' && form.businessName.trim().length < 2) next.businessName = 'Enter your restaurant name';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    // role / plan / blocked can never be sent from here - the server hook rejects them anyway
    const payload = { name: form.name.trim(), image: image || undefined, ...(user.role === 'vendor' ? { businessName: form.businessName.trim() } : {}) };
    const { error } = await authClient.updateUser(payload);
    setSaving(false);
    if (error) return toast.error(error.message || 'Could not update profile');
    toast.success('Profile updated');
    router.refresh();
  }

  return (
    <>
      <PageHeader title="Profile settings" description="Update how you appear on PizzaHub." />
      <Card className="max-w-2xl p-6 sm:p-8">
        <div className="flex items-center gap-5">
          <div className="relative">
            <UserAvatar name={form.name} src={image} className="size-24 text-xl" />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} aria-label="Change photo"
              className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full border-2 border-ink bg-accent text-ink shadow-[2px_2px_0_0_var(--ink)]">
              <Camera className="size-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={onPick} />
          </div>
          <div>
            <p className="font-display text-xl font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-2 flex gap-2"><Badge>{user.role}</Badge>{user.role === 'vendor' && <Badge variant={user.subscriptionPlan === 'premium' ? 'warning' : 'muted'}>{user.subscriptionPlan || 'free'} plan</Badge>}</div>
          </div>
        </div>
        {uploading && <p className="mt-3 text-sm text-muted-foreground">Uploading image…</p>}

        <form onSubmit={save} noValidate className="mt-8 grid gap-5">
          <Field label="Full name" htmlFor="name" error={errors.name}><Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} aria-invalid={!!errors.name} /></Field>
          {user.role === 'vendor' && (
            <Field label="Restaurant name" htmlFor="biz" error={errors.businessName}><Input id="biz" value={form.businessName} onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))} aria-invalid={!!errors.businessName} /></Field>
          )}
          <Field label="Email" htmlFor="email" hint="Your email cannot be changed."><Input id="email" value={user.email} disabled /></Field>
          <Field label="Account role" htmlFor="role" hint="Roles are managed by PizzaHub and cannot be changed here."><Input id="role" value={user.role} disabled className="capitalize" /></Field>
          <div><Button type="submit" size="lg" loading={saving} disabled={uploading}>Save changes</Button></div>
        </form>
      </Card>
    </>
  );
}
