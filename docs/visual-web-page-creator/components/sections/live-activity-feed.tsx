"use client"

import { useState } from "react"
import type { SectionContent, SectionStyle } from "@/lib/types"

interface LiveActivityFeedProps {
  content: SectionContent
  style: SectionStyle
}

export function LiveActivityFeed({ content, style }: LiveActivityFeedProps) {
  const [activities] = useState([
    { user: "Sarah J.", action: "just purchased Pro Plan", time: "2m ago" },
    { user: "Mike T.", action: "created their first page", time: "5m ago" },
    { user: "Emma W.", action: "upgraded to Enterprise", time: "8m ago" },
  ])

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="font-semibold mb-4">{content.title as string}</h3>
          <div className="space-y-3">
            {activities.map((activity, i) => (
              <div key={i} className="flex items-center gap-3 text-sm animate-fade-in">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-medium">{activity.user}</span>
                <span className="opacity-70">{activity.action}</span>
                <span className="ml-auto text-xs opacity-50">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
