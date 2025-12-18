import type { SectionContent, SectionStyle } from "@/lib/types"

interface ProductSpecsProps {
  content: SectionContent
  style: SectionStyle
}

export function ProductSpecs({ content, style }: ProductSpecsProps) {
  const specs = JSON.parse((content.specs as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold mb-8">{content.title as string}</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specs.map((spec: any, index: number) => (
              <div key={index} className="border-b pb-4">
                <dt className="text-sm font-semibold text-gray-500 uppercase mb-1">{spec.label}</dt>
                <dd className="text-lg font-medium">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
