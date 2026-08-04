"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Type, Grid3X3, Palette, Wand2, Plus, Sparkles, Layers, RefreshCw, Eye, HelpCircle, FileText,
    Pencil, Image as ImageIcon, QrCode, Barcode, ShieldAlert, Key, Brain, LayoutGrid, Award, Sliders, BookOpen
} from "lucide-react";
import { useWorksheetStore } from "@/lib/worksheet-store";

interface WorksheetSidebarProps {
    onAddText: (text: string, isHeader?: boolean) => void;
    onAddTracingText: (text: string, fontSize: number) => void;
    onAddShape: (type: "rect" | "circle" | "triangle" | "star") => void;
    onAddQRCode: (data: string) => void;
    onAddBarcode: (data: string) => void;
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
    onAddDoublePuzzle?: () => void;
    onAddFallenPhrase?: () => void;
    onAddLetterTiles?: () => void;
    onAddMathSquares?: () => void;
    onAddNumberBlocks?: () => void;
    onAddHiddenMessageSearch?: () => void;
    onAddMissingVowels?: (words: string[]) => void;
    onAddCodeword?: (words: string[]) => void;
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
    onAddDoublePuzzle,
    onAddFallenPhrase,
    onAddLetterTiles,
    onAddMathSquares,
    onAddNumberBlocks,
    onAddHiddenMessageSearch,
    onAddMissingVowels,
    onAddCodeword,
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

    // Word Search State
    const [wsTitle, setWsTitle] = useState("ANIMAL WORD SEARCH");
    const [wsWords, setWsWords] = useState("LION, TIGER, ELEPHANT, GIRAFFE, ZEBRA, MONKEY, DOLPHIN, EAGLE");
    const [wsSize, setWsSize] = useState("10");
    const [wsDiag, setWsDiag] = useState(true);
    const [wsReverse, setWsReverse] = useState(false);

    // Crossword State
    const [cwTitle, setCwTitle] = useState("CLASSROOM CROSSWORD");
    const [cwInputText, setCwInputText] = useState("LION: King of the jungle\nELEPHANT: Large mammal with trunk\nTIGER: Large wild striped cat\nGIRAFFE: Tallest mammal");

    // Other Puzzle Input States
    const [fillInSentence, setFillInSentence] = useState("The ________ jumps over the ________ wall.");
    const [fillInWordsText, setFillInWordsText] = useState("fox, high, quick");
    const [scrambleWordsText, setScrambleWordsText] = useState("APPLE, BANANA, CHERRY, ORANGE");
    const [missingLettersText, setMissingLettersText] = useState("GUITAR, PLANET, SUMMER, WINTER");
    const [missingVowelsText, setMissingVowelsText] = useState("ELEPHANT, SUNSHINE, BUTTERFLY");
    const [codewordWordsText, setCodewordWordsText] = useState("SECRET, CIPHER, PUZZLE, MATRIX");
    const [hiddenMsgTitle, setHiddenMsgTitle] = useState("HIDDEN SECRET MESSAGE");
    const [hiddenMsgText, setHiddenMsgText] = useState("DISCOVERY IS FUN");
    const [hiddenWordsText, setHiddenWordsText] = useState("STAR, MOON, SUN, PLANET");

    // Typography
    const [headingInput, setHeadingInput] = useState("Name: ____________ Date: ________");
    const [bodyTextInput, setBodyTextInput] = useState("Type instructions or paragraph text here...");
    const [tracingInput, setTracingInput] = useState("Aa Bb Cc 1 2 3");

    // Barcode / QR
    const [qrData, setQrData] = useState("https://kbacademy.com");
    const [barcodeData, setBarcodeData] = useState("9783161484100");

    const handleCreateWordSearch = () => {
        const wordsArray = wsWords.split(",").map((w) => w.trim()).filter((w) => w.length > 0);
        if (wordsArray.length === 0) return;
        const dirs: string[] = ["H", "V"];
        if (wsDiag) dirs.push("D");
        if (wsReverse) dirs.push("R_H", "R_V");
        onAddWordSearch(wordsArray, wsTitle, parseInt(wsSize), dirs);
    };

    const handleCreateCrossword = () => {
        const lines = cwInputText.split("\n").filter((l) => l.trim().length > 0);
        const items = lines.map((l) => {
            const parts = l.split(":");
            return {
                word: parts[0].trim().toUpperCase().replace(/[^A-Z]/g, ""),
                clue: parts.slice(1).join(":").trim() || `Clue for ${parts[0]}`,
            };
        }).filter((i) => i.word.length >= 2);

        if (items.length > 0) {
            onAddCrossword(cwTitle, items);
        }
    };

    return (
        <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-[calc(100vh-4rem)] z-20 shadow-sm overflow-hidden select-none">
            {/* Primary Category Selector Sidebar Navigation */}
            <div className="grid grid-cols-5 h-12 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-1 gap-1 shrink-0">
                <button
                    className={`flex flex-col items-center justify-center rounded-lg transition-all ${activeTab === "puzzles" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                    onClick={() => setActiveTab("puzzles")}
                >
                    <Grid3X3 className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Puzzles</span>
                </button>

                <button
                    className={`flex flex-col items-center justify-center rounded-lg transition-all ${activeTab === "text" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                    onClick={() => setActiveTab("text")}
                >
                    <Type className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Text</span>
                </button>

                <button
                    className={`flex flex-col items-center justify-center rounded-lg transition-all ${activeTab === "freehand" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                    onClick={() => {
                        setActiveTab("freehand");
                        setActiveTool("draw");
                    }}
                >
                    <Pencil className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Draw</span>
                </button>

                <button
                    className={`flex flex-col items-center justify-center rounded-lg transition-all ${activeTab === "shapes" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                    onClick={() => setActiveTab("shapes")}
                >
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Shapes</span>
                </button>

                <button
                    className={`flex flex-col items-center justify-center rounded-lg transition-all ${activeTab === "preset" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                    onClick={() => setActiveTab("preset")}
                >
                    <BookOpen className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Presets</span>
                </button>
            </div>

            {/* Right Sub-Panel Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900">
                <div className="h-11 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        {activeTab === "puzzles" && "21 Standalone Puzzle Accordions"}
                        {activeTab === "text" && "Typography & Tracing"}
                        {activeTab === "freehand" && "Smooth Ink Brush"}
                        {activeTab === "shapes" && "Shapes & QR / Barcodes"}
                        {activeTab === "preset" && "Worksheet Layout Templates"}
                    </span>
                </div>

                <ScrollArea className="flex-1 p-3">
                    {/* --- TAB 1: 21 INDIVIDUAL PUZZLE ACCORDIONS --- */}
                    {activeTab === "puzzles" && (
                        <div className="space-y-2">
                            <Accordion type="single" collapsible className="w-full space-y-2">
                                
                                {/* 1. WORD SEARCH ACCORDION */}
                                <AccordionItem value="p-word-search" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                            <Grid3X3 className="w-4 h-4" />
                                            <span>1. Word Search</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
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
                                                <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="8">8 × 8 Grid</SelectItem>
                                                    <SelectItem value="10">10 × 10 Grid</SelectItem>
                                                    <SelectItem value="12">12 × 12 Grid</SelectItem>
                                                    <SelectItem value="15">15 × 15 Grid</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button size="sm" className="w-full h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg mt-1" onClick={handleCreateWordSearch}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Word Search
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 2. CROSSWORD ACCORDION */}
                                <AccordionItem value="p-crossword" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                                            <Sparkles className="w-4 h-4" />
                                            <span>2. Crossword Puzzle</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold text-slate-500">Title</Label>
                                            <Input value={cwTitle} onChange={(e) => setCwTitle(e.target.value)} className="h-7 text-xs" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold text-slate-500">Clues & Answers (ANSWER: CLUE)</Label>
                                            <Textarea value={cwInputText} onChange={(e) => setCwInputText(e.target.value)} className="h-20 text-xs font-mono resize-none" />
                                        </div>
                                        <Button size="sm" className="w-full h-8 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg" onClick={handleCreateCrossword}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Crossword
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 3. FILL-IN BLANKS ACCORDION */}
                                <AccordionItem value="p-fill-in" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                            <FileText className="w-4 h-4" />
                                            <span>3. Fill-In (Blanks)</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold text-slate-500">Sentence (Use ____ for blanks)</Label>
                                            <Textarea value={fillInSentence} onChange={(e) => setFillInSentence(e.target.value)} className="h-16 text-xs resize-none" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold text-slate-500">Word Bank (Comma Separated)</Label>
                                            <Input value={fillInWordsText} onChange={(e) => setFillInWordsText(e.target.value)} className="h-7 text-xs font-mono" />
                                        </div>
                                        <Button size="sm" className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg" onClick={() => onAddFillInBlanks(fillInSentence, fillInWordsText.split(",").map((w) => w.trim()))}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Fill-In Puzzle
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 4. WORD SCRAMBLE ACCORDION */}
                                <AccordionItem value="p-word-scramble" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                            <RefreshCw className="w-4 h-4" />
                                            <span>4. Word Scramble</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold text-slate-500">Words (Comma Separated)</Label>
                                            <Textarea value={scrambleWordsText} onChange={(e) => setScrambleWordsText(e.target.value)} className="h-16 text-xs font-mono uppercase resize-none" />
                                        </div>
                                        <Button size="sm" className="w-full h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg" onClick={() => onAddWordScramble(scrambleWordsText.split(",").map((w) => w.trim()))}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Word Scramble
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 5. CRYPTOGRAM ACCORDION */}
                                <AccordionItem value="p-cryptogram" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                                            <Key className="w-4 h-4" />
                                            <span>5. Cryptogram</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <Button size="sm" className="w-full h-8 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg" onClick={onAddCryptogram}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Cryptogram
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 6. CODEWORD ACCORDION */}
                                <AccordionItem value="p-codeword" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                                            <Key className="w-4 h-4" />
                                            <span>6. Codeword</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold text-slate-500">Words (Comma Separated)</Label>
                                            <Input value={codewordWordsText} onChange={(e) => setCodewordWordsText(e.target.value)} className="h-7 text-xs font-mono uppercase" />
                                        </div>
                                        <Button size="sm" className="w-full h-8 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg" onClick={() => onAddCodeword && onAddCodeword(codewordWordsText.split(",").map((w) => w.trim()))}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Codeword Puzzle
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 7. SUDOKU ACCORDION */}
                                <AccordionItem value="p-sudoku" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                            <Brain className="w-4 h-4" />
                                            <span>7. Sudoku</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <Button size="sm" className="w-full h-8 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg" onClick={onAddSudoku}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Sudoku Grid
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 8. KAKURO ACCORDION */}
                                <AccordionItem value="p-kakuro" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                                            <Brain className="w-4 h-4" />
                                            <span>8. Kakuro (Cross Sums)</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <Button size="sm" className="w-full h-8 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg" onClick={onAddKakuro}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Kakuro Grid
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 9. NUMBER SEARCH ACCORDION */}
                                <AccordionItem value="p-number-search" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                            <Grid3X3 className="w-4 h-4" />
                                            <span>9. Number Search</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <Button size="sm" className="w-full h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg" onClick={onAddNumberSearch}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Number Search
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 10. MAZE ACCORDION */}
                                <AccordionItem value="p-maze" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                                            <LayoutGrid className="w-4 h-4" />
                                            <span>10. Maze Challenge</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <Button size="sm" className="w-full h-8 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg" onClick={onAddMaze}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Maze Challenge
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 11. HIDDEN MESSAGE ACCORDION */}
                                <AccordionItem value="p-hidden-message" className="border border-indigo-200 dark:border-indigo-800 rounded-xl px-3 bg-indigo-50/50 dark:bg-indigo-950/30">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                            <Sparkles className="w-4 h-4" />
                                            <span>11. Hidden Message</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold text-slate-500">Hidden Secret Message</Label>
                                            <Input value={hiddenMsgText} onChange={(e) => setHiddenMsgText(e.target.value)} className="h-7 text-xs font-mono uppercase font-bold" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold text-slate-500">Words (Comma Separated)</Label>
                                            <Input value={hiddenWordsText} onChange={(e) => setHiddenWordsText(e.target.value)} className="h-7 text-xs font-mono uppercase" />
                                        </div>
                                        <Button size="sm" className="w-full h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg" onClick={() => onAddHiddenMessageSearch && onAddHiddenMessageSearch()}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Hidden Message
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 12. ACROSTIC ACCORDION */}
                                <AccordionItem value="p-acrostic" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
                                            <Type className="w-4 h-4" />
                                            <span>12. Acrostic Poem</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <Button size="sm" className="w-full h-8 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-lg" onClick={onAddAcrostic}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Acrostic Poem
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 13. LOGIC GRID ACCORDION */}
                                <AccordionItem value="p-logic-grid" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                            <Brain className="w-4 h-4" />
                                            <span>13. Logic Grid</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <Button size="sm" className="w-full h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg" onClick={onAddLogicGrid}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Logic Grid
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 14. MATH SQUARES ACCORDION */}
                                <AccordionItem value="p-math-squares" className="border border-indigo-200 dark:border-indigo-800 rounded-xl px-3 bg-indigo-50/50 dark:bg-indigo-950/30">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                            <Brain className="w-4 h-4" />
                                            <span>14. Math Squares</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <Button size="sm" className="w-full h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg" onClick={() => onAddMathSquares && onAddMathSquares()}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Math Squares
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 15. MISSING VOWELS ACCORDION */}
                                <AccordionItem value="p-missing-vowels" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                            <Type className="w-4 h-4" />
                                            <span>15. Missing Vowels</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold text-slate-500">Words (Comma Separated)</Label>
                                            <Textarea value={missingVowelsText} onChange={(e) => setMissingVowelsText(e.target.value)} className="h-16 text-xs font-mono uppercase resize-none" />
                                        </div>
                                        <Button size="sm" className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg" onClick={() => onAddMissingVowels && onAddMissingVowels(missingVowelsText.split(",").map((w) => w.trim()))}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Missing Vowels
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 16. MISSING LETTERS ACCORDION */}
                                <AccordionItem value="p-missing-letters" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                            <Type className="w-4 h-4" />
                                            <span>16. Missing Letters</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold text-slate-500">Words (Comma Separated)</Label>
                                            <Textarea value={missingLettersText} onChange={(e) => setMissingLettersText(e.target.value)} className="h-16 text-xs font-mono uppercase resize-none" />
                                        </div>
                                        <Button size="sm" className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg" onClick={() => onAddMissingLetters(missingLettersText.split(",").map((w) => w.trim()))}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Missing Letters
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 17. MATCHING ACCORDION */}
                                <AccordionItem value="p-matching" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                                            <LayoutGrid className="w-4 h-4" />
                                            <span>17. Matching Pairs</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <Button size="sm" className="w-full h-8 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-lg" onClick={onAddMatchingPairs}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Matching Pairs
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 18. SPOT THE DIFFERENCE ACCORDION */}
                                <AccordionItem value="p-spot-difference" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                                            <Eye className="w-4 h-4" />
                                            <span>18. Spot the Difference</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <Button size="sm" className="w-full h-8 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg" onClick={onAddSpotTheDifference}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Spot Difference
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 19. CONNECT THE DOTS ACCORDION */}
                                <AccordionItem value="p-connect-dots" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-[orange] dark:text-orange-400">
                                            <Pencil className="w-4 h-4" />
                                            <span>19. Connect the Dots</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <Button size="sm" className="w-full h-8 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg" onClick={onAddConnectTheDots}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Connect Dots
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 20. COLORING PAGES ACCORDION */}
                                <AccordionItem value="p-coloring-pages" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
                                            <Palette className="w-4 h-4" />
                                            <span>20. Coloring Pages</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <Button size="sm" className="w-full h-8 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-lg" onClick={onAddColoringPage}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Coloring Frame
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 21. DOT-TO-DOT ACCORDION */}
                                <AccordionItem value="p-dot-to-dot" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                            <Pencil className="w-4 h-4" />
                                            <span>21. Dot-to-Dot</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <Button size="sm" className="w-full h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg" onClick={onAddConnectTheDots}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Dot-to-Dot Puzzle
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                            </Accordion>
                        </div>
                    )}

                    {/* --- TAB 2: TEXT & TRACING --- */}
                    {activeTab === "text" && (
                        <div className="space-y-4">
                            <div className="space-y-2.5 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Name & Date Header</Label>
                                <Input value={headingInput} onChange={(e) => setHeadingInput(e.target.value)} className="h-8 text-xs" />
                                <Button size="sm" variant="outline" className="w-full h-7 text-xs font-semibold bg-white dark:bg-slate-900" onClick={() => onAddText(headingInput, true)}>
                                    + Insert Header Line
                                </Button>
                            </div>

                            <div className="space-y-2.5 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Instruction / Body Paragraph</Label>
                                <Textarea value={bodyTextInput} onChange={(e) => setBodyTextInput(e.target.value)} className="h-20 text-xs resize-none" />
                                <Button size="sm" variant="outline" className="w-full h-7 text-xs font-semibold bg-white dark:bg-slate-900" onClick={() => onAddText(bodyTextInput, false)}>
                                    + Insert Text Block
                                </Button>
                            </div>

                            <div className="space-y-2.5 p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800">
                                <Label className="text-xs font-bold text-indigo-700 dark:text-indigo-300">K-2 Handwriting Tracing Text</Label>
                                <Input value={tracingInput} onChange={(e) => setTracingInput(e.target.value)} className="h-8 text-xs font-mono" />
                                <Button size="sm" className="w-full h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg" onClick={() => onAddTracingText(tracingInput, 36)}>
                                    + Add Dotted Tracing Line
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 3: FREEHAND DRAWING --- */}
                    {activeTab === "freehand" && (
                        <div className="space-y-4">
                            <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Ink Tool Selection</Label>
                                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-600 dark:text-indigo-400">{activeTool}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5">
                                    <Button size="sm" variant={activeTool === "select" ? "default" : "outline"} className="h-8 text-xs font-semibold" onClick={() => setActiveTool("select")}>Select</Button>
                                    <Button size="sm" variant={activeTool === "draw" ? "default" : "outline"} className="h-8 text-xs font-semibold" onClick={() => setActiveTool("draw")}>Draw Ink</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 4: SHAPES & BARCODES --- */}
                    {activeTab === "shapes" && (
                        <div className="space-y-4">
                            <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Vector Shapes</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button size="sm" variant="outline" className="h-8 text-xs font-semibold bg-white dark:bg-slate-900" onClick={() => onAddShape("rect")}>Rectangle</Button>
                                    <Button size="sm" variant="outline" className="h-8 text-xs font-semibold bg-white dark:bg-slate-900" onClick={() => onAddShape("circle")}>Circle</Button>
                                    <Button size="sm" variant="outline" className="h-8 text-xs font-semibold bg-white dark:bg-slate-900" onClick={() => onAddShape("triangle")}>Triangle</Button>
                                    <Button size="sm" variant="outline" className="h-8 text-xs font-semibold bg-white dark:bg-slate-900" onClick={() => onAddShape("star")}>Star</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 5: PRESETS --- */}
                    {activeTab === "preset" && (
                        <div className="space-y-3">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Standard KDP 8.5x11 Presets</span>
                                <p className="text-[11px] text-slate-500">Includes safe margins, bleed settings, and standard page headers.</p>
                            </div>
                        </div>
                    )}
                </ScrollArea>
            </div>
        </aside>
    );
};
