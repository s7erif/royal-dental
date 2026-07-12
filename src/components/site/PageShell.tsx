import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PageShell({
  children,
  heroTitle,
  heroKicker,
  heroSubtitle,
}: {
  children: ReactNode;
  heroTitle?: string;
  heroKicker?: string;
  heroSubtitle?: string;
}) {
  return (
    <div className="min-h-screen bg-[color:var(--color-cream)] text-[color:var(--color-charcoal)]">
      <SiteHeader />
      <main>
        {heroTitle && (
          <section className="relative overflow-hidden pt-32 pb-14 sm:pt-40 sm:pb-20">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute -top-40 -right-40 h-[420px] w-[420px] rounded-full bg-[color:var(--color-gold-light)]/25 blur-3xl" />
              <div className="absolute top-1/2 -left-32 h-[360px] w-[360px] rounded-full bg-[color:var(--color-gold)]/15 blur-3xl" />
            </div>
            <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
              {heroKicker && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-gold)]/30 bg-white/60 px-4 py-1.5 backdrop-blur"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-gold)]" />
                  <span className="text-xs tracking-[0.2em] text-[color:var(--color-gold-dark)] font-semibold">{heroKicker}</span>
                </motion.div>
              )}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="mt-5 text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl"
              >
                <span className="bg-gradient-to-l from-[color:var(--color-gold-dark)] via-[color:var(--color-charcoal)] to-[color:var(--color-charcoal)] bg-clip-text text-transparent">
                  {heroTitle}
                </span>
              </motion.h1>
              {heroSubtitle && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                  className="mx-auto mt-5 max-w-2xl text-base text-[color:var(--color-charcoal)]/70 sm:text-lg"
                >
                  {heroSubtitle}
                </motion.p>
              )}
            </div>
          </section>
        )}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function SectionTitle({
  kicker,
  title,
  subtitle,
  center = true,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {kicker && (
        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-gold)]/30 bg-white/70 px-4 py-1.5 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-gold)]" />
          <span className="text-xs tracking-[0.2em] text-[color:var(--color-gold-dark)] font-semibold">{kicker}</span>
        </div>
      )}
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-[color:var(--color-charcoal)] sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-[color:var(--color-charcoal)]/65 sm:text-lg">{subtitle}</p>
      )}
    </div>
  );
}

export function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[24px] border border-white/60 bg-white/70 p-6 shadow-[0_20px_60px_-30px_rgba(31,31,31,0.2)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

export function GoldButtonClasses(size: "sm" | "md" | "lg" = "md") {
  const sizes = { sm: "h-10 px-5 text-sm", md: "h-11 px-6 text-sm", lg: "h-12 px-7 text-base" };
  return `inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--color-gold-dark)] via-[color:var(--color-gold)] to-[color:var(--color-gold-light)] font-semibold text-white shadow-[0_15px_40px_-12px_rgba(200,162,75,0.65)] transition-opacity hover:opacity-95 ${sizes[size]}`;
}
