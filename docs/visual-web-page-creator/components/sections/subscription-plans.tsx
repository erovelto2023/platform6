import type { SectionContent, SectionStyle } from "@/lib/types"

interface SubscriptionPlansProps {
  content: SectionContent
  style: SectionStyle
}

export function SubscriptionPlans({ content, style }: SubscriptionPlansProps) {
  const plans = JSON.parse((content.plans as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold mb-4 text-center">{content.title as string}</h2>
        <p className="text-center text-gray-600 mb-12">{content.subtitle as string}</p>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan: any, index: number) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-lg p-8 ${plan.popular ? "ring-2 ring-blue-600 scale-105" : ""}`}
            >
              {plan.popular && (
                <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold mt-4">{plan.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-600">/{plan.interval}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-lg font-semibold ${
                  plan.popular ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
