import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronLeft, Home as HomeIcon } from "lucide-react";
import { fetchGalleryImages, fetchGalleryCategories } from "@/lib/public-cms";
import { GalleryLightbox } from "@/components/GalleryLightbox";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({
    meta: [
      { title: "معرض العيادة | رويال دنتال" },
      { name: "description", content: "استعرض جميع صور عيادة رويال دنتال — التقنيات، المرافق، وأجواء الرعاية." },
      { property: "og:title", content: "معرض العيادة | رويال دنتال" },
      { property: "og:description", content: "استعرض جميع صور عيادة رويال دنتال." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function GalleryPage() {
  const { data: images = [] } = useQuery({ queryKey: ["public-gallery-images"], queryFn: fetchGalleryImages });
  const { data: cats = [] } = useQuery({ queryKey: ["public-gallery-cats"], queryFn: fetchGalleryCategories });
  const [q, setQ] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return images.filter((im) => {
      if (activeCat && im.category_id !== activeCat) return false;
      if (!needle) return true;
      const t = `${im.title_ar ?? ""} ${im.title_en ?? ""} ${im.caption ?? ""}`.toLowerCase();
      return t.includes(needle);
    });
  }, [images, q, activeCat]);

  return (
    <div
      dir="rtl"
      lang="ar"
      className="min-h-screen bg-[color:var(--color-cream)] text-[color:var(--color-charcoal)]"
      style={{ fontFamily: "Cairo, system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-[color:var(--color-charcoal)]/60">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-[color:var(--color-gold-dark)]">
            <HomeIcon className="h-3.5 w-3.5" />
            الرئيسية
          </Link>
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="font-semibold text-[color:var(--color-charcoal)]">معرض العيادة</span>
        </nav>

        {/* Header */}
        <header className="text-center">
          <div className="text-xs font-bold tracking-[0.3em] text-[color:var(--color-gold-dark)]">مساحتنا</div>
          <h1 className="mt-2 text-3xl font-black leading-tight sm:text-5xl">معرض العيادة</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[color:var(--color-charcoal)]/70 sm:text-base">
            جميع صور رويال دنتال في مكان واحد — استعرض أو ابحث بالعنوان.
          </p>
        </header>

        {/* Search + filters */}
        <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-charcoal)]/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث في المعرض…"
              className="w-full rounded-full border border-black/10 bg-white py-2.5 pr-10 pl-4 text-sm shadow-sm outline-none transition focus:border-[color:var(--color-gold-dark)] focus:ring-2 focus:ring-[color:var(--color-gold-dark)]/20"
            />
          </div>
          {cats.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCat(null)}
                className={`rounded-full px-4 py-1.5 text-sm transition ${
                  activeCat === null
                    ? "bg-[color:var(--color-gold-dark)] text-white"
                    : "border border-black/10 bg-white text-[color:var(--color-charcoal)]/70 hover:border-[color:var(--color-gold-dark)]/40"
                }`}
              >
                الكل
              </button>
              {cats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(c.id)}
                  className={`rounded-full px-4 py-1.5 text-sm transition ${
                    activeCat === c.id
                      ? "bg-[color:var(--color-gold-dark)] text-white"
                      : "border border-black/10 bg-white text-[color:var(--color-charcoal)]/70 hover:border-[color:var(--color-gold-dark)]/40"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="mt-12 grid place-items-center rounded-3xl border border-dashed border-black/10 bg-white/60 p-16 text-center">
            <p className="text-sm text-[color:var(--color-charcoal)]/60">
              {images.length === 0 ? "لا توجد صور في المعرض حتى الآن" : "لا نتائج مطابقة لبحثك."}
            </p>
          </div>
        ) : (
          <div className="mt-10 columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
            {filtered.map((im, i) => (
              <button
                key={im.id}
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="group mb-3 block w-full overflow-hidden rounded-2xl bg-black/5 shadow-[0_18px_45px_-28px_rgba(31,31,31,0.28)] ring-1 ring-black/[0.05] transition hover:-translate-y-1 hover:shadow-[0_28px_60px_-28px_rgba(31,31,31,0.38)] sm:mb-4"
                aria-label={im.title_ar || im.title_en || "صورة من المعرض"}
              >
                <img
                  src={im.image_url}
                  alt={im.title_ar || im.title_en || "صورة من المعرض"}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <GalleryLightbox
        images={filtered}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChange={setLightboxIndex}
      />
    </div>
  );
}
