import type { SectionContent, SectionStyle } from "@/lib/types"

interface SplitLayoutProps {
  content: SectionContent
  style: SectionStyle
}

export function SplitLayout({ content, style }: SplitLayoutProps) {
  const ratio = (content.ratio as string) || "50/50"
  const leftWidth = ratio === "30/70" ? "30%" : ratio === "70/30" ? "70%" : "50%"
  const rightWidth = ratio === "30/70" ? "70%" : ratio === "70/30" ? "30%" : "50%"

  return (
    <div
      className="flex flex-col md:flex-row gap-8"
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div style={{ flex: `0 0 ${leftWidth}` }}>
        <h2 className="text-3xl font-bold mb-4">{content.leftTitle as string}</h2>
        <div className="prose" style={{ color: style.textColor }}>
          {content.leftContent as string}
        </div>
      </div>

      <div style={{ flex: `0 0 ${rightWidth}` }}>
        <h2 className="text-3xl font-bold mb-4">{content.rightTitle as string}</h2>
        <div className="prose" style={{ color: style.textColor }}>
          {content.rightContent as string}
        </div>
      </div>
    </div>
  )
}
