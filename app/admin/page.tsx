import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    LayoutTemplate,
    Link as LinkIcon,
    Layers
} from "lucide-react";
import Link from "next/link";
import { getDashboardStats } from "@/lib/actions/dashboard.actions";
import { getTicketCount } from "@/lib/actions/ticket.actions";
import { syncCurrentUser } from "@/lib/actions/user.actions";

export default async function AdminDashboardPage() {
    // Sync current user to database if they don't exist
    await syncCurrentUser();

    const stats = await getDashboardStats();
    const ticketCount = await getTicketCount();

    const adminTools = [
        {
            title: "Affiliate CRM",
            description: "Manage affiliate partners",
            href: "/admin/affiliates",
            icon: LinkIcon,
            color: "text-blue-600",
            bg: "bg-blue-100",
            hover: "group-hover:bg-blue-600"
        },
        {
            title: "Blog",
            description: "Publish posts",
            href: "/admin/blog",
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-100",
            hover: "group-hover:bg-blue-600"
        },
        {
            title: "Blog Analytics",
            description: "Track visitors",
            href: "/admin/blog/analytics",
            icon: BarChart3,
            color: "text-cyan-600",
            bg: "bg-cyan-100",
            hover: "group-hover:bg-cyan-600"
        },
        {
            title: "Content Templates",
            description: "Manage templates",
            href: "/admin/content-templates",
            icon: Layers,
            color: "text-pink-600",
            bg: "bg-pink-100",
            hover: "group-hover:bg-pink-600"
        },
        {
            title: "Courses",
            description: "Create & edit courses",
            href: "/admin/courses",
            icon: BookOpen,
            color: "text-indigo-600",
            bg: "bg-indigo-100",
            hover: "group-hover:bg-indigo-600"
        },
        {
            title: "Events",
            description: "Manage calendar",
            href: "/admin/events",
            icon: Calendar,
            color: "text-pink-600",
            bg: "bg-pink-100",
            hover: "group-hover:bg-pink-600"
        },
        {
            title: "Groups",
            description: "Community groups",
            href: "/admin/groups",
            icon: Users,
            color: "text-emerald-600",
            bg: "bg-emerald-100",
            hover: "group-hover:bg-emerald-600"
        },

        {
            title: "Niche Business in a Box",
            description: "Business blueprints",
            href: "/admin/niche-boxes",
            icon: Compass,
            color: "text-purple-600",
            bg: "bg-purple-100",
            hover: "group-hover:bg-purple-600"
        },
        {
            title: "Resources",
            description: "Downloadable files",
            href: "/admin/resources",
            icon: FolderOpen,
            color: "text-amber-600",
            bg: "bg-amber-100",
            hover: "group-hover:bg-amber-600"
        },
        {
            title: "Surveys",
            description: "User feedback",
            href: "/admin/surveys",
            icon: FileQuestion,
            color: "text-orange-600",
            bg: "bg-orange-100",
            hover: "group-hover:bg-orange-600"
        },
        {
            title: "Wholesale Directory",
            description: "Manage suppliers",
            href: "/admin/wholesale-directory",
            icon: ShoppingBag,
            color: "text-cyan-600",
            bg: "bg-cyan-100",
            hover: "group-hover:bg-cyan-600"
        },
    ];

    return (
        <div className="p-8 space-y-10 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Welcome back! Here's what's happening with your platform.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                    <Calendar className="h-4 w-4" />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Analytics Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users */}
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <Users className="h-4 w-4 text-slate-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.totalUsers.toLocaleString()}</div>
                        <div className="flex items-center text-xs mt-1">
                            {stats.userGrowth >= 0 ? (
                                <div className="flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                    <span className="font-medium">+{stats.userGrowth}%</span>
                                </div>
                            ) : (
                                <div className="flex items-center text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full">
                                    <ArrowDownRight className="h-3 w-3 mr-1" />
                                    <span className="font-medium">{stats.userGrowth}%</span>
                                </div>
                            )}
                            <span className="text-slate-500 ml-2">from last month</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Content */}
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total Content</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <FileCode className="h-4 w-4 text-slate-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.totalContent.toLocaleString()}</div>
                        <div className="flex items-center text-xs mt-1">
                            {stats.contentGrowth >= 0 ? (
                                <div className="flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                    <span className="font-medium">+{stats.contentGrowth}%</span>
                                </div>
                            ) : (
                                <div className="flex items-center text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full">
                                    <ArrowDownRight className="h-3 w-3 mr-1" />
                                    <span className="font-medium">{stats.contentGrowth}%</span>
                                </div>
                            )}
                            <span className="text-slate-500 ml-2">from last month</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Active Users */}
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Active Users</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-slate-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.activeUsers.toLocaleString()}</div>
                        <div className="flex items-center text-xs mt-1">
                            {stats.activeGrowth >= 0 ? (
                                <div className="flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                    <span className="font-medium">+{stats.activeGrowth}%</span>
                                </div>
                            ) : (
                                <div className="flex items-center text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full">
                                    <ArrowDownRight className="h-3 w-3 mr-1" />
                                    <span className="font-medium">{stats.activeGrowth}%</span>
                                </div>
                            )}
                            <span className="text-slate-500 ml-2">from last month</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Support Tickets */}
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Support Tickets</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <FileQuestion className="h-4 w-4 text-slate-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {ticketCount.toLocaleString()}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Total tickets
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Content Breakdown */}
            <div>
                <h2 className="text-lg font-semibold mb-4 text-slate-900">Content Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { label: "Affiliate Partners", count: stats.breakdown.affiliatePartners, color: "text-blue-600" },

                        { label: "Courses", count: stats.breakdown.courses, color: "text-indigo-600" },
                        { label: "Events", count: stats.breakdown.events, color: "text-pink-600" },
                        { label: "Groups", count: stats.breakdown.groups, color: "text-emerald-600" },
                        { label: "Niche Boxes", count: stats.breakdown.nicheBoxes, color: "text-purple-600" },
                        { label: "Surveys", count: stats.breakdown.surveys, color: "text-orange-600" },
                        { label: "Wholesale Partners", count: stats.breakdown.wholesaleSuppliers, color: "text-cyan-600" },
                        { label: "Resources", count: stats.breakdown.resources, color: "text-amber-600" },
                    ].map((item, i) => (
                        <Card key={i} className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                            <CardContent className="pt-6 pb-6">
                                <div className="text-center">
                                    <div className={`text-3xl font-bold ${item.color}`}>{item.count}</div>
                                    <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wide">{item.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold mb-4 text-slate-900">Admin Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {adminTools.map((tool) => (
                        <Link href={tool.href} key={tool.title} className="block h-full">
                            <Card className="h-full border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 cursor-pointer group relative overflow-hidden">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${tool.bg} ${tool.hover}`}>
                                        <tool.icon className={`h-6 w-6 transition-colors duration-300 ${tool.color} group-hover:text-white`} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 group-hover:text-slate-800 transition-colors">{tool.title}</h3>
                                        <p className="text-sm text-slate-500 mt-1 group-hover:text-slate-600 transition-colors">{tool.description}</p>
                                    </div>
                                    <div className="absolute top-4 right-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        <ArrowUpRight className="h-4 w-4 text-slate-400" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

