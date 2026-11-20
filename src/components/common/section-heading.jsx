import { cn } from '@/lib/utils';

/** Same eyebrow / title / lead style on every page */
export function SectionHeading({ eyebrow, title, lead, align = 'left', className, children }) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4', align === 'center' && 'justify-center text-center', className)}>
      <div className={cn(align === 'center' && 'mx-auto')}>
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
        <h2 className="section-title">{title}</h2>
        {lead && <p className={cn('section-lead', align === 'center' && 'mx-auto')}>{lead}</p>}
      </div>
      {children}
    </div>
  );
}
