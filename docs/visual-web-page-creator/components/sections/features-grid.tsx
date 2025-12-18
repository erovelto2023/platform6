import type { SectionContent, SectionStyle } from "@/lib/types"

interface Feature {
  title: string
  description: string
}

interface FeaturesGridProps {
  content: SectionContent
  style: SectionStyle
}

export function FeaturesGrid({ content, style }: FeaturesGridProps) {
  const features: Feature[] = content.features ? JSON.parse(content.features as string) : []

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{content.title as string}</h2>
          <p className="text-xl opacity-80">{content.subtitle as string}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="opacity-70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
