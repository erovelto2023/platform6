import type { SectionContent, SectionStyle } from "@/lib/types"

interface PricingTableProps {
  content: SectionContent
  style: SectionStyle
}

export function PricingTable({ content, style }: PricingTableProps) {
  const plans = JSON.parse((content.plans as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">{content.title as string}</h2>
        <p className="text-xl text-center mb-12 opacity-80">{content.subtitle as string}</p>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan: any, index: number) => (
            <div
              key={index}
              className={`p-8 rounded-2xl ${plan.featured ? "ring-4 ring-blue-500 scale-105" : "bg-white/5"}`}
            >
              {plan.featured && <div className="text-sm font-semibold text-blue-400 mb-2">MOST POPULAR</div>}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold mb-4">
                {plan.price}
                <span className="text-lg font-normal opacity-70">/mo</span>
              </div>
              <p className="mb-6 opacity-80">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
