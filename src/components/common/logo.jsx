import Link from 'next/link';
import { cn } from '@/lib/utils';

export function LogoMark({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={cn('size-9', className)} aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#E1A456" stroke="#2b1a12" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="16.5" fill="#D62E1F" />
      <circle cx="24" cy="24" r="14.5" fill="#F6D77A" />
      <circle cx="18" cy="19" r="3.6" fill="#B3281B" stroke="#861a10" strokeWidth="1" />
      <circle cx="29.5" cy="22" r="3.6" fill="#B3281B" stroke="#861a10" strokeWidth="1" />
      <circle cx="23" cy="30.5" r="3.6" fill="#B3281B" stroke="#861a10" strokeWidth="1" />
      <path d="M31 14c3 0 5-2 5-2s-1 3-3 4z" fill="#2F7D3A" />
      <path d="M24 24 40 9" stroke="#2b1a12" strokeWidth="2" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}

/** Same size + style everywhere (navbar, footer, auth pages) */
export function Logo({ className, href = '/', light = false }) {
  return (
    <Link href={href} className={cn('group inline-flex items-center gap-2.5', className)} aria-label="PizzaHub home">
      <LogoMark className="transition-transform duration-500 group-hover:rotate-[120deg]" />
      <span className={cn('font-display text-2xl font-bold tracking-tight', light ? 'text-[#fff6e7]' : 'text-foreground')}>
        Pizza<span className="text-primary">Hub</span>
      </span>
    </Link>
  );
}
