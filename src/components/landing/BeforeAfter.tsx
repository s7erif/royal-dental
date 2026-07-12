import { useState } from "react";
import { BeforeAfterCompare } from "@/components/BeforeAfterCompare";
import { useBeforeAfterCases } from "@/hooks/use-cms";
import beforeAfter1 from "@/assets/before-after-1.jpg.asset.json";
import beforeAfter2 from "@/assets/before-after-2.jpg.asset.json";
import { Reveal, SectionTitle } from "./_shared";

export function BeforeAfter() {
  const { data: cases = [] } = useBeforeAfterCases();
  const fallback = [
    {
      id: "fb1",
      before_image: beforeAfter1.url,
      after_image: beforeAfter2.url,
      title_ar: "تنظيف عميق وتبييض",
    },
    {
      id: "fb2",
      before_image: beforeAfter2.url,
      after_image: beforeAfter1.url,
      title_ar: "استعادة الابتسامة الكاملة",
    },
  ];
  type Item = {
    id: string;
    before_image: string | null;
    after_image: string | null;
    title_ar: string | null;
    treatment_type?: string | null;
  };
  const items: Item[] = cases.length > 0 ? (cases as unknown as Item[]) : (fallback as Item[]);
  const [visible, setVisible] = useState(6);

  return (
    <section id="gallery" className="py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionTitle
          eyebrow="النتائج"
          title={
            <>
              قبل و<span className="text-[color:var(--color-gold-dark)]">بعد</span>
            </>
          }
          sub="مرضى حقيقيون ونتائج مذهلة — اسحب المقبض لمشاهدة الفرق."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, visible).map((c) => {
            const before = c.before_image || c.after_image || beforeAfter1.url;
            const after = c.after_image || c.before_image || beforeAfter2.url;
            const title = c.title_ar || c.treatment_type || "حالة علاجية";
            return (
              <Reveal key={c.id}>
                <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-white/60 bg-white shadow-[0_20px_60px_-30px_rgba(31,31,31,0.25)] ring-1 ring-[color:var(--color-gold)]/15 transition-all hover:-translate-y-1 hover:shadow-[0_30px_70px_-30px_rgba(31,31,31,0.35)]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[color:var(--color-cream)]">
                    <BeforeAfterCompare before={before} after={after} rounded="rounded-none" />
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="text-lg font-bold text-[color:var(--color-charcoal)]">
                      {title}
                    </h3>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {visible < items.length && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setVisible((v) => v + 6)}
              className="rounded-full border border-[color:var(--color-gold)]/40 bg-white px-8 py-3 text-sm font-semibold text-[color:var(--color-charcoal)] shadow-sm transition hover:bg-[color:var(--color-gold-light)]/20"
            >
              عرض المزيد
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default BeforeAfter;
