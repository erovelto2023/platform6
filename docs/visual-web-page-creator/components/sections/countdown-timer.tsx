import type { SectionContent, SectionStyle } from "@/lib/types"

interface CountdownTimerProps {
  content: SectionContent
  style: SectionStyle
}

export function CountdownTimer({ content, style }: CountdownTimerProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">{content.title as string}</h2>
        <p className="text-xl mb-8 opacity-80">{content.subtitle as string}</p>

        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
          {["Days", "Hours", "Minutes", "Seconds"].map((label, index) => (
            <div key={index} className="bg-white/10 backdrop-blur rounded-xl p-6">
              <div className="text-5xl font-bold mb-2">00</div>
              <div className="text-sm opacity-70">{label}</div>
            </div>
          ))}
        </div>

        <a
          href={content.buttonLink as string}
          className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
        >
          {content.buttonText as string}
        </a>
      </div>
    </section>
  )
}
