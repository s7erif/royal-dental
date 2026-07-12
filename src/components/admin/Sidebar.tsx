import { Link, useRouterState } from "@tanstack/react-router";
import { Crown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navGroups } from "./nav-config";

export function AdminSidebar({
  collapsed,
  mobileOpen,
  onClose,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex flex-col border-l border-border bg-sidebar text-sidebar-foreground transition-all duration-300",
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          collapsed ? "lg:w-[76px]" : "lg:w-[264px]",
          mobileOpen ? "w-[280px] translate-x-0" : "w-[280px] translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link to="/admin" className="flex items-center gap-2.5 overflow-hidden">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)] shadow-sm">
              <Crown className="h-4 w-4 text-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0 leading-tight">
                <div className="truncate text-sm font-bold">رويال ديـنـتـال</div>
                <div className="text-[10px] tracking-[0.15em] text-[color:var(--color-gold-dark)]">
                  لوحة التحكم
                </div>
              </div>
            )}
          </Link>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent lg:hidden"
            aria-label="إغلاق القائمة"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navGroups.map((group, gi) => (
            <div key={gi} className="mb-5 last:mb-0">
              {group.label && !collapsed && (
                <div className="mb-2 px-3 text-[10px] font-bold tracking-[0.2em] text-muted-foreground">
                  {group.label}
                </div>
              )}
              <ul className="space-y-1">
                {group.items.map((it) => {
                  const active = it.to === "/admin" ? pathname === "/admin" : pathname.startsWith(it.to);
                  return (
                    <li key={it.to}>
                      <Link
                        to={it.to}
                        onClick={onClose}
                        className={cn(
                          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                          active
                            ? "bg-gradient-to-l from-[color:var(--color-gold-light)]/25 to-transparent text-[color:var(--color-gold-dark)] shadow-sm"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                          collapsed && "justify-center",
                        )}
                        title={collapsed ? it.label : undefined}
                      >
                        <it.icon className={cn("h-4 w-4 shrink-0", active && "text-[color:var(--color-gold-dark)]")} />
                        {!collapsed && <span className="truncate">{it.label}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {!collapsed && (
          <div className="border-t border-border p-4">
            <div className="rounded-2xl bg-gradient-to-br from-[color:var(--color-gold-light)]/20 to-[color:var(--color-gold-dark)]/10 p-4">
              <div className="text-xs font-bold text-foreground">تحتاج مساعدة؟</div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                فريق الدعم متاح على مدار الساعة لمساعدتك.
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
