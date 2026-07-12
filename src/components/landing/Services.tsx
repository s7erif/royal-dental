import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronLeft, X } from "lucide-react";
import { formatPrice, groupedStartingFrom, type PublicService } from "@/lib/public-services";
import { getIcon } from "@/lib/icon-registry";
import { useServices } from "@/hooks/use-cms";
import { Reveal, SectionTitle } from "./_shared";

function ServiceVariantsDialog({
  service,
  onClose,
}: {
  service: PublicService | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {service && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-white/60 bg-white/95 p-7 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق"
              className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-[color:var(--color-charcoal)]/5 text-[color:var(--color-charcoal)] transition-colors hover:bg-[color:var(--color-charcoal)]/10"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)] text-white shadow-[0_10px_30px_-10px_rgba(200,162,75,0.6)]">
                {(() => {
                  const Icon = getIcon(service.icon);
                  return <Icon className="h-6 w-6" />;
                })()}
              </div>
              <div className="min-w-0">
                <h3 className="text-2xl font-bold">{service.name_ar}</h3>
                {service.short_desc_ar && (
                  <p className="mt-1 text-sm text-[color:var(--color-charcoal)]/70">
                    {service.short_desc_ar}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {service.variants.length === 0 ? (
                <div className="rounded-xl border border-dashed border-black/10 bg-white/60 p-6 text-center text-sm text-[color:var(--color-charcoal)]/60">
                  لم تُضف الأنواع بعد.
                </div>
              ) : (
                service.variants.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/70 p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-base font-bold">{v.name_ar}</div>
                      {v.description_ar && (
                        <div className="mt-1 text-xs leading-relaxed text-[color:var(--color-charcoal)]/60">
                          {v.description_ar}
                        </div>
                      )}
                    </div>
                    <div className="text-lg font-bold text-[color:var(--color-gold-dark)]">
                      {formatPrice(v).label}
                    </div>
                  </div>
                ))
              )}
            </div>
            <a
              href="#book"
              onClick={onClose}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-l from-[color:var(--color-gold-dark)] to-[color:var(--color-gold-light)] px-5 py-3 text-sm font-bold text-white shadow-[0_15px_40px_-15px_rgba(200,162,75,0.7)]"
            >
              <Calendar className="h-4 w-4" />
              احجز الآن
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Services() {
  const { data: services = [], isLoading } = useServices();
  const homepageServices = services.filter((s) => s.show_on_homepage);
  const [detailsFor, setDetailsFor] = useState<PublicService | null>(null);

  return (
    <section id="services" className="py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionTitle
          eyebrow="خدماتنا"
          title={
            <>
              رعاية دقيقة <span className="text-[color:var(--color-gold-dark)]">مصممة</span> لك
            </>
          }
          sub="مجموعة متكاملة من علاجات الأسنان بأحدث التقنيات ورعاية فائقة."
        />
        {isLoading ? (
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-[22px] border border-black/5 bg-white/60"
              />
            ))}
          </div>
        ) : homepageServices.length === 0 ? (
          <div className="mt-14 rounded-[22px] border border-dashed border-black/10 bg-white/50 p-10 text-center text-sm text-[color:var(--color-charcoal)]/60">
            سيتم عرض الخدمات هنا قريباً.
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {homepageServices.map((s, i) => {
              const Icon = getIcon(s.icon);
              const isGrouped = s.service_type === "grouped";
              const start = isGrouped ? groupedStartingFrom(s.variants) : null;
              const fmt = (n: number) => new Intl.NumberFormat("ar-EG").format(n);
              return (
                <Reveal key={s.id} delay={i * 0.05}>
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-black/5 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(200,162,75,0.5)]">
                    <div className="absolute inset-x-0 -top-24 h-40 rounded-full bg-gradient-to-b from-[color:var(--color-gold-light)]/30 to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[color:var(--color-gold-light)]/30 to-[color:var(--color-gold)]/10 text-[color:var(--color-gold-dark)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      {isGrouped && (
                        <span className="rounded-full border border-[color:var(--color-gold)]/30 bg-white/70 px-2.5 py-1 text-[10px] font-bold text-[color:var(--color-gold-dark)]">
                          {s.variants.length} خيارات
                        </span>
                      )}
                    </div>
                    <h3 className="relative mt-5 text-xl text-[color:var(--color-charcoal)] font-bold">
                      {s.name_ar}
                    </h3>
                    <p className="relative mt-2 flex-1 text-sm leading-relaxed text-[color:var(--color-charcoal)]/60">
                      {s.short_desc_ar}
                    </p>
                    {isGrouped ? (
                      <div className="relative mt-5 flex items-center justify-between gap-3">
                        <div className="text-xs text-[color:var(--color-charcoal)]/60">
                          {start != null ? (
                            <>
                              يبدأ من{" "}
                              <span className="text-base font-bold text-[color:var(--color-gold-dark)]">
                                {fmt(start)}
                              </span>{" "}
                              ج
                            </>
                          ) : (
                            "عدة خيارات"
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setDetailsFor(s)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-charcoal)] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[color:var(--color-gold-dark)]"
                        >
                          التفاصيل
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative mt-5 h-px w-10 bg-gradient-to-l from-[color:var(--color-gold)] to-transparent transition-all duration-500 group-hover:w-20" />
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
      <ServiceVariantsDialog service={detailsFor} onClose={() => setDetailsFor(null)} />
    </section>
  );
}
