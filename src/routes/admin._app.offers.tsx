import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/primitives";
import { CollectionManager } from "@/components/admin/CollectionManager";

export const Route = createFileRoute("/admin/_app/offers")({
  component: OffersAdminPage,
});

function OffersAdminPage() {
  return (
    <>
      <PageHeader
        title="العروض"
        description="إدارة عروض العيادة الحالية."
        breadcrumbs={[{ label: "الرئيسية", to: "/admin" }, { label: "المحتوى" }, { label: "العروض" }]}
      />
      <CollectionManager
        table="offers"
        queryKey="admin-offers"
        publicQueryKey="public-offers"
        titleField="title"
        toggleField="is_active"
        fields={[
          { key: "title", label: "عنوان العرض", type: "text", required: true },
          { key: "description", label: "الوصف", type: "textarea", rows: 3 },
          { key: "icon", label: "الأيقونة", type: "icon", hideInTable: true },
          { key: "image_url", label: "الصورة", type: "image", hideInTable: true },
          { key: "discount", label: "الخصم", type: "text" },
          { key: "old_price", label: "السعر القديم", type: "text", hideInTable: true },
          { key: "new_price", label: "السعر الجديد", type: "text", hideInTable: true },
          { key: "badge", label: "شارة", type: "text", hideInTable: true },
          { key: "start_date", label: "تاريخ البدء", type: "date", hideInTable: true },
          { key: "end_date", label: "تاريخ الانتهاء", type: "date", hideInTable: true },
          { key: "button_text", label: "نص الزر", type: "text", hideInTable: true },
          { key: "button_url", label: "رابط الزر", type: "text", hideInTable: true },
          { key: "is_active", label: "نشط", type: "boolean", hideInTable: true },
          { key: "display_order", label: "الترتيب", type: "number", hideInTable: true },
        ]}
        createDefaults={{ icon: "Percent", is_active: true, button_text: "احجز الآن", button_url: "#book" }}
      />
    </>
  );
}
