"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Undo2, Redo2, Download, Save, Grid, Eye, EyeOff, Plus, ZoomIn, ZoomOut, RotateCcw, Sparkles, Move
} from "lucide-react";
import { useWorksheetStore } from "@/lib/worksheet-store";

interface WorksheetHeaderProps {
    onExportPDF: () => void;
    onSaveProject: () => void;
    isSaving?: boolean;
}

const PAGE_SIZES = [
    { key: "8.5x11", w: 816, h: 1056, label: "Letter (8.5 × 11 in)" },
    { key: "6x9", w: 576, h: 864, label: "Trade (6 × 9 in)" },
    { key: "8x10", w: 768, h: 960, label: "8 × 10 in" },
    { key: "A4", w: 794, h: 1123, label: "A4 (210 × 297 mm)" },
];

export const WorksheetHeader: React.FC<WorksheetHeaderProps> = ({
    onExportPDF,
    onSaveProject,
    isSaving = false,
}) => {
    const {
        name,
        setName,
        pageSizeKey,
        setPageSize,
        zoom,
        setZoom,
        showGrid,
        setShowGrid,
        gridSnapping,
        setGridSnapping,
        addPage,
        activeTool,
        setActiveTool,
        undo,
        redo,
        canUndo,
        canRedo,
    } = useWorksheetStore();

    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg px-4 flex items-center justify-between z-30 sticky top-0 shadow-sm">
            {/* Left Section: Branding & Document Specs */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50 shadow-inner">
                    <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                    <span className="font-extrabold text-xs tracking-wider uppercase bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
                        Worksheet Engine
                    </span>
                </div>

                <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-8 w-44 sm:w-56 font-bold text-xs text-slate-800 dark:text-slate-100 bg-transparent border-transparent hover:border-slate-300 focus:border-indigo-500 transition-all rounded-lg"
                    placeholder="Worksheet Title..."
                />

                <Select
                    value={pageSizeKey}
                    onValueChange={(val) => {
                        const target = PAGE_SIZES.find((s) => s.key === val);
                        if (target) setPageSize(target.key, target.w, target.h);
                    }}
                >
                    <SelectTrigger className="h-8 w-40 text-xs font-semibold bg-slate-100/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-lg">
                        <SelectValue placeholder="Page Size" />
                    </SelectTrigger>
                    <SelectContent>
                        {PAGE_SIZES.map((size) => (
                            <SelectItem key={size.key} value={size.key} className="text-xs font-medium">
                                {size.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Middle Section: Floating Viewport Toolbar */}
            <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg hover:bg-white dark:hover:bg-slate-700"
                    disabled={!canUndo()}
                    onClick={() => undo()}
                    title="Undo (Ctrl+Z)"
                >
                    <Undo2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg hover:bg-white dark:hover:bg-slate-700"
                    disabled={!canRedo()}
                    onClick={() => redo()}
                    title="Redo (Ctrl+Y)"
                >
                    <Redo2 className="w-3.5 h-3.5" />
                </Button>

                <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 my-auto mx-1" />

                <Button
                    variant={activeTool === "select" ? "default" : "ghost"}
                    size="icon"
                    className="h-7 w-7 rounded-lg"
                    onClick={() => setActiveTool("select")}
                    title="Selection Tool"
                >
                    <Move className="w-3.5 h-3.5" />
                </Button>

                <Button
                    variant={showGrid ? "secondary" : "ghost"}
                    size="icon"
                    className="h-7 w-7 rounded-lg"
                    onClick={() => setShowGrid(!showGrid)}
                    title="Toggle Layout Grid"
                >
                    <Grid className="w-3.5 h-3.5" />
                </Button>

                <Button
                    variant={gridSnapping ? "secondary" : "ghost"}
                    size="icon"
                    className="h-7 w-7 rounded-lg"
                    onClick={() => setGridSnapping(!gridSnapping)}
                    title={gridSnapping ? "Grid Snapping Active" : "Grid Snapping Off"}
                >
                    {gridSnapping ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                </Button>

                <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 my-auto mx-1" />

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg hover:bg-white dark:hover:bg-slate-700"
                    onClick={() => setZoom(Math.max(0.25, zoom - 0.1))}
                    title="Zoom Out"
                >
                    <ZoomOut className="w-3.5 h-3.5" />
                </Button>
                <span className="text-[11px] font-bold px-1 w-10 text-center text-slate-700 dark:text-slate-300">
                    {Math.round(zoom * 100)}%
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg hover:bg-white dark:hover:bg-slate-700"
                    onClick={() => setZoom(Math.min(2.5, zoom + 0.1))}
                    title="Zoom In"
                >
                    <ZoomIn className="w-3.5 h-3.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg hover:bg-white dark:hover:bg-slate-700"
                    onClick={() => setZoom(1.0)}
                    title="Reset Zoom"
                >
                    <RotateCcw className="w-3 h-3" />
                </Button>
            </div>

            {/* Right Section: Add Page & Save / Export */}
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 rounded-xl border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => addPage()}
                >
                    <Plus className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="hidden md:inline">Add Page</span>
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 rounded-xl border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={onSaveProject}
                    disabled={isSaving}
                >
                    <Save className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{isSaving ? "Saving..." : "Save Project"}</span>
                </Button>

                <Button
                    size="sm"
                    className="h-8 gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
                    onClick={onExportPDF}
                >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Vector PDF</span>
                </Button>
            </div>
        </header>
    );
};
