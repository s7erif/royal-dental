import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { PageShell, Container, GlassCard, GoldButtonClasses } from "@/components/site/PageShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { clinicInfo } from "@/data/clinic";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "تواصل معنا — رويال ديـنـتـال" },
    { name: "description", content: "تواصل مع مركز رويال ديـنـتـال عبر الهاتف، الواتساب، أو النموذج." },
    { property: "og:title", content: "تواصل معنا — رويال ديـنـتـال" },
    { property: "og:description", content: "نحن هنا لخدمتك في أي وقت." },
  ]}),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "الاسم قصير جداً").max(80),
  phone: z.string().trim().min(8, "رقم غير صحيح").max(20),
  message: z.string().trim().min(5, "الرسالة قصيرة جداً").max(1000),
});

function ContactPage() {
  const [f, setF] = useState({ name: "", phone: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(f);
    if (!r.success) { toast.error(r.error.issues[0].message); return; }
    toast.success("تم إرسال رسالتك بنجاح — سنعود إليك قريباً");
    setF({ name: "", phone: "", message: "" });
  };
  return (
    <PageShell heroKicker="تواصل معنا" heroTitle="نحن هنا لخدمتك" heroSubtitle="اختر الوسيلة الأنسب لك وسنعود إليك في أقرب وقت.">
      <section className="pb-20"><Container>
        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <GlassCard className="p-8">
              <h3 className="text-2xl font-bold">أرسل لنا رسالة</h3>
              <form onSubmit={submit} className="mt-5 space-y-4">
                <div><Label htmlFor="cn">الاسم</Label><Input id="cn" value={f.name} onChange={(e)=>setF({...f,name:e.target.value})} className="mt-1.5" /></div>
                <div><Label htmlFor="cp">رقم الهاتف</Label><Input id="cp" value={f.phone} onChange={(e)=>setF({...f,phone:e.target.value})} className="mt-1.5" dir="ltr" /></div>
                <div><Label htmlFor="cm">الرسالة</Label><Textarea id="cm" value={f.message} onChange={(e)=>setF({...f,message:e.target.value})} className="mt-1.5" rows={5} /></div>
                <button type="submit" className={`w-full ${GoldButtonClasses("md")}`}>إرسال الرسالة</button>
              </form>
            </GlassCard>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4">
            {[
              { icon: Phone, title: "اتصل بنا", value: clinicInfo.phoneDisplay, href: `tel:${clinicInfo.phone}` },
              { icon: MessageCircle, title: "واتساب", value: "راسلنا على واتساب", href: `https://wa.me/${clinicInfo.whatsapp}` },
              { icon: Mail, title: "البريد الإلكتروني", value: clinicInfo.email, href: `mailto:${clinicInfo.email}` },
              { icon: MapPin, title: "العنوان", value: clinicInfo.address },
              { icon: Clock, title: "ساعات العمل", value: clinicInfo.hours },
            ].map((c) => (
              <a key={c.title} href={c.href || "#"} className="block">
                <GlassCard className="flex items-start gap-4 transition-transform hover:-translate-y-0.5">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)]">
                    <c.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[color:var(--color-gold-dark)]">{c.title}</div>
                    <div className="mt-1 font-semibold">{c.value}</div>
                  </div>
                </GlassCard>
              </a>
            ))}
            <div className="overflow-hidden rounded-[24px] border border-white/60">
              <iframe title="خريطة العيادة" src="https://maps.google.com/maps?q=Cairo&t=&z=13&ie=UTF8&iwloc=&output=embed" className="h-64 w-full" loading="lazy" />
            </div>
          </motion.div>
        </div>
      </Container></section>
    </PageShell>
  );
}
