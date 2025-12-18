import type { SectionContent, SectionStyle } from "@/lib/types"

interface ImageTextSplitProps {
  content: SectionContent
  style: SectionStyle
}

export function ImageTextSplit({ content, style }: ImageTextSplitProps) {
  const imageOnLeft = content.imagePosition === "left"

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        padding: style.padding,
      }}
    >
      <div style={{ maxWidth: style.maxWidth, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          <div style={{ order: imageOnLeft ? 0 : 1 }}>
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
          </div>

          <div style={{ order: imageOnLeft ? 1 : 0 }}>
            <h2
              style={{
                fontSize: style.fontSize,
                fontWeight: style.fontWeight,
                color: style.textColor,
                marginBottom: "1rem",
              }}
            >
              {content.title as string}
            </h2>
            <p
              style={{
                color: style.textColor,
                opacity: 0.8,
                lineHeight: 1.6,
                marginBottom: "1.5rem",
              }}
            >
              {content.description as string}
            </p>
            {content.buttonText && (
              <a
                href={content.buttonUrl as string}
                style={{
                  display: "inline-block",
                  padding: "0.75rem 2rem",
                  backgroundColor: style.textColor,
                  color: style.backgroundColor,
                  textDecoration: "none",
                  borderRadius: style.borderRadius,
                  fontWeight: "600",
                }}
              >
                {content.buttonText as string}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
