import type { SectionContent, SectionStyle } from "@/lib/types"
import { ArrowRight } from "lucide-react"

interface HowItWorksProps {
  content: SectionContent
  style: SectionStyle
}

export function HowItWorks({ content, style }: HowItWorksProps) {
  const steps = JSON.parse((content.steps as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-center">{content.title as string}</h2>
        {content.subtitle && <p className="text-xl opacity-80 mb-12 text-center">{content.subtitle as string}</p>}

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step: any, index: number) => (
            <div key={index} className="relative">
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold"
                  style={{ backgroundColor: style.accentColor, color: "#ffffff" }}
                >
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="opacity-80">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 opacity-30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
