import type { SectionContent, SectionStyle } from "@/lib/types"

interface BundleOffersProps {
  content: SectionContent
  style: SectionStyle
}

export function BundleOffers({ content, style }: BundleOffersProps) {
  const bundles = JSON.parse((content.bundles as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold mb-8 text-center">{content.title as string}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bundles.map((bundle: any, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <span className="text-sm font-semibold uppercase">{bundle.badge}</span>
                <h3 className="text-2xl font-bold mt-2">{bundle.name}</h3>
                <p className="text-3xl font-bold mt-4">${bundle.price}</p>
                <p className="text-sm opacity-90">Save ${bundle.savings}</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  {bundle.items.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                  Buy Bundle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
