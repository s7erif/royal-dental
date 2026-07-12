import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/admin/primitives";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { CollectionManager } from "@/components/admin/CollectionManager";

export const Route = createFileRoute("/admin/_app/about")({
  component: AboutAdminPage,
});

function AboutAdminPage() {
  return (
    <>
      <PageHeader
        title="عن العيادة"
        description="إدارة محتوى قسم من نحن، المزايا والخط الزمني."
        breadcrumbs={[{ label: "الرئيسية", to: "/admin" }, { label: "المحتوى" }, { label: "عن العيادة" }]}
      />

      <div className="space-y-6">
        <SectionCard title="المحتوى الرئيسي" description="النصوص والصورة الرئيسية.">
          <SingletonEditor
            table="about_content"
            queryKey="admin-about"
            publicQueryKey={["public-about", "public-advantages"]}
            fields={[
              { key: "eyebrow", label: "النص الفوقي", type: "text" },
              { key: "title", label: "العنوان", type: "text", required: true },
              { key: "highlight", label: "الكلمة المميزة", type: "text" },
              { key: "description", label: "الوصف", type: "textarea", rows: 5 },
              { key: "image_url", label: "الصورة الرئيسية", type: "image" },
              { key: "badge_title", label: "عنوان الشارة العائمة", type: "text" },
              { key: "badge_subtitle", label: "الوصف الفرعي للشارة", type: "text" },
            ]}
          />
        </SectionCard>

        <div>
          <h2 className="mb-3 text-lg font-bold">المزايا</h2>
          <CollectionManager
            table="about_advantages"
            queryKey="admin-about-advantages"
            publicQueryKey="public-advantages"
            titleField="title"
            fields={[
              { key: "icon", label: "الأيقونة", type: "icon" },
              { key: "title", label: "النص", type: "text", required: true },
              { key: "display_order", label: "الترتيب", type: "number", hideInTable: true },
            ]}
            createDefaults={{ icon: "Check" }}
          />
        </div>

        <div>
          <h2 className="mb-3 text-lg font-bold">الخط الزمني</h2>
          <CollectionManager
            table="about_timeline"
            queryKey="admin-about-timeline"
            publicQueryKey="public-timeline"
            titleField="year"
            fields={[
              { key: "year", label: "السنة", type: "text", required: true },
              { key: "title", label: "العنوان", type: "text" },
              { key: "description", label: "الوصف", type: "textarea", rows: 2 },
              { key: "display_order", label: "الترتيب", type: "number", hideInTable: true },
            ]}
          />
        </div>
      </div>
    </>
  );
}
