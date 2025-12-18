import type { SectionContent, SectionStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { CreditCard, Lock } from "lucide-react"

interface PaymentButtonProps {
  content: SectionContent
  style: SectionStyle
}

export function PaymentButton({ content, style }: PaymentButtonProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding || "3rem 1.5rem",
      }}
    >
      <div className="container mx-auto max-w-xl text-center">
        <div className="mb-6">
          <div className="text-4xl font-bold mb-2">${content.price as string}</div>
          {content.originalPrice && (
            <div className="text-xl line-through opacity-60">${content.originalPrice as string}</div>
          )}
          <p className="text-sm mt-2 opacity-80">{content.priceDescription as string}</p>
        </div>

        <Button size="lg" className="w-full h-16 text-lg mb-4">
          <CreditCard className="w-5 h-5 mr-2" />
          {content.buttonText as string}
        </Button>

        <div className="flex items-center justify-center gap-2 text-sm opacity-70">
          <Lock className="w-4 h-4" />
          <span>Secure 256-bit SSL encrypted payment</span>
        </div>

        {content.guaranteeText && <p className="text-sm mt-4 opacity-80">{content.guaranteeText as string}</p>}
      </div>
    </section>
  )
}
