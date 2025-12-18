import type { SectionContent, SectionStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"

interface OfferStackProps {
  content: SectionContent
  style: SectionStyle
}

export function OfferStack({ content, style }: OfferStackProps) {
  const offers = content.offers ? JSON.parse(content.offers as string) : []

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding || "4rem 1.5rem",
      }}
    >
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">{content.title as string}</h2>
          <p className="text-lg opacity-90">{content.subtitle as string}</p>
        </div>

        <Card className="p-8 mb-6">
          <div className="space-y-4">
            {offers.map((offer: any, index: number) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                <Check className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="font-semibold text-lg">{offer.title}</div>
                  <div className="text-sm opacity-80 mt-1">{offer.description}</div>
                  <div className="font-bold mt-2">${offer.value} Value</div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg">Total Value:</span>
              <span className="text-2xl font-bold">${content.totalValue as string}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold">Your Price Today:</span>
              <span className="text-3xl font-bold text-green-600">${content.price as string}</span>
            </div>
            <Button size="lg" className="w-full h-14">
              {content.buttonText as string}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
