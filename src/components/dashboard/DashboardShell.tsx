import { type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Crown, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = { to: string; label: string; icon: LucideIcon };

export function DashboardShell({ title, role, items, children }: { title: string; role: string; items: NavItem[]; children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-[color:var(--color-cream)] text-[color:var(--color-charcoal)]">
      <div className="mx-auto flex max-w-[1400px] gap-6 p-4 sm:p-6">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-6 rounded-[24px] border border-white/60 bg-white/80 p-5 backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(31,31,31,0.15)]">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)]">
                <Crown className="h-4 w-4 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-bold">رويال ديـنـتـال</div>
                <div className="text-[10px] tracking-[0.15em] text-[color:var(--color-gold-dark)]">{role}</div>
              </div>
            </Link>
            <div className="my-5 h-px bg-[color:var(--color-charcoal)]/10" />
            <nav className="space-y-1">
              {items.map((it) => {
                const active = path === it.to || (it.to !== "/" && path.startsWith(it.to));
                return (
                  <Link key={it.to} to={it.to} className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${active ? "bg-gradient-to-l from-[color:var(--color-gold-light)]/30 to-transparent text-[color:var(--color-gold-dark)]" : "text-[color:var(--color-charcoal)]/70 hover:bg-black/5"}`}>
                    <it.icon className="h-4 w-4" />{it.label}
                  </Link>
                );
              })}
            </nav>
            <div className="my-5 h-px bg-[color:var(--color-charcoal)]/10" />
            <Link to="/" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[color:var(--color-charcoal)]/60 hover:bg-black/5">
              <LogOut className="h-4 w-4" />العودة للموقع
            </Link>
          </div>
        </aside>
        <main className="flex-1 min-w-0">
          <div className="mb-5 flex items-center justify-between rounded-[20px] border border-white/60 bg-white/70 px-5 py-4 backdrop-blur-xl">
            <div>
              <div className="text-xs text-[color:var(--color-gold-dark)] font-semibold tracking-[0.15em]">{role}</div>
              <h1 className="mt-0.5 text-xl font-bold">{title}</h1>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

export function DashCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[20px] border border-white/60 bg-white/75 p-5 backdrop-blur-xl shadow-[0_15px_45px_-25px_rgba(31,31,31,0.15)] ${className}`}>{children}</div>;
}
