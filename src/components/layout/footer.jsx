import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Logo } from '@/components/common/logo';
import { FacebookIcon, InstagramIcon, XIcon, YoutubeIcon } from '@/components/common/social-icons';
import { CATEGORIES } from '@/lib/constants';

const socials = [
  { label: 'X (Twitter)', href: 'https://x.com', Icon: XIcon },
  { label: 'Facebook', href: 'https://facebook.com', Icon: FacebookIcon },
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
  { label: 'YouTube', href: 'https://youtube.com', Icon: YoutubeIcon },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-[#fff6e7]" style={{ background: '#2b1a12' }}>
      <div className="gingham-strip" />
      <div className="container-page grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#fff6e7]/70">
            PizzaHub connects hungry people with the best local pizzerias. Fresh dough, hot ovens, and doorstep delivery.
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-10 items-center justify-center rounded-full border-2 border-[#fff6e7]/25 text-[#fff6e7] transition hover:border-accent hover:bg-accent hover:text-[#2b1a12]"
              >
                <Icon className="size-[18px]" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-[#fff6e7]/70">
            {[['/', 'Home'], ['/menu', 'Browse Menu'], ['/signin', 'Sign In'], ['/signup', 'Sign Up']].map(([href, label]) => (
              <li key={href}><Link href={href} className="transition hover:text-accent">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold">Menu categories</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-[#fff6e7]/70">
            {CATEGORIES.map((c) => (
              <li key={c.slug}><Link href={`/menu?category=${c.slug}`} className="transition hover:text-accent">{c.name}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold">Contact us</h4>
          <ul className="mt-4 space-y-3.5 text-sm text-[#fff6e7]/70">
            <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-accent" />House 21, Road 11, Banani, Dhaka 1213</li>
            <li className="flex gap-3"><Phone className="mt-0.5 size-4 shrink-0 text-accent" />+880 1700-000000</li>
            <li className="flex gap-3"><Mail className="mt-0.5 size-4 shrink-0 text-accent" />hello@pizzahub.example</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#fff6e7]/15">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-[#fff6e7]/60 sm:flex-row">
          <p>© {new Date().getFullYear()} PizzaHub. All rights reserved.</p>
          <p>Baked with care · Delivered hot 🍕</p>
        </div>
      </div>
    </footer>
  );
}
