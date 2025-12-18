"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Section, Template, Page, SectionContent, SectionStyle } from "@/lib/types"
import { storage } from "@/lib/storage"
import { defaultTemplates } from "@/lib/default-templates"
import { TemplateLibrary } from "@/components/builder/template-library"
import { PageCanvas } from "@/components/builder/page-canvas"
import { ContentEditor } from "@/components/builder/content-editor"
import { StyleEditor } from "@/components/builder/style-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, Eye, ArrowLeft, Settings } from "lucide-react"

export default function BuilderPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<Page | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [editorMode, setEditorMode] = useState<"content" | "style">("content")
  const [pageName, setPageName] = useState("Untitled Page")

  useEffect(() => {
    // Load templates
    const savedTemplates = storage.getTemplates()
    setTemplates([...defaultTemplates, ...savedTemplates])

    // Create or load page
    const pageId = new URLSearchParams(window.location.search).get("id")
    if (pageId) {
      const page = storage.getPage(pageId)
      if (page) {
        setCurrentPage(page)
        setSections(page.sections)
        setPageName(page.name)
      }
    } else {
      // Create new page
      const newPage: Page = {
        id: Date.now().toString(),
        name: "Untitled Page",
        sections: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      setCurrentPage(newPage)
    }
  }, [])

  const handleAddTemplate = (template: Template) => {
    const newSection: Section = {
      id: Date.now().toString(),
      templateId: template.id,
      content: { ...template.defaultContent },
      style: { ...template.defaultStyle },
      order: sections.length,
    }
    setSections([...sections, newSection])
  }

  const handleMoveSection = (id: string, direction: "up" | "down") => {
    const index = sections.findIndex((s) => s.id === id)
    if (index === -1) return

    const newSections = [...sections]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newSections.length) return
    ;[newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]]
    newSections.forEach((section, i) => (section.order = i))

    setSections(newSections)
  }

  const handleDeleteSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id))
    if (selectedSectionId === id) {
      setSelectedSectionId(null)
    }
  }

  const handleContentChange = (content: SectionContent) => {
    if (!selectedSectionId) return

    setSections(sections.map((s) => (s.id === selectedSectionId ? { ...s, content } : s)))
  }

  const handleStyleChange = (style: SectionStyle) => {
    if (!selectedSectionId) return

    setSections(sections.map((s) => (s.id === selectedSectionId ? { ...s, style } : s)))
  }

  const handleSave = () => {
    if (!currentPage) return

    const updatedPage: Page = {
      ...currentPage,
      name: pageName,
      sections,
      updatedAt: Date.now(),
    }

    storage.savePage(updatedPage)
    setCurrentPage(updatedPage)
    alert("Page saved successfully!")
  }

  const handlePreview = () => {
    if (!currentPage) return
    handleSave()
    router.push(`/preview/${currentPage.id}`)
  }

  const selectedSection = sections.find((s) => s.id === selectedSectionId)

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 border-b flex items-center justify-between px-4 bg-white">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Input
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            className="w-64"
            placeholder="Page name"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Template Library */}
        <div className="w-64 overflow-hidden">
          <TemplateLibrary
            templates={templates}
            onAddTemplate={handleAddTemplate}
            onCreateTemplate={() => router.push("/templates")}
          />
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-hidden">
          <PageCanvas
            sections={sections}
            templates={templates}
            selectedSectionId={selectedSectionId}
            onSelectSection={setSelectedSectionId}
            onMoveSection={handleMoveSection}
            onDeleteSection={handleDeleteSection}
          />
        </div>

        {/* Editor Panel */}
        {selectedSection && (
          <div className="w-80 border-l flex flex-col">
            <div className="h-12 border-b flex items-center px-4 bg-white">
              <Button
                variant={editorMode === "content" ? "default" : "ghost"}
                size="sm"
                onClick={() => setEditorMode("content")}
                className="mr-2"
              >
                Content
              </Button>
              <Button
                variant={editorMode === "style" ? "default" : "ghost"}
                size="sm"
                onClick={() => setEditorMode("style")}
              >
                <Settings className="w-4 h-4 mr-1" />
                Style
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              {editorMode === "content" ? (
                <ContentEditor content={selectedSection.content} onContentChange={handleContentChange} />
              ) : (
                <StyleEditor style={selectedSection.style} onStyleChange={handleStyleChange} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
