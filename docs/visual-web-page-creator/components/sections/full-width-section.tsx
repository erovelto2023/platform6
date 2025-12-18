import type { SectionContent, SectionStyle } from "@/lib/types"

interface FullWidthSectionProps {
  content: SectionContent
  style: SectionStyle
}

export function FullWidthSection({ content, style }: FullWidthSectionProps) {
  return (
    <div
      className="w-full"
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <h2 className="text-3xl font-bold text-center mb-4">{content.title as string}</h2>
      <p className="text-center max-w-3xl mx-auto" style={{ opacity: 0.8 }}>
        {content.subtitle as string}
      </p>
    </div>
  )
}
