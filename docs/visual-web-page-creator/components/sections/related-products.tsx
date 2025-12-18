import type { SectionContent, SectionStyle } from "@/lib/types"

interface RelatedProductsProps {
  content: SectionContent
  style: SectionStyle
}

export function RelatedProducts({ content, style }: RelatedProductsProps) {
  const products = JSON.parse((content.products as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold mb-8">{content.title as string}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product: any, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <img
                src={product.image || "/placeholder.svg?height=200&width=200&query=product"}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-lg font-bold text-blue-600">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
