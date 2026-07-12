import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Container } from "@/components/site/PageShell";
export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [
    { title: "الشروط والأحكام — رويال ديـنـتـال" },
    { name: "description", content: "الشروط والأحكام الخاصة باستخدام خدمات مركز رويال ديـنـتـال." },
    { property: "og:title", content: "الشروط والأحكام" },
    { property: "og:description", content: "شروط استخدام خدماتنا." },
  ]}),
  component: () => (
    <PageShell heroKicker="الشروط" heroTitle="الشروط والأحكام">
      <section className="pb-24"><Container>
        <article className="mx-auto max-w-3xl rounded-[24px] border border-white/60 bg-white/70 p-8 leading-loose backdrop-blur-xl text-[color:var(--color-charcoal)]/80">
          <p>باستخدامك موقع مركز رويال ديـنـتـال أو حجز موعد لديه، فإنك توافق على الشروط التالية.</p>
          <h3 className="mt-6 mb-2 text-xl font-bold text-[color:var(--color-charcoal)]">المواعيد</h3>
          <p>يُرجى الحضور قبل موعدك بـ 10 دقائق على الأقل. يمكن إلغاء أو تعديل الموعد قبل 24 ساعة من موعده.</p>
          <h3 className="mt-6 mb-2 text-xl font-bold text-[color:var(--color-charcoal)]">الرسوم</h3>
          <p>تُدفع الرسوم بعد كل جلسة. رسوم الاستشارة الأونلاين تُدفع مقدماً وغير قابلة للاسترداد بعد رد الطبيب.</p>
          <h3 className="mt-6 mb-2 text-xl font-bold text-[color:var(--color-charcoal)]">الاستشارات الأونلاين</h3>
          <p>الاستشارات الأونلاين ليست بديلاً عن الفحص السريري، وتُقدَّم لإرشادك حول ما إذا كنت بحاجة لزيارة العيادة.</p>
          <h3 className="mt-6 mb-2 text-xl font-bold text-[color:var(--color-charcoal)]">التعديلات</h3>
          <p>نحتفظ بحق تعديل هذه الشروط في أي وقت، ويتم إشعارك بأي تعديلات جوهرية عبر البريد الإلكتروني.</p>
        </article>
      </Container></section>
    </PageShell>
  ),
});
