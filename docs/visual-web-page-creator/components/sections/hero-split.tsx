import type { SectionContent, SectionStyle } from "@/lib/types"
import Image from "next/image"

interface HeroSplitProps {
  content: SectionContent
  style: SectionStyle
}

export function HeroSplit({ content, style }: HeroSplitProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-bold mb-6">{content.title as string}</h1>
          <p className="text-xl mb-8 opacity-80">{content.subtitle as string}</p>
          <a
            href={content.buttonLink as string}
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {content.buttonText as string}
          </a>
        </div>
        <div className="relative h-96">
          <Image
            src={(content.imageUrl as string) || "/placeholder.svg"}
            alt="Hero"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    </section>
  )
}
