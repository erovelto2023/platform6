import type { SectionContent, SectionStyle } from "@/lib/types"

interface ProductHighlightsProps {
  content: SectionContent
  style: SectionStyle
}

export function ProductHighlights({ content, style }: ProductHighlightsProps) {
  const highlights = JSON.parse((content.highlights as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold mb-12 text-center">{content.title as string}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {highlights.map((highlight: any, index: number) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">{highlight.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{highlight.title}</h3>
              <p className="text-gray-600">{highlight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
