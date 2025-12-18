import type { SectionContent, SectionStyle } from "@/lib/types"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AnnouncementBarProps {
  content: SectionContent
  style: SectionStyle
}

export function AnnouncementBar({ content, style }: AnnouncementBarProps) {
  return (
    <div
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
        <div className="flex-1 text-center">
          <span className="font-medium">{content.message as string}</span>
          {content.linkText && (
            <a href={content.linkUrl as string} className="ml-2 underline hover:no-underline">
              {content.linkText as string}
            </a>
          )}
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
