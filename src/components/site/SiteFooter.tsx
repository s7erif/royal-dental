import { Link } from "@tanstack/react-router";
import { Crown, Phone, Mail, MapPin, Clock } from "lucide-react";
import { clinicInfo } from "@/data/clinic";
import { SocialIcons } from "@/components/site/SocialIcons";

export function SiteFooter() {
  const quick = [
    { to: "/", label: "الرئيسية" },
    { to: "/about", label: "من نحن" },
    { to: "/services", label: "الخدمات" },
    { to: "/doctors", label: "الأطباء" },
    { to: "/pricing", label: "الأسعار" },
  ] as const;
  const other = [
    { to: "/blog", label: "المدونة" },
    { to: "/faq", label: "الأسئلة الشائعة" },
    { to: "/consultations", label: "الاستشارات" },
    { to: "/contact", label: "تواصل معنا" },
    { to: "/booking", label: "احجز موعد" },
  ] as const;
  const legal = [
    { to: "/privacy", label: "سياسة الخصوصية" },
    { to: "/terms", label: "الشروط والأحكام" },
  ] as const;
  return (
    <footer className="relative overflow-hidden bg-[color:var(--color-charcoal)] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[color:var(--color-gold)]/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[color:var(--color-gold-dark)]/30 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)]">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-base font-bold">{clinicInfo.name}</div>
                <div className="text-[10px] tracking-[0.2em] text-[color:var(--color-gold-light)]">د. مصطفى بكر</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              مركز طب أسنان فاخر يجمع بين أحدث التقنيات ورعاية شخصية بلمسة ملكية لكل مريض.
            </p>
            <div className="mt-5">
              <SocialIcons />
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-[color:var(--color-gold-light)]">روابط سريعة</h4>
            <ul className="space-y-2.5">
              {quick.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-white/70 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-[color:var(--color-gold-light)]">استكشف</h4>
            <ul className="space-y-2.5">
              {other.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-white/70 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-[color:var(--color-gold-light)]">تواصل معنا</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-gold-light)]" />
                <span>{clinicInfo.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[color:var(--color-gold-light)]" />
                <a href={`tel:${clinicInfo.phone}`} dir="ltr">{clinicInfo.phoneDisplay}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[color:var(--color-gold-light)]" />
                <a href={`mailto:${clinicInfo.email}`} dir="ltr">{clinicInfo.email}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-gold-light)]" />
                <span>{clinicInfo.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <div>© {new Date().getFullYear()} مركز رويال ديـنـتـال — جميع الحقوق محفوظة.</div>
          <div className="flex items-center gap-4">
            {legal.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-white">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
