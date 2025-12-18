import type { SectionContent, SectionStyle } from "@/lib/types"

interface CartSummaryProps {
  content: SectionContent
  style: SectionStyle
}

export function CartSummary({ content, style }: CartSummaryProps) {
  const items = JSON.parse((content.items as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">{content.title as string}</h2>
          <div className="space-y-4 mb-6">
            {items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <span className="font-semibold">${item.price}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${content.subtotal as string}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>${content.shipping as string}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${content.tax as string}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t">
              <span>Total</span>
              <span>${content.total as string}</span>
            </div>
          </div>
          <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700">
            {content.buttonText as string}
          </button>
        </div>
      </div>
    </section>
  )
}
