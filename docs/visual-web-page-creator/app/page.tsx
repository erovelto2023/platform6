"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Page } from "@/lib/types"
import { storage } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, FileText, Eye, Trash2, Pencil } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>([])

  useEffect(() => {
    setPages(storage.getPages())
  }, [])

  const handleCreatePage = () => {
    router.push("/builder")
  }

  const handleEditPage = (id: string) => {
    router.push(`/builder?id=${id}`)
  }

  const handlePreviewPage = (id: string) => {
    router.push(`/preview/${id}`)
  }

  const handleDeletePage = (id: string) => {
    if (confirm("Are you sure you want to delete this page?")) {
      storage.deletePage(id)
      setPages(storage.getPages())
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Visual Web Page Creator</h1>
          <p className="text-xl text-gray-600 mb-8">Build beautiful web pages with our drag-and-drop builder</p>
          <Button onClick={handleCreatePage} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Create New Page
          </Button>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Pages</h2>
          {pages.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">No pages yet</p>
              <Button onClick={handleCreatePage} variant="outline">
                Create your first page
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <Card key={page.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{page.name}</h3>
                      <p className="text-sm text-gray-500">{page.sections.length} sections</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mb-4">
                    Updated {new Date(page.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEditPage(page.id)} variant="outline" size="sm" className="flex-1">
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button onClick={() => handlePreviewPage(page.id)} variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button onClick={() => handleDeletePage(page.id)} variant="outline" size="sm">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12">
          <Button onClick={() => router.push("/templates")} variant="outline" size="lg">
            Manage Templates
          </Button>
        </div>
      </div>
    </div>
  )
}
