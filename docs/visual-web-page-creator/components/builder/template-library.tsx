"use client"

import type { Template } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"

interface TemplateLibraryProps {
  templates: Template[]
  onAddTemplate: (template: Template) => void
  onCreateTemplate: () => void
}

export function TemplateLibrary({ templates, onAddTemplate, onCreateTemplate }: TemplateLibraryProps) {
  const categories = Array.from(new Set(templates.map((t) => t.category)))

  return (
    <div className="h-full overflow-y-auto p-4 bg-gray-50 border-r">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Templates</h2>
        <Button onClick={onCreateTemplate} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" />
          New
        </Button>
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-6">
          <h3 className="text-sm font-medium text-gray-600 mb-3 capitalize">{category}</h3>
          <div className="space-y-2">
            {templates
              .filter((t) => t.category === category)
              .map((template) => (
                <Card
                  key={template.id}
                  className="p-3 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onAddTemplate(template)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{template.name}</p>
                      <p className="text-xs text-gray-500">{template.componentType}</p>
                    </div>
                    <Plus className="w-4 h-4 text-gray-400" />
                  </div>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
