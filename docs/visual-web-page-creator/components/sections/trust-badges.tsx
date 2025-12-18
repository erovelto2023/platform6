import type { SectionContent, SectionStyle } from "@/lib/types"
import { Lock, Shield, Star, Users } from "lucide-react"

interface TrustBadgesProps {
  content: SectionContent
  style: SectionStyle
}

export function TrustBadges({ content, style }: TrustBadgesProps) {
  const badges = [
    { icon: Shield, label: "SSL Secure" },
    { icon: Lock, label: "Privacy Protected" },
    { icon: Star, label: "5-Star Rated" },
    { icon: Users, label: "50K+ Users" },
  ]

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-wrap justify-center gap-8">
          {badges.map((badge, i) => (
            <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <badge.icon className="w-5 h-5" />
              <span className="font-medium">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
