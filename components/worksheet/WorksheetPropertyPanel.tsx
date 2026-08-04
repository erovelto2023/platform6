"use client";

import React, { useState, useEffect } from "react";
import * as fabric from "fabric";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Copy, Trash2, ArrowUp, ArrowDown, Grid3X3, Sparkles, RefreshCw, Layers,
    Palette, Type, FileText, CheckCircle2, ShieldAlert, BarChart3, Wand2, Settings2, HelpCircle
} from "lucide-react";
import { useWorksheetStore } from "@/lib/worksheet-store";
import {
    WordSearchConfig,
    WordDirection,
    DifficultyLevel,
    createDefaultWordSearchConfig,
    generateRandomSeed,
    solveAndGenerateWordSearch,
    WORD_SEARCH_THEMES
} from "@/lib/word-search-engine";
import { generateAdvancedWordSearchObjects } from "@/lib/worksheet-fabric";

interface WorksheetPropertyPanelProps {
    fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
}

export const WorksheetPropertyPanel: React.FC<WorksheetPropertyPanelProps> = ({ fabricCanvasRef }) => {
    const { selectedObjectId, selectedObjectType, selectedObjectProps, setSelectedObject } = useWorksheetStore();

    // Canva-Grade Word Search Configuration State
    const [wsConfig, setWsConfig] = useState<WordSearchConfig>(createDefaultWordSearchConfig("animals"));
    const [isWordSearchSelected, setIsWordSearchSelected] = useState(false);
    const [wordsInputText, setWordsInputText] = useState("");

    // Sync state with active canvas selection
    useEffect(() => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (activeObj && (activeObj as any).customType === "word-search") {
            setIsWordSearchSelected(true);
            const cfg: WordSearchConfig = (activeObj as any).wordSearchConfig || createDefaultWordSearchConfig();
            setWsConfig(cfg);
            setWordsInputText(cfg.words.map((w) => w.word).join(", "));
        } else {
            setIsWordSearchSelected(false);
        }
    }, [selectedObjectId, fabricCanvasRef]);

    // Live Regenerate & Update Canvas Object
    const handleApplyWordSearchConfig = (newConfig: WordSearchConfig) => {
        setWsConfig(newConfig);
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        const left = activeObj.left || 60;
        const top = activeObj.top || 60;

        // Generate Fabric Objects with new config
        const newObjects = generateAdvancedWordSearchObjects(newConfig);

        // Remove old group
        c.remove(activeObj);

        // Add new replacement group
        const newGroup = new fabric.Group(newObjects, {
            left,
            top,
            subTargetCheck: true,
        });

        (newGroup as any).customType = "word-search";
        (newGroup as any).wordSearchConfig = newConfig;

        c.add(newGroup);
        c.setActiveObject(newGroup);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    // Helper to update partial config
    const updateConfig = (updater: (prev: WordSearchConfig) => WordSearchConfig) => {
        const updated = updater(wsConfig);
        handleApplyWordSearchConfig(updated);
    };

    // Direction Toggle Handler
    const toggleDirection = (dir: WordDirection) => {
        updateConfig((prev) => {
            const current = prev.grid.directions || [];
            const next = current.includes(dir)
                ? current.filter((d) => d !== dir)
                : [...current, dir];
            return {
                ...prev,
                grid: { ...prev.grid, directions: next.length > 0 ? next : ["H"] },
            };
        });
    };

    // Apply Theme Preset
    const applyTheme = (themeKey: string) => {
        const theme = WORD_SEARCH_THEMES[themeKey];
        if (!theme) return;
        updateConfig((prev) => ({
            ...prev,
            title: `${theme.name.toUpperCase()} WORD SEARCH`,
            theme: theme.name,
            words: theme.words.map((w, i) => ({ id: `w-${i}-${Date.now()}`, word: w, displayText: w })),
        }));
        setWordsInputText(theme.words.join(", "));
    };

    // Apply Difficulty Preset
    const applyDifficulty = (level: DifficultyLevel) => {
        updateConfig((prev) => {
            let rows = 10;
            let cols = 10;
            let directions: WordDirection[] = ["H", "V"];

            if (level === "very_easy") {
                rows = 8; cols = 8; directions = ["H", "V"];
            } else if (level === "easy") {
                rows = 10; cols = 10; directions = ["H", "V", "D_TL_BR"];
            } else if (level === "medium") {
                rows = 12; cols = 12; directions = ["H", "HR", "V", "D_TL_BR"];
            } else if (level === "hard") {
                rows = 15; cols = 15; directions = ["H", "HR", "V", "VR", "D_TL_BR", "D_TR_BL"];
            } else if (level === "expert") {
                rows = 18; cols = 18; directions = ["H", "HR", "V", "VR", "D_TL_BR", "D_TR_BL", "D_BL_TR", "D_BR_TL"];
            }

            return {
                ...prev,
                difficulty: level,
                grid: { ...prev.grid, rows, cols, directions },
            };
        });
    };

    // Standard Canvas Actions
    const handleDuplicate = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        activeObj.clone().then((cloned: fabric.FabricObject) => {
            cloned.set({
                left: (activeObj.left || 0) + 20,
                top: (activeObj.top || 0) + 20,
            });
            c.add(cloned);
            c.setActiveObject(cloned);
            c.requestRenderAll();
            c.fire("object:modified");
        });
    };

    const handleDelete = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;
        c.remove(activeObj);
        c.discardActiveObject();
        c.requestRenderAll();
        c.fire("object:modified");
        setSelectedObject(null, null);
    };

    const handleBringToFront = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;
        c.bringObjectToFront(activeObj);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const handleSendToBack = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;
        c.sendObjectToBack(activeObj);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    if (!selectedObjectId || !selectedObjectProps) {
        return (
            <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col items-center justify-center text-slate-400 text-center select-none z-20">
                <Layers className="w-10 h-10 mb-2 opacity-40" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Object Inspector</span>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                    Select any element or Word Search puzzle on the canvas to open the multi-tab property studio.
                </p>
            </aside>
        );
    }

    const placementStats = solveAndGenerateWordSearch(wsConfig);

    return (
        <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-[calc(100vh-4rem)] z-20 shadow-lg overflow-hidden">
            {/* Inspector Top Bar */}
            <div className="h-11 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    {isWordSearchSelected ? "Word Search Studio" : `${selectedObjectType || "Object"} Inspector`}
                </span>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={handleDuplicate} title="Duplicate">
                        <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-rose-500 hover:bg-rose-50" onClick={handleDelete} title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>

            {/* --- CANVA-GRADE 7-TAB WORD SEARCH STUDIO --- */}
            {isWordSearchSelected ? (
                <Tabs defaultValue="general" className="flex-1 flex flex-col min-h-0">
                    <TabsList className="grid grid-cols-4 h-9 bg-slate-100 dark:bg-slate-800 p-1 m-2 rounded-xl shrink-0">
                        <TabsTrigger value="general" className="text-[10px] font-bold">General</TabsTrigger>
                        <TabsTrigger value="words" className="text-[10px] font-bold">Words</TabsTrigger>
                        <TabsTrigger value="grid" className="text-[10px] font-bold">Grid</TabsTrigger>
                        <TabsTrigger value="style" className="text-[10px] font-bold">Style</TabsTrigger>
                    </TabsList>
                    <TabsList className="grid grid-cols-3 h-8 bg-slate-100 dark:bg-slate-800 p-1 mx-2 mb-2 rounded-xl shrink-0">
                        <TabsTrigger value="bank" className="text-[10px] font-bold">Word Bank</TabsTrigger>
                        <TabsTrigger value="answer" className="text-[10px] font-bold">Answer Key</TabsTrigger>
                        <TabsTrigger value="stats" className="text-[10px] font-bold">Stats & AI</TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-y-auto p-3 space-y-4">
                        {/* TAB 1: GENERAL & THEME */}
                        <TabsContent value="general" className="m-0 space-y-3">
                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Puzzle Title</Label>
                                <Input
                                    value={wsConfig.title}
                                    onChange={(e) => updateConfig((p) => ({ ...p, title: e.target.value }))}
                                    className="h-8 text-xs font-semibold"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Subtitle / Instruction</Label>
                                <Input
                                    value={wsConfig.subtitle || ""}
                                    onChange={(e) => updateConfig((p) => ({ ...p, subtitle: e.target.value }))}
                                    className="h-8 text-xs"
                                    placeholder="Find all the hidden words..."
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Curated Theme Preset</Label>
                                <Select value={Object.keys(WORD_SEARCH_THEMES).find((k) => WORD_SEARCH_THEMES[k].name === wsConfig.theme) || "custom"} onValueChange={applyTheme}>
                                    <SelectTrigger className="h-8 text-xs font-semibold">
                                        <SelectValue placeholder="Select Theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(WORD_SEARCH_THEMES).map(([key, t]) => (
                                            <SelectItem key={key} value={key} className="text-xs font-medium">
                                                {t.icon} {t.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Difficulty Auto-Preset</Label>
                                <div className="grid grid-cols-3 gap-1">
                                    {(["very_easy", "easy", "medium", "hard", "expert"] as DifficultyLevel[]).map((lvl) => (
                                        <Button
                                            key={lvl}
                                            variant={wsConfig.difficulty === lvl ? "default" : "outline"}
                                            size="sm"
                                            className="h-7 text-[10px] font-bold capitalize"
                                            onClick={() => applyDifficulty(lvl)}
                                        >
                                            {lvl.replace("_", " ")}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        {/* TAB 2: WORDS MANAGER */}
                        <TabsContent value="words" className="m-0 space-y-3">
                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Word List (Comma / Line Separated)</Label>
                                <Textarea
                                    value={wordsInputText}
                                    onChange={(e) => {
                                        setWordsInputText(e.target.value);
                                        const parsed = e.target.value.split(/,|\n/).map((w) => w.trim()).filter(Boolean);
                                        updateConfig((p) => ({
                                            ...p,
                                            words: parsed.map((w, i) => ({ id: `w-${i}-${Date.now()}`, word: w, displayText: w })),
                                        }));
                                    }}
                                    className="h-32 text-xs font-mono resize-none"
                                    placeholder="LION, TIGER, BEAR..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-1.5">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 text-xs font-semibold"
                                    onClick={() => {
                                        const alphabetized = [...wsConfig.words].sort((a, b) => a.word.localeCompare(b.word));
                                        updateConfig((p) => ({ ...p, words: alphabetized }));
                                        setWordsInputText(alphabetized.map((w) => w.word).join(", "));
                                    }}
                                >
                                    Alphabetize
                                </Button>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 text-xs font-semibold"
                                    onClick={() => {
                                        const shuffled = [...wsConfig.words].sort(() => Math.random() - 0.5);
                                        updateConfig((p) => ({ ...p, words: shuffled }));
                                        setWordsInputText(shuffled.map((w) => w.word).join(", "));
                                    }}
                                >
                                    Shuffle Words
                                </Button>
                            </div>
                        </TabsContent>

                        {/* TAB 3: GRID & RULES */}
                        <TabsContent value="grid" className="m-0 space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Grid Rows</Label>
                                    <Input
                                        type="number"
                                        min={6}
                                        max={25}
                                        value={wsConfig.grid.rows}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value, 10) || 10;
                                            updateConfig((p) => ({ ...p, grid: { ...p.grid, rows: val, cols: val } }));
                                        }}
                                        className="h-8 text-xs"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Grid Cols</Label>
                                    <Input
                                        type="number"
                                        min={6}
                                        max={25}
                                        value={wsConfig.grid.cols}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value, 10) || 10;
                                            updateConfig((p) => ({ ...p, grid: { ...p.grid, rows: val, cols: val } }));
                                        }}
                                        className="h-8 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 pt-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Placement Directions (8-Way)</Label>
                                <div className="grid grid-cols-2 gap-1.5 text-xs bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center space-x-1.5">
                                        <Checkbox id="d-h" checked={wsConfig.grid.directions.includes("H")} onCheckedChange={() => toggleDirection("H")} />
                                        <Label htmlFor="d-h" className="text-[11px]">Horizontal (➔)</Label>
                                    </div>
                                    <div className="flex items-center space-x-1.5">
                                        <Checkbox id="d-hr" checked={wsConfig.grid.directions.includes("HR")} onCheckedChange={() => toggleDirection("HR")} />
                                        <Label htmlFor="d-hr" className="text-[11px]">Reverse Horiz (⬅)</Label>
                                    </div>
                                    <div className="flex items-center space-x-1.5">
                                        <Checkbox id="d-v" checked={wsConfig.grid.directions.includes("V")} onCheckedChange={() => toggleDirection("V")} />
                                        <Label htmlFor="d-v" className="text-[11px]">Vertical (⬇)</Label>
                                    </div>
                                    <div className="flex items-center space-x-1.5">
                                        <Checkbox id="d-vr" checked={wsConfig.grid.directions.includes("VR")} onCheckedChange={() => toggleDirection("VR")} />
                                        <Label htmlFor="d-vr" className="text-[11px]">Reverse Vert (⬆)</Label>
                                    </div>
                                    <div className="flex items-center space-x-1.5">
                                        <Checkbox id="d-dtl" checked={wsConfig.grid.directions.includes("D_TL_BR")} onCheckedChange={() => toggleDirection("D_TL_BR")} />
                                        <Label htmlFor="d-dtl" className="text-[11px]">Diag Down (↘)</Label>
                                    </div>
                                    <div className="flex items-center space-x-1.5">
                                        <Checkbox id="d-dtr" checked={wsConfig.grid.directions.includes("D_TR_BL")} onCheckedChange={() => toggleDirection("D_TR_BL")} />
                                        <Label htmlFor="d-dtr" className="text-[11px]">Diag Down-L (↙)</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">PRNG Random Seed</Label>
                                <div className="flex gap-1.5">
                                    <Input
                                        type="number"
                                        value={wsConfig.grid.randomSeed}
                                        onChange={(e) => updateConfig((p) => ({ ...p, grid: { ...p.grid, randomSeed: parseInt(e.target.value, 10) || 12345 } }))}
                                        className="h-8 text-xs font-mono"
                                    />
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 px-2"
                                        onClick={() => updateConfig((p) => ({ ...p, grid: { ...p.grid, randomSeed: generateRandomSeed() } }))}
                                        title="Re-seed"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        {/* TAB 4: APPEARANCE & STYLING */}
                        <TabsContent value="style" className="m-0 space-y-3">
                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Cell Style</Label>
                                <Select
                                    value={wsConfig.grid.cellStyle}
                                    onValueChange={(val: any) => updateConfig((p) => ({ ...p, grid: { ...p.grid, cellStyle: val } }))}
                                >
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Cell Style" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="boxed">Boxed Squares</SelectItem>
                                        <SelectItem value="rounded">Rounded Squares</SelectItem>
                                        <SelectItem value="clean">Clean Minimal Grid</SelectItem>
                                        <SelectItem value="circle">Circle Cells</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Theme Colors</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-[10px] text-slate-500 font-semibold block mb-1">Letter Color</span>
                                        <input
                                            type="color"
                                            value={wsConfig.appearance.gridLetterColor}
                                            onChange={(e) => updateConfig((p) => ({ ...p, appearance: { ...p.appearance, gridLetterColor: e.target.value } }))}
                                            className="w-full h-7 rounded border p-0.5 cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-500 font-semibold block mb-1">Border Color</span>
                                        <input
                                            type="color"
                                            value={wsConfig.appearance.gridBorderColor}
                                            onChange={(e) => updateConfig((p) => ({ ...p, appearance: { ...p.appearance, gridBorderColor: e.target.value } }))}
                                            className="w-full h-7 rounded border p-0.5 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* TAB 5: WORD BANK */}
                        <TabsContent value="bank" className="m-0 space-y-3">
                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Word Bank Columns</Label>
                                <Select
                                    value={(wsConfig.wordBank.columns || 3).toString()}
                                    onValueChange={(val) => updateConfig((p) => ({ ...p, wordBank: { ...p.wordBank, columns: parseInt(val, 10) } }))}
                                >
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Columns" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 Column</SelectItem>
                                        <SelectItem value="2">2 Columns</SelectItem>
                                        <SelectItem value="3">3 Columns</SelectItem>
                                        <SelectItem value="4">4 Columns</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Sorting</Label>
                                <Select
                                    value={wsConfig.wordBank.sorting}
                                    onValueChange={(val: any) => updateConfig((p) => ({ ...p, wordBank: { ...p.wordBank, sorting: val } }))}
                                >
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Sorting" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="alphabetical">Alphabetical (A-Z)</SelectItem>
                                        <SelectItem value="original">Original Order</SelectItem>
                                        <SelectItem value="length">Word Length</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>

                        {/* TAB 6: ANSWER KEY */}
                        <TabsContent value="answer" className="m-0 space-y-3">
                            <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                                <Checkbox
                                    id="show-sol"
                                    checked={wsConfig.answerKey.showSolution}
                                    onCheckedChange={(val) => updateConfig((p) => ({ ...p, answerKey: { ...p.answerKey, showSolution: !!val } }))}
                                />
                                <Label htmlFor="show-sol" className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                                    Show Solution Answer Key Overlay
                                </Label>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Solution Highlight Color</Label>
                                <input
                                    type="color"
                                    value={wsConfig.answerKey.color}
                                    onChange={(e) => updateConfig((p) => ({ ...p, answerKey: { ...p.answerKey, color: e.target.value } }))}
                                    className="w-full h-8 rounded border p-0.5 cursor-pointer"
                                />
                            </div>
                        </TabsContent>

                        {/* TAB 7: STATS & AI */}
                        <TabsContent value="stats" className="m-0 space-y-3">
                            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                                <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                    <BarChart3 className="w-3.5 h-3.5 text-indigo-500" /> Puzzle Diagnostics
                                </span>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-[10px] text-slate-400 block">Grid Fill</span>
                                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{placementStats.stats.fillPercentage}%</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 block">Placed Words</span>
                                        <span className="font-bold text-emerald-600">{placementStats.stats.placedCount} / {placementStats.stats.wordCount}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 block">Avg Word Length</span>
                                        <span className="font-bold">{placementStats.stats.avgLength} chars</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 block">Overlap Intersections</span>
                                        <span className="font-bold text-purple-600">{placementStats.stats.overlapCount}</span>
                                    </div>
                                </div>
                                {placementStats.warnings.length > 0 && (
                                    <div className="text-[11px] text-rose-600 bg-rose-50 p-2 rounded-lg font-semibold space-y-0.5 mt-2">
                                        {placementStats.warnings.map((w, idx) => (
                                            <div key={idx} className="flex items-center gap-1">
                                                <ShieldAlert className="w-3 h-3 shrink-0" /> {w}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            ) : (
                /* --- STANDARD ELEMENT PROPERTIES --- */
                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                    <div className="space-y-3">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Color & Fill</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <span className="text-[10px] text-slate-500 font-semibold block mb-1">Fill Color</span>
                                <input
                                    type="color"
                                    value={typeof selectedObjectProps.fill === "string" ? selectedObjectProps.fill : "#0f172a"}
                                    onChange={(e) => {
                                        const c = fabricCanvasRef.current;
                                        if (!c) return;
                                        const activeObj = c.getActiveObject();
                                        if (activeObj) {
                                            activeObj.set({ fill: e.target.value });
                                            c.requestRenderAll();
                                            c.fire("object:modified");
                                        }
                                    }}
                                    className="w-full h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                                />
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-500 font-semibold block mb-1">Stroke Color</span>
                                <input
                                    type="color"
                                    value={typeof selectedObjectProps.stroke === "string" ? selectedObjectProps.stroke : "#0f172a"}
                                    onChange={(e) => {
                                        const c = fabricCanvasRef.current;
                                        if (!c) return;
                                        const activeObj = c.getActiveObject();
                                        if (activeObj) {
                                            activeObj.set({ stroke: e.target.value });
                                            c.requestRenderAll();
                                            c.fire("object:modified");
                                        }
                                    }}
                                    className="w-full h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Layer Order</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold rounded-lg" onClick={handleBringToFront}>
                                <ArrowUp className="w-3.5 h-3.5 mr-1 text-indigo-500" /> Front
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold rounded-lg" onClick={handleSendToBack}>
                                <ArrowDown className="w-3.5 h-3.5 mr-1 text-slate-500" /> Back
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};
