import { supabase } from "@/integrations/supabase/client";

const BUCKET = (import.meta.env.VITE_STORAGE_BUCKET as string | undefined) || "service-images";
const SIGNED_TTL = Number(import.meta.env.VITE_STORAGE_SIGNED_TTL ?? 60 * 60 * 24 * 365);

const cache = new Map<string, Promise<string>>();

/**
 * Resolve a stored image URL to something the browser can actually load.
 * Old records were saved as public URLs (`/object/public/<bucket>/...`) but the
 * bucket is now private, so those return 404. We swap them for a signed URL.
 */
export function resolveStorageUrl(url: string | null | undefined): Promise<string> {
  if (!url) return Promise.resolve("");
  const match = url.match(new RegExp(`/object/public/${BUCKET}/([^?]+)`));
  if (!match) return Promise.resolve(url);
  const path = decodeURIComponent(match[1]);
  const cached = cache.get(path);
  if (cached) return cached;
  const p = supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_TTL)
    .then(({ data, error }) => {
      if (error || !data) return url;
      return data.signedUrl;
    });
  cache.set(path, p);
  return p;
}
