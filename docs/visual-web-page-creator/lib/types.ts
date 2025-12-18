export interface SectionStyle {
  backgroundColor?: string
  textColor?: string
  padding?: string
  margin?: string
  fontSize?: string
  fontWeight?: string
  textAlign?: "left" | "center" | "right"
  borderRadius?: string
  maxWidth?: string
}

export interface SectionContent {
  [key: string]: string | string[]
}

export interface Section {
  id: string
  templateId: string
  content: SectionContent
  style: SectionStyle
  order: number
}

export interface Template {
  id: string
  name: string
  category: string
  thumbnail?: string
  defaultContent: SectionContent
  defaultStyle: SectionStyle
  componentType: string
  customCode?: string // Added optional customCode field for user-defined templates
}

export interface Page {
  id: string
  name: string
  sections: Section[]
  createdAt: number
  updatedAt: number
}
