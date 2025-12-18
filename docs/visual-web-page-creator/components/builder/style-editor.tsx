"use client"

import type { SectionStyle } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface StyleEditorProps {
  style: SectionStyle
  onStyleChange: (style: SectionStyle) => void
}

export function StyleEditor({ style, onStyleChange }: StyleEditorProps) {
  const updateStyle = (key: keyof SectionStyle, value: string) => {
    onStyleChange({ ...style, [key]: value })
  }

  return (
    <div className="h-full overflow-y-auto p-4 bg-gray-50 border-l">
      <h2 className="text-lg font-semibold mb-6">Style Editor</h2>

      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="font-medium mb-3">Colors</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="bg-color" className="text-sm">
                Background
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="bg-color"
                  type="color"
                  value={style.backgroundColor || "#ffffff"}
                  onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                  className="w-20 h-10 p-1"
                />
                <Input
                  type="text"
                  value={style.backgroundColor || "#ffffff"}
                  onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                  placeholder="#ffffff"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="text-color" className="text-sm">
                Text Color
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="text-color"
                  type="color"
                  value={style.textColor || "#000000"}
                  onChange={(e) => updateStyle("textColor", e.target.value)}
                  className="w-20 h-10 p-1"
                />
                <Input
                  type="text"
                  value={style.textColor || "#000000"}
                  onChange={(e) => updateStyle("textColor", e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium mb-3">Spacing</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="padding" className="text-sm">
                Padding
              </Label>
              <Input
                id="padding"
                value={style.padding || ""}
                onChange={(e) => updateStyle("padding", e.target.value)}
                placeholder="4rem 1.5rem"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="margin" className="text-sm">
                Margin
              </Label>
              <Input
                id="margin"
                value={style.margin || ""}
                onChange={(e) => updateStyle("margin", e.target.value)}
                placeholder="0"
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium mb-3">Typography</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="font-size" className="text-sm">
                Font Size
              </Label>
              <Input
                id="font-size"
                value={style.fontSize || ""}
                onChange={(e) => updateStyle("fontSize", e.target.value)}
                placeholder="1rem"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="font-weight" className="text-sm">
                Font Weight
              </Label>
              <Input
                id="font-weight"
                value={style.fontWeight || ""}
                onChange={(e) => updateStyle("fontWeight", e.target.value)}
                placeholder="400"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="text-align" className="text-sm">
                Text Align
              </Label>
              <select
                id="text-align"
                value={style.textAlign || "left"}
                onChange={(e) => updateStyle("textAlign", e.target.value as any)}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium mb-3">Other</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="border-radius" className="text-sm">
                Border Radius
              </Label>
              <Input
                id="border-radius"
                value={style.borderRadius || ""}
                onChange={(e) => updateStyle("borderRadius", e.target.value)}
                placeholder="0.5rem"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="max-width" className="text-sm">
                Max Width
              </Label>
              <Input
                id="max-width"
                value={style.maxWidth || ""}
                onChange={(e) => updateStyle("maxWidth", e.target.value)}
                placeholder="1200px"
                className="mt-1"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
