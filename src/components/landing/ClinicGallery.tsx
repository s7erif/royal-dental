import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { useGalleryImages } from "@/hooks/use-cms";
import { Reveal, SectionTitle } from "./_shared";

export function ClinicGallery() {
  const { data: allImages = [] } = useGalleryImages();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = allImages.slice(0, 8);
  const hasMore = allImages.length > 8;

  return (
    <section id="gallery" className="relative py-16 sm:py-24" style={{ background: "#FBF7EE" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionTitle
          eyebrow="مساحتنا"
          title={<>معرض العيادة</>}
          sub="جولة داخل عيادة رويال دنتال — التقنيات، الأجواء، وتفاصيل الرعاية."
        />

        {images.length === 0 ? (
          <div className="mt-10 grid place-items-center rounded-3xl border border-dashed border-black/10 bg-white/60 p-12 text-center">
            <p className="text-sm text-[color:var(--color-charcoal)]/60">
              لا توجد صور في المعرض حتى الآن
            </p>
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {images.map((im, i) => (
                <Reveal key={im.id} delay={Math.min(i * 0.04, 0.24)}>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className="group relative block aspect-square w-full overflow-hidden rounded-2xl bg-black/5 shadow-[0_18px_45px_-28px_rgba(31,31,31,0.28)] ring-1 ring-black/[0.05] transition hover:-translate-y-1 hover:shadow-[0_28px_60px_-28px_rgba(31,31,31,0.38)]"
                    aria-label={im.title_ar || im.title_en || "صورة من المعرض"}
                  >
                    <img
                      src={im.image_url}
                      alt={im.title_ar || im.title_en || "صورة من المعرض"}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    {(im.title_ar || im.title_en) && (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-3 text-right text-sm font-semibold text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        {im.title_ar || im.title_en}
                      </div>
                    )}
                  </button>
                </Reveal>
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <Link
                  to="/gallery"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-dark)] px-7 py-3 text-sm font-bold text-white shadow-[0_15px_35px_-15px_rgba(201,168,76,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_-15px_rgba(201,168,76,0.85)]"
                >
                  عرض كل الصور
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      <GalleryLightbox
        images={allImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChange={setLightboxIndex}
      />
    </section>
  );
}

export default ClinicGallery;
