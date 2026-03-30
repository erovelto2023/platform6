"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Zap, AlertCircle, CheckCircle2, BarChart3, PieChart, ShoppingBag, Lightbulb } from "lucide-react";
import { MARKET_CATEGORIES } from "@/lib/constants/market-categories";

interface MarketDominanceProps {
    dominance: Record<string, { count: number; sector: string }> | undefined;
    cityName: string;
}

export function MarketDominance({ dominance, cityName }: MarketDominanceProps) {
    if (!dominance || Object.keys(dominance).length === 0) {
        return (
            <Card className="bg-zinc-900 border-zinc-800 rounded-3xl p-8 text-center border-dashed border-2">
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs italic">
                    Market Dominance data currently being indexed for {cityName}...
                </p>
            </Card>
        );
    }

    // 1. Group by Sector
    const sectorStats: Record<string, { total: number; categories: string[] }> = {};
    Object.entries(dominance).forEach(([label, data]) => {
        if (!sectorStats[data.sector]) {
            sectorStats[data.sector] = { total: 0, categories: [] };
        }
        sectorStats[data.sector].total += data.count;
        if (data.count > 0) sectorStats[data.sector].categories.push(label);
    });

    const sortedSectors = Object.entries(sectorStats).sort((a, b) => b[1].total - a[1].total);
    const topSector = sortedSectors[0];

    // 2. Identify Opportunities (Count = 0 or very low)
    const opportunities = Object.entries(dominance)
        .filter(([_, d]) => d.count === 0)
        .map(([label]) => {
            const cat = MARKET_CATEGORIES.find(c => c.label === label);
            return {
                label,
                suggestion: cat?.suggestion || "Ready for immediate business entry."
            };
        })
        .slice(0, 10);

    const saturated = Object.entries(dominance)
        .filter(([_, d]) => d.count > 10)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5);

    return (
        <div className="space-y-12">
            {/* Top Insight Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-sky-600/10 border-sky-500/20 rounded-3xl overflow-hidden relative group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingUp size={120} className="text-sky-500" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-xs font-black uppercase text-sky-400 tracking-widest flex items-center gap-2">
                            <BarChart3 size={14} />
                            Dominant Sector
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-3xl font-black text-white italic tracking-tighter mb-2">
                            {topSector ? topSector[0] : "Mixed Economy"}
                        </h3>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                            {topSector ? `${topSector[1].total} active establishments detected` : "Calculating..."}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-emerald-600/10 border-emerald-500/20 rounded-3xl overflow-hidden relative group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Target size={120} className="text-emerald-500" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-xs font-black uppercase text-emerald-400 tracking-widest flex items-center gap-2">
                            <Zap size={14} />
                            Market Gaps Found
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-3xl font-black text-white italic tracking-tighter mb-2">
                            {opportunities.length} Untapped Niches
                        </h3>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                            Ready for immediate business entry
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Opportunity Radar */}
            <section>
                <div className="flex items-center gap-3 mb-6 border-l-4 border-emerald-500 pl-4">
                    <h2 className="text-xl font-black uppercase italic tracking-tight text-white">
                        Opportunity Radar
                    </h2>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[8px] uppercase font-black">Actionable</Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {opportunities.length > 0 ? (
                        opportunities.map((opt) => (
                            <div key={opt.label} className="p-4 bg-zinc-950 border border-zinc-800 rounded-3xl flex flex-col items-center text-center group hover:border-emerald-500/50 transition-all cursor-default relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-10 transition-opacity">
                                    <Lightbulb size={40} className="text-emerald-500" />
                                </div>
                                <AlertCircle size={16} className="text-emerald-500 mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <span className="text-[10px] font-black uppercase text-white leading-tight mb-2 tracking-widest">{opt.label}</span>
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[8px] mb-3 uppercase font-black px-1.5 py-0">Untapped</Badge>
                                <p className="text-[9px] font-bold text-zinc-500 leading-relaxed italic group-hover:text-emerald-300 transition-colors">
                                    "{opt.suggestion}"
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-8 text-center bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-3xl">
                            <p className="text-zinc-500 font-bold uppercase text-xs italic">All 50 categories have existing competition. Look for service-level gaps.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Saturated Segments */}
            <section>
                <div className="flex items-center gap-3 mb-6 border-l-4 border-amber-500 pl-4">
                    <h2 className="text-xl font-black uppercase italic tracking-tight text-white">
                        Saturation Heatmap
                    </h2>
                    <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[8px] uppercase font-black">Avoid Direct Entry</Badge>
                </div>

                <div className="space-y-4">
                    {saturated.map(([label, d]) => (
                        <div key={label} className="bg-zinc-950 p-4 border border-zinc-800 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-amber-500" />
                                <span className="text-xs font-black uppercase text-white tracking-widest">{label}</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="hidden md:block w-48">
                                    <Progress value={Math.min(100, (d.count / (topSector?.[1].total || 1)) * 100)} className="h-1 bg-zinc-800" />
                                </div>
                                <span className="text-xs font-black italic text-amber-400 w-12 text-right">{d.count} Units</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sector Breakdown */}
            <section>
                <div className="flex items-center gap-3 mb-6 border-l-4 border-blue-500 pl-4">
                    <h2 className="text-xl font-black uppercase italic tracking-tight text-white">
                        Full Sector Breakdown
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {sortedSectors.map(([sector, stats]) => (
                        <Card key={sector} className="bg-zinc-950 border-zinc-800 rounded-2xl hover:border-blue-500/30 transition-colors">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-[10px] font-black uppercase text-zinc-500 flex justify-between">
                                    {sector}
                                    <span className="text-blue-400 italic">{stats.total}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {stats.categories.slice(0, 5).map(cat => (
                                        <Badge key={cat} variant="secondary" className="bg-zinc-900 text-[8px] font-bold uppercase p-0.5 px-1 text-zinc-400 border-none">
                                            {cat}
                                        </Badge>
                                    ))}
                                    {stats.categories.length > 5 && (
                                        <span className="text-[8px] font-black text-zinc-500 uppercase italic">+{stats.categories.length - 5} more</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
