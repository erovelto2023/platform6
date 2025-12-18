import type { SectionContent, SectionStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface UpsellCrosssellProps {
  content: SectionContent
  style: SectionStyle
}

export function UpsellCrosssell({ content, style }: UpsellCrosssellProps) {
  const products = content.products ? JSON.parse(content.products as string) : []

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding || "4rem 1.5rem",
      }}
    >
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">{content.title as string}</h2>
          <p className="text-lg opacity-90">{content.subtitle as string}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any, index: number) => (
            <Card key={index} className="p-6">
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <img
                  src={
                    product.image || `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(product.title)}`
                  }
                  alt={product.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
              <p className="text-sm opacity-80 mb-4">{product.description}</p>
              <div className="mb-4">
                <span className="text-2xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm line-through opacity-60 ml-2">${product.originalPrice}</span>
                )}
              </div>
              <Button className="w-full">Add to Order</Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
