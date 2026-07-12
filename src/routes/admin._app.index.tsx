import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Stethoscope,
  Tag,
  GalleryHorizontal,
  MessageSquareQuote,
  HelpCircle,
  Inbox,
  Plus,
  Upload,
  UserCog,
  Home as HomeIcon,
  Activity,
  FileEdit,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionCard, StatCard } from "@/components/admin/primitives";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/_app/")({
  component: DashboardHome,
});

async function countTable(table: "services" | "offers" | "gallery_images" | "testimonials" | "faqs"): Promise<number> {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  if (error) throw new Error(error.message);
  return count ?? 0;
}



const activity = [
  { icon: FileEdit, title: "تم تحديث خدمة زراعة الأسنان", by: "د. مصطفى", time: "منذ 12 دقيقة", tone: "blue" },
  { icon: Tag, title: "تم إنشاء عرض جديد: تبييض بالليزر", by: "المسؤول", time: "منذ ساعة", tone: "gold" },
  { icon: ImageIcon, title: "تم رفع 6 صور إلى المعرض", by: "المسؤول", time: "منذ 3 ساعات", tone: "emerald" },
  { icon: HelpCircle, title: "تم تعديل سؤال شائع عن التقويم", by: "د. سارة", time: "أمس", tone: "purple" },
  { icon: MessageSquareQuote, title: "تم نشر رأي جديد من عميلة", by: "المسؤول", time: "منذ يومين", tone: "rose" },
];

const toneMap: Record<string, string> = {
  blue: "bg-blue-500/15 text-blue-600",
  gold: "bg-[color:var(--color-gold-dark)]/15 text-[color:var(--color-gold-dark)]",
  emerald: "bg-emerald-500/15 text-emerald-600",
  purple: "bg-purple-500/15 text-purple-600",
  rose: "bg-rose-500/15 text-rose-600",
};

const quickActions = [
  { to: "/admin/services", label: "إضافة خدمة", icon: Stethoscope },
  { to: "/admin/offers", label: "إضافة عرض", icon: Tag },
  { to: "/admin/media", label: "رفع صور", icon: Upload },
  { to: "/admin/doctor", label: "تعديل الطبيب", icon: UserCog },
  { to: "/admin/hero", label: "تعديل الواجهة", icon: HomeIcon },
  { to: "/admin/before-after", label: "قبل وبعد", icon: Sparkles },
];

function DashboardHome() {
  const services = useQuery({ queryKey: ["admin-count", "services"], queryFn: () => countTable("services") });
  const offers = useQuery({ queryKey: ["admin-count", "offers"], queryFn: () => countTable("offers") });
  const gallery = useQuery({ queryKey: ["admin-count", "gallery_images"], queryFn: () => countTable("gallery_images") });
  const testimonials = useQuery({ queryKey: ["admin-count", "testimonials"], queryFn: () => countTable("testimonials") });
  const faqs = useQuery({ queryKey: ["admin-count", "faqs"], queryFn: () => countTable("faqs") });

  const fmt = (q: { data?: number; isLoading: boolean }) => (q.isLoading ? "…" : (q.data ?? 0));

  const stats = [
    { label: "إجمالي الخدمات", value: fmt(services), icon: Stethoscope },
    { label: "العروض النشطة", value: fmt(offers), icon: Tag },
    { label: "صور المعرض", value: fmt(gallery), icon: GalleryHorizontal },
    { label: "آراء العملاء", value: fmt(testimonials), icon: MessageSquareQuote },
    { label: "الأسئلة الشائعة", value: fmt(faqs), icon: HelpCircle },
    { label: "رسائل التواصل", value: 0, icon: Inbox },
  ];

  return (
    <>
      <PageHeader
        title="لوحة التحكم"
        description="نظرة عامة على أداء موقع العيادة ومحتواه."
        breadcrumbs={[{ label: "الرئيسية" }]}
        actions={
          <Button asChild className="gap-2 bg-gradient-to-l from-[color:var(--color-gold-dark)] to-[color:var(--color-gold-light)] text-white hover:opacity-95">
            <Link to="/">
              <HomeIcon className="h-4 w-4" />
              عرض الموقع
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>


      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="النشاط الأخير"
          description="آخر التحديثات على محتوى الموقع."
          className="lg:col-span-2"
          actions={
            <Button variant="ghost" size="sm" className="gap-2 text-xs">
              <Activity className="h-3.5 w-3.5" />
              عرض الكل
            </Button>
          }
        >
          <ul className="space-y-2">
            {activity.map((a, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-3.5 transition-colors hover:bg-accent/40"
              >
                <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${toneMap[a.tone]}`}>
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{a.title}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    بواسطة {a.by} • {a.time}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="إجراءات سريعة" description="اختصارات للمهام الأكثر استخداماً.">
          <div className="grid grid-cols-2 gap-2.5">
            {quickActions.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-border/60 bg-background p-4 text-center transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-gold-dark)]/40 hover:shadow-md"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--color-gold-light)]/25 to-[color:var(--color-gold-dark)]/15 text-[color:var(--color-gold-dark)] transition-transform group-hover:scale-110">
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="text-xs font-semibold">{a.label}</div>
              </Link>
            ))}
            <Link
              to="/admin/hero"
              className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 p-3 text-xs font-semibold text-muted-foreground transition-colors hover:border-[color:var(--color-gold-dark)]/50 hover:text-[color:var(--color-gold-dark)]"
            >
              <Plus className="h-3.5 w-3.5" />
              إجراء جديد
            </Link>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
