import type { SectionContent, SectionStyle } from "@/lib/types"
import { Award } from "lucide-react"

interface AwardsCertificationsProps {
  content: SectionContent
  style: SectionStyle
}

export function AwardsCertifications({ content, style }: AwardsCertificationsProps) {
  const awards = JSON.parse((content.awards as string) || "[]")

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
        <div className="grid md:grid-cols-4 gap-8">
          {awards.map((award: any, i: number) => (
            <div key={i} className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold">{award.name}</h3>
              <p className="text-sm opacity-70">{award.year}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
