import type { SectionContent, SectionStyle } from "@/lib/types"

interface HeroVideoBgProps {
  content: SectionContent
  style: SectionStyle
}

export function HeroVideoBg({ content, style }: HeroVideoBgProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
        minHeight: "600px",
      }}
    >
      <div className="absolute inset-0 bg-black/50 z-10" />
      <div className="relative z-20 max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-bold mb-6">{content.title as string}</h1>
        <p className="text-2xl mb-8 opacity-90">{content.subtitle as string}</p>
        <div className="flex gap-4 justify-center">
          <a
            href={content.primaryButtonLink as string}
            className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {content.primaryButtonText as string}
          </a>
          <a
            href={content.secondaryButtonLink as string}
            className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
          >
            {content.secondaryButtonText as string}
          </a>
        </div>
      </div>
    </section>
  )
}
