import { useEffect, useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionCard } from "@/components/admin/primitives";
import { FieldInput, type FieldDef } from "@/components/admin/CollectionManager";
import { cmsGetSingleton, cmsUpdateSingleton, type SingletonTable } from "@/lib/cms.functions";

export function SingletonEditor({
  table,
  fields,
  queryKey,
  publicQueryKey,
  layout,
}: {
  table: SingletonTable;
  fields: FieldDef[];
  queryKey: string;
  publicQueryKey?: string | string[];
  layout?: (nodes: Record<string, ReactNode>, values: Record<string, unknown>) => ReactNode;
}) {
  const qc = useQueryClient();
  const get = useServerFn(cmsGetSingleton);
  const save = useServerFn(cmsUpdateSingleton);

  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: () => get({ data: { table } }),
  });

  const [values, setValues] = useState<Record<string, unknown>>({});
  useEffect(() => {
    if (data) setValues(data as Record<string, unknown>);
  }, [data]);

  const mut = useMutation({
    mutationFn: (v: Record<string, unknown>) => save({ data: { table, values: v } }),
    onSuccess: () => {
      toast.success("تم الحفظ");
      qc.invalidateQueries({ queryKey: [queryKey] });
      if (publicQueryKey) {
        const keys = Array.isArray(publicQueryKey) ? publicQueryKey : [publicQueryKey];
        keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
      }
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "فشل الحفظ"),
  });

  const set = (k: string, v: unknown) => setValues((s) => ({ ...s, [k]: v }));

  if (isLoading) {
    return (
      <SectionCard>
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </SectionCard>
    );
  }

  const nodes: Record<string, ReactNode> = {};
  for (const f of fields) {
    nodes[f.key] = (
      <div>
        <Label className="mb-1.5 block text-xs font-semibold">
          {f.label} {f.required && <span className="text-destructive">*</span>}
        </Label>
        <FieldInput field={f} value={values[f.key]} onChange={(v) => set(f.key, v)} />
      </div>
    );
  }

  return (
    <>
      {layout ? (
        layout(nodes, values)
      ) : (
        <SectionCard>
          <div className="grid gap-4">{fields.map((f) => <div key={f.key}>{nodes[f.key]}</div>)}</div>
        </SectionCard>
      )}
      <div className="mt-4 flex justify-end">
        <Button onClick={() => mut.mutate(values)} disabled={mut.isPending} className="gap-2">
          {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          حفظ التعديلات
        </Button>
      </div>
    </>
  );
}
