import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useContact, useServices } from "@/hooks/use-cms";
import { Reveal, SectionTitle, formatBookingDate } from "./_shared";

export function BookingForm() {
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [service, setService] = useState("");
  const [notes, setNotes] = useState("");
  const { data: contact } = useContact();
  const { data: services = [] } = useServices();
  const clinicWa = (contact?.whatsapp || "").replace(/[^\d]/g, "");
  const waConfigured = clinicWa.length > 0;

  const resetForm = () => {
    setName("");
    setPhone("");
    setDate("");
    setService("");
    setNotes("");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !date) {
      toast.error("يرجى إدخال الاسم ورقم الهاتف والتاريخ.");
      return;
    }
    if (!waConfigured) {
      toast.error("يرجى إدخال رقم واتساب العيادة من لوحة التحكم.");
      return;
    }

    setSubmitting(true);
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
      formatBookingDate(date),
      "",
      "🦷 الخدمة:",
      service || "—",
      "",
      "📝 الملاحظات:",
      notes.trim() || "—",
    ].join("\n");
    const encodedMessage = encodeURIComponent(message);
    const url = `https://web.whatsapp.com/send?phone=${clinicWa}&text=${encodedMessage}`;
    if (typeof document !== "undefined") {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
    resetForm();
    toast.success("تم فتح واتساب لإرسال طلب الحجز.");
    setSubmitting(false);
  };
  return (
    <section id="book" className="py-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <SectionTitle
          eyebrow="حجز موعد"
          title={
            <>
              احجز <span className="text-[color:var(--color-gold-dark)]">زيارتك</span>
            </>
          }
          sub="املأ النموذج وسيتواصل معك فريقنا لتأكيد الموعد."
        />
        <Reveal delay={0.1}>
          <form
            onSubmit={onSubmit}
            className="mt-12 rounded-[28px] border border-white/60 bg-white/70 p-6 backdrop-blur-xl shadow-[0_30px_80px_-40px_rgba(31,31,31,0.3)] sm:p-10"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">الاسم بالكامل</Label>
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 h-12 rounded-xl bg-white"
                />
              </div>
              <div>
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 h-12 rounded-xl bg-white"
                />
              </div>
              <div>
                <Label htmlFor="date">التاريخ</Label>
                <Input
                  id="date"
                  required
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-2 h-12 rounded-xl bg-white"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="service">الخدمة (اختياري)</Label>
                <select
                  id="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="mt-2 h-12 w-full rounded-xl border border-input bg-white px-3 text-sm"
                >
                  <option value="">— اختر خدمة —</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.name_ar}>
                      {s.name_ar}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="notes">ملاحظات (اختياري)</Label>
                <Textarea
                  id="notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2 rounded-xl bg-white"
                />
              </div>
            </div>
            {!waConfigured && (
              <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm font-semibold text-red-700">
                يرجى إدخال رقم واتساب العيادة من لوحة التحكم.
              </p>
            )}
            <div className="mt-8 flex justify-center">
              <Button
                type="submit"
                disabled={submitting || !waConfigured}
                className="h-12 rounded-full bg-gradient-to-r from-[color:var(--color-gold-dark)] via-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-10 text-white shadow-[0_15px_40px_-12px_rgba(200,162,75,0.7)] hover:opacity-95"
              >
                {submitting ? "جارٍ الإرسال..." : "تأكيد الحجز"}
              </Button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

export default BookingForm;
