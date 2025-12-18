import type { SectionContent, SectionStyle } from "@/lib/types"

interface SectionWrapperProps {
  content: SectionContent
  style: SectionStyle
}

export function SectionWrapper({ content, style }: SectionWrapperProps) {
  return (
    <div
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">{content.title as string}</h2>
        <div className="prose max-w-none" style={{ color: style.textColor }}>
          {content.content as string}
        </div>
      </div>
    </div>
  )
}
