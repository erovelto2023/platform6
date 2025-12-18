import type { SectionContent, SectionStyle } from "@/lib/types"

interface RichTextProps {
  content: SectionContent
  style: SectionStyle
}

export function RichText({ content, style }: RichTextProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div
        className="max-w-4xl mx-auto prose prose-lg"
        dangerouslySetInnerHTML={{ __html: (content.html as string) || "" }}
      />
    </section>
  )
}
