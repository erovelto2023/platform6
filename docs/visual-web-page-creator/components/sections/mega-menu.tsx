import type { SectionContent, SectionStyle } from "@/lib/types"
import { ChevronDown } from "lucide-react"

interface MegaMenuProps {
  content: SectionContent
  style: SectionStyle
}

export function MegaMenu({ content, style }: MegaMenuProps) {
  const menuSections = JSON.parse((content.menuSections as string) || "[]")

  return (
    <nav
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">{content.brandName as string}</div>

          <div className="hidden lg:flex items-center gap-8">
            {menuSections.map((section: any, index: number) => (
              <div key={index} className="group relative">
                <button
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                  style={{ color: style.textColor }}
                >
                  {section.title}
                  <ChevronDown className="h-4 w-4" />
                </button>

                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 hidden group-hover:block">
                  <div
                    className="bg-white shadow-xl rounded-lg p-6 min-w-[300px]"
                    style={{ backgroundColor: style.backgroundColor }}
                  >
                    <div className="grid gap-4">
                      {section.items?.map((item: any, itemIndex: number) => (
                        <a
                          key={itemIndex}
                          href={item.url}
                          className="block hover:opacity-80 transition-opacity"
                          style={{ color: style.textColor }}
                        >
                          <div className="font-medium">{item.label}</div>
                          {item.description && <div className="text-sm opacity-70 mt-1">{item.description}</div>}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
