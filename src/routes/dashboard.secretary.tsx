import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Users, UserPlus, Search, BarChart3, CheckCircle2, Clock } from "lucide-react";
import { DashboardShell, DashCard } from "@/components/dashboard/DashboardShell";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/dashboard/secretary")({
  head: () => ({ meta: [{ title: "لوحة السكرتارية — رويال ديـنـتـال" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const [q, setQ] = useState("");
    const items = [
      { to: "/dashboard/secretary", label: "مواعيد اليوم", icon: Calendar },
      { to: "/dashboard/secretary", label: "قائمة المرضى", icon: Users },
      { to: "/dashboard/secretary", label: "إضافة مريض", icon: UserPlus },
      { to: "/dashboard/secretary", label: "التقارير", icon: BarChart3 },
    ];
    const today = [
      { time: "10:00 ص", name: "محمد أحمد", doctor: "د. مصطفى بكر", service: "تنظيف", status: "منتظر" },
      { time: "11:00 ص", name: "سارة حسن", doctor: "د. أحمد نبيل", service: "علاج عصب", status: "حضر" },
      { time: "1:00 م", name: "ليلى محمود", doctor: "د. مصطفى بكر", service: "تبييض", status: "منتظر" },
      { time: "3:00 م", name: "عمر كريم", doctor: "د. سارة حسن", service: "استشارة تقويم", status: "منتظر" },
    ];
    return (
      <DashboardShell title="مواعيد اليوم" role="السكرتارية" items={items}>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "مواعيد اليوم", value: "18", icon: Calendar },
            { label: "حضروا", value: "9", icon: CheckCircle2 },
            { label: "متبقي", value: "9", icon: Clock },
            { label: "مرضى جدد", value: "3", icon: UserPlus },
          ].map((s) => (
            <DashCard key={s.label} className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)]"><s.icon className="h-5 w-5 text-white" /></div>
              <div><div className="text-xs text-[color:var(--color-charcoal)]/60">{s.label}</div><div className="text-xl font-bold">{s.value}</div></div>
            </DashCard>
          ))}
        </div>

        <DashCard className="mt-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold">مواعيد اليوم</h3>
            <div className="relative w-64 max-w-full">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-charcoal)]/40" />
              <Input placeholder="ابحث..." value={q} onChange={(e)=>setQ(e.target.value)} className="pr-9 bg-white/70" />
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-[color:var(--color-charcoal)]/10 text-xs text-[color:var(--color-charcoal)]/60">
                  <th className="py-2 font-semibold">الوقت</th><th className="font-semibold">المريض</th><th className="font-semibold">الطبيب</th><th className="font-semibold">الخدمة</th><th className="font-semibold">الحالة</th><th className="font-semibold">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {today.filter(r => r.name.includes(q) || q === "").map((r, i) => (
                  <tr key={i} className="border-b border-[color:var(--color-charcoal)]/5 last:border-0">
                    <td className="py-3 font-semibold">{r.time}</td>
                    <td>{r.name}</td>
                    <td className="text-[color:var(--color-charcoal)]/70">{r.doctor}</td>
                    <td className="text-[color:var(--color-charcoal)]/70">{r.service}</td>
                    <td><span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${r.status === "حضر" ? "bg-emerald-500/15 text-emerald-700" : "bg-[color:var(--color-gold-light)]/25 text-[color:var(--color-gold-dark)]"}`}>{r.status}</span></td>
                    <td><button className="text-xs font-semibold text-[color:var(--color-gold-dark)] hover:underline">تسجيل حضور</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashCard>
      </DashboardShell>
    );
  },
});
