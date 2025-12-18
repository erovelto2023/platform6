import type { SectionContent, SectionStyle } from "@/lib/types"

interface BoxedSectionProps {
  content: SectionContent
  style: SectionStyle
}

export function BoxedSection({ content, style }: BoxedSectionProps) {
  return (
    <div
      style={{
        backgroundColor: style.backgroundColor,
        padding: style.padding,
      }}
    >
      <div
        className="max-w-5xl mx-auto rounded-2xl shadow-lg"
        style={{
          backgroundColor: "#ffffff",
          color: style.textColor,
          padding: "3rem",
        }}
      >
        <h2 className="text-3xl font-bold mb-4">{content.title as string}</h2>
        <div className="prose max-w-none">{content.content as string}</div>
      </div>
    </div>
  )
}
