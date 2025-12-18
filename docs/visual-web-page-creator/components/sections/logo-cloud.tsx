import type { SectionContent, SectionStyle } from "@/lib/types"

interface LogoCloudProps {
  content: SectionContent
  style: SectionStyle
}

export function LogoCloud({ content, style }: LogoCloudProps) {
  const logos = JSON.parse((content.logos as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">{content.title as string}</h2>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
          {logos.map((logo: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
            >
              <img
                src={logo.url || `/placeholder.svg?height=60&width=120&query=${logo.name}`}
                alt={logo.name}
                className="max-h-12 w-auto grayscale"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
