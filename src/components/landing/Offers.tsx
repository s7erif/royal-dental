import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/icon-registry";
import { useContact, useOffers } from "@/hooks/use-cms";
import { Reveal, SectionTitle } from "./_shared";

export function Offers() {
  const { data: offers = [] } = useOffers();
  const { data: contact } = useContact();
  if (contact && contact.offers_section_enabled === false) return null;
  if (offers.length === 0) return null;
  return (
    <section id="offers" className="py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionTitle
          eyebrow="العروض"
          title={
            <>
              العروض <span className="text-[color:var(--color-gold-dark)]">الحالية</span>
            </>
          }
          sub="استفد من أحدث عروض العيادة لفترة محدودة."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((o, i) => {
            const Icon = getIcon(o.icon);
            return (
              <Reveal key={o.id} delay={i * 0.08}>
                <div className="group relative h-full overflow-hidden rounded-[24px] border border-white/60 bg-white/70 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[color:var(--color-gold)]/30 hover:shadow-[0_30px_60px_-30px_rgba(200,162,75,0.45)]">
                  <div className="absolute inset-x-0 -top-24 h-40 rounded-full bg-gradient-to-b from-[color:var(--color-gold-light)]/30 to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[color:var(--color-gold-light)]/30 to-[color:var(--color-gold)]/10 text-[color:var(--color-gold-dark)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    {(o.badge || o.discount) && (
                      <span className="shrink-0 rounded-full border border-[color:var(--color-gold)]/30 bg-white/80 px-3 py-1 text-[10px] tracking-[0.15em] text-[color:var(--color-gold-dark)] font-semibold">
                        {o.badge || o.discount}
                      </span>
                    )}
                  </div>
                  <h3 className="relative mt-5 text-xl text-[color:var(--color-charcoal)] font-bold leading-snug">
                    {o.title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-[color:var(--color-charcoal)]/60">
                    {o.description}
                  </p>
                  {(o.old_price || o.new_price) && (
                    <div className="relative mt-3 flex items-center gap-3">
                      {o.old_price && (
                        <span className="text-sm text-[color:var(--color-charcoal)]/50 line-through">
                          {o.old_price}
                        </span>
                      )}
                      {o.new_price && (
                        <span className="text-lg font-bold text-[color:var(--color-gold-dark)]">
                          {o.new_price}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="relative mt-6">
                    <a href={o.button_url || "#book"}>
                      <Button className="h-11 rounded-full bg-gradient-to-r from-[color:var(--color-gold-dark)] via-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-6 text-white shadow-[0_10px_30px_-10px_rgba(200,162,75,0.7)] hover:opacity-95">
                        {o.button_text || "احجز الآن"}
                      </Button>
                    </a>
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
