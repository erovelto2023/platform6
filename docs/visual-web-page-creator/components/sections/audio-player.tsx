"use client"

import type React from "react"

import type { SectionContent, SectionStyle } from "@/lib/types"
import { Play, Pause, Volume2 } from "lucide-react"
import { useState, useRef } from "react"

interface AudioPlayerProps {
  content: SectionContent
  style: SectionStyle
}

export function AudioPlayer({ content, style }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

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
              marginBottom: "1rem",
            }}
          >
            {content.title as string}
          </h2>
        )}

        {content.description && (
          <p
            style={{
              color: style.textColor,
              textAlign: style.textAlign,
              marginBottom: "2rem",
              opacity: 0.8,
            }}
          >
            {content.description as string}
          </p>
        )}

        <div
          style={{
            background: "rgba(0, 0, 0, 0.05)",
            borderRadius: style.borderRadius,
            padding: "2rem",
          }}
        >
          <audio
            ref={audioRef}
            src={content.audioUrl as string}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={togglePlay}
              style={{
                background: style.textColor,
                color: style.backgroundColor,
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
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <div style={{ flex: 1 }}>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                style={{
                  width: "100%",
                  marginBottom: "0.5rem",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.875rem",
                  color: style.textColor,
                  opacity: 0.7,
                }}
              >
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <Volume2 size={20} style={{ color: style.textColor, opacity: 0.7 }} />
          </div>
        </div>
      </div>
    </section>
  )
}
