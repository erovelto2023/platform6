import type { SectionContent, SectionStyle } from "@/lib/types"

interface FlexStackProps {
  content: SectionContent
  style: SectionStyle
}

export function FlexStack({ content, style }: FlexStackProps) {
  const items = JSON.parse((content.items as string) || "[]")
  const direction = (content.direction as string) || "row"

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

        <div className={`flex ${direction === "column" ? "flex-col" : "flex-row"} gap-6 items-center justify-center`}>
          {items.map((item: any, index: number) => (
            <div
              key={index}
              className="p-6 rounded-lg flex-1"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p style={{ opacity: 0.8 }}>{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
