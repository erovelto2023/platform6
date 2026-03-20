"use client";

import { TrendingUp, Target, Search, Info, PieChart, BarChart3, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketPulseData } from "@/lib/services/market.service";
import { MarketDominance } from "./market-dominance";

interface MarketPulseProps {
    data: MarketPulseData | null;
    cityName: string;
    newspapers?: Array<{
        name: string;
        url: string;
        description?: string;
        type?: string;
    }>;
}

export function MarketPulse({ data, cityName, newspapers = [] }: MarketPulseProps) {
    console.log(`[MarketPulse] Rendering for ${cityName}:`, !!data);
    if (!data) return null;

    const { searchIntent, monthlyMomentum } = data;

    return (
        <div className="space-y-12 mt-12">
            <div className="flex items-center gap-3 mb-8 border-l-4 border-blue-500 pl-4">
                <h2 className="text-2xl font-black uppercase italic tracking-tight text-[#0e0021]">
                    Market Pulse (Live)
                </h2>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[8px] uppercase font-black">Real-Time Data</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Search Intent & Momentum */}
                <div className="lg:col-span-3 space-y-8">
                    <Card className="bg-white border-slate-200 rounded-2xl overflow-hidden border-t-4 border-t-blue-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-[#0e0021]">
                                <Search className="h-4 w-4 text-blue-400" />
                                What People are Searching For in {cityName}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-[#0e0021]">
                                {searchIntent.length > 0 ? (
                                    searchIntent.slice(0, 8).map((intent, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-[#f8f9fa]/40 border border-slate-200 rounded-xl group hover:border-blue-500/30 transition-all">
                                            <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center text-[10px] font-black text-blue-400 group-hover:bg-blue-500/20">
                                                {i + 1}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-700 uppercase italic tracking-tight leading-none truncate">
                                                {intent}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-6 text-center text-slate-600 font-bold uppercase italic text-[10px]">
                                        No recent search patterns detected. Try again later.
                                    </div>
                                )}
                            </div>
                            
                            {searchIntent.length > 0 && (
                                <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingUp className="h-3 w-3 text-blue-400" />
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Business Playbook</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-[11px] font-black text-[#0e0021] uppercase italic mb-1">Navigation & Intent</p>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed">
                                                High volume for 'map', 'directions', or 'weather' suggests a transit-heavy or tourist-prone audience. 
                                                <span className="text-blue-400/80 block mt-1 underline">Action: Focus on location-based mobile SEO & local business listings.</span>
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-[#0e0021] uppercase italic mb-1">Community Awareness</p>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed">
                                                Queries for 'news' or 'population' point to an active, civic-minded audience.
                                                <span className="text-blue-400/80 block mt-1 underline">Action: Best for local affiliate news sites & community-driven products.</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <Card className="bg-white border-slate-200 rounded-2xl border-l-4 border-l-emerald-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-black uppercase text-slate-500">City Momentum (30 Days)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-[#0e0021] italic tracking-tighter">
                                    {monthlyMomentum > 0 ? monthlyMomentum.toLocaleString() : "---"}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <TrendingUp className="h-3 w-3 text-emerald-700" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-700">Monthly Wiki Traffic</span>
                                </div>
                                <p className="mt-4 text-[9px] font-bold text-slate-600 uppercase italic leading-tight">
                                    Measures "Curiosity Index". High traffic suggests outsiders or potential movers researching {cityName}.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-slate-200 rounded-2xl border-l-4 border-l-blue-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-black uppercase text-slate-500">Opportunity Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-blue-400 italic tracking-tighter">
                                    {Math.min(99, Math.round((monthlyMomentum / 1000) * 10)) || "--"}/99
                                </div>
                                <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Niche Potential Index</p>
                                <p className="mt-4 text-[9px] font-bold text-slate-600 uppercase italic leading-tight">
                                    High score indicates a city with a growing digital footprint but low market saturation.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Market Dominance Section - New Dashboard */}
            <div className="mt-12">
                <div className="flex items-center gap-3 mb-8 border-l-4 border-emerald-500 pl-4">
                    <h2 className="text-2xl font-black uppercase italic tracking-tight text-[#0e0021]">
                        Market Dominance & Gap Analysis
                    </h2>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-500/20 text-[8px] uppercase font-black tracking-widest">50-Category Scan</Badge>
                </div>
                <MarketDominance dominance={data?.dominance} cityName={cityName} />
            </div>

            {/* Competitive Landscape Section */}
            {data?.competitors && (
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-8 border-l-4 border-amber-500 pl-4">
                        <h2 className="text-2xl font-black uppercase italic tracking-tight text-[#0e0021]">
                            Competitive Landscape
                        </h2>
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[8px] uppercase font-black tracking-widest">Market Density</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { key: 'parenting', label: 'Parenting & Kids', color: 'purple' },
                            { key: 'seniors', label: 'Senior Services', color: 'blue' },
                            { key: 'home', label: 'Home Optimization', color: 'emerald' }
                        ].map((niche) => {
                            const list = (data.competitors as any)[niche.key] || [];
                            const saturation = list.length === 0 ? "Untapped" : list.length < 3 ? "Low" : "Saturated";
                            const satColor = saturation === "Untapped" ? "text-emerald-700" : saturation === "Low" ? "text-blue-400" : "text-amber-400";

                            return (
                                <Card key={niche.key} className="bg-white border-slate-200 rounded-2xl overflow-hidden border-t-2 border-t-slate-800 hover:border-amber-500/20 transition-all">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-2">
                                                <Target className="h-3 w-3" />
                                                {niche.label}
                                            </CardTitle>
                                            <Badge className={`bg-[#f8f9fa] text-[8px] font-black uppercase border-slate-200 ${satColor}`}>
                                                {saturation}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {list.length > 0 ? (
                                            <ul className="space-y-1.5 min-h-[100px]">
                                                {list.slice(0, 5).map((name: string, j: number) => (
                                                    <li key={j} className="text-[11px] font-bold text-[#0e0021] flex items-center gap-2">
                                                        <div className={`h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${
                                                            niche.key === 'parenting' ? 'bg-purple-500' :
                                                            niche.key === 'seniors' ? 'bg-blue-500' : 'bg-emerald-500'
                                                        }`} />
                                                        <span className="truncate">{name}</span>
                                                    </li>
                                                ))}
                                                {list.length > 5 && (
                                                    <li className="text-[9px] font-black text-slate-600 uppercase italic">
                                                        + {list.length - 5} more detected
                                                    </li>
                                                )}
                                            </ul>
                                        ) : (
                                            <div className="py-8 text-center border-2 border-dashed border-slate-200/40 rounded-xl">
                                                <p className="text-[10px] font-black text-emerald-700/60 uppercase tracking-widest italic leading-tight">
                                                    No direct competitors<br/>found in OSM data
                                                </p>
                                            </div>
                                        )}
                                        <p className="text-[9px] font-bold text-slate-600 uppercase leading-relaxed mt-2 italic">
                                            {saturation === "Untapped" 
                                                ? `🚀 High Opportunity: No ${niche.label.toLowerCase()} centers found in ${cityName}.`
                                                : `⚖️ ${saturation} Saturation: ${list.length} existing entities. Check for service gaps.`}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Local Media & Newspapers */}
            {newspapers.length > 0 && (
                <section>
                    <div className="flex items-center gap-3 mb-8 border-l-4 border-rose-500 pl-4">
                        <h2 className="text-2xl font-black uppercase italic tracking-tight text-[#0e0021]">
                            Local Media & Press
                        </h2>
                        <Badge variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[8px] uppercase font-black">Ad Targeting</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newspapers.map((paper, i) => (
                            <Card key={i} className="bg-white border-slate-200 rounded-2xl hover:border-rose-500/30 transition-all group">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-black uppercase text-[#0e0021] group-hover:text-rose-400 transition-colors">
                                        <a href={paper.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                            {paper.name}
                                            <Search className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                                        </a>
                                    </CardTitle>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-slate-600">{paper.type || 'Local'} Media</div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-[10px] text-slate-600 font-medium leading-relaxed line-clamp-3 italic">
                                        {paper.description || "Top source for local news and community happenings."}
                                    </p>
                                    <a 
                                        href={paper.url} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-block text-[8px] font-black uppercase tracking-tighter text-rose-500 border-b border-rose-500/20 hover:border-rose-500"
                                    >
                                        Visit Publication
                                    </a>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
                <Info className="h-4 w-4 text-blue-500 mt-1" />
                <p className="text-[10px] font-medium text-slate-500 leading-relaxed uppercase">
                    Market Pulse uses 100% free and open data from **Google Autocomplete**, **Wikimedia**, and **OpenStreetMap**. Unlike Census data which is historical, these indicators reflect real-time momentum.
                </p>
            </div>
        </div>
    );
}
