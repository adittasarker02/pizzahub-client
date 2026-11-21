'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, CalendarCheck, Flame, Store, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } };
const rise = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };

const ticker = ['Margherita', 'Pepperoni', 'Four Cheese', 'Truffle Burrata', 'Garlic Bread', 'Crispy Wings', 'Lava Cake', 'Tiramisu', 'Mint Lemonade', 'Paneer Tikka', 'Hot Honey Salami', 'Calzone'];

export function Hero() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#1f120c] text-[#fff6e7]">
        {/* Photo with a slow "ken burns" zoom */}
        <motion.img
          src="/hero-pizza.jpg"
          alt="A wood-fired pizza on a PizzaHub serving board, a slice being lifted with melted cheese"
          className="absolute inset-0 -z-20 size-full object-cover object-[62%_center]"
          initial={{ scale: 1.14 }}
          animate={{ scale: 1.02 }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          fetchPriority="high"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(95deg,#1f120c_8%,rgba(31,18,12,0.88)_38%,rgba(31,18,12,0.35)_68%,rgba(31,18,12,0.08)_100%)] max-md:bg-[linear-gradient(180deg,rgba(31,18,12,0.88),rgba(31,18,12,0.75))]" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#1f120c]/80 to-transparent" aria-hidden />

        <div className="container-page relative grid min-h-[600px] items-center py-20 lg:min-h-[720px] lg:py-28">
          <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl">
            <motion.p variants={rise} className="inline-flex items-center gap-2 rounded-full border border-[#fff6e7]/25 bg-[#fff6e7]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-accent backdrop-blur">
              <Flame className="size-4" /> Wood-fired · Doorstep-fast
            </motion.p>
            <motion.h1 variants={rise} className="mt-6 text-5xl font-bold leading-[1.02] text-[#fff6e7] sm:text-6xl lg:text-7xl" style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}>
              Hot &amp; Fresh Pizza{' '}
              <span className="relative inline-block text-accent">
                Delivered
                <svg className="absolute -bottom-2 left-0 w-full text-primary" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" aria-hidden>
                  <path d="M2 8c40-8 100-8 196-2" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>{' '}
              to Your Door
            </motion.h1>
            <motion.p variants={rise} className="mt-7 max-w-xl text-lg leading-relaxed text-[#fff6e7]/80">
              Discover the best local pizzerias, browse every menu and order your favourite slice in a few taps — baked fresh, tracked live.
            </motion.p>
            <motion.div variants={rise} className="mt-9 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link href="/menu">Explore Pizza Menu <ArrowRight /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-[#fff6e7]/70 bg-transparent text-[#fff6e7] hover:bg-[#fff6e7] hover:text-[#2b1a12]">
                <Link href="/signup">Sell on PizzaHub</Link>
              </Button>
            </motion.div>
            <motion.ul variants={rise} className="mt-12 grid max-w-xl gap-4 sm:grid-cols-3">
              {[
                [UtensilsCrossed, 'Real menus', 'Approved local pizzerias'],
                [CalendarCheck, 'Pick your day', 'Order for any date'],
                [Store, 'Sell with us', 'Free plan for vendors'],
              ].map(([Icon, t, s]) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent"><Icon className="size-5" /></span>
                  <span><span className="block text-sm font-bold">{t}</span><span className="block text-xs text-[#fff6e7]/65">{s}</span></span>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* rotating stamp */}
          <motion.div
            className="absolute bottom-10 right-6 hidden size-36 items-center justify-center lg:flex xl:right-14"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <motion.svg viewBox="0 0 120 120" className="absolute inset-0 size-full" animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }} aria-hidden>
              <defs><path id="circ" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" /></defs>
              <circle cx="60" cy="60" r="58" fill="#d62e1f" stroke="#fff6e7" strokeWidth="2" />
              <text fill="#fff6e7" fontSize="11.5" fontWeight="700" letterSpacing="3.2"><textPath href="#circ">HOT • FRESH • LOCAL • HOT • FRESH • LOCAL •</textPath></text>
            </motion.svg>
            <span className="relative text-5xl" aria-hidden>🍕</span>
          </motion.div>
        </div>
      </section>

      {/* ticker */}
      <div className="overflow-hidden border-y-2 border-ink bg-accent py-3 text-ink" aria-hidden>
        <div className="marquee flex w-max gap-10 whitespace-nowrap font-display text-lg font-semibold">
          {[...ticker, ...ticker, ...ticker, ...ticker].map((t, i) => (
            <span key={i} className="flex items-center gap-10">{t}<span className="text-primary">✦</span></span>
          ))}
        </div>
      </div>
    </>
  );
}
