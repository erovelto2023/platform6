"use client"

import { useState } from "react"
import type { SectionContent, SectionStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface TabbedFeaturesProps {
  content: SectionContent
  style: SectionStyle
}

export function TabbedFeatures({ content, style }: TabbedFeaturesProps) {
  const tabs = JSON.parse((content.tabs as string) || "[]")
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-12">{content.title as string}</h2>

        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {tabs.map((tab: any, i: number) => (
            <Button key={i} variant={activeTab === i ? "default" : "outline"} onClick={() => setActiveTab(i)}>
              {tab.name}
            </Button>
          ))}
        </div>

        {tabs[activeTab] && (
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">{tabs[activeTab].title}</h3>
              <p className="text-lg opacity-80 mb-6">{tabs[activeTab].description}</p>
              <ul className="space-y-3">
                {tabs[activeTab].features?.map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden">
              <img
                src={tabs[activeTab].image || "/placeholder.svg?height=400&width=600"}
                alt={tabs[activeTab].name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
