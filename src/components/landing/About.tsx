import { Award, Check } from "lucide-react";
import { useAbout, useAdvantages, useTimeline } from "@/hooks/use-cms";
import { Reveal } from "./_shared";

export function About() {
  const { data: about } = useAbout();
  const { data: advantages = [] } = useAdvantages();
  const { data: timelineRows = [] } = useTimeline();
  const eyebrow = about?.eyebrow || "عن العيادة";
  const title = about?.title || "ملاذ خاص لطب الأسنان";
  const highlight = about?.highlight || "الراقي";
  const description =
    about?.description || "في مركز رويال ديـنـتـال، ندمج بين التميز الطبي وهدوء المنتجعات الفاخرة.";
  const imageUrl =
    about?.image_url ||
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80";
  const badgeTitle = about?.badge_title || "تميز معتمد";
  const badgeSub = about?.badge_subtitle || "منذ 2017";
  const bullets =
    advantages.length > 0
      ? advantages.map((a) => a.title)
      : about?.bullets && about.bullets.length > 0
        ? about.bullets
        : [];
  return (
    <section id="about" className="py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          <div className="text-xs tracking-[0.25em] text-[color:var(--color-gold-dark)] font-bold">
            {eyebrow}
          </div>
          <h2 className="mt-3 text-4xl leading-tight text-[color:var(--color-charcoal)] font-bold sm:text-5xl">
            {title}
            {highlight && <span className="text-[color:var(--color-gold-dark)]"> {highlight}</span>}
          </h2>
          <p className="mt-5 leading-relaxed text-[color:var(--color-charcoal)]/70">
            {description}
          </p>
          {bullets.length > 0 && (
            <ul className="mt-6 space-y-3">
              {bullets.map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-3 text-[color:var(--color-charcoal)]/80"
                >
                  <span className="mt-1 grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)]">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          )}

          {timelineRows.length > 0 && (
            <div className="mt-10 border-r border-[color:var(--color-gold)]/30 pr-5">
              {timelineRows.map((t) => (
                <div key={t.id} className="relative py-3">
                  <span className="absolute -right-[27px] top-4 h-3 w-3 rounded-full bg-gradient-to-br from-[color:var(--color-gold)] to-[color:var(--color-gold-dark)] ring-4 ring-white" />
                  <div className="text-lg text-[color:var(--color-charcoal)] font-bold">
                    {t.year}
                    {t.title ? ` — ${t.title}` : ""}
                  </div>
                  {t.description && (
                    <div className="text-sm text-[color:var(--color-charcoal)]/60">
                      {t.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Reveal>

        <Reveal delay={0.15} className="order-1 lg:order-2">
          <div className="relative">
            <div className="absolute -inset-6 rounded-[36px] bg-gradient-to-tr from-[color:var(--color-gold-light)]/50 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/60 shadow-[0_40px_80px_-30px_rgba(31,31,31,0.35)]">
              <img src={imageUrl} alt={title} className="h-[520px] w-full object-cover" />
            </div>
            {(badgeTitle || badgeSub) && (
              <div className="absolute -bottom-6 -right-4 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-2xl backdrop-blur-xl sm:-right-8">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-[color:var(--color-gold-dark)]" />
                  <div>
                    {badgeTitle && <div className="text-lg font-bold">{badgeTitle}</div>}
                    {badgeSub && (
                      <div className="text-xs text-[color:var(--color-charcoal)]/60">
                        {badgeSub}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
