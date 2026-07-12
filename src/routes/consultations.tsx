import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, CreditCard, MessageSquare, Sparkles } from "lucide-react";
import { PageShell, Container, GlassCard, GoldButtonClasses } from "@/components/site/PageShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/consultations")({
  head: () => ({ meta: [
    { title: "استشارة أونلاين — رويال ديـنـتـال" },
    { name: "description", content: "احصل على استشارة طبية من أطبائنا مع رفع صور لأسنانك." },
    { property: "og:title", content: "استشارة أونلاين — رويال ديـنـتـال" },
    { property: "og:description", content: "استشارة مدفوعة مع رد الطبيب." },
  ]}),
  component: ConsultPage,
});

function ConsultPage() {
  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files).slice(0, 5);
    Promise.all(list.map(f => new Promise<string>((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result as string); fr.readAsDataURL(f); }))).then(setImages);
  };
  const submit = () => {
    if (name.trim().length < 2 || phone.trim().length < 8 || msg.trim().length < 10) { toast.error("يرجى ملء جميع البيانات المطلوبة"); return; }
    toast.success("تم إرسال طلب الاستشارة — سيرد عليك الطبيب خلال 24 ساعة");
    setName(""); setPhone(""); setMsg(""); setImages([]);
  };
  return (
    <PageShell heroKicker="استشارات أونلاين" heroTitle="استشر طبيبك من أي مكان" heroSubtitle="اكتب سؤالك، ارفع صور لأسنانك، وادفع الرسوم — يرد عليك الطبيب خلال 24 ساعة.">
      <section className="pb-24"><Container>
        <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold">تفاصيل الاستشارة</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div><Label htmlFor="cn">الاسم</Label><Input id="cn" value={name} onChange={(e)=>setName(e.target.value)} className="mt-1.5" /></div>
                <div><Label htmlFor="cp">رقم الهاتف</Label><Input id="cp" value={phone} onChange={(e)=>setPhone(e.target.value)} className="mt-1.5" dir="ltr" /></div>
              </div>
              <div className="mt-4"><Label htmlFor="cm">وصف الحالة (اكتب تفاصيل ما تشعر به)</Label><Textarea id="cm" value={msg} onChange={(e)=>setMsg(e.target.value)} className="mt-1.5" rows={6} placeholder="مثال: ألم في الضرس الأيمن العلوي منذ 3 أيام..." /></div>

              <div className="mt-5">
                <Label>صور الأسنان (حتى 5 صور)</Label>
                <label className="mt-1.5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[color:var(--color-gold)]/40 bg-white/50 p-8 text-center transition-colors hover:border-[color:var(--color-gold)] hover:bg-white/70">
                  <Upload className="h-8 w-8 text-[color:var(--color-gold-dark)]" />
                  <div className="text-sm font-semibold">اضغط لرفع الصور</div>
                  <div className="text-xs text-[color:var(--color-charcoal)]/60">JPG أو PNG — حتى 5 صور</div>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e)=>onFiles(e.target.files)} />
                </label>
                {images.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {images.map((src, i) => (
                      <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-white/60">
                        <img src={src} alt="" className="h-full w-full object-cover" />
                        <button onClick={()=>setImages(images.filter((_,j)=>j!==i))} className="absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white"><X className="h-3 w-3" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <GlassCard className="sticky top-24 p-6">
              <div className="text-xs tracking-[0.2em] text-[color:var(--color-gold-dark)] font-semibold">رسوم الاستشارة</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold">200</span>
                <span className="text-sm text-[color:var(--color-charcoal)]/60">جنيه</span>
              </div>
              <ul className="mt-5 space-y-2 text-sm">
                <li className="flex items-start gap-2"><Sparkles className="mt-0.5 h-4 w-4 text-[color:var(--color-gold-dark)]" />رد الطبيب خلال 24 ساعة</li>
                <li className="flex items-start gap-2"><MessageSquare className="mt-0.5 h-4 w-4 text-[color:var(--color-gold-dark)]" />رسالة واحدة ورد مفصّل</li>
                <li className="flex items-start gap-2"><CreditCard className="mt-0.5 h-4 w-4 text-[color:var(--color-gold-dark)]" />دفع إلكتروني آمن</li>
              </ul>
              <button onClick={submit} className={`mt-6 w-full ${GoldButtonClasses("md")}`}><CreditCard className="h-4 w-4" />ادفع وأرسل</button>
              <p className="mt-3 text-center text-[10px] text-[color:var(--color-charcoal)]/60">الاستشارة ليست بديلاً عن الفحص السريري.</p>
            </GlassCard>
          </motion.div>
        </div>
      </Container></section>
    </PageShell>
  );
}
