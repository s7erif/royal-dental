import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Copy, Eye, MoreHorizontal, Pencil, Search, Trash2, ArrowUp, ArrowDown, EyeOff, Send,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CategoryFilter } from "@/components/admin/CategorySelector";
import { EmptyState, LoadingSkeleton } from "@/components/admin/primitives";
import { PreviewModal } from "@/components/admin/PreviewModal";
import { getIcon } from "@/lib/icon-registry";
import { Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

export type ServiceRow = {
  id: string;
  name_ar: string;
  name_en: string | null;
  short_desc_ar: string;
  icon: string;
  cover_image: string | null;
  status: "active" | "hidden" | "draft";
  display_order: number;
  featured: boolean;
  show_on_homepage: boolean;
  price: string | null;
  duration: string | null;
  button_text: string | null;
  features: unknown;
  created_at: string;
  category_id: string | null;
  category?: { id: string; name_ar: string; slug: string } | null;
};

export function ServicesTable({
  services, isLoading,
  onEdit, onDelete, onDuplicate, onReorder,
  onBulkStatus, onBulkDelete,
}: {
  services: ServiceRow[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (ids: string[]) => void;
  onDuplicate: (id: string) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
  onBulkStatus: (ids: string[], status: "active" | "hidden") => void;
  onBulkDelete: (ids: string[]) => void;
}) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "hidden" | "draft">("all");
  const [category, setCategory] = useState<string | "all">("all");
  const [sort, setSort] = useState<"order" | "newest" | "name">("order");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<ServiceRow | null>(null);

  const filtered = useMemo(() => {
    let out = services;
    if (q.trim()) {
      const s = q.toLowerCase();
      out = out.filter((x) =>
        x.name_ar.toLowerCase().includes(s) ||
        (x.name_en?.toLowerCase().includes(s) ?? false) ||
        (x.category?.name_ar.toLowerCase().includes(s) ?? false),
      );
    }
    if (status !== "all") out = out.filter((x) => x.status === status);
    if (category !== "all") out = out.filter((x) => x.category_id === category);
    if (sort === "newest") out = [...out].sort((a, b) => b.created_at.localeCompare(a.created_at));
    else if (sort === "name") out = [...out].sort((a, b) => a.name_ar.localeCompare(b.name_ar, "ar"));
    else out = [...out].sort((a, b) => a.display_order - b.display_order);
    return out;
  }, [services, q, status, category, sort]);

  const allSelected = filtered.length > 0 && filtered.every((s) => selected.has(s.id));
  const someSelected = selected.size > 0;

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map((s) => s.id)));
  };
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث بالاسم أو التصنيف..." className="pr-9" />
        </div>
        <CategoryFilter value={category} onChange={setCategory} />
        <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">كل الحالات</option>
          <option value="active">نشط</option>
          <option value="hidden">مخفي</option>
          <option value="draft">مسودة</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="order">حسب الترتيب</option>
          <option value="newest">الأحدث</option>
          <option value="name">الاسم</option>
        </select>
      </div>

      {/* Bulk actions */}
      {someSelected && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[color:var(--color-gold-dark)]/30 bg-[color:var(--color-gold-light)]/15 px-4 py-2.5">
          <div className="text-sm font-bold">تم اختيار {selected.size}</div>
          <div className="mr-auto flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => onBulkStatus(Array.from(selected), "active")}>
              <Send className="ml-1 h-3.5 w-3.5" />نشر
            </Button>
            <Button size="sm" variant="outline" onClick={() => onBulkStatus(Array.from(selected), "hidden")}>
              <EyeOff className="ml-1 h-3.5 w-3.5" />إخفاء
            </Button>
            <Button size="sm" variant="destructive" onClick={() => { onBulkDelete(Array.from(selected)); setSelected(new Set()); }}>
              <Trash2 className="ml-1 h-3.5 w-3.5" />حذف
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>إلغاء</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Stethoscope}
          title={services.length === 0 ? "لا توجد خدمات بعد" : "لا نتائج مطابقة"}
          description={services.length === 0 ? "ابدأ بإضافة أول خدمة." : "جرّب تعديل معايير البحث."}
          action={services.length === 0 ? (
            <Button asChild className="bg-gradient-to-l from-[color:var(--color-gold-dark)] to-[color:var(--color-gold-light)] text-white hover:opacity-95">
              <Link to="/admin/services/new">إضافة خدمة</Link>
            </Button>
          ) : undefined}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-right text-[11px] font-bold uppercase text-muted-foreground">
                  <th className="w-10 p-3"><Checkbox checked={allSelected} onCheckedChange={toggleAll} /></th>
                  <th className="p-3">أيقونة</th>
                  <th className="p-3">صورة</th>
                  <th className="p-3">الاسم العربي</th>
                  <th className="p-3">الاسم الإنجليزي</th>
                  <th className="p-3">الوصف المختصر</th>
                  <th className="p-3">التصنيف</th>
                  <th className="p-3">الترتيب</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3">التاريخ</th>
                  <th className="p-3">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const Icon = getIcon(s.icon);
                  return (
                    <tr key={s.id} className={cn("border-b border-border/60 transition-colors hover:bg-muted/30",
                      selected.has(s.id) && "bg-[color:var(--color-gold-light)]/10")}>
                      <td className="p-3"><Checkbox checked={selected.has(s.id)} onCheckedChange={() => toggleOne(s.id)} /></td>
                      <td className="p-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--color-gold-light)]/25 to-[color:var(--color-gold-dark)]/15 text-[color:var(--color-gold-dark)]">
                          <Icon className="h-4 w-4" />
                        </div>
                      </td>
                      <td className="p-3">
                        {s.cover_image ? (
                          <img src={s.cover_image} alt="" className="h-10 w-14 rounded-md object-cover" />
                        ) : (
                          <div className="grid h-10 w-14 place-items-center rounded-md bg-muted text-[10px] text-muted-foreground">لا يوجد</div>
                        )}
                      </td>
                      <td className="p-3 font-semibold">
                        <div className="flex items-center gap-1.5">
                          {s.name_ar}
                          {s.featured && <span className="rounded-full bg-[color:var(--color-gold-dark)]/15 px-1.5 text-[9px] font-bold text-[color:var(--color-gold-dark)]">مميز</span>}
                        </div>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground" dir="ltr">{s.name_en || "—"}</td>
                      <td className="max-w-[260px] p-3 text-xs text-muted-foreground">
                        <div className="line-clamp-2">{s.short_desc_ar}</div>
                      </td>
                      <td className="p-3 text-xs">{s.category?.name_ar || "—"}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onReorder(s.id, "up")}>
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <span className="min-w-4 text-center text-xs font-mono">{s.display_order}</span>
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onReorder(s.id, "down")}>
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-3"><StatusBadge status={s.status} /></td>
                      <td className="p-3 text-xs text-muted-foreground" dir="ltr">
                        {new Date(s.created_at).toLocaleDateString("en-GB")}
                      </td>
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => setPreview(s)}>
                              <Eye className="ml-2 h-4 w-4" />معاينة
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(s.id)}>
                              <Pencil className="ml-2 h-4 w-4" />تعديل
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDuplicate(s.id)}>
                              <Copy className="ml-2 h-4 w-4" />تكرار
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onDelete([s.id])} className="text-destructive focus:text-destructive">
                              <Trash2 className="ml-2 h-4 w-4" />حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <PreviewModal
        open={!!preview}
        onOpenChange={(o) => !o && setPreview(null)}
        service={preview && {
          name_ar: preview.name_ar, short_desc_ar: preview.short_desc_ar, icon: preview.icon,
          cover_image: preview.cover_image, price: preview.price, duration: preview.duration,
          features: Array.isArray(preview.features) ? (preview.features as string[]) : [],
          button_text: preview.button_text,
        }}
      />
    </div>
  );
}
