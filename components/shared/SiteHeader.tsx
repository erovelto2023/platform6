"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const NAV_LINKS = [
    { label: "Courses",  href: "/courses" },
    { label: "Answers Library",   href: "/library" },
    { label: "Infrastructure",    href: "/business-resources" },
    { label: "Curated CRM",       href: "/affiliate-crm" },
    { label: "Blog",              href: "/blog" },
    { label: "Research Database", href: "/locations" },
    { label: "Mind-Reader DB",    href: "/questions" },
];

export function SiteHeader() {
    const pathname = usePathname();

    return (
        <header className="px-6 lg:px-10 h-20 flex items-center border-b border-emerald-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            {/* Logo */}
            <div className="flex items-center gap-2 font-bold text-xl text-slate-900 shrink-0">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 transition-transform group-hover:scale-110">
                        K
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-lg font-black tracking-tight">K BUSINESS</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-70">Academy</span>
                    </div>
                </Link>
            </div>

            {/* Universal Navigation Menu - Only visible to Signed Out users */}
            <SignedOut>
                <nav className="ml-auto hidden xl:flex items-center gap-8">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href || (pathname ?? "").startsWith(link.href + "/");
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-bold transition-all relative py-2",
                                    isActive 
                                        ? "text-emerald-600" 
                                        : "text-slate-600 hover:text-emerald-600"
                                )}
                            >
                                {link.label}
                                {isActive && (
                                    <motion.div 
                                        layoutId="nav-underline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </SignedOut>

            {/* Auth Actions */}
            <div className="ml-auto flex items-center gap-4 shrink-0">
                <SignedOut>
                    <div className="h-6 w-px bg-slate-200 hidden md:block mr-4" />
                    <Link href="/sign-in" className="hidden md:block">
                        <Button variant="ghost" className="text-slate-900 font-bold hover:bg-emerald-50">
                            Log In
                        </Button>
                    </Link>
                    <Link href="/sign-up">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 h-11 rounded-xl shadow-xl shadow-emerald-200 transition-all font-bold">
                            Join Now
                        </Button>
                    </Link>
                </SignedOut>

                <SignedIn>
                    <Link href="/dashboard" className="mr-2">
                        <Button variant="ghost" className="text-emerald-600 font-bold hover:bg-emerald-50">
                            Dashboard
                        </Button>
                    </Link>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
            </div>
        </header>
    );
}
