import type { SectionContent, SectionStyle } from "@/lib/types"

interface HeadlineSubheadlineProps {
  content: SectionContent
  style: SectionStyle
}

export function HeadlineSubheadline({ content, style }: HeadlineSubheadlineProps) {
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
        <h1 className="text-5xl font-bold mb-4" style={{ fontSize: style.headlineFontSize }}>
          {content.headline as string}
        </h1>
        <p className="text-xl opacity-80" style={{ fontSize: style.subheadlineFontSize }}>
          {content.subheadline as string}
        </p>
      </div>
    </section>
  )
}
