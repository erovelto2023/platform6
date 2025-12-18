import type { SectionContent, SectionStyle } from "@/lib/types"

interface ReviewsGridProps {
  content: SectionContent
  style: SectionStyle
}

export function ReviewsGrid({ content, style }: ReviewsGridProps) {
  const reviews = JSON.parse((content.reviews as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">{content.title as string}</h2>
        {content.subtitle && <p className="text-center text-lg mb-12 opacity-80">{content.subtitle as string}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review: any, index: number) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-400"}>
                    ★
                  </span>
                ))}
              </div>
              <h3 className="font-semibold mb-2">{review.title}</h3>
              <p className="text-sm opacity-90 mb-4">{review.text}</p>
              <div className="flex items-center gap-3">
                <img
                  src={review.avatar || "/placeholder.svg?height=40&width=40"}
                  alt={review.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-sm">{review.name}</p>
                  <p className="text-xs opacity-70">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
