"use client";

import { LayoutDashboard, Search, Settings, FileCode, BarChart, Table, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/tools/amazon-product-engine",
    },
    {
        label: "Product Search",
        icon: Search,
        href: "/tools/amazon-product-engine/search",
    },
    {
        label: "Bulk Editor",
        icon: Table,
        href: "/tools/amazon-product-engine/bulk",
    },
    {
        label: "Link Tools",
        icon: LinkIcon,
        href: "/tools/amazon-product-engine/links",
    },
    {
        label: "Templates",
        icon: FileCode,
        href: "/tools/amazon-product-engine/templates",
    },
    {
        label: "Analytics",
        icon: BarChart,
        href: "/tools/amazon-product-engine/analytics",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/tools/amazon-product-engine/settings",
    },
];

export const Sidebar = () => {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full border-r bg-white overflow-y-auto shadow-sm">
            <div className="p-6">
                <h2 className="text-lg font-bold text-orange-600 flex items-center gap-2">
                    Amazon Engine
                </h2>
            </div>
            <div className="flex flex-col w-full">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "flex items-center gap-x-2 text-slate-500 text-sm font-medium pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
                            pathname === route.href && "text-orange-700 bg-orange-200/20 border-r-4 border-orange-700"
                        )}
                    >
                        <div className="flex items-center gap-x-2 py-4">
                            <route.icon size={22} className={cn(
                                "text-slate-500",
                                pathname === route.href && "text-orange-700"
                            )} />
                            {route.label}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
