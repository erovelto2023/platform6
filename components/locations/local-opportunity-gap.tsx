"use client";

import { Lightbulb, Target, Zap, TrendingUp, CheckCircle2, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LocalOpportunityGapProps {
    cityName: string;
    medianIncome: number;
    medianAge: number;
}

export function LocalOpportunityGap({ cityName, medianIncome, medianAge }: LocalOpportunityGapProps) {
    const isAffluent = medianIncome > 65000;
    const isMature = medianAge > 40;

    const gaps = [
        {
            title: isMature ? "Mobile Senior Wellness & Concierge" : "On-Demand Youth Activities & Tutoring",
            category: isMature ? "Senior Care" : "Education & Family",
            score: "98% Demand Fit",
            reason: isMature ? "High density of seniors over 65 seeking in-home wellness and companionship." : "High percentage of families with children seeking STEM & sports programs.",
            pricing: isAffluent ? "$120 - $250 / visit" : "$45 - $95 / session",
            format: "Subscription + On-Demand"
        },
        {
            title: isAffluent ? "Smart Home & Energy Efficiency Upgrade Hub" : "Mobile Auto Repair & Maintenance",
            category: isAffluent ? "Home Technology" : "Automotive & Mobility",
            score: "94% Demand Fit",
            reason: isAffluent ? "High homeownership rates with disposable income for solar & smart automation." : "Commuter-heavy populace preferring doorstep maintenance over shop drop-offs.",
            pricing: isAffluent ? "$1,500 - $5,000 / project" : "$89 - $299 / service",
            format: "One-Time High-Ticket"
        },
        {
            title: "Bilingual Local Services & Direct Outreach",
            category: "Multilingual Business",
            score: "91% Demand Fit",
            reason: "Growing multicultural populace needing reliable, native-language contractors & financial services.",
            pricing: "Standard Market + 15% Premium",
            format: "Retainer & Service Fee"
        },
        {
            title: "Concierge Pet Care & Mobile Grooming",
            category: "Pet & Lifestyle",
            score: "89% Demand Fit",
            reason: "High pet ownership rate combined with busy working professionals needing doorstep convenience.",
            pricing: "$75 - $160 / appointment",
            format: "Monthly Pet Membership"
        }
    ];

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                        <Lightbulb size={14} /> Market Arbitrage & Opportunity
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-2.5">
                        <TrendingUp className="text-cyan-400" size={24} /> Underserved Local Business Gaps
                    </h2>
                </div>
                <Badge variant="outline" className="text-xs font-mono border-slate-700 bg-slate-950 text-cyan-400 px-3 py-1.5 self-start sm:self-center font-bold">
                    Market Target: {cityName}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gaps.map((gap) => (
                    <div key={gap.title} className="p-5 bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-2xl flex flex-col justify-between transition shadow-xl space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Badge className="bg-cyan-950 border border-cyan-800 text-cyan-400 text-[9px] font-mono uppercase">
                                    {gap.category}
                                </Badge>
                                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 size={12} /> {gap.score}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-100 leading-snug">{gap.title}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{gap.reason}</p>
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
                            <div>
                                <span className="text-[10px] text-slate-500 block">Recommended Price Point</span>
                                <span className="text-slate-200 font-bold">{gap.pricing}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] text-slate-500 block">Revenue Model</span>
                                <span className="text-cyan-400 font-bold">{gap.format}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
