import { cn } from "@/lib/utils";

type Status = "active" | "hidden" | "draft";

const map: Record<Status, { label: string; className: string; dot: string }> = {
  active: { label: "نشط", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30", dot: "bg-emerald-500" },
  hidden: { label: "مخفي", className: "bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30", dot: "bg-slate-500" },
  draft: { label: "مسودة", className: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30", dot: "bg-amber-500" },
};

export function StatusBadge({ status }: { status: Status }) {
  const s = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold", s.className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}
