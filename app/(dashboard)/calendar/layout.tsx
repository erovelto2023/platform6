
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Briefcase, List, Clock, FileText, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CalendarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const tabs = [
        {
            name: "Overview",
            href: "/calendar",
            icon: Sparkles,
        },
        {
            name: "Services",
            href: "/calendar/services",
            icon: Briefcase,
        },
        {
            name: "Bookings",
            href: "/calendar/bookings",
            icon: List,
        },
        {
            name: "Availability",
            href: "/calendar/availability",
            icon: Clock,
        },
        {
            name: "Content",
            href: "/calendar/content",
            icon: FileText,
        },
        {
            name: "Settings",
            href: "/calendar/settings",
            icon: Settings,
        },
    ];

    return (
        <div className="min-h-screen bg-[#07091B] font-sans relative overflow-x-hidden">
            {/* Unified Background Ambiance */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[100px] rounded-full -ml-32 -mb-32 pointer-events-none" />

            <div className="relative z-10 p-6 lg:p-10 space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                             <span className="text-[10px] font-black uppercase tracking-[4px] text-zinc-500 italic">Central Operations</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white uppercase italic leading-none">
                            Calendar <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">& Bookings</span>
                        </h1>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-[3px] mt-2">
                            Manage your schedule, services, and strategic availability.
                        </p>
                    </div>
                </div>

                {/* High-Fidelity Tabs Interface */}
                <div className="flex items-center gap-1 p-1.5 bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-2xl rounded-2xl w-fit shadow-2xl">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link key={tab.href} href={tab.href}>
                                <div className={cn(
                                    "flex items-center gap-3 px-6 py-3 rounded-xl transition-all group relative cursor-pointer",
                                    isActive 
                                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]"
                                )}>
                                    <tab.icon className={cn(
                                        "h-4 w-4 transition-transform",
                                        isActive ? "scale-110" : "group-hover:scale-110"
                                    )} />
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                        {tab.name}
                                    </span>
                                    {isActive && (
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-white rounded-full' shadow-[0_0_10px_white]" />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Content Workspace */}
                <div className="animate-in fade-in slide-in-from-bottom duration-700">
                    {children}
                </div>
            </div>
        </div>
    );
}
