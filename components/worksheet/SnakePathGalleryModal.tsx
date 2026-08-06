"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
    PRE_DRAWN_PATH_TEMPLATES_100,
    PathTemplateMeta,
    PRE_DRAWN_SINGLE_PATH_SEGMENTS_100,
    SinglePathSegmentMeta,
} from "@/lib/worksheet-fabric";
import { Route, Check, Layers, Spline, Search } from "lucide-react";

interface SnakePathGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentTemplateId?: number;
    onSelectTemplate: (template: PathTemplateMeta) => void;
    onSelectSegment?: (segment: SinglePathSegmentMeta) => void;
    initialView?: "single_segments" | "full_mazes";
}

export const SnakePathGalleryModal: React.FC<SnakePathGalleryModalProps> = ({
    isOpen,
    onClose,
    currentTemplateId,
    onSelectTemplate,
    onSelectSegment,
    initialView = "single_segments",
}) => {
    const [activeViewMode, setActiveViewMode] = useState<"single_segments" | "full_mazes">(initialView);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        if (isOpen) {
            setActiveViewMode(initialView);
            setSelectedCategory("all");
            setSearchQuery("");
        }
    }, [isOpen, initialView]);

    const filteredSegments = PRE_DRAWN_SINGLE_PATH_SEGMENTS_100.filter((s) => {
        if (selectedCategory !== "all" && s.category !== selectedCategory) return false;
        if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase()) && !String(s.id).includes(searchQuery)) return false;
        return true;
    });

    const filteredTemplates = PRE_DRAWN_PATH_TEMPLATES_100.filter((t) => {
        if (selectedCategory !== "all" && t.category !== selectedCategory) return false;
        if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase()) && !String(t.id).includes(searchQuery)) return false;
        return true;
    });

    const segmentCategoryTabs = [
        { value: "all", label: "All (100)", color: "text-slate-300" },
        { value: "sweeps", label: "Sweeps", color: "text-emerald-400" },
        { value: "waves", label: "Waves", color: "text-blue-400" },
        { value: "loops", label: "Loops", color: "text-purple-400" },
        { value: "zigzags", label: "Zigzags", color: "text-amber-400" },
        { value: "serpentine", label: "Serpentine", color: "text-rose-400" },
    ];

    const mazeCategoryTabs = [
        { value: "all", label: "All (100)", color: "text-slate-300" },
        { value: "easy", label: "Easy", color: "text-emerald-400" },
        { value: "medium", label: "Medium", color: "text-blue-400" },
        { value: "hard", label: "Hard", color: "text-purple-400" },
        { value: "expert", label: "Expert", color: "text-amber-400" },
    ];

    const activeTabs = activeViewMode === "single_segments" ? segmentCategoryTabs : mazeCategoryTabs;

    const badgeColorsSegment: Record<string, string> = {
        sweeps: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        waves: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        loops: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        zigzags: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        serpentine: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    };

    const badgeColorsMaze: Record<string, string> = {
        easy: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        medium: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        hard: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        expert: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[92vw] w-[1100px] h-[88vh] flex flex-col p-0 gap-0 overflow-hidden bg-slate-900 text-slate-100 border-slate-800 rounded-2xl">

                {/* Header */}
                <DialogHeader className="px-6 pt-5 pb-4 border-b border-slate-800 bg-slate-950 shrink-0">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30 shrink-0">
                                <Route className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
                                    {activeViewMode === "single_segments" ? "Single Pre-Drawn Path Library" : "Full Path Maze Gallery"}
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                                        100 Unique
                                    </span>
                                </DialogTitle>
                                <DialogDescription className="text-[11px] text-slate-400 mt-0.5">
                                    {activeViewMode === "single_segments"
                                        ? "Click any card to insert that path segment onto your canvas."
                                        : "Select a complete multi-path maze puzzle configuration."}
                                </DialogDescription>
                            </div>
                        </div>

                        {/* View Mode Switcher */}
                        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
                            <Button
                                size="sm"
                                variant={activeViewMode === "single_segments" ? "default" : "ghost"}
                                className={`h-7 px-3 text-xs font-bold ${activeViewMode === "single_segments" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                                onClick={() => { setActiveViewMode("single_segments"); setSelectedCategory("all"); }}
                            >
                                <Spline className="w-3.5 h-3.5 mr-1.5" /> Single Paths
                            </Button>
                            <Button
                                size="sm"
                                variant={activeViewMode === "full_mazes" ? "default" : "ghost"}
                                className={`h-7 px-3 text-xs font-bold ${activeViewMode === "full_mazes" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                                onClick={() => { setActiveViewMode("full_mazes"); setSelectedCategory("all"); }}
                            >
                                <Layers className="w-3.5 h-3.5 mr-1.5" /> Full Mazes
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                {/* Filter Bar */}
                <div className="px-6 py-2.5 border-b border-slate-800 bg-slate-900/80 flex items-center gap-3 shrink-0 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-1 flex-wrap min-w-0">
                        {activeTabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setSelectedCategory(tab.value)}
                                className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all whitespace-nowrap ${
                                    selectedCategory === tab.value
                                        ? "bg-indigo-600 text-white border-indigo-500"
                                        : `bg-slate-950 border-slate-800 ${tab.color} hover:border-slate-600`
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative shrink-0 w-52">
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by # or name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-8 pl-8 pr-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <span className="text-[10px] font-bold text-slate-500 shrink-0 tabular-nums">
                        {(activeViewMode === "single_segments" ? filteredSegments : filteredTemplates).length} shown
                    </span>
                </div>

                {/* Gallery Grid */}
                <div className="flex-1 overflow-y-auto min-h-0 bg-slate-950/40">
                    {activeViewMode === "single_segments" ? (
                        <div className="p-5 grid grid-cols-5 gap-3">
                            {filteredSegments.map((segment) => (
                                <div
                                    key={segment.id}
                                    onClick={() => { if (onSelectSegment) onSelectSegment(segment); onClose(); }}
                                    className="group relative p-3 rounded-xl border bg-slate-900 border-slate-800 hover:border-indigo-500/60 hover:bg-slate-800/70 transition-all cursor-pointer flex flex-col gap-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col min-w-0 pr-1">
                                            <span className="text-[11px] font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                                                #{segment.id} {segment.name}
                                            </span>
                                        </div>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border capitalize shrink-0 ${badgeColorsSegment[segment.category] || ""}`}>
                                            {segment.category}
                                        </span>
                                    </div>

                                    <div className="h-32 bg-slate-950 rounded-lg border border-slate-800/80 group-hover:border-indigo-500/20 overflow-hidden flex items-center justify-center transition-colors">
                                        <svg viewBox="-40 20 280 480" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                                            <path d={segment.svgPathD} stroke="#1e293b" strokeWidth={24} strokeLinecap="butt" strokeLinejoin="round" fill="none" />
                                            <path d={segment.svgPathD} stroke="#334155" strokeWidth={22} strokeLinecap="butt" strokeLinejoin="round" fill="none" />
                                            <path d={segment.svgPathD} stroke="#6366f1" strokeWidth={12} strokeLinecap="butt" strokeLinejoin="round" fill="none" opacity={0.6} />
                                            <path d={segment.svgPathD} stroke="#f1f5f9" strokeWidth={8} strokeLinecap="butt" strokeLinejoin="round" fill="none" />
                                        </svg>
                                    </div>

                                    <Button
                                        size="sm"
                                        className="w-full h-7 text-[11px] font-bold rounded-lg bg-indigo-600/70 hover:bg-indigo-500 text-white transition-all group-hover:bg-indigo-600"
                                    >
                                        Insert #{segment.id}
                                    </Button>
                                </div>
                            ))}
                            {filteredSegments.length === 0 && (
                                <div className="col-span-5 py-20 text-center text-slate-500 text-sm">No segments match your filter.</div>
                            )}
                        </div>
                    ) : (
                        <div className="p-5 grid grid-cols-5 gap-3">
                            {filteredTemplates.map((template) => {
                                const isSelected = currentTemplateId === template.id;
                                return (
                                    <div
                                        key={template.id}
                                        onClick={() => { onSelectTemplate(template); onClose(); }}
                                        className={`group relative p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                                            isSelected
                                                ? "bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500/50"
                                                : "bg-slate-900 border-slate-800 hover:border-indigo-500/60 hover:bg-slate-800/70"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-white group-hover:text-indigo-300 transition-colors">
                                                #{template.id}
                                            </span>
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${badgeColorsMaze[template.category] || ""}`}>
                                                {template.pairCount} pairs
                                            </span>
                                        </div>

                                        <div className="h-32 bg-slate-950 rounded-lg border border-slate-800/80 group-hover:border-indigo-500/20 overflow-hidden relative flex items-center justify-center transition-colors">
                                            <svg viewBox="0 0 200 140" className="w-full h-full">
                                                <g strokeWidth={8} stroke="#334155" strokeLinecap="butt" fill="none">
                                                    {Array.from({ length: template.pairCount }).map((_, i) => {
                                                        const x1 = 20 + i * (160 / (template.pairCount - 1 || 1));
                                                        const ti = template.mapping[i] !== undefined ? template.mapping[i] : i;
                                                        const x2 = 20 + ti * (160 / (template.pairCount - 1 || 1));
                                                        return <path key={i} d={`M ${x1} 15 C ${x1} 50 ${x2} 90 ${x2} 125`} />;
                                                    })}
                                                </g>
                                                <g strokeWidth={4} stroke="#e2e8f0" strokeLinecap="butt" fill="none" opacity={0.8}>
                                                    {Array.from({ length: template.pairCount }).map((_, i) => {
                                                        const x1 = 20 + i * (160 / (template.pairCount - 1 || 1));
                                                        const ti = template.mapping[i] !== undefined ? template.mapping[i] : i;
                                                        const x2 = 20 + ti * (160 / (template.pairCount - 1 || 1));
                                                        return <path key={i} d={`M ${x1} 15 C ${x1} 50 ${x2} 90 ${x2} 125`} />;
                                                    })}
                                                </g>
                                            </svg>
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                                                    <div className="p-1.5 bg-indigo-600 text-white rounded-full shadow-lg">
                                                        <Check className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            size="sm"
                                            className={`w-full h-7 text-[11px] font-bold rounded-lg transition-all ${
                                                isSelected
                                                    ? "bg-indigo-600 text-white"
                                                    : "bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white"
                                            }`}
                                        >
                                            {isSelected ? "✓ Selected" : `Apply #${template.id}`}
                                        </Button>
                                    </div>
                                );
                            })}
                            {filteredTemplates.length === 0 && (
                                <div className="col-span-5 py-20 text-center text-slate-500 text-sm">No mazes match your filter.</div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
