import type { SectionContent, SectionStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Apple, Smartphone } from "lucide-react"

interface HeroAppDownloadProps {
  content: SectionContent
  style: SectionStyle
}

export function HeroAppDownload({ content, style }: HeroAppDownloadProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-6xl font-bold mb-6">{content.title as string}</h1>
            <p className="text-xl mb-8 opacity-90">{content.subtitle as string}</p>

            <div className="flex gap-4 mb-8">
              <Button size="lg" className="gap-2">
                <Apple className="w-5 h-5" />
                App Store
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <Smartphone className="w-5 h-5" />
                Google Play
              </Button>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white"
                  />
                ))}
              </div>
              <p className="text-sm opacity-80">{content.downloadCount as string}</p>
            </div>
          </div>

          <div className="relative">
            <img
              src={(content.appImage as string) || "/placeholder.svg?height=800&width=400&query=mobile app screenshot"}
              alt="App Screenshot"
              className="mx-auto max-w-sm"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
