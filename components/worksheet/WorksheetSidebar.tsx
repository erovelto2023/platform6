"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Accordion, AccordionItem, AccordionTrigger, AccordionContent
} from "@/components/ui/accordion";
import {
    Type, PenTool, Square, QrCode, Barcode, Grid3X3, Calculator,
    Sparkles, Star, Circle, Triangle, BookOpen, Plus, FileText, Clock, Key,
    Scissors, Layers, Brain, Palette, Gamepad2, Shuffle, Heading
} from "lucide-react";
import { useWorksheetStore } from "@/lib/worksheet-store";

interface WorksheetSidebarProps {
    onAddText: (text: string, isHeader?: boolean) => void;
    onAddTracingText: (text: string) => void;
    onAddShape: (type: "rect" | "circle" | "triangle" | "star") => void;
    onAddQRCode: (text: string) => void;
    onAddBarcode: (text: string) => void;
    
    // 25 Puzzle Handlers
    onAddWordSearch: (words: string[], title: string, gridSize: number, directions?: string[]) => void;
    onAddCrossword: (title: string, items: { word: string; clue: string }[]) => void;
    onAddFillInBlanks: (sentence: string, wordBank: string[]) => void;
    onAddCryptogram: () => void;
    onAddCrackTheCode: () => void;
    onAddSudoku: () => void;
    onAddKakuro: () => void;
    onAddMaze: () => void;
    onAddWordScramble: (words: string[]) => void;
    onAddMissingLetters: (words: string[]) => void;
    onAddMatchingPairs: () => void;
    onAddConnectTheDots: () => void;
    onAddSpotTheDifference: () => void;
    onAddHiddenPicture: () => void;
    onAddColoringPage: () => void;
    onAddLogicGrid: () => void;
    onAddCipherWheel: () => void;
    onAddSecretMessage: () => void;
    onAddDecodePuzzle: () => void;
    onAddRebusPuzzle: () => void;
    onAddAcrostic: () => void;
    onAddNumberSearch: () => void;
    onAddMathWorksheet: (type: string, count: number, maxNum: number) => void;
    onAddTicTacToe: () => void;
    onAddDominoPuzzle: () => void;
}

export const WorksheetSidebar: React.FC<WorksheetSidebarProps> = ({
    onAddText,
    onAddTracingText,
    onAddShape,
    onAddQRCode,
    onAddBarcode,
    onAddWordSearch,
    onAddCrossword,
    onAddFillInBlanks,
    onAddCryptogram,
    onAddCrackTheCode,
    onAddSudoku,
    onAddKakuro,
    onAddMaze,
    onAddWordScramble,
    onAddMissingLetters,
    onAddMatchingPairs,
    onAddConnectTheDots,
    onAddSpotTheDifference,
    onAddHiddenPicture,
    onAddColoringPage,
    onAddLogicGrid,
    onAddCipherWheel,
    onAddSecretMessage,
    onAddDecodePuzzle,
    onAddRebusPuzzle,
    onAddAcrostic,
    onAddNumberSearch,
    onAddMathWorksheet,
    onAddTicTacToe,
    onAddDominoPuzzle,
}) => {
    const [activeTab, setActiveTab] = useState<"puzzles" | "text" | "freehand" | "shapes" | "preset">("puzzles");

    const {
        activeTool,
        setActiveTool,
        brushSize,
        brushColor,
        brushThinning,
        brushSmoothing,
        setBrushProps,
    } = useWorksheetStore();

    // Inputs
    const [headingInput, setHeadingInput] = useState("Name: ____________ Date: ________");
    const [bodyTextInput, setBodyTextInput] = useState("Type instructions or paragraph text here...");
    const [tracingInput, setTracingInput] = useState("Aa Bb Cc 1 2 3");

    // Optimized Word Search inputs
    const [wsTitle, setWsTitle] = useState("ANIMALS WORD SEARCH");
    const [wsWords, setWsWords] = useState("LION, TIGER, BEAR, ELEPHANT, MONKEY");
    const [wsSize, setWsSize] = useState("10");
    const [wsDiag, setWsDiag] = useState(true);
    const [wsReverse, setWsReverse] = useState(false);

    // Scramble input
    const [scrambleWords, setScrambleWords] = useState("APPLE, BANANA, CHERRY, GRAPE, ORANGE");

    // QR/Barcode inputs
    const [qrText, setQrText] = useState("https://kbacademy.com");

    const handleCreateWordSearch = () => {
        const wordsArr = wsWords.split(",").map((w) => w.trim()).filter(Boolean);
        const gridSizeNum = parseInt(wsSize, 10) || 10;
        const directions = ["H", "V"];
        if (wsDiag) directions.push("D");
        if (wsReverse) directions.push("HR", "VR");

        onAddWordSearch(wordsArr, wsTitle, gridSizeNum, directions);
    };

    return (
        <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex h-[calc(100vh-4rem)] shadow-lg z-20 overflow-hidden">
            {/* Left Vertical Icon Bar (Canva/Figma Style) */}
            <div className="w-16 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col items-center py-3 gap-2 shrink-0">
                <button
                    onClick={() => setActiveTab("puzzles")}
                    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                        activeTab === "puzzles"
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30 scale-105"
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800"
                    }`}
                >
                    <Grid3X3 className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Puzzles</span>
                </button>

                <button
                    onClick={() => setActiveTab("text")}
                    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                        activeTab === "text"
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105"
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800"
                    }`}
                >
                    <Type className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Text</span>
                </button>

                <button
                    onClick={() => setActiveTab("freehand")}
                    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                        activeTab === "freehand"
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30 scale-105"
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800"
                    }`}
                >
                    <PenTool className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Draw</span>
                </button>

                <button
                    onClick={() => setActiveTab("shapes")}
                    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                        activeTab === "shapes"
                            ? "bg-amber-600 text-white shadow-md shadow-amber-500/30 scale-105"
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800"
                    }`}
                >
                    <Square className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Shapes</span>
                </button>

                <button
                    onClick={() => setActiveTab("preset")}
                    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                        activeTab === "preset"
                            ? "bg-rose-600 text-white shadow-md shadow-rose-500/30 scale-105"
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800"
                    }`}
                >
                    <BookOpen className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Presets</span>
                </button>
            </div>

            {/* Right Sub-Panel Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900">
                <div className="h-11 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        {activeTab === "puzzles" && "Activity Puzzles Suite"}
                        {activeTab === "text" && "Typography & Tracing"}
                        {activeTab === "freehand" && "Smooth Ink Brush"}
                        {activeTab === "shapes" && "Shapes & QR / Barcodes"}
                        {activeTab === "preset" && "Worksheet Layout Templates"}
                    </span>
                </div>

                <ScrollArea className="flex-1 p-3">
                    {/* --- TAB 1: PUZZLES ACCORDION --- */}
                    {activeTab === "puzzles" && (
                        <div className="space-y-2">
                            <Accordion type="single" collapsible defaultValue="words" className="w-full space-y-2">
                                {/* Word & Letter Puzzles */}
                                <AccordionItem value="words" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                            <Grid3X3 className="w-4 h-4" />
                                            <span>Word & Letter Puzzles (7)</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        {/* OPTIMIZED WORD SEARCH BUILDER CARD */}
                                        <div className="space-y-2.5 p-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-200/80 dark:border-indigo-800 shadow-sm">
                                            <div className="flex items-center gap-1 text-indigo-700 dark:text-indigo-300 font-extrabold text-[11px]">
                                                <Grid3X3 className="w-3.5 h-3.5" />
                                                <span>Word Search Studio</span>
                                            </div>

                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-bold text-slate-500">Puzzle Title</Label>
                                                <Input value={wsTitle} onChange={(e) => setWsTitle(e.target.value)} placeholder="Title" className="h-7 text-xs" />
                                            </div>

                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-bold text-slate-500">Word List (Comma Separated)</Label>
                                                <Textarea value={wsWords} onChange={(e) => setWsWords(e.target.value)} placeholder="LION, TIGER, BEAR..." className="h-16 text-xs resize-none" />
                                            </div>

                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-bold text-slate-500">Grid Dimensions</Label>
                                                <Select value={wsSize} onValueChange={setWsSize}>
                                                    <SelectTrigger className="h-7 text-xs">
                                                        <SelectValue placeholder="Grid Size" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="8">8 × 8 Grid (Easy)</SelectItem>
                                                        <SelectItem value="10">10 × 10 Grid (Standard)</SelectItem>
                                                        <SelectItem value="12">12 × 12 Grid (Hard)</SelectItem>
                                                        <SelectItem value="15">15 × 15 Grid (Expert)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="flex items-center justify-between text-xs pt-1">
                                                <div className="flex items-center space-x-1.5">
                                                    <Checkbox id="ws-diag" checked={wsDiag} onCheckedChange={(v) => setWsDiag(!!v)} />
                                                    <Label htmlFor="ws-diag" className="text-[11px]">Diagonal ↘</Label>
                                                </div>
                                                <div className="flex items-center space-x-1.5">
                                                    <Checkbox id="ws-rev" checked={wsReverse} onCheckedChange={(v) => setWsReverse(!!v)} />
                                                    <Label htmlFor="ws-rev" className="text-[11px]">Reverse ⬅</Label>
                                                </div>
                                            </div>

                                            <Button
                                                size="sm"
                                                className="w-full h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm"
                                                onClick={handleCreateWordSearch}
                                            >
                                                <Plus className="w-3.5 h-3.5 mr-1" /> Add Word Search
                                            </Button>
                                        </div>

                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={() => onAddCrossword("ANIMAL CROSSWORD", [{ word: "DOG", clue: "Man's best friend" }, { word: "CAT", clue: "Chases mice" }])}>
                                            Crossword Puzzle
                                        </Button>
                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={() => onAddFillInBlanks("The ________ jumps over the ________ wall.", ["fox", "high", "quick"])}>
                                            Fill In (Blanks)
                                        </Button>

                                        <div className="space-y-2 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Scramble & Missing Letters</Label>
                                            <Input value={scrambleWords} onChange={(e) => setScrambleWords(e.target.value)} placeholder="Words..." className="h-8 text-xs" />
                                            <div className="grid grid-cols-2 gap-1.5">
                                                <Button size="sm" variant="outline" className="h-8 text-[10px] font-semibold" onClick={() => onAddWordScramble(scrambleWords.split(",").map((w) => w.trim()))}>
                                                    Scramble
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-8 text-[10px] font-semibold" onClick={() => onAddMissingLetters(scrambleWords.split(",").map((w) => w.trim()))}>
                                                    Missing Letters
                                                </Button>
                                            </div>
                                        </div>

                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={onAddRebusPuzzle}>
                                            Rebus Word Puzzle
                                        </Button>
                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={onAddAcrostic}>
                                            Acrostic Poem
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Codes & Ciphers */}
                                <AccordionItem value="ciphers" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                                            <Key className="w-4 h-4" />
                                            <span>Codes & Ciphers (5)</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={onAddCryptogram}>
                                            Cryptogram Puzzle
                                        </Button>
                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={onAddCrackTheCode}>
                                            Crack the Code!
                                        </Button>
                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={onAddCipherWheel}>
                                            Rotational Cipher Wheel
                                        </Button>
                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={onAddSecretMessage}>
                                            Secret Message Code
                                        </Button>
                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={onAddDecodePuzzle}>
                                            Decode Number Puzzle
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Logic & Math */}
                                <AccordionItem value="logic" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                            <Brain className="w-4 h-4" />
                                            <span>Logic & Math (6)</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={onAddSudoku}>
                                            Sudoku Grid (4x4 Mini)
                                        </Button>
                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={onAddKakuro}>
                                            Kakuro (Cross Sums)
                                        </Button>
                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={onAddLogicGrid}>
                                            Logic Grid Puzzle
                                        </Button>
                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={onAddNumberSearch}>
                                            Number Search Grid
                                        </Button>
                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={() => onAddMathWorksheet("addition", 10, 20)}>
                                            Math Practice Problems
                                        </Button>
                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={onAddDominoPuzzle}>
                                            Domino Math Puzzle
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Visual & Fun */}
                                <AccordionItem value="visual" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                                            <Palette className="w-4 h-4" />
                                            <span>Visual & Fun (5)</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={onAddMaze}>
                                            Maze Challenge
                                        </Button>
                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={onAddSpotTheDifference}>
                                            Spot the Difference
                                        </Button>
                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={onAddHiddenPicture}>
                                            Hidden Picture Search
                                        </Button>
                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={onAddColoringPage}>
                                            Coloring Page Frame
                                        </Button>
                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={onAddConnectTheDots}>
                                            Connect the Dots
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Games */}
                                <AccordionItem value="games" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                            <Gamepad2 className="w-4 h-4" />
                                            <span>Games & Matching (2)</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={onAddMatchingPairs}>
                                            Matching Pairs
                                        </Button>
                                        <Button size="sm" variant="outline" className="w-full justify-start h-8 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900" onClick={onAddTicTacToe}>
                                            Tic-Tac-Toe Game Boards
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    )}

                    {/* --- TAB 2: TEXT --- */}
                    {activeTab === "text" && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Header Lines</Label>
                                <Input value={headingInput} onChange={(e) => setHeadingInput(e.target.value)} className="h-8 text-xs" />
                                <Button size="sm" variant="outline" className="w-full h-8 text-xs font-semibold" onClick={() => onAddText(headingInput, true)}>
                                    Add Header Line
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Paragraph Content</Label>
                                <Input value={bodyTextInput} onChange={(e) => setBodyTextInput(e.target.value)} className="h-8 text-xs" />
                                <Button size="sm" variant="outline" className="w-full h-8 text-xs font-semibold" onClick={() => onAddText(bodyTextInput, false)}>
                                    Add Text Paragraph
                                </Button>
                            </div>

                            <div className="space-y-2 bg-indigo-50/60 dark:bg-indigo-950/40 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900">
                                <Label className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5" /> Dotted Handwriting Tracing
                                </Label>
                                <Input value={tracingInput} onChange={(e) => setTracingInput(e.target.value)} className="h-8 text-xs bg-white dark:bg-slate-900" />
                                <Button size="sm" className="w-full h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg" onClick={() => onAddTracingText(tracingInput)}>
                                    Add Dotted Tracing Line
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 3: DRAW --- */}
                    {activeTab === "freehand" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-slate-700 dark:text-slate-300">Freehand Ink</span>
                                <Button
                                    size="sm"
                                    variant={activeTool === "draw" ? "default" : "outline"}
                                    className="h-8 text-xs font-semibold"
                                    onClick={() => setActiveTool(activeTool === "draw" ? "select" : "draw")}
                                >
                                    {activeTool === "draw" ? "Pencil Active" : "Activate Pencil"}
                                </Button>
                            </div>
                            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span>Brush Size</span>
                                        <span>{brushSize}px</span>
                                    </div>
                                    <Slider value={[brushSize]} min={2} max={40} step={1} onValueChange={([val]) => setBrushProps({ size: val })} />
                                </div>
                                <div>
                                    <Label className="text-xs font-semibold mb-1 block">Ink Color</Label>
                                    <div className="flex gap-2 flex-wrap">
                                        {["#0f172a", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"].map((color) => (
                                            <button
                                                key={color}
                                                className={`w-6 h-6 rounded-full border-2 ${brushColor === color ? "border-indigo-600 scale-110" : "border-transparent"}`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setBrushProps({ color })}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 4: SHAPES & CODES --- */}
                    {activeTab === "shapes" && (
                        <div className="space-y-4">
                            <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Vector Shapes</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="h-14 flex-col gap-1 rounded-xl" onClick={() => onAddShape("rect")}>
                                    <Square className="w-5 h-5" />
                                    <span className="text-[10px] font-semibold">Rectangle</span>
                                </Button>
                                <Button variant="outline" className="h-14 flex-col gap-1 rounded-xl" onClick={() => onAddShape("circle")}>
                                    <Circle className="w-5 h-5" />
                                    <span className="text-[10px] font-semibold">Circle</span>
                                </Button>
                            </div>
                            <div className="space-y-2 bg-purple-50/60 dark:bg-purple-950/40 p-3 rounded-xl border border-purple-100 dark:border-purple-900">
                                <Label className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                                    <QrCode className="w-3.5 h-3.5" /> Vector QR Code
                                </Label>
                                <Input value={qrText} onChange={(e) => setQrText(e.target.value)} className="h-7 text-xs bg-white dark:bg-slate-900" />
                                <Button size="sm" className="w-full h-7 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg" onClick={() => onAddQRCode(qrText)}>
                                    Add QR Code
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 5: PRESETS --- */}
                    {activeTab === "preset" && (
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Quick Layout Presets</Label>
                            <Button variant="outline" className="w-full justify-start h-9 text-xs font-semibold rounded-xl" onClick={() => { onAddText("STUDENT WORKSHEET", true); onAddText("Name: ____________________ Date: ________", false); }}>
                                <FileText className="w-4 h-4 mr-2 text-indigo-500" /> Standard Header Banner
                            </Button>
                        </div>
                    )}
                </ScrollArea>
            </div>
        </aside>
    );
};
