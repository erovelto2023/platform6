import type { SectionContent, SectionStyle } from "@/lib/types"

interface BlogGridProps {
  content: SectionContent
  style: SectionStyle
}

export function BlogGrid({ content, style }: BlogGridProps) {
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
        <h2 className="text-4xl font-bold text-center mb-4">{content.title as string}</h2>
        <p className="text-xl text-center mb-12 opacity-80">{content.subtitle as string}</p>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post: any, index: number) => (
            <article key={index} className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                <img
                  src={post.image || `/placeholder.svg?height=300&width=400&query=${post.title}`}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="text-sm opacity-60 mb-2">
                  {post.date} • {post.category}
                </div>
                <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                <p className="opacity-80 mb-4">{post.excerpt}</p>
                <a href={post.link} className="text-blue-400 hover:text-blue-300 font-semibold">
                  Read More →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
