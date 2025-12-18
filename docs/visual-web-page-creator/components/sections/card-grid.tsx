import type { SectionContent, SectionStyle } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CardGridProps {
  content: SectionContent
  style: SectionStyle
}

export function CardGrid({ content, style }: CardGridProps) {
  const cards = JSON.parse((content.cards as string) || "[]")

  return (
    <div
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">{content.title as string}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{card.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
