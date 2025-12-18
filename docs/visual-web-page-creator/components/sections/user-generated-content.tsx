import type { SectionContent, SectionStyle } from "@/lib/types"

interface UserGeneratedContentProps {
  content: SectionContent
  style: SectionStyle
}

export function UserGeneratedContent({ content, style }: UserGeneratedContentProps) {
  const posts = JSON.parse((content.posts as string) || "[]")

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts.map((post: any, index: number) => (
            <div key={index} className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer">
              <img
                src={post.image || "/placeholder.svg?height=300&width=300"}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="text-white text-sm font-medium mb-1">@{post.username}</p>
                <p className="text-white/80 text-xs">{post.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
