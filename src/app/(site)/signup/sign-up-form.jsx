'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ImagePlus, Store, UtensilsCrossed, X } from 'lucide-react';
import { toast } from 'sonner';
import { AuthLink, AuthShell } from '@/components/common/auth-shell';
import { GoogleButton } from '@/components/common/google-button';
import { PasswordInput } from '@/components/common/password-input';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UserAvatar } from '@/components/ui/avatar';
import { authClient, useSession } from '@/lib/auth-client';
import { uploadImage } from '@/lib/api';
import { roleHome } from '@/lib/constants';
import { cn } from '@/lib/utils';

const rules = [
  { test: (p) => p.length >= 6, label: 'At least 6 characters' },
  { test: (p) => /[A-Z]/.test(p), label: 'One uppercase letter' },
  { test: (p) => /[a-z]/.test(p), label: 'One lowercase letter' },
];

const roles = [
  { value: 'customer', title: 'Customer', text: 'Order delicious pizza', icon: UtensilsCrossed },
  { value: 'vendor', title: 'Vendor', text: 'Restaurant owner', icon: Store },
];

export function SignUpForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const fileRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer', businessName: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user && !loading) router.replace(roleHome(session.user.role));
  }, [session, loading, router]);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function pickFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) return toast.error('Please choose an image file');
    if (f.size > 8 * 1024 * 1024) return toast.error('Image must be smaller than 8 MB');
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    const failed = rules.find((r) => !r.test(form.password));
    if (failed) next.password = `Password needs: ${failed.label.toLowerCase()}`;
    if (form.role === 'vendor' && form.businessName.trim().length < 2) next.businessName = 'Enter your restaurant name';
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    const { data, error } = await authClient.signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
      ...(form.role === 'vendor' ? { businessName: form.businessName.trim() } : {}),
    });
    if (error) {
      setLoading(false);
      toast.error(error.message || 'Could not create your account');
      return;
    }

    // optional profile image - uploaded once the new user is signed in
    if (file) {
      try {
        const url = await uploadImage(file);
        await authClient.updateUser({ image: url });
      } catch (err) {
        toast.warning(`Account created, but the photo upload failed: ${err.message}`);
      }
    }
    toast.success('Account created! Welcome to PizzaHub 🍕');
    router.replace(roleHome(data?.user?.role || form.role));
    router.refresh();
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join PizzaHub as a customer or a restaurant owner."
      footer={<>Already have an account? <AuthLink href="/signin">Sign in</AuthLink></>}
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div role="radiogroup" aria-label="Account role" className="grid grid-cols-2 gap-3">
          {roles.map(({ value, title, text, icon: Icon }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={form.role === value}
              onClick={() => setForm((f) => ({ ...f, role: value }))}
              className={cn(
                'flex flex-col items-start gap-1 rounded-2xl border-2 p-4 text-left transition',
                form.role === value ? 'border-ink bg-accent/25 shadow-[3px_3px_0_0_var(--ink)]' : 'border-input bg-card hover:border-ink/50',
              )}
            >
              <Icon className={cn('size-5', form.role === value ? 'text-primary' : 'text-muted-foreground')} />
              <span className="font-display font-semibold">{title}</span>
              <span className="text-xs text-muted-foreground">{text}</span>
            </button>
          ))}
        </div>

        <Field label="Full name" htmlFor="name" error={errors.name}>
          <Input id="name" autoComplete="name" placeholder="Giulia Rossi" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} />
        </Field>

        {form.role === 'vendor' && (
          <Field label="Restaurant name" htmlFor="businessName" error={errors.businessName}>
            <Input id="businessName" placeholder="Giulia's Wood Fire Pizza" value={form.businessName} onChange={set('businessName')} aria-invalid={!!errors.businessName} />
          </Field>
        )}

        <Field label="Email" htmlFor="email" error={errors.email}>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set('email')} aria-invalid={!!errors.email} />
        </Field>

        <Field label="Password" htmlFor="password" error={errors.password}>
          <PasswordInput id="password" autoComplete="new-password" placeholder="Create a password" value={form.password} onChange={set('password')} aria-invalid={!!errors.password} />
          <ul className="mt-2.5 grid gap-1 text-xs">
            {rules.map((r) => {
              const ok = r.test(form.password);
              return (
                <li key={r.label} className={cn('flex items-center gap-1.5', ok ? 'text-basil' : 'text-muted-foreground')}>
                  <Check className={cn('size-3.5', !ok && 'opacity-30')} /> {r.label}
                </li>
              );
            })}
          </ul>
        </Field>

        <Field label="Profile image (optional)" hint="JPG, PNG or WEBP. You can skip this and add one later.">
          <div className="flex items-center gap-4">
            <UserAvatar name={form.name} src={preview} className="size-14" />
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={pickFile} id="avatar" />
            <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <ImagePlus /> {file ? 'Change' : 'Upload'}
            </Button>
            {file && (
              <Button type="button" variant="ghost" size="sm" onClick={() => { setFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ''; }}>
                <X /> Remove
              </Button>
            )}
          </div>
        </Field>

        <Button type="submit" className="w-full" size="lg" loading={loading}>Create Account</Button>
      </form>

      <div className="my-6 flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>
      <GoogleButton role={form.role} label={`Sign up with Google as ${form.role}`} />
    </AuthShell>
  );
}
