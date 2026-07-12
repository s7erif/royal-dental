// Public read-only service loader for the frontend.
// Uses the browser Supabase client (publishable key + anon SELECT policy).
import { supabase } from "@/integrations/supabase/client";

export type PricingType = "fixed" | "range" | "starting_from" | "consultation";
export type ServiceType = "simple" | "grouped";

export type PublicVariant = {
  id: string;
  service_id: string;
  name_ar: string;
  description_ar: string | null;
  pricing_type: PricingType;
  fixed_price: number | null;
  min_price: number | null;
  max_price: number | null;
  starting_price: number | null;
  display_order: number;
};

export type PublicService = {
  id: string;
  name_ar: string;
  name_en: string | null;
  short_desc_ar: string;
  short_desc_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  icon: string;
  cover_image: string | null;
  gallery_images: string[];
  price: string | null;
  service_type: ServiceType;
  pricing_type: PricingType;
  fixed_price: number | null;
  min_price: number | null;
  max_price: number | null;
  starting_price: number | null;
  duration: string | null;
  button_text: string | null;
  button_url: string | null;
  slug: string;
  display_order: number;
  featured: boolean;
  show_on_homepage: boolean;
  features: string[];
  category_id: string | null;
  variants: PublicVariant[];
};

export type PublicCategory = {
  id: string;
  name_ar: string;
  slug: string;
  display_order: number;
};

export async function fetchPublicServices(): Promise<PublicService[]> {
  const { data, error } = await supabase
    .from("services")
    .select(
      "id, name_ar, name_en, short_desc_ar, short_desc_en, description_ar, description_en, icon, cover_image, gallery_images, price, service_type, pricing_type, fixed_price, min_price, max_price, starting_price, duration, button_text, button_url, slug, display_order, featured, show_on_homepage, features, category_id, variants:service_variants(id, service_id, name_ar, description_ar, pricing_type, fixed_price, min_price, max_price, starting_price, display_order)",
    )
    .eq("status", "active")
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data || []).map((r) => ({
    ...r,
    short_desc_ar: r.short_desc_ar || "",
    slug: r.slug || r.id,
    gallery_images: Array.isArray(r.gallery_images) ? (r.gallery_images as string[]) : [],
    features: Array.isArray(r.features) ? (r.features as string[]) : [],
    variants: Array.isArray(r.variants)
      ? [...r.variants].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      : [],
  })) as PublicService[];
}

export async function fetchPublicCategories(): Promise<PublicCategory[]> {
  const { data, error } = await supabase
    .from("service_categories")
    .select("id, name_ar, slug, display_order")
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data || []) as PublicCategory[];
}

type PriceLike = {
  pricing_type: PricingType;
  fixed_price: number | null;
  min_price: number | null;
  max_price: number | null;
  starting_price: number | null;
  price?: string | null;
};

export function formatPrice(s: PriceLike): { label: string; isConsultation: boolean } {
  const fmt = (n: number) => new Intl.NumberFormat("ar-EG").format(n);
  switch (s.pricing_type) {
    case "fixed":
      return { label: s.fixed_price != null ? `${fmt(s.fixed_price)} جنيه` : (s.price || "—"), isConsultation: false };
    case "range":
      if (s.min_price != null && s.max_price != null) return { label: `${fmt(s.min_price)} - ${fmt(s.max_price)} جنيه`, isConsultation: false };
      return { label: s.price || "—", isConsultation: false };
    case "starting_from":
      return { label: s.starting_price != null ? `يبدأ من ${fmt(s.starting_price)} جنيه` : (s.price || "—"), isConsultation: false };
    case "consultation":
    default:
      return { label: "حسب الحالة", isConsultation: true };
  }
}

/** Lowest price across variants for a grouped service; used for "starts from" badge. */
export function groupedStartingFrom(variants: PublicVariant[]): number | null {
  const nums: number[] = [];
  for (const v of variants) {
    if (v.pricing_type === "fixed" && v.fixed_price != null) nums.push(v.fixed_price);
    else if (v.pricing_type === "range" && v.min_price != null) nums.push(v.min_price);
    else if (v.pricing_type === "starting_from" && v.starting_price != null) nums.push(v.starting_price);
  }
  if (!nums.length) return null;
  return Math.min(...nums);
}
