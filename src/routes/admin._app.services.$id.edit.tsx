import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/primitives";
import { ServiceForm, type ServiceFormValues } from "@/components/admin/ServiceForm";
import { getServiceAdmin, updateService } from "@/lib/services.functions";

export const Route = createFileRoute("/admin/_app/services/$id/edit")({
  component: EditServicePage,
});

type VariantRow = {
  id: string;
  name_ar: string;
  description_ar: string | null;
  pricing_type: "fixed" | "range" | "starting_from" | "consultation";
  fixed_price: number | null;
  min_price: number | null;
  max_price: number | null;
  starting_price: number | null;
  display_order: number;
  is_active: boolean;
};

function EditServicePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const get = useServerFn(getServiceAdmin);
  const update = useServerFn(updateService);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-service", id],
    queryFn: () => get({ data: { id } }),
  });

  const mut = useMutation({
    mutationFn: (values: ServiceFormValues) => update({ data: { id, values } }),
    onSuccess: () => {
      toast.success("تم الحفظ");
      qc.invalidateQueries({ queryKey: ["admin-services"] });
      qc.invalidateQueries({ queryKey: ["public-services"] });
      qc.invalidateQueries({ queryKey: ["admin-service", id] });
      navigate({ to: "/admin/services" });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "فشل الحفظ"),
  });

  if (isLoading) return <div className="py-10 text-center text-sm text-muted-foreground">جاري التحميل...</div>;
  if (!data) return <div className="py-10 text-center text-sm text-muted-foreground">الخدمة غير موجودة</div>;

  const rawVariants = (Array.isArray((data as { variants?: unknown }).variants)
    ? (data as { variants: VariantRow[] }).variants
    : []) as VariantRow[];

  const initial: Partial<ServiceFormValues> = {
    name_ar: data.name_ar,
    short_desc_ar: data.short_desc_ar,
    icon: data.icon,
    cover_image: data.cover_image ?? null,
    category_id: data.category_id ?? "",
    service_type: (data as { service_type?: "simple" | "grouped" }).service_type ?? "simple",
    pricing_type: data.pricing_type,
    fixed_price: data.fixed_price,
    min_price: data.min_price,
    max_price: data.max_price,
    starting_price: data.starting_price,
    display_order: data.display_order,
    status: data.status,
    variants: rawVariants
      .filter((v) => v.pricing_type !== "consultation")
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((v) => ({
        id: v.id,
        name_ar: v.name_ar,
        description_ar: v.description_ar,
        pricing_type: v.pricing_type as "fixed" | "range" | "starting_from",
        fixed_price: v.fixed_price,
        min_price: v.min_price,
        max_price: v.max_price,
        starting_price: v.starting_price,
        display_order: v.display_order,
        is_active: v.is_active,
      })),
  };

  return (
    <>
      <PageHeader
        title={`تعديل: ${data.name_ar}`}
        breadcrumbs={[
          { label: "الرئيسية", to: "/admin" },
          { label: "الخدمات", to: "/admin/services" },
          { label: "تعديل" },
        ]}
      />
      <ServiceForm
        initialValues={initial}
        submitting={mut.isPending}
        onSubmit={(v) => mut.mutate(v)}
        onCancel={() => navigate({ to: "/admin/services" })}
      />
    </>
  );
}
