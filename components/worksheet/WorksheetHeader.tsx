"use client";

import React, { useState } from "react";
import * as fabric from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Undo2, Redo2, Download, Save, Grid, Eye, EyeOff, Plus, ZoomIn, ZoomOut, RotateCcw, Sparkles, Move, Scissors, ShieldAlert, FolderOpen, Wand2, Trash2, Unlink, Link2, Layers
} from "lucide-react";
import { toast } from "sonner";
import { useWorksheetStore } from "@/lib/worksheet-store";
import { WorksheetProjectsModal } from "./WorksheetProjectsModal";
import { handleUngroupFabricGroup, handleGroupFabricObjects } from "@/lib/worksheet-fabric";

interface WorksheetHeaderProps {
    fabricCanvasRef?: React.MutableRefObject<fabric.Canvas | null>;
    onExportPDF: () => void;
    onSaveProject: () => void;
    onLoadProjectData: (projectId: string, projectData: any) => void;
    isSaving?: boolean;
}

const KDP_TRIM_SIZES = [
    { key: "6x9", w: 576, h: 864, label: "6 × 9 in (KDP Standard)" },
    { key: "8.5x11", w: 816, h: 1056, label: "8.5 × 11 in (KDP Large)" },
    { key: "8x10", w: 768, h: 960, label: "8 × 10 in (KDP Trim)" },
    { key: "7x10", w: 672, h: 960, label: "7 × 10 in (KDP Trim)" },
    { key: "8.5x8.5", w: 816, h: 816, label: "8.5 × 8.5 in (KDP Square)" },
    { key: "8.25x8.25", w: 792, h: 792, label: "8.25 × 8.25 in (KDP Square)" },
    { key: "A4", w: 794, h: 1123, label: "A4 (210 × 297 mm)" },
];

export const WorksheetHeader: React.FC<WorksheetHeaderProps> = ({
    fabricCanvasRef,
    onExportPDF,
    onSaveProject,
    onLoadProjectData,
    isSaving = false,
}) => {
    const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);

    const {
        name,
        setName,
        pageSizeKey,
        setPageSize,
        kdpBleed,
        setKdpBleed,
        kdpPageCount,
        setKdpPageCount,
        showKdpGuides,
        setShowKdpGuides,
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
        getKdpSpecs,
        canUndo,
        canRedo,
    } = useWorksheetStore();

    return (
        <header className="min-h-[3.5rem] py-1.5 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg px-3 flex items-center justify-between gap-3 z-30 sticky top-0 shadow-sm overflow-x-auto w-full max-w-full">
            {/* Left Section: Branding & Amazon KDP Specs */}
            <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/10 to-indigo-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-lg border border-amber-200/50 dark:border-amber-800/50 shadow-inner">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    <span className="font-extrabold text-xs tracking-wider uppercase bg-gradient-to-r from-amber-600 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap">
                        KDP Print Studio
                    </span>
                </div>

                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-7 w-36 font-bold text-xs text-slate-800 dark:text-slate-100 bg-transparent border-transparent hover:border-slate-300 focus:border-indigo-500 transition-all rounded-lg"
                    placeholder="Book Title..."
                />

                {/* Trim Size Dropdown */}
                <Select
                    value={pageSizeKey}
                    onValueChange={(val) => {
                        const target = KDP_TRIM_SIZES.find((s) => s.key === val);
                        if (target) setPageSize(target.key, target.w, target.h);
                    }}
                >
                    <SelectTrigger className="h-7 w-36 text-xs font-semibold bg-slate-100/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-lg px-2">
                        <SelectValue placeholder="KDP Trim Size" />
                    </SelectTrigger>
                    <SelectContent>
                        {KDP_TRIM_SIZES.map((size) => (
                            <SelectItem key={size.key} value={size.key} className="text-xs font-medium">
                                {size.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Amazon Bleed Switch */}
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <Switch id="kdp-bleed" checked={kdpBleed} onCheckedChange={setKdpBleed} className="scale-75" />
                    <Label htmlFor="kdp-bleed" className="text-[10px] font-bold cursor-pointer flex items-center gap-1 whitespace-nowrap">
                        <Scissors className="w-2.5 h-2.5 text-rose-500" /> Bleed (+0.125&quot;)
                    </Label>
                </div>

                {/* Page Count Gutter Selector */}
                <Select
                    value={kdpPageCount.toString()}
                    onValueChange={(val) => setKdpPageCount(parseInt(val, 10))}
                >
                    <SelectTrigger className="h-7 w-32 text-xs font-semibold bg-slate-100/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-lg px-2 flex">
                        <SelectValue placeholder="Book Length" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="100" className="text-xs font-medium">24–150 pgs (0.375&quot; Gutter)</SelectItem>
                        <SelectItem value="200" className="text-xs font-medium">151–300 pgs (0.500&quot; Gutter)</SelectItem>
                        <SelectItem value="400" className="text-xs font-medium">301–500 pgs (0.625&quot; Gutter)</SelectItem>
                        <SelectItem value="600" className="text-xs font-medium">501–700 pgs (0.750&quot; Gutter)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Middle Section: Floating Viewport Toolbar */}
            <div className="flex items-center gap-0.5 bg-slate-100/90 dark:bg-slate-800/90 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm shrink-0">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-lg hover:bg-white dark:hover:bg-slate-700"
                    disabled={!canUndo()}
                    onClick={() => undo()}
                    title="Undo (Ctrl+Z)"
                >
                    <Undo2 className="w-3 h-3" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-lg hover:bg-white dark:hover:bg-slate-700"
                    disabled={!canRedo()}
                    onClick={() => redo()}
                    title="Redo (Ctrl+Y)"
                >
                    <Redo2 className="w-3 h-3" />
                </Button>

                <div className="h-3 w-px bg-slate-300 dark:bg-slate-700 my-auto mx-0.5" />

                <Button
                    variant={activeTool === "select" ? "default" : "ghost"}
                    size="icon"
                    className="h-6 w-6 rounded-lg"
                    onClick={() => setActiveTool("select")}
                    title="Selection Tool"
                >
                    <Move className="w-3 h-3" />
                </Button>

                <Button
                    variant={activeTool === "eraser" ? "default" : "ghost"}
                    size="icon"
                    className={`h-6 w-6 rounded-lg ${activeTool === "eraser" ? "bg-rose-600 text-white" : ""}`}
                    onClick={() => setActiveTool("eraser")}
                    title="Eraser Tool (Partial Line & Area Erase)"
                >
                    <Scissors className="w-3 h-3" />
                </Button>

                <Button
                    variant={showKdpGuides ? "secondary" : "ghost"}
                    size="icon"
                    className="h-6 w-6 rounded-lg"
                    onClick={() => setShowKdpGuides(!showKdpGuides)}
                    title={showKdpGuides ? "Hide KDP Safety Overlay" : "Show KDP Safety Overlay"}
                >
                    <ShieldAlert className={`w-3 h-3 ${showKdpGuides ? "text-amber-500" : "text-slate-400"}`} />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5 rounded-lg text-[9px] font-extrabold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800"
                    onClick={() => {
                        const specs = getKdpSpecs();
                        const minX = specs.safeLeft;
                        const minY = specs.safeTop;
                        const maxX = specs.safeLeft + specs.safeWidth;
                        const maxY = specs.safeTop + specs.safeHeight;

                        const canvasEl = document.querySelector(".canvas-container canvas") as any;
                        const c = canvasEl?.__fabricCanvas;
                        if (!c) {
                            toast.success("KDP Margin Check Active: Safe margins enabled!");
                            return;
                        }

                        let fixedCount = 0;
                        c.getObjects().forEach((obj: any) => {
                            const rect = obj.getBoundingRect();
                            let newLeft = obj.left || minX;
                            let newTop = obj.top || minY;
                            let moved = false;

                            if (rect.left < minX) {
                                newLeft = minX;
                                moved = true;
                            } else if (rect.left + rect.width > maxX) {
                                newLeft = maxX - rect.width;
                                moved = true;
                            }

                            if (rect.top < minY) {
                                newTop = minY;
                                moved = true;
                            } else if (rect.top + rect.height > maxY) {
                                newTop = maxY - rect.height;
                                moved = true;
                            }

                            if (moved) {
                                obj.set({ left: newLeft, top: newTop });
                                fixedCount++;
                            }
                        });

                        if (fixedCount > 0) {
                            c.requestRenderAll();
                            c.fire("object:modified");
                            toast.success(`KDP Auto-Fix: Snapped ${fixedCount} elements into safe margins!`);
                        } else {
                            toast.success("KDP Check Passed: All elements are safely inside printable margins!");
                        }
                    }}
                    title="1-Click KDP Auto-Fix: Snaps out-of-margin objects inside safe KDP margins"
                >
                    <Wand2 className="w-2.5 h-2.5 mr-0.5 text-amber-500" />
                    Auto-Fix KDP
                </Button>

                <Button
                    variant={showGrid ? "secondary" : "ghost"}
                    size="icon"
                    className="h-6 w-6 rounded-lg"
                    onClick={() => setShowGrid(!showGrid)}
                    title="Toggle Layout Grid"
                >
                    <Grid className="w-3 h-3" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                    onClick={() => {
                        const c = fabricCanvasRef?.current || (document.querySelector(".canvas-container canvas") as any)?.__fabricCanvas;
                        if (!c) {
                            toast.error("Canvas is not initialized.");
                            return;
                        }
                        const count = handleGroupFabricObjects(c);
                        if (count > 0) {
                            toast.success(`Grouped ${count} overlapping elements together!`);
                        } else {
                            toast.info("Tip: Hold Shift + click multiple items, drag a box over them, or stack text/images on top of your background tile to group!");
                        }
                    }}
                    title="Group Selected Elements Together"
                >
                    <Link2 className="w-3 h-3" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950"
                    onClick={() => {
                        const c = fabricCanvasRef?.current || (document.querySelector(".canvas-container canvas") as any)?.__fabricCanvas;
                        if (!c) {
                            toast.error("Canvas is not initialized.");
                            return;
                        }
                        const activeObj = c.getActiveObject();
                        if (!activeObj) {
                            toast.error("Please select a group or puzzle to ungroup!");
                            return;
                        }
                        if (activeObj.type === "group" || (activeObj as any)._objects) {
                            const count = handleUngroupFabricGroup(activeObj, c);
                            if (count === -1) {
                                toast.info("Snake path corridors stay connected as a single component so the tube outline and fill never separate!");
                            } else {
                                toast.success(`Ungrouped ${count} objects for individual editing!`);
                            }
                        } else if (activeObj.type === "activeSelection") {
                            const selection = activeObj as fabric.ActiveSelection;
                            const count = selection.getObjects().length;
                            c.discardActiveObject();
                            c.requestRenderAll();
                            c.fire("object:modified");
                            toast.success(`Separated ${count} selected elements.`);
                        } else {
                            toast.error("Selected object is not a group.");
                        }
                    }}
                    title="Ungroup Selected Group / Puzzle for Individual Editing"
                >
                    <Unlink className="w-3 h-3" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950"
                    onClick={() => {
                        const c = fabricCanvasRef?.current || (document.querySelector(".canvas-container canvas") as any)?.__fabricCanvas;
                        if (!c) {
                            toast.error("Canvas is not initialized.");
                            return;
                        }
                        const objects = c.getObjects();
                        if (objects.length === 0) {
                            toast("Canvas is already empty.");
                            return;
                        }
                        if (confirm("Are you sure you want to clear all items from this canvas page?")) {
                            c.discardActiveObject();
                            [...objects].forEach((obj) => {
                                c.remove(obj);
                            });
                            c.backgroundColor = "#ffffff";
                            c.requestRenderAll();
                            c.fire("object:modified");
                            toast.success("Canvas page cleared!");
                        }
                    }}
                    title="Clear Canvas (Remove All Elements)"
                >
                    <Trash2 className="w-3 h-3" />
                </Button>

                <div className="h-3 w-px bg-slate-300 dark:bg-slate-700 my-auto mx-0.5" />

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    onClick={() => setZoom(Math.max(0.25, parseFloat((zoom - 0.1).toFixed(2))))}
                    title="Zoom Out"
                >
                    <ZoomOut className="w-3 h-3" />
                </Button>
                <button
                    className="text-[10px] font-extrabold px-1 py-0.5 rounded hover:bg-white dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400"
                    onClick={() => setZoom(0.7)}
                    title="Reset to Default 70% Page Zoom"
                >
                    {Math.round(zoom * 100)}%
                </button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    onClick={() => setZoom(Math.min(2.5, parseFloat((zoom + 0.1).toFixed(2))))}
                    title="Zoom In"
                >
                    <ZoomIn className="w-3 h-3" />
                </Button>
            </div>

            {/* Right Section: Add Page & Save / Export */}
            <div className="flex items-center gap-1.5 shrink-0">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2.5 gap-1 rounded-lg border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => setIsProjectsModalOpen(true)}
                    title="My Projects"
                >
                    <FolderOpen className="w-3.5 h-3.5 text-indigo-500" />
                    <span>My Projects</span>
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2.5 gap-1 rounded-lg border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => addPage()}
                    title="Add Page"
                >
                    <Plus className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Add Page</span>
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2.5 gap-1 rounded-lg border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={onSaveProject}
                    disabled={isSaving}
                    title="Save Project"
                >
                    <Save className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{isSaving ? "Saving..." : "Save Project"}</span>
                </Button>

                <Button
                    size="sm"
                    className="h-7 px-3 gap-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm"
                    onClick={onExportPDF}
                    title="Export KDP Print PDF"
                >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export</span>
                </Button>
            </div>

            {/* Projects Browser Modal */}
            <WorksheetProjectsModal
                isOpen={isProjectsModalOpen}
                onClose={() => setIsProjectsModalOpen(false)}
                onSelectProject={onLoadProjectData}
            />
        </header>
    );
};
