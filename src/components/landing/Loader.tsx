export function Loader({ done }: { done: boolean }) {
  return (
    <div
      aria-hidden={done}
      className={`fixed inset-0 z-[100] grid place-items-center bg-[#0d0d0d] transition-opacity duration-500 ${
        done ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ willChange: "opacity" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-14 w-14 animate-spin rounded-full border-2 border-[color:var(--color-gold)]/20 border-t-[color:var(--color-gold)]"
          style={{ animationDuration: "1s" }}
        />
        <div className="tracking-[0.3em] text-[color:var(--color-gold)] text-sm font-semibold">
          رويال ديـنـتـال
        </div>
      </div>
    </div>
  );
}
