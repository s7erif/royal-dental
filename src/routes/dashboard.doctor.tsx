import { createFileRoute } from "@tanstack/react-router";
import { Calendar, FileText, MessageSquare, BarChart3, Upload, Pill } from "lucide-react";
import { DashboardShell, DashCard } from "@/components/dashboard/DashboardShell";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/dashboard/doctor")({
  head: () => ({ meta: [{ title: "لوحة الطبيب — رويال ديـنـتـال" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const items = [
      { to: "/dashboard/doctor", label: "جدول المواعيد", icon: Calendar },
      { to: "/dashboard/doctor", label: "ملفات المرضى", icon: FileText },
      { to: "/dashboard/doctor", label: "الاستشارات", icon: MessageSquare },
      { to: "/dashboard/doctor", label: "الإحصائيات", icon: BarChart3 },
    ];
    return (
      <DashboardShell title="أهلاً د. مصطفى" role="لوحة الطبيب" items={items}>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "مواعيد اليوم", value: "8" },
            { label: "مرضى هذا الأسبوع", value: "42" },
            { label: "استشارات معلّقة", value: "3" },
            { label: "نسبة الرضا", value: "98%" },
          ].map((s) => (
            <DashCard key={s.label}>
              <div className="text-xs text-[color:var(--color-charcoal)]/60">{s.label}</div>
              <div className="mt-1 text-2xl font-bold text-[color:var(--color-gold-dark)]">{s.value}</div>
            </DashCard>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <DashCard>
            <h3 className="text-lg font-bold">جدول اليوم</h3>
            <div className="mt-4 space-y-2">
              {[
                { t: "10:00 ص", n: "محمد أحمد", s: "استشارة زراعة" },
                { t: "11:00 ص", n: "سارة حسن", s: "متابعة تقويم" },
                { t: "12:00 م", n: "ليلى محمود", s: "تبييض ليزر" },
                { t: "2:00 م", n: "عمر كريم", s: "علاج عصب" },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-[color:var(--color-charcoal)]/10 bg-white/60 p-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--color-gold-light)]/25 text-xs font-bold text-[color:var(--color-gold-dark)]">{r.t.split(" ")[0]}</div>
                    <div><div className="font-semibold text-sm">{r.n}</div><div className="text-xs text-[color:var(--color-charcoal)]/60">{r.s}</div></div>
                  </div>
                  <button className="text-xs font-semibold text-[color:var(--color-gold-dark)] hover:underline">فتح الملف</button>
                </div>
              ))}
            </div>
          </DashCard>

          <DashCard>
            <h3 className="text-lg font-bold">ملف المريض — محمد أحمد</h3>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-white/60 p-2"><div className="text-[color:var(--color-charcoal)]/60">العمر</div><div className="font-semibold">32 سنة</div></div>
              <div className="rounded-lg bg-white/60 p-2"><div className="text-[color:var(--color-charcoal)]/60">آخر زيارة</div><div className="font-semibold">10 يونيو 2026</div></div>
            </div>
            <div className="mt-3">
              <Label className="text-xs">ملاحظات الجلسة</Label>
              <Textarea className="mt-1.5 bg-white/70" rows={3} placeholder="اكتب ملاحظاتك..." />
            </div>
            <div className="mt-3">
              <Label className="text-xs flex items-center gap-1"><Pill className="h-3.5 w-3.5" />الروشتة</Label>
              <Textarea className="mt-1.5 bg-white/70" rows={2} placeholder="أدوية موصوفة..." />
            </div>
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[color:var(--color-gold)]/40 bg-white/50 p-4 text-xs font-semibold text-[color:var(--color-gold-dark)] hover:border-[color:var(--color-gold)]"><Upload className="h-4 w-4" />رفع الأشعة</button>
          </DashCard>
        </div>

        <DashCard className="mt-5">
          <h3 className="text-lg font-bold">استشارات معلّقة</h3>
          <div className="mt-4 space-y-3">
            {[
              { n: "أحمد سعيد", q: "ألم في الضرس الأيمن السفلي منذ 4 أيام مع تورم بسيط في اللثة..." },
              { n: "مريم فؤاد", q: "استفسار عن تكلفة تركيب 4 فينير للأسنان الأمامية..." },
            ].map((c, i) => (
              <div key={i} className="rounded-2xl border border-[color:var(--color-charcoal)]/10 bg-white/60 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{c.n}</div>
                  <span className="rounded-full bg-[color:var(--color-gold-light)]/25 px-2.5 py-0.5 text-[10px] font-bold text-[color:var(--color-gold-dark)]">جديد</span>
                </div>
                <p className="mt-2 text-sm text-[color:var(--color-charcoal)]/70">{c.q}</p>
                <button className="mt-3 text-xs font-semibold text-[color:var(--color-gold-dark)] hover:underline">فتح والرد</button>
              </div>
            ))}
          </div>
        </DashCard>
      </DashboardShell>
    );
  },
});
