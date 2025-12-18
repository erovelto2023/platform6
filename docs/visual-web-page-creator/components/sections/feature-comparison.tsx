import type { SectionContent, SectionStyle } from "@/lib/types"

interface FeatureComparisonProps {
  content: SectionContent
  style: SectionStyle
}

export function FeatureComparison({ content, style }: FeatureComparisonProps) {
  const features = JSON.parse((content.features as string) || "[]")
  const columns = JSON.parse((content.columns as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">{content.title as string}</h2>
        <p className="text-xl text-center mb-12 opacity-80">{content.subtitle as string}</p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 font-semibold">Feature</th>
                {columns.map((col: string, index: number) => (
                  <th key={index} className="text-center p-4 font-semibold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature: any, index: number) => (
                <tr key={index} className="border-b border-white/5">
                  <td className="p-4">{feature.name}</td>
                  {feature.values.map((value: boolean, i: number) => (
                    <td key={i} className="text-center p-4">
                      {value ? (
                        <span className="text-green-400 text-xl">✓</span>
                      ) : (
                        <span className="text-red-400 text-xl">✗</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
