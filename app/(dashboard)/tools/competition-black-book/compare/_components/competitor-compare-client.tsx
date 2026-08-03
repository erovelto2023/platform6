"use client";

import { useState } from "react";
import Link from "next/link";
import { 
    ArrowLeft, 
    Globe, 
    Building2, 
    MapPin, 
    Phone, 
    Mail, 
    Tag, 
    Key, 
    Layers, 
    DollarSign, 
    Award, 
    Lock, 
    Lightbulb, 
    ExternalLink, 
    BarChart3, 
    ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompetitorCompareClientProps {
    competitors: any[];
    ideas: any[];
}

export function CompetitorCompareClient({ competitors, ideas }: CompetitorCompareClientProps) {
    // Select default first 3 competitors
    const [selectedIds, setSelectedIds] = useState<string[]>(
        competitors.slice(0, 3).map(c => c._id)
    );

    const toggleCompetitor = (id: string) => {
        if (selectedIds.includes(id)) {
            if (selectedIds.length <= 1) return; // Keep at least 1
            setSelectedIds(prev => prev.filter(i => i !== id));
        } else {
            if (selectedIds.length >= 5) return; // Max 5
            setSelectedIds(prev => [...prev, id]);
        }
    };

    const selectedCompetitors = competitors.filter(c => selectedIds.includes(c._id));

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            
            {/* TOP HEADER */}
            <div className="space-y-4">
                <Link href="/tools/competition-black-book" className="inline-flex items-center text-xs font-mono font-bold text-rose-400 hover:text-amber-300 transition">
                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                    Back to Competition Black Book
                </Link>

                <div className="relative rounded-3xl p-8 md:p-10 overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl space-y-6">
                    <div className="space-y-3 max-w-3xl">
                        <span className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <BarChart3 className="h-4 w-4" /> SIDE-BY-SIDE COMPETITOR MATRIX
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-100 uppercase font-mono">
                            Multi-Competitor <span className="bg-gradient-to-r from-rose-400 via-amber-400 to-cyan-400 bg-clip-text text-transparent">Comparison</span>
                        </h1>
                        <p className="text-slate-300 text-sm font-mono leading-relaxed">
                            Compare up to 5 competitors side-by-side across pricing models, niche markets, tech stacks, advantages, and market gaps to formulate winning positioning strategies.
                        </p>
                    </div>

                    {/* COMPETITOR SELECTOR PILLS */}
                    <div className="space-y-2 pt-2 border-t border-slate-800 font-mono text-xs">
                        <span className="text-slate-400 font-bold uppercase text-[10px]">Select Competitors to Compare (1 to 5):</span>
                        <div className="flex flex-wrap gap-2">
                            {competitors.map(c => {
                                const isSelected = selectedIds.includes(c._id);
                                return (
                                    <button
                                        key={c._id}
                                        onClick={() => toggleCompetitor(c._id)}
                                        className={`px-3.5 py-1.5 rounded-xl font-bold uppercase transition flex items-center gap-2 cursor-pointer ${
                                            isSelected 
                                                ? "bg-rose-600 text-white shadow-lg border border-rose-500" 
                                                : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                                        }`}
                                    >
                                        <Building2 className="h-3.5 w-3.5" />
                                        {c.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* COMPARISON MATRIX TABLE */}
            {selectedCompetitors.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center shadow-xl space-y-3">
                    <Building2 className="h-12 w-12 text-slate-600 mx-auto" />
                    <h3 className="text-base font-bold font-mono text-slate-200">No Competitors Selected</h3>
                    <p className="text-xs font-mono text-slate-400">Please select at least one competitor above to view the matrix.</p>
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950">
                                <th className="p-4 w-56 font-bold uppercase text-slate-400 bg-slate-950 sticky left-0 z-10 border-r border-slate-800">
                                    Metric / Attribute
                                </th>
                                {selectedCompetitors.map(comp => (
                                    <th key={comp._id} className="p-4 min-w-[240px] font-black text-slate-100 border-r border-slate-800/80">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-rose-400 font-bold shrink-0">
                                                {comp.name.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-slate-100">{comp.name}</div>
                                                <Link href={`/tools/competition-black-book/${comp._id}`} className="text-[10px] text-rose-400 hover:underline">
                                                    Open Intel Dashboard →
                                                </Link>
                                            </div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-800/80">
                            {/* SECTION: GENERAL PROFILE */}
                            <tr className="bg-slate-950/60 font-bold text-amber-400 uppercase text-[10px]">
                                <td colSpan={selectedCompetitors.length + 1} className="p-3 font-mono tracking-wider">
                                    1. Profile & Market Facts
                                </td>
                            </tr>

                            <tr>
                                <td className="p-4 font-bold text-slate-300 bg-slate-950/80 sticky left-0 border-r border-slate-800">
                                    Web Address
                                </td>
                                {selectedCompetitors.map(comp => (
                                    <td key={comp._id} className="p-4 border-r border-slate-800/80 text-slate-200">
                                        {comp.webAddress ? (
                                            <a href={comp.webAddress.startsWith('http') ? comp.webAddress : `https://${comp.webAddress}`} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline flex items-center gap-1">
                                                {comp.webAddress.replace(/^https?:\/\//, '')} <ExternalLink className="h-3 w-3" />
                                            </a>
                                        ) : "N/A"}
                                    </td>
                                ))}
                            </tr>

                            <tr>
                                <td className="p-4 font-bold text-slate-300 bg-slate-950/80 sticky left-0 border-r border-slate-800">
                                    Niche Market
                                </td>
                                {selectedCompetitors.map(comp => (
                                    <td key={comp._id} className="p-4 border-r border-slate-800/80 text-slate-200 font-bold">
                                        {comp.nicheMarket || "N/A"}
                                    </td>
                                ))}
                            </tr>

                            <tr>
                                <td className="p-4 font-bold text-slate-300 bg-slate-950/80 sticky left-0 border-r border-slate-800">
                                    Target Keyword
                                </td>
                                {selectedCompetitors.map(comp => (
                                    <td key={comp._id} className="p-4 border-r border-slate-800/80 text-slate-200 font-bold">
                                        {comp.primaryKeyword || "N/A"}
                                    </td>
                                ))}
                            </tr>

                            <tr>
                                <td className="p-4 font-bold text-slate-300 bg-slate-950/80 sticky left-0 border-r border-slate-800">
                                    HQ Location
                                </td>
                                {selectedCompetitors.map(comp => (
                                    <td key={comp._id} className="p-4 border-r border-slate-800/80 text-slate-300">
                                        {[comp.city, comp.state, comp.country].filter(Boolean).join(", ") || "N/A"}
                                    </td>
                                ))}
                            </tr>

                            {/* SECTION: PRICING & PRODUCTS */}
                            <tr className="bg-slate-950/60 font-bold text-amber-400 uppercase text-[10px]">
                                <td colSpan={selectedCompetitors.length + 1} className="p-3 font-mono tracking-wider">
                                    2. Product & Pricing Strategy
                                </td>
                            </tr>

                            <tr>
                                <td className="p-4 font-bold text-slate-300 bg-slate-950/80 sticky left-0 border-r border-slate-800">
                                    Pricing Data Logged
                                </td>
                                {selectedCompetitors.map(comp => {
                                    const pricing = comp.modulesData?.pricingStrategy;
                                    const itemCount = Array.isArray(pricing?.items) ? pricing.items.length : 0;
                                    return (
                                        <td key={comp._id} className="p-4 border-r border-slate-800/80 text-slate-200">
                                            <span className="font-bold text-emerald-400">{itemCount} Pricing Plans Logged</span>
                                        </td>
                                    );
                                })}
                            </tr>

                            {/* SECTION: TECH STACK */}
                            <tr className="bg-slate-950/60 font-bold text-amber-400 uppercase text-[10px]">
                                <td colSpan={selectedCompetitors.length + 1} className="p-3 font-mono tracking-wider">
                                    3. Technology Stack & Counter-Ideas
                                </td>
                            </tr>

                            <tr>
                                <td className="p-4 font-bold text-slate-300 bg-slate-950/80 sticky left-0 border-r border-slate-800">
                                    Tech Stack Detected
                                </td>
                                {selectedCompetitors.map(comp => {
                                    const tech = comp.modulesData?.techStack;
                                    const itemCount = Array.isArray(tech?.items) ? tech.items.length : 0;
                                    return (
                                        <td key={comp._id} className="p-4 border-r border-slate-800/80 text-slate-200">
                                            <span className="font-bold text-cyan-400">{itemCount} Technologies Tracked</span>
                                        </td>
                                    );
                                })}
                            </tr>

                            <tr>
                                <td className="p-4 font-bold text-slate-300 bg-slate-950/80 sticky left-0 border-r border-slate-800">
                                    Counter-Ideas Logged
                                </td>
                                {selectedCompetitors.map(comp => {
                                    const compIdeas = ideas.filter(i => i.competitorId === comp._id);
                                    return (
                                        <td key={comp._id} className="p-4 border-r border-slate-800/80 text-slate-200 font-bold">
                                            <span className="text-amber-400">{compIdeas.length} Counter-Ideas</span>
                                        </td>
                                    );
                                })}
                            </tr>

                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
}
