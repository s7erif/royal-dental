import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bell, Menu, Moon, PanelRightClose, PanelRightOpen, Search, Sun, LogOut, User, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { signOut, getStoredTheme, setStoredTheme } from "@/lib/admin-auth";
import { supabase } from "@/integrations/supabase/client";
import type { User as AuthUser } from "@supabase/supabase-js";

const notifications = [
  { id: 1, title: "رسالة جديدة من زائر", time: "منذ 5 دقائق", unread: true },
  { id: 2, title: "تم تحديث خدمة زراعة الأسنان", time: "منذ ساعة", unread: true },
  { id: 3, title: "تم رفع 4 صور جديدة للمعرض", time: "منذ 3 ساعات", unread: false },
];

export function Topbar({
  onToggleSidebar, onOpenMobile, collapsed,
}: { onToggleSidebar: () => void; onOpenMobile: () => void; collapsed: boolean }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const t = getStoredTheme();
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next); setStoredTheme(next);
  };

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/admin/login", replace: true });
  };

  const email = user?.email || "";
  const name = email.split("@")[0].replace(/[._-]/g, " ") || "المسؤول";
  const initials = name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase() || "AD";
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button onClick={onOpenMobile}
          className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-accent lg:hidden"
          aria-label="القائمة"><Menu className="h-5 w-5" /></button>
        <button onClick={onToggleSidebar}
          className="hidden h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-accent lg:grid"
          aria-label="طي القائمة">
          {collapsed ? <PanelRightOpen className="h-5 w-5" /> : <PanelRightClose className="h-5 w-5" />}
        </button>

        <div className="relative hidden max-w-md flex-1 md:block">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="ابحث في لوحة التحكم..." className="pr-9 bg-muted/40 border-transparent" />
        </div>

        <div className="mr-auto flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="rounded-lg" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-lg">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-[color:var(--color-gold-dark)] px-1 text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 p-0">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="text-sm font-bold">الإشعارات</div>
                <Badge variant="secondary" className="text-[10px]">{unreadCount} جديدة</Badge>
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <li key={n.id} className="flex items-start gap-3 border-b border-border/50 px-4 py-3 last:border-0 hover:bg-accent/50">
                    <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.unread ? "bg-[color:var(--color-gold-dark)]" : "bg-muted-foreground/30"}`} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{n.title}</div>
                      <div className="text-[11px] text-muted-foreground">{n.time}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg p-1 pl-2 hover:bg-accent">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)] text-xs font-bold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-right leading-tight sm:block">
                  <div className="text-xs font-bold">{name}</div>
                  <div className="text-[10px] text-muted-foreground">مدير</div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel><div className="text-xs">{email}</div></DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/admin/profile" })}>
                <User className="ml-2 h-4 w-4" />الملف الشخصي
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/admin/settings" })}>
                <Settings className="ml-2 h-4 w-4" />الإعدادات
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="ml-2 h-4 w-4" />تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
