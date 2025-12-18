import type { SectionContent, SectionStyle } from "@/lib/types"
import { Clock, Calendar } from "lucide-react"

interface PodcastEpisodeProps {
  content: SectionContent
  style: SectionStyle
}

export function PodcastEpisode({ content, style }: PodcastEpisodeProps) {
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
            gridTemplateColumns: "300px 1fr",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          <img
            src={(content.coverImage as string) || "/placeholder.svg"}
            alt={content.title as string}
            style={{
              width: "100%",
              borderRadius: style.borderRadius,
            }}
          />

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem",
                fontSize: "0.875rem",
                color: style.textColor,
                opacity: 0.7,
              }}
            >
              {content.episodeNumber && <span>Episode {content.episodeNumber as string}</span>}
              {content.date && (
                <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <Calendar size={16} />
                  {content.date as string}
                </span>
              )}
              {content.duration && (
                <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <Clock size={16} />
                  {content.duration as string}
                </span>
              )}
            </div>

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
                marginBottom: "2rem",
                opacity: 0.8,
                lineHeight: 1.6,
              }}
            >
              {content.description as string}
            </p>

            <audio controls style={{ width: "100%" }} src={content.audioUrl as string} />
          </div>
        </div>
      </div>
    </section>
  )
}
