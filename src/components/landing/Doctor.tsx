import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useDoctors, useDoctorSingleton, useDoctorStats } from "@/hooks/use-cms";
import { type PublicDoctorItem } from "@/lib/public-cms";
import { getIcon } from "@/lib/icon-registry";
import doctorAsset from "@/assets/doctor.jpg.asset.json";

function DoctorSlide({
  doctor,
  legacyStats,
}: {
  doctor: PublicDoctorItem;
  legacyStats: { id: string; icon: string; title: string; value: string }[] | null;
}) {
  const image = doctor.image_url || doctorAsset.url;

  const cards: { icon: string; title: string; value: string }[] =
    legacyStats && legacyStats.length > 0
      ? legacyStats.map((s) => ({ icon: s.icon, title: s.title, value: s.value }))
      : ([
          doctor.years_experience > 0 && {
            icon: "Award",
            title: "سنوات الخبرة",
            value: `+${doctor.years_experience} سنة`,
          },
          doctor.specialties.length > 0 && {
            icon: "Stethoscope",
            title: "التخصصات",
            value: doctor.specialties.join(" • "),
          },
          doctor.patients_count > 0 && {
            icon: "Users",
            title: "المرضى",
            value: `+${doctor.patients_count.toLocaleString("ar-EG")}`,
          },
          doctor.certifications.length > 0 && {
            icon: "GraduationCap",
            title: "الشهادات",
            value: doctor.certifications.join(" • "),
          },
        ].filter(Boolean) as { icon: string; title: string; value: string }[]);

  return (
    <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={doctor.id + "-img"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative mx-auto max-w-sm"
          >
            <div className="absolute -inset-6 rounded-[36px] bg-gradient-to-tr from-[color:var(--color-gold-light)]/40 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/60 shadow-[0_40px_80px_-30px_rgba(31,31,31,0.4)]">
              <img
                src={image}
                alt={doctor.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="lg:col-span-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={doctor.id + "-txt"}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h2 className="text-4xl leading-tight text-[color:var(--color-charcoal)] font-bold sm:text-5xl">
              {doctor.name}
            </h2>
            {doctor.job_title && (
              <p className="mt-2 text-[color:var(--color-charcoal)]/60">{doctor.job_title}</p>
            )}
            {doctor.description && (
              <p className="mt-5 leading-relaxed text-[color:var(--color-charcoal)]/70">
                {doctor.description}
              </p>
            )}
            {cards.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {cards.map((c, i) => {
                  const Icon = getIcon(c.icon);
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white/70 p-4 backdrop-blur"
                    >
                      <Icon className="h-5 w-5 shrink-0 text-[color:var(--color-gold-dark)]" />
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-[color:var(--color-charcoal)]">
                          {c.title}
                        </div>
                        <div className="text-xs text-[color:var(--color-charcoal)]/60">
                          {c.value}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function Doctor() {
  const { data: singleton } = useDoctorSingleton();
  const { data: legacyStats = [] } = useDoctorStats();
  const { data: doctors = [] } = useDoctors();

  const eyebrow = singleton?.eyebrow || "تعرف على طبيبك";

  const items: PublicDoctorItem[] =
    doctors.length > 0
      ? doctors
      : singleton
        ? [
            {
              id: "legacy",
              name: singleton.name || "د. مصطفى بكر",
              job_title: singleton.job_title || "",
              description: singleton.description || "",
              image_url: singleton.image_url,
              years_experience: 0,
              patients_count: 0,
              specialties: [],
              certifications: [],
              is_featured: true,
              display_order: 0,
            },
          ]
        : [];

  const autoplayRef = useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: items.length > 1,
      align: "start",
      direction: "rtl",
      duration: 32,
      dragFree: false,
    },
    items.length > 1 ? [autoplayRef.current] : [],
  );
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (items.length === 0) return null;

  const resetAutoplay = () => {
    const ap = emblaApi?.plugins()?.autoplay;
    if (!ap) return;
    ap.reset();
  };
  const scrollPrev = () => {
    emblaApi?.scrollPrev();
    resetAutoplay();
  };
  const scrollNext = () => {
    emblaApi?.scrollNext();
    resetAutoplay();
  };
  const scrollTo = (i: number) => {
    emblaApi?.scrollTo(i);
    resetAutoplay();
  };

  return (
    <section id="doctor" className="py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-6 text-center">
          <div className="text-xs tracking-[0.25em] text-[color:var(--color-gold-dark)] font-bold">
            {eyebrow}
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {items.map((doc) => (
                <div key={doc.id} className="min-w-0 flex-[0_0_100%]">
                  <DoctorSlide
                    doctor={doc}
                    legacyStats={doc.id === "legacy" ? legacyStats : null}
                  />
                </div>
              ))}
            </div>
          </div>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="الطبيب السابق"
                className="absolute top-1/2 right-1 sm:right-3 z-20 grid h-12 w-12 md:h-14 md:w-14 -translate-y-1/2 place-items-center rounded-full bg-[color:var(--color-gold-dark)] text-white shadow-[0_12px_30px_-8px_rgba(191,149,63,0.6)] ring-2 ring-white/80 transition hover:scale-110 hover:bg-[color:var(--color-charcoal)] active:scale-95"
              >
                <ChevronRight className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                aria-label="الطبيب التالي"
                className="absolute top-1/2 left-1 sm:left-3 z-20 grid h-12 w-12 md:h-14 md:w-14 -translate-y-1/2 place-items-center rounded-full bg-[color:var(--color-gold-dark)] text-white shadow-[0_12px_30px_-8px_rgba(191,149,63,0.6)] ring-2 ring-white/80 transition hover:scale-110 hover:bg-[color:var(--color-charcoal)] active:scale-95"
              >
                <ChevronLeft className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2.5} />
              </button>

              <div className="mt-8 flex items-center justify-center gap-2">
                {items.map((d, i) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => scrollTo(i)}
                    aria-label={`الانتقال إلى ${d.name}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === selected
                        ? "w-8 bg-[color:var(--color-gold-dark)]"
                        : "w-2 bg-[color:var(--color-charcoal)]/20 hover:bg-[color:var(--color-charcoal)]/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Doctor;
