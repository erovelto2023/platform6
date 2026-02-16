
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, List, Clock, Briefcase } from "lucide-react";
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
            icon: CalendarIcon,
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
    ];

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Calendar & Bookings</h1>
                <p className="text-muted-foreground">Manage your schedule, services, and availability.</p>
            </div>

            <div className="flex space-x-1 border-b border-slate-200">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    return (
                        <Link key={tab.href} href={tab.href}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "rounded-none border-b-2 border-transparent px-4 py-2 hover:bg-transparent hover:text-slate-900",
                                    isActive && "border-slate-900 text-slate-900 font-medium"
                                )}
                            >
                                <tab.icon className="mr-2 h-4 w-4" />
                                {tab.name}
                            </Button>
                        </Link>
                    );
                })}
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                {children}
            </div>
        </div>
    );
}
