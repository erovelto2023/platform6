import type { SectionContent, SectionStyle } from "@/lib/types"

interface SidebarLayoutProps {
  content: SectionContent
  style: SectionStyle
}

export function SidebarLayout({ content, style }: SidebarLayoutProps) {
  const sidebarItems = JSON.parse((content.sidebarItems as string) || "[]")
  const position = content.position as string

  return (
    <div
      className={`flex ${position === "right" ? "flex-row-reverse" : "flex-row"} gap-8`}
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <aside
        className="w-64 flex-shrink-0"
        style={{
          borderRight: position === "left" ? "1px solid rgba(0,0,0,0.1)" : undefined,
          borderLeft: position === "right" ? "1px solid rgba(0,0,0,0.1)" : undefined,
        }}
      >
        <div className="space-y-2">
          {sidebarItems.map((item: any, index: number) => (
            <a key={index} href={item.url} className="block px-4 py-2 rounded-lg hover:bg-black/5 transition-colors">
              {item.label}
            </a>
          ))}
        </div>
      </aside>

      <main className="flex-1">
        <h2 className="text-2xl font-bold mb-4">{content.title as string}</h2>
        <div className="prose max-w-none" style={{ color: style.textColor }}>
          {content.mainContent as string}
        </div>
      </main>
    </div>
  )
}
