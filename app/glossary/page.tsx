import { getGlossaryTerms } from "@/lib/actions/glossary.actions";
import Link from "next/link";
import { Search, Filter, Rocket, Heart, Zap, Clock, ThumbsUp } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Make Money Online Glossary - 100+ Terms & Paths",
    description: "Explore 100+ ways to make money online. From affiliate marketing to dropshipping, find your path to freedom with our comprehensive guide.",
};

export default async function GlossaryPage() {
    const result = await getGlossaryTerms({ limit: 1000 }) as any;
    const terms = result?.terms || [];

    // Explicitly derive categories to avoid Set/Array.from inference issues in some TS environments
    const categorySet = new Set<string>();
    terms.forEach((t: any) => {
        categorySet.add(String(t.category || "General"));
    });
    const categories: string[] = Array.from(categorySet).sort();

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-200 py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
                        The Freedom <span className="text-emerald-600 italic">Compass</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
                        Explore 100 paths to independence. From side hustles to full-time digital businesses, 
                        everything you need to know, defined and simplified.
                    </p>
                    
                    <div className="mt-10 max-w-2xl mx-auto relative">
                         <div className="flex items-center gap-4 p-2 bg-slate-100 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
                            <Search className="ml-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search by term, category, or business model..." 
                                className="w-full bg-transparent border-none focus:ring-0 font-bold text-slate-800 placeholder:text-slate-400 py-3"
                            />
                            <button className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all hidden md:block">
                                Explore
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 space-y-8">
                    <div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Categories</h3>
                        <div className="space-y-1">
                             <button className="w-full text-left px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-sm">
                                All Terms
                             </button>
                            {categories.map((cat: string) => (
                                <button key={cat} className="w-full text-left px-4 py-2 rounded-lg text-slate-600 hover:bg-white hover:text-emerald-600 font-bold text-sm transition-all">
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                             <Filter size={14} /> Quick Filters
                        </h3>
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                                <span className="text-sm font-bold text-slate-600 group-hover:text-emerald-600 flex items-center gap-2">
                                    <Heart size={14} className="text-rose-500" /> Low-Physical Effort
                                </span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                                <span className="text-sm font-bold text-slate-600 group-hover:text-emerald-600 flex items-center gap-2">
                                    <Zap size={14} className="text-amber-500" /> $0 Startup Cost
                                </span>
                            </label>
                             <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                                <span className="text-sm font-bold text-slate-600 group-hover:text-emerald-600 flex items-center gap-2">
                                    <ThumbsUp size={14} className="text-blue-500" /> Beginner Friendly
                                </span>
                            </label>
                        </div>
                    </div>
                </aside>

                {/* Main Content (Term Grid) */}
                <main className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {terms.map((term: any) => (
                            <Link 
                                href={`/glossary/${term.slug}`} 
                                key={term.id}
                                className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-100 transition-all flex flex-col h-full"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 py-1 bg-slate-100 rounded">
                                        {term.category}
                                    </span>
                                    {term.lowPhysicalEffort && (
                                        <Heart size={16} className="text-rose-400" />
                                    )}
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                    {term.term}
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed flex-1 line-clamp-3">
                                    {term.shortDefinition}
                                </p>
                                <div className="mt-6 flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-widest">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={12} />
                                        {term.timeToFirstDollar || "Varies"}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Zap size={12} className="text-amber-400" />
                                        {term.startupCost || "$0"}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
