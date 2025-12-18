import type { SectionContent, SectionStyle } from "@/lib/types"

interface GlossaryProps {
  content: SectionContent
  style: SectionStyle
}

export function Glossary({ content, style }: GlossaryProps) {
  const terms = JSON.parse((content.terms as string) || "[]")
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center">{content.title as string}</h2>

        <div className="flex gap-2 mb-8 flex-wrap justify-center">
          {alphabet.map((letter) => (
            <a
              key={letter}
              href={`#${letter}`}
              className="w-8 h-8 flex items-center justify-center rounded font-semibold hover:scale-110 transition-transform"
              style={{ backgroundColor: style.accentColor, color: "#ffffff" }}
            >
              {letter}
            </a>
          ))}
        </div>

        <div className="space-y-6">
          {terms.map((term: any, index: number) => (
            <div key={index} className="border-b pb-4">
              <h3 className="text-xl font-semibold mb-2">{term.term}</h3>
              <p className="opacity-80">{term.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
