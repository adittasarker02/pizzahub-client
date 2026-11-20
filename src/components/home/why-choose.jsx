import { BadgeCheck, CalendarCheck, Store, Wallet } from 'lucide-react';
import { SectionHeading } from '@/components/common/section-heading';
import { Reveal } from '@/components/common/reveal';

const benefits = [
  { icon: Store, title: 'Local & verified', text: 'Every restaurant and every menu item is reviewed by our team before it goes live, so you only see the real deal.' },
  { icon: CalendarCheck, title: 'Order for any day', text: 'Choose your delivery date and leave a note for the kitchen. Plan the pizza night in advance.' },
  { icon: BadgeCheck, title: 'Clear order tracking', text: 'Watch your order move from pending to accepted. Changed your mind? Cancel before the restaurant confirms.' },
  { icon: Wallet, title: 'Fair for vendors', text: 'Start free with up to 3 menu items. Go Premium for unlimited items, a badge and featured placement.' },
];

export function WhyChoose() {
  return (
    <section className="container-page py-16 sm:py-20">
      <Reveal>
        <SectionHeading align="center" eyebrow="Why choose PizzaHub?" title="Built for pizza lovers and the people who bake for them" />
      </Reveal>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 0.07} className="h-full">
            <div className="h-full rounded-2xl border-2 border-border bg-card p-6 transition hover:border-ink/60">
              <div className="flex size-14 items-center justify-center rounded-2xl border-2 border-ink bg-accent/80 text-ink shadow-[3px_3px_0_0_var(--ink)]">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
