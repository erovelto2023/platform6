import type { SectionContent, SectionStyle } from "@/lib/types"

interface SuccessStoriesProps {
  content: SectionContent
  style: SectionStyle
}

export function SuccessStories({ content, style }: SuccessStoriesProps) {
  const stories = JSON.parse((content.stories as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">{content.title as string}</h2>
        {content.subtitle && <p className="text-center text-lg mb-12 opacity-80">{content.subtitle as string}</p>}

        <div className="space-y-8">
          {stories.map((story: any, index: number) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-6 items-center bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10"
            >
              <img
                src={story.image || "/placeholder.svg?height=200&width=200"}
                alt={story.name}
                className="w-32 h-32 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{story.name}</h3>
                <p className="text-sm opacity-70 mb-3">{story.role}</p>
                <p className="text-lg mb-4 italic">"{story.quote}"</p>
                <p className="opacity-90">{story.story}</p>
                <div className="flex gap-4 mt-4">
                  {story.results?.map((result: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                      {result}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
