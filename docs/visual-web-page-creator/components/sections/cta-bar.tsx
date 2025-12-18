import type { SectionContent, SectionStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface CtaBarProps {
  content: SectionContent
  style: SectionStyle
}

export function CtaBar({ content, style }: CtaBarProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding || "1.5rem 1.5rem",
      }}
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold mb-1">{content.title as string}</h3>
          <p className="text-sm opacity-90">{content.subtitle as string}</p>
        </div>
        <Button size="lg" className="shrink-0">
          {content.buttonText as string}
        </Button>
      </div>
    </section>
  )
}
