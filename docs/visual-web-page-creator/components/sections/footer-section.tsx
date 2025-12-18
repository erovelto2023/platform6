import type { SectionContent, SectionStyle } from "@/lib/types"

interface FooterSectionProps {
  content: SectionContent
  style: SectionStyle
}

export function FooterSection({ content, style }: FooterSectionProps) {
  const columns = JSON.parse((content.columns as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">{content.brandName as string}</h3>
            <p className="opacity-80">{content.brandDescription as string}</p>
          </div>

          {columns.map((column: any, index: number) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{column.title}</h4>
              <ul className="space-y-2">
                {column.links.map((link: any, i: number) => (
                  <li key={i}>
                    <a href={link.url} className="opacity-80 hover:opacity-100 transition-opacity">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="opacity-60">{content.copyright as string}</p>
          <div className="flex gap-4">
            {["Twitter", "LinkedIn", "GitHub"].map((social, index) => (
              <a
                key={index}
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                {social[0]}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
