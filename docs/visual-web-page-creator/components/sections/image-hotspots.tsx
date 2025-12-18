"use client"

import { useState } from "react"
import type { SectionContent, SectionStyle } from "@/lib/types"
import { Plus } from "lucide-react"

interface ImageHotspotsProps {
  content: SectionContent
  style: SectionStyle
}

export function ImageHotspots({ content, style }: ImageHotspotsProps) {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null)
  const hotspots = JSON.parse((content.hotspots as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        padding: style.padding,
      }}
    >
      <div style={{ maxWidth: style.maxWidth, margin: "0 auto" }}>
        {content.title && (
          <h2
            style={{
              fontSize: style.fontSize,
              fontWeight: style.fontWeight,
              color: style.textColor,
              textAlign: style.textAlign,
              marginBottom: "2rem",
            }}
          >
            {content.title as string}
          </h2>
        )}

        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={(content.imageUrl as string) || "/placeholder.svg"}
            alt={(content.imageAlt as string) || "Image with hotspots"}
            style={{
              width: "100%",
              borderRadius: style.borderRadius,
            }}
          />

          {hotspots.map((hotspot: any, index: number) => (
            <div key={index}>
              <button
                onClick={() => setActiveHotspot(activeHotspot === index ? null : index)}
                style={{
                  position: "absolute",
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  transform: "translate(-50%, -50%)",
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.9)",
                  border: `2px solid ${style.textColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)"
                }}
              >
                <Plus size={20} style={{ color: style.textColor }} />
              </button>

              {activeHotspot === index && (
                <div
                  style={{
                    position: "absolute",
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    transform: "translate(-50%, calc(-100% - 1rem))",
                    background: "white",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    maxWidth: "250px",
                    zIndex: 10,
                  }}
                >
                  <h3 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{hotspot.title}</h3>
                  <p style={{ fontSize: "0.875rem", margin: 0 }}>{hotspot.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
