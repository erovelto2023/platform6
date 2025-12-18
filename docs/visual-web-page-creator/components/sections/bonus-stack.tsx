import type { SectionContent, SectionStyle } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Gift } from "lucide-react"

interface BonusStackProps {
  content: SectionContent
  style: SectionStyle
}

export function BonusStack({ content, style }: BonusStackProps) {
  const bonuses = content.bonuses ? JSON.parse(content.bonuses as string) : []

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding || "4rem 1.5rem",
      }}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full mb-4">
            <Gift className="w-5 h-5" />
            <span className="font-semibold">Exclusive Bonuses</span>
          </div>
          <h2 className="text-3xl font-bold mb-3">{content.title as string}</h2>
          <p className="text-lg opacity-90">{content.subtitle as string}</p>
        </div>

        <div className="grid gap-6">
          {bonuses.map((bonus: any, index: number) => (
            <Card key={index} className="p-6">
              <div className="flex items-start gap-6">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-lg p-4 shrink-0">
                  <div className="text-sm font-semibold">BONUS #{index + 1}</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{bonus.title}</h3>
                  <p className="text-sm opacity-80 mb-3">{bonus.description}</p>
                  <div className="font-bold text-green-600">${bonus.value} Value</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
