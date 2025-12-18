import type { SectionContent, SectionStyle } from "@/lib/types"

interface CommunityProofProps {
  content: SectionContent
  style: SectionStyle
}

export function CommunityProof({ content, style }: CommunityProofProps) {
  const stats = JSON.parse((content.stats as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">{content.title as string}</h2>
        {content.subtitle && <p className="text-lg mb-12 opacity-80">{content.subtitle as string}</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {stats.map((stat: any, index: number) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10">
              <p className="text-4xl font-bold mb-2 text-blue-400">{stat.value}</p>
              <p className="text-sm opacity-70">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-lg border border-white/10">
          <h3 className="text-xl font-semibold mb-4">{content.communityTitle as string}</h3>
          <p className="opacity-90 mb-6">{content.communityDescription as string}</p>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
            {content.communityButton as string}
          </button>
        </div>
      </div>
    </section>
  )
}
