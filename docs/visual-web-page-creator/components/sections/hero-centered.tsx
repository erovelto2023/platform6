import type { SectionContent, SectionStyle } from "@/lib/types"

interface HeroCenteredProps {
  content: SectionContent
  style: SectionStyle
}

export function HeroCentered({ content, style }: HeroCenteredProps) {
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
        <h1
          className="text-5xl font-bold mb-6"
          style={{
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
          }}
        >
          {content.title as string}
        </h1>
        <p className="text-xl mb-8 opacity-90">{content.subtitle as string}</p>
        <a
          href={content.buttonLink as string}
          className="inline-block px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          {content.buttonText as string}
        </a>
      </div>
    </section>
  )
}
