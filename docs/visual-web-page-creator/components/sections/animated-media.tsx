"use client"

import type { SectionContent, SectionStyle } from "@/lib/types"

interface AnimatedMediaProps {
  content: SectionContent
  style: SectionStyle
}

export function AnimatedMedia({ content, style }: AnimatedMediaProps) {
  const isLottie = (content.animationType as string) === "lottie"

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        padding: style.padding,
        textAlign: style.textAlign,
      }}
    >
      <div style={{ maxWidth: style.maxWidth, margin: "0 auto" }}>
        {content.title && (
          <h2
            style={{
              fontSize: style.fontSize,
              fontWeight: style.fontWeight,
              color: style.textColor,
              marginBottom: "2rem",
            }}
          >
            {content.title as string}
          </h2>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isLottie ? (
            <div
              style={{
                width: content.width ? `${content.width}px` : "400px",
                height: content.height ? `${content.height}px` : "400px",
              }}
            >
              <iframe
                src={`https://lottie.host/?file=${content.animationUrl}`}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                title="Lottie Animation"
              />
            </div>
          ) : (
            <img
              src={(content.animationUrl as string) || "/placeholder.svg"}
              alt={(content.title as string) || "Animation"}
              style={{
                width: content.width ? `${content.width}px` : "auto",
                height: content.height ? `${content.height}px` : "auto",
                maxWidth: "100%",
              }}
            />
          )}
        </div>

        {content.description && (
          <p
            style={{
              marginTop: "1.5rem",
              color: style.textColor,
              opacity: 0.8,
            }}
          >
            {content.description as string}
          </p>
        )}
      </div>
    </section>
  )
}
