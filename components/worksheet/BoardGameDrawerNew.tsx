"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SPACE_PRESETS, CATEGORY_METADATA, searchPresets, getPresetsByCategory } from "@/lib/board-game-space-presets";
import { BOARD_TEMPLATES, generateQuickTemplate, BoardTemplateType } from "@/lib/board-game-templates-new";
import { renderPreset } from "@/lib/board-game-space-renderer";
import { SpaceCategory } from "@/lib/board-game-space-types";
import { BoardPatternPreview } from "@/components/worksheet/BoardPatternPreview";
import * as fabric from "fabric";
import { Search, LayoutGrid, Sparkles, Gamepad2, X } from "lucide-react";
import { toast } from "sonner";

interface BoardGameDrawerNewProps {
    isOpen: boolean;
    onClose: () => void;
    fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
}

export const BoardGameDrawerNew: React.FC<BoardGameDrawerNewProps> = ({
    isOpen,
    onClose,
    fabricCanvasRef,
}) => {
    const [activeTab, setActiveTab] = useState<"spaces" | "templates">("spaces");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<SpaceCategory | "all">("all");

    // Filter presets
    const filteredPresets = useMemo(() => {
        if (selectedCategory === "all") {
            return searchPresets(searchQuery);
        }
        const categoryPresets = getPresetsByCategory(selectedCategory);
        if (!searchQuery) return categoryPresets;
        const q = searchQuery.toLowerCase();
        return categoryPresets.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.type.toLowerCase().includes(q)
        );
    }, [selectedCategory, searchQuery]);

    // Filter templates
    const filteredTemplates = useMemo(() => {
        if (!searchQuery) return BOARD_TEMPLATES;
        const q = searchQuery.toLowerCase();
        return BOARD_TEMPLATES.filter(
            (t) =>
                t.name.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q) ||
                t.inspiration.toLowerCase().includes(q) ||
                t.category.toLowerCase().includes(q)
        );
    }, [searchQuery]);

    // Add preset to canvas
    const handleAddPreset = async (preset: any) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) {
            toast.error("Canvas not ready!");
            return;
        }

        try {
            const cx = canvas.getWidth() / 2;
            const cy = canvas.getHeight() / 2;

            // Special handling for game board patterns and board pieces - load actual SVG
            if (preset.category === "game-board" || preset.category === "board-piece") {
                let fileName: string;
                let filePath: string;

                if (preset.category === "game-board") {
                    const boardNumber = preset.id.replace("board-", "");
                    fileName = `board_${boardNumber}_crystalized.svg`;
                    filePath = `/board-game-pieces/${fileName}`;
                } else {
                    const pieceName = preset.id.replace("piece-", "");
                    // Special cases for files that don't match the pattern
                    const specialCases: Record<string, string> = {
                        "x-part": "xpart",
                        "y-section": "ysection",
                    };
                    const baseName = specialCases[pieceName] || pieceName.replace(/-/g, "_");
                    fileName = `${baseName}_crystalized.svg`;
                    filePath = `/board-game-pieces/${fileName}`;
                }

                try {
                    // Create an Image element and load the SVG
                    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
                        const image = new Image();
                        image.onload = () => resolve(image);
                        image.onerror = () => reject(new Error("Failed to load SVG image"));
                        const fullPath = window.location.origin + filePath;
                        image.src = fullPath;
                    });

                    // Create fabric.Image from the loaded image
                    const fabricImg = new fabric.Image(img, {
                        left: cx - 150,
                        top: cy - 150,
                        scaleX: 0.3,
                        scaleY: 0.3,
                        selectable: true,
                        hasControls: true,
                        hasBorders: true,
                    });

                    (fabricImg as any).id = `${preset.category}-${preset.id}-${Date.now()}`;
                    (fabricImg as any).customType = preset.category === "game-board" ? "board-game-pattern" : "board-piece";
                    (fabricImg as any).boardType = preset.id;

                    canvas.add(fabricImg);
                    canvas.setActiveObject(fabricImg);
                    canvas.requestRenderAll();
                    canvas.fire("object:modified");

                    toast.success(`Added ${preset.name}!`);
                } catch (svgError) {
                    console.error("Error loading SVG:", svgError);
                    toast.error("Failed to load board SVG");
                }
            } else {
                // Regular space preset - use existing renderPreset
                const group = renderPreset(preset, cx, cy);
                canvas.add(group);
                canvas.setActiveObject(group);
                canvas.requestRenderAll();
                canvas.fire("object:modified");
                toast.success(`Added ${preset.name}!`);
            }
        } catch (error) {
            console.error("Error adding preset:", error);
            toast.error("Failed to add space");
        }
    };

    // Generate template
    const handleGenerateTemplate = (type: BoardTemplateType) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) {
            toast.error("Canvas not ready!");
            return;
        }

        try {
            const group = generateQuickTemplate(type);
            group.set({ left: 80, top: 100 });

            canvas.add(group);
            canvas.setActiveObject(group);
            canvas.requestRenderAll();
            canvas.fire("object:modified");

            toast.success("Template generated!");
            onClose();
        } catch (error) {
            console.error("Error generating template:", error);
            toast.error("Failed to generate template");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="flex-1" onClick={onClose} />

            <div className="w-[600px] max-w-full bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300 overflow-hidden">
                {/* Header */}
                <div className="h-16 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
                            <Gamepad2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                Professional Board Game Builder
                                <span className="text-[9px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                                    {SPACE_PRESETS.length} spaces · {BOARD_TEMPLATES.length} templates
                                </span>
                            </h2>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Configurable spaces & professional templates
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search spaces, templates, or categories..."
                            className="h-9 pl-10 text-sm"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-4 pt-2 shrink-0">
                        <TabsList className="grid grid-cols-2 w-full h-9">
                            <TabsTrigger value="spaces" className="text-xs gap-1.5">
                                <LayoutGrid className="w-3.5 h-3.5" /> Spaces
                            </TabsTrigger>
                            <TabsTrigger value="templates" className="text-xs gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" /> Templates
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Spaces Tab */}
                    <TabsContent value="spaces" className="flex-1 overflow-hidden flex flex-col mt-0">
                        {/* Category Filter */}
                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
                            <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)}>
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories ({SPACE_PRESETS.length})</SelectItem>
                                    {Object.entries(CATEGORY_METADATA).map(([key, meta]) => (
                                        <SelectItem key={key} value={key}>
                                            {meta.icon} {meta.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Spaces List */}
                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 custom-scrollbar pb-20">
                            {filteredPresets.map((preset) => (
                                <div
                                    key={preset.id}
                                    onClick={() => handleAddPreset(preset)}
                                    className="group p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
                                >
                                    {preset.category === "game-board" || preset.category === "board-piece" ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-24 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0 group-hover:border-indigo-400 transition-colors">
                                                <BoardPatternPreview patternId={preset.id} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                                                    {preset.name}
                                                </div>
                                                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                                    {preset.description}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <div className="w-14 h-14 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0 group-hover:border-indigo-400 transition-colors">
                                                <span className="text-3xl select-none group-hover:scale-110 transition-transform">
                                                    {preset.emoji}
                                                </span>
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                                                        {preset.name}
                                                    </div>
                                                    <span className="text-[9px] font-mono font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded shrink-0">
                                                        {preset.type}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                                    {preset.description}
                                                </div>
                                            </div>

                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 shrink-0 text-indigo-700 dark:text-indigo-300 bg-indigo-100/60 dark:bg-indigo-950/60 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 rounded-lg p-0 flex items-center justify-center"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddPreset(preset);
                                                }}
                                            >
                                                <LayoutGrid className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {filteredPresets.length === 0 && (
                                <div className="py-12 text-center text-sm text-slate-400 dark:text-slate-500 font-medium">
                                    No spaces match your search
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Templates Tab */}
                    <TabsContent value="templates" className="flex-1 overflow-hidden flex flex-col mt-0">
                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 custom-scrollbar pb-20">
                            {filteredTemplates.map((template) => (
                                <div
                                    key={template.id}
                                    onClick={() => handleGenerateTemplate(template.id)}
                                    className="group p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 rounded-xl transition-all cursor-pointer flex items-center gap-3 shadow-sm hover:shadow-md"
                                >
                                    {/* Icon */}
                                    <div className="w-14 h-14 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0 group-hover:border-purple-400 transition-colors">
                                        <span className="text-3xl select-none group-hover:scale-110 transition-transform">
                                            {template.icon}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-purple-700 dark:group-hover:text-purple-300">
                                                {template.name}
                                            </div>
                                            <span className="text-[9px] font-bold text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60 px-1.5 py-0.5 rounded shrink-0 capitalize">
                                                {template.category}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                            {template.description}
                                        </div>
                                        <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
                                            {template.inspiration} · {template.defaultSpaces} spaces
                                        </div>
                                    </div>

                                    {/* Generate Button */}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 shrink-0 text-purple-700 dark:text-purple-300 bg-purple-100/60 dark:bg-purple-950/60 hover:bg-purple-500 hover:text-white dark:hover:bg-purple-600 rounded-lg p-0 flex items-center justify-center"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleGenerateTemplate(template.id);
                                        }}
                                    >
                                        <Sparkles className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}

                            {filteredTemplates.length === 0 && (
                                <div className="py-12 text-center text-sm text-slate-400 dark:text-slate-500 font-medium">
                                    No templates match your search
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
