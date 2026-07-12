import { forwardRef, useEffect, useState, type ImgHTMLAttributes } from "react";
import { resolveStorageUrl } from "@/lib/storage-url";

type Props = ImgHTMLAttributes<HTMLImageElement> & { src?: string | null };

/**
 * <img> that resolves legacy public storage URLs to signed URLs at runtime.
 */
export const StorageImage = forwardRef<HTMLImageElement, Props>(function StorageImage(
  { src, ...rest },
  ref,
) {
  const [resolved, setResolved] = useState<string>("");
  useEffect(() => {
    let alive = true;
    resolveStorageUrl(src).then((u) => {
      if (alive) setResolved(u);
    });
    return () => {
      alive = false;
    };
  }, [src]);
  return <img ref={ref} src={resolved || undefined} {...rest} />;
});
