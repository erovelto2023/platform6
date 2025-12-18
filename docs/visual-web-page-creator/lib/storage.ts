import type { Template, Page } from "./types"

const TEMPLATES_KEY = "page_builder_templates"
const PAGES_KEY = "page_builder_pages"

export const storage = {
  // Templates
  getTemplates(): Template[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(TEMPLATES_KEY)
    return data ? JSON.parse(data) : []
  },

  saveTemplate(template: Template): void {
    const templates = this.getTemplates()
    const index = templates.findIndex((t) => t.id === template.id)
    if (index >= 0) {
      templates[index] = template
    } else {
      templates.push(template)
    }
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
  },

  deleteTemplate(id: string): void {
    const templates = this.getTemplates().filter((t) => t.id !== id)
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
  },

  // Pages
  getPages(): Page[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(PAGES_KEY)
    return data ? JSON.parse(data) : []
  },

  savePage(page: Page): void {
    const pages = this.getPages()
    const index = pages.findIndex((p) => p.id === page.id)
    if (index >= 0) {
      pages[index] = page
    } else {
      pages.push(page)
    }
    localStorage.setItem(PAGES_KEY, JSON.stringify(pages))
  },

  deletePage(id: string): void {
    const pages = this.getPages().filter((p) => p.id !== id)
    localStorage.setItem(PAGES_KEY, JSON.stringify(pages))
  },

  getPage(id: string): Page | undefined {
    return this.getPages().find((p) => p.id === id)
  },
}
