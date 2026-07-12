import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, ArrowUp, ArrowDown, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SectionCard } from "@/components/admin/primitives";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { IconPicker } from "@/components/admin/IconPicker";
import { getIcon } from "@/lib/icon-registry";
import {
  cmsListAdmin,
  cmsCreate,
  cmsUpdate,
  cmsDelete,
  cmsReorder,
  cmsToggle,
  type CollectionTable,
} from "@/lib/cms.functions";

export type FieldDef =
  | { key: string; label: string; type: "text" | "textarea" | "number" | "date"; required?: boolean; placeholder?: string; rows?: number; hideInTable?: boolean }
  | { key: string; label: string; type: "boolean"; required?: boolean; hideInTable?: boolean }
  | { key: string; label: string; type: "image"; required?: boolean; aspect?: string; hideInTable?: boolean }
  | { key: string; label: string; type: "images"; required?: boolean; hideInTable?: boolean }
  | { key: string; label: string; type: "icon"; required?: boolean; hideInTable?: boolean }
  | { key: string; label: string; type: "list"; required?: boolean; placeholder?: string; rows?: number; hideInTable?: boolean }
  | { key: string; label: string; type: "select"; options: { value: string; label: string }[]; required?: boolean; hideInTable?: boolean };

type Row = Record<string, unknown> & { id: string; display_order?: number };

interface Props {
  table: CollectionTable;
  fields: FieldDef[];
  queryKey: string;
  publicQueryKey?: string | string[]; // invalidate public site cache
  emptyLabel?: string;
  titleField?: string; // used for delete confirm & row label
  toggleField?: string; // e.g. is_active
  allowReorder?: boolean;
  createDefaults?: Record<string, unknown>;
}

export function CollectionManager({
  table,
  fields,
  queryKey,
  publicQueryKey,
  emptyLabel = "لا توجد عناصر بعد.",
  titleField = "title",
  toggleField,
  allowReorder = true,
  createDefaults = {},
}: Props) {
  const qc = useQueryClient();
  const list = useServerFn(cmsListAdmin);
  const create = useServerFn(cmsCreate);
  const update = useServerFn(cmsUpdate);
  const del = useServerFn(cmsDelete);
  const reorder = useServerFn(cmsReorder);
  const toggle = useServerFn(cmsToggle);

  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: () => list({ data: { table } }),
  });
  const rows = (data ?? []) as Row[];

  const invalidatePublic = () => {
    if (!publicQueryKey) return;
    const keys = Array.isArray(publicQueryKey) ? publicQueryKey : [publicQueryKey];
    keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
  };

  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDel, setConfirmDel] = useState<Row | null>(null);

  const createMut = useMutation({
    mutationFn: (values: Record<string, unknown>) => create({ data: { table, values } }),
    onSuccess: () => {
      toast.success("تمت الإضافة");
      qc.invalidateQueries({ queryKey: [queryKey] });
      invalidatePublic();
      setCreating(false);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "فشل الإنشاء"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Record<string, unknown> }) =>
      update({ data: { table, id, values } }),
    onSuccess: () => {
      toast.success("تم الحفظ");
      qc.invalidateQueries({ queryKey: [queryKey] });
      invalidatePublic();
      setEditing(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "فشل الحفظ"),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { table, id } }),
    onSuccess: () => {
      toast.success("تم الحذف");
      qc.invalidateQueries({ queryKey: [queryKey] });
      invalidatePublic();
      setConfirmDel(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "فشل الحذف"),
  });

  const reorderMut = useMutation({
    mutationFn: (orders: { id: string; display_order: number }[]) =>
      reorder({ data: { table, orders } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
      invalidatePublic();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "فشل الترتيب"),
  });

  const toggleMut = useMutation({
    mutationFn: (v: { id: string; field: string; value: boolean }) =>
      toggle({ data: { table, ...v } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
      invalidatePublic();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "فشل التحديث"),
  });

  const move = (idx: number, dir: -1 | 1) => {
    const to = idx + dir;
    if (to < 0 || to >= rows.length) return;
    const a = rows[idx], b = rows[to];
    reorderMut.mutate([
      { id: a.id, display_order: (b.display_order ?? to) },
      { id: b.id, display_order: (a.display_order ?? idx) },
    ]);
  };

  const openCreate = () => setCreating(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const searchable = fields.filter((f) => f.type === "text" || f.type === "textarea").map((f) => f.key);
  const filtered = search
    ? rows.filter((r) => searchable.some((k) => String(r[k] ?? "").toLowerCase().includes(search.toLowerCase())))
    : rows;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const canReorder = allowReorder && !search && currentPage === 1;

  return (
    <SectionCard
      actions={
        <Button size="sm" onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> إضافة
        </Button>
      }
    >
      <div className="mb-4">
        <Input
          placeholder="بحث..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-xs"
        />
      </div>
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-right text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                {allowReorder && <th className="p-2 w-20">الترتيب</th>}
                {fields.filter((f) => !f.hideInTable).slice(0, 3).map((f) => (
                  <th key={f.key} className="p-2">{f.label}</th>
                ))}
                {toggleField && <th className="p-2 w-24">الحالة</th>}
                <th className="p-2 w-32">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((r, i) => {
                const idx = rows.indexOf(r);
                return (
                <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30">
                  {allowReorder && (
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => move(idx, -1)} disabled={!canReorder || idx === 0}>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => move(idx, 1)} disabled={!canReorder || idx === rows.length - 1}>
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  )}
                  {fields.filter((f) => !f.hideInTable).slice(0, 3).map((f) => (
                    <td key={f.key} className="p-2 max-w-xs truncate">
                      <CellPreview field={f} value={r[f.key]} />
                    </td>
                  ))}
                  {toggleField && (
                    <td className="p-2">
                      <Switch
                        checked={Boolean(r[toggleField])}
                        onCheckedChange={(v) => toggleMut.mutate({ id: r.id, field: toggleField, value: v })}
                      />
                    </td>
                  )}
                  <td className="p-2">
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setEditing(r)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setConfirmDel(r)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              صفحة {currentPage} من {totalPages} — إجمالي {filtered.length}
            </span>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                السابق
              </Button>
              <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                التالي
              </Button>
            </div>
          </div>
        )}
        </>
      )}

      <RowDialog
        open={creating}
        title="إضافة عنصر"
        fields={fields}
        initial={{ display_order: rows.length + 1, ...createDefaults }}
        submitting={createMut.isPending}
        onClose={() => setCreating(false)}
        onSubmit={(v) => createMut.mutate(v)}
      />
      <RowDialog
        open={!!editing}
        title="تعديل عنصر"
        fields={fields}
        initial={editing ?? {}}
        submitting={updateMut.isPending}
        onClose={() => setEditing(null)}
        onSubmit={(v) => editing && updateMut.mutate({ id: editing.id, values: v })}
      />

      <Dialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف "{String(confirmDel?.[titleField] ?? "هذا العنصر")}"؟ لا يمكن التراجع.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmDel(null)}>إلغاء</Button>
            <Button
              variant="destructive"
              disabled={delMut.isPending}
              onClick={() => confirmDel && delMut.mutate(confirmDel.id)}
            >
              {delMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 ml-1" />}
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SectionCard>
  );
}

function CellPreview({ field, value }: { field: FieldDef; value: unknown }) {
  if (value == null || value === "") return <span className="text-muted-foreground">—</span>;
  if (field.type === "image") {
    return <img src={String(value)} alt="" className="h-10 w-10 rounded object-cover" />;
  }
  if (field.type === "images") {
    const arr = Array.isArray(value) ? (value as string[]) : [];
    if (arr.length === 0) return <span className="text-muted-foreground">—</span>;
    return (
      <div className="flex -space-x-2 rtl:space-x-reverse">
        {arr.slice(0, 3).map((u, i) => (
          <img key={i} src={u} alt="" className="h-8 w-8 rounded border-2 border-background object-cover" />
        ))}
        {arr.length > 3 && <span className="ml-1 text-xs text-muted-foreground">+{arr.length - 3}</span>}
      </div>
    );
  }
  if (field.type === "icon") {
    const Icon = getIcon(String(value));
    return (
      <span className="inline-flex items-center gap-2">
        <Icon className="h-4 w-4" /> {String(value)}
      </span>
    );
  }
  if (field.type === "boolean") return <span>{value ? "نعم" : "لا"}</span>;
  if (field.type === "list") {
    const arr = Array.isArray(value) ? (value as string[]) : [];
    if (arr.length === 0) return <span className="text-muted-foreground">—</span>;
    return <span className="text-xs text-muted-foreground">{arr.slice(0, 2).join("، ")}{arr.length > 2 ? ` +${arr.length - 2}` : ""}</span>;
  }
  return <span>{String(value)}</span>;
}

function RowDialog({
  open, title, fields, initial, submitting, onClose, onSubmit,
}: {
  open: boolean;
  title: string;
  fields: FieldDef[];
  initial: Record<string, unknown>;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (v: Record<string, unknown>) => void;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(initial);
  useEffect(() => { if (open) setValues(initial); /* eslint-disable-next-line */ }, [open]);
  const set = (k: string, v: unknown) => setValues((s) => ({ ...s, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {fields.map((f) => (
            <div key={f.key}>
              <Label className="mb-1.5 block text-xs font-semibold">
                {f.label} {f.required && <span className="text-destructive">*</span>}
              </Label>
              <FieldInput field={f} value={values[f.key]} onChange={(v) => set(f.key, v)} />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>إلغاء</Button>
          <Button onClick={() => onSubmit(values)} disabled={submitting} className="gap-2">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            حفظ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function FieldInput({
  field, value, onChange,
}: { field: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  switch (field.type) {
    case "text":
      return <Input value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />;
    case "textarea":
      return <Textarea rows={field.rows ?? 4} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />;
    case "number":
      return <Input type="number" value={value == null ? "" : String(value)} onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))} />;
    case "date":
      return <Input type="date" value={String(value ?? "")} onChange={(e) => onChange(e.target.value || null)} />;
    case "boolean":
      return (
        <div className="flex items-center gap-2">
          <Switch checked={Boolean(value)} onCheckedChange={(v) => onChange(v)} />
          <span className="text-sm text-muted-foreground">{value ? "مفعّل" : "معطّل"}</span>
        </div>
      );
    case "image":
      return (
        <ImageUploader
          value={(value as string | null) ?? null}
          onChange={(url) => onChange(url)}
          label={field.label}
          aspect={field.aspect ?? "aspect-video"}
        />
      );
    case "images": {
      const arr = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className="space-y-2">
          {arr.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {arr.map((u, i) => (
                <div key={i} className="group relative overflow-hidden rounded-md border border-border">
                  <img src={u} alt="" className="aspect-video w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => onChange(arr.filter((_, k) => k !== i))}
                    className="absolute top-1 right-1 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
          )}
          <ImageUploader
            value={null}
            onChange={(url) => url && onChange([...arr, url])}
            label="إضافة صورة"
            aspect="aspect-video"
          />
        </div>
      );
    }
    case "icon":
      return <IconPicker value={String(value ?? "Stethoscope")} onChange={(v) => onChange(v)} />;
    case "list": {
      const arr = Array.isArray(value) ? (value as string[]) : [];
      return (
        <Textarea
          rows={field.rows ?? 4}
          placeholder={field.placeholder ?? "سطر لكل عنصر"}
          value={arr.join("\n")}
          onChange={(e) =>
            onChange(
              e.target.value
                .split("\n")
                .map((s) => s.trim())
                .filter((s) => s.length > 0),
            )
          }
        />
      );
    }
    case "select":
      return (
        <select
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value || null)}
        >
          <option value="">—</option>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      );
  }
}
