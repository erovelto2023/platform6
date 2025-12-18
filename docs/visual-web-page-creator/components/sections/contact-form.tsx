import type { SectionContent, SectionStyle } from "@/lib/types"

interface ContactFormProps {
  content: SectionContent
  style: SectionStyle
}

export function ContactForm({ content, style }: ContactFormProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">{content.title as string}</h2>
        <p className="text-xl text-center mb-12 opacity-80">{content.subtitle as string}</p>

        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Subject</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Message</label>
            <textarea
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
          >
            {content.buttonText as string}
          </button>
        </form>
      </div>
    </section>
  )
}
