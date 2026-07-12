import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Clock, ArrowLeft } from "lucide-react";
import { PageShell, Container } from "@/components/site/PageShell";
import { blogPosts, blogCategories } from "@/data/clinic";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/blog")({
  head: () => ({ meta: [
    { title: "المدونة — رويال ديـنـتـال" },
    { name: "description", content: "مقالات ونصائح حول طب الأسنان من فريق مركز رويال ديـنـتـال." },
    { property: "og:title", content: "المدونة — رويال ديـنـتـال" },
    { property: "og:description", content: "نصائح ومقالات في طب الأسنان." },
  ]}),
  component: BlogPage,
});

function BlogPage() {
  const [cat, setCat] = useState("الكل");
  const [q, setQ] = useState("");
  const posts = useMemo(() => blogPosts.filter(p => (cat === "الكل" || p.category === cat) && (q === "" || p.title.includes(q) || p.excerpt.includes(q))), [cat, q]);
  return (
    <PageShell heroKicker="المدونة" heroTitle="مقالات ونصائح للحفاظ على ابتسامتك" heroSubtitle="محتوى موثوق من فريق أطبائنا المتخصصين.">
      <section className="pb-20"><Container>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {blogCategories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${cat === c ? "bg-gradient-to-r from-[color:var(--color-gold-dark)] to-[color:var(--color-gold-light)] text-white" : "border border-[color:var(--color-charcoal)]/15 bg-white/70 text-[color:var(--color-charcoal)]/70 hover:border-[color:var(--color-gold)]"}`}>{c}</button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 h-4 w-4 text-[color:var(--color-charcoal)]/40" />
            <Input placeholder="ابحث..." value={q} onChange={(e)=>setQ(e.target.value)} className="pr-10 bg-white/70" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <motion.div key={p.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: (i%3)*0.05 }}>
              <Link to="/blog/$slug" params={{ slug: p.slug }} className="group block h-full overflow-hidden rounded-[24px] border border-white/60 bg-white/70 shadow-[0_20px_60px_-30px_rgba(31,31,31,0.2)] backdrop-blur-xl transition-transform hover:-translate-y-1">
                <div className="relative h-40 bg-gradient-to-br from-[color:var(--color-gold-light)]/40 to-[color:var(--color-gold-dark)]/30">
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="text-6xl opacity-30">🦷</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="inline-block rounded-full bg-[color:var(--color-gold-light)]/25 px-3 py-0.5 text-[10px] font-bold text-[color:var(--color-gold-dark)]">{p.category}</div>
                  <h3 className="mt-3 text-lg font-bold leading-snug group-hover:text-[color:var(--color-gold-dark)]">{p.title}</h3>
                  <p className="mt-2 text-sm text-[color:var(--color-charcoal)]/65 line-clamp-2">{p.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-[color:var(--color-charcoal)]/60">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{p.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{p.read}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        {posts.length === 0 && <div className="mt-12 text-center text-[color:var(--color-charcoal)]/60">لا توجد نتائج مطابقة.</div>}
      </Container></section>
    </PageShell>
  );
}
