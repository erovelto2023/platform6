"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Template } from "@/lib/types"
import { Info, Plus, Trash2, Code, Eye } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CustomTemplateEditorProps {
  onSave: (template: Template) => void
}

export function CustomTemplateEditor({ onSave }: CustomTemplateEditorProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [componentType, setComponentType] = useState("")
  const [componentCode, setComponentCode] = useState(STARTER_CODE)
  const [showPreview, setShowPreview] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [contentFields, setContentFields] = useState<Array<{ key: string; type: string; defaultValue: string }>>([
    { key: "title", type: "string", defaultValue: "Sample Title" },
  ])
  const [styleFields, setStyleFields] = useState<Array<{ key: string; defaultValue: string }>>([
    { key: "backgroundColor", defaultValue: "#ffffff" },
    { key: "textColor", defaultValue: "#000000" },
  ])

  const addContentField = () => {
    setContentFields([...contentFields, { key: "", type: "string", defaultValue: "" }])
  }

  const removeContentField = (index: number) => {
    setContentFields(contentFields.filter((_, i) => i !== index))
  }

  const addStyleField = () => {
    setStyleFields([...styleFields, { key: "", defaultValue: "" }])
  }

  const removeStyleField = (index: number) => {
    setStyleFields(styleFields.filter((_, i) => i !== index))
  }

  const renderPreview = () => {
    try {
      setPreviewError(null)
      const defaultContent: Record<string, any> = {}
      contentFields.forEach((field) => {
        if (field.key) {
          defaultContent[field.key] = field.defaultValue
        }
      })

      const defaultStyle: Record<string, any> = {}
      styleFields.forEach((field) => {
        if (field.key) {
          defaultStyle[field.key] = field.defaultValue
        }
      })

      const componentFunction = new Function(
        "React",
        "content",
        "style",
        componentCode +
          "\nconst Component = " +
          componentType +
          ";\nreturn React.createElement(Component, { content, style });",
      )

      const React = require("react")
      return componentFunction(React, defaultContent, defaultStyle)
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : "Unknown error")
      return null
    }
  }

  const handleSave = () => {
    if (!name || !category || !componentType) {
      alert("Please fill in template name, category, and component type")
      return
    }

    const defaultContent: Record<string, any> = {}
    contentFields.forEach((field) => {
      if (field.key) {
        defaultContent[field.key] = field.defaultValue
      }
    })

    const defaultStyle: Record<string, any> = {}
    styleFields.forEach((field) => {
      if (field.key) {
        defaultStyle[field.key] = field.defaultValue
      }
    })

    const template: Template = {
      id: `custom-code-${Date.now()}`,
      name,
      category,
      componentType,
      defaultContent,
      defaultStyle,
      customCode: componentCode,
    }

    onSave(template)
  }

  return (
    <div className="space-y-6 py-4">
      {/* Info Banner */}
      <Card className="bg-blue-50 border-blue-200 p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900 space-y-2">
            <p className="font-semibold">How to create a custom template:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Fill in template metadata (name, category, component type)</li>
              <li>Define content fields that users can edit (title, subtitle, etc.)</li>
              <li>Define style fields for customization (colors, spacing, etc.)</li>
              <li>Write your React component code using the content and style props</li>
              <li>Click the preview icon to see a visual mockup of your component</li>
            </ol>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="metadata" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="fields">Fields</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        {/* Template Metadata */}
        <TabsContent value="metadata" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="template-name">Template Name *</Label>
              <Input
                id="template-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome Section"
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="hero, features, cta, etc."
              />
            </div>
            <div>
              <Label htmlFor="component-type">Component Type * (no spaces)</Label>
              <Input
                id="component-type"
                value={componentType}
                onChange={(e) => setComponentType(e.target.value)}
                placeholder="MyAwesomeSection"
              />
              <p className="text-xs text-gray-500 mt-1">Must match the export name in your code</p>
            </div>
          </div>
        </TabsContent>

        {/* Content Fields */}
        <TabsContent value="fields" className="space-y-6 mt-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Content Fields</Label>
              <Button onClick={addContentField} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Field
              </Button>
            </div>
            <div className="space-y-2">
              {contentFields.map((field, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      placeholder="Field key (e.g., title)"
                      value={field.key}
                      onChange={(e) => {
                        const updated = [...contentFields]
                        updated[index].key = e.target.value
                        setContentFields(updated)
                      }}
                    />
                  </div>
                  <div className="w-32">
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={field.type}
                      onChange={(e) => {
                        const updated = [...contentFields]
                        updated[index].type = e.target.value
                        setContentFields(updated)
                      }}
                    >
                      <option value="string">String</option>
                      <option value="array">Array/JSON</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Default value"
                      value={field.defaultValue}
                      onChange={(e) => {
                        const updated = [...contentFields]
                        updated[index].defaultValue = e.target.value
                        setContentFields(updated)
                      }}
                    />
                  </div>
                  <Button onClick={() => removeContentField(index)} size="sm" variant="ghost">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              These fields will be editable in the content panel. Use &quot;string&quot; for text, &quot;array&quot; for
              complex data (will be JSON).
            </p>
          </div>

          {/* Style Fields */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Style Fields</Label>
              <Button onClick={addStyleField} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Field
              </Button>
            </div>
            <div className="space-y-2">
              {styleFields.map((field, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      placeholder="Field key (e.g., backgroundColor)"
                      value={field.key}
                      onChange={(e) => {
                        const updated = [...styleFields]
                        updated[index].key = e.target.value
                        setStyleFields(updated)
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Default value (e.g., #ffffff)"
                      value={field.defaultValue}
                      onChange={(e) => {
                        const updated = [...styleFields]
                        updated[index].defaultValue = e.target.value
                        setStyleFields(updated)
                      }}
                    />
                  </div>
                  <Button onClick={() => removeStyleField(index)} size="sm" variant="ghost">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Common fields: backgroundColor, textColor, padding, margin, fontSize, borderRadius
            </p>
          </div>
        </TabsContent>

        {/* Component Code */}
        <TabsContent value="code" className="space-y-4 mt-4">
          <Card className="bg-gray-50 border-gray-200 p-4">
            <div className="flex items-start gap-3">
              <Code className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-gray-700 space-y-2 flex-1">
                <p className="font-semibold">Code Requirements:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Export a function with the exact name from Component Type field</li>
                  <li>
                    Accept <code className="bg-white px-1 rounded">content</code> and{" "}
                    <code className="bg-white px-1 rounded">style</code> props
                  </li>
                  <li>Use standard React JSX syntax (HTML elements only)</li>
                  <li>
                    Access content with: <code className="bg-white px-1 rounded">content.yourField</code>
                  </li>
                  <li>
                    Apply styles with: <code className="bg-white px-1 rounded">style.yourStyle</code>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="component-code">React Component Code</Label>
              <Button onClick={() => setShowPreview(!showPreview)} size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-1" />
                {showPreview ? "Hide" : "Show"} Preview
              </Button>
            </div>
            <Textarea
              id="component-code"
              value={componentCode}
              onChange={(e) => setComponentCode(e.target.value)}
              className="font-mono text-sm min-h-[400px]"
              placeholder="Enter your React component code..."
            />
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-500">
                Your component receives <code className="bg-gray-100 px-1 rounded">content</code> and{" "}
                <code className="bg-gray-100 px-1 rounded">style</code> props.
              </p>
              <p className="text-xs text-gray-500">
                Access content: <code className="bg-gray-100 px-1 rounded">content.title</code>, style:{" "}
                <code className="bg-gray-100 px-1 rounded">style.backgroundColor</code>
              </p>
            </div>
          </div>

          {showPreview && (
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Live Preview
              </h3>
              {previewError ? (
                <div className="bg-red-50 border border-red-200 p-4 rounded">
                  <p className="text-red-700 font-semibold mb-2">Preview Error</p>
                  <pre className="text-xs text-red-600 overflow-x-auto">{previewError}</pre>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                  {renderPreview()}
                </div>
              )}
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button onClick={handleSave} size="lg">
          Save Custom Template
        </Button>
      </div>
    </div>
  )
}

const STARTER_CODE = `export function MyCustomSection({ content, style }) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding || "4rem 1.5rem",
        textAlign: style.textAlign || "center",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          {content.title}
        </h1>
        <p className="text-xl opacity-90">
          {content.subtitle}
        </p>
      </div>
    </section>
  )
}`
