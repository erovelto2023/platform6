import type { SectionContent, SectionStyle } from "@/lib/types"

interface TextBlockProps {
  content: SectionContent
  style: SectionStyle
}

export function TextBlock({ content, style }: TextBlockProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
        textAlign: style.textAlign,
      }}
    >
      <div className="max-w-4xl mx-auto">
        <p className="text-lg leading-relaxed" style={{ fontSize: style.fontSize }}>
          {content.text as string}
        </p>
      </div>
    </section>
  )
}
