import type { SectionContent, SectionStyle } from "@/lib/types"
import { Check } from "lucide-react"

interface FeatureListProps {
  content: SectionContent
  style: SectionStyle
}

export function FeatureList({ content, style }: FeatureListProps) {
  const features = JSON.parse((content.features as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-3xl mx-auto">
        {content.title && <h2 className="text-3xl font-bold mb-8 text-center">{content.title as string}</h2>}
        <ul className="space-y-4">
          {features.map((feature: string, index: number) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: style.accentColor }} />
              <span className="text-lg">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
