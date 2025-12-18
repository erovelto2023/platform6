import type { SectionContent, SectionStyle } from "@/lib/types"

interface ProductComparisonProps {
  content: SectionContent
  style: SectionStyle
}

export function ProductComparison({ content, style }: ProductComparisonProps) {
  const products = JSON.parse((content.products as string) || "[]")
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
        <h2 className="text-3xl font-bold mb-8 text-center">{content.title as string}</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left font-semibold">Features</th>
                {products.map((product: any, index: number) => (
                  <th key={index} className="p-4 text-center font-semibold">
                    {product.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature: string, index: number) => (
                <tr key={index} className="border-b">
                  <td className="p-4">{feature}</td>
                  {products.map((product: any, pIndex: number) => (
                    <td key={pIndex} className="p-4 text-center">
                      {product.features[index] ? (
                        <span className="text-green-600 text-xl">✓</span>
                      ) : (
                        <span className="text-gray-300 text-xl">—</span>
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
