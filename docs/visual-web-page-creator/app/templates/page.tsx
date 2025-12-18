"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Template } from "@/lib/types"
import { storage } from "@/lib/storage"
import { defaultTemplates } from "@/lib/default-templates"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Trash2, Code } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CustomTemplateEditor } from "@/components/builder/custom-template-editor"

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false)
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    name: "",
    category: "",
    componentType: "HeroCentered",
  })

  useEffect(() => {
    const savedTemplates = storage.getTemplates()
    setTemplates([...defaultTemplates, ...savedTemplates])
  }, [])

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.category) {
      alert("Please fill in all fields")
      return
    }

    const template: Template = {
      id: `custom-${Date.now()}`,
      name: newTemplate.name,
      category: newTemplate.category,
      componentType: newTemplate.componentType || "HeroCentered",
      defaultContent: {
        title: "New Section",
        subtitle: "Edit this content",
        buttonText: "Click here",
        buttonLink: "#",
      },
      defaultStyle: {
        backgroundColor: "#ffffff",
        textColor: "#000000",
        padding: "4rem 1.5rem",
        textAlign: "center",
      },
    }

    storage.saveTemplate(template)
    setTemplates([...templates, template])
    setIsDialogOpen(false)
    setNewTemplate({ name: "", category: "", componentType: "HeroCentered" })
  }

  const handleSaveCustomTemplate = (template: Template) => {
    storage.saveTemplate(template)
    setTemplates([...templates.filter((t) => t.id !== template.id), template])
    setIsCodeEditorOpen(false)
  }

  const handleDeleteTemplate = (id: string) => {
    if (defaultTemplates.find((t) => t.id === id)) {
      alert("Cannot delete default templates")
      return
    }

    if (confirm("Are you sure you want to delete this template?")) {
      storage.deleteTemplate(id)
      setTemplates(templates.filter((t) => t.id !== id))
    }
  }

  const categories = Array.from(new Set(templates.map((t) => t.category)))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Template Library</h1>
          </div>
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Quick Create
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Template</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="name">Template Name</Label>
                    <Input
                      id="name"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                      placeholder="My Custom Template"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                      placeholder="hero, features, cta, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="component">Component Type</Label>
                    <select
                      id="component"
                      value={newTemplate.componentType}
                      onChange={(e) => setNewTemplate({ ...newTemplate, componentType: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="HeroCentered">Hero - Centered</option>
                      <option value="HeroSplit">Hero - Split</option>
                      <option value="FeaturesGrid">Features Grid</option>
                      <option value="CallToAction">Call to Action</option>
                      <option value="ContentTwoColumn">Content Two Column</option>
                    </select>
                  </div>
                  <Button onClick={handleCreateTemplate} className="w-full">
                    Create Template
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isCodeEditorOpen} onOpenChange={setIsCodeEditorOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Code className="w-4 h-4 mr-2" />
                  Create with Code
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Custom Template with Code</DialogTitle>
                </DialogHeader>
                <CustomTemplateEditor onSave={handleSaveCustomTemplate} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 capitalize">{category}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates
                .filter((t) => t.category === category)
                .map((template) => {
                  const isDefault = defaultTemplates.find((t) => t.id === template.id)
                  return (
                    <Card key={template.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                          <p className="text-sm text-gray-500">{template.componentType}</p>
                          {isDefault && <span className="text-xs text-blue-600 font-medium">Default</span>}
                        </div>
                        {!isDefault && (
                          <Button onClick={() => handleDeleteTemplate(template.id)} variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  )
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
