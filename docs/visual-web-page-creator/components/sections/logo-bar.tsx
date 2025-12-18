import type { SectionContent, SectionStyle } from "@/lib/types"

interface LogoBarProps {
  content: SectionContent
  style: SectionStyle
}

export function LogoBar({ content, style }: LogoBarProps) {
  const logos = JSON.parse((content.logos as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <p className="text-center text-sm uppercase tracking-wide opacity-60 mb-8">{content.title as string}</p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
          {logos.map((logo: any, i: number) => (
            <div key={i} className="h-8">
              <img src={logo.url || "/placeholder.svg?height=40&width=120"} alt={logo.name} className="h-full w-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
