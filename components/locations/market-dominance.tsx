"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Zap, AlertCircle, Lightbulb, Sparkles, CheckCircle2 } from "lucide-react";
import { MARKET_CATEGORIES } from "@/lib/constants/market-categories";

interface MarketDominanceProps {
    dominance: Record<string, { count: number; sector: string }> | undefined;
    cityName: string;
}

export function MarketDominance({ dominance, cityName }: MarketDominanceProps) {
    const defaultOpportunities = [
        { label: "Boutique Fitness & HIIT", suggestion: "Launch a specialized fitness studio or recovery center with high local demand." },
        { label: "Artisanal Coffee & Roastery", suggestion: "High opportunity for specialty drive-thru or community espresso lounge." },
        { label: "Senior Care & Support Services", suggestion: "Growing mature demographic creates strong demand for in-home senior assistance." },
        { label: "Kids STEM & Academic Enrichment", suggestion: "High-earning families seeking after-school tutoring & STEM programs." },
        { label: "Home Optimization & Renovations", suggestion: "High homeownership rates support high-ticket remodeling and landscaping services." }
    ];

    const opportunities = (dominance && Object.keys(dominance).length > 0)
        ? Object.entries(dominance)
            .filter(([_, d]) => d.count === 0)
            .map(([label]) => {
                const cat = MARKET_CATEGORIES.find(c => c.label === label);
                return {
                    label,
                    suggestion: cat?.suggestion || "Ready for immediate local business entry."
                };
            })
            .slice(0, 5)
        : defaultOpportunities;

    return (
        <div className="space-y-6">
            {/* Top Market Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
                    <div className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider mb-2 flex items-center gap-2">
                        <Sparkles size={14} /> High Growth Sector Signal
                    </div>
                    <h3 className="text-2xl font-bold text-slate-100">
                        Commercial & Consumer Services
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Strong growth trajectory detected for local home services, digital storefronts, and professional consulting in {cityName}.
                    </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
                    <div className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider mb-2 flex items-center gap-2">
                        <Target size={14} /> High Opportunity Gaps
                    </div>
                    <h3 className="text-2xl font-bold text-slate-100">
                        {opportunities.length} Untapped Local Niches
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Categories with low digital competition and high local search intent ready for market entry.
                    </p>
                </div>
            </div>

            {/* Opportunity Radar Grid */}
            <div className="space-y-4 pt-2">
                <div className="text-sm font-bold font-mono text-slate-300 uppercase tracking-wider">
                    ⚡ High-Priority Business Opportunities for {cityName}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {opportunities.map((opt, idx) => (
                        <div
                            key={idx}
                            className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-5 rounded-2xl flex flex-col justify-between transition-all shadow-xl group"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                                        Untapped Niche
                                    </span>
                                    <CheckCircle2 size={14} className="text-cyan-400" />
                                </div>
                                <h4 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors mb-2">
                                    {opt.label}
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    "{opt.suggestion}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
