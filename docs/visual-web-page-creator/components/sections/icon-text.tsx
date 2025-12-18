import type { SectionContent, SectionStyle } from "@/lib/types"
import { Star } from "lucide-react"

interface IconTextProps {
  content: SectionContent
  style: SectionStyle
}

export function IconText({ content, style }: IconTextProps) {
  const items = JSON.parse((content.items as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item: any, index: number) => (
            <div key={index} className="flex gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: style.accentColor }}
              >
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="opacity-80">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
