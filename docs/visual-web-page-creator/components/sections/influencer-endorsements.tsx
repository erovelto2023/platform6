import type { SectionContent, SectionStyle } from "@/lib/types"

interface InfluencerEndorsementsProps {
  content: SectionContent
  style: SectionStyle
}

export function InfluencerEndorsements({ content, style }: InfluencerEndorsementsProps) {
  const endorsements = JSON.parse((content.endorsements as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">{content.title as string}</h2>
        {content.subtitle && <p className="text-center text-lg mb-12 opacity-80">{content.subtitle as string}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {endorsements.map((endorsement: any, index: number) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={endorsement.avatar || "/placeholder.svg?height=60&width=60"}
                  alt={endorsement.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-bold text-lg">{endorsement.name}</h3>
                  <p className="text-sm opacity-70">{endorsement.title}</p>
                  <p className="text-xs opacity-50 mt-1">{endorsement.followers} followers</p>
                </div>
              </div>
              <p className="text-lg italic mb-4">"{endorsement.quote}"</p>
              <div className="flex gap-2">
                {endorsement.platforms?.map((platform: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
