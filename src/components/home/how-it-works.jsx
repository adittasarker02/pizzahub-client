import Link from 'next/link';
import { ChefHat, ClipboardCheck, Search, UtensilsCrossed } from 'lucide-react';
import { SectionHeading } from '@/components/common/section-heading';
import { Reveal } from '@/components/common/reveal';
import { Button } from '@/components/ui/button';

const steps = [
  { icon: Search, title: 'Browse', text: 'Search by name, filter by category or area, and sort by price.' },
  { icon: ClipboardCheck, title: 'Place your order', text: 'Pick a delivery date, add your address and any special instructions.' },
  { icon: ChefHat, title: 'Restaurant confirms', text: 'The pizzeria accepts your order and starts baking.' },
  { icon: UtensilsCrossed, title: 'Enjoy', text: 'Hot, fresh and right on schedule. Slice it up!' },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-ink py-16 text-[#fff6e7] sm:py-20" style={{ background: '#2b1a12' }}>
      <div className="container-page relative">
        <Reveal>
          <div className="text-center">
            <p className="section-eyebrow justify-center !text-accent">How PizzaHub works</p>
            <h2 className="section-title !text-[#fff6e7]">From craving to doorstep in four steps</h2>
          </div>
        </Reveal>
        <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 0.08}>
              <div className="relative h-full rounded-2xl border-2 border-[#fff6e7]/20 bg-[#fff6e7]/5 p-6">
                <span className="absolute -top-5 left-6 flex size-10 items-center justify-center rounded-full border-2 border-[#2b1a12] bg-accent font-display text-lg font-bold text-[#2b1a12]">
                  {i + 1}
                </span>
                <Icon className="mt-3 size-8 text-accent" />
                <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#fff6e7]/70">{text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        <Reveal>
          <div className="mt-14 flex flex-col items-center justify-between gap-5 rounded-2xl border-2 border-accent/60 bg-accent/10 p-6 text-center sm:flex-row sm:text-left">
            <div>
              <h3 className="font-display text-2xl font-semibold">Run a pizzeria? Put your menu on PizzaHub.</h3>
              <p className="mt-1 text-sm text-[#fff6e7]/75">Start free with 3 items. Upgrade to Premium for unlimited items and featured placement.</p>
            </div>
            <Button asChild variant="accent" size="lg" className="shrink-0">
              <Link href="/signup">Become a vendor</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
