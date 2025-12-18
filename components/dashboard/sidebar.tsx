"use client";

import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Compass,
    BookOpen,
    Settings,
    ShieldCheck,
    LogOut,
    ChevronLeft,
    ChevronRight,
    FileText,
    FileStack,
    Sparkles,
    BarChart3,
    Users,
    Calendar,
    Search,
    Link as LinkIcon,
    FileQuestion,
    ShoppingBag
} from "lucide-react";
import { useSidebarStore } from "@/hooks/use-sidebar-store";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
    },
    {
        label: "Community",
        icon: Users,
        href: "/community",
        color: "text-emerald-500",
    },
    {
        label: "Member Search",
        icon: Search,
        href: "/community/members",
        color: "text-emerald-500",
    },
    {
        label: "Browse Courses",
        icon: BookOpen,
        href: "/catalog",
        color: "text-violet-500",
    },
    {
        label: "Niche Business in a Box",
        icon: Compass,
        href: "/niche-catalog",
        color: "text-pink-700",
    },
    {
        label: "Tools",
        icon: Settings, // Placeholder icon
        href: "/tools",
        color: "text-gray-500",
    },
    {
        label: "Knowledge Base",
        icon: BookOpen, // Placeholder icon
        href: "/knowledge-base",
        color: "text-yellow-500",
    },
    {
        label: "Resources",
        icon: BookOpen, // Placeholder icon
        href: "/resources",
        color: "text-blue-500",
    },
    {
        label: "Affiliate CRM",
        icon: LinkIcon,
        href: "/affiliates",
        color: "text-blue-500",
    },
    {
        label: "Admin",
        icon: ShieldCheck,
        href: "/admin",
        color: "text-orange-700",
    },
];

const adminRoutes = [
    {
        label: "Overview",
        icon: LayoutDashboard,
        href: "/admin",
        color: "text-sky-500",
    },
    {
        label: "Affiliate CRM",
        icon: LinkIcon,
        href: "/admin/affiliates",
        color: "text-blue-500",
    },
    {
        label: "Courses",
        icon: BookOpen,
        href: "/admin/courses",
        color: "text-violet-500",
    },
    {
        label: "Niche Business in a Box",
        icon: Compass,
        href: "/admin/niche-boxes",
        color: "text-pink-700",
    },
    {
        label: "Knowledge Base",
        icon: BookOpen,
        href: "/admin/knowledge-base",
        color: "text-yellow-500",
    },
    {
        label: "Resources",
        icon: BookOpen,
        href: "/admin/resources",
        color: "text-blue-500",
    },
    {
        label: "Blog",
        icon: FileText,
        href: "/admin/blog",
        color: "text-indigo-500",
    },
    {
        label: "Page Builder",
        icon: FileStack,
        href: "/admin/page-builder",
        color: "text-purple-500",
    },

    {
        label: "BrandBaser",
        icon: Sparkles,
        href: "/admin/brand-baser",
        color: "text-violet-500",
    },
    {
        label: "Content Templates",
        icon: FileText,
        href: "/admin/content-templates",
        color: "text-pink-500",
    },
    {
        label: "Section Templates",
        icon: LayoutDashboard,
        href: "/admin/section-templates",
        color: "text-indigo-500",
    },
    {
        label: "Blog Analytics",
        icon: BarChart3,
        href: "/admin/blog/analytics",
        color: "text-cyan-500",
    },
    {
        label: "Events",
        icon: Calendar,
        href: "/admin/events",
        color: "text-rose-500",
    },
    {
        label: "Groups",
        icon: Users,
        href: "/admin/groups",
        color: "text-emerald-500",
    },
    {
        label: "Surveys",
        icon: FileQuestion,
        href: "/admin/surveys",
        color: "text-orange-500",
    },
    {
        label: "Wholesale Dir.",
        icon: ShoppingBag,
        href: "/admin/wholesale-directory",
        color: "text-cyan-500",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings/ai",
        color: "text-gray-500",
    },
    {
        label: "Exit Admin",
        icon: LogOut,
        href: "/dashboard",
        color: "text-red-500",
    },
];

export const Sidebar = () => {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");
    const currentRoutes = isAdmin ? adminRoutes : routes;
    const { isCollapsed, toggle } = useSidebarStore();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white relative">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className={cn("flex items-center mb-14 transition-all duration-300", isCollapsed ? "justify-center pl-0" : "pl-3")}>
                    <div className={cn("relative transition-all duration-300", isCollapsed ? "w-10 h-10 mr-0" : "w-8 h-8 mr-4")}>
                        {/* Logo placeholder */}
                        <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-700 rounded-lg flex items-center justify-center font-bold text-lg">K</div>
                    </div>
                    {!isCollapsed && (
                        <h1 className="text-2xl font-bold whitespace-nowrap overflow-hidden transition-all duration-300">
                            K Academy
                        </h1>
                    )}
                </Link>
                <div className="space-y-1">
                    {currentRoutes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
                                isCollapsed && "justify-center px-2"
                            )}
                            title={isCollapsed ? route.label : undefined}
                        >
                            <div className={cn("flex items-center flex-1", isCollapsed && "justify-center flex-none")}>
                                <route.icon className={cn("h-5 w-5", route.color, isCollapsed ? "mr-0" : "mr-3")} />
                                {!isCollapsed && route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Collapse Toggle Button */}
            <div className="px-3 py-2 border-t border-white/10">
                <button
                    onClick={toggle}
                    className={cn(
                        "flex items-center w-full p-3 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white",
                        isCollapsed ? "justify-center" : "justify-start"
                    )}
                >
                    {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5 mr-3" />}
                    {!isCollapsed && <span className="text-sm font-medium">Collapse Sidebar</span>}
                </button>
            </div>
        </div>
    );
};
