import type { SectionContent, SectionStyle } from "@/lib/types"

interface BioTeamIntroProps {
  content: SectionContent
  style: SectionStyle
}

export function BioTeamIntro({ content, style }: BioTeamIntroProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <img
            src={(content.image as string) || "/placeholder.svg?height=400&width=400"}
            alt={content.name as string}
            className="w-64 h-64 rounded-full object-cover"
          />
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-2">{content.name as string}</h2>
            <p className="text-xl opacity-70 mb-6">{content.role as string}</p>
            <p className="text-lg opacity-80 leading-relaxed mb-6">{content.bio as string}</p>
            {content.quote && (
              <blockquote
                className="border-l-4 pl-4 italic text-lg"
                style={{ borderColor: style.accentColor, opacity: 0.9 }}
              >
                &quot;{content.quote as string}&quot;
              </blockquote>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
