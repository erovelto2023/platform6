import { getFullContentPosts } from "@/lib/actions/content.actions";
import { AdvancedContentCalendar } from "@/components/content/AdvancedContentCalendar";
import { StrategyDashboard } from "@/components/content/StrategyDashboard";
import { KanbanBoard } from "@/components/content-planner/kanban-board";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Campaign from "@/lib/db/models/Campaign";
import Offer from "@/lib/db/models/Offer";
import connectToDatabase from "@/lib/db/connect";

async function getData() {
    await connectToDatabase();
    const [postsRes, campaigns, offers] = await Promise.all([
        getFullContentPosts(),
        Campaign.find({}).sort({ createdAt: -1 }),
        Offer.find({}).sort({ createdAt: -1 })
    ]);

    return {
        posts: postsRes.success ? postsRes.data : [],
        campaigns: JSON.parse(JSON.stringify(campaigns)),
        offers: JSON.parse(JSON.stringify(offers))
    };
}

export default async function ContentCalendarPage() {
    const { posts, campaigns, offers } = await getData();

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col gap-4">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900">Advanced Content Calendar</h3>
                    <p className="text-sm text-slate-500">
                        Manage your content, strategy, and offers.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="calendar" className="flex-1 flex flex-col">
                <TabsList>
                    <TabsTrigger value="calendar">Calendar</TabsTrigger>
                    <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
                    <TabsTrigger value="strategy">Strategy & Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="calendar" className="flex-1 mt-4">
                    <AdvancedContentCalendar posts={posts} campaigns={campaigns} offers={offers} />
                </TabsContent>

                <TabsContent value="kanban" className="flex-1 mt-4 h-[calc(100vh-250px)]">
                    <KanbanBoard posts={posts} />
                </TabsContent>

                <TabsContent value="strategy" className="mt-4">
                    <StrategyDashboard posts={posts} offers={offers} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
