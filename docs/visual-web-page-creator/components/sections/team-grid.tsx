import type { SectionContent, SectionStyle } from "@/lib/types"

interface TeamGridProps {
  content: SectionContent
  style: SectionStyle
}

export function TeamGrid({ content, style }: TeamGridProps) {
  const members = JSON.parse((content.members as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">{content.title as string}</h2>
        <p className="text-xl text-center mb-12 opacity-80">{content.subtitle as string}</p>

        <div className="grid md:grid-cols-4 gap-8">
          {members.map((member: any, index: number) => (
            <div key={index} className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                <img
                  src={member.image || `/placeholder.svg?height=128&width=128&query=${member.name}`}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">{member.name}</h3>
              <p className="text-sm opacity-70 mb-3">{member.role}</p>
              <p className="text-sm opacity-80">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
