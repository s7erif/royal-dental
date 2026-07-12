import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Container } from "@/components/site/PageShell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "@/data/clinic";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [
    { title: "الأسئلة الشائعة — رويال ديـنـتـال" },
    { name: "description", content: "إجابات عن أكثر الأسئلة شيوعاً حول خدمات مركز رويال ديـنـتـال." },
    { property: "og:title", content: "الأسئلة الشائعة — رويال ديـنـتـال" },
    { property: "og:description", content: "إجابات لأشيع الأسئلة عن طب الأسنان." },
  ]}),
  component: () => (
    <PageShell heroKicker="الأسئلة الشائعة" heroTitle="إجابات لأشيع الأسئلة" heroSubtitle="كل ما تحتاج معرفته قبل زيارتنا.">
      <section className="pb-24"><Container>
        <div className="mx-auto max-w-3xl rounded-[28px] border border-white/60 bg-white/70 p-4 backdrop-blur-xl sm:p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`i${i}`} className="border-b border-[color:var(--color-charcoal)]/10 last:border-0">
                <AccordionTrigger className="text-right text-base font-semibold hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-[color:var(--color-charcoal)]/70">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container></section>
    </PageShell>
  ),
});
