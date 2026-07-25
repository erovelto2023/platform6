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
    ChevronDown,
    Megaphone,
    Layers,
    Globe
} from "lucide-react";
import { useSidebarStore } from "@/hooks/use-sidebar-store";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { BouncyAccordion, BouncyAccordionItem } from "@/components/motion/bouncy-accordion";
import { MagneticButton } from "@/components/motion/button/magnetic";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

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
            { label: "Accounting", icon: BarChart3, href: "/accounting", color: "text-green-600" },
            { label: "Affiliate CRM", icon: LinkIcon, href: "/affiliates", color: "text-blue-500" },
            { label: "Swipe File Vault", icon: BookOpen, href: "/admin/click-campaigns?tab=swipe", color: "text-purple-400" },
            { label: "Wholesale Directory", icon: FolderOpen, href: "/tools/wholesale-directory", color: "text-amber-500" },
            { label: "Niches in a Box", icon: Compass, href: "/niche-boxes", color: "text-indigo-400" }
        ]
    },
    {
        id: "writing-tools",
        label: "Writing Tools",
        icon: PenTool,
        color: "text-amber-500",
        items: [
            { label: "Story Hacker", icon: PenTool, href: "/story-hacker", color: "text-amber-500" },
            { label: "Whiteboard", icon: FileText, href: "/whiteboard", color: "text-indigo-500" },
            { label: "Workbook Designer", icon: BookOpen, href: "/tools/workbook-designer", color: "text-violet-500" },
            { label: "Design Editor", icon: Film, href: "/tools/design-editor", color: "text-pink-500" }
        ]
    },
    {
        id: "community-tools",
        label: "Community Tools",
        icon: Users,
        color: "text-emerald-500",
        items: [
            { label: "Community", icon: Users, href: "/community", color: "text-emerald-500" },
            { label: "Member Search", icon: Search, href: "/community/members?sort=relevance", color: "text-emerald-500" },
            { label: "Library", icon: Library, href: "/docs", color: "text-blue-600" },
            { label: "Messages", icon: MessageSquare, href: "/messages", color: "text-blue-500" },
            { label: "Tickets", icon: FileQuestion, href: "/tickets", color: "text-rose-500" },
            { label: "Affiliate / Partner", icon: Sparkles, href: "/partner", color: "text-amber-400" }
        ]
    },
    {
        id: "research-education",
        label: "Research and Education",
        icon: GraduationCap,
        color: "text-violet-500",
        items: [
            { label: "Browse Courses", icon: BookOpen, href: "/catalog", color: "text-violet-500" },
            { label: "Glossary", icon: BookOpen, href: "/glossary", color: "text-teal-600" },
            { label: "Resources", icon: Library, href: "/resources", color: "text-blue-500" },
            { label: "Locations", icon: MapPin, href: "/locations", color: "text-emerald-400" }
        ]
    }
];

const adminGroups: SidebarGroup[] = [
    {
        id: "admin-business-tools",
        label: "Business Tools",
        icon: Briefcase,
        color: "text-orange-500",
        items: [
            { label: "Affiliate CRM", icon: LinkIcon, href: "/admin/affiliates", color: "text-blue-400" },
            { label: "Affiliate Catalog", icon: FileStack, href: "/admin/affiliate-catalog", color: "text-blue-300" },
            { label: "Campaign Manager", icon: Sparkles, href: "/admin/click-campaigns", color: "text-violet-400" },
            { label: "Swipe File Vault", icon: BookOpen, href: "/admin/click-campaigns?tab=swipe", color: "text-purple-400" },
            { label: "Media Center", icon: Film, href: "/admin/media", color: "text-pink-400" },
            { label: "Partner Management", icon: Sparkles, href: "/admin/partners", color: "text-amber-400" },
            { label: "Platform Tools", icon: Wrench, href: "/admin/tools", color: "text-orange-500" },
            { label: "Recommended Tools Database", icon: Wrench, href: "/admin/tools-products", color: "text-amber-400" },
            { label: "Niches in a Box", icon: Compass, href: "/admin/niche-boxes", color: "text-indigo-400" },
            { label: "Wholesale Directory", icon: FolderOpen, href: "/admin/wholesale-directory", color: "text-emerald-400" },
            { label: "Platform Analytics", icon: BarChart3, href: "/admin/analytics", color: "text-cyan-400" },
            { label: "Subscribers", icon: Users, href: "/admin/subscribers", color: "text-sky-400" },
            { label: "Support Tickets", icon: FileQuestion, href: "/admin/tickets", color: "text-rose-400" }
        ]
    },
    {
        id: "admin-education",
        label: "Education",
        icon: GraduationCap,
        color: "text-violet-500",
        items: [
            { label: "Community and Groups", icon: Users, href: "/admin/groups", color: "text-emerald-500" },
            { label: "Courses & LMS", icon: Library, href: "/admin/courses", color: "text-indigo-400" },
            { label: "Content Manager", icon: Megaphone, href: "/admin/content", color: "text-emerald-400" }
        ]
    },
    {
        id: "admin-content-creation",
        label: "Content Creation",
        icon: PenTool,
        color: "text-amber-500",
        items: [
            { label: "Blogs", icon: FileText, href: "/admin/blog", color: "text-indigo-500" },
            { label: "FAQ", icon: FileQuestion, href: "/admin/faqs", color: "text-teal-400" },
            { label: "Glossary", icon: BookOpen, href: "/admin/glossary", color: "text-violet-500" },
            { label: "Page Builder", icon: LayoutDashboard, href: "/admin/page-builder-simple", color: "text-sky-500" },
            { label: "Custom Page Types", icon: FileStack, href: "/admin/custom-pages", color: "text-rose-500" },
            { label: "Publishing Admin", icon: ShieldCheck, href: "/admin/publishing", color: "text-amber-500" },
            { label: "Resources Manager", icon: Library, href: "/admin/resources", color: "text-blue-400" },
            { label: "Surveys & Quizzes", icon: FileQuestion, href: "/admin/surveys", color: "text-purple-400" },
            { label: "Docs Admin", icon: FileText, href: "/admin/docs", color: "text-emerald-400" }
        ]
    },
    {
        id: "admin-misc-tools",
        label: "Misc Tools",
        icon: Wrench,
        color: "text-zinc-400",
        items: [
            { label: "ScalePlus AI Suite", icon: Sparkles, href: "/admin/scaleplus", color: "text-violet-400" }
        ]
    }
];

interface SidebarProps {
    userRole?: string | null;
}

export const Sidebar = ({ userRole }: SidebarProps) => {
    const pathname = usePathname();
    const isCurrentlyInAdmin = pathname?.startsWith("/admin");
    const isActuallyAdmin = userRole === 'admin';
    const { isCollapsed, toggle, expand } = useSidebarStore();
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

    // Auto-open active section on mount / route change
    useEffect(() => {
        if (pathname && !isCollapsed) {
            const path = pathname.split('?')[0];
            const currentGroups = isCurrentlyInAdmin && isActuallyAdmin ? adminGroups : groups;
            
            const activeGroup = currentGroups.find(group => 
                group.items.some(item => path === item.href || path.startsWith(item.href + "/"))
            );

            if (activeGroup) {
                setActiveAccordion(activeGroup.id);
            }
        }
    }, [pathname, isCurrentlyInAdmin, isActuallyAdmin, isCollapsed]);

    const searchParams = useSearchParams();

    const isActive = (href: string) => {
        const [basePath, queryString] = href.split('?');
        if (basePath === "/dashboard" || basePath === "/admin") {
            return pathname === basePath;
        }
        const matchesPath = pathname === basePath || pathname?.startsWith(basePath + "/");
        if (!matchesPath) return false;

        if (queryString) {
            const params = new URLSearchParams(queryString);
            for (const [key, value] of params.entries()) {
                if (searchParams?.get(key) !== value) return false;
            }
            return true;
        } else {
            const currentTab = searchParams?.get("tab");
            if (currentTab && currentTab === "swipe" && href === "/admin/click-campaigns") {
                return false;
            }
        }

        return true;
    };

    const currentGroups = isCurrentlyInAdmin && isActuallyAdmin ? adminGroups : groups;

    const accordionItems: BouncyAccordionItem[] = currentGroups.map((group) => ({
        id: group.id,
        title: <span className={cn("font-medium transition-colors hover:text-white", activeAccordion === group.id ? "text-white" : "text-zinc-400")}>{group.label}</span>,
        icon: <group.icon className={cn("w-5 h-5 transition-transform", group.color, activeAccordion === group.id && "scale-110")} />,
        description: (
            <div className="flex flex-col gap-1 pb-2">
                {group.items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                            isActive(item.href) ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <item.icon className={cn("w-4 h-4 shrink-0 transition-transform group-hover:scale-110", item.color)} />
                        <span className="text-sm font-medium truncate">{item.label}</span>
                    </Link>
                ))}
            </div>
        )
    }));

    return (
        <div className="flex flex-col h-full bg-[#050505] text-white relative border-r border-white/5 shadow-2xl">
            {/* Header / Logo */}
            <div className="px-4 py-6 border-b border-white/5">
                <Link href="/dashboard" className={cn("flex items-center transition-all duration-300", isCollapsed ? "justify-center" : "gap-4")}>
                    <div className={cn("shrink-0 relative transition-all duration-300 rounded-xl flex items-center justify-center font-black text-white bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg shadow-emerald-500/20", isCollapsed ? "w-10 h-10 text-lg" : "w-10 h-10 text-xl")}>
                        K
                    </div>
                    {!isCollapsed && (
                        <h1 className="text-xl font-bold whitespace-nowrap overflow-hidden transition-all duration-300">
                            K Academy
                        </h1>
                    )}
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-6 px-3">
                <ScrollReveal delay={0.1} y={10} blur={5}>
                    <div className="space-y-4">
                        {/* Primary Dashboard Link */}
                        <Link
                            href={isCurrentlyInAdmin && isActuallyAdmin ? "/admin" : "/dashboard"}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
                                isActive(isCurrentlyInAdmin && isActuallyAdmin ? "/admin" : "/dashboard") ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-400 hover:text-white hover:bg-white/5",
                                isCollapsed && "justify-center px-2"
                            )}
                            title={isCollapsed ? "Dashboard" : undefined}
                        >
                            <LayoutDashboard className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", isActive(isCurrentlyInAdmin && isActuallyAdmin ? "/admin" : "/dashboard") ? "text-emerald-400" : "text-emerald-500")} />
                            {!isCollapsed && <span className="font-semibold text-sm">Dashboard</span>}
                        </Link>

                        {/* Accordion Navigation (Only visible when expanded) */}
                        {!isCollapsed ? (
                            <BouncyAccordion 
                                items={accordionItems}
                                value={activeAccordion}
                                onValueChange={setActiveAccordion}
                                className="mt-4"
                                classNames={{
                                    root: "space-y-1",
                                    item: "bg-transparent",
                                    trigger: "hover:bg-white/5 rounded-2xl px-4 min-h-[50px]",
                                    content: "px-2"
                                }}
                            />
                        ) : (
                            /* Collapsed View */
                            <div className="flex flex-col gap-2 mt-4">
                                {currentGroups.map((group) => (
                                    <button
                                        key={group.id}
                                        onClick={expand}
                                        className="flex items-center justify-center p-3 rounded-2xl hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                                        title={group.label}
                                    >
                                        <group.icon className={cn("w-5 h-5", group.color)} />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Switch Context Link */}
                        {isActuallyAdmin && (
                            <div className="pt-4 mt-6 border-t border-white/5">
                                <Link
                                    href={isCurrentlyInAdmin ? "/dashboard" : "/admin"}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group hover:bg-white/5",
                                        isCollapsed && "justify-center px-2"
                                    )}
                                    title={isCollapsed ? (isCurrentlyInAdmin ? "Exit Admin" : "Admin") : undefined}
                                >
                                    {isCurrentlyInAdmin ? (
                                        <>
                                            <LogOut className="w-5 h-5 shrink-0 text-red-400 group-hover:scale-110 transition-transform" />
                                            {!isCollapsed && <span className="font-semibold text-sm text-zinc-400 group-hover:text-red-400 transition-colors">Exit Admin</span>}
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="w-5 h-5 shrink-0 text-orange-500 group-hover:scale-110 transition-transform" />
                                            {!isCollapsed && <span className="font-semibold text-sm text-zinc-400 group-hover:text-orange-400 transition-colors">Admin Dashboard</span>}
                                        </>
                                    )}
                                </Link>
                            </div>
                        )}

                        {/* Upgrade Link for Free Users */}
                        {userRole === 'free' && (
                            <div className="pt-4 mt-6 border-t border-white/5">
                                <Link
                                    href="/upgrade"
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-750 text-white shadow-lg shadow-orange-500/20",
                                        isCollapsed && "justify-center px-2"
                                    )}
                                    title={isCollapsed ? "Upgrade to Premium" : undefined}
                                >
                                    <Sparkles className="w-5 h-5 shrink-0 animate-pulse text-amber-200" />
                                    {!isCollapsed && <span className="font-bold text-sm">Upgrade to Premium</span>}
                                </Link>
                            </div>
                        )}
                    </div>
                </ScrollReveal>
            </div>

            {/* Collapse Toggle */}
            <div className="p-4 border-t border-white/5 bg-[#050505]">
                <MagneticButton
                    variant="outline"
                    className="w-full rounded-2xl border-white/5 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                    onClick={toggle}
                >
                    {isCollapsed ? <ChevronRight className="w-5 h-5" /> : (
                        <div className="flex items-center gap-2">
                            <ChevronLeft className="w-5 h-5" />
                            <span>Collapse</span>
                        </div>
                    )}
                </MagneticButton>
            </div>
            
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};
