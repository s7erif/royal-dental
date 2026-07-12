import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Calendar, ArrowLeft, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PageShell, Container } from "@/components/site/PageShell";
import {
  fetchPublicServices,
  fetchPublicCategories,
  formatPrice,
  groupedStartingFrom,
  type PublicService,
  type PublicVariant,
} from "@/lib/public-services";
import { getIcon } from "@/lib/icon-registry";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "الخدمات والأسعار — مركز رويال ديـنـتـال" },
      { name: "description", content: "تعرف على أشهر خدماتنا وأسعارها بكل شفافية. أسعار واضحة وخيارات دفع مرنة." },
      { property: "og:title", content: "الخدمات والأسعار — مركز رويال ديـنـتـال" },
      { property: "og:description", content: "أسعار شفافة لجميع خدمات الأسنان." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["public-services"],
    queryFn: fetchPublicServices,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["public-service-categories"],
    queryFn: fetchPublicCategories,
  });

  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");
  const [detailsFor, setDetailsFor] = useState<PublicService | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter((s) => {
      if (activeCat !== "all" && s.category_id !== activeCat) return false;
      if (!q) return true;
      return (
        s.name_ar.toLowerCase().includes(q) ||
        (s.name_en || "").toLowerCase().includes(q) ||
        (s.short_desc_ar || "").toLowerCase().includes(q)
      );
    });
  }, [services, query, activeCat]);

  return (
    <PageShell
      heroKicker="الأسعار"
      heroTitle="الخدمات والأسعار"
      heroSubtitle="أسعار واضحة وشفافة لكل خدماتنا. بعض الخدمات لها سعر ثابت، وبعضها يتوفر بعدة خيارات."
    >
      <section className="pb-20">
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[color:var(--color-charcoal)]/40" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن خدمة..."
                className="h-14 w-full rounded-full border border-white/70 bg-white/80 px-14 text-base shadow-[0_20px_60px_-30px_rgba(31,31,31,0.25)] outline-none backdrop-blur-xl transition-all placeholder:text-[color:var(--color-charcoal)]/40 focus:border-[color:var(--color-gold)] focus:shadow-[0_25px_60px_-25px_rgba(200,162,75,0.4)]"
              />
            </div>
          </div>

          <div className="mt-8 -mx-4 overflow-x-auto px-4">
            <div className="flex min-w-max justify-center gap-2 pb-2">
              <TabButton active={activeCat === "all"} onClick={() => setActiveCat("all")}>الكل</TabButton>
              {categories.map((c) => (
                <TabButton key={c.id} active={activeCat === c.id} onClick={() => setActiveCat(c.id)}>
                  {c.name_ar}
                </TabButton>
              ))}
            </div>
          </div>

          <div className="mt-10">
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-72 animate-pulse rounded-[28px] border border-white/60 bg-white/50" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-black/10 bg-white/50 p-16 text-center text-[color:var(--color-charcoal)]/60">
                لا توجد خدمات مطابقة لبحثك.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((s, i) =>
                  s.service_type === "grouped" ? (
                    <GroupedCard key={s.id} service={s} index={i} onOpen={() => setDetailsFor(s)} />
                  ) : (
                    <SimpleCard key={s.id} service={s} index={i} />
                  ),
                )}
              </div>
            )}
          </div>

          <p className="mt-12 flex items-center justify-center gap-2 text-center text-xs text-[color:var(--color-charcoal)]/60">
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--color-gold-dark)]" />
            الأسعار قابلة للتغير حسب الحالة. تُحدد النهائية بعد الفحص المجاني.
          </p>
        </Container>
      </section>

      <DetailsDialog service={detailsFor} onClose={() => setDetailsFor(null)} />
    </PageShell>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
        active
          ? "bg-gradient-to-l from-[color:var(--color-gold-dark)] to-[color:var(--color-gold-light)] text-white shadow-[0_10px_30px_-10px_rgba(200,162,75,0.6)]"
          : "border border-white/70 bg-white/60 text-[color:var(--color-charcoal)]/70 backdrop-blur-xl hover:border-[color:var(--color-gold)]/40 hover:text-[color:var(--color-gold-dark)]"
      }`}
    >
      {children}
    </button>
  );
}

function CardShell({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.05 }}
      className="group relative flex flex-col overflow-hidden rounded-[28px] border border-white/60 bg-white/75 p-7 shadow-[0_20px_60px_-30px_rgba(31,31,31,0.2)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_80px_-30px_rgba(200,162,75,0.35)]"
    >
      <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-[color:var(--color-gold-light)]/25 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {children}
    </motion.div>
  );
}

function IconBadge({ name }: { name: string }) {
  const Icon = getIcon(name);
  return (
    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)] shadow-[0_10px_30px_-10px_rgba(200,162,75,0.6)]">
      <Icon className="h-6 w-6 text-white" />
    </div>
  );
}

function SimpleCard({ service, index }: { service: PublicService; index: number }) {
  const price = formatPrice(service);
  return (
    <CardShell index={index}>
      <div className="relative flex items-start justify-between gap-4">
        <IconBadge name={service.icon} />
        {price.isConsultation && (
          <span className="rounded-full bg-gradient-to-l from-[color:var(--color-gold-dark)] to-[color:var(--color-gold-light)] px-3 py-1 text-xs font-bold text-white">
            حسب الحالة
          </span>
        )}
      </div>

      <h3 className="relative mt-5 text-xl font-bold">{service.name_ar}</h3>
      {service.short_desc_ar && (
        <p className="relative mt-2 line-clamp-2 flex-1 leading-relaxed text-sm text-[color:var(--color-charcoal)]/70">
          {service.short_desc_ar}
        </p>
      )}

      {!price.isConsultation && (
        <div className="relative mt-5 rounded-2xl border border-[color:var(--color-gold)]/25 bg-white/70 px-4 py-3 text-center">
          <div className="text-[11px] text-[color:var(--color-charcoal)]/50">السعر</div>
          <div className="text-2xl font-black text-[color:var(--color-gold-dark)]">{price.label}</div>
        </div>
      )}

      <Link
        to="/booking"
        search={{ service: service.slug }}
        className="relative mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-charcoal)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--color-gold-dark)]"
      >
        <Calendar className="h-4 w-4" />
        احجز الآن
      </Link>
    </CardShell>
  );
}

function GroupedCard({ service, index, onOpen }: { service: PublicService; index: number; onOpen: () => void }) {
  const start = groupedStartingFrom(service.variants);
  const fmt = (n: number) => new Intl.NumberFormat("ar-EG").format(n);
  const count = service.variants.length;
  return (
    <CardShell index={index}>
      <div className="relative flex items-start justify-between gap-4">
        <IconBadge name={service.icon} />
        <span className="rounded-full border border-[color:var(--color-gold)]/30 bg-white/70 px-3 py-1 text-[11px] font-bold text-[color:var(--color-gold-dark)]">
          {count} خيارات
        </span>
      </div>
      <h3 className="relative mt-5 text-xl font-bold">{service.name_ar}</h3>
      {service.short_desc_ar && (
        <p className="relative mt-2 line-clamp-2 flex-1 leading-relaxed text-sm text-[color:var(--color-charcoal)]/70">
          {service.short_desc_ar}
        </p>
      )}
      <div className="relative mt-5 rounded-2xl border border-[color:var(--color-gold)]/25 bg-white/70 px-4 py-3 text-center">
        <div className="text-[11px] text-[color:var(--color-charcoal)]/50">
          {start != null ? "يبدأ من" : "تتوفر بعدة خيارات"}
        </div>
        {start != null && (
          <div className="text-2xl font-black text-[color:var(--color-gold-dark)]">{fmt(start)} جنيه</div>
        )}
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="relative mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-charcoal)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--color-gold-dark)]"
      >
        عرض التفاصيل
        <ArrowLeft className="h-4 w-4" />
      </button>
    </CardShell>
  );
}

function VariantPrice({ v }: { v: PublicVariant }) {
  const label = formatPrice(v).label;
  return <div className="text-lg font-bold text-[color:var(--color-gold-dark)]">{label}</div>;
}

function DetailsDialog({ service, onClose }: { service: PublicService | null; onClose: () => void }) {
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
              className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-[color:var(--color-charcoal)]/5 text-[color:var(--color-charcoal)] transition-colors hover:bg-[color:var(--color-charcoal)]/10"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              <IconBadge name={service.icon} />
              <div>
                <h3 className="text-2xl font-bold">{service.name_ar}</h3>
                {service.short_desc_ar && (
                  <p className="mt-1 text-sm text-[color:var(--color-charcoal)]/70">{service.short_desc_ar}</p>
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
                    <VariantPrice v={v} />
                  </div>
                ))
              )}
            </div>

            <Link
              to="/booking"
              search={{ service: service.slug }}
              onClick={onClose}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-l from-[color:var(--color-gold-dark)] to-[color:var(--color-gold-light)] px-5 py-3 text-sm font-bold text-white shadow-[0_15px_40px_-15px_rgba(200,162,75,0.7)]"
            >
              <Calendar className="h-4 w-4" />
              احجز الآن
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
