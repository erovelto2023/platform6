import type { SectionContent, SectionStyle } from "@/lib/types"

interface AboutStoryProps {
  content: SectionContent
  style: SectionStyle
}

export function AboutStory({ content, style }: AboutStoryProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-5xl font-bold mb-8">{content.title as string}</h2>

        <div className="prose prose-lg prose-invert max-w-none">
          <p className="text-xl leading-relaxed mb-6">{content.intro as string}</p>
          <p className="leading-relaxed mb-6">{content.body as string}</p>
          <p className="leading-relaxed">{content.conclusion as string}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <img
            src={(content.image1 as string) || "/placeholder.svg?height=400&width=600&query=team working"}
            alt="Our Story"
            className="w-full rounded-xl"
          />
          <img
            src={(content.image2 as string) || "/placeholder.svg?height=400&width=600&query=office space"}
            alt="Our Journey"
            className="w-full rounded-xl"
          />
        </div>
      </div>
    </section>
  )
}
