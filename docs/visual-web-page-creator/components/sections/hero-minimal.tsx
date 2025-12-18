import type { SectionContent, SectionStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface HeroMinimalProps {
  content: SectionContent
  style: SectionStyle
}

export function HeroMinimal({ content, style }: HeroMinimalProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
        textAlign: style.textAlign as any,
      }}
    >
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-7xl font-light mb-8 tracking-tight">{content.title as string}</h1>
        <p className="text-2xl mb-12 font-light opacity-80">{content.subtitle as string}</p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="lg">
            {content.primaryButtonText as string}
          </Button>
          <Button variant="ghost" size="lg">
            {content.secondaryButtonText as string}
          </Button>
        </div>
      </div>
    </section>
  )
}
