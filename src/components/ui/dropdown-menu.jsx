'use client';
import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';

export const DropdownMenu = DropdownPrimitive.Root;
export const DropdownMenuTrigger = DropdownPrimitive.Trigger;

export function DropdownMenuContent({ className, sideOffset = 8, ...props }) {
  return (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.Content
        sideOffset={sideOffset}
        align="end"
        className={cn(
          'z-50 min-w-56 overflow-hidden rounded-2xl border-2 border-ink bg-popover p-1.5 text-popover-foreground shadow-[4px_4px_0_0_var(--ink)]',
          className,
        )}
        {...props}
      />
    </DropdownPrimitive.Portal>
  );
}

export function DropdownMenuItem({ className, ...props }) {
  return (
    <DropdownPrimitive.Item
      className={cn(
        'flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium outline-none transition-colors data-[highlighted]:bg-secondary [&_svg]:size-4 [&_svg]:text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}
export const DropdownMenuLabel = ({ className, ...p }) => (
  <DropdownPrimitive.Label className={cn('px-3 py-2 text-sm', className)} {...p} />
);
export const DropdownMenuSeparator = ({ className, ...p }) => (
  <DropdownPrimitive.Separator className={cn('-mx-1.5 my-1.5 h-px bg-border', className)} {...p} />
);
