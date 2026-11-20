'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Flame, Clock, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const rise = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="gingham absolute inset-0 -z-20 opacity-60" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_75%_40%,color-mix(in_srgb,var(--accent)_30%,transparent),transparent_70%),linear-gradient(to_bottom,transparent_60%,var(--background))]" aria-hidden />

      <div className="container-page grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p variants={rise} className="section-eyebrow">
            <Flame className="size-4" /> Wood-fired. Doorstep-fast.
          </motion.p>
          <motion.h1 variants={rise} className="text-5xl font-bold leading-[1.02] sm:text-6xl lg:text-7xl" style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}>
            Hot &amp; Fresh Pizza <span className="relative inline-block text-primary">Delivered<svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" aria-hidden><path d="M2 8c40-8 100-8 196-2" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg></span> to Your Door
          </motion.h1>
          <motion.p variants={rise} className="mt-6 max-w-xl text-lg text-muted-foreground">
            Discover the best local pizzerias around you, browse every menu, and order your favourite slice in a few taps — baked fresh, tracked live.
          </motion.p>
          <motion.div variants={rise} className="mt-9 flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link href="/menu">Explore Pizza Menu <ArrowRight /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/signup">Sell on PizzaHub</Link>
            </Button>
          </motion.div>
          <motion.ul variants={rise} className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-foreground/80">
            <li className="flex items-center gap-2"><Clock className="size-4 text-primary" /> Order in under a minute</li>
            <li className="flex items-center gap-2"><Truck className="size-4 text-primary" /> Pick your delivery date</li>
          </motion.ul>
        </motion.div>

        <motion.div
          className="relative mx-auto aspect-square w-full max-w-[520px]"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-[6%] rounded-full border-2 border-dashed border-ink/25" aria-hidden />
          <div className="absolute inset-[12%] rounded-full bg-accent/30 blur-2xl" aria-hidden />
          <motion.img
            src="/hero-pizza.svg"
            alt="A freshly baked pepperoni, mushroom and basil pizza"
            className="relative size-full drop-shadow-[0_24px_30px_rgba(60,25,8,0.28)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
            fetchPriority="high"
          />
          <motion.div
            className="sticker absolute -left-1 top-[14%] rounded-2xl bg-card px-4 py-3 sm:left-[-4%]"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Fresh from the oven</p>
            <p className="font-display text-lg font-semibold">Baked to order</p>
          </motion.div>
          <motion.div
            className="sticker absolute -right-1 bottom-[10%] rounded-2xl bg-accent px-4 py-3 text-ink sm:right-[-3%]"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <p className="text-xs font-bold uppercase tracking-wider">Local pizzerias</p>
            <p className="font-display text-lg font-semibold">All in one place</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
