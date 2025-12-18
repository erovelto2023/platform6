import type { SectionContent, SectionStyle } from "@/lib/types"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GlobalHeaderProps {
  content: SectionContent
  style: SectionStyle
}

export function GlobalHeader({ content, style }: GlobalHeaderProps) {
  const navItems = JSON.parse((content.navItems as string) || "[]")

  return (
    <header
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold">{content.brandName as string}</div>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item: any, index: number) => (
            <a
              key={index}
              href={item.url}
              className="hover:opacity-80 transition-opacity"
              style={{ color: style.textColor }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" style={{ color: style.textColor }}>
            {content.loginText as string}
          </Button>
          <Button size="sm">{content.ctaText as string}</Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
          </Button>
        </div>
      </div>
    </header>
  )
}
