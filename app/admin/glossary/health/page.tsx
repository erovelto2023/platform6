import { getGlossaryHealthData } from "@/lib/actions/glossary.actions";
import Link from "next/link";
import { ArrowLeft, BookOpen, Video, ShoppingBag, HelpCircle, CheckSquare, BarChart3, TrendingUp, Zap } from "lucide-react";

export default async function GlossaryHealthMapPage() {
    const data = await getGlossaryHealthData();

    if ("error" in data) {
        return <div className="p-10 text-red-500 font-bold">Error: {data.error}</div>;
    }

    const { healthData, totalTerms, totalViews } = data;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 pt-12">
            <div className="max-w-7xl mx-auto">
                <Link 
                    href="/admin/glossary"
                    className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors mb-8 group font-bold w-fit"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Glossary Manager
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Glossary Health Map</h1>
                        <p className="text-slate-500 dark:text-slate-400">Track content completion and user engagement across your niche categories.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Terms</div>
                                <div className="text-2xl font-black text-slate-900 dark:text-white">{totalTerms}</div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Views</div>
                                <div className="text-2xl font-black text-slate-900 dark:text-white">{totalViews.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {healthData.map((cat, idx) => (
                        <div 
                            key={idx}
                            className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300"
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{cat.category}</h3>
                                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-black">
                                    <BarChart3 size={14} />
                                    {cat.count} Terms
                                </div>
                            </div>
                            
                            <div className="p-8 space-y-8">
                                {/* Overall Completion */}
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="text-sm font-bold text-slate-700 dark:text-slate-200">Overall Category Health</div>
                                        <div className="text-lg font-black text-emerald-600">{cat.overallCompletion}%</div>
                                    </div>
                                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${cat.overallCompletion}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <Video size={14} className="text-red-500" /> Videos
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-red-500 rounded-full" style={{ width: `${cat.videoProgress}%` }} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 w-8">{cat.videoProgress}%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <ShoppingBag size={14} className="text-orange-500" /> Products
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${cat.productProgress}%` }} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 w-8">{cat.productProgress}%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <HelpCircle size={14} className="text-blue-500" /> FAQs
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${cat.faqProgress}%` }} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 w-8">{cat.faqProgress}%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <CheckSquare size={14} className="text-emerald-500" /> Checklist
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${cat.checklistProgress}%` }} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 w-8">{cat.checklistProgress}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-1 text-slate-400">
                                        <TrendingUp size={14} className="text-blue-400" />
                                        Engagement Score: <span className="text-slate-900 dark:text-slate-200 font-bold">{cat.engagementScore.toLocaleString()}</span>
                                    </div>
                                    <Link 
                                        href={`/admin/glossary?category=${cat.category}`}
                                        className="text-emerald-600 hover:underline font-bold"
                                    >
                                        Edit Terms →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Heatmap Section */}
                <div className="mt-16 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center">
                            <Zap size={20} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Engagement Heatmap</h2>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {healthData.sort((a,b) => b.engagementScore - a.engagementScore).map((cat, i) => {
                            const opacity = Math.max(0.1, cat.engagementScore / (totalViews / healthData.length + 1));
                            return (
                                <div 
                                    key={i}
                                    className="p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-105"
                                    style={{ 
                                        backgroundColor: `rgba(16, 185, 129, ${opacity})`,
                                        color: opacity > 0.5 ? 'white' : 'inherit'
                                    }}
                                >
                                    <div className="text-[10px] font-black uppercase mb-1 opacity-70">Category</div>
                                    <div className="font-bold text-sm leading-tight mb-2">{cat.category}</div>
                                    <div className="text-xs font-black">{cat.engagementScore.toLocaleString()} pts</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
