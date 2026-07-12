import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Crown, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "الرئيسية" },
  { to: "/about", label: "من نحن" },
  { to: "/services", label: "الخدمات" },
  { to: "/doctors", label: "الأطباء" },
  { to: "/pricing", label: "الأسعار" },
  { to: "/blog", label: "المدونة" },
  { to: "/consultations", label: "استشارات" },
  { to: "/contact", label: "تواصل" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/75 backdrop-blur-xl border-b border-black/5 shadow-[0_4px_30px_rgba(0,0,0,0.04)]"
          : "bg-white/40 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)] shadow-[0_6px_20px_-6px_rgba(200,162,75,0.6)]">
            <Crown className="h-4 w-4 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-bold text-[color:var(--color-charcoal)]">رويال ديـنـتـال</div>
            <div className="text-[10px] tracking-[0.2em] text-[color:var(--color-gold-dark)]">د. مصطفى بكر</div>
          </div>
        </Link>

        <ul className="hidden items-center gap-6 lg:flex">
          {NAV.map((n) => {
            const active = path === n.to;
            return (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className={`relative text-sm transition-colors ${
                    active
                      ? "text-[color:var(--color-gold-dark)] font-semibold"
                      : "text-[color:var(--color-charcoal)]/70 hover:text-[color:var(--color-charcoal)]"
                  }`}
                >
                  {n.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-[color:var(--color-gold-dark)] to-[color:var(--color-gold-light)]"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/booking">
            <Button className="rounded-full bg-gradient-to-r from-[color:var(--color-gold-dark)] via-[color:var(--color-gold)] to-[color:var(--color-gold-light)] text-white shadow-[0_10px_30px_-10px_rgba(200,162,75,0.7)] hover:opacity-95">
              احجز موعدك
            </Button>
          </Link>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/70 backdrop-blur lg:hidden"
          aria-label="القائمة"
        >
          <Menu className="h-5 w-5 text-[color:var(--color-charcoal)]" />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <div className="text-lg font-bold">رويال ديـنـتـال</div>
              <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-black/5" aria-label="إغلاق">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="mt-6 flex flex-col items-center gap-5 pb-10">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className="text-2xl font-semibold text-[color:var(--color-charcoal)]"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
              <Link to="/booking" onClick={() => setOpen(false)} className="mt-4">
                <Button className="rounded-full bg-gradient-to-r from-[color:var(--color-gold-dark)] to-[color:var(--color-gold-light)] px-8 py-6 text-white">
                  احجز موعدك
                </Button>
              </Link>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
