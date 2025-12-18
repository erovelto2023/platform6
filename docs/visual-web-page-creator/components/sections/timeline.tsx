import type { SectionContent, SectionStyle } from "@/lib/types"

interface TimelineProps {
  content: SectionContent
  style: SectionStyle
}

export function Timeline({ content, style }: TimelineProps) {
  const events = JSON.parse((content.events as string) || "[]")

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
        <div className="relative border-l-2" style={{ borderColor: style.accentColor }}>
          {events.map((event: any, index: number) => (
            <div key={index} className="mb-10 ml-6 relative">
              <div
                className="absolute w-4 h-4 rounded-full -left-[25px] top-1.5"
                style={{ backgroundColor: style.accentColor }}
              />
              <time className="mb-1 text-sm font-semibold opacity-70">{event.date}</time>
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="opacity-80">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
