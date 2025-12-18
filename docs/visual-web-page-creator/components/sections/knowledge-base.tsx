import type { SectionContent, SectionStyle } from "@/lib/types"
import { Book, Search } from "lucide-react"

interface KnowledgeBaseProps {
  content: SectionContent
  style: SectionStyle
}

export function KnowledgeBase({ content, style }: KnowledgeBaseProps) {
  const categories = JSON.parse((content.categories as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{content.title as string}</h2>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
            <input
              type="text"
              placeholder="Search knowledge base..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2"
              style={{ borderColor: style.accentColor + "40" }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category: any, index: number) => (
            <div key={index} className="p-6 rounded-lg border-2 hover:shadow-lg transition-shadow">
              <Book className="w-8 h-8 mb-3" style={{ color: style.accentColor }} />
              <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
              <p className="opacity-70 text-sm mb-4">{category.description}</p>
              <a href="#" className="text-sm font-semibold" style={{ color: style.accentColor }}>
                View {category.articleCount} articles →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
