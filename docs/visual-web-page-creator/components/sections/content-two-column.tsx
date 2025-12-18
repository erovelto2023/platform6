import type { SectionContent, SectionStyle } from "@/lib/types"
import Image from "next/image"

interface ContentTwoColumnProps {
  content: SectionContent
  style: SectionStyle
}

export function ContentTwoColumn({ content, style }: ContentTwoColumnProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">{content.title as string}</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg leading-relaxed mb-6">{content.leftContent as string}</p>
            <p className="text-lg leading-relaxed">{content.rightContent as string}</p>
          </div>
          <div className="relative h-96">
            <Image
              src={(content.imageUrl as string) || "/placeholder.svg"}
              alt="Content"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
