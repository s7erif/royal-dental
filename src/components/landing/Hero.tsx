import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContact, useHero, useSocialLinks } from "@/hooks/use-cms";
import { getIcon } from "@/lib/icon-registry";
import doctorAsset from "@/assets/doctor.jpg.asset.json";
import type { PublicSocialLink } from "@/lib/public-cms";

export function Hero() {
  const { data: hero } = useHero();
  const { data: contact } = useContact();
  const { data: socialLinks } = useSocialLinks();

  const badge = hero?.badge_text || "مركز رويال ديـنـتـال";
  const titleLine1 = hero?.title_line1 || "ابتسامتك تستحق";
  const titleHighlight = hero?.title_highlight || "رعاية ملكية";
  const subtitle =
    hero?.subtitle ||
    "طب أسنان متقدم بأحدث التقنيات ورعاية شخصية — مصمم ليجعل كل زيارة راقية بقدر الابتسامة التي تخرج بها.";
  const primaryLabel = hero?.primary_cta_label || "احجز موعدك";
  const primaryUrl = hero?.primary_cta_url || "#book";
  const secondaryLabel = hero?.secondary_cta_label || "اتصل الآن";

  const contactDigits = (contact?.whatsapp || "").replace(/[^\d]/g, "");
  const socialWa = (socialLinks ?? []).find((l: PublicSocialLink) => l.platform === "whatsapp");
  const socialDigits = (socialWa?.url || "").replace(/[^\d]/g, "");
  const digits = contactDigits || socialDigits;
  const secondaryUrl = digits ? `https://wa.me/${digits}` : "tel:+201000000000";
  const imageUrl = hero?.image_url || doctorAsset.url;
  const captionEyebrow = hero?.image_caption_eyebrow || "الطبيب المؤسس";
  const captionTitle = hero?.image_caption_title || "د. مصطفى بكر";
  const floats = (
    hero?.floating_items && hero.floating_items.length > 0
      ? hero.floating_items
      : [
          { icon: "Sparkles", label: "تجميل الأسنان" },
          { icon: "Stethoscope", label: "زراعة الأسنان" },
          { icon: "HeartPulse", label: "علاج الجذور" },
          { icon: "Sparkle", label: "تبييض الأسنان" },
        ]
  ).map((f) => ({ Icon: getIcon(f.icon), label: f.label }));

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 80]);
  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-24 sm:pt-40 sm:pb-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[color:var(--color-gold-light)]/25 blur-3xl" />
        <div className="absolute top-1/2 -left-32 h-[420px] w-[420px] rounded-full bg-[color:var(--color-gold)]/15 blur-3xl" />
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-gold)]/30 bg-white/60 px-4 py-1.5 backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-gold)]" />
            <span className="text-xs tracking-[0.2em] text-[color:var(--color-gold-dark)] font-semibold">
              {badge}
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-6 text-[38px] leading-[1.15] tracking-tight text-[color:var(--color-charcoal)] font-bold sm:text-6xl lg:text-7xl"
          >
            {titleLine1}
            <br />
            <span className="bg-gradient-to-r from-[color:var(--color-gold-dark)] via-[color:var(--color-gold)] to-[color:var(--color-gold-light)] bg-clip-text text-transparent">
              {titleHighlight}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-[color:var(--color-charcoal)]/70 sm:text-lg"
          >
            {subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            {primaryLabel ? (
              <a href={primaryUrl}>
                <Button
                  size="lg"
                  className="h-12 rounded-full bg-gradient-to-r from-[color:var(--color-gold-dark)] via-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-7 text-white shadow-[0_15px_40px_-12px_rgba(200,162,75,0.65)] hover:opacity-95"
                >
                  <Calendar className="ml-1 h-4 w-4" />
                  {primaryLabel}
                </Button>
              </a>
            ) : null}
            {secondaryLabel ? (
              <a href={secondaryUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-[color:var(--color-charcoal)]/15 bg-white/70 px-7 text-[color:var(--color-charcoal)] backdrop-blur hover:bg-white"
                >
                  <MessageCircle className="ml-1 h-4 w-4" />
                  {secondaryLabel}
                </Button>
              </a>
            ) : null}
          </motion.div>
        </div>

        <motion.div style={{ y }} className="relative">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-[color:var(--color-gold-light)]/50 to-[color:var(--color-gold-dark)]/30 blur-2xl" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full w-full overflow-hidden rounded-[32px] border border-white/60 shadow-[0_40px_80px_-30px_rgba(31,31,31,0.35)]"
            >
              <img src={imageUrl} alt={captionTitle} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-charcoal)]/40 via-transparent to-transparent" />
              {(captionEyebrow || captionTitle) && (
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/30 bg-white/15 p-4 backdrop-blur-xl">
                  {captionEyebrow && (
                    <div className="text-white text-xs tracking-[0.2em] opacity-80 font-semibold">
                      {captionEyebrow}
                    </div>
                  )}
                  {captionTitle && (
                    <div className="mt-1 text-xl text-white font-bold">{captionTitle}</div>
                  )}
                </div>
              )}
            </motion.div>

            {floats.map((f, i) => {
              const positions = [
                "top-4 -right-6 sm:-right-10",
                "top-1/3 -left-6 sm:-left-10",
                "bottom-24 -right-8 sm:-right-14",
                "bottom-6 -left-4 sm:-left-8",
              ];
              const Icon = f.Icon;
              return (
                <motion.div
                  key={`${f.label}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.15, duration: 0.6 }}
                  className={`absolute ${positions[i % positions.length]} hidden sm:block`}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center gap-2.5 rounded-2xl border border-white/60 bg-white/70 px-4 py-2.5 shadow-[0_15px_40px_-15px_rgba(31,31,31,0.25)] backdrop-blur-xl"
                  >
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold)]">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-[color:var(--color-charcoal)]">
                      {f.label}
                    </span>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:hidden">
            {floats.map((f, i) => {
              const Icon = f.Icon;
              return (
                <div
                  key={`m-${f.label}-${i}`}
                  className="flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/80 px-3 py-2.5 shadow-[0_10px_25px_-15px_rgba(31,31,31,0.25)] backdrop-blur-xl"
                >
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold)]">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="min-w-0 truncate text-[13px] font-semibold text-[color:var(--color-charcoal)]">
                    {f.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
