import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/primitives";
import { ServiceForm, type ServiceFormValues } from "@/components/admin/ServiceForm";
import { createService } from "@/lib/services.functions";

export const Route = createFileRoute("/admin/_app/services/new")({
  component: NewServicePage,
});

function NewServicePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const create = useServerFn(createService);

  const mut = useMutation({
    mutationFn: (values: ServiceFormValues) => create({ data: values }),
    onSuccess: () => {
      toast.success("تم إنشاء الخدمة");
      qc.invalidateQueries({ queryKey: ["admin-services"] });
      qc.invalidateQueries({ queryKey: ["public-services"] });
      navigate({ to: "/admin/services" });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "فشل الحفظ"),
  });

  return (
    <>
      <PageHeader
        title="إضافة خدمة جديدة"
        breadcrumbs={[
          { label: "الرئيسية", to: "/admin" },
          { label: "الخدمات", to: "/admin/services" },
          { label: "خدمة جديدة" },
        ]}
      />
      <ServiceForm
        submitting={mut.isPending}
        onSubmit={(v) => mut.mutate(v)}
        onCancel={() => navigate({ to: "/admin/services" })}
      />
    </>
  );
}
