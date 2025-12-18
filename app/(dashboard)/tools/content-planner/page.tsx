import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Calendar as CalendarIcon,
    Plus,
    LayoutGrid,
    BarChart3,
    Rocket,
    Settings,
    PenTool
} from "lucide-react";
import { getContentPosts } from "@/lib/actions/content.actions";
import { PlannerTabs } from "./_components/planner-tabs";
import { DataFixer } from "./_components/data-fixer";

export default async function ContentPlannerPage() {
    const posts = await getContentPosts();

    // Calculate Stats
    const ideaCount = posts.filter(p => p.status === 'idea').length;
    const draftCount = posts.filter(p => p.status === 'draft').length;
    const reviewCount = posts.filter(p => p.status === 'review').length;
    const scheduledCount = posts.filter(p => p.status === 'scheduled').length;
    const publishedCount = posts.filter(p => p.status === 'published').length;

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col p-6 space-y-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <LayoutGrid className="h-8 w-8 text-indigo-600" />
                        Content System
                    </h1>
                    <p className="text-slate-600 mt-1">Manage your entire content lifecycle from idea to revenue.</p>
                </div>
                <div className="flex gap-2">
                    <DataFixer />
                    <Link href="/tools/content-planner/settings">
                        <Button variant="outline" size="icon">
                            <Settings className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/tools/content-planner/create">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                            <Plus className="h-4 w-4 mr-2" />
                            New Content
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-shrink-0">
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Ideas</CardTitle>
                        <PenTool className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{ideaCount}</div>
                        <p className="text-xs text-slate-500 mt-1">Brainstorming</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">In Progress</CardTitle>
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{draftCount}</div>
                        <p className="text-xs text-slate-500 mt-1">Drafting</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Review</CardTitle>
                        <LayoutGrid className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{reviewCount}</div>
                        <p className="text-xs text-slate-500 mt-1">Needs approval</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Scheduled</CardTitle>
                        <CalendarIcon className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{scheduledCount}</div>
                        <p className="text-xs text-slate-500 mt-1">Ready to publish</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Published</CardTitle>
                        <Rocket className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{publishedCount}</div>
                        <p className="text-xs text-slate-500 mt-1">Live content</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <PlannerTabs posts={posts} />
        </div>
    );
}
