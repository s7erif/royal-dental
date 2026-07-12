import { useCallback, useRef, useState } from "react";
import { Loader2, Upload, X, ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Storage configuration — override via env when self-hosting on your own Supabase.
 *   VITE_STORAGE_BUCKET         — bucket name (default: "service-images")
 *   VITE_STORAGE_BUCKET_PUBLIC  — "true" if the bucket is public (default: "false")
 *   VITE_STORAGE_SIGNED_TTL     — signed URL TTL in seconds (default: 31536000 = 1y)
 *   VITE_STORAGE_MAX_MB         — max upload size in MB (default: 5)
 */
const BUCKET = (import.meta.env.VITE_STORAGE_BUCKET as string | undefined) || "service-images";
const IS_PUBLIC = ((import.meta.env.VITE_STORAGE_BUCKET_PUBLIC as string | undefined) ?? "false") === "true";
const SIGNED_TTL = Number(import.meta.env.VITE_STORAGE_SIGNED_TTL ?? 60 * 60 * 24 * 365);
const MAX_MB = Number(import.meta.env.VITE_STORAGE_MAX_MB ?? 5);

async function toUrl(path: string): Promise<string> {
  if (IS_PUBLIC) {
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_TTL);
  if (error || !data) throw new Error(error?.message || "فشل توليد رابط الصورة");
  return data.signedUrl;
}

function pathFromUrl(url: string): string | null {
  // Handles both public URLs (…/object/public/<bucket>/<path>) and signed URLs (…/object/sign/<bucket>/<path>?token=…)
  const m = url.match(new RegExp(`/object/(?:public|sign)/${BUCKET}/([^?]+)`));
  if (m) return decodeURIComponent(m[1]);
  const parts = url.split(`/${BUCKET}/`);
  if (parts.length === 2) return parts[1].split("?")[0];
  return null;
}

async function uploadFile(file: File): Promise<string> {
  if (file.size > MAX_MB * 1024 * 1024) {
    throw new Error(`الملف كبير جداً (الحد الأقصى ${MAX_MB} ميجابايت)`);
  }
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600", upsert: false, contentType: file.type,
  });
  if (error) throw new Error(error.message);
  return toUrl(path);
}

async function deleteFile(url: string) {
  try {
    const path = pathFromUrl(url);
    if (!path) return;
    await supabase.storage.from(BUCKET).remove([path]);
  } catch { /* best-effort */ }
}

/** Single-image uploader with drag & drop. */
export function ImageUploader({
  value, onChange, label = "الصورة", aspect = "aspect-video",
}: { value: string | null; onChange: (url: string | null) => void; label?: string; aspect?: string }) {
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const url = await uploadFile(files[0]);
      if (value) await deleteFile(value);
      onChange(url);
      toast.success("تم رفع الصورة");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل الرفع");
    } finally { setBusy(false); }
  }, [value, onChange]);

  const remove = async () => {
    if (!value) return;
    setBusy(true);
    await deleteFile(value);
    onChange(null);
    setBusy(false);
  };

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold">{label}</div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
        className={cn(
          "relative overflow-hidden rounded-2xl border-2 border-dashed transition-colors",
          aspect,
          drag ? "border-[color:var(--color-gold-dark)] bg-[color:var(--color-gold-light)]/10" : "border-border bg-muted/30",
        )}
      >
        {value ? (
          <>
            <img src={value} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-3">
              <Button type="button" size="sm" variant="secondary" onClick={() => inputRef.current?.click()} disabled={busy}>
                <Upload className="ml-1 h-3.5 w-3.5" />استبدال
              </Button>
              <Button type="button" size="sm" variant="destructive" onClick={remove} disabled={busy}>
                <X className="ml-1 h-3.5 w-3.5" />حذف
              </Button>
            </div>
          </>
        ) : (
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-center text-muted-foreground hover:text-foreground">
            {busy ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-8 w-8" />}
            <div className="text-xs font-semibold">اسحب الصورة هنا أو اضغط للاختيار</div>
            <div className="text-[10px]">حتى {MAX_MB} ميجابايت • JPG / PNG / WebP</div>
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => handleFiles(e.target.files)} />
    </div>
  );
}

/** Multi-image gallery uploader. */
export function GalleryUploader({
  value, onChange,
}: { value: string[]; onChange: (urls: string[]) => void }) {
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    const uploaded: string[] = [];
    for (const f of Array.from(files)) {
      try { uploaded.push(await uploadFile(f)); }
      catch (err) { toast.error(err instanceof Error ? err.message : "فشل الرفع"); }
    }
    if (uploaded.length) onChange([...value, ...uploaded]);
    setBusy(false);
  };

  const removeAt = async (i: number) => {
    const url = value[i];
    const next = value.filter((_, idx) => idx !== i);
    onChange(next);
    await deleteFile(url);
  };

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold">معرض الصور</div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
        className={cn(
          "rounded-2xl border-2 border-dashed p-3 transition-colors",
          drag ? "border-[color:var(--color-gold-dark)] bg-[color:var(--color-gold-light)]/10" : "border-border bg-muted/30",
        )}
      >
        {value.length === 0 && (
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
            className="flex w-full flex-col items-center justify-center gap-2 py-8 text-muted-foreground hover:text-foreground">
            {busy ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-8 w-8" />}
            <div className="text-xs font-semibold">اسحب صور متعددة أو اضغط للاختيار</div>
          </button>
        )}
        {value.length > 0 && (
          <>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {value.map((url, i) => (
                <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => removeAt(i)}
                    className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="حذف">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
                className="grid aspect-square place-items-center rounded-lg border-2 border-dashed border-border text-muted-foreground hover:text-foreground">
                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
              </button>
            </div>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={(e) => handleFiles(e.target.files)} />
    </div>
  );
}
