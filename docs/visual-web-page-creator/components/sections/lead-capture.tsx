import type { SectionContent, SectionStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface LeadCaptureProps {
  content: SectionContent
  style: SectionStyle
}

export function LeadCapture({ content, style }: LeadCaptureProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding || "4rem 1.5rem",
      }}
    >
      <div className="container mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold mb-4">{content.title as string}</h2>
        <p className="text-lg mb-8 opacity-90">{content.subtitle as string}</p>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="First Name" className="h-12" />
            <Input placeholder="Last Name" className="h-12" />
          </div>
          <Input type="email" placeholder="Email Address" className="h-12" />
          <Input type="tel" placeholder="Phone Number (Optional)" className="h-12" />
          <Button size="lg" className="w-full h-12">
            {content.buttonText as string}
          </Button>
        </form>

        {content.disclaimer && <p className="text-xs mt-4 opacity-70">{content.disclaimer as string}</p>}
      </div>
    </section>
  )
}
