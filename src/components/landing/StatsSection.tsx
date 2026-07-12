import { useRef } from "react";
import { useInView } from "framer-motion";
import { stats, useCounter } from "./_shared";

function StatItem({
  value,
  suffix,
  label,
  inView,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  inView: boolean;
  delay: number;
}) {
  const n = useCounter(value, inView, 1400 + delay);
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-[color:var(--color-charcoal)] sm:text-5xl">
        <span className="bg-gradient-to-b from-[color:var(--color-gold-dark)] to-[color:var(--color-gold-light)] bg-clip-text text-transparent">
          {n}
          {suffix}
        </span>
      </div>
      <div className="mt-2 text-xs tracking-[0.15em] text-[color:var(--color-charcoal)]/60 sm:text-sm font-semibold">
        {label}
      </div>
    </div>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} className="relative pt-6 pb-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-4 rounded-[28px] border border-white/60 bg-white/60 p-6 shadow-[0_30px_80px_-40px_rgba(31,31,31,0.3)] backdrop-blur-xl sm:p-10 md:grid-cols-4">
          {stats.map((s, i) => (
            <StatItem
              key={s.label}
              value={s.value}
              suffix={s.suffix}
              label={s.label}
              inView={inView}
              delay={i * 200}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
