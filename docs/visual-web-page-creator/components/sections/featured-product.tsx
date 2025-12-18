import type { SectionContent, SectionStyle } from "@/lib/types"

interface FeaturedProductProps {
  content: SectionContent
  style: SectionStyle
}

export function FeaturedProduct({ content, style }: FeaturedProductProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src={(content.image as string) || "/placeholder.svg?height=600&width=600&query=featured product"}
              alt={content.title as string}
              className="w-full rounded-lg shadow-xl"
            />
          </div>
          <div>
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              {content.badge as string}
            </span>
            <h2 className="text-4xl font-bold mt-2 mb-4">{content.title as string}</h2>
            <p className="text-xl text-gray-600 mb-6">{content.description as string}</p>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold">${content.price as string}</span>
              {content.originalPrice && (
                <span className="text-xl text-gray-500 line-through">${content.originalPrice as string}</span>
              )}
            </div>
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">
                Add to Cart
              </button>
              <button className="border-2 border-gray-300 px-8 py-3 rounded-lg font-semibold hover:border-gray-400">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
