import type { SectionContent, SectionStyle } from "@/lib/types"

interface MediaMentionsProps {
  content: SectionContent
  style: SectionStyle
}

export function MediaMentions({ content, style }: MediaMentionsProps) {
  const mentions = JSON.parse((content.mentions as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">{content.title as string}</h2>
        {content.subtitle && <p className="text-center text-lg mb-12 opacity-80">{content.subtitle as string}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentions.map((mention: any, index: number) => (
            <a
              key={index}
              href={mention.link || "#"}
              className="group bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
            >
              <img
                src={mention.logo || "/placeholder.svg?height=60&width=120"}
                alt={mention.publication}
                className="h-12 mb-4 opacity-70 group-hover:opacity-100 transition-opacity"
              />
              <h3 className="font-semibold mb-2 group-hover:text-blue-400 transition-colors">{mention.headline}</h3>
              <p className="text-sm opacity-70 mb-3">{mention.excerpt}</p>
              <p className="text-xs opacity-50">{mention.date}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
