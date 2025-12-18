"use client"

import { useState, useEffect } from "react"
import type { SectionContent, SectionStyle } from "@/lib/types"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StickyHeaderProps {
  content: SectionContent
  style: SectionStyle
}

export function StickyHeader({ content, style }: StickyHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const navItems = JSON.parse((content.navItems as string) || "[]")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "shadow-md" : ""}`}
      style={{
        backgroundColor: isScrolled ? style.backgroundColor : "transparent",
        color: style.textColor,
        padding: isScrolled ? "0.75rem 1.5rem" : style.padding,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold">{content.brandName as string}</div>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item: any, index: number) => (
            <a
              key={index}
              href={item.url}
              className="hover:opacity-80 transition-opacity"
              style={{ color: style.textColor }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            {content.ctaText as string}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
          </Button>
        </div>
      </div>
    </header>
  )
}
