import type { SectionContent, SectionStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface HeroSocialProofProps {
  content: SectionContent
  style: SectionStyle
}

export function HeroSocialProof({ content, style }: HeroSocialProofProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
        textAlign: style.textAlign as any,
      }}
    >
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-6xl font-bold mb-6">{content.title as string}</h1>
        <p className="text-xl mb-8 opacity-90">{content.subtitle as string}</p>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-lg mb-8">{content.reviewText as string}</p>

        <Button size="lg" className="px-8">
          {content.buttonText as string}
        </Button>

        <div className="mt-12 flex justify-center items-center gap-8 opacity-70">
          <div className="text-center">
            <div className="text-3xl font-bold">{content.userCount as string}</div>
            <div className="text-sm">Happy Users</div>
          </div>
          <div className="h-12 w-px bg-current opacity-30" />
          <div className="text-center">
            <div className="text-3xl font-bold">{content.rating as string}</div>
            <div className="text-sm">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  )
}
