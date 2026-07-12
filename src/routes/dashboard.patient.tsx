import { createFileRoute } from "@tanstack/react-router";
import { Calendar, MessageSquare, User, Bell, Clock, CheckCircle2 } from "lucide-react";
import { DashboardShell, DashCard } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/dashboard/patient")({
  head: () => ({ meta: [{ title: "لوحة المريض — رويال ديـنـتـال" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const items = [
      { to: "/dashboard/patient", label: "مواعيدي", icon: Calendar },
      { to: "/dashboard/patient", label: "الاستشارات", icon: MessageSquare },
      { to: "/dashboard/patient", label: "الملف الشخصي", icon: User },
      { to: "/dashboard/patient", label: "الإشعارات", icon: Bell },
    ];
    return (
      <DashboardShell title="أهلاً بك، محمد" role="لوحة المريض" items={items}>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "المواعيد القادمة", value: "2", icon: Calendar },
            { label: "الحجوزات السابقة", value: "12", icon: CheckCircle2 },
            { label: "استشارات نشطة", value: "1", icon: MessageSquare },
          ].map((s) => (
            <DashCard key={s.label} className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)]">
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-[color:var(--color-charcoal)]/60">{s.label}</div>
                <div className="text-2xl font-bold">{s.value}</div>
              </div>
            </DashCard>
          ))}
        </div>

        <DashCard className="mt-5">
          <h3 className="text-lg font-bold">موعدك القادم</h3>
          <div className="mt-4 rounded-2xl border border-[color:var(--color-gold)]/20 bg-gradient-to-l from-[color:var(--color-gold-light)]/15 to-transparent p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[color:var(--color-charcoal)]/60">تنظيف وفحص دوري</div>
                <div className="mt-1 text-xl font-bold">د. مصطفى بكر</div>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">الأحد 14 يوليو</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-[color:var(--color-gold-dark)]"><Clock className="h-3.5 w-3.5" />5:00 م</div>
              </div>
            </div>
          </div>
        </DashCard>

        <DashCard className="mt-5">
          <h3 className="text-lg font-bold">الحجوزات السابقة</h3>
          <div className="mt-4 space-y-2">
            {[
              { s: "تبييض ليزر", d: "د. مصطفى بكر", date: "12 يونيو 2026" },
              { s: "علاج عصب", d: "د. أحمد نبيل", date: "3 مايو 2026" },
              { s: "تنظيف كامل", d: "د. مصطفى بكر", date: "10 مارس 2026" },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-[color:var(--color-charcoal)]/10 bg-white/60 p-4">
                <div><div className="font-semibold">{r.s}</div><div className="text-xs text-[color:var(--color-charcoal)]/60">{r.d}</div></div>
                <div className="text-sm text-[color:var(--color-charcoal)]/70">{r.date}</div>
              </div>
            ))}
          </div>
        </DashCard>
      </DashboardShell>
    );
  },
});
