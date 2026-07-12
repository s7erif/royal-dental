import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Clock, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PageShell, Container, GoldButtonClasses } from "@/components/site/PageShell";
import { fetchPublicServices } from "@/lib/public-services";
import { getIcon } from "@/lib/icon-registry";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "خدماتنا — مركز رويال ديـنـتـال" },
      { name: "description", content: "مجموعة متكاملة من خدمات طب الأسنان: زراعة، تجميل، تبييض، تقويم، وأكثر." },
      { property: "og:title", content: "خدماتنا — مركز رويال ديـنـتـال" },
      { property: "og:description", content: "خدمات طب أسنان شاملة بأحدث التقنيات." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["public-services"],
    queryFn: fetchPublicServices,
  });

  return (
    <PageShell heroKicker="خدماتنا" heroTitle="رعاية أسنان متكاملة بلمسة ملكية" heroSubtitle={`${services.length} خدمة متخصصة نقدمها بأعلى معايير الجودة والراحة.`}>
      <section className="pb-20">
        <Container>
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-[28px] border border-white/60 bg-white/50" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-black/10 bg-white/50 p-16 text-center text-[color:var(--color-charcoal)]/60">
              سيتم عرض الخدمات هنا قريباً.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {services.map((s, i) => {
                const Icon = getIcon(s.icon);
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: (i % 2) * 0.05 }}
                    className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-white/70 p-7 shadow-[0_20px_60px_-30px_rgba(31,31,31,0.2)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-[color:var(--color-gold-light)]/25 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative flex items-start justify-between gap-4">
                      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)] shadow-[0_10px_30px_-10px_rgba(200,162,75,0.6)]">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      {s.price && (
                        <div className="rounded-full border border-[color:var(--color-gold)]/25 bg-white/70 px-3 py-1 text-xs font-semibold text-[color:var(--color-gold-dark)]">
                          {s.price}
                        </div>
                      )}
                    </div>
                    <h3 className="relative mt-5 text-2xl font-bold">{s.name_ar}</h3>
                    <p className="relative mt-2 leading-relaxed text-[color:var(--color-charcoal)]/70">
                      {s.description_ar || s.short_desc_ar}
                    </p>

                    {s.features.length > 0 && (
                      <ul className="relative mt-4 grid grid-cols-2 gap-2">
                        {s.features.map((f) => (
                          <li key={f} className="flex items-start gap-1.5 text-xs text-[color:var(--color-charcoal)]/75">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--color-gold-dark)]" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="relative mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-[color:var(--color-charcoal)]/60">
                        {s.duration && (<><Clock className="h-3.5 w-3.5" /><span>{s.duration}</span></>)}
                      </div>
                      <Link
                        to={s.button_url || "/booking"}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-charcoal)] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[color:var(--color-gold-dark)]"
                      >
                        {s.button_text || "احجز الآن"}
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="mt-14 text-center">
            <Link to="/pricing" className={GoldButtonClasses("lg")}>عرض قائمة الأسعار الكاملة</Link>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
