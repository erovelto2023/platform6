import type { SectionContent, SectionStyle } from "@/lib/types"

interface NumberedStepsProps {
  content: SectionContent
  style: SectionStyle
}

export function NumberedSteps({ content, style }: NumberedStepsProps) {
  const steps = JSON.parse((content.steps as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-4xl mx-auto">
        {content.title && <h2 className="text-3xl font-bold mb-12 text-center">{content.title as string}</h2>}
        <div className="space-y-8">
          {steps.map((step: any, index: number) => (
            <div key={index} className="flex gap-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg"
                style={{ backgroundColor: style.accentColor, color: "#ffffff" }}
              >
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                <p className="opacity-80">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
