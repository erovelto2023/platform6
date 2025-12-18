import type { SectionContent, SectionStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface CheckoutEmbedProps {
  content: SectionContent
  style: SectionStyle
}

export function CheckoutEmbed({ content, style }: CheckoutEmbedProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding || "4rem 1.5rem",
      }}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Billing Information</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="First Name" />
                <Input placeholder="Last Name" />
              </div>
              <Input type="email" placeholder="Email" />
              <Input placeholder="Address" />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="City" />
                <Input placeholder="ZIP" />
              </div>
              <div>
                <h3 className="font-semibold mb-3">Payment Method</h3>
                <Input placeholder="Card Number" />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Input placeholder="MM/YY" />
                  <Input placeholder="CVC" />
                </div>
              </div>
            </form>
          </div>

          <div>
            <Card className="p-6 sticky top-6">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between">
                  <span>{content.productName as string}</span>
                  <span className="font-semibold">${content.price as string}</span>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${content.price as string}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${content.tax || "0.00"}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${content.total as string}</span>
                </div>
              </div>
              <Button size="lg" className="w-full">
                Complete Purchase
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
