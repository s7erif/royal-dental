import { useCallback, useEffect, useRef, useState } from "react";
import { StorageImage } from "@/components/StorageImage";

interface Props {
  before: string;
  after: string;
  className?: string;
  rounded?: string;
}

/**
 * Draggable before/after image comparison slider.
 * Supports mouse + touch. Smooth transition on release.
 */
export function BeforeAfterCompare({ before, after, className = "", rounded = "rounded-2xl" }: Props) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, raw)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0]?.clientX : (e as MouseEvent).clientX;
      if (clientX != null) setFromClientX(clientX);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, setFromClientX]);

  return (
    <div
      ref={ref}
      className={`relative h-full w-full select-none overflow-hidden ${rounded} ${className}`}
      onMouseDown={(e) => { setDragging(true); setFromClientX(e.clientX); }}
      onTouchStart={(e) => { setDragging(true); if (e.touches[0]) setFromClientX(e.touches[0].clientX); }}
    >
      {/* After image (full) */}
      <StorageImage src={after} alt="بعد" className="block h-full w-full object-cover" draggable={false} />

      {/* Before image (clipped) */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${pos}%)`, transition: dragging ? "none" : "clip-path 0.35s ease" }}
      >
        <StorageImage src={before} alt="قبل" className="block h-full w-full object-cover" draggable={false} />
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-black/65 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-white backdrop-blur">
        قبل
      </span>
      <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-[color:var(--color-gold-dark)] px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-white">
        بعد
      </span>

      {/* Divider line */}
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_20px_rgba(0,0,0,0.4)]"
        style={{ left: `${pos}%`, transform: "translateX(-50%)", transition: dragging ? "none" : "left 0.35s ease" }}
      />

      {/* Handle */}
      <div
        className="pointer-events-none absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-[color:var(--color-gold-dark)] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.5)]"
        style={{ left: `${pos}%`, transition: dragging ? "none" : "left 0.35s ease" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </div>
    </div>
  );
}
