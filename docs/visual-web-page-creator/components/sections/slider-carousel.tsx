"use client"

import { useState } from "react"
import type { SectionContent, SectionStyle } from "@/lib/types"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SliderCarouselProps {
  content: SectionContent
  style: SectionStyle
}

export function SliderCarousel({ content, style }: SliderCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const slides = JSON.parse((content.slides as string) || "[]")

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % slides.length)
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        padding: style.padding,
        position: "relative",
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

        <div style={{ position: "relative", overflow: "hidden", borderRadius: style.borderRadius }}>
          <div
            style={{
              display: "flex",
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: "transform 0.5s ease-in-out",
            }}
          >
            {slides.map((slide: any, index: number) => (
              <div
                key={index}
                style={{
                  minWidth: "100%",
                  position: "relative",
                }}
              >
                <img
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.alt || `Slide ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "500px",
                    objectFit: "cover",
                  }}
                />
                {slide.caption && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                      padding: "2rem",
                      color: "white",
                    }}
                  >
                    <p style={{ fontSize: "1.25rem", fontWeight: "bold" }}>{slide.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {slides.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255, 255, 255, 0.9)",
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

              <button
                onClick={goToNext}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255, 255, 255, 0.9)",
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

              <div
                style={{
                  position: "absolute",
                  bottom: "1rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: "0.5rem",
                }}
              >
                {slides.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    style={{
                      width: "0.75rem",
                      height: "0.75rem",
                      borderRadius: "50%",
                      border: "none",
                      background: index === currentIndex ? "white" : "rgba(255, 255, 255, 0.5)",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
