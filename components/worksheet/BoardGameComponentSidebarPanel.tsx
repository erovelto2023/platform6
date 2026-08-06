"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BOARD_GAME_COMPONENTS, BoardComponentMeta, BoardComponentCategory } from "@/lib/board-game-components";
import { Search, Plus, Layers, Sparkles, Filter } from "lucide-react";
import { toast } from "sonner";
import * as fabric from "fabric";

interface BoardGameComponentSidebarPanelProps {
    getCanvasRef: () => fabric.Canvas | null;
}

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
    { value: "all", label: "All Categories (80+)" },
    { value: "basic", label: "🟢 Basic Spaces" },
    { value: "movement", label: "⏩ Movement Spaces" },
    { value: "turn", label: "⏱️ Turn Spaces" },
    { value: "dice", label: "🎲 Dice Spaces" },
    { value: "question", label: "❓ Question Spaces" },
    { value: "educational", label: "📖 Educational" },
    { value: "reward", label: "⭐ Reward Spaces" },
    { value: "penalty", label: "🛡️ Penalty Spaces" },
    { value: "card", label: "🎴 Card Spaces" },
    { value: "challenge", label: "🏆 Challenge Spaces" },
    { value: "minigame", label: "🎮 Mini-Games" },
    { value: "story-adventure", label: "🏰 Adventure" },
    { value: "rpg-economy", label: "🛒 RPG & Economy" },
    { value: "team-random", label: "👥 Team & Random" },
    { value: "time-interactive", label: "📱 Interactive & QR" },
    { value: "track", label: "🛤️ Track Connectors" },
    { value: "snakes-ladders", label: "🪜 Snakes & Ladders" },
    { value: "decorations", label: "✨ Decorations" },
    { value: "frames", label: "🖼️ Board Frames" },
];

export const BoardGameComponentSidebarPanel: React.FC<BoardGameComponentSidebarPanelProps> = ({
    getCanvasRef,
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredComponents = useMemo(() => {
        return BOARD_GAME_COMPONENTS.filter((c) => {
            if (selectedCategory !== "all" && c.category !== selectedCategory) return false;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchesName = c.name.toLowerCase().includes(q);
                const matchesDesc = c.description.toLowerCase().includes(q);
                const matchesId = String(c.id).includes(q);
                const matchesBehavior = c.behavior ? c.behavior.toLowerCase().includes(q) : false;
                return matchesName || matchesDesc || matchesId || matchesBehavior;
            }
            return true;
        });
    }, [selectedCategory, searchQuery]);

    const handleInsert = (comp: BoardComponentMeta) => {
        const canvas = getCanvasRef();
        if (!canvas) {
            toast.error("Canvas not found. Please try again.");
            return;
        }

        try {
            const fabricObj = comp.generator();
            
            // Offset positioning slightly if multiple objects are added so they don't stack directly on top
            const existingCount = canvas.getObjects().length;
            const stagger = (existingCount % 8) * 12;

            canvas.add(fabricObj);
            canvas.centerObject(fabricObj);
            
            fabricObj.set({
                left: (fabricObj.left || 0) + stagger,
                top: (fabricObj.top || 0) + stagger,
            });

            canvas.setActiveObject(fabricObj);
            canvas.requestRenderAll();
            canvas.fire("object:modified");

            toast.success(`Added "${comp.name}" to canvas!`);
        } catch (err) {
            console.error("Error inserting component:", err);
            toast.error(`Failed to insert component ${comp.name}`);
        }
    };

    return (
        <div className="space-y-2 pt-2 border-t border-amber-200 dark:border-amber-800/80">
            <div className="flex items-center justify-between">
                <Label className="text-[11px] font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider block flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Modular Space Library</span>
                </Label>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                    {filteredComponents.length} items
                </span>
            </div>

            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                Click any component below to drop it onto your canvas. Add as many spaces as you want!
            </p>

            {/* Filter & Search Controls */}
            <div className="space-y-1.5">
                <div className="relative">
                    <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Search spaces (e.g. start, +2, question)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-7 pl-7 pr-2 text-[11px] bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-800 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus-visible:ring-amber-500"
                    />
                </div>

                <div className="flex items-center gap-1">
                    <Filter className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full h-7 text-[10px] font-bold bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-900 dark:text-amber-200 px-1.5 focus:outline-none focus:border-amber-500"
                    >
                        {CATEGORY_OPTIONS.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Scrollable Component Palette Grid */}
            <div className="max-h-[320px] overflow-y-auto pr-1 space-y-1.5 scrollbar-thin scrollbar-thumb-amber-300 dark:scrollbar-thumb-amber-800">
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {filteredComponents.map((comp) => (
                        <div
                            key={comp.id}
                            onClick={() => handleInsert(comp)}
                            className="group p-2 bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/60 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50/80 dark:hover:bg-amber-950/40 rounded-xl transition-all cursor-pointer flex flex-col justify-between shadow-2xs"
                        >
                            <div className="flex items-center gap-1.5">
                                <span className="text-xl select-none shrink-0 group-hover:scale-110 transition-transform">
                                    {comp.preview}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate leading-tight group-hover:text-amber-700 dark:group-hover:text-amber-300">
                                        {comp.name}
                                    </div>
                                    {comp.behavior && (
                                        <span className="text-[8px] font-mono font-bold text-amber-700 dark:text-amber-400 block truncate">
                                            {comp.behavior}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <Button
                                size="sm"
                                variant="ghost"
                                className="w-full h-5 mt-1.5 text-[9px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-100/60 dark:bg-amber-950/60 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-600 rounded-lg p-0 flex items-center justify-center gap-0.5"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleInsert(comp);
                                }}
                            >
                                <Plus className="w-2.5 h-2.5" /> Add
                            </Button>
                        </div>
                    ))}
                </div>

                {filteredComponents.length === 0 && (
                    <div className="py-8 text-center text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        No components match your search.
                    </div>
                )}
            </div>
        </div>
    );
};
