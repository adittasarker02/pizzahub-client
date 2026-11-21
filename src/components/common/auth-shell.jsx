import Link from 'next/link';
import { Logo } from '@/components/common/logo';

export function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="relative hidden overflow-hidden bg-primary p-12 text-[#fff6e7] lg:flex lg:flex-col lg:justify-between" style={{ background: '#d62e1f' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero-pizza.jpg" alt="" className="absolute inset-0 size-full object-cover object-[65%_center]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,18,12,0.7),rgba(214,46,31,0.55)_60%,rgba(31,18,12,0.85))]" />
        <div className="gingham-strip absolute inset-x-0 top-0 opacity-50" />
        <Logo light />
        <div className="relative">
          <h2 className="relative max-w-sm text-4xl font-semibold leading-tight" style={{ color: '#fff6e7' }}>
            Your next favourite slice is a few taps away.
          </h2>
          <p className="relative mt-4 max-w-sm text-[#fff6e7]/85">
            Order from local pizzerias or grow your own restaurant on PizzaHub.
          </p>
        </div>
        <p className="relative text-sm text-[#fff6e7]/80">© {new Date().getFullYear()} PizzaHub</p>
      </aside>

      <section className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <h1 className="section-title">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <p className="mt-8 text-center text-sm text-muted-foreground">{footer}</p>}
        </div>
      </section>
    </div>
  );
}

export const AuthLink = ({ href, children }) => (
  <Link href={href} className="font-semibold text-primary underline-offset-4 hover:underline">{children}</Link>
);
