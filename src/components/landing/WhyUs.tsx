import { Reveal, SectionTitle, whyUs } from "./_shared";

export function WhyUs() {
  return (
    <section className="relative py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[color:var(--color-gold-light)]/10 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionTitle eyebrow="لماذا تختارنا" title={<>الفرق الملكي</>} />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((w, i) => {
            const Icon = w.icon;
            return (
              <Reveal key={w.title} delay={i * 0.05}>
                <div className="flex h-full items-start gap-4 rounded-[22px] border border-white/60 bg-white/70 p-6 backdrop-blur-xl transition-all hover:border-[color:var(--color-gold)]/30 hover:shadow-xl">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[color:var(--color-gold-dark)] to-[color:var(--color-gold-light)] text-white shadow-[0_10px_25px_-10px_rgba(200,162,75,0.7)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg text-[color:var(--color-charcoal)] font-bold">
                      {w.title}
                    </h3>
                    <p className="mt-1 text-sm text-[color:var(--color-charcoal)]/65">{w.desc}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
