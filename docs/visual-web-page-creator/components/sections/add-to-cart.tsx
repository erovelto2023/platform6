import type { SectionContent, SectionStyle } from "@/lib/types"

interface AddToCartProps {
  content: SectionContent
  style: SectionStyle
}

export function AddToCart({ content, style }: AddToCartProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">{content.title as string}</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Quantity</label>
              <input type="number" min="1" defaultValue="1" className="border rounded px-4 py-2 w-32" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Color</label>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full bg-black border-2 border-gray-300"></button>
                <button className="w-8 h-8 rounded-full bg-blue-600 border-2 border-gray-300"></button>
                <button className="w-8 h-8 rounded-full bg-red-600 border-2 border-gray-300"></button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Size</label>
              <div className="flex gap-2">
                {["S", "M", "L", "XL"].map((size) => (
                  <button key={size} className="border-2 px-4 py-2 rounded hover:border-blue-600">
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700">
              {content.buttonText as string}
            </button>
            <p className="text-center text-sm text-gray-600">{content.description as string}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
