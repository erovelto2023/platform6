import type { SectionContent, SectionStyle } from "@/lib/types"

interface RecentlyViewedProps {
  content: SectionContent
  style: SectionStyle
}

export function RecentlyViewed({ content, style }: RecentlyViewedProps) {
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
        <div className="flex gap-6 overflow-x-auto pb-4">
          {products.map((product: any, index: number) => (
            <div key={index} className="flex-shrink-0 w-64 bg-white rounded-lg shadow">
              <img
                src={product.image || "/placeholder.svg?height=200&width=200&query=product"}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-lg font-bold text-blue-600">${product.price}</p>
                <button className="mt-3 w-full bg-gray-100 py-2 rounded hover:bg-gray-200">View Again</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
