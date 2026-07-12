import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PageHeader } from "@/components/admin/primitives";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { cmsListAdmin } from "@/lib/cms.functions";

export const Route = createFileRoute("/admin/_app/gallery")({
  component: GalleryAdminPage,
});

function GalleryAdminPage() {
  const list = useServerFn(cmsListAdmin);
  const { data: cats = [] } = useQuery({
    queryKey: ["admin-gallery-cats"],
    queryFn: () => list({ data: { table: "gallery_categories" } }),
  });
  const catOptions = (cats as { id: string; name: string }[]).map((c) => ({ value: c.id, label: c.name }));

  return (
    <>
      <PageHeader
        title="المعرض"
        description="إدارة صور المعرض وتصنيفاتها."
        breadcrumbs={[{ label: "الرئيسية", to: "/admin" }, { label: "المحتوى" }, { label: "المعرض" }]}
      />

      <div className="space-y-6">
        <div>
          <h2 className="mb-3 text-lg font-bold">التصنيفات</h2>
          <CollectionManager
            table="gallery_categories"
            queryKey="admin-gallery-cats"
            publicQueryKey="public-gallery-cats"
            titleField="name"
            fields={[
              { key: "name", label: "اسم التصنيف", type: "text", required: true },
              { key: "slug", label: "المعرّف", type: "text", required: true },
              { key: "display_order", label: "الترتيب", type: "number", hideInTable: true },
            ]}
          />
        </div>

        <div>
          <h2 className="mb-3 text-lg font-bold">الصور</h2>
          <CollectionManager
            table="gallery_images"
            queryKey="admin-gallery-images"
            publicQueryKey="public-gallery-images"
            titleField="title_ar"
            toggleField="is_active"
            fields={[
              { key: "image_url", label: "الصورة", type: "image", required: true },
              { key: "title_ar", label: "العنوان بالعربية", type: "text" },
              { key: "title_en", label: "العنوان بالإنجليزية", type: "text" },
              { key: "category_id", label: "التصنيف", type: "select", options: catOptions },
              { key: "is_active", label: "نشط", type: "boolean", hideInTable: true },
              { key: "display_order", label: "الترتيب", type: "number", hideInTable: true },
            ]}
            createDefaults={{ is_active: true }}
          />

        </div>
      </div>
    </>
  );
}
