'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { AuthLink, AuthShell } from '@/components/common/auth-shell';
import { GoogleButton } from '@/components/common/google-button';
import { PasswordInput } from '@/components/common/password-input';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { authClient, useSession } from '@/lib/auth-client';
import { roleHome } from '@/lib/constants';
import { safeRedirect } from '@/lib/utils';

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl');
  const { data: session } = useSession();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // already signed in -> go to the right dashboard
  useEffect(() => {
    if (session?.user && !loading) window.location.replace(safeRedirect(callbackUrl, roleHome(session.user.role)));
  }, [session, loading, callbackUrl, router]);

  useEffect(() => {
    const err = params.get('error');
    if (err) toast.error(err.replace(/_/g, ' ').toLowerCase().replace(/^./, (c) => c.toUpperCase()));
  }, [params]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!form.password) next.password = 'Password is required';
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    const { data, error } = await authClient.signIn.email({ email: form.email.trim(), password: form.password });
    if (error) {
      setLoading(false);
      toast.error(error.message || 'Invalid email or password');
      return;
    }
    toast.success(`Welcome back, ${data?.user?.name?.split(' ')[0] || 'friend'}!`);
    // hard navigation: avoids the router cache holding the pre-login redirect (e.g. prefetched /dashboard)
    window.location.assign(safeRedirect(callbackUrl, roleHome(data?.user?.role)));
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to track orders and manage your menu."
      footer={<>New to PizzaHub? <AuthLink href="/signup">Create an account</AuthLink></>}
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set('email')} aria-invalid={!!errors.email} />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password}>
          <PasswordInput id="password" autoComplete="current-password" placeholder="Your password" value={form.password} onChange={set('password')} aria-invalid={!!errors.password} />
        </Field>
        <Button type="submit" className="w-full" size="lg" loading={loading}>Sign In</Button>
      </form>
      <div className="my-6 flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>
      <GoogleButton callbackURL={safeRedirect(callbackUrl)} label="Sign in with Google" />
    </AuthShell>
  );
}
