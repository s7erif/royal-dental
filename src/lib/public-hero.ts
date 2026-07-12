import { supabase } from "@/integrations/supabase/client";

export type FloatingItem = { icon: string; label: string };

export type PublicHero = {
  badge_text: string;
  title_line1: string;
  title_highlight: string;
  subtitle: string;
  primary_cta_label: string;
  primary_cta_url: string;
  secondary_cta_label: string;
  secondary_cta_url: string;
  image_url: string | null;
  image_caption_eyebrow: string;
  image_caption_title: string;
  floating_items: FloatingItem[];
};

export async function fetchPublicHero(): Promise<PublicHero | null> {
  const { data, error } = await supabase
    .from("hero_content")
    .select(
      "badge_text, title_line1, title_highlight, subtitle, primary_cta_label, primary_cta_url, secondary_cta_label, secondary_cta_url, image_url, image_caption_eyebrow, image_caption_title, floating_items",
    )
    .eq("singleton", true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return {
    ...data,
    floating_items: Array.isArray(data.floating_items)
      ? (data.floating_items as FloatingItem[])
      : [],
  } as PublicHero;
}
