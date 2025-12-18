"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Page, Template } from "@/lib/types"
import { storage } from "@/lib/storage"
import { defaultTemplates } from "@/lib/default-templates"
import { SectionRenderer } from "@/components/section-renderer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Pencil } from "lucide-react"

export default function PreviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [page, setPage] = useState<Page | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])

  useEffect(() => {
    const loadedPage = storage.getPage(params.id)
    setPage(loadedPage || null)

    const savedTemplates = storage.getTemplates()
    setTemplates([...defaultTemplates, ...savedTemplates])
  }, [params.id])

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Page not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <Button onClick={() => router.push("/")} variant="outline" size="sm" className="bg-white shadow-lg">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={() => router.push(`/builder?id=${page.id}`)}
          variant="outline"
          size="sm"
          className="bg-white shadow-lg"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      {page.sections.map((section) => {
        const template = templates.find((t) => t.id === section.templateId)
        if (!template) return null

        return <SectionRenderer key={section.id} section={section} template={template} />
      })}
    </div>
  )
}
