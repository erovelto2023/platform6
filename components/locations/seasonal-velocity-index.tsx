"use client";

import { Calendar, Sun, Snowflake, Leaf, Flower2, TrendingUp, Zap, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SeasonalVelocityIndexProps {
    cityName: string;
    stateName: string;
}

export function SeasonalVelocityIndex({ cityName, stateName }: SeasonalVelocityIndexProps) {
    const isSouthern = ["South Carolina", "Florida", "Georgia", "North Carolina", "Texas"].includes(stateName);

    const quarters = [
        {
            q: "Q1 (Jan - Mar)",
            icon: Snowflake,
            velocity: "Moderate",
            score: "72/100",
            theme: "New Year Goals & Indoor Services",
            focus: "Fitness, Tax prep, Home renovation planning, Health checkups.",
            adStrategy: "Focus on digital search ads for self-improvement and high-intent services."
        },
        {
            q: "Q2 (Apr - Jun)",
            icon: Flower2,
            velocity: isSouthern ? "Peak Surge" : "High Momentum",
            score: isSouthern ? "96/100" : "88/100",
            theme: isSouthern ? "Spring Tourism & Outdoor Living" : "Spring Home & Lawn Care",
            focus: "Landscaping, Travel/Tourism, Outdoor dining, Event catering.",
            adStrategy: "Run local geo-fenced social video ads (FB/IG/TikTok) for local foot traffic."
        },
        {
            q: "Q3 (Jul - Sep)",
            icon: Sun,
            velocity: isSouthern ? "High Volume" : "Peak Summer",
            score: "91/100",
            theme: "Summer Travel & Back to School",
            focus: "Childcare, Sports camps, Tourism, HVAC maintenance, Back-to-school tutoring.",
            adStrategy: "Deploy family-targeted offer bundles & mobile coupon pushes."
        },
        {
            q: "Q4 (Oct - Dec)",
            icon: Leaf,
            velocity: "Peak Holiday Retail",
            score: "98/100",
            theme: "Holiday Shopping & Year-End Budgets",
            focus: "Local gift shops, Corporate events, Holiday catering, Professional services.",
            adStrategy: "High-frequency retargeting campaigns & direct-response promotional codes."
        }
    ];

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                        <Clock size={14} /> Seasonality & Foot-Traffic Radar
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-2.5">
                        <TrendingUp className="text-cyan-400" size={24} /> Seasonal Marketing Velocity Index
                    </h2>
                </div>
                <Badge variant="outline" className="text-xs font-mono border-slate-700 bg-slate-950 text-cyan-400 px-3 py-1.5 self-start sm:self-center font-bold">
                    Regional Climate: {isSouthern ? "Subtropical / Coastal" : "Continental Temperate"}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quarters.map((q) => {
                    const IconComponent = q.icon;
                    return (
                        <div key={q.q} className="p-5 bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-2xl flex flex-col justify-between transition shadow-xl space-y-4">
                            <div>
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-2 text-cyan-400">
                                        <IconComponent size={18} />
                                        <span className="text-xs font-mono font-bold uppercase">{q.q}</span>
                                    </div>
                                    <Badge className="bg-slate-900 border border-slate-700 text-cyan-400 text-[9px] font-mono">
                                        {q.score}
                                    </Badge>
                                </div>

                                <div className="mt-3 space-y-2">
                                    <div className="text-sm font-bold text-slate-100">{q.theme}</div>
                                    <p className="text-xs text-slate-400 leading-relaxed">{q.focus}</p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-800">
                                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block mb-1">Recommended Ad Strategy</span>
                                <p className="text-[11px] text-slate-400 leading-tight">{q.adStrategy}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
