import type { SectionContent, SectionStyle } from "@/lib/types"

interface LongFormContentProps {
  content: SectionContent
  style: SectionStyle
}

export function LongFormContent({ content, style }: LongFormContentProps) {
  return (
    <article
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{content.title as string}</h1>
        {content.author && (
          <div className="flex items-center gap-4 mb-8 pb-6 border-b">
            <div className="text-sm">
              <p className="font-semibold">{content.author as string}</p>
              <p className="opacity-70">{content.date as string}</p>
            </div>
          </div>
        )}
        <div className="prose prose-lg max-w-none leading-relaxed space-y-6">
          <div dangerouslySetInnerHTML={{ __html: (content.content as string) || "" }} />
        </div>
      </div>
    </article>
  )
}
