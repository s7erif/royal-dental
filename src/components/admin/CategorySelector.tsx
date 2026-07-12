import { useState } from "react";
import { Plus, Loader2, X, Pencil, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  listCategoriesAdmin, createCategory, updateCategory, deleteCategory,
} from "@/lib/services.functions";

type Category = { id: string; name_ar: string; name_en: string | null; slug: string; display_order: number };

export function CategorySelector({
  value, onChange, allowEmpty = false,
}: { value: string | null; onChange: (id: string | null) => void; allowEmpty?: boolean }) {
  const list = useServerFn(listCategoriesAdmin);
  const { data: categories = [] } = useQuery({ queryKey: ["admin-categories"], queryFn: () => list() });

  return (
    <div className="flex gap-2">
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm"
      >
        {allowEmpty && <option value="">— بدون تصنيف —</option>}
        {!allowEmpty && !value && <option value="">اختر تصنيفاً</option>}
        {(categories as Category[]).map((c) => (
          <option key={c.id} value={c.id}>{c.name_ar}</option>
        ))}
      </select>
      <ManageCategoriesButton />
    </div>
  );
}

function ManageCategoriesButton() {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="gap-1">
          <Plus className="h-3.5 w-3.5" />إدارة
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[380px] p-4">
        <CategoriesManager />
      </PopoverContent>
    </Popover>
  );
}

export function CategoriesManager() {
  const qc = useQueryClient();
  const list = useServerFn(listCategoriesAdmin);
  const create = useServerFn(createCategory);
  const update = useServerFn(updateCategory);
  const del = useServerFn(deleteCategory);

  const { data: categories = [], isLoading } = useQuery({ queryKey: ["admin-categories"], queryFn: () => list() });

  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-categories"] });

  const createMut = useMutation({
    mutationFn: () => create({ data: { name_ar: nameAr, name_en: nameEn || null, slug: slug || nameAr.toLowerCase().replace(/\s+/g, "-"), display_order: (categories as Category[]).length + 1 } }),
    onSuccess: () => { toast.success("تم إنشاء التصنيف"); setNameAr(""); setNameEn(""); setSlug(""); invalidate(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "فشل"),
  });

  const updateMut = useMutation({
    mutationFn: (c: Category) => update({ data: { id: c.id, values: { name_ar: c.name_ar, name_en: c.name_en, slug: c.slug, display_order: c.display_order } } }),
    onSuccess: () => { toast.success("تم التحديث"); setEditing(null); invalidate(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "فشل"),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { toast.success("تم الحذف"); invalidate(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "فشل"),
  });

  return (
    <div className="space-y-3">
      <div>
        <div className="mb-2 text-sm font-bold">إضافة تصنيف</div>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="الاسم العربي" value={nameAr} onChange={(e) => setNameAr(e.target.value)} className="h-8" />
            <Input placeholder="English name" value={nameEn} onChange={(e) => setNameEn(e.target.value)} className="h-8" dir="ltr" />
          </div>
          <Input placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="h-8" dir="ltr" />
          <Button type="button" size="sm" onClick={() => createMut.mutate()} disabled={!nameAr || createMut.isPending} className="w-full">
            {createMut.isPending && <Loader2 className="ml-1 h-3.5 w-3.5 animate-spin" />}
            إضافة
          </Button>
        </div>
      </div>

      <div className="my-3 h-px bg-border" />

      <div>
        <div className="mb-2 text-sm font-bold">التصنيفات ({(categories as Category[]).length})</div>
        {isLoading && <div className="py-4 text-center text-xs text-muted-foreground">جاري التحميل...</div>}
        <ul className="max-h-60 space-y-1 overflow-y-auto">
          {(categories as Category[]).map((c) => (
            <li key={c.id} className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2 py-1.5">
              {editing?.id === c.id ? (
                <>
                  <Input value={editing.name_ar} onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })} className="h-7 text-xs" />
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateMut.mutate(editing)}>
                    ✓
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(null)}>
                    <X className="h-3 w-3" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 truncate text-xs">{c.name_ar}</span>
                  <span className="text-[10px] text-muted-foreground" dir="ltr">{c.slug}</span>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(c)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive"
                    onClick={() => { if (confirm(`حذف "${c.name_ar}"؟`)) delMut.mutate(c.id); }}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function CategoryFilter({
  value, onChange,
}: { value: string | "all"; onChange: (v: string | "all") => void }) {
  const list = useServerFn(listCategoriesAdmin);
  const { data: categories = [] } = useQuery({ queryKey: ["admin-categories"], queryFn: () => list() });
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-md border border-input bg-background px-3 text-sm">
      <option value="all">كل التصنيفات</option>
      {(categories as Category[]).map((c) => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
    </select>
  );
}
