"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Calendar as CalendarIcon,
    List,
    Sparkles,
    KanbanSquare as KanbanIcon,
} from "lucide-react";
import { ContentCalendar } from "@/components/content-planner/content-calendar";
import { KanbanBoard } from "@/components/content-planner/kanban-board";

interface PlannerTabsProps {
    posts: any[];
}

export function PlannerTabs({ posts }: PlannerTabsProps) {
    return (
        <Tabs defaultValue="board" className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <TabsList className="bg-slate-100 p-1">
                    <TabsTrigger value="board" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <KanbanIcon className="h-4 w-4 mr-2" />
                        Board View
                    </TabsTrigger>
                    <TabsTrigger value="calendar" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Calendar View
                    </TabsTrigger>
                    <TabsTrigger value="list" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <List className="h-4 w-4 mr-2" />
                        List View
                    </TabsTrigger>
                </TabsList>

                <div className="flex gap-2">
                    <Link href="/tools/content-planner/ai-generate">
                        <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate Ideas
                        </Button>
                    </Link>
                </div>
            </div>

            <TabsContent value="board" className="flex-1 min-h-0 overflow-hidden mt-0">
                <KanbanBoard posts={posts} />
            </TabsContent>

            <TabsContent value="calendar" className="flex-1 min-h-0 overflow-y-auto mt-0">
                <ContentCalendar posts={posts} />
            </TabsContent>

            <TabsContent value="list" className="flex-1 min-h-0 overflow-y-auto mt-0">
                <div className="flex items-center justify-center h-full border-2 border-dashed rounded-xl bg-slate-50">
                    <p className="text-slate-500">List view coming soon</p>
                </div>
            </TabsContent>
        </Tabs>
    );
}
