import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Calendar, User, CheckCircle2 } from "lucide-react";
import { PageShell, Container, GlassCard } from "@/components/site/PageShell";
import { services, nextDays } from "@/data/clinic";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { fetchContact } from "@/lib/public-cms";

const searchSchema = z.object({
  service: z.string().optional(),
});

export const Route = createFileRoute("/booking")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "احجز موعدك — مركز رويال ديـنـتـال" },
      { name: "description", content: "احجز موعدك في مركز رويال ديـنـتـال بخطوات بسيطة عبر الإنترنت." },
      { property: "og:title", content: "احجز موعدك — مركز رويال ديـنـتـال" },
      { property: "og:description", content: "احجز موعدك خلال دقائق." },
    ],
  }),
  component: BookingPage,
});

const STEPS = [
  { key: "date", label: "التاريخ", icon: Calendar },
  { key: "info", label: "بياناتك", icon: User },
  { key: "confirm", label: "التأكيد", icon: CheckCircle2 },
];

function formatBookingDate(value?: string) {
  const trimmed = (value || "").trim();
  const iso = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) {
    const [, year, month, day] = iso;
    const y = Number(year);
    const m = Number(month);
    const d = Number(day);
    const parsed = new Date(Date.UTC(y, m - 1, d));
    if (parsed.getUTCFullYear() === y && parsed.getUTCMonth() === m - 1 && parsed.getUTCDate() === d) {
      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    }
  }

  const dmy = trimmed.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/);
  if (dmy) {
    let [, day, month, year] = dmy;
    if (year.length === 2) year = `20${year}`;
    const y = Number(year);
    const m = Number(month);
    const d = Number(day);
    const parsed = new Date(Date.UTC(y, m - 1, d));
    if (parsed.getUTCFullYear() === y && parsed.getUTCMonth() === m - 1 && parsed.getUTCDate() === d) {
      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    }
  }

  return trimmed;
}

function openWhatsApp(url: string) {
  if (typeof document === "undefined") return;
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function BookingPage() {
  const initial = Route.useSearch();
  const days = useMemo(() => nextDays(14), []);
  const { data: contact } = useQuery({ queryKey: ["public-contact"], queryFn: fetchContact });
  const [step, setStep] = useState(0);
  const [service, setService] = useState<string | undefined>(initial.service);
  const [date, setDate] = useState<string | undefined>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);

  const clinicWa = (contact?.whatsapp || "").replace(/[^\d]/g, "");
  const waConfigured = clinicWa.length > 0;

  const canNext =
    (step === 0 && !!date) ||
    (step === 1 && name.trim().length >= 2 && phone.trim().length >= 8);

  const selectedService = services.find((s) => s.slug === service);
  const formattedDate = formatBookingDate(date);

  const resetForm = () => {
    setService(undefined);
    setDate(undefined);
    setName("");
    setPhone("");
    setNotes("");
    setStep(0);
  };

  const submit = () => {
    if (!name.trim() || !phone.trim() || !date) {
      toast.error("يرجى إدخال الاسم ورقم الهاتف والتاريخ.");
      return;
    }
    if (!waConfigured) {
      toast.error("يرجى إدخال رقم واتساب العيادة من لوحة التحكم.");
      return;
    }
    const message = [
      "🦷 طلب حجز جديد",
      "",
      "👤 الاسم:",
      name.trim(),
      "",
      "📞 رقم الهاتف:",
      phone.trim(),
      "",
      "📅 التاريخ:",
      formattedDate,
      "",
      "🦷 الخدمة:",
      selectedService?.title || "—",
      "",
      "📝 الملاحظات:",
      notes.trim() || "—",
    ].join("\n");
    const encodedMessage = encodeURIComponent(message);
    const url = `https://web.whatsapp.com/send?phone=${clinicWa}&text=${encodedMessage}`;
    openWhatsApp(url);
    resetForm();
    toast.success("تم فتح واتساب لإرسال طلب الحجز.");
    setDone(true);
  };

  return (
    <PageShell heroKicker="حجز موعد" heroTitle="ابدأ رحلتك في خطوات بسيطة" heroSubtitle="اختر التاريخ المناسب — نستلم طلبك مباشرة عبر واتساب.">
      <section className="pb-24">
        <Container>
          <div className="mx-auto max-w-4xl">
            {/* Stepper */}
            <div className="relative mb-10">
              <div className="hidden justify-between md:flex">
                {STEPS.map((s, i) => {
                  const isDone = step > i;
                  const active = step === i;
                  return (
                    <div key={s.key} className="flex flex-1 flex-col items-center">
                      <div
                        className={`grid h-11 w-11 place-items-center rounded-full border-2 transition-all ${
                          isDone
                            ? "border-[color:var(--color-gold)] bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)] text-white"
                            : active
                            ? "border-[color:var(--color-gold-dark)] bg-white text-[color:var(--color-gold-dark)] shadow-[0_0_0_6px_rgba(200,162,75,0.15)]"
                            : "border-[color:var(--color-charcoal)]/15 bg-white/70 text-[color:var(--color-charcoal)]/40"
                        }`}
                      >
                        {isDone ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                      </div>
                      <div className={`mt-2 text-xs font-semibold ${active ? "text-[color:var(--color-gold-dark)]" : "text-[color:var(--color-charcoal)]/60"}`}>
                        {s.label}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="md:hidden text-center text-sm font-semibold text-[color:var(--color-gold-dark)]">
                الخطوة {step + 1} من {STEPS.length} — {STEPS[step].label}
              </div>
            </div>

            <GlassCard className="p-6 sm:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={done ? "done" : step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35 }}
                >
                  {done ? (
                    <div className="text-center py-6">
                      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)]">
                        <Check className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="mt-4 text-2xl font-bold">تم إرسال طلبك عبر واتساب</h3>
                      <p className="mt-2 text-[color:var(--color-charcoal)]/70">سنتواصل معك خلال دقائق لتأكيد موعدك.</p>
                    </div>
                  ) : step === 0 ? (
                    <div>
                      <h3 className="text-xl font-bold">اختر التاريخ</h3>
                      <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                        {days.map((d) => (
                          <button
                            key={d.key}
                            onClick={() => setDate(d.key)}
                            className={`rounded-2xl border p-3 text-center transition-all ${
                              date === d.key
                                ? "border-[color:var(--color-gold)] bg-gradient-to-br from-[color:var(--color-gold-light)]/25 to-transparent"
                                : "border-[color:var(--color-charcoal)]/10 bg-white/60 hover:border-[color:var(--color-gold)]/50"
                            }`}
                          >
                            <div className="text-xs text-[color:var(--color-charcoal)]/60">{d.label}</div>
                            <div className="mt-1 text-lg font-bold">{d.day}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : step === 1 ? (
                    <div>
                      <h3 className="text-xl font-bold">بياناتك</h3>
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="n">الاسم الكامل *</Label>
                          <Input id="n" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" placeholder="محمد أحمد" />
                        </div>
                        <div>
                          <Label htmlFor="p">رقم الهاتف *</Label>
                          <Input id="p" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5" placeholder="0100 000 0000" dir="ltr" />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor="svc">الخدمة (اختياري)</Label>
                          <select
                            id="svc"
                            value={service || ""}
                            onChange={(e) => setService(e.target.value || undefined)}
                            className="mt-1.5 w-full rounded-md border border-[color:var(--color-charcoal)]/15 bg-white/80 px-3 py-2 text-sm"
                          >
                            <option value="">— اختر خدمة —</option>
                            {services.map((s) => (
                              <option key={s.slug} value={s.slug}>{s.title}</option>
                            ))}
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor="notes">ملاحظات (اختياري)</Label>
                          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1.5" placeholder="أي تفاصيل تود مشاركتها..." />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-xl font-bold">تأكيد الحجز</h3>
                      <p className="mt-1 text-sm text-[color:var(--color-charcoal)]/60">سيتم إرسال الطلب مباشرة عبر واتساب.</p>
                      <div className="mt-5 grid gap-2 rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/70 p-5 text-sm">
                        <Row label="الاسم" value={name} />
                        <Row label="الهاتف" value={phone} />
                        <Row label="التاريخ" value={formattedDate} />
                        <Row label="الخدمة" value={selectedService?.title} />
                        {notes && <Row label="ملاحظات" value={notes} />}
                      </div>
                      {!waConfigured && (
                        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
                          يرجى إدخال رقم واتساب العيادة من لوحة التحكم.
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {!done && (
                <div className="mt-8 flex items-center justify-between">
                  <button
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-charcoal)]/15 bg-white/70 px-5 py-2.5 text-sm font-semibold text-[color:var(--color-charcoal)] transition-colors hover:bg-white disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                    السابق
                  </button>

                  {step < STEPS.length - 1 ? (
                    <button
                      onClick={() => canNext && setStep((s) => s + 1)}
                      disabled={!canNext}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[color:var(--color-gold-dark)] via-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_-10px_rgba(200,162,75,0.6)] hover:opacity-95 disabled:opacity-40"
                    >
                      التالي
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={submit}
                      disabled={!waConfigured}
                      title={!waConfigured ? "يرجى إدخال رقم واتساب العيادة من لوحة التحكم." : undefined}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--color-gold-dark)] via-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_-10px_rgba(200,162,75,0.6)] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Check className="h-4 w-4" />
                      تأكيد الحجز
                    </button>
                  )}
                </div>
              )}
            </GlassCard>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[color:var(--color-charcoal)]/5 py-1.5 last:border-0">
      <span className="text-[color:var(--color-charcoal)]/60">{label}</span>
      <span className="font-semibold">{value || "—"}</span>
    </div>
  );
}
