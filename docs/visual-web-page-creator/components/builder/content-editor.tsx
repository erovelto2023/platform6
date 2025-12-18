"use client"

import type { SectionContent } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

interface ContentEditorProps {
  content: SectionContent
  onContentChange: (content: SectionContent) => void
}

export function ContentEditor({ content, onContentChange }: ContentEditorProps) {
  const updateContent = (key: string, value: string) => {
    onContentChange({ ...content, [key]: value })
  }

  return (
    <div className="h-full overflow-y-auto p-4 bg-gray-50 border-l">
      <h2 className="text-lg font-semibold mb-6">Content Editor</h2>

      <Card className="p-4">
        <div className="space-y-4">
          {Object.entries(content).map(([key, value]) => (
            <div key={key}>
              <Label htmlFor={key} className="text-sm capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </Label>
              {typeof value === "string" && value.length > 100 ? (
                <Textarea
                  id={key}
                  value={value}
                  onChange={(e) => updateContent(key, e.target.value)}
                  rows={4}
                  className="mt-1"
                />
              ) : (
                <Input
                  id={key}
                  value={value as string}
                  onChange={(e) => updateContent(key, e.target.value)}
                  className="mt-1"
                />
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
