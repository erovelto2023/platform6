"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BOARD_GAME_COMPONENTS, BoardComponentMeta, BoardComponentCategory } from "@/lib/board-game-components";
import {
    Gamepad2, Search, Plus, Grid3X3, Flag, HelpCircle, Route, Sparkles,
    MoveHorizontal, Frame, Layers, Zap, Dices, BookOpen, Gift, ShieldAlert,
    CreditCard, Trophy, Gamepad, Compass, ShoppingBag, Users, Clock, QrCode, X
} from "lucide-react";
import { toast } from "sonner";
import * as fabric from "fabric";

interface BoardGameComponentGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectComponent?: (comp: BoardComponentMeta) => void;
    getCanvasRef: () => fabric.Canvas | null;
}

export const BoardGameComponentGalleryModal: React.FC<BoardGameComponentGalleryModalProps> = ({
    isOpen,
    onClose,
    onSelectComponent,
    getCanvasRef,
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        if (isOpen) {
            setSelectedCategory("all");
            setSearchQuery("");
        }
    }, [isOpen]);

    const categoryTabs: { value: string; label: string; icon: React.ReactNode; color: string }[] = [
        { value: "all", label: "All (80+)", icon: <Grid3X3 className="w-3.5 h-3.5" />, color: "text-amber-300" },
        { value: "basic", label: "Basic Spaces", icon: <Flag className="w-3.5 h-3.5" />, color: "text-emerald-400" },
        { value: "movement", label: "Movement", icon: <Zap className="w-3.5 h-3.5" />, color: "text-blue-400" },
        { value: "turn", label: "Turns", icon: <Clock className="w-3.5 h-3.5" />, color: "text-rose-400" },
        { value: "dice", label: "Dice", icon: <Dices className="w-3.5 h-3.5" />, color: "text-indigo-400" },
        { value: "question", label: "Questions", icon: <HelpCircle className="w-3.5 h-3.5" />, color: "text-purple-400" },
        { value: "educational", label: "Educational", icon: <BookOpen className="w-3.5 h-3.5" />, color: "text-teal-400" },
        { value: "reward", label: "Rewards", icon: <Gift className="w-3.5 h-3.5" />, color: "text-yellow-400" },
        { value: "penalty", label: "Penalties", icon: <ShieldAlert className="w-3.5 h-3.5" />, color: "text-red-400" },
        { value: "card", label: "Cards", icon: <CreditCard className="w-3.5 h-3.5" />, color: "text-pink-400" },
        { value: "challenge", label: "Challenges", icon: <Trophy className="w-3.5 h-3.5" />, color: "text-orange-400" },
        { value: "minigame", label: "Mini-Games", icon: <Gamepad className="w-3.5 h-3.5" />, color: "text-cyan-400" },
        { value: "story-adventure", label: "Adventure", icon: <Compass className="w-3.5 h-3.5" />, color: "text-emerald-300" },
        { value: "rpg-economy", label: "Economy & RPG", icon: <ShoppingBag className="w-3.5 h-3.5" />, color: "text-amber-400" },
        { value: "team-random", label: "Team & Random", icon: <Users className="w-3.5 h-3.5" />, color: "text-indigo-300" },
        { value: "time-interactive", label: "Interactive & QR", icon: <QrCode className="w-3.5 h-3.5" />, color: "text-purple-300" },
        { value: "track", label: "Track Connectors", icon: <Route className="w-3.5 h-3.5" />, color: "text-orange-400" },
        { value: "snakes-ladders", label: "Snakes & Ladders", icon: <MoveHorizontal className="w-3.5 h-3.5" />, color: "text-rose-400" },
        { value: "decorations", label: "Decorations", icon: <Sparkles className="w-3.5 h-3.5" />, color: "text-yellow-300" },
        { value: "frames", label: "Board Frames", icon: <Frame className="w-3.5 h-3.5" />, color: "text-amber-400" },
    ];

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
            canvas.add(fabricObj);
            canvas.centerObject(fabricObj);
            canvas.setActiveObject(fabricObj);
            canvas.requestRenderAll();
            canvas.fire("object:modified");

            if (onSelectComponent) {
                onSelectComponent(comp);
            }
            toast.success(`Inserted "${comp.name}" onto canvas!`);
        } catch (err) {
            console.error("Error inserting component:", err);
            toast.error(`Failed to insert component ${comp.name}`);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[95vw] w-[1240px] h-[92vh] flex flex-col p-0 gap-0 overflow-hidden bg-slate-950 text-slate-100 border-slate-800 rounded-2xl shadow-2xl">
                {/* Header */}
                <DialogHeader className="px-6 py-4 border-b border-slate-800 bg-slate-900 shrink-0">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30 shrink-0 shadow-inner">
                                <Gamepad2 className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                                <DialogTitle className="text-lg font-extrabold text-white flex items-center gap-2 tracking-tight">
                                    Board Game Component Library
                                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 font-bold">
                                        80+ Configurable Spaces & Assets
                                    </span>
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-400 mt-0.5">
                                    Select any game space, track segment, challenge, or decorative asset to drop onto your board canvas.
                                </DialogDescription>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative shrink-0 w-64">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search by name, behavior, #..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-9 pl-9 pr-8 text-xs bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                {/* Horizontal Category Navigation Bar */}
                <div className="px-6 py-2.5 border-b border-slate-800 bg-slate-900/60 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
                    {categoryTabs.map((tab) => {
                        const isSelected = selectedCategory === tab.value;
                        const count = tab.value === "all"
                            ? BOARD_GAME_COMPONENTS.length
                            : BOARD_GAME_COMPONENTS.filter((c) => c.category === tab.value).length;

                        return (
                            <button
                                key={tab.value}
                                onClick={() => setSelectedCategory(tab.value)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                                    isSelected
                                        ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                                        : `bg-slate-900 border-slate-800 ${tab.color} hover:border-slate-700 hover:bg-slate-850`
                                }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-extrabold ${isSelected ? "bg-slate-950/20 text-slate-950" : "bg-slate-800 text-slate-400"}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Main Component Grid Area */}
                <div className="flex-1 overflow-y-auto min-h-0 bg-slate-950/60 p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredComponents.map((comp) => (
                            <div
                                key={comp.id}
                                onClick={() => handleInsert(comp)}
                                className="group relative p-3.5 rounded-2xl border bg-slate-900/90 border-slate-800/90 hover:border-amber-500/60 hover:bg-slate-850 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3"
                            >
                                {/* Card Header */}
                                <div>
                                    <div className="flex items-center justify-between gap-1 mb-1.5">
                                        <span className="text-xs font-black text-white group-hover:text-amber-300 transition-colors truncate">
                                            #{comp.id} {comp.name}
                                        </span>
                                    </div>

                                    {/* Preview Box */}
                                    <div className="h-28 bg-slate-950 rounded-xl border border-slate-800/80 group-hover:border-amber-500/30 overflow-hidden flex flex-col items-center justify-center p-3 text-center transition-colors relative">
                                        <span className="text-4xl select-none group-hover:scale-110 transition-transform duration-200 drop-shadow-md">
                                            {comp.preview}
                                        </span>
                                        {comp.behavior && (
                                            <span className="absolute bottom-1.5 right-1.5 text-[8px] font-mono uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-800">
                                                {comp.behavior}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                                        {comp.description}
                                    </p>
                                </div>

                                {/* Insert Action Button */}
                                <Button
                                    size="sm"
                                    className="w-full h-8 text-xs font-bold rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 transition-all duration-150 flex items-center justify-center gap-1 mt-1"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleInsert(comp);
                                    }}
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add to Canvas</span>
                                </Button>
                            </div>
                        ))}
                    </div>

                    {filteredComponents.length === 0 && (
                        <div className="py-24 text-center text-slate-500 text-sm flex flex-col items-center justify-center gap-2">
                            <HelpCircle className="w-8 h-8 text-slate-600 mb-1" />
                            <p className="font-bold text-slate-400">No matching board game components found</p>
                            <p className="text-xs text-slate-500">Try adjusting your category filter or search query.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
