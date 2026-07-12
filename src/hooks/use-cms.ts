// Shared TanStack Query hooks for public CMS data.
// Consolidates duplicated queries (contact, social links, doctor, services, etc.)
// so each dataset is fetched once and shared across the landing sections.
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
  fetchAboutContent,
  fetchAdvantages,
  fetchTimeline,
  fetchDoctor,
  fetchDoctorStats,
  fetchDoctors,
  fetchOffers,
  fetchBeforeAfter,
  fetchGalleryImages,
  fetchFaqs,
  fetchContact,
  fetchSocialLinks,
  fetchTestimonials,
  fetchTestimonialsSummary,
} from "@/lib/public-cms";
import { fetchPublicHero } from "@/lib/public-hero";
import { fetchPublicServices } from "@/lib/public-services";

// Public CMS data changes infrequently; use a long stale window and
// disable focus/mount refetches to reduce runtime fetch pressure.
const CMS_CACHE = {
  staleTime: 5 * 60_000,
  gcTime: 30 * 60_000,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
} satisfies Partial<UseQueryOptions>;

export const cmsQueryOptions = CMS_CACHE;

export const useHero = () =>
  useQuery({ queryKey: ["public-hero"], queryFn: fetchPublicHero, ...CMS_CACHE });
export const useContact = () =>
  useQuery({ queryKey: ["public-contact"], queryFn: fetchContact, ...CMS_CACHE });
export const useSocialLinks = () =>
  useQuery({ queryKey: ["public-social-links"], queryFn: fetchSocialLinks, ...CMS_CACHE });
export const useAbout = () =>
  useQuery({ queryKey: ["public-about"], queryFn: fetchAboutContent, ...CMS_CACHE });
export const useAdvantages = () =>
  useQuery({ queryKey: ["public-advantages"], queryFn: fetchAdvantages, ...CMS_CACHE });
export const useTimeline = () =>
  useQuery({ queryKey: ["public-timeline"], queryFn: fetchTimeline, ...CMS_CACHE });
export const useDoctorSingleton = () =>
  useQuery({ queryKey: ["public-doctor"], queryFn: fetchDoctor, ...CMS_CACHE });
export const useDoctorStats = () =>
  useQuery({ queryKey: ["public-doctor-stats"], queryFn: fetchDoctorStats, ...CMS_CACHE });
export const useDoctors = () =>
  useQuery({ queryKey: ["public-doctors"], queryFn: fetchDoctors, ...CMS_CACHE });
export const useServices = () =>
  useQuery({ queryKey: ["public-services"], queryFn: fetchPublicServices, ...CMS_CACHE });
export const useOffers = () =>
  useQuery({ queryKey: ["public-offers"], queryFn: fetchOffers, ...CMS_CACHE });
export const useBeforeAfterCases = () =>
  useQuery({ queryKey: ["public-before-after"], queryFn: fetchBeforeAfter, ...CMS_CACHE });
export const useGalleryImages = () =>
  useQuery({ queryKey: ["public-gallery-images"], queryFn: fetchGalleryImages, ...CMS_CACHE });
export const useTestimonials = () =>
  useQuery({ queryKey: ["public-testimonials"], queryFn: fetchTestimonials, ...CMS_CACHE });
export const useTestimonialsSummary = () =>
  useQuery({ queryKey: ["public-tsummary"], queryFn: fetchTestimonialsSummary, ...CMS_CACHE });
export const useFaqs = () =>
  useQuery({ queryKey: ["public-faqs"], queryFn: fetchFaqs, ...CMS_CACHE });
