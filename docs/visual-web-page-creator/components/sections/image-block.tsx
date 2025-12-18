import type { SectionContent, SectionStyle } from "@/lib/types"

interface ImageBlockProps {
  content: SectionContent
  style: SectionStyle
}

export function ImageBlock({ content, style }: ImageBlockProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        padding: style.padding,
        textAlign: style.textAlign,
      }}
    >
      <div style={{ maxWidth: style.maxWidth, margin: "0 auto" }}>
        <img
          src={(content.imageUrl as string) || "/placeholder.svg"}
          alt={(content.imageAlt as string) || "Image"}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: style.borderRadius,
            objectFit: "cover",
          }}
        />
        {content.caption && (
          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.875rem",
              color: style.textColor,
              opacity: 0.8,
              textAlign: style.textAlign,
            }}
          >
            {content.caption as string}
          </p>
        )}
      </div>
    </section>
  )
}
