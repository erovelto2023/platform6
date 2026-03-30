"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const NAV_LINKS = [
    { label: "Execution Engine",  href: "/courses" },
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
        <header className="px-6 lg:px-10 h-20 flex items-center border-b border-[#bc6c25]/20 bg-[#fefae0]/80 backdrop-blur-md sticky top-0 z-50">
            {/* Logo */}
            <div className="flex items-center gap-2 font-bold text-xl text-[#283618] shrink-0">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-[#606c38] rounded-xl flex items-center justify-center text-[#fefae0] shadow-lg shadow-[#606c38]/20 transition-transform group-hover:scale-110">
                        K
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-lg font-black tracking-tight">K BUSINESS</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-70">Academy</span>
                    </div>
                </Link>
            </div>

            {/* Universal Navigation Menu */}
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
                                    ? "text-[#606c38]" 
                                    : "text-[#283618]/60 hover:text-[#606c38]"
                            )}
                        >
                            {link.label}
                            {isActive && (
                                <motion.div 
                                    layoutId="nav-underline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#606c38] rounded-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Auth Actions */}
            <div className="ml-8 flex items-center gap-4 shrink-0">
                <div className="h-6 w-px bg-[#283618]/10 hidden md:block" />
                <Link href="/sign-in" className="hidden md:block">
                    <Button variant="ghost" className="text-[#283618] font-bold hover:bg-[#606c38]/5">
                        Log In
                    </Button>
                </Link>
                <Link href="/sign-up">
                    <Button className="bg-[#606c38] hover:bg-[#283618] text-[#fefae0] px-6 h-11 rounded-xl shadow-xl shadow-[#606c38]/20 transition-all font-bold">
                        Join Now
                    </Button>
                </Link>
            </div>
        </header>
    );
}
