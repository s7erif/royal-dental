import { supabase } from "@/integrations/supabase/client";

// ===== About =====
export type PublicAbout = {
  eyebrow: string; title: string; highlight: string; description: string;
  image_url: string | null; badge_title: string; badge_subtitle: string; bullets: string[];
};
export async function fetchAboutContent(): Promise<PublicAbout | null> {
  const { data, error } = await supabase.from("about_content")
    .select("eyebrow,title,highlight,description,image_url,badge_title,badge_subtitle,bullets")
    .eq("singleton", true).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return { ...data, bullets: Array.isArray(data.bullets) ? (data.bullets as string[]) : [] } as PublicAbout;
}
export type PublicAdvantage = { id: string; icon: string; title: string };
export async function fetchAdvantages(): Promise<PublicAdvantage[]> {
  const { data, error } = await supabase.from("about_advantages")
    .select("id,icon,title").order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as PublicAdvantage[]) ?? [];
}
export type PublicTimeline = { id: string; year: string; title: string; description: string };
export async function fetchTimeline(): Promise<PublicTimeline[]> {
  const { data, error } = await supabase.from("about_timeline")
    .select("id,year,title,description").order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as PublicTimeline[]) ?? [];
}

// ===== Doctor =====
export type PublicDoctor = { eyebrow: string; name: string; job_title: string; description: string; image_url: string | null };
export async function fetchDoctor(): Promise<PublicDoctor | null> {
  const { data, error } = await supabase.from("doctor_content")
    .select("eyebrow,name,job_title,description,image_url").eq("singleton", true).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as PublicDoctor | null) ?? null;
}
export type PublicDoctorStat = { id: string; icon: string; title: string; value: string };
export async function fetchDoctorStats(): Promise<PublicDoctorStat[]> {
  const { data, error } = await supabase.from("doctor_stats")
    .select("id,icon,title,value").order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as PublicDoctorStat[]) ?? [];
}

// ===== Doctors (collection) =====
export type PublicDoctorItem = {
  id: string;
  name: string;
  job_title: string;
  description: string;
  image_url: string | null;
  years_experience: number;
  patients_count: number;
  specialties: string[];
  certifications: string[];
  is_featured: boolean;
  display_order: number;
};
export async function fetchDoctors(): Promise<PublicDoctorItem[]> {
  const { data, error } = await supabase.from("doctors")
    .select("id,name,job_title,description,image_url,years_experience,patients_count,specialties,certifications,is_featured,display_order")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  const rows = ((data as unknown as Array<Record<string, unknown>>) ?? []).map((r) => ({
    ...(r as object),
    specialties: Array.isArray(r.specialties) ? (r.specialties as string[]) : [],
    certifications: Array.isArray(r.certifications) ? (r.certifications as string[]) : [],
  })) as PublicDoctorItem[];
  // Featured first, then by display_order
  const featured = rows.filter((r) => r.is_featured);
  const rest = rows.filter((r) => !r.is_featured);
  return [...featured, ...rest];
}


export type PublicOffer = {
  id: string; title: string; description: string; discount: string; old_price: string; new_price: string;
  badge: string; icon: string; image_url: string | null; start_date: string | null; end_date: string | null;
  button_text: string; button_url: string;
};
export async function fetchOffers(): Promise<PublicOffer[]> {
  const { data, error } = await supabase.from("offers")
    .select("id,title,description,discount,old_price,new_price,badge,icon,image_url,start_date,end_date,button_text,button_url")
    .eq("is_active", true).order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as PublicOffer[]) ?? [];
}

// ===== Before / After =====
export type PublicBACase = {
  id: string; patient_name: string | null; treatment_type: string; description: string;
  before_image: string | null; after_image: string | null;
  title_ar: string | null; title_en: string | null; short_description: string | null;
  category: string | null; sessions_count: number | null; treatment_duration: string | null;
  patient_age: number | null; is_featured: boolean; additional_images: string[];
};
export async function fetchBeforeAfter(): Promise<PublicBACase[]> {
  const { data, error } = await supabase.from("before_after_cases")
    .select("id,patient_name,treatment_type,description,before_image,after_image,title_ar,title_en,short_description,category,sessions_count,treatment_duration,patient_age,is_featured,additional_images")
    .eq("is_active", true).order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return ((data as unknown as Array<Record<string, unknown>>) ?? []).map((r) => ({
    ...(r as object),
    additional_images: Array.isArray(r.additional_images) ? (r.additional_images as string[]) : [],
  })) as PublicBACase[];
}

// ===== Gallery =====
export type PublicGalleryCategory = { id: string; name: string; slug: string };
export async function fetchGalleryCategories(): Promise<PublicGalleryCategory[]> {
  const { data, error } = await supabase.from("gallery_categories")
    .select("id,name,slug").order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as PublicGalleryCategory[]) ?? [];
}
export type PublicGalleryImage = {
  id: string;
  category_id: string | null;
  image_url: string;
  title_ar: string | null;
  title_en: string | null;
  caption: string | null;
  display_order: number;
  created_at: string;
};
export async function fetchGalleryImages(): Promise<PublicGalleryImage[]> {
  const { data, error } = await supabase.from("gallery_images")
    .select("id,category_id,image_url,title_ar,title_en,caption,display_order,created_at")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as unknown as PublicGalleryImage[]) ?? [];
}


// ===== Testimonials =====
export type PublicTestimonial = {
  id: string; patient_name: string; rating: number; review: string; patient_image: string | null; date_label: string;
};
export async function fetchTestimonials(): Promise<PublicTestimonial[]> {
  const { data, error } = await supabase.from("testimonials")
    .select("id,patient_name,rating,review,patient_image,date_label")
    .eq("is_active", true).order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as PublicTestimonial[]) ?? [];
}
export type PublicTestimonialsSummary = { google_rating: number; google_reviews_count: number; google_button_url: string };
export async function fetchTestimonialsSummary(): Promise<PublicTestimonialsSummary | null> {
  const { data, error } = await supabase.from("testimonials_summary")
    .select("google_rating,google_reviews_count,google_button_url").eq("singleton", true).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as PublicTestimonialsSummary | null) ?? null;
}

// ===== FAQ =====
export type PublicFaq = { id: string; question: string; answer: string };
export async function fetchFaqs(): Promise<PublicFaq[]> {
  const { data, error } = await supabase.from("faqs")
    .select("id,question,answer").eq("is_active", true).order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as PublicFaq[]) ?? [];
}

// ===== Contact =====
export type PublicContact = {
  phones: string[]; whatsapp: string; email: string; address: string; working_hours: string;
  google_maps_embed_url: string;
  facebook_url: string; instagram_url: string; tiktok_url: string; snapchat_url: string; youtube_url: string;
  offers_section_enabled: boolean;
};
export async function fetchContact(): Promise<PublicContact | null> {
  const { data, error } = await supabase.from("contact_content")
    .select("phones,whatsapp,email,address,working_hours,google_maps_embed_url,facebook_url,instagram_url,tiktok_url,snapchat_url,youtube_url,offers_section_enabled")
    .eq("singleton", true).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return { ...data, phones: Array.isArray(data.phones) ? (data.phones as string[]) : [], offers_section_enabled: data.offers_section_enabled ?? true } as PublicContact;
}

// ===== Social Links =====
export type SocialPlatform =
  | "facebook" | "instagram" | "whatsapp" | "tiktok"
  | "snapchat" | "twitter" | "youtube" | "linkedin";
export type PublicSocialLink = {
  id: string;
  platform: SocialPlatform;
  url: string;
  is_active: boolean;
  open_in_new_tab: boolean;
  display_order: number;
};
export async function fetchSocialLinks(): Promise<PublicSocialLink[]> {
  const { data, error } = await supabase.from("social_links")
    .select("id,platform,url,is_active,open_in_new_tab,display_order")
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return ((data ?? []) as PublicSocialLink[]).filter((s) => s.url && s.url.trim().length > 0);
}
