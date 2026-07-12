import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFaqs } from "@/hooks/use-cms";
import { Reveal, SectionTitle } from "./_shared";

export function FAQ() {
  const { data: faqRows = [] } = useFaqs();
  if (faqRows.length === 0) return null;
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionTitle eyebrow="الأسئلة الشائعة" title={<>أسئلة متكررة</>} />
        <Reveal delay={0.1}>
          <Accordion
            type="single"
            collapsible
            className="mt-10 rounded-[24px] border border-white/60 bg-white/70 px-6 backdrop-blur-xl"
          >
            {faqRows.map((f) => (
              <AccordionItem key={f.id} value={f.id} className="border-b-black/5 last:border-0">
                <AccordionTrigger className="text-right text-lg text-[color:var(--color-charcoal)] font-bold">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-[color:var(--color-charcoal)]/65">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

export default FAQ;
