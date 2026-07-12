import { createFileRoute } from "@tanstack/react-router";
import { Image as ImageIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionCard, EmptyState } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/_app/media")({
  component: MediaPage,
});

function MediaPage() {
  return (
    <>
      <PageHeader
        title="مكتبة الوسائط"
        description="إدارة جميع الصور والملفات المرفوعة إلى الموقع."
        breadcrumbs={[{ label: "الرئيسية", to: "/admin" }, { label: "مكتبة الوسائط" }]}
        actions={
          <Button className="gap-2 bg-gradient-to-l from-[color:var(--color-gold-dark)] to-[color:var(--color-gold-light)] text-white hover:opacity-95">
            <Upload className="h-4 w-4" />
            رفع ملفات
          </Button>
        }
      />
      <SectionCard>
        <EmptyState
          icon={ImageIcon}
          title="مكتبة الوسائط فارغة"
          description="ارفع الصور والملفات لاستخدامها في مختلف أقسام الموقع."
          action={
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              رفع أول ملف
            </Button>
          }
        />
      </SectionCard>
    </>
  );
}
