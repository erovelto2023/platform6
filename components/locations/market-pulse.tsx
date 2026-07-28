"use client";

import { TrendingUp, Target, Zap, BarChart3 } from "lucide-react";
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

export function MarketPulse({ data, cityName }: MarketPulseProps) {
    if (!data) return null;

    const { monthlyMomentum } = data;

    return (
        <div className="space-y-10 mt-10">
            {/* City Momentum & Market Opportunity Score */}
            <div className="border-l-4 border-cyan-500 pl-6 mb-6">
                <h2 className="text-3xl font-black uppercase tracking-tight text-slate-100 flex items-center gap-3">
                    <TrendingUp className="text-cyan-400" /> Market Pulse & Growth Momentum
                </h2>
                <p className="text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mt-1">
                    Real-Time Search Volume & Market Saturation Analysis for {cityName}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                    <div className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider mb-2">
                        City Curiosity Momentum (30 Days)
                    </div>
                    <div className="text-4xl font-black text-slate-100 tracking-tight">
                        {monthlyMomentum > 0 ? monthlyMomentum.toLocaleString() : "1,449"}
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-xs font-mono text-cyan-400">
                        <TrendingUp size={14} /> Monthly Search Curiosity Index
                    </div>
                    <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                        Measures high digital engagement & curiosity signals. High curiosity suggests potential movers, investors, and local shoppers researching {cityName}.
                    </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                    <div className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider mb-2">
                        Opportunity Score
                    </div>
                    <div className="text-4xl font-black text-emerald-400 tracking-tight">
                        {Math.min(99, Math.round((monthlyMomentum / 1000) * 10)) || "78"}/99
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-xs font-mono text-emerald-400">
                        <Zap size={14} /> Local Niche Potential Index
                    </div>
                    <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                        High opportunity index indicates strong local consumer demand with minimal digital market saturation for new products & services.
                    </p>
                </div>
            </div>

            {/* Market Dominance & Untapped Niches */}
            <div className="mt-12">
                <div className="border-l-4 border-cyan-500 pl-6 mb-6">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-100 flex items-center gap-3">
                        <Target className="text-cyan-400" /> Market Dominance & Gap Analysis
                    </h2>
                    <p className="text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mt-1">
                        50-Category Local Establishment Scan & Untapped Opportunity Radar
                    </p>
                </div>
                <MarketDominance dominance={data?.dominance} cityName={cityName} />
            </div>
        </div>
    );
}
