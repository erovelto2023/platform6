import type { SectionContent, SectionStyle } from "@/lib/types"

interface StatsSectionProps {
  content: SectionContent
  style: SectionStyle
}

export function StatsSection({ content, style }: StatsSectionProps) {
  const stats = JSON.parse((content.stats as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">{content.title as string}</h2>
        <p className="text-xl text-center mb-12 opacity-80">{content.subtitle as string}</p>

        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat: any, index: number) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-lg opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
