import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const FloatingItem = z.object({
  icon: z.string().min(1).max(60),
  label: z.string().trim().min(1).max(80),
});

export const HeroInput = z.object({
  badge_text: z.string().max(120).default(""),
  title_line1: z.string().max(200).default(""),
  title_highlight: z.string().max(200).default(""),
  subtitle: z.string().max(1000).default(""),
  primary_cta_label: z.string().max(80).default(""),
  primary_cta_url: z.string().max(500).default(""),
  secondary_cta_label: z.string().max(80).default(""),
  secondary_cta_url: z.string().max(500).default(""),
  image_url: z.string().url().nullable().optional().or(z.literal("").transform(() => null)),
  image_caption_eyebrow: z.string().max(120).default(""),
  image_caption_title: z.string().max(200).default(""),
  floating_items: z.array(FloatingItem).max(8).default([]),
});

export type HeroInputT = z.infer<typeof HeroInput>;

export const getHeroAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { data, error } = await context.supabase
      .from("hero_content")
      .select("*")
      .eq("singleton", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const updateHero = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => HeroInput.parse(d))
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin-guard.server");
    await requireAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing } = await supabaseAdmin
      .from("hero_content").select("id").eq("singleton", true).maybeSingle();
    if (existing) {
      const { data: updated, error } = await supabaseAdmin
        .from("hero_content").update(data).eq("id", existing.id).select().single();
      if (error) throw new Error(error.message);
      return updated;
    }
    const { data: created, error } = await supabaseAdmin
      .from("hero_content").insert({ ...data, singleton: true }).select().single();
    if (error) throw new Error(error.message);
    return created;
  });
