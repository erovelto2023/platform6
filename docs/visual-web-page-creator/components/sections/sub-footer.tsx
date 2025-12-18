import type { SectionContent, SectionStyle } from "@/lib/types"

interface SubFooterProps {
  content: SectionContent
  style: SectionStyle
}

export function SubFooter({ content, style }: SubFooterProps) {
  const links = JSON.parse((content.links as string) || "[]")

  return (
    <div
      className="border-t"
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
        borderTopColor: "rgba(255,255,255,0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <div style={{ opacity: 0.7 }}>{content.copyright as string}</div>

        <div className="flex items-center gap-6">
          {links.map((link: any, index: number) => (
            <a
              key={index}
              href={link.url}
              className="hover:opacity-80 transition-opacity"
              style={{ color: style.textColor, opacity: 0.7 }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
