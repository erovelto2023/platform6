import type { SectionContent, SectionStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface ComparisonPricingProps {
  content: SectionContent
  style: SectionStyle
}

export function ComparisonPricing({ content, style }: ComparisonPricingProps) {
  const plans = JSON.parse((content.plans as string) || "[]")
  const features = JSON.parse((content.features as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold text-center mb-12">{content.title as string}</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4">Features</th>
                {plans.map((plan: any, i: number) => (
                  <th key={i} className="p-4">
                    <div className="text-center">
                      <div className="font-bold text-xl">{plan.name}</div>
                      <div className="text-3xl font-bold my-2">{plan.price}</div>
                      <Button size="sm">{plan.cta}</Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature: any, i: number) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="p-4 font-medium">{feature.name}</td>
                  {feature.availability.map((available: boolean, j: number) => (
                    <td key={j} className="p-4 text-center">
                      {available ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto opacity-30" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
