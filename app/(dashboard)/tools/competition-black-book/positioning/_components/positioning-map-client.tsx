"use client";

import { useState } from "react";
import Link from "next/link";
import { 
    ArrowLeft, 
    Target, 
    Building2, 
    Sparkles, 
    Compass, 
    Sliders,
    Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PositioningMapClientProps {
    competitors: any[];
}

export function PositioningMapClient({ competitors }: PositioningMapClientProps) {
    const [xAxisLabel, setXAxisLabel] = useState("Price (Low ↔ High)");
    const [yAxisLabel, setYAxisLabel] = useState("Feature Depth (Basic ↔ Advanced)");

    // Competitor position coordinates (x: 0 to 100, y: 0 to 100)
    const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() => {
        const initial: Record<string, { x: number; y: number }> = {};
        competitors.forEach((c, idx) => {
            // Assign distributed initial coordinates
            initial[c._id] = {
                x: 20 + ((idx * 25) % 65),
                y: 30 + ((idx * 30) % 55)
            };
        });
        return initial;
    });

    const updateCoordinate = (id: string, axis: 'x' | 'y', val: number) => {
        setPositions(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [axis]: Math.min(90, Math.max(10, val))
            }
        }));
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            
            {/* HERO */}
            <div className="space-y-4">
                <Link href="/tools/competition-black-book" className="inline-flex items-center text-xs font-mono font-bold text-amber-400 hover:text-amber-300 transition">
                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                    Back to Competition Black Book
                </Link>

                <div className="relative rounded-3xl p-8 md:p-10 overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl space-y-6">
                    <div className="space-y-3 max-w-3xl">
                        <span className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Compass className="h-4 w-4" /> INTERACTIVE 2X2 MARKET POSITIONING MAP
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-100 uppercase font-mono">
                            Market White Space <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">Finder</span>
                        </h1>
                        <p className="text-slate-300 text-sm font-mono leading-relaxed">
                            Plot competitors on a 2D matrix to visually identify uncrowded market opportunities, pricing sweet spots, and strategic positioning gaps.
                        </p>
                    </div>

                    {/* AXIS SETTINGS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 font-mono text-xs">
                        <div>
                            <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">X-Axis Metric (Horizontal)</label>
                            <Input value={xAxisLabel} onChange={e => setXAxisLabel(e.target.value)} className="bg-slate-950 border-slate-800" />
                        </div>
                        <div>
                            <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Y-Axis Metric (Vertical)</label>
                            <Input value={yAxisLabel} onChange={e => setYAxisLabel(e.target.value)} className="bg-slate-950 border-slate-800" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2X2 CANVAS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* INTERACTIVE CANVAS */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative min-h-[500px] flex flex-col justify-between font-mono">
                    
                    {/* Y-AXIS LABEL TOP */}
                    <div className="text-center font-bold text-amber-400 text-xs uppercase tracking-widest bg-slate-950/80 p-2 rounded-xl border border-slate-800 max-w-xs mx-auto">
                        ▲ HIGH {yAxisLabel}
                    </div>

                    {/* CANVAS AREA */}
                    <div className="relative my-6 h-[380px] border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/80 overflow-hidden flex items-center justify-center">
                        {/* QUADRANT CROSSHAIRS */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-full h-px bg-slate-800/80"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="h-full w-px bg-slate-800/80"></div>
                        </div>

                        {/* QUADRANT LABELS */}
                        <span className="absolute top-3 left-4 text-[10px] text-slate-500 font-bold uppercase">Q1: Premium / Feature-Rich</span>
                        <span className="absolute top-3 right-4 text-[10px] text-slate-500 font-bold uppercase">Q2: High-Price / Enterprise</span>
                        <span className="absolute bottom-3 left-4 text-[10px] text-slate-500 font-bold uppercase">Q3: Budget / Simple</span>
                        <span className="absolute bottom-3 right-4 text-[10px] text-slate-500 font-bold uppercase">Q4: High-Price / Basic</span>

                        {/* OUR BRAND TARGET BADGE */}
                        <div 
                            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs px-3.5 py-2 rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-1.5 animate-pulse"
                            style={{ left: `25%`, top: `35%` }}
                        >
                            <Sparkles className="h-4 w-4" />
                            OUR BRAND OPPORTUNITY
                        </div>

                        {/* COMPETITOR NODES */}
                        {competitors.map(c => {
                            const pos = positions[c._id] || { x: 50, y: 50 };
                            return (
                                <div 
                                    key={c._id}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-rose-950 border border-rose-700 text-rose-300 font-bold text-xs px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2"
                                    style={{ left: `${pos.x}%`, top: `${100 - pos.y}%` }}
                                >
                                    <Building2 className="h-3.5 w-3.5 text-rose-400" />
                                    {c.name}
                                </div>
                            );
                        })}
                    </div>

                    {/* X-AXIS LABEL BOTTOM */}
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                        <span>◄ LOW {xAxisLabel}</span>
                        <span>HIGH {xAxisLabel} ►</span>
                    </div>
                </div>

                {/* COMPETITOR POSITION CONTROLS */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 font-mono text-xs">
                    <div>
                        <h3 className="text-base font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2">
                            <Sliders className="h-4 w-4 text-amber-400" />
                            Competitor Position Controls
                        </h3>
                        <p className="text-slate-400 text-[11px] mt-1">
                            Adjust sliders to position competitors on the 2x2 map grid.
                        </p>
                    </div>

                    <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                        {competitors.map(c => {
                            const pos = positions[c._id] || { x: 50, y: 50 };
                            return (
                                <div key={c._id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-200">{c.name}</span>
                                        <span className="text-[10px] text-amber-400 font-bold">X: {pos.x}% | Y: {pos.y}%</span>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Horizontal ({xAxisLabel})</label>
                                        <input 
                                            type="range" 
                                            min="10" 
                                            max="90" 
                                            value={pos.x} 
                                            onChange={e => updateCoordinate(c._id, 'x', Number(e.target.value))}
                                            className="w-full accent-rose-500 cursor-pointer"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Vertical ({yAxisLabel})</label>
                                        <input 
                                            type="range" 
                                            min="10" 
                                            max="90" 
                                            value={pos.y} 
                                            onChange={e => updateCoordinate(c._id, 'y', Number(e.target.value))}
                                            className="w-full accent-amber-500 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

        </div>
    );
}
