'use client';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn, initials } from '@/lib/utils';

export function UserAvatar({ name, src, className }) {
  return (
    <AvatarPrimitive.Root
      className={cn('relative flex size-9 shrink-0 overflow-hidden rounded-full border-2 border-ink/70 bg-secondary', className)}
    >
      <AvatarPrimitive.Image src={src || undefined} alt={name || 'User'} className="size-full object-cover" />
      <AvatarPrimitive.Fallback className="flex size-full items-center justify-center bg-accent/30 text-xs font-bold text-foreground">
        {initials(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
