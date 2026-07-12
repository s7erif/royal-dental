import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, Calendar, GraduationCap } from "lucide-react";
import { PageShell, Container } from "@/components/site/PageShell";
import { doctors } from "@/data/clinic";
import doctorAsset from "@/assets/doctor.jpg.asset.json";

export const Route = createFileRoute("/doctors")({
  head: () => ({
    meta: [
      { title: "الأطباء — مركز رويال ديـنـتـال" },
      { name: "description", content: "تعرف على فريق أطباء رويال ديـنـتـال المتخصصين في مختلف مجالات طب الأسنان." },
      { property: "og:title", content: "الأطباء — مركز رويال ديـنـتـال" },
      { property: "og:description", content: "نخبة من الأطباء المتخصصين في طب الأسنان." },
    ],
  }),
  component: DoctorsPage,
});

const gradients = [
  "from-[#c8a24b] to-[#a3822f]",
  "from-[#e5c98a] to-[#c8a24b]",
  "from-[#1f1f1f] to-[#3a3a3a]",
  "from-[#a3822f] to-[#c8a24b]",
];

function DoctorsPage() {
  return (
    <PageShell heroKicker="فريقنا" heroTitle="أطباء متخصصون بخبرة عالمية" heroSubtitle="نخبة من أطباء الأسنان المتخصصين في مختلف المجالات لتقديم أفضل رعاية ممكنة لك.">
      <section className="pb-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            {doctors.map((d, i) => (
              <motion.div
                key={d.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
                className="group overflow-hidden rounded-[28px] border border-white/60 bg-white/70 shadow-[0_25px_60px_-30px_rgba(31,31,31,0.25)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
              >
                <div className={`relative h-72 overflow-hidden bg-gradient-to-br ${gradients[i % gradients.length]}`}>
                  {i === 0 ? (
                    <img src={doctorAsset.url} alt={d.name} className="h-full w-full object-cover object-top" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="grid h-32 w-32 place-items-center rounded-full border-4 border-white/40 bg-white/20 backdrop-blur-xl">
                        <span className="text-5xl font-bold text-white">{d.name.split(" ")[1]?.[0] || "د"}</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-charcoal)]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between">
                    <div className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xl">
                      {d.years}+ سنوات خبرة
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold">{d.name}</h3>
                  <div className="mt-1 text-sm font-semibold text-[color:var(--color-gold-dark)]">{d.title}</div>
                  <div className="mt-1 text-xs text-[color:var(--color-charcoal)]/60">{d.speciality}</div>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-charcoal)]/70">{d.bio}</p>

                  <div className="mt-4 space-y-1.5">
                    {d.certifications.slice(0, 3).map((c) => (
                      <div key={c} className="flex items-start gap-2 text-xs text-[color:var(--color-charcoal)]/70">
                        <GraduationCap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--color-gold-dark)]" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/booking"
                    search={{ doctor: d.slug }}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--color-gold-dark)] via-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_-10px_rgba(200,162,75,0.6)] hover:opacity-95"
                  >
                    <Calendar className="h-4 w-4" />
                    احجز مع {d.name.split(" ").slice(0, 2).join(" ")}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
