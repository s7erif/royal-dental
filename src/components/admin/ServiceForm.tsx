import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Trash2, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SectionCard } from "@/components/admin/primitives";
import { IconPicker } from "@/components/admin/IconPicker";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { CategorySelector } from "@/components/admin/CategorySelector";
import { cn } from "@/lib/utils";

const variantSchema = z.object({
  id: z.string().uuid().optional(),
  name_ar: z.string().trim().min(1, "الاسم مطلوب"),
  description_ar: z.string().nullable().optional(),
  pricing_type: z.enum(["fixed", "range", "starting_from"]),
  fixed_price: z.number().nonnegative().nullable().optional(),
  min_price: z.number().nonnegative().nullable().optional(),
  max_price: z.number().nonnegative().nullable().optional(),
  starting_price: z.number().nonnegative().nullable().optional(),
  display_order: z.number().int().min(0),
  is_active: z.boolean(),
});

const schema = z.object({
  name_ar: z.string().trim().min(1, "اسم الخدمة مطلوب"),
  short_desc_ar: z.string().trim().max(500).nullable().optional(),
  icon: z.string().min(1),
  cover_image: z.string().nullable().optional(),
  category_id: z.string().uuid("التصنيف مطلوب"),
  service_type: z.enum(["simple", "grouped"]),
  pricing_type: z.enum(["fixed", "range", "starting_from", "consultation"]),
  fixed_price: z.number().nonnegative().nullable().optional(),
  min_price: z.number().nonnegative().nullable().optional(),
  max_price: z.number().nonnegative().nullable().optional(),
  starting_price: z.number().nonnegative().nullable().optional(),
  variants: z.array(variantSchema),
  display_order: z.number().int().min(0),
  status: z.enum(["active", "hidden", "draft"]),
});

export type ServiceFormValues = z.infer<typeof schema>;

const defaultValues: ServiceFormValues = {
  name_ar: "",
  short_desc_ar: "",
  icon: "Stethoscope",
  cover_image: null,
  category_id: "",
  service_type: "simple",
  pricing_type: "fixed",
  fixed_price: null,
  min_price: null,
  max_price: null,
  starting_price: null,
  variants: [],
  display_order: 0,
  status: "active",
};

export function ServiceForm({
  initialValues,
  submitting,
  onSubmit,
  onCancel,
}: {
  initialValues?: Partial<ServiceFormValues>;
  submitting?: boolean;
  onSubmit: (values: ServiceFormValues) => void;
  onCancel: () => void;
}) {
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } =
    useForm<ServiceFormValues>({
      resolver: zodResolver(schema),
      defaultValues: { ...defaultValues, ...initialValues },
    });

  const values = watch();
  const { fields, append, remove, move } = useFieldArray({ control, name: "variants" });

  const isGrouped = values.service_type === "grouped";
  const isActive = values.status === "active";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <SectionCard title="معلومات الخدمة">
            <div className="space-y-4">
              <Field label="اسم الخدمة *" error={errors.name_ar?.message}>
                <Input {...register("name_ar")} placeholder="مثال: زراعة الأسنان" />
              </Field>
              <Field label="وصف مختصر" hint="جملة قصيرة تظهر داخل البطاقة (اختياري).">
                <Textarea rows={2} {...register("short_desc_ar")} placeholder="نبذة موجزة عن الخدمة" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="التصنيف *" error={errors.category_id?.message}>
                  <Controller
                    name="category_id"
                    control={control}
                    render={({ field }) => (
                      <CategorySelector value={field.value || null} onChange={(v) => field.onChange(v || "")} />
                    )}
                  />
                </Field>
                <Field label="ترتيب العرض">
                  <Input type="number" min={0} {...register("display_order", { valueAsNumber: true })} />
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* Type toggle */}
          <SectionCard title="نوع الخدمة">
            <div className="grid gap-3 sm:grid-cols-2">
              <TypeCard
                active={!isGrouped}
                title="خدمة بسيطة"
                desc="سعر واحد يظهر مباشرة في الكارت (كشف، تنظيف، حشو…)."
                onClick={() => setValue("service_type", "simple")}
              />
              <TypeCard
                active={isGrouped}
                title="خدمة متعددة الأنواع"
                desc="عدة خيارات وأسعار (تيجان، زراعة، عصب…) تُعرض في نافذة تفاصيل."
                onClick={() => setValue("service_type", "grouped")}
              />
            </div>
          </SectionCard>

          {/* Simple pricing */}
          {!isGrouped && (
            <SectionCard title="السعر">
              <div className="space-y-3">
                <Field label="نوع السعر">
                  <select
                    {...register("pricing_type")}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="fixed">سعر ثابت</option>
                    <option value="range">نطاق (من - إلى)</option>
                    <option value="starting_from">يبدأ من</option>
                    <option value="consultation">حسب الحالة (كشف)</option>
                  </select>
                </Field>
                {values.pricing_type === "fixed" && (
                  <Field label="السعر (جنيه)">
                    <Input
                      type="number" min={0}
                      {...register("fixed_price", {
                        setValueAs: (v) => (v === "" || v == null ? null : Number(v)),
                      })}
                      placeholder="800"
                    />
                  </Field>
                )}
                {values.pricing_type === "range" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="أقل سعر"><Input type="number" min={0}
                      {...register("min_price", { setValueAs: (v) => v === "" || v == null ? null : Number(v) })} /></Field>
                    <Field label="أعلى سعر"><Input type="number" min={0}
                      {...register("max_price", { setValueAs: (v) => v === "" || v == null ? null : Number(v) })} /></Field>
                  </div>
                )}
                {values.pricing_type === "starting_from" && (
                  <Field label="يبدأ من (جنيه)">
                    <Input type="number" min={0}
                      {...register("starting_price", { setValueAs: (v) => v === "" || v == null ? null : Number(v) })} />
                  </Field>
                )}
                {values.pricing_type === "consultation" && (
                  <div className="rounded-md border border-dashed border-[color:var(--color-gold)]/40 bg-[color:var(--color-gold-light)]/10 px-3 py-2 text-xs">
                    ستظهر شارة <b className="text-[color:var(--color-gold-dark)]">حسب الحالة</b> بدلاً من السعر.
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Grouped variants */}
          {isGrouped && (
            <SectionCard
              title="الأنواع والأسعار"
              actions={
                <Button
                  type="button" size="sm" variant="outline"
                  onClick={() =>
                    append({
                      name_ar: "",
                      description_ar: "",
                      pricing_type: "fixed",
                      fixed_price: null,
                      min_price: null,
                      max_price: null,
                      starting_price: null,
                      display_order: fields.length,
                      is_active: true,
                    })
                  }
                >
                  <Plus className="ml-1 h-3.5 w-3.5" />
                  إضافة نوع
                </Button>
              }
            >
              {fields.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                  لا يوجد أنواع بعد. اضغط «إضافة نوع» لإدخال أول نوع.
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map((f, idx) => {
                    const ptype = values.variants?.[idx]?.pricing_type ?? "fixed";
                    return (
                      <div key={f.id} className="rounded-xl border border-border bg-card p-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex flex-col items-center gap-1 text-muted-foreground">
                            <GripVertical className="h-4 w-4" />
                          </div>
                          <div className="grid flex-1 gap-3">
                            <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
                              <div>
                                <Label className="text-xs font-semibold">اسم النوع *</Label>
                                <Input
                                  className="mt-1"
                                  {...register(`variants.${idx}.name_ar` as const)}
                                  placeholder="مثال: طربوش زركونيا"
                                />
                              </div>
                              <div>
                                <Label className="text-xs font-semibold">نوع السعر</Label>
                                <select
                                  className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                  {...register(`variants.${idx}.pricing_type` as const)}
                                >
                                  <option value="fixed">سعر ثابت</option>
                                  <option value="range">نطاق (من - إلى)</option>
                                  <option value="starting_from">يبدأ من</option>
                                </select>
                              </div>
                            </div>

                            {ptype === "fixed" && (
                              <div>
                                <Label className="text-xs font-semibold">السعر (جنيه)</Label>
                                <Input
                                  className="mt-1" type="number" min={0}
                                  {...register(`variants.${idx}.fixed_price` as const, {
                                    setValueAs: (v) => (v === "" || v == null ? null : Number(v)),
                                  })}
                                  placeholder="2500"
                                />
                              </div>
                            )}
                            {ptype === "range" && (
                              <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                  <Label className="text-xs font-semibold">أقل سعر</Label>
                                  <Input className="mt-1" type="number" min={0}
                                    {...register(`variants.${idx}.min_price` as const, {
                                      setValueAs: (v) => (v === "" || v == null ? null : Number(v)),
                                    })} />
                                </div>
                                <div>
                                  <Label className="text-xs font-semibold">أعلى سعر</Label>
                                  <Input className="mt-1" type="number" min={0}
                                    {...register(`variants.${idx}.max_price` as const, {
                                      setValueAs: (v) => (v === "" || v == null ? null : Number(v)),
                                    })} />
                                </div>
                              </div>
                            )}
                            {ptype === "starting_from" && (
                              <div>
                                <Label className="text-xs font-semibold">يبدأ من (جنيه)</Label>
                                <Input className="mt-1" type="number" min={0}
                                  {...register(`variants.${idx}.starting_price` as const, {
                                    setValueAs: (v) => (v === "" || v == null ? null : Number(v)),
                                  })} />
                              </div>
                            )}

                            <div>
                              <Label className="text-xs font-semibold">وصف (اختياري)</Label>
                              <Textarea
                                rows={2}
                                className="mt-1"
                                {...register(`variants.${idx}.description_ar` as const)}
                                placeholder="ملاحظة سريعة عن هذا النوع"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col items-center gap-1">
                            <Button
                              type="button" size="icon" variant="ghost" className="h-7 w-7"
                              disabled={idx === 0}
                              onClick={() => move(idx, idx - 1)}
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button" size="icon" variant="ghost" className="h-7 w-7"
                              disabled={idx === fields.length - 1}
                              onClick={() => move(idx, idx + 1)}
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button" size="icon" variant="ghost"
                              className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => remove(idx)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </SectionCard>
          )}
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <SectionCard title="النشر">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
              <div>
                <div className="text-sm font-semibold">مفعّلة</div>
                <div className="text-[11px] text-muted-foreground">تظهر للعملاء في الموقع.</div>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={(v) => setValue("status", v ? "active" : "hidden")}
              />
            </div>
          </SectionCard>

          <SectionCard title="أيقونة الخدمة">
            <Controller
              name="icon"
              control={control}
              render={({ field }) => <IconPicker value={field.value} onChange={field.onChange} />}
            />
          </SectionCard>

          <SectionCard title="صورة (اختياري)">
            <Controller
              name="cover_image"
              control={control}
              render={({ field }) => (
                <ImageUploader
                  label=""
                  value={field.value || null}
                  onChange={(v) => field.onChange(v || null)}
                />
              )}
            />
          </SectionCard>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-end gap-2 border-t border-border bg-background/80 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button
          type="submit" disabled={submitting}
          className="gap-1.5 bg-gradient-to-l from-[color:var(--color-gold-dark)] to-[color:var(--color-gold-light)] text-white hover:opacity-95"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          حفظ
        </Button>
      </div>
    </form>
  );
}

function Field({
  label, error, hint, children,
}: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold">{label}</Label>
      {children}
      {hint && !error && <div className="text-[11px] text-muted-foreground">{hint}</div>}
      {error && <div className="text-[11px] text-destructive">{error}</div>}
    </div>
  );
}

function TypeCard({
  active, title, desc, onClick,
}: { active: boolean; title: string; desc: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border p-4 text-right transition-all",
        active
          ? "border-[color:var(--color-gold-dark)] bg-[color:var(--color-gold-light)]/10 shadow-[0_10px_30px_-10px_rgba(200,162,75,0.4)]"
          : "border-border bg-card hover:border-[color:var(--color-gold)]/50",
      )}
    >
      <div className="text-sm font-bold">{title}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{desc}</div>
    </button>
  );
}
