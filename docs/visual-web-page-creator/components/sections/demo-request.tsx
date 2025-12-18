import type { SectionContent, SectionStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"

interface DemoRequestProps {
  content: SectionContent
  style: SectionStyle
}

export function DemoRequest({ content, style }: DemoRequestProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">{content.title as string}</h2>
            <p className="text-lg opacity-80 mb-8">{content.subtitle as string}</p>

            <ul className="space-y-4">
              {JSON.parse((content.benefits as string) || "[]").map((benefit: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-6">Schedule Your Demo</h3>
            <form className="space-y-4">
              <Input placeholder="Full Name" />
              <Input type="email" placeholder="Work Email" />
              <Input placeholder="Company Name" />
              <Input placeholder="Phone Number" />
              <Button className="w-full" size="lg">
                <Calendar className="w-4 h-4 mr-2" />
                {content.buttonText as string}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
