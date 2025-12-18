import type { SectionContent, SectionStyle } from "@/lib/types"

interface BeforeAfterProps {
  content: SectionContent
  style: SectionStyle
}

export function BeforeAfter({ content, style }: BeforeAfterProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-12">{content.title as string}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-red-500">Before</h3>
              <img
                src={(content.beforeImage as string) || "/placeholder.svg?height=400&width=600&query=before"}
                alt="Before"
                className="w-full rounded-lg mb-4"
              />
              <ul className="space-y-2">
                {JSON.parse((content.beforePoints as string) || "[]").map((point: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-green-500">After</h3>
              <img
                src={(content.afterImage as string) || "/placeholder.svg?height=400&width=600&query=after"}
                alt="After"
                className="w-full rounded-lg mb-4"
              />
              <ul className="space-y-2">
                {JSON.parse((content.afterPoints as string) || "[]").map((point: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
