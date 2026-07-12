import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, Microscope, ShieldCheck, Sparkles, Wallet, Users } from "lucide-react";

// Navigation, static content, palette used across landing sections.
export const nav = [
  { id: "home", label: "الرئيسية" },
  { id: "about", label: "من نحن" },
  { id: "services", label: "خدماتنا" },
  { id: "doctor", label: "الطبيب" },
  { id: "gallery", label: "المعرض" },
  { id: "contact", label: "تواصل معنا" },
];

export const whyUs = [
  { icon: GraduationCap, title: "طبيب ذو خبرة", desc: "أكثر من 8 سنوات من الممارسة المتخصصة." },
  { icon: Microscope, title: "أحدث الأجهزة", desc: "تشخيص رقمي بأحدث التقنيات." },
  { icon: ShieldCheck, title: "علاج بدون ألم", desc: "تقنيات مريحة وخيارات تخدير متطورة." },
  { icon: Sparkles, title: "بيئة معقمة", desc: "معايير تعقيم بمستوى المستشفيات." },
  { icon: Wallet, title: "أسعار مناسبة", desc: "أسعار شفافة وخطط دفع مرنة." },
  { icon: Users, title: "رعاية شخصية", desc: "كل علاج مصمم خصيصاً لك." },
];

export const stats = [
  { value: 1000, suffix: "+", label: "مريض سعيد" },
  { value: 8, suffix: "+", label: "سنوات خبرة" },
  { value: 500, suffix: "+", label: "حالة ناجحة" },
  { value: 98, suffix: "%", label: "نسبة الرضا" },
];

export function useCounter(target: number, inView: boolean, duration = 1600) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, inView, duration]);
  return n;
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
}) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <div className="text-xs tracking-[0.25em] text-[color:var(--color-gold-dark)] font-bold">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-4xl leading-tight text-[color:var(--color-charcoal)] font-bold sm:text-5xl">
        {title}
      </h2>
      {sub && <p className="mt-4 text-[color:var(--color-charcoal)]/65">{sub}</p>}
    </Reveal>
  );
}

export function GoogleG({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export function ToothIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 8c-6 0-10 4-10 10 0 6 3 9 4 14 1 4 2 12 4 20 1 4 3 6 5 6s3-3 4-8c1-4 2-8 5-8s4 4 5 8c1 5 2 8 4 8s4-2 5-6c2-8 3-16 4-20 1-5 4-8 4-14 0-6-4-10-10-10-4 0-6 2-10 2s-6-2-10-2z" />
    </svg>
  );
}

const AVATAR_COLORS = [
  "#7C4DFF",
  "#6C5CE7",
  "#8E44AD",
  "#5B4636",
  "#4A6741",
  "#0D7A5F",
  "#1E88E5",
  "#00897B",
  "#E64A19",
  "#C9A84C",
  "#EF6C00",
  "#6D4C41",
];
export function pickAvatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export function formatBookingDate(value?: string) {
  const trimmed = (value || "").trim();
  const iso = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) {
    const [, year, month, day] = iso;
    const y = Number(year);
    const m = Number(month);
    const d = Number(day);
    const parsed = new Date(Date.UTC(y, m - 1, d));
    if (
      parsed.getUTCFullYear() === y &&
      parsed.getUTCMonth() === m - 1 &&
      parsed.getUTCDate() === d
    ) {
      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    }
  }
  const dmy = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (dmy) {
    const [, day, month, rawYear] = dmy;
    const year = rawYear.length === 2 ? `20${rawYear}` : rawYear;
    const y = Number(year);
    const m = Number(month);
    const d = Number(day);
    const parsed = new Date(Date.UTC(y, m - 1, d));
    if (
      parsed.getUTCFullYear() === y &&
      parsed.getUTCMonth() === m - 1 &&
      parsed.getUTCDate() === d
    ) {
      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    }
  }
  return trimmed;
}
