"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
    { label: "Courses",           href: "/courses" },
    { label: "Library",           href: "/library" },
    { label: "Resources",         href: "/business-resources" },
    { label: "Affiliate CRM",     href: "/affiliate-crm" },
    { label: "Dashboard",         href: "/dashboard" },
    { label: "Blog",              href: "/blog" },
    { label: "Glossary",          href: "/glossary" },
    { label: "Market Intelligence", href: "/locations" },
    { label: "FAQs",              href: "/questions" },
];

export function SiteHeader() {
    const pathname = usePathname();

    return (
        <header className="px-6 lg:px-10 h-16 flex items-center border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
            {/* Logo */}
            <div className="flex items-center gap-2 font-bold text-xl text-white shrink-0">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-sky-500/50">
                        K
                    </div>
                    <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent hidden sm:block">
                        K Business Academy
                    </span>
                </Link>
            </div>

            {/* Nav links — visible on large screens */}
            <nav className="ml-auto hidden lg:flex items-center gap-5">
                {NAV_LINKS.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "text-sm font-medium transition-colors whitespace-nowrap",
                            pathname === link.href || (pathname ?? "").startsWith(link.href + "/")
                                ? "text-sky-400"
                                : "text-slate-300 hover:text-white"
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>

            {/* Auth CTA */}
            <div className="ml-4 lg:ml-6 flex items-center gap-2 shrink-0">
                <Link href="/sign-in" className="hidden md:block">
                    <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
                        Log In
                    </Button>
                </Link>
                <Link href="/sign-up" className="hidden md:block">
                    <Button size="sm" className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 shadow-lg shadow-sky-500/30">
                        Get Started
                    </Button>
                </Link>
                {/* Mobile fallback */}
                <Link href="/sign-up" className="md:hidden">
                    <Button size="sm">Get Started</Button>
                </Link>
            </div>
        </header>
    );
}
