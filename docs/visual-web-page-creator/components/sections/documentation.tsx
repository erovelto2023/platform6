import type { SectionContent, SectionStyle } from "@/lib/types"
import { FileText } from "lucide-react"

interface DocumentationProps {
  content: SectionContent
  style: SectionStyle
}

export function Documentation({ content, style }: DocumentationProps) {
  const sections = JSON.parse((content.sections as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <h3 className="font-semibold text-lg mb-4">Documentation</h3>
            <nav className="space-y-2">
              {sections.map((section: any, index: number) => (
                <a
                  key={index}
                  href={`#${section.slug}`}
                  className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-8">{content.title as string}</h1>
            {sections.map((section: any, index: number) => (
              <div key={index} id={section.slug} className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6" style={{ color: style.accentColor }} />
                  <h2 className="text-2xl font-semibold">{section.title}</h2>
                </div>
                <div className="prose max-w-none">
                  <p className="opacity-80 leading-relaxed">{section.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
