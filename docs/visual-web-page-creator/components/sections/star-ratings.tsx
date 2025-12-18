import type { SectionContent, SectionStyle } from "@/lib/types"

interface StarRatingsProps {
  content: SectionContent
  style: SectionStyle
}

export function StarRatings({ content, style }: StarRatingsProps) {
  const ratings = JSON.parse((content.ratings as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">{content.title as string}</h2>
        {content.subtitle && <p className="text-lg mb-8 opacity-80">{content.subtitle as string}</p>}

        <div className="flex flex-wrap justify-center gap-8 items-center">
          {ratings.map((rating: any, index: number) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < rating.stars ? "text-yellow-400 text-2xl" : "text-gray-400 text-2xl"}>
                    ★
                  </span>
                ))}
              </div>
              <p className="font-semibold text-lg">{rating.platform}</p>
              <p className="text-sm opacity-70">{rating.count} reviews</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
