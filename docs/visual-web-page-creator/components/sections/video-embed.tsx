import type { SectionContent, SectionStyle } from "@/lib/types"

interface VideoEmbedProps {
  content: SectionContent
  style: SectionStyle
}

export function VideoEmbed({ content, style }: VideoEmbedProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">{content.title as string}</h2>
        <p className="text-xl text-center mb-12 opacity-80">{content.subtitle as string}</p>

        <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="opacity-60">Video Player</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
