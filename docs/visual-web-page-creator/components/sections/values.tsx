import type { SectionContent, SectionStyle } from "@/lib/types"
import { Heart } from "lucide-react"

interface ValuesProps {
  content: SectionContent
  style: SectionStyle
}

export function Values({ content, style }: ValuesProps) {
  const values = JSON.parse((content.values as string) || "[]")

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
          {values.map((value: any, index: number) => (
            <div key={index} className="text-center p-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: style.accentColor }}
              >
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
              <p className="opacity-80">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
