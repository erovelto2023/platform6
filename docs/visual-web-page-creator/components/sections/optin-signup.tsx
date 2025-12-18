import type { SectionContent, SectionStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface OptinSignupProps {
  content: SectionContent
  style: SectionStyle
}

export function OptinSignup({ content, style }: OptinSignupProps) {
  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding || "4rem 1.5rem",
      }}
    >
      <div className="container mx-auto max-w-xl text-center">
        <h2 className="text-2xl font-bold mb-3">{content.title as string}</h2>
        <p className="text-base mb-6 opacity-90">{content.description as string}</p>

        <form className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder={(content.placeholder as string) || "Enter your email"}
            className="h-12 flex-1"
          />
          <Button size="lg" className="h-12">
            {content.buttonText as string}
          </Button>
        </form>

        {content.note && <p className="text-sm mt-4 opacity-70">{content.note as string}</p>}
      </div>
    </section>
  )
}
