import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Star, X } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { type PublicTestimonial } from "@/lib/public-cms";
import { useTestimonials, useTestimonialsSummary } from "@/hooks/use-cms";
import { GoogleG, Reveal, ToothIcon, pickAvatarColor } from "./_shared";

function ReviewCard({ r, onExpand }: { r: PublicTestimonial; onExpand: () => void }) {
  const initial = r.patient_name.trim().charAt(0);
  const text = r.review ?? "";
  const isLong = text.length > 180 || text.split("\n").length > 4;
  const avatarBg = pickAvatarColor(r.patient_name);
  return (
    <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-[20px] bg-white p-6 shadow-[0_18px_45px_-28px_rgba(31,31,31,0.28)] ring-1 ring-black/[0.05] transition hover:-translate-y-1 hover:shadow-[0_28px_60px_-28px_rgba(31,31,31,0.38)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: "radial-gradient(circle, #C9A84C 1px, transparent 1.2px)",
          backgroundSize: "10px 10px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.9), transparent 70%)",
          WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.9), transparent 70%)",
        }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {r.patient_image ? (
            <img
              src={r.patient_image}
              alt={r.patient_name}
              referrerPolicy="no-referrer"
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-base font-bold text-white"
              style={{ backgroundColor: avatarBg }}
            >
              {initial}
            </div>
          )}
          <div className="min-w-0">
            <div className="truncate text-[15px] font-bold text-[color:var(--color-charcoal)]">
              {r.patient_name}
            </div>
            {r.date_label && (
              <div className="text-xs text-[color:var(--color-charcoal)]/55">{r.date_label}</div>
            )}
          </div>
        </div>
        <GoogleG className="h-5 w-5 shrink-0 opacity-95" />
      </div>

      <div className="relative flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, s) => (
          <Star
            key={s}
            className={`h-4 w-4 ${s < r.rating ? "fill-[#F4B400] text-[#F4B400]" : "text-black/10"}`}
          />
        ))}
        <span className="ml-1 grid h-4 w-4 place-items-center rounded-full bg-[#1A73E8] text-white">
          <Check className="h-2.5 w-2.5" strokeWidth={3} />
        </span>
      </div>

      <p className="relative text-sm leading-relaxed text-[color:var(--color-charcoal)]/80 line-clamp-4">
        {text}
      </p>

      {isLong && (
        <button
          onClick={onExpand}
          className="relative mt-auto self-start text-sm font-bold text-[color:var(--color-gold-dark)] hover:underline"
        >
          اقرأ المزيد
        </button>
      )}
    </div>
  );
}

export function Testimonials() {
  const { data: reviews = [] } = useTestimonials();
  const { data: summary } = useTestimonialsSummary();

  const [expanded, setExpanded] = useState<PublicTestimonial | null>(null);

  const autoplay = useRef(
    Autoplay({ delay: 5500, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      direction: "rtl",
      containScroll: false,
      duration: 28,
    },
    [autoplay.current],
  );

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const rating = summary?.google_rating ?? 4.9;
  const reviewsCount = summary?.google_reviews_count ?? reviews.length;
  const mapsUrl = summary?.google_button_url || "https://www.google.com/maps";
  const reviewsCountLabel = reviewsCount.toLocaleString("en-US");

  return (
    <section id="reviews" className="relative py-14 sm:py-24" style={{ background: "#F5EFE4" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <Reveal>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-5 w-5 fill-[#F4B400] text-[#F4B400]" />
                ))}
              </div>
              <div className="text-3xl font-black leading-none text-[color:var(--color-charcoal)]">
                {rating.toFixed(1)}
              </div>
            </div>
            <div className="mt-1 flex items-center gap-2 text-[color:var(--color-charcoal)]/70">
              <GoogleG className="h-6 w-6" />
              <span className="text-sm">Verified Google Rating · تقييم موثّق</span>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-8 sm:mt-12 sm:gap-6 lg:grid-cols-[280px_1fr] lg:items-center">
          <Reveal delay={0.05}>
            <div className="flex flex-col items-center gap-3 text-center">
<img
  src="/logo.png"
  alt="Royal Dental"
  className="h-10 w-10 sm:h-20 sm:w-20 object-contain"
/>
              <div className="mt-1 text-[17px] font-black text-[color:var(--color-charcoal)]">
                Royal Dental Center
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${s < Math.round(rating) ? "fill-[#F4B400] text-[#F4B400]" : "text-black/10"}`}
                  />
                ))}
              </div>
              <div className="text-sm text-[color:var(--color-charcoal)]/70">
                <span className="font-bold text-[color:var(--color-charcoal)]">
                  {reviewsCountLabel}
                </span>{" "}
                Google reviews
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center rounded-lg border border-black/15 bg-white px-5 py-2.5 text-sm font-bold text-[color:var(--color-charcoal)] shadow-sm transition hover:border-[color:var(--color-gold-dark)] hover:text-[color:var(--color-gold-dark)]"
              >
                Write a review
              </a>
            </div>
          </Reveal>

          <div className="relative min-w-0">
            {reviews.length === 0 ? (
              <div className="grid h-full min-h-[280px] place-items-center rounded-[20px] border border-dashed border-black/10 bg-white/60 p-8 text-center text-sm text-[color:var(--color-charcoal)]/60">
                لا توجد تقييمات بعد.
              </div>
            ) : (
              <>
                <button
                  onClick={scrollPrev}
                  aria-label="السابق"
                  className="absolute right-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 translate-x-3 place-items-center rounded-full border border-black/10 bg-white/95 shadow-md transition hover:scale-110 sm:grid"
                >
                  <ChevronRight className="h-4 w-4 text-[color:var(--color-charcoal)]/70" />
                </button>
                <button
                  onClick={scrollNext}
                  aria-label="التالي"
                  className="absolute left-0 top-1/2 z-10 hidden h-9 w-9 -translate-x-3 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-white/95 shadow-md transition hover:scale-110 sm:grid"
                >
                  <ChevronLeft className="h-4 w-4 text-[color:var(--color-charcoal)]/70" />
                </button>

                <div className="overflow-hidden sm:px-2" ref={emblaRef}>
                  <div className="flex">
                    {reviews.map((r) => (
                      <div
                        key={r.id}
                        className="min-w-0 shrink-0 grow-0 basis-[88%] px-2 sm:basis-1/2 sm:px-2.5 lg:basis-1/3"
                      >
                        <ReviewCard r={r} onExpand={() => setExpanded(r)} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-3 sm:hidden">
                  <button
                    onClick={scrollPrev}
                    aria-label="السابق"
                    className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white shadow-sm"
                  >
                    <ChevronRight className="h-4 w-4 text-[color:var(--color-charcoal)]/70" />
                  </button>
                  <button
                    onClick={scrollNext}
                    aria-label="التالي"
                    className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white shadow-sm"
                  >
                    <ChevronLeft className="h-4 w-4 text-[color:var(--color-charcoal)]/70" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
            onClick={() => setExpanded(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-2xl overflow-auto rounded-[24px] bg-white p-8 shadow-2xl"
            >
              <button
                onClick={() => setExpanded(null)}
                aria-label="إغلاق"
                className="absolute left-4 top-4 rounded-full p-2 text-[color:var(--color-charcoal)]/60 hover:bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                {expanded.patient_image ? (
                  <img
                    src={expanded.patient_image}
                    alt={expanded.patient_name}
                    referrerPolicy="no-referrer"
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="grid h-14 w-14 place-items-center rounded-full text-lg font-bold text-white"
                    style={{ backgroundColor: pickAvatarColor(expanded.patient_name) }}
                  >
                    {expanded.patient_name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[color:var(--color-charcoal)]">
                      {expanded.patient_name}
                    </span>
                    <GoogleG className="h-4 w-4" />
                  </div>
                  {expanded.date_label && (
                    <div className="text-xs text-[color:var(--color-charcoal)]/60">
                      {expanded.date_label}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`h-5 w-5 ${s < expanded.rating ? "fill-[#F4B400] text-[#F4B400]" : "text-black/10"}`}
                  />
                ))}
              </div>
              <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-[color:var(--color-charcoal)]/85">
                {expanded.review}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Testimonials;
