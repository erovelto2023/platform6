"use client"

import type { Section, Template } from "@/lib/types"
import { SectionRenderer } from "@/components/section-renderer"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react"

interface PageCanvasProps {
  sections: Section[]
  templates: Template[]
  selectedSectionId: string | null
  onSelectSection: (id: string | null) => void
  onMoveSection: (id: string, direction: "up" | "down") => void
  onDeleteSection: (id: string) => void
}

export function PageCanvas({
  sections,
  templates,
  selectedSectionId,
  onSelectSection,
  onMoveSection,
  onDeleteSection,
}: PageCanvasProps) {
  return (
    <div className="h-full overflow-y-auto bg-white">
      {sections.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <p className="text-lg">No sections yet</p>
            <p className="text-sm">Add templates from the sidebar to get started</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {sections.map((section, index) => {
            const template = templates.find((t) => t.id === section.templateId)
            if (!template) return null

            return (
              <div key={section.id} className="relative group">
                <SectionRenderer
                  section={section}
                  template={template}
                  isSelected={selectedSectionId === section.id}
                  onClick={() => onSelectSection(section.id)}
                />

                {selectedSectionId === section.id && (
                  <div className="absolute top-4 right-4 flex gap-2 bg-white rounded-lg shadow-lg p-2 border">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        onMoveSection(section.id, "up")
                      }}
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        onMoveSection(section.id, "down")
                      }}
                      disabled={index === sections.length - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteSection(section.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
