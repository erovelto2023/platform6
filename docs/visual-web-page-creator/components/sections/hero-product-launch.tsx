import type { SectionContent, SectionStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface HeroProductLaunchProps {
  content: SectionContent
  style: SectionStyle
}

export function HeroProductLaunch({ content, style }: HeroProductLaunchProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">{content.badge as string}</span>
          </div>
        </div>
        <h1 className="text-6xl font-bold text-center mb-6">{content.title as string}</h1>
        <p className="text-xl text-center mb-12 max-w-2xl mx-auto opacity-90">{content.subtitle as string}</p>

        <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 shadow-2xl">
          <img
            src={(content.productImage as string) || "/placeholder.svg?height=600&width=1200"}
            alt="Product"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex justify-center gap-4">
          <Button size="lg" className="px-8">
            {content.primaryButtonText as string}
          </Button>
          <Button size="lg" variant="outline">
            {content.secondaryButtonText as string}
          </Button>
        </div>
      </div>
    </section>
  )
}
