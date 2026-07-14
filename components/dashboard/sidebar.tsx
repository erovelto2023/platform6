"use client";

import { useState, useEffect } from "react";
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
    Search,
    Link as LinkIcon,
    FileQuestion,
    ShoppingBag,
    MessageSquare,
    Library,
    Wrench,
    PenTool,
    Film,
    Tag,
    FolderOpen,
    MapPin,
    Briefcase,
    GraduationCap,
    ChevronDown
} from "lucide-react";
import { useSidebarStore } from "@/hooks/use-sidebar-store";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItem {
    label: string;
    href: string;
    icon: any;
    color: string;
}

interface SidebarGroup {
    id: string;
    label: string;
    icon: any;
    color: string;
    items: SidebarItem[];
}

const groups: SidebarGroup[] = [
    {
        id: "business-tools",
        label: "Business Tools",
        icon: Briefcase,
        color: "text-orange-500",
        items: [
            {
                label: "Accounting",
                icon: BarChart3,
                href: "/accounting",
                color: "text-green-600",
            },
            {
                label: "Affiliate CRM",
                icon: LinkIcon,
                href: "/affiliates",
                color: "text-blue-500",
            },
            {
                label: "Wholesale Directory",
                icon: FolderOpen,
                href: "/tools/wholesale-directory",
                color: "text-amber-500",
            },
            {
                label: "Niches in a Box",
                icon: Compass,
                href: "/niche-boxes",
                color: "text-indigo-400",
            }
        ]
    },
    {
        id: "writing-tools",
        label: "Writing Tools",
        icon: PenTool,
        color: "text-amber-500",
        items: [
            {
                label: "Story Hacker",
                icon: PenTool,
                href: "/story-hacker",
                color: "text-amber-500",
            },
            {
                label: "Whiteboard",
                icon: FileText,
                href: "/whiteboard",
                color: "text-indigo-500",
            },
            {
                label: "Workbook Designer",
                icon: BookOpen,
                href: "/tools/workbook-designer",
                color: "text-violet-500",
            },
            {
                label: "Design Editor",
                icon: Film,
                href: "/tools/design-editor",
                color: "text-pink-500",
            }
        ]
    },
    {
        id: "community-tools",
        label: "Community Tools",
        icon: Users,
        color: "text-emerald-500",
        items: [
            {
                label: "Community",
                icon: Users,
                href: "/community",
                color: "text-emerald-500",
            },
            {
                label: "Member Search",
                icon: Search,
                href: "/community/members?sort=relevance",
                color: "text-emerald-500",
            },
            {
                label: "Library",
                icon: Library,
                href: "/docs",
                color: "text-blue-600",
            },
            {
                label: "Messages",
                icon: MessageSquare,
                href: "/messages",
                color: "text-blue-500",
            },
            {
                label: "Tickets",
                icon: FileQuestion,
                href: "/tickets",
                color: "text-rose-500",
            },
            {
                label: "Affiliate / Partner",
                icon: Sparkles,
                href: "/partner",
                color: "text-amber-400",
            }
        ]
    },
    {
        id: "research-education",
        label: "Research and Education",
        icon: GraduationCap,
        color: "text-violet-500",
        items: [
            {
                label: "Browse Courses",
                icon: BookOpen,
                href: "/catalog",
                color: "text-violet-500",
            },
            {
                label: "Glossary",
                icon: BookOpen,
                href: "/glossary",
                color: "text-teal-600",
            },
            {
                label: "Resources",
                icon: Library,
                href: "/resources",
                color: "text-blue-500",
            },
            {
                label: "Locations",
                icon: MapPin,
                href: "/locations",
                color: "text-emerald-400",
            }
        ]
    }
];

const adminRoutes = [
    {
        label: "Overview",
        icon: LayoutDashboard,
        href: "/admin",
        color: "text-sky-500",
    },
    {
        label: "ScalePlus AI Suite",
        icon: Sparkles,
        href: "/admin/scaleplus",
        color: "text-violet-400",
    },
    {
        label: "Publishing Admin",
        icon: ShieldCheck,
        href: "/admin/publishing",
        color: "text-amber-500",
    },
    {
        label: "Courses & LMS",
        icon: Library,
        href: "/admin/courses",
        color: "text-indigo-400",
    },
    {
        label: "Community Groups",
        icon: Users,
        href: "/admin/groups",
        color: "text-emerald-500",
    },
    {
        label: "Subscribers",
        icon: Users,
        href: "/admin/subscribers",
        color: "text-sky-400",
    },
    {
        label: "Support Tickets",
        icon: FileQuestion,
        href: "/admin/tickets",
        color: "text-rose-400",
    },
    {
        label: "Affiliate CRM",
        icon: LinkIcon,
        href: "/admin/affiliates",
        color: "text-blue-400",
    },
    {
        label: "Partner Management",
        icon: Sparkles,
        href: "/admin/partners",
        color: "text-amber-400",
    },
    {
        label: "Affiliate Catalog",
        icon: FileStack,
        href: "/admin/affiliate-catalog",
        color: "text-blue-300",
    },
    {
        label: "Blog & Content",
        icon: FileText,
        href: "/admin/blog",
        color: "text-indigo-500",
    },
    {
        label: "FAQs",
        icon: FileQuestion,
        href: "/admin/faqs",
        color: "text-teal-400",
    },
    {
        label: "Glossary",
        icon: BookOpen,
        href: "/admin/glossary",
        color: "text-violet-500",
    },
    {
        label: "Media Center",
        icon: Film,
        href: "/admin/media",
        color: "text-pink-400",
    },
    {
        label: "Link Checker",
        icon: LinkIcon,
        href: "/admin/link-checker",
        color: "text-cyan-400",
    },
    {
        label: "Platform Tools",
        icon: Wrench,
        href: "/admin/tools",
        color: "text-orange-500",
    },
    {
        label: "Exit Admin",
        icon: LogOut,
        href: "/dashboard",
        color: "text-red-500",
    },
];

interface SidebarProps {
    userRole?: string | null;
}

export const Sidebar = ({ userRole }: SidebarProps) => {
    const pathname = usePathname();
    const isCurrentlyInAdmin = pathname?.startsWith("/admin");
    const isActuallyAdmin = userRole === 'admin';
    const { isCollapsed, toggle, expand } = useSidebarStore();

    // Accordion group states
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        "business-tools": false,
        "writing-tools": false,
        "community-tools": false,
        "research-education": false,
    });

    const toggleSection = (id: string) => {
        if (isCollapsed) {
            expand();
            setOpenSections((prev) => ({
                ...prev,
                [id]: true,
            }));
        } else {
            setOpenSections((prev) => ({
                ...prev,
                [id]: !prev[id],
            }));
        }
    };

    // Auto-open active section on mount / route change
    useEffect(() => {
        if (pathname) {
            const path = pathname.split('?')[0];
            if (["/accounting", "/affiliates", "/tools/wholesale-directory", "/niche-boxes"].some(p => path === p || path.startsWith(p + "/"))) {
                setOpenSections(prev => ({ ...prev, "business-tools": true }));
            } else if (["/story-hacker", "/whiteboard", "/tools/workbook-designer", "/tools/design-editor"].some(p => path === p || path.startsWith(p + "/"))) {
                setOpenSections(prev => ({ ...prev, "writing-tools": true }));
            } else if (["/community", "/docs", "/messages", "/tickets", "/partner"].some(p => path === p || path.startsWith(p + "/"))) {
                setOpenSections(prev => ({ ...prev, "community-tools": true }));
            } else if (["/catalog", "/glossary", "/resources", "/locations"].some(p => path === p || path.startsWith(p + "/"))) {
                setOpenSections(prev => ({ ...prev, "research-education": true }));
            }
        }
    }, [pathname]);

    const isActive = (href: string) => {
        const basePath = href.split('?')[0];
        if (basePath === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname === basePath || pathname?.startsWith(basePath + "/");
    };

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white relative">
            <div className="px-3 py-2 flex-1 overflow-y-auto">
                <Link href="/dashboard" className={cn("flex items-center mb-14 transition-all duration-300", isCollapsed ? "justify-center pl-0" : "pl-3")}>
                    <div className={cn("relative transition-all duration-300", isCollapsed ? "w-10 h-10 mr-0" : "w-8 h-8 mr-4")}>
                        <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-700 rounded-lg flex items-center justify-center font-bold text-lg">K</div>
                    </div>
                    {!isCollapsed && (
                        <h1 className="text-2xl font-bold whitespace-nowrap overflow-hidden transition-all duration-300">
                            K Academy
                        </h1>
                    )}
                </Link>

                <div className="space-y-2">
                    {/* Admin Dashboard Sidebar View */}
                    {isCurrentlyInAdmin && isActuallyAdmin ? (
                        <div className="space-y-1">
                            {adminRoutes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className={cn(
                                        "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                        isActive(route.href) ? "text-white bg-white/10" : "text-zinc-400",
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
                    ) : (
                        /* Standard Collapsible Accordion view */
                        <div className="space-y-1">
                            {/* Dashboard Direct Link */}
                            <Link
                                href="/dashboard"
                                className={cn(
                                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                    isActive("/dashboard") ? "text-white bg-white/10" : "text-zinc-400",
                                    isCollapsed && "justify-center px-2"
                                )}
                                title={isCollapsed ? "Dashboard" : undefined}
                            >
                                <div className={cn("flex items-center flex-1", isCollapsed && "justify-center flex-none")}>
                                    <LayoutDashboard className={cn("h-5 w-5 text-sky-500", isCollapsed ? "mr-0" : "mr-3")} />
                                    {!isCollapsed && "Dashboard"}
                                </div>
                            </Link>

                            {/* Accordion Groups */}
                            {groups.map((group) => {
                                const isOpen = openSections[group.id];
                                const isAnyChildActive = group.items.some(item => isActive(item.href));
                                
                                return (
                                    <div key={group.id} className="space-y-1">
                                        <button
                                            onClick={() => toggleSection(group.id)}
                                            className={cn(
                                                "w-full text-sm group flex p-3 justify-between items-center font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition text-zinc-400",
                                                isCollapsed ? "justify-center px-2" : "text-left",
                                                isAnyChildActive && "text-white"
                                            )}
                                            title={isCollapsed ? group.label : undefined}
                                        >
                                            <div className={cn("flex items-center flex-1", isCollapsed && "justify-center flex-none")}>
                                                <group.icon className={cn("h-5 w-5", group.color, isCollapsed ? "mr-0" : "mr-3")} />
                                                {!isCollapsed && (
                                                    <span className="font-semibold text-zinc-300 group-hover:text-white transition">
                                                        {group.label}
                                                    </span>
                                                )}
                                            </div>
                                            {!isCollapsed && (
                                                <ChevronDown
                                                    className={cn(
                                                        "h-4 w-4 transition-transform duration-200 text-zinc-500 group-hover:text-white",
                                                        isOpen && "rotate-180"
                                                    )}
                                                />
                                            )}
                                        </button>

                                        {/* Sub-items list */}
                                        <div
                                            className={cn(
                                                "overflow-hidden transition-all duration-300 ease-in-out",
                                                (isOpen && !isCollapsed) ? "max-h-[400px] opacity-100 pl-4 space-y-0.5" : "max-h-0 opacity-0 pointer-events-none"
                                            )}
                                        >
                                            {group.items.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={cn(
                                                        "text-xs group flex p-2 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/5 rounded-lg transition",
                                                        isActive(item.href) ? "text-white bg-white/10 font-semibold" : "text-zinc-400"
                                                    )}
                                                >
                                                    <div className="flex items-center flex-1">
                                                        <item.icon className={cn("h-4 w-4 mr-3 shrink-0", item.color)} />
                                                        <span className="truncate">{item.label}</span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Admin Direct Link (only if admin user) */}
                            {isActuallyAdmin && (
                                <Link
                                    href="/admin"
                                    className={cn(
                                        "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition mt-4 border-t border-white/5 pt-4",
                                        isActive("/admin") ? "text-white bg-white/10" : "text-zinc-400",
                                        isCollapsed && "justify-center px-2"
                                    )}
                                    title={isCollapsed ? "Admin" : undefined}
                                >
                                    <div className={cn("flex items-center flex-1", isCollapsed && "justify-center flex-none")}>
                                        <ShieldCheck className={cn("h-5 w-5 text-orange-700", isCollapsed ? "mr-0" : "mr-3")} />
                                        {!isCollapsed && "Admin"}
                                    </div>
                                </Link>
                            )}
                        </div>
                    )}
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
