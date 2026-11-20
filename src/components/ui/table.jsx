import { cn } from '@/lib/utils';

export const Table = ({ className, ...p }) => (
  <div className="w-full overflow-x-auto">
    <table className={cn('w-full min-w-[640px] caption-bottom text-sm', className)} {...p} />
  </div>
);
export const THead = ({ className, ...p }) => <thead className={cn('border-b-2 border-border bg-muted/60', className)} {...p} />;
export const TBody = ({ className, ...p }) => <tbody className={cn('[&_tr:last-child]:border-0', className)} {...p} />;
export const TR = ({ className, ...p }) => (
  <tr className={cn('border-b border-border transition-colors hover:bg-muted/40', className)} {...p} />
);
export const TH = ({ className, ...p }) => (
  <th className={cn('h-11 whitespace-nowrap px-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground', className)} {...p} />
);
export const TD = ({ className, ...p }) => <td className={cn('px-4 py-3 align-middle', className)} {...p} />;
