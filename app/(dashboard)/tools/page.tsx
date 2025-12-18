import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, ShoppingCart, ExternalLink, Image as ImageIcon, LayoutTemplate, Calendar, FileText, Search, BarChart3, Globe, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function ToolsDashboardPage() {
    return (
        // Tools Dashboard
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-y-2">
                <h1 className="text-3xl font-bold">Tools & Apps</h1>
                <p className="text-muted-foreground">
                    Useful tools and applications to help you succeed.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <Link href="/tools/content-planner">
                    <Card className="hover:shadow-lg transition cursor-pointer h-full border-slate-200 overflow-hidden group">
                        <div className="relative w-full aspect-video rounded-t-md overflow-hidden bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                            <Calendar className="h-8 w-8 text-white" />
                        </div>
                        <CardHeader className="p-4">
                            <CardTitle className="text-base line-clamp-1 group-hover:text-sky-700 transition flex items-center justify-between">
                                Content Planner
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-xs text-slate-600 line-clamp-2">
                                Plan, schedule, and publish content across all platforms.
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/tools/amazon-product-engine">
                    <Card className="hover:shadow-lg transition cursor-pointer h-full border-slate-200 overflow-hidden group">
                        <div className="relative w-full aspect-video rounded-t-md overflow-hidden bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center">
                            <ShoppingCart className="h-8 w-8 text-white" />
                        </div>
                        <CardHeader className="p-4">
                            <CardTitle className="text-base line-clamp-1 group-hover:text-sky-700 transition flex items-center justify-between">
                                Amazon Engine
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-xs text-slate-600 line-clamp-2">
                                Search products, generate affiliate links, and create displays.
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/tools/pin-inspector">
                    <Card className="hover:shadow-lg transition cursor-pointer h-full border-slate-200 overflow-hidden group">
                        <div className="relative w-full aspect-video rounded-t-md overflow-hidden bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                            <Search className="h-8 w-8 text-white" />
                        </div>
                        <CardHeader className="p-4">
                            <CardTitle className="text-base line-clamp-1 group-hover:text-sky-700 transition flex items-center justify-between">
                                Pin Inspector
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-xs text-slate-600 line-clamp-2">
                                Analyze Pinterest trends, keywords, and top performing pins.
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/tools/workbook-designer">
                    <Card className="hover:shadow-lg transition cursor-pointer h-full border-slate-200 overflow-hidden group">
                        <div className="relative w-full aspect-video rounded-t-md overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <LayoutTemplate className="h-8 w-8 text-white" />
                        </div>
                        <CardHeader className="p-4">
                            <CardTitle className="text-base line-clamp-1 group-hover:text-sky-700 transition flex items-center justify-between">
                                Workbook Designer
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-xs text-slate-600 line-clamp-2">
                                Design professional workbooks, journals, and printables.
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/headlines">
                    <Card className="hover:shadow-lg transition cursor-pointer h-full border-slate-200 overflow-hidden group">
                        <div className="relative w-full aspect-video rounded-t-md overflow-hidden bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-white" />
                        </div>
                        <CardHeader className="p-4">
                            <CardTitle className="text-base line-clamp-1 group-hover:text-sky-700 transition flex items-center justify-between">
                                Headline Studio
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-xs text-slate-600 line-clamp-2">
                                Generate, organize, and optimize marketing headlines with AI.
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/tools/insights-analyzer">
                    <Card className="hover:shadow-lg transition cursor-pointer h-full border-slate-200 overflow-hidden group">
                        <div className="relative w-full aspect-video rounded-t-md overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <BarChart3 className="h-8 w-8 text-white" />
                        </div>
                        <CardHeader className="p-4">
                            <CardTitle className="text-base line-clamp-1 group-hover:text-sky-700 transition flex items-center justify-between">
                                Insights Analyzer
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-xs text-slate-600 line-clamp-2">
                                Deep dive into your data with advanced analytics and reporting.
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/tools/keyword-explorer">
                    <Card className="hover:shadow-lg transition cursor-pointer h-full border-slate-200 overflow-hidden group">
                        <div className="relative w-full aspect-video rounded-t-md overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                            <Globe className="h-8 w-8 text-white" />
                        </div>
                        <CardHeader className="p-4">
                            <CardTitle className="text-base line-clamp-1 group-hover:text-sky-700 transition flex items-center justify-between">
                                Keyword Explorer
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-xs text-slate-600 line-clamp-2">
                                Comprehensive keyword research with live data and competitive analysis.
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/tools/wholesale-directory">
                    <Card className="hover:shadow-lg transition cursor-pointer h-full border-slate-200 overflow-hidden group">
                        <div className="relative w-full aspect-video rounded-t-md overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-white" />
                        </div>
                        <CardHeader className="p-4">
                            <CardTitle className="text-base line-clamp-1 group-hover:text-sky-700 transition flex items-center justify-between">
                                Wholesale Directory
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-xs text-slate-600 line-clamp-2">
                                Find and manage wholesale suppliers for your business.
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                {/* Tools will be added here as we build them */}
                <div className="col-span-full text-center text-muted-foreground mt-10">
                    More tools coming soon!
                </div>
            </div>
        </div>
    );
}
