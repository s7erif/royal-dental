import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Container } from "@/components/site/PageShell";
export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [
    { title: "سياسة الخصوصية — رويال ديـنـتـال" },
    { name: "description", content: "سياسة الخصوصية الخاصة بمركز رويال ديـنـتـال." },
    { property: "og:title", content: "سياسة الخصوصية" },
    { property: "og:description", content: "كيف نتعامل مع بياناتك." },
  ]}),
  component: () => (
    <PageShell heroKicker="خصوصيتك" heroTitle="سياسة الخصوصية">
      <section className="pb-24"><Container>
        <article className="prose prose-neutral mx-auto max-w-3xl rounded-[24px] border border-white/60 bg-white/70 p-8 leading-loose backdrop-blur-xl text-[color:var(--color-charcoal)]/80">
          <p>يلتزم مركز رويال ديـنـتـال بحماية خصوصية زوّاره ومرضاه. توضح هذه السياسة نوع البيانات التي نجمعها وكيفية استخدامها وحمايتها.</p>
          <h3 className="mt-6 mb-2 text-xl font-bold text-[color:var(--color-charcoal)]">البيانات التي نجمعها</h3>
          <p>نجمع الاسم ورقم الهاتف والبريد الإلكتروني عند حجز موعد أو التواصل معنا، بالإضافة إلى المعلومات الطبية اللازمة لتقديم الرعاية.</p>
          <h3 className="mt-6 mb-2 text-xl font-bold text-[color:var(--color-charcoal)]">استخدام البيانات</h3>
          <p>تُستخدم بياناتك حصراً لتقديم الخدمة الطبية والتواصل معك بشأن مواعيدك وتحسين تجربتك في المركز.</p>
          <h3 className="mt-6 mb-2 text-xl font-bold text-[color:var(--color-charcoal)]">حماية البيانات</h3>
          <p>نستخدم أحدث معايير الأمان لحماية بياناتك، ولا نشاركها مع أي طرف ثالث دون موافقتك الصريحة.</p>
          <h3 className="mt-6 mb-2 text-xl font-bold text-[color:var(--color-charcoal)]">حقوقك</h3>
          <p>يحق لك في أي وقت طلب الاطلاع على بياناتك أو تعديلها أو حذفها بالتواصل معنا.</p>
        </article>
      </Container></section>
    </PageShell>
  ),
});
