import type { SectionContent, SectionStyle } from "@/lib/types"

interface StoryNarrativeProps {
  content: SectionContent
  style: SectionStyle
}

export function StoryNarrative({ content, style }: StoryNarrativeProps) {
  const chapters = JSON.parse((content.chapters as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">{content.title as string}</h2>

        <div className="space-y-12">
          {chapters.map((chapter: any, index: number) => (
            <div key={index} className="relative pl-8 border-l-2" style={{ borderColor: style.accentColor }}>
              <div
                className="absolute w-4 h-4 rounded-full -left-[9px] top-2"
                style={{ backgroundColor: style.accentColor }}
              />
              <h3 className="text-2xl font-semibold mb-4">{chapter.title}</h3>
              <p className="text-lg opacity-80 leading-relaxed">{chapter.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
