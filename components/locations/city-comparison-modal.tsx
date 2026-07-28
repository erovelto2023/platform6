"use client";

import { useState } from "react";
import { Scale, X, ArrowRightLeft, Check, Sparkles, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CityComparisonModalProps {
    currentCity: string;
    currentState: string;
    currentStats: any;
}

export function CityComparisonModal({ currentCity, currentState, currentStats }: CityComparisonModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [compareTarget, setCompareTarget] = useState("columbia-sc");

    const comparisonTargets: Record<string, { city: string; state: string; pop: number; income: number; age: number; pricing: string; marriedPct: number }> = {
        "columbia-sc": { city: "Columbia", state: "South Carolina", pop: 137300, income: 51200, age: 31, pricing: "Moderate Value", marriedPct: 38 },
        "greenville-sc": { city: "Greenville", state: "South Carolina", pop: 72200, income: 64800, age: 38, pricing: "High-Ticket Premium", marriedPct: 49 },
        "wilmington-de": { city: "Wilmington", state: "Delaware", pop: 70900, income: 48900, age: 36, pricing: "Value First", marriedPct: 34 },
        "charlotte-nc": { city: "Charlotte", state: "North Carolina", pop: 879700, income: 74100, age: 34, pricing: "High-Ticket Premium", marriedPct: 52 },
        "atlanta-ga": { city: "Atlanta", state: "Georgia", pop: 498700, income: 77600, age: 33, pricing: "High-Ticket Premium", marriedPct: 41 },
    };

    const target = comparisonTargets[compareTarget] || comparisonTargets["columbia-sc"];

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-cyan-500 text-cyan-400 hover:text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition cursor-pointer shadow-lg"
            >
                <Scale size={14} /> Compare {currentCity} vs. Another City
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <div className="flex items-center gap-2">
                                <Scale className="text-cyan-400" size={20} />
                                <h3 className="text-xl font-black text-slate-100 uppercase tracking-tight">
                                    Side-by-Side Market Comparison
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-100 bg-slate-950 border border-slate-800 rounded-xl transition cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-mono text-slate-400 uppercase font-bold block">
                                Choose Comparison Market:
                            </label>
                            <select
                                value={compareTarget}
                                onChange={(e) => setCompareTarget(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono rounded-xl p-3 focus:outline-none focus:border-cyan-500 transition cursor-pointer"
                            >
                                <option value="columbia-sc">Columbia, SC</option>
                                <option value="greenville-sc">Greenville, SC</option>
                                <option value="wilmington-de">Wilmington, DE</option>
                                <option value="charlotte-nc">Charlotte, NC</option>
                                <option value="atlanta-ga">Atlanta, GA</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            {/* Current City Column */}
                            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                                <div className="border-b border-slate-800 pb-2">
                                    <Badge className="bg-cyan-950 text-cyan-400 border border-cyan-800 text-[9px] font-mono uppercase mb-1">
                                        Current Market
                                    </Badge>
                                    <h4 className="text-lg font-black text-slate-100">{currentCity}</h4>
                                    <p className="text-xs font-mono text-slate-400">{currentState}</p>
                                </div>

                                <div className="space-y-3 text-xs font-mono">
                                    <div>
                                        <span className="text-slate-400 block text-[10px]">Population Reach</span>
                                        <span className="text-slate-100 font-bold text-sm">{(currentStats?.population || 14850).toLocaleString()}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px]">Median Income</span>
                                        <span className="text-cyan-400 font-bold text-sm">${(currentStats?.medianIncome || 74200).toLocaleString()}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px]">Median Age</span>
                                        <span className="text-slate-100 font-bold text-sm">{currentStats?.audience?.medianAge || 38} YRS</span>
                                    </div>
                                </div>
                            </div>

                            {/* Comparison Target Column */}
                            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                                <div className="border-b border-slate-800 pb-2">
                                    <Badge className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-mono uppercase mb-1">
                                        Benchmark Target
                                    </Badge>
                                    <h4 className="text-lg font-black text-slate-100">{target.city}</h4>
                                    <p className="text-xs font-mono text-slate-400">{target.state}</p>
                                </div>

                                <div className="space-y-3 text-xs font-mono">
                                    <div>
                                        <span className="text-slate-400 block text-[10px]">Population Reach</span>
                                        <span className="text-slate-100 font-bold text-sm">{target.pop.toLocaleString()}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px]">Median Income</span>
                                        <span className="text-emerald-400 font-bold text-sm">${target.income.toLocaleString()}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px]">Median Age</span>
                                        <span className="text-slate-100 font-bold text-sm">{target.age} YRS</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-slate-300 leading-relaxed">
                            <strong className="text-cyan-400 block mb-1">Strategic Market Takeaway:</strong>
                            {currentCity} features a {currentStats?.medianIncome > target.income ? "higher median household income" : "more affordable entry point"} compared to {target.city}, offering strong potential for {currentStats?.medianIncome > target.income ? "premium value-add services" : "volume-first consumer products"}.
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
