import type { SectionContent, SectionStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users } from "lucide-react"

interface HeroWebinarProps {
  content: SectionContent
  style: SectionStyle
}

export function HeroWebinar({ content, style }: HeroWebinarProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
            {content.label as string}
          </div>
          <h1 className="text-5xl font-bold mb-6">{content.title as string}</h1>
          <p className="text-xl opacity-90 mb-8">{content.subtitle as string}</p>

          <div className="flex justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{content.date as string}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{content.time as string}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{content.attendees as string}</span>
            </div>
          </div>

          <Button size="lg" className="px-12">
            {content.buttonText as string}
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {JSON.parse((content.highlights as string) || "[]").map((highlight: any, i: number) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="font-semibold mb-2">{highlight.title}</h3>
              <p className="text-sm opacity-80">{highlight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
