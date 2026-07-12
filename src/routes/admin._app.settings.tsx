import { createFileRoute } from "@tanstack/react-router";
import { Bell, Globe, Palette, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader, SectionCard } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/_app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <PageHeader
        title="الإعدادات"
        description="إعدادات عامة للوحة التحكم والموقع."
        breadcrumbs={[{ label: "الرئيسية", to: "/admin" }, { label: "الإعدادات" }]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="معلومات الموقع" description="البيانات الأساسية الظاهرة للزوار.">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>اسم الموقع</Label>
              <Input defaultValue="مركز رويال ديـنـتـال" />
            </div>
            <div className="space-y-1.5">
              <Label>الشعار</Label>
              <Input defaultValue="طب أسنان بلمسة ملكية" />
            </div>
            <div className="space-y-1.5">
              <Label>الرابط الرسمي</Label>
              <Input dir="ltr" defaultValue="https://royaldental.eg" />
            </div>
            <Button className="bg-gradient-to-l from-[color:var(--color-gold-dark)] to-[color:var(--color-gold-light)] text-white hover:opacity-95">
              حفظ التغييرات
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="التفضيلات" description="إعدادات لوحة التحكم الشخصية.">
          <ul className="divide-y divide-border">
            {[
              { icon: Palette, title: "الوضع الليلي", desc: "التبديل بين الوضع الفاتح والداكن", on: false },
              { icon: Bell, title: "إشعارات البريد", desc: "استقبال إشعارات الأحداث المهمة", on: true },
              { icon: Globe, title: "التحديث التلقائي", desc: "تحديث بيانات اللوحة تلقائياً", on: true },
              { icon: Shield, title: "المصادقة الثنائية", desc: "طبقة حماية إضافية عند تسجيل الدخول", on: false },
            ].map((p, i) => (
              <li key={i} className="flex items-center gap-3 py-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-muted/60 text-[color:var(--color-gold-dark)]">
                  <p.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{p.title}</div>
                  <div className="text-[11px] text-muted-foreground">{p.desc}</div>
                </div>
                <Switch defaultChecked={p.on} />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </>
  );
}
