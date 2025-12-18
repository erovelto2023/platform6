import type { SectionContent, SectionStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeroWithFormProps {
  content: SectionContent
  style: SectionStyle
}

export function HeroWithForm({ content, style }: HeroWithFormProps) {
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
            <h1 className="text-5xl font-bold mb-6">{content.title as string}</h1>
            <p className="text-xl mb-8 opacity-90">{content.subtitle as string}</p>
            <ul className="space-y-3">
              {JSON.parse((content.benefits as string) || "[]").map((benefit: string, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
            <h3 className="text-2xl font-semibold mb-6">{content.formTitle as string}</h3>
            <form className="space-y-4">
              <Input placeholder="Your Name" className="bg-white/20 border-white/30" />
              <Input type="email" placeholder="Email Address" className="bg-white/20 border-white/30" />
              <Input placeholder="Phone Number" className="bg-white/20 border-white/30" />
              <Button className="w-full" size="lg">
                {content.buttonText as string}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
