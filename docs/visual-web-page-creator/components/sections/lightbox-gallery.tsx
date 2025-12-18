"use client"

import { useState } from "react"
import type { SectionContent, SectionStyle } from "@/lib/types"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface LightboxGalleryProps {
  content: SectionContent
  style: SectionStyle
}

export function LightboxGallery({ content, style }: LightboxGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const images = JSON.parse((content.images as string) || "[]")

  const openLightbox = (index: number) => setSelectedIndex(index)
  const closeLightbox = () => setSelectedIndex(null)
  const goToNext = () => setSelectedIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : prev))
  const goToPrev = () => setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))

  return (
    <>
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {images.map((image: any, index: number) => (
              <div
                key={index}
                onClick={() => openLightbox(index)}
                style={{
                  cursor: "pointer",
                  overflow: "hidden",
                  borderRadius: style.borderRadius,
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.alt || `Image ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedIndex !== null && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              closeLightbox()
            }}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "white",
              border: "none",
              borderRadius: "50%",
              width: "3rem",
              height: "3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={24} />
          </button>

          {selectedIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrev()
              }}
              style={{
                position: "absolute",
                left: "1rem",
                background: "white",
                border: "none",
                borderRadius: "50%",
                width: "3rem",
                height: "3rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {selectedIndex < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              style={{
                position: "absolute",
                right: "1rem",
                background: "white",
                border: "none",
                borderRadius: "50%",
                width: "3rem",
                height: "3rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <ChevronRight size={24} />
            </button>
          )}

          <img
            src={images[selectedIndex].url || "/placeholder.svg"}
            alt={images[selectedIndex].alt}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90%",
              maxHeight: "90vh",
              objectFit: "contain",
            }}
          />
        </div>
      )}
    </>
  )
}
