import type { SectionContent, SectionStyle } from "@/lib/types"

interface TestimonialsSliderProps {
  content: SectionContent
  style: SectionStyle
}

export function TestimonialsSlider({ content, style }: TestimonialsSliderProps) {
  const testimonials = JSON.parse((content.testimonials as string) || "[]")

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

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial: any, index: number) => (
            <div key={index} className="bg-white/10 backdrop-blur p-6 rounded-xl">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ★
                  </span>
                ))}
              </div>
              <p className="mb-4 italic">{testimonial.quote}</p>
              <div className="font-semibold">{testimonial.name}</div>
              <div className="text-sm opacity-70">{testimonial.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
