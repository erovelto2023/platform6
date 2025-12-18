import type { SectionContent, SectionStyle } from "@/lib/types"

interface GridLayoutProps {
  content: SectionContent
  style: SectionStyle
}

export function GridLayout({ content, style }: GridLayoutProps) {
  const items = JSON.parse((content.items as string) || "[]")
  const columns = Number.parseInt(content.columns as string) || 3

  return (
    <div
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">{content.title as string}</h2>

        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
          }}
        >
          {items.map((item: any, index: number) => (
            <div
              key={index}
              className="p-6 rounded-lg"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p style={{ opacity: 0.8 }}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
