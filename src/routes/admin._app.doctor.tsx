import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/admin/primitives";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { CollectionManager } from "@/components/admin/CollectionManager";

export const Route = createFileRoute("/admin/_app/doctor")({
  component: DoctorAdminPage,
});

function DoctorAdminPage() {
  return (
    <>
      <PageHeader
        title="الأطباء"
        description="إدارة قائمة الأطباء التي تظهر في السلايدر بالصفحة الرئيسية."
        breadcrumbs={[{ label: "الرئيسية", to: "/admin" }, { label: "المحتوى" }, { label: "الأطباء" }]}
      />

      <div className="space-y-8">
        <div>
          <h2 className="mb-3 text-lg font-bold">قائمة الأطباء</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            أضف أي عدد من الأطباء. اجعل طبيباً واحداً "مميز" ليظهر أولاً في السلايدر — عند اختيار مميز جديد يُلغى تلقائياً من الطبيب السابق.
          </p>
          <CollectionManager
            table="doctors"
            queryKey="admin-doctors"
            publicQueryKey="public-doctors"
            titleField="name"
            toggleField="is_active"
            fields={[
              { key: "name", label: "اسم الطبيب", type: "text", required: true },
              { key: "job_title", label: "المسمى الوظيفي", type: "text" },
              { key: "description", label: "نبذة", type: "textarea", rows: 4, hideInTable: true },
              { key: "image_url", label: "صورة الطبيب", type: "image", aspect: "aspect-[3/4]", hideInTable: true },
              { key: "years_experience", label: "سنوات الخبرة", type: "number", hideInTable: true },
              { key: "patients_count", label: "عدد المرضى", type: "number", hideInTable: true },
              { key: "specialties", label: "التخصصات (سطر لكل تخصص)", type: "list", hideInTable: true },
              { key: "certifications", label: "الشهادات (سطر لكل شهادة)", type: "list", hideInTable: true },
              { key: "is_featured", label: "طبيب مميز (يظهر أولاً)", type: "boolean" },
              { key: "is_active", label: "نشط", type: "boolean", hideInTable: true },
              { key: "display_order", label: "الترتيب", type: "number", hideInTable: true },
            ]}
            createDefaults={{ is_active: true, is_featured: false, years_experience: 0, patients_count: 0, specialties: [], certifications: [] }}
          />
        </div>

        <SectionCard title="عنوان القسم">
          <p className="mb-3 text-sm text-muted-foreground">النص الفوقي فقط يُستخدم فوق السلايدر (مثال: "تعرف على أطبائنا").</p>
          <SingletonEditor
            table="doctor_content"
            queryKey="admin-doctor"
            publicQueryKey={["public-doctor", "public-doctors"]}
            fields={[
              { key: "eyebrow", label: "النص الفوقي", type: "text" },
            ]}
          />
        </SectionCard>
      </div>
    </>
  );
}
