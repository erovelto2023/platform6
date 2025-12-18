import type { SectionContent, SectionStyle } from "@/lib/types"

interface CaseStudiesProps {
  content: SectionContent
  style: SectionStyle
}

export function CaseStudies({ content, style }: CaseStudiesProps) {
  const caseStudies = JSON.parse((content.caseStudies as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">{content.title as string}</h2>
        {content.subtitle && <p className="text-center text-lg mb-12 opacity-80">{content.subtitle as string}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {caseStudies.map((study: any, index: number) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10">
              <img
                src={study.image || "/placeholder.svg?height=300&width=600"}
                alt={study.company}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img src={study.logo || "/placeholder.svg?height=40&width=40"} alt={study.company} className="h-8" />
                  <h3 className="font-bold text-xl">{study.company}</h3>
                </div>
                <h4 className="text-lg font-semibold mb-3">{study.title}</h4>
                <p className="opacity-90 mb-4">{study.description}</p>
                <div className="flex gap-6 mb-4">
                  {study.metrics?.map((metric: any, i: number) => (
                    <div key={i}>
                      <p className="text-2xl font-bold text-green-400">{metric.value}</p>
                      <p className="text-sm opacity-70">{metric.label}</p>
                    </div>
                  ))}
                </div>
                <a href={study.link || "#"} className="text-blue-400 hover:text-blue-300 font-medium">
                  Read full case study →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
