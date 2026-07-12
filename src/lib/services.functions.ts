import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ============ SERVICES ============

const VariantInput = z.object({
  id: z.string().uuid().optional(),
  name_ar: z.string().trim().min(1, "اسم النوع مطلوب").max(200),
  description_ar: z.string().max(2000).nullable().optional(),
  pricing_type: z.enum(["fixed", "range", "starting_from"]).default("fixed"),
  fixed_price: z.number().nonnegative().nullable().optional(),
  min_price: z.number().nonnegative().nullable().optional(),
  max_price: z.number().nonnegative().nullable().optional(),
  starting_price: z.number().nonnegative().nullable().optional(),
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

const ServiceInput = z.object({
  name_ar: z.string().trim().min(1, "الاسم مطلوب").max(200),
  short_desc_ar: z.string().trim().max(500).nullable().optional(),
  icon: z.string().min(1).default("Stethoscope"),
  cover_image: z.string().url().nullable().optional().or(z.literal("").transform(() => null)),
  category_id: z.string().uuid().nullable().optional(),
  service_type: z.enum(["simple", "grouped"]).default("simple"),
  // simple pricing
  pricing_type: z.enum(["fixed", "range", "starting_from", "consultation"]).default("consultation"),
  fixed_price: z.number().nonnegative().nullable().optional(),
  min_price: z.number().nonnegative().nullable().optional(),
  max_price: z.number().nonnegative().nullable().optional(),
  starting_price: z.number().nonnegative().nullable().optional(),
  // grouped variants
  variants: z.array(VariantInput).default([]),
  display_order: z.number().int().min(0).default(0),
  status: z.enum(["active", "hidden", "draft"]).default("active"),
});

export type ServiceFnInput = z.infer<typeof ServiceInput>;

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[\u0600-\u06FF]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "service"
  );
}

/** Replace all variants for a service_id with a fresh list. */
async function replaceVariants(
  service_id: string,
  variants: z.infer<typeof VariantInput>[],
) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error: delErr } = await supabaseAdmin
    .from("service_variants")
    .delete()
    .eq("service_id", service_id);
  if (delErr) throw new Error(delErr.message);
  if (!variants.length) return;
  const rows = variants.map((v, i) => ({
    service_id,
    name_ar: v.name_ar,
    description_ar: v.description_ar ?? null,
    pricing_type: v.pricing_type,
    fixed_price: v.pricing_type === "fixed" ? v.fixed_price ?? null : null,
    min_price: v.pricing_type === "range" ? v.min_price ?? null : null,
    max_price: v.pricing_type === "range" ? v.max_price ?? null : null,
    starting_price: v.pricing_type === "starting_from" ? v.starting_price ?? null : null,
    display_order: v.display_order ?? i,
    is_active: v.is_active ?? true,
  }));
  const { error: insErr } = await supabaseAdmin.from("service_variants").insert(rows);
  if (insErr) throw new Error(insErr.message);
}

export const listServicesAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { data, error } = await context.supabase
      .from("services")
      .select("*, category:service_categories(id, name_ar, slug), variants:service_variants(id)")
      .order("display_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getServiceAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { data: svc, error } = await context.supabase
      .from("services")
      .select(
        "*, category:service_categories(id, name_ar, slug), variants:service_variants(id, name_ar, description_ar, pricing_type, fixed_price, min_price, max_price, starting_price, display_order, is_active)",
      )
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return svc;
  });

async function buildServicePayload(values: ServiceFnInput, existingSlug?: string, excludeId?: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const baseSlug = existingSlug || slugify(values.name_ar);
  // Ensure unique
  let slug = baseSlug;
  let i = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data } = await supabaseAdmin.from("services").select("id").eq("slug", slug).limit(1);
    const hit = data?.[0];
    if (!hit || hit.id === excludeId) break;
    slug = `${baseSlug}-${i++}`;
  }

  const isSimple = values.service_type === "simple";
  return {
    name_ar: values.name_ar,
    name_en: null,
    short_desc_ar: values.short_desc_ar || "",
    short_desc_en: null,
    description_ar: null,
    description_en: null,
    icon: values.icon,
    cover_image: values.cover_image ?? null,
    gallery_images: [],
    category_id: values.category_id || null,
    service_type: values.service_type,
    price: null,
    pricing_type: isSimple ? values.pricing_type : "starting_from",
    fixed_price: isSimple && values.pricing_type === "fixed" ? values.fixed_price ?? null : null,
    min_price: isSimple && values.pricing_type === "range" ? values.min_price ?? null : null,
    max_price: isSimple && values.pricing_type === "range" ? values.max_price ?? null : null,
    starting_price: isSimple && values.pricing_type === "starting_from" ? values.starting_price ?? null : null,
    duration: null,
    button_text: null,
    button_url: null,
    slug,
    meta_title: null,
    meta_description: null,
    seo_keywords: null,
    display_order: values.display_order,
    featured: false,
    show_on_homepage: true,
    status: values.status,
    features: [],
  };
}

export const createService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ServiceInput.parse(d))
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing } = await supabaseAdmin
      .from("services").select("id").ilike("name_ar", data.name_ar).maybeSingle();
    if (existing) throw new Error("يوجد خدمة أخرى بنفس الاسم");

    const payload = await buildServicePayload(data);
    const { data: created, error } = await supabaseAdmin
      .from("services").insert(payload).select().single();
    if (error) throw new Error(error.message);

    if (data.service_type === "grouped") {
      await replaceVariants(created.id, data.variants);
    }
    return created;
  });

export const updateService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), values: ServiceInput }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing } = await supabaseAdmin
      .from("services").select("id").ilike("name_ar", data.values.name_ar).neq("id", data.id).maybeSingle();
    if (existing) throw new Error("يوجد خدمة أخرى بنفس الاسم");

    const { data: current } = await supabaseAdmin
      .from("services").select("slug").eq("id", data.id).maybeSingle();
    const payload = await buildServicePayload(data.values, current?.slug || undefined, data.id);

    const { data: updated, error } = await supabaseAdmin
      .from("services").update(payload).eq("id", data.id).select().single();
    if (error) throw new Error(error.message);

    if (data.values.service_type === "grouped") {
      await replaceVariants(data.id, data.values.variants);
    } else {
      // simple → wipe variants
      await replaceVariants(data.id, []);
    }
    return updated;
  });

export const deleteServices = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ ids: z.array(z.string().uuid()).min(1) }).parse(d))
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("services").delete().in("id", data.ids);
    if (error) throw new Error(error.message);
    return { deleted: data.ids.length };
  });

export const duplicateService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: src, error: e1 } = await supabaseAdmin
      .from("services").select("*").eq("id", data.id).single();
    if (e1) throw new Error(e1.message);
    const suffix = Math.random().toString(36).slice(2, 6);
    const copy: Record<string, unknown> = { ...src };
    delete copy.id; delete copy.created_at; delete copy.updated_at;
    copy.name_ar = `${src.name_ar} (نسخة)`;
    copy.slug = `${src.slug || "service"}-${suffix}`;
    copy.status = "draft";
    const { data: created, error } = await supabaseAdmin
      .from("services").insert(copy as never).select().single();
    if (error) throw new Error(error.message);
    // copy variants
    const { data: srcVariants } = await supabaseAdmin
      .from("service_variants").select("*").eq("service_id", data.id);
    if (srcVariants?.length) {
      const rows = srcVariants.map((v) => {
        const c: Record<string, unknown> = { ...v };
        delete c.id; delete c.created_at; delete c.updated_at;
        c.service_id = created.id;
        return c;
      });
      await supabaseAdmin.from("service_variants").insert(rows as never);
    }
    return created;
  });

export const bulkUpdateServices = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      ids: z.array(z.string().uuid()).min(1),
      patch: z.object({
        status: z.enum(["active", "hidden", "draft"]).optional(),
        category_id: z.string().uuid().nullable().optional(),
      }),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("services").update(data.patch).in("id", data.ids);
    if (error) throw new Error(error.message);
    return { updated: data.ids.length };
  });

export const reorderServices = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ orders: z.array(z.object({ id: z.string().uuid(), display_order: z.number().int().min(0) })).min(1) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    for (const o of data.orders) {
      const { error } = await supabaseAdmin
        .from("services").update({ display_order: o.display_order }).eq("id", o.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// ============ CATEGORIES ============

const CategoryInput = z.object({
  name_ar: z.string().trim().min(1).max(200),
  name_en: z.string().trim().max(200).nullable().optional(),
  slug: z.string().trim().min(1).max(200).regex(/^[a-z0-9-]+$/i),
  display_order: z.number().int().min(0).default(0),
});

export const listCategoriesAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { data, error } = await context.supabase
      .from("service_categories").select("*").order("display_order");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => CategoryInput.parse(d))
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin
      .from("service_categories").insert(data).select().single();
    if (error) throw new Error(error.message);
    return created;
  });

export const updateCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), values: CategoryInput }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: updated, error } = await supabaseAdmin
      .from("service_categories").update(data.values).eq("id", data.id).select().single();
    if (error) throw new Error(error.message);
    return updated;
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("service_categories").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ ADMIN BOOTSTRAP ============

export const bootstrapFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { isFirstAdminBootstrap } = await import("@/lib/admin-guard.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (!(await isFirstAdminBootstrap())) {
      throw new Error("تم تعيين مسؤول بالفعل");
    }
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const checkAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    return { isAdmin: !!data };
  });
