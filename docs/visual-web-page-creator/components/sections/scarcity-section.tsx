import type { SectionContent, SectionStyle } from "@/lib/types"
import { AlertCircle, Users, Clock } from "lucide-react"

interface ScarcitySectionProps {
  content: SectionContent
  style: SectionStyle
}

export function ScarcitySection({ content, style }: ScarcitySectionProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor || "#fef2f2",
        color: style.textColor,
        padding: style.padding || "3rem 1.5rem",
      }}
    >
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-start gap-4 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
          <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-red-900 mb-2">{content.title as string}</h3>
            <p className="text-red-800 mb-4">{content.message as string}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.spotsLeft && (
                <div className="flex items-center gap-2 text-red-700">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">{content.spotsLeft} spots remaining</span>
                </div>
              )}
              {content.timeLeft && (
                <div className="flex items-center gap-2 text-red-700">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">Ends in {content.timeLeft}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
