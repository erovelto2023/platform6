import { getPosts } from "@/lib/actions/content-planner/post.actions";
import { ContentPlannerClient } from "@/components/calendar/content-planner/ContentPlannerClient";
import { Sparkles, Activity, Database } from "lucide-react";

export default async function ContentCalendarPage() {
    const contentPosts = await getPosts();

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-[#07091B] font-sans">
            {/* Context Header */}
            <div className="px-8 py-6 flex justify-between items-center bg-[#07091B] border-b border-zinc-800/50 shrink-0">
                <div className="flex flex-col">
                   <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_#6366f1]" />
                      <span className="text-[10px] font-black uppercase tracking-[4px] text-zinc-600">Strategy Workspace</span>
                   </div>
                   <h2 className="text-2xl font-black text-white tracking-tighter leading-tight uppercase">Growth Roadmap</h2>
                </div>
                
                <div className="flex items-center gap-6 bg-black/40 px-6 py-3 rounded-2xl border border-zinc-800/50 shadow-inner">
                   <div className="flex items-center gap-2 group cursor-pointer">
                      <Activity className="w-4 h-4 text-indigo-500" />
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Analyzer Active</span>
                   </div>
                   <div className="w-px h-4 bg-zinc-800" />
                   <div className="flex items-center gap-2 group cursor-pointer">
                      <Database className="w-4 h-4 text-indigo-500" />
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Secure Uplink</span>
                   </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden p-12">
                <div className="max-w-[1600px] mx-auto h-full">
                    <ContentPlannerClient initialPosts={contentPosts || []} />
                </div>
            </div>
        </div>
    );
}
