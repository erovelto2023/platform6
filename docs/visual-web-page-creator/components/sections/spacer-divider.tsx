import type { SectionContent, SectionStyle } from "@/lib/types"

interface SpacerDividerProps {
  content: SectionContent
  style: SectionStyle
}

export function SpacerDivider({ content, style }: SpacerDividerProps) {
  const type = (content.type as string) || "spacer"
  const height = (content.height as string) || "4rem"

  if (type === "divider") {
    return (
      <div
        style={{
          backgroundColor: style.backgroundColor,
          padding: style.padding,
        }}
      >
        <div className="max-w-7xl mx-auto">
          <hr
            style={{
              borderColor: style.textColor,
              opacity: 0.2,
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        height,
        backgroundColor: style.backgroundColor,
      }}
    />
  )
}
