import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, Target, Eye, GraduationCap, Sparkles, ShieldCheck, HeartPulse, Users } from "lucide-react";
import { PageShell, Container, SectionTitle, GlassCard, GoldButtonClasses } from "@/components/site/PageShell";
import { whyUs, stats } from "@/data/clinic";
import doctorAsset from "@/assets/doctor.jpg.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن — مركز رويال ديـنـتـال" },
      { name: "description", content: "تعرف على مركز رويال ديـنـتـال، رؤيتنا ورسالتنا والدكتور مصطفى بكر مؤسس المركز." },
      { property: "og:title", content: "من نحن — مركز رويال ديـنـتـال" },
      { property: "og:description", content: "قصة مركز رويال ديـنـتـال وفريقه المتخصص." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell
      heroKicker="من نحن"
      heroTitle="قصتنا في تقديم رعاية ملكية للأسنان"
      heroSubtitle="أُسس مركز رويال ديـنـتـال ليقدم تجربة استثنائية تجمع بين الفخامة والكفاءة الطبية."
    >
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
                <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-[color:var(--color-gold-light)]/50 to-[color:var(--color-gold-dark)]/30 blur-2xl" />
                <div className="relative h-full w-full overflow-hidden rounded-[32px] border border-white/60 shadow-[0_40px_80px_-30px_rgba(31,31,31,0.35)]">
                  <img src={doctorAsset.url} alt="د. مصطفى بكر" className="h-full w-full object-cover" />
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-gold)]/30 bg-white/70 px-4 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-gold)]" />
                <span className="text-xs tracking-[0.2em] text-[color:var(--color-gold-dark)] font-semibold">نبذة عن العيادة</span>
              </div>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">مركز طب أسنان بمعايير عالمية</h2>
              <p className="mt-4 leading-relaxed text-[color:var(--color-charcoal)]/75">
                تأسس مركز رويال ديـنـتـال عام 2017 على يد الدكتور مصطفى بكر ليكون واحداً من أرقى مراكز طب الأسنان في القاهرة الجديدة. نجمع بين التقنيات الحديثة والخبرة الطبية العميقة لنقدم رعاية شخصية لكل مريض.
              </p>
              <p className="mt-3 leading-relaxed text-[color:var(--color-charcoal)]/75">
                نؤمن بأن ابتسامتك جزء من شخصيتك، لذلك نصمم لك خطة علاج متكاملة تناسب ملامحك واحتياجاتك، بأعلى معايير الجودة والراحة.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {stats.slice(0, 3).map((s) => (
                  <div key={s.label} className="rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/70 p-4 text-center backdrop-blur">
                    <div className="text-2xl font-bold text-[color:var(--color-gold-dark)]">{s.value}{s.suffix}</div>
                    <div className="mt-1 text-xs text-[color:var(--color-charcoal)]/60">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionTitle kicker="القيم" title="رؤيتنا ورسالتنا" />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              { icon: Eye, title: "رؤيتنا", text: "أن نكون المرجع الأول في طب الأسنان الفاخر في مصر والشرق الأوسط، بجودة تنافس أرقى المراكز العالمية." },
              { icon: Target, title: "رسالتنا", text: "تقديم رعاية طبية استثنائية بلمسة إنسانية، تجعل من كل زيارة تجربة راقية تليق بكل مريض." },
            ].map((c, i) => (
              <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <GlassCard className="h-full p-8">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold)]">
                    <c.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">{c.title}</h3>
                  <p className="mt-2 leading-relaxed text-[color:var(--color-charcoal)]/70">{c.text}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionTitle kicker="لماذا تختارنا" title="ميزات تجعلنا مختلفين" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((w, i) => (
              <motion.div key={w.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                <GlassCard className="group h-full transition-transform duration-300 hover:-translate-y-1">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold)]">
                    <w.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{w.title}</h3>
                  <p className="mt-1.5 text-sm text-[color:var(--color-charcoal)]/65">{w.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionTitle kicker="الشهادات" title="مؤهلات د. مصطفى بكر" />
          <div className="mx-auto mt-10 max-w-3xl space-y-3">
            {[
              "بكالوريوس طب وجراحة الفم والأسنان — جامعة القاهرة (2017)",
              "زمالة زراعة الأسنان — الأكاديمية الأوروبية لزراعة الأسنان EDA",
              "دبلوم تصميم الابتسامة الرقمي DSD — سويسرا",
              "عضو الجمعية الأمريكية لطب الأسنان ADA",
              "عضو الجمعية المصرية لزراعة الأسنان",
              "دورات متقدمة في طب الأسنان التجميلي — إيطاليا وألمانيا",
            ].map((c, i) => (
              <motion.div key={c} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="flex items-start gap-3 rounded-2xl border border-[color:var(--color-gold)]/15 bg-white/70 p-4 backdrop-blur">
                <div className="mt-0.5 grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold)]">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <span className="text-[color:var(--color-charcoal)]/80">{c}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/booking" className={GoldButtonClasses("lg")}>احجز استشارتك المجانية</Link>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
