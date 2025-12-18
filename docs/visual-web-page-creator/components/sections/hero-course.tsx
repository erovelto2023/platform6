import type { SectionContent, SectionStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Award, BookOpen, Clock, Users } from "lucide-react"

interface HeroCourseProps {
  content: SectionContent
  style: SectionStyle
}

export function HeroCourse({ content, style }: HeroCourseProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6">{content.title as string}</h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">{content.subtitle as string}</p>

          <div className="flex justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>{content.lessonCount as string}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{content.duration as string}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{content.studentCount as string}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span>{content.level as string}</span>
            </div>
          </div>

          <Button size="lg" className="px-12">
            {content.buttonText as string}
          </Button>
        </div>

        <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={(content.courseImage as string) || "/placeholder.svg?height=600&width=1200&query=online course"}
            alt="Course Preview"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
