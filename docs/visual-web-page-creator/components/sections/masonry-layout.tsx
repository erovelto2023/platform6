import type { SectionContent, SectionStyle } from "@/lib/types"

interface MasonryLayoutProps {
  content: SectionContent
  style: SectionStyle
}

export function MasonryLayout({ content, style }: MasonryLayoutProps) {
  const items = JSON.parse((content.items as string) || "[]")

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

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {items.map((item: any, index: number) => (
            <div
              key={index}
              className="break-inside-avoid rounded-lg overflow-hidden"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {item.imageUrl && (
                <img src={item.imageUrl || "/placeholder.svg"} alt={item.title} className="w-full h-auto" />
              )}
              <div className="p-4">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm" style={{ opacity: 0.8 }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
