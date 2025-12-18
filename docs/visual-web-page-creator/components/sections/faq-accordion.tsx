import type { SectionContent, SectionStyle } from "@/lib/types"

interface FAQAccordionProps {
  content: SectionContent
  style: SectionStyle
}

export function FAQAccordion({ content, style }: FAQAccordionProps) {
  const faqs = JSON.parse((content.faqs as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">{content.title as string}</h2>
        <p className="text-xl text-center mb-12 opacity-80">{content.subtitle as string}</p>

        <div className="space-y-4">
          {faqs.map((faq: any, index: number) => (
            <details key={index} className="group bg-white/5 rounded-lg p-6">
              <summary className="flex justify-between items-center cursor-pointer font-semibold text-lg">
                {faq.question}
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 opacity-80">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
