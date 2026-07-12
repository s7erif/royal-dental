import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/admin/primitives";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { CollectionManager } from "@/components/admin/CollectionManager";

export const Route = createFileRoute("/admin/_app/testimonials")({
  component: TestimonialsAdminPage,
});

function TestimonialsAdminPage() {
  return (
    <>
      <PageHeader
        title="آراء المرضى"
        description="إدارة آراء المرضى وملخّص جوجل."
        breadcrumbs={[{ label: "الرئيسية", to: "/admin" }, { label: "المحتوى" }, { label: "الآراء" }]}
      />
      <div className="space-y-6">
        <SectionCard title="ملخّص Google Reviews">
          <SingletonEditor
            table="testimonials_summary"
            queryKey="admin-tsummary"
            publicQueryKey="public-tsummary"
            fields={[
              { key: "google_rating", label: "التقييم", type: "number" },
              { key: "google_reviews_count", label: "عدد التقييمات", type: "number" },
              { key: "google_button_url", label: "رابط زر جوجل", type: "text" },
            ]}
          />
        </SectionCard>
        <div>
          <h2 className="mb-3 text-lg font-bold">الآراء</h2>
          <CollectionManager
            table="testimonials"
            queryKey="admin-testimonials"
            publicQueryKey="public-testimonials"
            titleField="patient_name"
            toggleField="is_active"
            fields={[
              { key: "patient_name", label: "اسم المريض", type: "text", required: true },
              { key: "rating", label: "التقييم (1-5)", type: "number" },
              { key: "review", label: "الرأي", type: "textarea", rows: 3 },
              { key: "patient_image", label: "صورة المريض", type: "image", hideInTable: true },
              { key: "date_label", label: "تاريخ ظاهر", type: "text", hideInTable: true },
              { key: "is_active", label: "نشط", type: "boolean", hideInTable: true },
              { key: "display_order", label: "الترتيب", type: "number", hideInTable: true },
            ]}
            createDefaults={{ rating: 5, is_active: true }}
          />
        </div>
      </div>
    </>
  );
}
