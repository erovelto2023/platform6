import { getBookings } from "@/lib/actions/booking.actions";
import { getPosts } from "@/lib/actions/content-planner/post.actions";
import { CalendarClient } from "./CalendarClient";
import { ContentPlannerClient } from "@/components/calendar/content-planner/ContentPlannerClient";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Sparkles, Calendar as CalendarIcon } from "lucide-react";

export default async function CalendarOverviewPage() {
    const { data: bookings } = await getBookings();
    const contentPosts = await getPosts();

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-slate-100 shrink-0">
                <div>
                   <h2 className="text-xl font-bold text-slate-900 tracking-tight">Ecosystem Calendar</h2>
                   <p className="text-xs text-slate-500 font-medium tracking-wide font-sans mt-0.5 uppercase">Unified coordination hub</p>
                </div>
                <div className="flex items-center gap-3">
                   <Link href="/calendar/services">
                      <Button variant="outline" size="sm" className="rounded-full px-5 text-xs font-bold font-sans">
                         Manage Services
                      </Button>
                   </Link>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <Tabs defaultValue="bookings" className="h-full flex flex-col">
                    <div className="px-6 py-2 bg-slate-50/50 border-b border-slate-100 flex justify-center shrink-0">
                        <TabsList className="bg-slate-200/50 p-1 rounded-full h-10 ring-1 ring-slate-100 shadow-inner">
                            <TabsTrigger value="bookings" className="rounded-full px-6 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all flex items-center gap-2">
                                <CalendarIcon className="w-3.5 h-3.5" />
                                Appointment View
                            </TabsTrigger>
                            <TabsTrigger value="content" className="rounded-full px-6 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5" />
                                Content Strategy
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="bookings" className="flex-1 overflow-y-auto p-6 m-0 bg-white">
                        <CalendarClient bookings={bookings || []} />
                    </TabsContent>
                    
                    <TabsContent value="content" className="flex-1 overflow-hidden m-0 bg-white">
                        <ContentPlannerClient initialPosts={contentPosts || []} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
