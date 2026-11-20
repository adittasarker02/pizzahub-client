'use client';
import { motion } from 'motion/react';

/** Gentle fade-up on scroll - runs once so it never gets in the way */
export function Reveal({ children, delay = 0, y = 22, className, as = 'div' }) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
