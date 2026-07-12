import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/primitives";
import { CollectionManager } from "@/components/admin/CollectionManager";

export const Route = createFileRoute("/admin/_app/faq")({
  component: FaqAdminPage,
});

function FaqAdminPage() {
  return (
    <>
      <PageHeader
        title="الأسئلة الشائعة"
        description="إدارة الأسئلة والأجوبة."
        breadcrumbs={[{ label: "الرئيسية", to: "/admin" }, { label: "المحتوى" }, { label: "الأسئلة" }]}
      />
      <CollectionManager
        table="faqs"
        queryKey="admin-faqs"
        publicQueryKey="public-faqs"
        titleField="question"
        toggleField="is_active"
        fields={[
          { key: "question", label: "السؤال", type: "text", required: true },
          { key: "answer", label: "الإجابة", type: "textarea", rows: 4 },
          { key: "is_active", label: "نشط", type: "boolean", hideInTable: true },
          { key: "display_order", label: "الترتيب", type: "number", hideInTable: true },
        ]}
        createDefaults={{ is_active: true }}
      />
    </>
  );
}
