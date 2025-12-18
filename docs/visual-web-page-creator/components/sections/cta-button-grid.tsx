import type { SectionContent, SectionStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface CtaButtonGridProps {
  content: SectionContent
  style: SectionStyle
}

export function CtaButtonGrid({ content, style }: CtaButtonGridProps) {
  const buttons = content.buttons ? JSON.parse(content.buttons as string) : []

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding || "4rem 1.5rem",
        textAlign: style.textAlign as any,
      }}
    >
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold mb-4">{content.title as string}</h2>
        <p className="text-lg mb-8 opacity-90">{content.subtitle as string}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {buttons.map((button: any, index: number) => (
            <Button key={index} size="lg" variant={button.variant || "default"} className="h-auto py-4">
              <div className="text-left">
                <div className="font-semibold">{button.label}</div>
                {button.description && <div className="text-xs opacity-80">{button.description}</div>}
              </div>
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
