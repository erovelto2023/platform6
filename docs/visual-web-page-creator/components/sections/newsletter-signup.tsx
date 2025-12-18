import type { SectionContent, SectionStyle } from "@/lib/types"

interface NewsletterSignupProps {
  content: SectionContent
  style: SectionStyle
}

export function NewsletterSignup({ content, style }: NewsletterSignupProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">{content.title as string}</h2>
        <p className="text-xl mb-8 opacity-80">{content.subtitle as string}</p>

        <form className="flex gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder={content.placeholder as string}
            className="flex-1 px-6 py-3 rounded-lg bg-white/10 backdrop-blur border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors whitespace-nowrap"
          >
            {content.buttonText as string}
          </button>
        </form>

        <p className="text-sm opacity-60 mt-4">{content.disclaimer as string}</p>
      </div>
    </section>
  )
}
