import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save, ExternalLink } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { IconPicker } from "@/components/admin/IconPicker";
import { getHeroAdmin, updateHero, type HeroInputT } from "@/lib/hero.functions";

export const Route = createFileRoute("/admin/_app/hero")({
  component: HeroAdminPage,
});

const emptyValues: HeroInputT = {
  badge_text: "",
  title_line1: "",
  title_highlight: "",
  subtitle: "",
  primary_cta_label: "",
  primary_cta_url: "#book",
  secondary_cta_label: "",
  secondary_cta_url: "",
  image_url: null,
  image_caption_eyebrow: "",
  image_caption_title: "",
  floating_items: [],
};

function HeroAdminPage() {
  const qc = useQueryClient();
  const get = useServerFn(getHeroAdmin);
  const save = useServerFn(updateHero);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-hero"],
    queryFn: () => get(),
  });

  const [values, setValues] = useState<HeroInputT>(emptyValues);

  useEffect(() => {
    if (!data) return;
    setValues({
      badge_text: data.badge_text ?? "",
      title_line1: data.title_line1 ?? "",
      title_highlight: data.title_highlight ?? "",
      subtitle: data.subtitle ?? "",
      primary_cta_label: data.primary_cta_label ?? "",
      primary_cta_url: data.primary_cta_url ?? "",
      secondary_cta_label: data.secondary_cta_label ?? "",
      secondary_cta_url: data.secondary_cta_url ?? "",
      image_url: data.image_url ?? null,
      image_caption_eyebrow: data.image_caption_eyebrow ?? "",
      image_caption_title: data.image_caption_title ?? "",
      floating_items: Array.isArray(data.floating_items)
        ? (data.floating_items as { icon: string; label: string }[])
        : [],
    });
  }, [data]);

  const mut = useMutation({
    mutationFn: (v: HeroInputT) => save({ data: v }),
    onSuccess: () => {
      toast.success("تم حفظ التعديلات");
      qc.invalidateQueries({ queryKey: ["admin-hero"] });
      qc.invalidateQueries({ queryKey: ["public-hero"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "فشل الحفظ"),
  });

  const set = <K extends keyof HeroInputT>(k: K, v: HeroInputT[K]) =>
    setValues((s) => ({ ...s, [k]: v }));

  const addFloating = () =>
    set("floating_items", [...values.floating_items, { icon: "Sparkles", label: "" }]);
  const removeFloating = (i: number) =>
    set("floating_items", values.floating_items.filter((_, idx) => idx !== i));
  const updateFloating = (i: number, patch: Partial<{ icon: string; label: string }>) =>
    set(
      "floating_items",
      values.floating_items.map((f, idx) => (idx === i ? { ...f, ...patch } : f)),
    );

  return (
    <>
      <PageHeader
        title="الواجهة الرئيسية"
        description="إدارة محتوى قسم الهيرو في الصفحة الرئيسية."
        breadcrumbs={[
          { label: "الرئيسية", to: "/admin" },
          { label: "المحتوى" },
          { label: "الواجهة الرئيسية" },
        ]}
        actions={
          <>
            <a
              href="/#home"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-muted"
            >
              <ExternalLink className="h-4 w-4" />
              عرض على الموقع
            </a>
            <Button
              onClick={() => mut.mutate(values)}
              disabled={mut.isPending || isLoading}
              className="gap-2"
            >
              {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              حفظ التعديلات
            </Button>
          </>
        }
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <SectionCard title="النصوص الأساسية" description="العنوان والوصف الظاهر أعلى الصفحة.">
              <div className="grid gap-4">
                <Field label="نص الشارة العلوية">
                  <Input
                    value={values.badge_text}
                    onChange={(e) => set("badge_text", e.target.value)}
                    placeholder="مركز رويال ديـنـتـال"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="العنوان (سطر 1)">
                    <Input
                      value={values.title_line1}
                      onChange={(e) => set("title_line1", e.target.value)}
                      placeholder="ابتسامتك تستحق"
                    />
                  </Field>
                  <Field label="العنوان المميز (سطر 2)">
                    <Input
                      value={values.title_highlight}
                      onChange={(e) => set("title_highlight", e.target.value)}
                      placeholder="رعاية ملكية"
                    />
                  </Field>
                </div>
                <Field label="الوصف">
                  <Textarea
                    rows={4}
                    value={values.subtitle}
                    onChange={(e) => set("subtitle", e.target.value)}
                    placeholder="طب أسنان متقدم..."
                  />
                </Field>
              </div>
            </SectionCard>

            <SectionCard title="أزرار الدعوة للإجراء" description="زران يظهران أسفل النص.">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div className="text-xs font-semibold text-muted-foreground">الزر الأساسي</div>
                  <Field label="النص">
                    <Input value={values.primary_cta_label} onChange={(e) => set("primary_cta_label", e.target.value)} placeholder="احجز موعدك" />
                  </Field>
                  <Field label="الرابط">
                    <Input value={values.primary_cta_url} onChange={(e) => set("primary_cta_url", e.target.value)} placeholder="#book" />
                  </Field>
                </div>
                <div className="space-y-4">
                  <div className="text-xs font-semibold text-muted-foreground">الزر الثانوي</div>
                  <Field label="النص">
                    <Input value={values.secondary_cta_label} onChange={(e) => set("secondary_cta_label", e.target.value)} placeholder="اتصل الآن" />
                  </Field>
                  <Field label="الرابط">
                    <Input value={values.secondary_cta_url} onChange={(e) => set("secondary_cta_url", e.target.value)} placeholder="tel:+201000000000" />
                  </Field>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="البطاقات العائمة"
              description="بطاقات صغيرة تظهر حول الصورة (بحد أقصى 8)."
              actions={
                <Button size="sm" variant="outline" onClick={addFloating} disabled={values.floating_items.length >= 8}>
                  <Plus className="h-4 w-4" />
                  إضافة
                </Button>
              }
            >
              {values.floating_items.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">لا توجد بطاقات بعد.</p>
              ) : (
                <div className="space-y-3">
                  {values.floating_items.map((f, i) => (
                    <div key={i} className="flex items-end gap-3 rounded-xl border border-border p-3">
                      <div className="w-40">
                        <Label className="mb-1.5 block text-xs">الأيقونة</Label>
                        <IconPicker value={f.icon} onChange={(v) => updateFloating(i, { icon: v })} />
                      </div>
                      <div className="flex-1">
                        <Label className="mb-1.5 block text-xs">النص</Label>
                        <Input value={f.label} onChange={(e) => updateFloating(i, { label: e.target.value })} />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeFloating(i)} className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard title="الصورة الرئيسية" description="صورة الطبيب أو صورة الهيرو.">
              <ImageUploader
                value={values.image_url ?? null}
                onChange={(url) => set("image_url", url)}
                label="صورة الهيرو"
                aspect="aspect-[4/5]"
              />
              <div className="mt-4 space-y-3">
                <Field label="عنوان علوي على الصورة">
                  <Input
                    value={values.image_caption_eyebrow}
                    onChange={(e) => set("image_caption_eyebrow", e.target.value)}
                    placeholder="الطبيب المؤسس"
                  />
                </Field>
                <Field label="العنوان الرئيسي على الصورة">
                  <Input
                    value={values.image_caption_title}
                    onChange={(e) => set("image_caption_title", e.target.value)}
                    placeholder="د. مصطفى بكر"
                  />
                </Field>
              </div>
            </SectionCard>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs font-semibold">{label}</Label>
      {children}
    </div>
  );
}
