import type { SectionContent, SectionStyle } from "@/lib/types"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GuaranteeSectionProps {
  content: SectionContent
  style: SectionStyle
}

export function GuaranteeSection({ content, style }: GuaranteeSectionProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4">{content.title as string}</h2>
          <p className="text-xl mb-8 opacity-90">{content.description as string}</p>
          <p className="text-lg mb-8">{content.details as string}</p>
          <Button size="lg" className="px-8">
            {content.buttonText as string}
          </Button>
        </div>
      </div>
    </section>
  )
}
