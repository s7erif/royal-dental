import { X, Clock, Check, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getIcon } from "@/lib/icon-registry";

type PreviewData = {
  name_ar: string;
  short_desc_ar: string;
  icon: string;
  cover_image: string | null;
  price: string | null;
  duration: string | null;
  features: string[];
  button_text: string | null;
};

export function PreviewModal({
  open, onOpenChange, service,
}: { open: boolean; onOpenChange: (open: boolean) => void; service: PreviewData | null }) {
  if (!service) return null;
  const Icon = getIcon(service.icon);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden p-0" dir="rtl">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle>معاينة الخدمة كما ستظهر على الموقع</DialogTitle>
        </DialogHeader>

        <div className="bg-[color:var(--color-cream)] p-6 sm:p-8">
          <div className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-white/70 p-7 shadow-[0_20px_60px_-30px_rgba(31,31,31,0.2)] backdrop-blur-xl">
            <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-[color:var(--color-gold-light)]/25 blur-3xl" />
            {service.cover_image && (
              <div className="mb-5 -mx-7 -mt-7 aspect-[16/9] overflow-hidden">
                <img src={service.cover_image} alt={service.name_ar} className="h-full w-full object-cover" />
              </div>
            )}
            <div className="relative flex items-start justify-between gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)] shadow-[0_10px_30px_-10px_rgba(200,162,75,0.6)]">
                <Icon className="h-6 w-6 text-white" />
              </div>
              {service.price && (
                <div className="rounded-full border border-[color:var(--color-gold)]/25 bg-white/70 px-3 py-1 text-xs font-semibold text-[color:var(--color-gold-dark)]">
                  {service.price}
                </div>
              )}
            </div>
            <h3 className="relative mt-5 text-2xl font-bold text-[color:var(--color-charcoal)]">{service.name_ar || "اسم الخدمة"}</h3>
            <p className="relative mt-2 leading-relaxed text-[color:var(--color-charcoal)]/70">
              {service.short_desc_ar || "الوصف المختصر يظهر هنا"}
            </p>
            {service.features.length > 0 && (
              <ul className="relative mt-4 grid grid-cols-2 gap-2">
                {service.features.map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-xs text-[color:var(--color-charcoal)]/75">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--color-gold-dark)]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="relative mt-6 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[color:var(--color-charcoal)]/60">
                {service.duration && (<><Clock className="h-3.5 w-3.5" /><span>{service.duration}</span></>)}
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-charcoal)] px-5 py-2 text-xs font-semibold text-white">
                {service.button_text || "احجز الآن"}
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { X };
