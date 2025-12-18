import type { SectionContent, SectionStyle } from "@/lib/types"
import { Play } from "lucide-react"

interface VideoTestimonialsProps {
  content: SectionContent
  style: SectionStyle
}

export function VideoTestimonials({ content, style }: VideoTestimonialsProps) {
  const videos = JSON.parse((content.videos as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-12">{content.title as string}</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {videos.map((video: any, i: number) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                <img
                  src={video.thumbnail || "/placeholder.svg?height=300&width=400"}
                  alt={video.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-6 h-6 text-black ml-1" />
                  </div>
                </div>
              </div>
              <h3 className="font-semibold mb-1">{video.name}</h3>
              <p className="text-sm opacity-70">{video.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
