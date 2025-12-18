import type { SectionContent, SectionStyle } from "@/lib/types"

interface BackgroundSectionProps {
  content: SectionContent
  style: SectionStyle
}

export function BackgroundSection({ content, style }: BackgroundSectionProps) {
  const bgType = (content.backgroundType as string) || "image"
  const bgValue = content.backgroundValue as string

  const backgroundStyle: any = {
    color: style.textColor,
    padding: style.padding,
    position: "relative",
    overflow: "hidden",
  }

  if (bgType === "image") {
    backgroundStyle.backgroundImage = `url(${bgValue})`
    backgroundStyle.backgroundSize = "cover"
    backgroundStyle.backgroundPosition = "center"
  } else if (bgType === "gradient") {
    backgroundStyle.background = bgValue || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  }

  return (
    <div style={backgroundStyle}>
      {bgType === "video" && bgValue && (
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={bgValue} type="video/mp4" />
        </video>
      )}

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">{content.title as string}</h1>
        <p className="text-xl" style={{ opacity: 0.9 }}>
          {content.subtitle as string}
        </p>
      </div>
    </div>
  )
}
