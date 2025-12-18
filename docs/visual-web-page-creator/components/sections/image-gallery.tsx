import type { SectionContent, SectionStyle } from "@/lib/types"

interface ImageGalleryProps {
  content: SectionContent
  style: SectionStyle
}

export function ImageGallery({ content, style }: ImageGalleryProps) {
  const images = JSON.parse((content.images as string) || "[]")

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">{content.title as string}</h2>
        <p className="text-xl text-center mb-12 opacity-80">{content.subtitle as string}</p>

        <div className="grid md:grid-cols-3 gap-4">
          {images.map((image: any, index: number) => (
            <div key={index} className="relative group overflow-hidden rounded-lg aspect-square bg-gray-800">
              <img
                src={image.url || `/placeholder.svg?height=400&width=400&query=${image.title}`}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold mb-2">{image.title}</div>
                  <div className="text-sm opacity-90">{image.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
