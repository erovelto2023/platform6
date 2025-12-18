import type { SectionContent, SectionStyle } from "@/lib/types"

interface DigitalDownloadProps {
  content: SectionContent
  style: SectionStyle
}

export function DigitalDownload({ content, style }: DigitalDownloadProps) {
  const files = JSON.parse((content.files as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold mb-8 text-center">{content.title as string}</h2>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-4">
            {files.map((file: any, index: number) => (
              <div key={index} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                    <span className="text-2xl">{file.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{file.name}</h3>
                    <p className="text-sm text-gray-600">{file.size}</p>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Download</button>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">{content.note as string}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
