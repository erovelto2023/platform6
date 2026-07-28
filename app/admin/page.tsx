import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    BookOpen,
    Compass,
    FileStack,
    FileText,
    Library,
    FolderOpen,
    Sparkles,
    TrendingUp,
    Users,
    FileCode,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    Calendar,
    FileQuestion,
    ShoppingBag,
    Link as LinkIcon,
    Layers,
    Tag,
    Wrench,
    HelpCircle,
    Film,
    Megaphone,
    Activity,
    Plus,
    ShieldCheck,
    Cpu,
    Zap,
    ExternalLink
} from "lucide-react";
import Link from "next/link";
import { getDashboardStats, getAdminContentData } from "@/lib/actions/dashboard.actions";
import { getTicketCount } from "@/lib/actions/ticket.actions";
import { syncCurrentUser } from "@/lib/actions/user.actions";

export default async function AdminDashboardPage() {
    // Parallelize all server data requests for performance optimization
    const [, stats, ticketCount, contentData] = await Promise.all([
        syncCurrentUser(),
        getDashboardStats(),
        getTicketCount(),
        getAdminContentData()
    ]);

    const contentCounts = "error" in contentData ? { announcements: 0, events: 0, assignments: 0 } : {
        announcements: contentData.announcements.length,
        events: contentData.events.length,
        assignments: contentData.assignments.length,
    };

    const categories = [
        {
            title: "ScalePlus AI & Marketing Engine",
            description: "Automate copywriting, funnels, page creation, and marketing campaigns.",
            gradient: "from-violet-500/20 to-indigo-500/10",
            borderColor: "border-violet-500/30",
            badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
            tools: [
                {
                    title: "Campaign Manager",
                    description: "End-to-end ad builder, DAM, pixel checklist, and 18 marketing tools",
                    href: "/admin/click-campaigns",
                    icon: Megaphone,
                    color: "text-violet-400",
                    bg: "bg-violet-500/10 border-violet-500/20",
                    hover: "group-hover:border-violet-500/50 group-hover:bg-violet-500/20"
                },
                {
                    title: "Swipe File Vault",
                    description: "Proven ad copy hooks, frameworks, and AI Co-Pilot copy generator",
                    href: "/admin/click-campaigns?tab=swipe",
                    icon: BookOpen,
                    color: "text-purple-400",
                    bg: "bg-purple-500/10 border-purple-500/20",
                    hover: "group-hover:border-purple-500/50 group-hover:bg-purple-500/20"
                },
                {
                    title: "Recommended Tools Database",
                    description: "Manage product recommendations, tools, pricing, and affiliate links",
                    href: "/admin/tools-products",
                    icon: Wrench,
                    color: "text-amber-400",
                    bg: "bg-amber-500/10 border-amber-500/20",
                    hover: "group-hover:border-amber-500/50 group-hover:bg-amber-500/20"
                },
                {
                    title: "ScalePlus AI Suite",
                    description: "Complete automated marketing suite with 22 specialized tools",
                    href: "/admin/scaleplus",
                    icon: Sparkles,
                    color: "text-violet-400",
                    bg: "bg-violet-500/10 border-violet-500/20",
                    hover: "group-hover:border-violet-500/50 group-hover:bg-violet-500/20"
                },
                {
                    title: "Puck Page Builder",
                    description: "Build landing pages visually with React blocks",
                    href: "/admin/page-builder-simple",
                    icon: FileStack,
                    color: "text-sky-400",
                    bg: "bg-sky-500/10 border-sky-500/20",
                    hover: "group-hover:border-sky-500/50 group-hover:bg-sky-500/20"
                },
                {
                    title: "Niche Business in a Box",
                    description: "Business templates and setup blueprints",
                    href: "/admin/niche-boxes",
                    icon: Compass,
                    color: "text-indigo-400",
                    bg: "bg-indigo-500/10 border-indigo-500/20",
                    hover: "group-hover:border-indigo-500/50 group-hover:bg-indigo-500/20"
                }
            ]
        },
        {
            title: "Publishing & Knowledge Base",
            description: "Manage articles, blog posts, glossary pages, and library references.",
            gradient: "from-blue-500/20 to-cyan-500/10",
            borderColor: "border-blue-500/30",
            badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
            tools: [
                {
                    title: "Blog & Content",
                    description: "Publish articles and manage news feeds",
                    href: "/admin/blog",
                    icon: FileText,
                    color: "text-blue-400",
                    bg: "bg-blue-500/10 border-blue-500/20",
                    hover: "group-hover:border-blue-500/50 group-hover:bg-blue-500/20"
                },
                {
                    title: "Blog Analytics",
                    description: "Track visitors, reads, and user engagement metrics",
                    href: "/admin/blog/analytics",
                    icon: BarChart3,
                    color: "text-cyan-400",
                    bg: "bg-cyan-500/10 border-cyan-500/20",
                    hover: "group-hover:border-cyan-500/50 group-hover:bg-cyan-500/20"
                },
                {
                    title: "Library",
                    description: "Manage internal documentation and guides",
                    href: "/admin/docs",
                    icon: Library,
                    color: "text-indigo-400",
                    bg: "bg-indigo-500/10 border-indigo-500/20",
                    hover: "group-hover:border-indigo-500/50 group-hover:bg-indigo-500/20"
                },
                {
                    title: "Glossary",
                    description: "Manage terminology and definitions",
                    href: "/admin/glossary",
                    icon: BookOpen,
                    color: "text-violet-400",
                    bg: "bg-violet-500/10 border-violet-500/20",
                    hover: "group-hover:border-violet-500/50 group-hover:bg-violet-500/20"
                },
                {
                    title: "State & Location Facts",
                    description: "Manage official state facts, symbols, elevations, and government URLs",
                    href: "/admin/locations",
                    icon: Compass,
                    color: "text-emerald-400",
                    bg: "bg-emerald-500/10 border-emerald-500/20",
                    hover: "group-hover:border-emerald-500/50 group-hover:bg-emerald-500/20"
                },
                {
                    title: "FAQs",
                    description: "Configure search queries and database answers",
                    href: "/admin/faqs",
                    icon: HelpCircle,
                    color: "text-teal-400",
                    bg: "bg-teal-500/10 border-teal-500/20",
                    hover: "group-hover:border-teal-500/50 group-hover:bg-teal-500/20"
                }
            ]
        },
        {
            title: "LMS, Education & Community",
            description: "Configure student courses, groups, and feedback surveys.",
            gradient: "from-emerald-500/20 to-teal-500/10",
            borderColor: "border-emerald-500/30",
            badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
            tools: [
                {
                    title: "Courses",
                    description: "Create and publish educational courses",
                    href: "/admin/courses",
                    icon: BookOpen,
                    color: "text-indigo-400",
                    bg: "bg-indigo-500/10 border-indigo-500/20",
                    hover: "group-hover:border-indigo-500/50 group-hover:bg-indigo-500/20"
                },
                {
                    title: "Groups",
                    description: "Manage community discussion groups",
                    href: "/admin/groups",
                    icon: Users,
                    color: "text-emerald-400",
                    bg: "bg-emerald-500/10 border-emerald-500/20",
                    hover: "group-hover:border-emerald-500/50 group-hover:bg-emerald-500/20"
                },
                {
                    title: "Subscribers",
                    description: "Manage database profiles and mail list subscriptions",
                    href: "/admin/subscribers",
                    icon: Users,
                    color: "text-sky-400",
                    bg: "bg-sky-500/10 border-sky-500/20",
                    hover: "group-hover:border-sky-500/50 group-hover:bg-sky-500/20"
                },
                {
                    title: "Surveys",
                    description: "Collect user feedback and reviews",
                    href: "/admin/surveys",
                    icon: FileQuestion,
                    color: "text-amber-400",
                    bg: "bg-amber-500/10 border-amber-500/20",
                    hover: "group-hover:border-amber-500/50 group-hover:bg-amber-500/20"
                },
                {
                    title: "Student Content Manager",
                    description: "Manage all announcements, events & assignments",
                    href: "/admin/content",
                    icon: Megaphone,
                    color: "text-emerald-400",
                    bg: "bg-emerald-500/10 border-emerald-500/20",
                    hover: "group-hover:border-emerald-500/50 group-hover:bg-emerald-500/20"
                }
            ]
        },
        {
            title: "Sales & Operations Hub",
            description: "Manage affiliate partner programs, suppliers, and media storage.",
            gradient: "from-amber-500/20 to-orange-500/10",
            borderColor: "border-amber-500/30",
            badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
            tools: [
                {
                    title: "Affiliate CRM",
                    description: "Coordinate affiliate partner details and stats",
                    href: "/admin/affiliates",
                    icon: LinkIcon,
                    color: "text-blue-400",
                    bg: "bg-blue-500/10 border-blue-500/20",
                    hover: "group-hover:border-blue-500/50 group-hover:bg-blue-500/20"
                },
                {
                    title: "Partner Management",
                    description: "Review system affiliates and track referrals",
                    href: "/admin/partners",
                    icon: Sparkles,
                    color: "text-amber-400",
                    bg: "bg-amber-500/10 border-amber-500/20",
                    hover: "group-hover:border-amber-500/50 group-hover:bg-amber-500/20"
                },
                {
                    title: "Affiliate Catalog",
                    description: "Track central affiliate link redirects",
                    href: "/admin/affiliate-catalog",
                    icon: FileStack,
                    color: "text-sky-400",
                    bg: "bg-sky-500/10 border-sky-500/20",
                    hover: "group-hover:border-sky-500/50 group-hover:bg-sky-500/20"
                },
                {
                    title: "Wholesale Directory",
                    description: "Manage dropshipping and bulk suppliers list",
                    href: "/admin/wholesale-directory",
                    icon: ShoppingBag,
                    color: "text-cyan-400",
                    bg: "bg-cyan-500/10 border-cyan-500/20",
                    hover: "group-hover:border-cyan-500/50 group-hover:bg-cyan-500/20"
                },
                {
                    title: "Resources",
                    description: "Manage student downloadable resource files",
                    href: "/admin/resources",
                    icon: FolderOpen,
                    color: "text-amber-400",
                    bg: "bg-amber-500/10 border-amber-500/20",
                    hover: "group-hover:border-amber-500/50 group-hover:bg-amber-500/20"
                },
                {
                    title: "Media Center",
                    description: "Upload and organize internal asset libraries",
                    href: "/admin/media",
                    icon: Film,
                    color: "text-pink-400",
                    bg: "bg-pink-500/10 border-pink-500/20",
                    hover: "group-hover:border-pink-500/50 group-hover:bg-pink-500/20"
                },
                {
                    title: "Platform Tools",
                    description: "Enable or disable global site tools and features",
                    href: "/admin/tools",
                    icon: Wrench,
                    color: "text-orange-400",
                    bg: "bg-orange-500/10 border-orange-500/20",
                    hover: "group-hover:border-orange-500/50 group-hover:bg-orange-500/20"
                }
            ]
        }
    ];

    return (
        <div className="p-6 md:p-10 space-y-10 bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
            {/* Command Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
                            <ShieldCheck className="h-5 w-5 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                            Admin Command Center
                        </h1>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed max-w-2xl font-medium">
                        Centralized platform operations, analytics, LMS controls, and AI campaign management.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* System Health Indicators */}
                    <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-200">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>Systems Online</span>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-200">
                        <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                        <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    <Link 
                        href="/admin/scaleplus"
                        className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-500/20 border border-indigo-400/30"
                    >
                        <Sparkles className="h-3.5 w-3.5" /> Launch ScalePlus AI
                    </Link>
                </div>
            </div>

            {/* Top Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                {/* Total Revenue */}
                <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-300">Total Revenue</CardTitle>
                        <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <DollarSign className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="text-2xl font-black text-white tracking-tight">${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div className="flex items-center text-xs mt-2">
                            {stats.revenueGrowth >= 0 ? (
                                <div className="flex items-center text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                    <span>+{stats.revenueGrowth}%</span>
                                </div>
                            ) : (
                                <div className="flex items-center text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                                    <ArrowDownRight className="h-3 w-3 mr-0.5" />
                                    <span>{stats.revenueGrowth}%</span>
                                </div>
                            )}
                            <span className="text-slate-300 text-[11px] font-medium ml-2">vs last 30d</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Users */}
                <Link href="/admin/subscribers" className="block cursor-pointer">
                    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300 h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-300">Total Users</CardTitle>
                            <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <Users className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="text-2xl font-black text-white tracking-tight">{stats.totalUsers.toLocaleString()}</div>
                            <div className="flex items-center text-xs mt-2">
                                {stats.userGrowth >= 0 ? (
                                    <div className="flex items-center text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                        <span>+{stats.userGrowth}%</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                                        <ArrowDownRight className="h-3 w-3 mr-0.5" />
                                        <span>{stats.userGrowth}%</span>
                                    </div>
                                )}
                                <span className="text-slate-300 text-[11px] font-medium ml-2">vs last 30d</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* Active Users */}
                <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl relative overflow-hidden group hover:border-sky-500/40 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-300">Active (30d)</CardTitle>
                        <div className="h-8 w-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                            <TrendingUp className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="text-2xl font-black text-white tracking-tight">{stats.activeUsers.toLocaleString()}</div>
                        <div className="flex items-center text-xs mt-2">
                            {stats.activeGrowth >= 0 ? (
                                <div className="flex items-center text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                    <span>+{stats.activeGrowth}%</span>
                                </div>
                            ) : (
                                <div className="flex items-center text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                                    <ArrowDownRight className="h-3 w-3 mr-0.5" />
                                    <span>{stats.activeGrowth}%</span>
                                </div>
                            )}
                            <span className="text-slate-300 text-[11px] font-medium ml-2">vs last 30d</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Content Items */}
                <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl relative overflow-hidden group hover:border-violet-500/40 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-300">Total Assets</CardTitle>
                        <div className="h-8 w-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                            <FileCode className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="text-2xl font-black text-white tracking-tight">{stats.totalContent.toLocaleString()}</div>
                        <div className="flex items-center text-xs mt-2">
                            {stats.contentGrowth >= 0 ? (
                                <div className="flex items-center text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                    <span>+{stats.contentGrowth}%</span>
                                </div>
                            ) : (
                                <div className="flex items-center text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                                    <ArrowDownRight className="h-3 w-3 mr-0.5" />
                                    <span>{stats.contentGrowth}%</span>
                                </div>
                            )}
                            <span className="text-slate-300 text-[11px] font-medium ml-2">vs last 30d</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Support Tickets */}
                <Link href="/admin/tickets" className="block cursor-pointer">
                    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300 h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-300">Support Tickets</CardTitle>
                            <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                <FileQuestion className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="text-2xl font-black text-white tracking-tight">{ticketCount.toLocaleString()}</div>
                            <p className="text-[11px] text-slate-300 mt-2 font-medium">
                                Total active & resolved
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Student Dashboard Content Hub */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Megaphone className="h-4 w-4 text-emerald-400" />
                            Student Dashboard Content Hub
                        </h2>
                        <p className="text-xs text-slate-300 mt-0.5 font-medium">Quick status of live announcements, events, and course assignments.</p>
                    </div>
                    <Link href="/admin/content" className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl transition-all">
                        <span>Manage All Content</span>
                        <ExternalLink className="w-3 h-3" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Link href="/admin/content" className="block group">
                        <Card className="bg-slate-900/60 border-slate-800 hover:border-emerald-500/40 transition-all duration-300 backdrop-blur-xl">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="text-3xl font-black text-emerald-400 tracking-tight">{contentCounts.announcements}</div>
                                    <p className="text-xs font-black text-slate-200 uppercase tracking-wider">Active Announcements</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                                    <Megaphone className="w-6 h-6" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/content" className="block group">
                        <Card className="bg-slate-900/60 border-slate-800 hover:border-amber-500/40 transition-all duration-300 backdrop-blur-xl">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="text-3xl font-black text-amber-400 tracking-tight">{contentCounts.events}</div>
                                    <p className="text-xs font-black text-slate-200 uppercase tracking-wider">Scheduled Events</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                                    <Calendar className="w-6 h-6" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/content" className="block group">
                        <Card className="bg-slate-900/60 border-slate-800 hover:border-indigo-500/40 transition-all duration-300 backdrop-blur-xl">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="text-3xl font-black text-indigo-400 tracking-tight">{contentCounts.assignments}</div>
                                    <p className="text-xs font-black text-slate-200 uppercase tracking-wider">Active Assignments</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                                    <FileText className="w-6 h-6" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>

            {/* Quick Content Breakdown Grid */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-sky-400" />
                    Platform Asset Metrics
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { label: "Affiliates", count: stats.breakdown.affiliatePartners, color: "text-blue-400", border: "border-blue-500/20" },
                        { label: "Courses", count: stats.breakdown.courses, color: "text-indigo-400", border: "border-indigo-500/20" },
                        { label: "Groups", count: stats.breakdown.groups, color: "text-emerald-400", border: "border-emerald-500/20" },
                        { label: "Active Surveys", count: stats.breakdown.surveys, color: "text-amber-400", border: "border-amber-500/20" },
                        { label: "Suppliers", count: stats.breakdown.wholesaleSuppliers, color: "text-cyan-400", border: "border-cyan-500/20" },
                        { label: "Resources", count: stats.breakdown.resources, color: "text-violet-400", border: "border-violet-500/20" },
                    ].map((item, i) => (
                        <Card key={i} className={`bg-slate-900/60 border ${item.border} backdrop-blur-xl hover:bg-slate-900/90 transition-colors`}>
                            <CardContent className="p-4 text-center">
                                <div className={`text-2xl font-black ${item.color}`}>{item.count}</div>
                                <p className="text-[11px] font-black text-slate-200 uppercase tracking-wider mt-1">{item.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Categorized Management Portals */}
            <div className="space-y-6">
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                    <Layers className="h-5 w-5 text-indigo-400" />
                    Management Portals & Tools
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {categories.map((category) => (
                        <Card key={category.title} className={`border ${category.borderColor} bg-slate-900/60 backdrop-blur-xl overflow-hidden flex flex-col`}>
                            <CardHeader className={`bg-gradient-to-r ${category.gradient} p-5 border-b border-slate-800/80 flex flex-row items-center justify-between`}>
                                <div>
                                    <CardTitle className="text-base font-bold text-white">{category.title}</CardTitle>
                                    <CardDescription className="text-xs text-slate-200 mt-0.5 font-medium">{category.description}</CardDescription>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${category.badgeColor}`}>
                                    {category.tools.length} Tools
                                </span>
                            </CardHeader>
                            <CardContent className="p-5 flex-1 space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    {category.tools.map((tool) => (
                                        <Link href={tool.href} key={tool.title} className="block h-full group">
                                            <div className="h-full border border-slate-800/80 bg-slate-950/60 hover:bg-slate-900 rounded-2xl p-4 flex items-start gap-3.5 transition-all duration-200">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${tool.bg} ${tool.hover}`}>
                                                    <tool.icon className={`h-5 w-5 ${tool.color}`} />
                                                </div>
                                                <div className="space-y-0.5 min-w-0">
                                                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">{tool.title}</h4>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2 font-normal">{tool.description}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
