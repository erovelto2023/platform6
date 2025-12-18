import type { SectionContent, SectionStyle } from "@/lib/types"

interface ProductGridProps {
  content: SectionContent
  style: SectionStyle
}

export function ProductGrid({ content, style }: ProductGridProps) {
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
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ textAlign: style.textAlign }}>
          {content.title as string}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any, index: number) => (
            <div key={index} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={product.image || "/placeholder.svg?height=300&width=300&query=product"}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">${product.price}</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
