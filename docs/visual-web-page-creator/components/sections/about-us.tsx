import type { SectionContent, SectionStyle } from "@/lib/types"

interface AboutUsProps {
  content: SectionContent
  style: SectionStyle
}

export function AboutUs({ content, style }: AboutUsProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src={(content.image as string) || "/placeholder.svg?height=500&width=600"}
              alt="About us"
              className="rounded-lg w-full"
              style={{ borderRadius: style.borderRadius }}
            />
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-6">{content.title as string}</h2>
            <p className="text-lg opacity-80 mb-6 leading-relaxed">{content.description as string}</p>
            {content.mission && (
              <div className="p-6 rounded-lg" style={{ backgroundColor: style.accentColor + "20" }}>
                <h3 className="font-semibold text-lg mb-2">Our Mission</h3>
                <p className="opacity-80">{content.mission as string}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
