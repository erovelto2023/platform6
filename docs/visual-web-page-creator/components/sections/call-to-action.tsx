import type { SectionContent, SectionStyle } from "@/lib/types"

interface CallToActionProps {
  content: SectionContent
  style: SectionStyle
}

export function CallToAction({ content, style }: CallToActionProps) {
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
        <h2 className="text-4xl font-bold mb-4">{content.title as string}</h2>
        <p className="text-xl mb-8 opacity-90">{content.subtitle as string}</p>
        <a
          href={content.buttonLink as string}
          className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          {content.buttonText as string}
        </a>
      </div>
    </section>
  )
}
