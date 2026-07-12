import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { SocialIcons } from "@/components/site/SocialIcons";
import { useContact } from "@/hooks/use-cms";
import { Reveal, SectionTitle } from "./_shared";

export function Contact() {
  const { data: contact } = useContact();
  const items = [
    { icon: Phone, label: "الهاتف", value: contact?.phones?.[0] || "+20 100 000 0000" },
    { icon: MessageCircle, label: "واتساب", value: contact?.whatsapp || "+20 100 000 0000" },
    { icon: MapPin, label: "العنوان", value: contact?.address || "وسط البلد - القاهرة" },
    {
      icon: Clock,
      label: "ساعات العمل",
      value: contact?.working_hours || "السبت – الخميس · 10:00 – 22:00",
    },
  ];
  const mapUrl =
    contact?.google_maps_embed_url || "https://www.google.com/maps?q=Cairo&output=embed";
  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionTitle
          eyebrow="زرنا"
          title={
            <>
              تواصل <span className="text-[color:var(--color-gold-dark)]">معنا</span>
            </>
          }
        />
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-[24px] border border-white/60 shadow-xl">
              <iframe title="خريطة" src={mapUrl} className="h-[420px] w-full" loading="lazy" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2">
              {items.map((it) => {
                const Icon = it.icon;
                return (
                  <div
                    key={it.label}
                    className="rounded-2xl border border-white/60 bg-white/70 p-6 backdrop-blur-xl transition-all hover:border-[color:var(--color-gold)]/30 hover:shadow-lg"
                  >
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--color-gold-dark)] to-[color:var(--color-gold-light)] text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-4 text-xs tracking-[0.15em] text-[color:var(--color-gold-dark)] font-bold">
                      {it.label}
                    </div>
                    <div className="mt-1 text-lg text-[color:var(--color-charcoal)] font-bold">
                      {it.value}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex justify-center">
              <SocialIcons />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default Contact;
