import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Tables that use a `display_order` list of rows.
export const COLLECTION_TABLES = [
  "about_advantages",
  "about_timeline",
  "doctor_stats",
  "doctors",
  "offers",
  "before_after_cases",
  "gallery_categories",
  "gallery_images",
  "testimonials",
  "faqs",
  "social_links",
] as const;
export type CollectionTable = (typeof COLLECTION_TABLES)[number];
const CollectionTableEnum = z.enum(COLLECTION_TABLES);

// Singleton tables — one row, upserted by singleton=true.
export const SINGLETON_TABLES = [
  "about_content",
  "doctor_content",
  "contact_content",
  "testimonials_summary",
] as const;
export type SingletonTable = (typeof SINGLETON_TABLES)[number];
const SingletonTableEnum = z.enum(SINGLETON_TABLES);

const AllowedFields: Record<CollectionTable | SingletonTable, readonly string[]> = {
  about_advantages: ["icon", "title", "display_order"],
  about_timeline: ["year", "title", "description", "display_order"],
  doctor_stats: ["icon", "title", "value", "display_order"],
  doctors: ["name","job_title","description","image_url","years_experience","patients_count","specialties","certifications","display_order","is_active","is_featured"],
  offers: ["title","description","discount","old_price","new_price","badge","icon","image_url","start_date","end_date","button_text","button_url","is_active","display_order"],
  before_after_cases: ["patient_name","treatment_type","description","before_image","after_image","is_active","display_order","title_ar","title_en","short_description","category","sessions_count","treatment_duration","patient_age","is_featured","additional_images"],
  gallery_categories: ["name","slug","display_order"],
  gallery_images: ["category_id","image_url","caption","is_active","display_order"],
  testimonials: ["patient_name","rating","review","patient_image","date_label","is_active","display_order"],
  faqs: ["question","answer","is_active","display_order"],
  about_content: ["eyebrow","title","highlight","description","image_url","badge_title","badge_subtitle","bullets"],
  doctor_content: ["eyebrow","name","job_title","description","image_url"],
  contact_content: ["phones","whatsapp","email","address","working_hours","google_maps_embed_url","facebook_url","instagram_url","tiktok_url","snapchat_url","youtube_url","offers_section_enabled"],
  testimonials_summary: ["google_rating","google_reviews_count","google_button_url"],
  social_links: ["platform","url","is_active","open_in_new_tab","display_order"],
};

function pickAllowed(table: CollectionTable | SingletonTable, values: Record<string, unknown>) {
  const allow = new Set(AllowedFields[table]);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(values)) if (allow.has(k)) out[k] = v === "" && k.endsWith("_date") ? null : v;
  return out;
}

// ------------------- COLLECTIONS -------------------

export const cmsListAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ table: CollectionTableEnum }).parse(d))
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { data: rows, error } = await context.supabase
      .from(data.table)
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const cmsCreate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ table: CollectionTableEnum, values: z.record(z.string(), z.unknown()) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const values = pickAllowed(data.table, data.values);
    const { data: created, error } = await supabaseAdmin
      .from(data.table).insert(values as never).select().single();
    if (error) throw new Error(error.message);
    return created;
  });

export const cmsUpdate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ table: CollectionTableEnum, id: z.string().uuid(), values: z.record(z.string(), z.unknown()) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const values = pickAllowed(data.table, data.values);
    const { data: updated, error } = await supabaseAdmin
      .from(data.table).update(values as never).eq("id", data.id).select().single();
    if (error) throw new Error(error.message);
    return updated;
  });

export const cmsDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ table: CollectionTableEnum, id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const cmsReorder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      table: CollectionTableEnum,
      orders: z.array(z.object({ id: z.string().uuid(), display_order: z.number().int().min(0) })).min(1),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    for (const o of data.orders) {
      const { error } = await supabaseAdmin
        .from(data.table).update({ display_order: o.display_order } as never).eq("id", o.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const cmsToggle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      table: CollectionTableEnum,
      id: z.string().uuid(),
      field: z.string().min(1).max(60),
      value: z.boolean(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const allow = new Set(AllowedFields[data.table as CollectionTable]);
    if (!allow.has(data.field)) throw new Error("Field not allowed");
    const { error } = await supabaseAdmin
      .from(data.table).update({ [data.field]: data.value } as never).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ------------------- SINGLETONS -------------------

export const cmsGetSingleton = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ table: SingletonTableEnum }).parse(d))
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { data: row, error } = await context.supabase
      .from(data.table).select("*").eq("singleton", true).maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const cmsUpdateSingleton = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ table: SingletonTableEnum, values: z.record(z.string(), z.unknown()) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const values = pickAllowed(data.table, data.values);
    const { data: existing } = await supabaseAdmin
      .from(data.table).select("id").eq("singleton", true).maybeSingle();
    if (existing) {
      const { data: updated, error } = await supabaseAdmin
        .from(data.table).update(values as never).eq("id", (existing as { id: string }).id).select().single();
      if (error) throw new Error(error.message);
      return updated;
    }
    const { data: created, error } = await supabaseAdmin
      .from(data.table).insert({ ...values, singleton: true } as never).select().single();
    if (error) throw new Error(error.message);
    return created;
  });
