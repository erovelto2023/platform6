import type { SectionContent, SectionStyle } from "@/lib/types"
import { Target, Eye } from "lucide-react"

interface MissionVisionProps {
  content: SectionContent
  style: SectionStyle
}

export function MissionVision({ content, style }: MissionVisionProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-lg" style={{ backgroundColor: style.accentColor + "15" }}>
            <Target className="w-12 h-12 mb-4" style={{ color: style.accentColor }} />
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-lg opacity-80 leading-relaxed">{content.mission as string}</p>
          </div>
          <div className="p-8 rounded-lg" style={{ backgroundColor: style.accentColor + "15" }}>
            <Eye className="w-12 h-12 mb-4" style={{ color: style.accentColor }} />
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-lg opacity-80 leading-relaxed">{content.vision as string}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
