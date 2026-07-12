import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/primitives";
import { CollectionManager } from "@/components/admin/CollectionManager";

export const Route = createFileRoute("/admin/_app/before-after")({
  component: BAAdminPage,
});

function BAAdminPage() {
  return (
    <>
      <PageHeader
        title="قبل و بعد"
        description="إدارة حالات قبل وبعد — أضف اسم الحالة وصورتَي قبل وبعد فقط."
        breadcrumbs={[{ label: "الرئيسية", to: "/admin" }, { label: "المحتوى" }, { label: "قبل و بعد" }]}
      />
      <CollectionManager
        table="before_after_cases"
        queryKey="admin-before-after"
        publicQueryKey="public-before-after"
        titleField="title_ar"
        toggleField="is_active"
        fields={[
          { key: "title_ar", label: "اسم الحالة", type: "text", required: true },
          { key: "before_image", label: "صورة قبل", type: "image", required: true, hideInTable: true },
          { key: "after_image", label: "صورة بعد", type: "image", required: true, hideInTable: true },
          { key: "is_active", label: "نشط", type: "boolean", hideInTable: true },
        ]}
        createDefaults={{ is_active: true }}
      />
    </>
  );
}

