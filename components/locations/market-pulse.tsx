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
            <div className="flex items-center gap-3 mb-8 border-l-4 border-emerald-600 pl-4">
                <h2 className="text-2xl font-black uppercase italic tracking-tight text-emerald-950">
                    Market Pulse (Live)
                </h2>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[8px] uppercase font-black">Real-Time Data</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Search Intent & Momentum */}
                <div className="lg:col-span-3 space-y-8">
                    <Card className="bg-slate-50 border-emerald-100 rounded-2xl overflow-hidden border-t-4 border-t-emerald-600 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-emerald-950">
                                <Search className="h-4 w-4 text-emerald-600" />
                                What People are Searching For in {cityName}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-emerald-950">
                                {searchIntent.length > 0 ? (
                                    searchIntent.slice(0, 8).map((intent, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-white border border-emerald-100 rounded-xl group hover:border-emerald-500/30 transition-all">
                                            <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-[10px] font-black text-emerald-600 group-hover:bg-emerald-500/20">
                                                {i + 1}
                                            </div>
                                            <span className="text-[10px] font-bold text-emerald-900/60 uppercase italic tracking-tight leading-none truncate">
                                                {intent}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-6 text-center text-emerald-900/40 font-bold uppercase italic text-[10px]">
                                        No recent search patterns detected. Try again later.
                                    </div>
                                )}
                            </div>
                            
                            {searchIntent.length > 0 && (
                                <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingUp className="h-3 w-3 text-emerald-600" />
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Business Playbook</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-[11px] font-black text-emerald-950 uppercase italic mb-1">Navigation & Intent</p>
                                            <p className="text-[9px] font-bold text-emerald-900/60 uppercase leading-relaxed">
                                                High volume for 'map', 'directions', or 'weather' suggests a transit-heavy or tourist-prone audience. 
                                                <span className="text-emerald-600 block mt-1 underline">Action: Focus on location-based mobile SEO & local business listings.</span>
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-emerald-950 uppercase italic mb-1">Community Awareness</p>
                                            <p className="text-[9px] font-bold text-emerald-900/60 uppercase leading-relaxed">
                                                Queries for 'news' or 'population' point to an active, civic-minded audience.
                                                <span className="text-emerald-600 block mt-1 underline">Action: Best for local affiliate news sites & community-driven products.</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <Card className="bg-slate-50 border-emerald-100 rounded-2xl border-l-4 border-l-emerald-600 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-black uppercase text-emerald-900/40">City Momentum (30 Days)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-emerald-950 italic tracking-tighter">
                                    {monthlyMomentum > 0 ? monthlyMomentum.toLocaleString() : "---"}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <TrendingUp className="h-3 w-3 text-emerald-600" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">Monthly Wiki Traffic</span>
                                </div>
                                <p className="mt-4 text-[9px] font-bold text-emerald-900/60 uppercase italic leading-tight">
                                    Measures "Curiosity Index". High traffic suggests outsiders or potential movers researching {cityName}.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-50 border-emerald-100 rounded-2xl border-l-4 border-l-emerald-600 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-black uppercase text-emerald-900/40">Opportunity Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-emerald-600 italic tracking-tighter">
                                    {Math.min(99, Math.round((monthlyMomentum / 1000) * 10)) || "--"}/99
                                </div>
                                <p className="text-[8px] font-bold text-emerald-900/40 uppercase mt-1">Niche Potential Index</p>
                                <p className="mt-4 text-[9px] font-bold text-emerald-900/60 uppercase italic leading-tight">
                                    High score indicates a city with a growing digital footprint but low market saturation.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Market Dominance Section - New Dashboard */}
            <div className="mt-12">
                <div className="flex items-center gap-3 mb-8 border-l-4 border-emerald-600 pl-4">
                    <h2 className="text-2xl font-black uppercase italic tracking-tight text-emerald-950">
                        Market Dominance & Gap Analysis
                    </h2>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[8px] uppercase font-black tracking-widest">50-Category Scan</Badge>
                </div>
                <MarketDominance dominance={data?.dominance} cityName={cityName} />
            </div>

            {/* Competitive Landscape Section */}
            {data?.competitors && (
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-8 border-l-4 border-emerald-600 pl-4">
                        <h2 className="text-2xl font-black uppercase italic tracking-tight text-emerald-950">
                            Competitive Landscape
                        </h2>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[8px] uppercase font-black tracking-widest">Market Density</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { key: 'parenting', label: 'Parenting & Kids', color: 'emerald' },
                            { key: 'seniors', label: 'Senior Services', color: 'emerald' },
                            { key: 'home', label: 'Home Optimization', color: 'emerald' }
                        ].map((niche) => {
                            const list = (data.competitors as any)[niche.key] || [];
                            const saturation = list.length === 0 ? "Untapped" : list.length < 3 ? "Low" : "Saturated";
                            const satColor = saturation === "Untapped" ? "text-emerald-600" : saturation === "Low" ? "text-emerald-500" : "text-amber-600";

                            return (
                                <Card key={niche.key} className="bg-slate-50 border-emerald-100 rounded-2xl overflow-hidden border-t-2 border-t-emerald-200 hover:border-emerald-500/20 transition-all shadow-sm">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-[10px] font-bold uppercase text-emerald-900/40 flex items-center gap-2">
                                                <Target className="h-3 w-3" />
                                                {niche.label}
                                            </CardTitle>
                                            <Badge className={`bg-white text-[8px] font-black uppercase border-emerald-100 ${satColor}`}>
                                                {saturation}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {list.length > 0 ? (
                                            <ul className="space-y-1.5 min-h-[100px]">
                                                {list.slice(0, 5).map((name: string, j: number) => (
                                                    <li key={j} className="text-[11px] font-bold text-emerald-950 flex items-center gap-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                                                        <span className="truncate">{name}</span>
                                                    </li>
                                                ))}
                                                {list.length > 5 && (
                                                    <li className="text-[9px] font-black text-emerald-900/40 uppercase italic">
                                                        + {list.length - 5} more detected
                                                    </li>
                                                )}
                                            </ul>
                                        ) : (
                                            <div className="py-8 text-center border-2 border-dashed border-emerald-100 rounded-xl">
                                                <p className="text-[10px] font-black text-emerald-600/40 uppercase tracking-widest italic leading-tight">
                                                    No direct competitors<br/>found in OSM data
                                                </p>
                                            </div>
                                        )}
                                        <p className="text-[9px] font-bold text-emerald-900/60 uppercase leading-relaxed mt-2 italic">
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
                    <div className="flex items-center gap-3 mb-8 border-l-4 border-emerald-600 pl-4">
                        <h2 className="text-2xl font-black uppercase italic tracking-tight text-emerald-950">
                            Local Media & Press
                        </h2>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[8px] uppercase font-black">Ad Targeting</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newspapers.map((paper, i) => (
                            <Card key={i} className="bg-slate-50 border-emerald-100 rounded-2xl hover:border-emerald-500/30 transition-all group shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-black uppercase text-emerald-950 group-hover:text-emerald-600 transition-colors">
                                        <a href={paper.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                            {paper.name}
                                            <Search className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                                        </a>
                                    </CardTitle>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-emerald-900/40">{paper.type || 'Local'} Media</div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-[10px] text-emerald-900/60 font-medium leading-relaxed line-clamp-3 italic uppercase">
                                        {paper.description || "Top source for local news and community happenings."}
                                    </p>
                                    <a 
                                        href={paper.url} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-block text-[8px] font-black uppercase tracking-tighter text-emerald-600 border-b border-emerald-600/20 hover:border-emerald-600"
                                    >
                                        Visit Publication
                                    </a>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            <div className="p-6 bg-slate-50 border border-emerald-100 rounded-2xl flex items-start gap-3 shadow-inner">
                <Info className="h-4 w-4 text-emerald-600 mt-1" />
                <p className="text-[10px] font-medium text-emerald-900/60 leading-relaxed uppercase">
                    Market Pulse uses 100% free and open data from **Google Autocomplete**, **Wikimedia**, and **OpenStreetMap**. Unlike Census data which is historical, these indicators reflect real-time momentum.
                </p>
            </div>
        </div>
    );
}
