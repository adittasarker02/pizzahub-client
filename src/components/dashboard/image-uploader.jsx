'use client';
import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { uploadImage } from '@/lib/api';
import { cn } from '@/lib/utils';

/** Uploads straight to ImgBB through the API (key stays on the server). value = array of URLs */
export function ImageUploader({ value = [], onChange, max = 4, error }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(0);

  async function onPick(e) {
    const files = Array.from(e.target.files || []).slice(0, max - value.length);
    e.target.value = '';
    if (!files.length) return;
    const urls = [];
    setBusy(files.length);
    for (const f of files) {
      if (!f.type.startsWith('image/')) { toast.error(`${f.name} is not an image`); setBusy((b) => b - 1); continue; }
      try { urls.push(await uploadImage(f)); }
      catch (err) { toast.error(`Upload failed for ${f.name}: ${err.message}`); }
      setBusy((b) => b - 1);
    }
    if (urls.length) onChange([...value, ...urls]);
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {value.map((url, i) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border-2 border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Upload ${i + 1}`} className="size-full object-cover" />
            {i === 0 && <span className="absolute bottom-1.5 left-1.5 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-bold uppercase text-white">Cover</span>}
            <button type="button" onClick={() => onChange(value.filter((u) => u !== url))} aria-label="Remove image"
              className="absolute right-1.5 top-1.5 rounded-full bg-ink/80 p-1 text-white opacity-90 transition hover:bg-destructive">
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        {Array.from({ length: busy }).map((_, i) => (
          <div key={`b${i}`} className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50"><Loader2 className="size-6 animate-spin text-primary" /></div>
        ))}
        {value.length + busy < max && (
          <button type="button" onClick={() => ref.current?.click()}
            className={cn('flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed text-sm font-semibold text-muted-foreground transition hover:border-primary hover:text-primary', error ? 'border-destructive' : 'border-input')}>
            <ImagePlus className="size-6" /> Add image
          </button>
        )}
      </div>
      <input ref={ref} type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple className="sr-only" onChange={onPick} />
    </div>
  );
}
