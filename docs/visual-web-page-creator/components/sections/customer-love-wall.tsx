import type { SectionContent, SectionStyle } from "@/lib/types"
import { Heart } from "lucide-react"

interface CustomerLoveWallProps {
  content: SectionContent
  style: SectionStyle
}

export function CustomerLoveWall({ content, style }: CustomerLoveWallProps) {
  const tweets = JSON.parse((content.tweets as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold text-center mb-4">{content.title as string}</h2>
        <p className="text-center opacity-70 mb-12">{content.subtitle as string}</p>

        <div className="grid md:grid-cols-3 gap-6">
          {tweets.map((tweet: any, i: number) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                <div>
                  <div className="font-semibold">{tweet.name}</div>
                  <div className="text-xs opacity-60">@{tweet.handle}</div>
                </div>
                <Heart className="w-4 h-4 ml-auto text-red-500 fill-red-500" />
              </div>
              <p className="text-sm">{tweet.message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
