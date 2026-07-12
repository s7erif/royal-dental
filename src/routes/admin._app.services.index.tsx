import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/primitives";
import { ServicesTable, type ServiceRow } from "@/components/admin/ServicesTable";
import { ConfirmDialog } from "@/components/admin/primitives";
import {
  listServicesAdmin, deleteServices, duplicateService,
  bulkUpdateServices, reorderServices,
} from "@/lib/services.functions";
import { useState } from "react";

export const Route = createFileRoute("/admin/_app/services/")({
  component: ServicesListPage,
});

function ServicesListPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const list = useServerFn(listServicesAdmin);
  const del = useServerFn(deleteServices);
  const dup = useServerFn(duplicateService);
  const bulk = useServerFn(bulkUpdateServices);
  const reorder = useServerFn(reorderServices);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: () => list() as Promise<ServiceRow[]>,
  });

  const [pendingDelete, setPendingDelete] = useState<string[] | null>(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-services"] });
    qc.invalidateQueries({ queryKey: ["public-services"] });
  };

  const delMut = useMutation({
    mutationFn: (ids: string[]) => del({ data: { ids } }),
    onSuccess: () => { toast.success("تم الحذف"); invalidate(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "فشل"),
  });

  const dupMut = useMutation({
    mutationFn: (id: string) => dup({ data: { id } }),
    onSuccess: () => { toast.success("تم إنشاء نسخة"); invalidate(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "فشل"),
  });

  const bulkMut = useMutation({
    mutationFn: (v: { ids: string[]; patch: { status: "active" | "hidden" } }) => bulk({ data: v }),
    onSuccess: () => { toast.success("تم التحديث"); invalidate(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "فشل"),
  });

  const reorderMut = useMutation({
    mutationFn: (orders: Array<{ id: string; display_order: number }>) => reorder({ data: { orders } }),
    onSuccess: invalidate,
  });

  const handleReorder = (id: string, direction: "up" | "down") => {
    const sorted = [...(data as ServiceRow[])].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((s) => s.id === id);
    const swap = direction === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= sorted.length) return;
    const a = sorted[idx], b = sorted[swap];
    reorderMut.mutate([
      { id: a.id, display_order: b.display_order },
      { id: b.id, display_order: a.display_order },
    ]);
  };

  return (
    <>
      <PageHeader
        title="الخدمات"
        description="إدارة قائمة خدمات العيادة."
        breadcrumbs={[{ label: "الرئيسية", to: "/admin" }, { label: "المحتوى" }, { label: "الخدمات" }]}
        actions={
          <Button asChild className="gap-2 bg-gradient-to-l from-[color:var(--color-gold-dark)] to-[color:var(--color-gold-light)] text-white hover:opacity-95">
            <Link to="/admin/services/new">
              <Plus className="h-4 w-4" />إضافة خدمة
            </Link>
          </Button>
        }
      />

      <ServicesTable
        services={data as ServiceRow[]}
        isLoading={isLoading}
        onEdit={(id) => navigate({ to: "/admin/services/$id/edit", params: { id } })}
        onDelete={(ids) => setPendingDelete(ids)}
        onDuplicate={(id) => dupMut.mutate(id)}
        onReorder={handleReorder}
        onBulkStatus={(ids, status) => bulkMut.mutate({ ids, patch: { status } })}
        onBulkDelete={(ids) => setPendingDelete(ids)}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        title={`حذف ${pendingDelete?.length || 0} خدمة؟`}
        description="لا يمكن التراجع عن هذا الإجراء."
        confirmLabel="حذف"
        destructive
        onConfirm={() => { if (pendingDelete) delMut.mutate(pendingDelete); setPendingDelete(null); }}
      />
    </>
  );
}
