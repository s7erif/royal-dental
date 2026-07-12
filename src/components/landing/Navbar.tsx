import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Crown, Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nav } from "./_shared";

export function Navbar({ active }: { active: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/70 backdrop-blur-xl border-b border-black/5 shadow-[0_4px_30px_rgba(0,0,0,0.04)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
      <a href="#home" className="flex items-center gap-3">
  <img
    src="/logo.png"
    alt="Royal Dental"
    className="h-16 w-16 object-contain"
  />

  <div className="leading-tight">
    <div className="text-[15px] font-bold text-[color:var(--color-charcoal)]">
      رويال ديـنـتـال
    </div>

    <div className="text-sm text-[color:var(--color-gold-dark)]">
      د. مصطفى بكر
    </div>
  </div>

        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className={`text-sm transition-colors ${
                  active === n.id
                    ? "text-[color:var(--color-gold-dark)] font-semibold"
                    : "text-[color:var(--color-charcoal)]/70 hover:text-[color:var(--color-charcoal)]"
                }`}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#book" className="hidden md:inline-flex">
          <Button className="rounded-full bg-gradient-to-r from-[color:var(--color-gold-dark)] via-[color:var(--color-gold)] to-[color:var(--color-gold-light)] text-white shadow-[0_10px_30px_-10px_rgba(200,162,75,0.7)] hover:opacity-95">
            احجز موعدك
          </Button>
        </a>
        <button
          onClick={() => setOpen(true)}
          className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-md ring-1 ring-black/5 md:hidden"
          aria-label="القائمة"
        >
          <Menu className="h-5 w-5 text-[color:var(--color-charcoal)]" />
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-y-0 right-0 z-50 flex h-[100dvh] w-[85%] max-w-sm flex-col bg-white shadow-2xl md:hidden"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)]">
<img
  src="/logo.png"
  alt="Royal Dental"
  className="h-16 w-16 sm:h-16 sm:w-16 object-contain"
/>
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-bold text-[color:var(--color-charcoal)]">
                      رويال ديـنـتـال
                    </div>
                    <div className="text-[10px] tracking-[0.15em] text-[color:var(--color-gold-dark)]">
                      د. مصطفى بكر
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="إغلاق"
                  className="grid h-10 w-10 place-items-center rounded-full bg-black/5 text-[color:var(--color-charcoal)] transition hover:bg-black/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <ul className="flex-1 overflow-y-auto px-3 py-4">
                {nav.map((n) => {
                  const isActive = active === n.id;
                  return (
                    <li key={n.id}>
                      <a
                        onClick={() => setOpen(false)}
                        href={`#${n.id}`}
                        className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold transition ${
                          isActive
                            ? "bg-[color:var(--color-gold-dark)]/10 text-[color:var(--color-gold-dark)]"
                            : "text-[color:var(--color-charcoal)] hover:bg-black/5"
                        }`}
                      >
                        <span>{n.label}</span>
                        <ChevronLeft className="h-4 w-4 opacity-40" />
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-black/5 bg-white p-4">
                <a href="#book" onClick={() => setOpen(false)} className="block">
                  <Button className="w-full rounded-full bg-gradient-to-r from-[color:var(--color-gold-dark)] via-[color:var(--color-gold)] to-[color:var(--color-gold-light)] py-6 text-base font-bold text-white shadow-[0_10px_30px_-10px_rgba(200,162,75,0.7)]">
                    احجز موعدك
                  </Button>
                </a>
                <a
                  href="tel:+201000000000"
                  className="mt-3 flex items-center justify-center gap-2 rounded-full border border-black/10 py-3 text-sm font-bold text-[color:var(--color-charcoal)]"
                >
                  <Phone className="h-4 w-4" />
                  اتصل الآن
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
