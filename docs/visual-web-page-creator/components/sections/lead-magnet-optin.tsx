import type { SectionContent, SectionStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download } from "lucide-react"

interface LeadMagnetOptinProps {
  content: SectionContent
  style: SectionStyle
}

export function LeadMagnetOptin({ content, style }: LeadMagnetOptinProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={(content.previewImage as string) || "/placeholder.svg?height=600&width=600&query=ebook cover"}
              alt="Lead Magnet"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-4">{content.title as string}</h2>
            <p className="text-lg opacity-80 mb-6">{content.description as string}</p>

            <ul className="space-y-3 mb-8">
              {JSON.parse((content.benefits as string) || "[]").map((benefit: string, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex gap-2">
              <Input placeholder="Your email address" className="flex-1" />
              <Button size="lg" className="gap-2">
                <Download className="w-4 h-4" />
                {content.buttonText as string}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
