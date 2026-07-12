import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/admin/primitives";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/admin/_app/contact")({
  component: ContactAdminPage,
});

function PhonesEditor({ value, onChange }: { value: unknown; onChange: (v: string[]) => void }) {
  const arr = Array.isArray(value) ? (value as string[]) : [];
  const [items, setItems] = useState<string[]>(arr);
  useEffect(() => { setItems(Array.isArray(value) ? (value as string[]) : []); }, [value]);
  const commit = (v: string[]) => { setItems(v); onChange(v); };
  return (
    <div className="space-y-2">
      {items.map((p, i) => (
        <div key={i} className="flex gap-2">
          <Input value={p} onChange={(e) => commit(items.map((x, j) => (j === i ? e.target.value : x)))} placeholder="+20 ..." />
          <Button variant="ghost" size="icon" onClick={() => commit(items.filter((_, j) => j !== i))} className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => commit([...items, ""])} className="gap-2">
        <Plus className="h-4 w-4" /> إضافة رقم
      </Button>
    </div>
  );
}

function ContactAdminPage() {
  return (
    <>
      <PageHeader
        title="التواصل"
        description="إدارة معلومات التواصل والحسابات الاجتماعية."
        breadcrumbs={[{ label: "الرئيسية", to: "/admin" }, { label: "التواصل" }]}
      />
      <SectionCard>
        <SingletonEditor
          table="contact_content"
          queryKey="admin-contact"
          publicQueryKey="public-contact"
          fields={[
            { key: "whatsapp", label: "رقم واتساب العيادة (يُستخدم لاستقبال طلبات الحجز)", type: "text" },
            { key: "email", label: "البريد الإلكتروني", type: "text" },
            { key: "address", label: "العنوان", type: "text" },
            { key: "working_hours", label: "ساعات العمل", type: "text" },
            { key: "google_maps_embed_url", label: "رابط خريطة جوجل (embed)", type: "text" },
            { key: "facebook_url", label: "فيسبوك", type: "text" },
            { key: "instagram_url", label: "إنستجرام", type: "text" },
            { key: "tiktok_url", label: "تيك توك", type: "text" },
            { key: "snapchat_url", label: "سناب شات", type: "text" },
            { key: "youtube_url", label: "يوتيوب", type: "text" },
            { key: "offers_section_enabled", label: "إظهار قسم العروض في الصفحة الرئيسية", type: "boolean" },
          ]}
          layout={(nodes, values) => (
            <div className="grid gap-6 lg:grid-cols-2">
              <SectionCard title="أرقام الهاتف">
                <Label className="mb-1.5 block text-xs font-semibold">قائمة الأرقام</Label>
                <PhonesEditor
                  value={values.phones}
                  onChange={(v) => { (values as Record<string, unknown>).phones = v; }}
                />
              </SectionCard>
              <SectionCard title="معلومات عامة">
                <div className="grid gap-4">
                  {nodes.whatsapp}{nodes.email}{nodes.address}{nodes.working_hours}
                </div>
              </SectionCard>
              <SectionCard title="الخريطة">
                {nodes.google_maps_embed_url}
              </SectionCard>
              <SectionCard title="حسابات التواصل الاجتماعي">
                <div className="grid gap-4">
                  {nodes.facebook_url}{nodes.instagram_url}{nodes.tiktok_url}{nodes.snapchat_url}{nodes.youtube_url}
                </div>
              </SectionCard>
              <SectionCard title="أقسام الموقع">
                {nodes.offers_section_enabled}
              </SectionCard>
            </div>
          )}
        />
      </SectionCard>
    </>
  );
}
