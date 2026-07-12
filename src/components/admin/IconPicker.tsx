import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { iconRegistry, getIcon } from "@/lib/icon-registry";

export function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const SelectedIcon = getIcon(value);
  const filtered = Object.keys(iconRegistry).filter((n) => n.toLowerCase().includes(q.toLowerCase()));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="h-auto justify-start gap-3 p-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--color-gold-light)]/25 to-[color:var(--color-gold-dark)]/15 text-[color:var(--color-gold-dark)]">
            <SelectedIcon className="h-5 w-5" />
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold">{value || "اختر أيقونة"}</div>
            <div className="text-[10px] text-muted-foreground">اضغط للتغيير</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-3" align="start">
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="ابحث..." value={q} onChange={(e) => setQ(e.target.value)} className="h-8 pr-7 text-xs" />
        </div>
        <div className="grid max-h-64 grid-cols-6 gap-1.5 overflow-y-auto">
          {filtered.map((name) => {
            const Icon = iconRegistry[name];
            const active = value === name;
            return (
              <button key={name} type="button" onClick={() => { onChange(name); setOpen(false); }}
                title={name}
                className={cn("grid aspect-square place-items-center rounded-lg border transition-colors",
                  active ? "border-[color:var(--color-gold-dark)] bg-[color:var(--color-gold-light)]/20 text-[color:var(--color-gold-dark)]"
                    : "border-transparent hover:bg-accent")}>
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
