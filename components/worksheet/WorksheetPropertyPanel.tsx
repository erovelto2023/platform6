"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
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
    Palette, Type, FileText, CheckCircle2, ShieldAlert, BarChart3, Wand2, Settings2, HelpCircle,
    Plus, Lock, Unlock, Eye, BookOpen, LayoutGrid, Award, Sliders, Unlink, Split,
    AlignHorizontalJustifyCenter, AlignVerticalJustifyCenter, AlignLeft, AlignRight
} from "lucide-react";
import { useWorksheetStore } from "@/lib/worksheet-store";
import {
    WordSearchConfig,
    WordDirection,
    DifficultyLevel,
    createDefaultWordSearchConfig,
    solveAndGenerateWordSearch,
    WORD_SEARCH_THEMES
} from "@/lib/word-search-engine";
import {
    CrosswordConfig,
    CrosswordDifficulty,
    CrosswordTypeMode,
    CellStyleMode,
    SymmetryMode,
    ClueTypeMode,
    ClueLayoutMode,
    createDefaultCrosswordConfig,
    solveAndGenerateCrossword,
    CROSSWORD_THEMES,
    CROSSWORD_TEMPLATES,
} from "@/lib/crossword-engine";
import {
    generateAdvancedWordSearchObjects,
    generateAdvancedCrosswordObjects,
    generateWordSearchComponentGroups,
    generateCrosswordComponentGroups,
    attachPuzzleMetadata,
    generateFillInBlanksObjectsFromConfig,
    generateWordScrambleObjectsFromConfig,
    generateMissingLettersObjectsFromConfig,
    generateSudokuObjectsFromConfig,
    generateCryptogramObjectsFromConfig,
    generateCrackTheCodeObjectsFromConfig,
    generateDoublePuzzleObjectsFromConfig,
    generateFallenPhraseObjectsFromConfig,
    generateLetterTilesObjectsFromConfig,
    generateMathSquaresObjectsFromConfig,
    generateNumberBlocksObjectsFromConfig,
    generateHiddenMessageSearchFromConfig,
    generateMissingVowelsObjectsFromConfig,
    generateCodewordObjectsFromConfig,
    FillInBlanksConfig,
    WordScrambleConfig,
    MissingLettersConfig,
    SudokuConfig,
    CryptogramConfig,
    CrackTheCodeConfig,
    DoublePuzzleConfig,
    FallenPhraseConfig,
    LetterTilesConfig,
    MathSquaresConfig,
    NumberBlocksConfig,
    HiddenMessageSearchConfig,
    MissingVowelsConfig,
    CodewordConfig,
} from "@/lib/worksheet-fabric";

interface WorksheetPropertyPanelProps {
    fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
}

export const WorksheetPropertyPanel: React.FC<WorksheetPropertyPanelProps> = ({ fabricCanvasRef }) => {
    const { selectedObjectId, selectedObjectType, selectedObjectProps, setSelectedObject, currentPageIndex, customFonts } = useWorksheetStore();

    // --- PUZZLE SELECTION & CONFIG STATES ---
    const [wsConfig, setWsConfig] = useState<WordSearchConfig>(createDefaultWordSearchConfig("animals"));
    const [isWordSearchSelected, setIsWordSearchSelected] = useState(false);
    const [wordsInputText, setWordsInputText] = useState("");

    const [cwConfig, setCwConfig] = useState<CrosswordConfig>(createDefaultCrosswordConfig());
    const [isCrosswordSelected, setIsCrosswordSelected] = useState(false);
    const [crosswordWordsInputText, setCrosswordWordsInputText] = useState("");

    // Activity States
    const [fillInConfig, setFillInConfig] = useState<FillInBlanksConfig>({ title: "FILL IN THE BLANKS", sentence: "The ________ jumps over the ________ wall.", wordBank: ["fox", "high", "quick"] });
    const [isFillInSelected, setIsFillInSelected] = useState(false);

    const [scrambleConfig, setScrambleConfig] = useState<WordScrambleConfig>({ title: "WORD SCRAMBLE", words: ["APPLE", "BANANA", "CHERRY"] });
    const [isScrambleSelected, setIsScrambleSelected] = useState(false);

    const [missingLettersConfig, setMissingLettersConfig] = useState<MissingLettersConfig>({ title: "MISSING LETTERS", words: ["GUITAR", "PLANET", "SUMMER"] });
    const [isMissingLettersSelected, setIsMissingLettersSelected] = useState(false);

    const [sudokuConfig, setSudokuConfig] = useState<SudokuConfig>({ title: "SUDOKU PUZZLE (MINI 4X4)", size: 4, difficulty: "easy" });
    const [isSudokuSelected, setIsSudokuSelected] = useState(false);

    const [cryptoConfig, setCryptoConfig] = useState<CryptogramConfig>({ title: "CRYPTOGRAM PUZZLE", phrase: "KNOWLEDGE IS POWER" });
    const [isCryptoSelected, setIsCryptoSelected] = useState(false);

    const [crackCodeConfig, setCrackCodeConfig] = useState<CrackTheCodeConfig>({ title: "CRACK THE CODE!", secretCode: "682", clues: ["6 8 2  - One number is correct and well placed", "6 1 4  - One number is correct but wrong place", "2 0 6  - Two numbers are correct but wrong place", "7 3 8  - Nothing is correct"] });
    const [isCrackCodeSelected, setIsCrackCodeSelected] = useState(false);

    // Discovery Education Puzzle States
    const [doublePuzzleConfig, setDoublePuzzleConfig] = useState<DoublePuzzleConfig>({
        title: "DOUBLE PUZZLE",
        words: [{ word: "LEMON", clue: "Yellow sour fruit" }, { word: "PEACH", clue: "Fuzzy summer fruit" }, { word: "GRAPE", clue: "Small round fruit on vines" }],
        finalQuote: "GREAT JOB",
    });
    const [isDoublePuzzleSelected, setIsDoublePuzzleSelected] = useState(false);

    const [fallenPhraseConfig, setFallenPhraseConfig] = useState<FallenPhraseConfig>({ title: "FALLEN PHRASE PUZZLE", phrase: "PRACTICE MAKES PERFECT" });
    const [isFallenPhraseSelected, setIsFallenPhraseSelected] = useState(false);

    const [letterTilesConfig, setLetterTilesConfig] = useState<LetterTilesConfig>({ title: "LETTER TILES PUZZLE", phrase: "WISDOM BEGINS IN WONDER", chunkSize: 3 });
    const [isLetterTilesSelected, setIsLetterTilesSelected] = useState(false);

    const [mathSquaresConfig, setMathSquaresConfig] = useState<MathSquaresConfig>({ title: "MATH SQUARES PUZZLE", size: 3 });
    const [isMathSquaresSelected, setIsMathSquaresSelected] = useState(false);

    const [numberBlocksConfig, setNumberBlocksConfig] = useState<NumberBlocksConfig>({ title: "NUMBER BLOCKS", rows: 4, cols: 4 });
    const [isNumberBlocksSelected, setIsNumberBlocksSelected] = useState(false);

    const [hiddenMessageConfig, setHiddenMessageConfig] = useState<HiddenMessageSearchConfig>({ title: "HIDDEN MESSAGE WORD SEARCH", words: ["STAR", "MOON", "SUN", "PLANET"], hiddenMessage: "DISCOVERY IS FUN", gridSize: 10 });
    const [isHiddenMessageSelected, setIsHiddenMessageSelected] = useState(false);

    const [missingVowelsConfig, setMissingVowelsConfig] = useState<MissingVowelsConfig>({ title: "MISSING VOWELS PUZZLE", words: ["ELEPHANT", "SUNSHINE", "BUTTERFLY"] });
    const [isMissingVowelsSelected, setIsMissingVowelsSelected] = useState(false);

    const [codewordConfig, setCodewordConfig] = useState<CodewordConfig>({ title: "CODEWORD PUZZLE", words: ["SECRET", "CIPHER", "PUZZLE"] });
    const [isCodewordSelected, setIsCodewordSelected] = useState(false);

    const updateSelectionStateRef = useRef<() => void>(() => {});
    updateSelectionStateRef.current = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;

        setIsWordSearchSelected(false);
        setIsCrosswordSelected(false);
        setIsFillInSelected(false);
        setIsScrambleSelected(false);
        setIsMissingLettersSelected(false);
        setIsSudokuSelected(false);
        setIsCryptoSelected(false);
        setIsCrackCodeSelected(false);
        setIsDoublePuzzleSelected(false);
        setIsFallenPhraseSelected(false);
        setIsLetterTilesSelected(false);
        setIsMathSquaresSelected(false);
        setIsNumberBlocksSelected(false);
        setIsHiddenMessageSelected(false);
        setIsMissingVowelsSelected(false);
        setIsCodewordSelected(false);

        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        let targetObj: any = activeObj;
        while (targetObj && !targetObj.customType) {
            if (targetObj.group) {
                targetObj = targetObj.group;
            } else if (targetObj.parent) {
                targetObj = targetObj.parent;
            } else {
                break;
            }
        }

        let customType = targetObj ? targetObj.customType : undefined;
        if (!customType) {
            if ((targetObj && targetObj.wordSearchConfig) || (activeObj as any).wordSearchConfig) customType = "word-search";
            else if ((targetObj && targetObj.crosswordConfig) || (activeObj as any).crosswordConfig) customType = "crossword";
        }

        if (customType === "crossword") {
            setIsCrosswordSelected(true);
            const cfg: CrosswordConfig = (targetObj && targetObj.crosswordConfig) || (activeObj as any).crosswordConfig || createDefaultCrosswordConfig();
            setCwConfig(cfg);
            setCrosswordWordsInputText(cfg.words.map((w) => `${w.word}: ${w.clue}`).join("\n"));
        } else if (customType === "word-search") {
            setIsWordSearchSelected(true);
            const cfg: WordSearchConfig = (targetObj && targetObj.wordSearchConfig) || (activeObj as any).wordSearchConfig || createDefaultWordSearchConfig();
            setWsConfig(cfg);
            setWordsInputText(cfg.words.map((w) => w.word).join(", "));
        } else if (customType === "fill-in-blanks") {
            setIsFillInSelected(true);
            const cfg: FillInBlanksConfig = targetObj.puzzleConfig || { title: "FILL IN THE BLANKS", sentence: "The ________ jumps over the ________ wall.", wordBank: ["fox", "high", "quick"] };
            setFillInConfig(cfg);
        } else if (customType === "word-scramble") {
            setIsScrambleSelected(true);
            const cfg: WordScrambleConfig = targetObj.puzzleConfig || { title: "WORD SCRAMBLE", words: ["APPLE", "BANANA", "CHERRY"] };
            setScrambleConfig(cfg);
        } else if (customType === "missing-letters") {
            setIsMissingLettersSelected(true);
            const cfg: MissingLettersConfig = targetObj.puzzleConfig || { title: "MISSING LETTERS", words: ["GUITAR", "PLANET", "SUMMER"] };
            setMissingLettersConfig(cfg);
        } else if (customType === "missing-vowels") {
            setIsMissingVowelsSelected(true);
            const cfg: MissingVowelsConfig = targetObj.puzzleConfig || { title: "MISSING VOWELS PUZZLE", words: ["ELEPHANT", "SUNSHINE", "BUTTERFLY"] };
            setMissingVowelsConfig(cfg);
        } else if (customType === "codeword") {
            setIsCodewordSelected(true);
            const cfg: CodewordConfig = targetObj.puzzleConfig || { title: "CODEWORD PUZZLE", words: ["SECRET", "CIPHER", "PUZZLE"] };
            setCodewordConfig(cfg);
        } else if (customType === "sudoku") {
            setIsSudokuSelected(true);
            const cfg: SudokuConfig = targetObj.puzzleConfig || { title: "SUDOKU PUZZLE (MINI 4X4)", size: 4, difficulty: "easy" };
            setSudokuConfig(cfg);
        } else if (customType === "cryptogram") {
            setIsCryptoSelected(true);
            const cfg: CryptogramConfig = targetObj.puzzleConfig || { title: "CRYPTOGRAM PUZZLE", phrase: "KNOWLEDGE IS POWER" };
            setCryptoConfig(cfg);
        } else if (customType === "crack-the-code") {
            setIsCrackCodeSelected(true);
            const cfg: CrackTheCodeConfig = targetObj.puzzleConfig || { title: "CRACK THE CODE!", secretCode: "682", clues: ["6 8 2  - One number is correct and well placed"] };
            setCrackCodeConfig(cfg);
        } else if (customType === "double-puzzle") {
            setIsDoublePuzzleSelected(true);
            const cfg: DoublePuzzleConfig = targetObj.puzzleConfig || { title: "DOUBLE PUZZLE", words: [{ word: "LEMON", clue: "Yellow fruit" }], finalQuote: "GREAT JOB" };
            setDoublePuzzleConfig(cfg);
        } else if (customType === "fallen-phrase") {
            setIsFallenPhraseSelected(true);
            const cfg: FallenPhraseConfig = targetObj.puzzleConfig || { title: "FALLEN PHRASE PUZZLE", phrase: "PRACTICE MAKES PERFECT" };
            setFallenPhraseConfig(cfg);
        } else if (customType === "letter-tiles") {
            setIsLetterTilesSelected(true);
            const cfg: LetterTilesConfig = targetObj.puzzleConfig || { title: "LETTER TILES PUZZLE", phrase: "WISDOM BEGINS IN WONDER", chunkSize: 3 };
            setLetterTilesConfig(cfg);
        } else if (customType === "math-squares") {
            setIsMathSquaresSelected(true);
            const cfg: MathSquaresConfig = targetObj.puzzleConfig || { title: "MATH SQUARES PUZZLE", size: 3 };
            setMathSquaresConfig(cfg);
        } else if (customType === "number-blocks") {
            setIsNumberBlocksSelected(true);
            const cfg: NumberBlocksConfig = targetObj.puzzleConfig || { title: "NUMBER BLOCKS", rows: 4, cols: 4 };
            setNumberBlocksConfig(cfg);
        } else if (customType === "hidden-message-search") {
            setIsHiddenMessageSelected(true);
            const cfg: HiddenMessageSearchConfig = targetObj.puzzleConfig || { title: "HIDDEN MESSAGE WORD SEARCH", words: ["STAR", "MOON", "SUN", "PLANET"], hiddenMessage: "DISCOVERY IS FUN", gridSize: 10 };
            setHiddenMessageConfig(cfg);
        }
    };

    // Sync state with active canvas selection safely without memory leaks
    useEffect(() => {
        const c = fabricCanvasRef.current;
        if (!c) return;

        const handleSelection = () => {
            updateSelectionStateRef.current();
        };

        c.on("selection:created", handleSelection);
        c.on("selection:updated", handleSelection);
        c.on("selection:cleared", handleSelection);

        updateSelectionStateRef.current();

        return () => {
            c.off("selection:created", handleSelection);
            c.off("selection:updated", handleSelection);
            c.off("selection:cleared", handleSelection);
        };
    }, [fabricCanvasRef, currentPageIndex, selectedObjectId]);

    // Live Apply Handlers for all activity types
    const handleApplyWordSearchConfig = (newConfig: WordSearchConfig) => {
        setWsConfig(newConfig);
        const c = fabricCanvasRef.current;
        if (!c) return;

        const activeObj = c.getActiveObject();
        let activeComp = (activeObj as any)?.puzzleComponent;
        if (!activeComp && activeObj) {
            let p: any = activeObj;
            while (p && !p.puzzleComponent) {
                p = p.group || p.parent;
            }
            if (p) activeComp = p.puzzleComponent;
        }
        if (!activeComp) activeComp = "grid";

        const { titleGroup: newTitle, gridGroup: newGrid, bankGroup: newBank } = generateWordSearchComponentGroups(newConfig);

        const existingObjects = c.getObjects().filter((o: any) => o.customType === "word-search");
        let activeToSelect: fabric.FabricObject | null = null;

        if (existingObjects.length > 0) {
            existingObjects.forEach((oldObj: any) => {
                const left = oldObj.left || 60;
                const top = oldObj.top || 60;
                const comp = oldObj.puzzleComponent;

                if (comp === "title" && newTitle) {
                    c.remove(oldObj);
                    newTitle.set({ left, top });
                    attachPuzzleMetadata(newTitle, "word-search", "title", newConfig);
                    c.add(newTitle);
                    if (activeComp === "title") activeToSelect = newTitle;
                } else if (comp === "grid" && newGrid) {
                    c.remove(oldObj);
                    newGrid.set({ left, top });
                    attachPuzzleMetadata(newGrid, "word-search", "grid", newConfig);
                    c.add(newGrid);
                    if (activeComp === "grid") activeToSelect = newGrid;
                } else if (comp === "word-bank" && newBank) {
                    c.remove(oldObj);
                    newBank.set({ left, top });
                    attachPuzzleMetadata(newBank, "word-search", "word-bank", newConfig);
                    c.add(newBank);
                    if (activeComp === "word-bank") activeToSelect = newBank;
                } else if (!comp) {
                    const newObjects = generateAdvancedWordSearchObjects(newConfig);
                    c.remove(oldObj);
                    const newGroup = new fabric.Group(newObjects, { left, top, subTargetCheck: true });
                    attachPuzzleMetadata(newGroup, "word-search", "full", newConfig);
                    c.add(newGroup);
                    activeToSelect = newGroup;
                }
            });
        }

        const targetToSelect = activeToSelect || newGrid || newTitle || newBank;
        if (targetToSelect) {
            c.setActiveObject(targetToSelect);
        }

        setIsWordSearchSelected(true);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const updateWsConfig = (updater: (prev: WordSearchConfig) => WordSearchConfig) => {
        const updated = updater(wsConfig);
        handleApplyWordSearchConfig(updated);
    };

    const applyWsTheme = (themeKey: string) => {
        const theme = WORD_SEARCH_THEMES[themeKey];
        if (!theme) return;
        updateWsConfig((prev) => ({
            ...prev,
            title: `${theme.name.toUpperCase()} WORD SEARCH`,
            theme: theme.name,
            words: theme.words.map((w, i) => ({ id: `w-${i}-${Date.now()}`, word: w, displayText: w })),
        }));
        setWordsInputText(theme.words.join(", "));
    };

    const handleApplyCrosswordConfig = (newConfig: CrosswordConfig) => {
        setCwConfig(newConfig);
        const c = fabricCanvasRef.current;
        if (!c) return;

        const activeObj = c.getActiveObject();
        let activeComp = (activeObj as any)?.puzzleComponent;
        if (!activeComp && activeObj) {
            let p: any = activeObj;
            while (p && !p.puzzleComponent) {
                p = p.group || p.parent;
            }
            if (p) activeComp = p.puzzleComponent;
        }
        if (!activeComp) activeComp = "grid";

        const { titleGroup: newTitle, gridGroup: newGrid, cluesGroup: newClues } = generateCrosswordComponentGroups(newConfig);

        const existingObjects = c.getObjects().filter((o: any) => o.customType === "crossword");
        let activeToSelect: fabric.FabricObject | null = null;

        if (existingObjects.length > 0) {
            existingObjects.forEach((oldObj: any) => {
                const left = oldObj.left || 60;
                const top = oldObj.top || 60;
                const comp = oldObj.puzzleComponent;

                if (comp === "title" && newTitle) {
                    c.remove(oldObj);
                    newTitle.set({ left, top });
                    attachPuzzleMetadata(newTitle, "crossword", "title", newConfig);
                    c.add(newTitle);
                    if (activeComp === "title") activeToSelect = newTitle;
                } else if (comp === "grid" && newGrid) {
                    c.remove(oldObj);
                    newGrid.set({ left, top });
                    attachPuzzleMetadata(newGrid, "crossword", "grid", newConfig);
                    c.add(newGrid);
                    if (activeComp === "grid") activeToSelect = newGrid;
                } else if (comp === "clues" && newClues) {
                    c.remove(oldObj);
                    newClues.set({ left, top });
                    attachPuzzleMetadata(newClues, "crossword", "clues", newConfig);
                    c.add(newClues);
                    if (activeComp === "clues") activeToSelect = newClues;
                } else if (!comp) {
                    const newObjects = generateAdvancedCrosswordObjects(newConfig);
                    c.remove(oldObj);
                    const newGroup = new fabric.Group(newObjects, { left, top, subTargetCheck: true });
                    attachPuzzleMetadata(newGroup, "crossword", "full", newConfig);
                    c.add(newGroup);
                    activeToSelect = newGroup;
                }
            });
        }

        const targetToSelect = activeToSelect || newGrid || newTitle || newClues;
        if (targetToSelect) {
            c.setActiveObject(targetToSelect);
        }

        setIsCrosswordSelected(true);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const updateCwConfig = (updater: (prev: CrosswordConfig) => CrosswordConfig) => {
        const updated = updater(cwConfig);
        handleApplyCrosswordConfig(updated);
    };

    const handleApplyFillInConfig = (newConfig: FillInBlanksConfig) => {
        setFillInConfig(newConfig);
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        const left = activeObj.left || 60;
        const top = activeObj.top || 60;

        const newObjects = generateFillInBlanksObjectsFromConfig(newConfig);
        c.remove(activeObj);

        const newGroup = new fabric.Group(newObjects, { left, top, subTargetCheck: true });
        (newGroup as any).customType = "fill-in-blanks";
        (newGroup as any).puzzleConfig = newConfig;

        c.add(newGroup);
        c.setActiveObject(newGroup);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const handleApplyScrambleConfig = (newConfig: WordScrambleConfig) => {
        setScrambleConfig(newConfig);
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        const left = activeObj.left || 60;
        const top = activeObj.top || 60;

        const newObjects = generateWordScrambleObjectsFromConfig(newConfig);
        c.remove(activeObj);

        const newGroup = new fabric.Group(newObjects, { left, top, subTargetCheck: true });
        (newGroup as any).customType = "word-scramble";
        (newGroup as any).puzzleConfig = newConfig;

        c.add(newGroup);
        c.setActiveObject(newGroup);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const handleApplyMissingLettersConfig = (newConfig: MissingLettersConfig) => {
        setMissingLettersConfig(newConfig);
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        const left = activeObj.left || 60;
        const top = activeObj.top || 60;

        const newObjects = generateMissingLettersObjectsFromConfig(newConfig);
        c.remove(activeObj);

        const newGroup = new fabric.Group(newObjects, { left, top, subTargetCheck: true });
        (newGroup as any).customType = "missing-letters";
        (newGroup as any).puzzleConfig = newConfig;

        c.add(newGroup);
        c.setActiveObject(newGroup);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const handleApplySudokuConfig = (newConfig: SudokuConfig) => {
        setSudokuConfig(newConfig);
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        const left = activeObj.left || 60;
        const top = activeObj.top || 60;

        const newObjects = generateSudokuObjectsFromConfig(newConfig);
        c.remove(activeObj);

        const newGroup = new fabric.Group(newObjects, { left, top, subTargetCheck: true });
        (newGroup as any).customType = "sudoku";
        (newGroup as any).puzzleConfig = newConfig;

        c.add(newGroup);
        c.setActiveObject(newGroup);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const handleApplyCryptoConfig = (newConfig: CryptogramConfig) => {
        setCryptoConfig(newConfig);
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        const left = activeObj.left || 60;
        const top = activeObj.top || 60;

        const newObjects = generateCryptogramObjectsFromConfig(newConfig);
        c.remove(activeObj);

        const newGroup = new fabric.Group(newObjects, { left, top, subTargetCheck: true });
        (newGroup as any).customType = "cryptogram";
        (newGroup as any).puzzleConfig = newConfig;

        c.add(newGroup);
        c.setActiveObject(newGroup);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const handleApplyCrackCodeConfig = (newConfig: CrackTheCodeConfig) => {
        setCrackCodeConfig(newConfig);
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        const left = activeObj.left || 60;
        const top = activeObj.top || 60;

        const newObjects = generateCrackTheCodeObjectsFromConfig(newConfig);
        c.remove(activeObj);

        const newGroup = new fabric.Group(newObjects, { left, top, subTargetCheck: true });
        (newGroup as any).customType = "crack-the-code";
        (newGroup as any).puzzleConfig = newConfig;

        c.add(newGroup);
        c.setActiveObject(newGroup);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const handleApplyMissingVowelsConfig = (newConfig: MissingVowelsConfig) => {
        setMissingVowelsConfig(newConfig);
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        const left = activeObj.left || 60;
        const top = activeObj.top || 60;

        const newObjects = generateMissingVowelsObjectsFromConfig(newConfig);
        c.remove(activeObj);

        const newGroup = new fabric.Group(newObjects, { left, top, subTargetCheck: true });
        (newGroup as any).customType = "missing-vowels";
        (newGroup as any).puzzleConfig = newConfig;

        c.add(newGroup);
        c.setActiveObject(newGroup);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const handleApplyCodewordConfig = (newConfig: CodewordConfig) => {
        setCodewordConfig(newConfig);
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        const left = activeObj.left || 60;
        const top = activeObj.top || 60;

        const newObjects = generateCodewordObjectsFromConfig(newConfig);
        c.remove(activeObj);

        const newGroup = new fabric.Group(newObjects, { left, top, subTargetCheck: true });
        (newGroup as any).customType = "codeword";
        (newGroup as any).puzzleConfig = newConfig;

        c.add(newGroup);
        c.setActiveObject(newGroup);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    // Discovery Education Live Apply Handlers
    const handleApplyDoublePuzzleConfig = (newConfig: DoublePuzzleConfig) => {
        setDoublePuzzleConfig(newConfig);
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        const left = activeObj.left || 60;
        const top = activeObj.top || 60;

        const newObjects = generateDoublePuzzleObjectsFromConfig(newConfig);
        c.remove(activeObj);

        const newGroup = new fabric.Group(newObjects, { left, top, subTargetCheck: true });
        (newGroup as any).customType = "double-puzzle";
        (newGroup as any).puzzleConfig = newConfig;

        c.add(newGroup);
        c.setActiveObject(newGroup);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const handleApplyFallenPhraseConfig = (newConfig: FallenPhraseConfig) => {
        setFallenPhraseConfig(newConfig);
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        const left = activeObj.left || 60;
        const top = activeObj.top || 60;

        const newObjects = generateFallenPhraseObjectsFromConfig(newConfig);
        c.remove(activeObj);

        const newGroup = new fabric.Group(newObjects, { left, top, subTargetCheck: true });
        (newGroup as any).customType = "fallen-phrase";
        (newGroup as any).puzzleConfig = newConfig;

        c.add(newGroup);
        c.setActiveObject(newGroup);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const handleApplyLetterTilesConfig = (newConfig: LetterTilesConfig) => {
        setLetterTilesConfig(newConfig);
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        const left = activeObj.left || 60;
        const top = activeObj.top || 60;

        const newObjects = generateLetterTilesObjectsFromConfig(newConfig);
        c.remove(activeObj);

        const newGroup = new fabric.Group(newObjects, { left, top, subTargetCheck: true });
        (newGroup as any).customType = "letter-tiles";
        (newGroup as any).puzzleConfig = newConfig;

        c.add(newGroup);
        c.setActiveObject(newGroup);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const handleApplyMathSquaresConfig = (newConfig: MathSquaresConfig) => {
        setMathSquaresConfig(newConfig);
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        const left = activeObj.left || 60;
        const top = activeObj.top || 60;

        const newObjects = generateMathSquaresObjectsFromConfig(newConfig);
        c.remove(activeObj);

        const newGroup = new fabric.Group(newObjects, { left, top, subTargetCheck: true });
        (newGroup as any).customType = "math-squares";
        (newGroup as any).puzzleConfig = newConfig;

        c.add(newGroup);
        c.setActiveObject(newGroup);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const handleApplyNumberBlocksConfig = (newConfig: NumberBlocksConfig) => {
        setNumberBlocksConfig(newConfig);
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        const left = activeObj.left || 60;
        const top = activeObj.top || 60;

        const newObjects = generateNumberBlocksObjectsFromConfig(newConfig);
        c.remove(activeObj);

        const newGroup = new fabric.Group(newObjects, { left, top, subTargetCheck: true });
        (newGroup as any).customType = "number-blocks";
        (newGroup as any).puzzleConfig = newConfig;

        c.add(newGroup);
        c.setActiveObject(newGroup);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const handleApplyHiddenMessageConfig = (newConfig: HiddenMessageSearchConfig) => {
        setHiddenMessageConfig(newConfig);
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        const left = activeObj.left || 60;
        const top = activeObj.top || 60;

        const newObjects = generateHiddenMessageSearchFromConfig(newConfig);
        c.remove(activeObj);

        const newGroup = new fabric.Group(newObjects, { left, top, subTargetCheck: true });
        (newGroup as any).customType = "hidden-message-search";
        (newGroup as any).puzzleConfig = newConfig;

        c.add(newGroup);
        c.setActiveObject(newGroup);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const handleParseCrosswordWords = () => {
        const lines = crosswordWordsInputText.split("\n").filter((l) => l.trim().length > 0);
        const newWords = lines
            .map((line, idx) => {
                const parts = line.split(":");
                const word = parts[0].trim().toUpperCase().replace(/[^A-Z]/g, "");
                const clue = parts.slice(1).join(":").trim() || `Clue for ${word}`;
                return {
                    id: `cw-word-${idx}-${Date.now()}`,
                    word,
                    clue,
                    clueType: "definition" as ClueTypeMode,
                };
            })
            .filter((w) => w.word.length >= 2);

        if (newWords.length > 0) {
            updateCwConfig((prev) => ({
                ...prev,
                words: newWords,
            }));
        }
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

        if (activeObj.type === "activeSelection") {
            const selection = activeObj as fabric.ActiveSelection;
            const objects = [...selection.getObjects()];
            c.discardActiveObject();
            objects.forEach((obj) => {
                c.remove(obj);
            });
            c.requestRenderAll();
            c.fire("object:modified");
            setSelectedObject(null, null);
            toast.success(`Deleted ${objects.length} selected elements.`);
        } else {
            c.remove(activeObj);
            c.discardActiveObject();
            c.requestRenderAll();
            c.fire("object:modified");
            setSelectedObject(null, null);
            toast.success("Element deleted.");
        }
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

    const handleSplitPuzzleComponents = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        const customType = (activeObj as any).customType;
        const left = activeObj.left || 60;
        const top = activeObj.top || 60;

        if (customType === "word-search") {
            const { titleGroup, gridGroup, bankGroup } = generateWordSearchComponentGroups(wsConfig);
            c.remove(activeObj);

            if (titleGroup) {
                titleGroup.set({ left, top });
                (titleGroup as any).customType = "word-search";
                (titleGroup as any).puzzleComponent = "title";
                (titleGroup as any).wordSearchConfig = wsConfig;
                c.add(titleGroup);
            }

            if (gridGroup) {
                gridGroup.set({ left, top: top + 60 });
                (gridGroup as any).customType = "word-search";
                (gridGroup as any).puzzleComponent = "grid";
                (gridGroup as any).wordSearchConfig = wsConfig;
                c.add(gridGroup);
            }

            if (bankGroup) {
                bankGroup.set({ left, top: top + 380 });
                (bankGroup as any).customType = "word-search";
                (bankGroup as any).puzzleComponent = "word-bank";
                (bankGroup as any).wordSearchConfig = wsConfig;
                c.add(bankGroup);
            }

            c.requestRenderAll();
            c.fire("object:modified");
            toast.success("Word Search split into 3 independent moveable components!");
        } else if (customType === "crossword") {
            const { titleGroup, gridGroup, cluesGroup } = generateCrosswordComponentGroups(cwConfig);
            c.remove(activeObj);

            if (titleGroup) {
                titleGroup.set({ left, top });
                (titleGroup as any).customType = "crossword";
                (titleGroup as any).puzzleComponent = "title";
                (titleGroup as any).crosswordConfig = cwConfig;
                c.add(titleGroup);
            }

            if (gridGroup) {
                gridGroup.set({ left, top: top + 60 });
                (gridGroup as any).customType = "crossword";
                (gridGroup as any).puzzleComponent = "grid";
                (gridGroup as any).crosswordConfig = cwConfig;
                c.add(gridGroup);
            }

            if (cluesGroup) {
                cluesGroup.set({ left, top: top + 420 });
                (cluesGroup as any).customType = "crossword";
                (cluesGroup as any).puzzleComponent = "clues";
                (cluesGroup as any).crosswordConfig = cwConfig;
                c.add(cluesGroup);
            }

            c.requestRenderAll();
            c.fire("object:modified");
            toast.success("Crossword split into 3 independent moveable components!");
        }
    };

    const handleAlignHorizontally = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;
        c.centerObjectH(activeObj);
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Centered horizontally on canvas!");
    };

    const handleAlignVertically = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;
        c.centerObjectV(activeObj);
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Centered vertically on canvas!");
    };

    const handleAlignLeft = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;
        activeObj.set({ left: 40 });
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const handleAlignRight = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;
        const canvasW = c.width || 612;
        const objW = activeObj.getBoundingRect().width;
        activeObj.set({ left: canvasW - objW - 40 });
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const handleTidyUpPage = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;

        const objects = c.getObjects();
        const titleGroup = objects.find((o: any) => o.puzzleComponent === "title");
        const gridGroup = objects.find((o: any) => o.puzzleComponent === "grid");
        const bankGroup = objects.find((o: any) => o.puzzleComponent === "word-bank" || o.puzzleComponent === "clues");

        if (titleGroup) {
            c.centerObjectH(titleGroup);
            titleGroup.set({ top: 60 });
        }

        const gridTop = 150;
        if (gridGroup) {
            c.centerObjectH(gridGroup);
            gridGroup.set({ top: gridTop });
        }

        if (bankGroup) {
            const gridHeight = gridGroup ? (gridGroup.getBoundingRect().height || 320) : 320;
            const bankTop = gridTop + gridHeight + 35;
            c.centerObjectH(bankGroup);
            bankGroup.set({ top: bankTop });
        }

        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Page components aligned & neatly spaced!");
    };

    const handleRegeneratePuzzle = () => {
        const newSeed = Math.floor(Math.random() * 1000000) + 1;
        if (isWordSearchSelected) {
            updateWsConfig((prev) => ({
                ...prev,
                grid: {
                    ...prev.grid,
                    randomSeed: newSeed,
                },
            }));
            toast.success("Word Search puzzle & solution regenerated!");
        } else if (isCrosswordSelected) {
            updateCwConfig((prev) => ({
                ...prev,
                grid: {
                    ...prev.grid,
                    randomSeed: newSeed,
                },
            }));
            toast.success("Crossword puzzle & solution regenerated!");
        }
    };

    const handleToggleLock = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;
        const isLocked = !!activeObj.lockMovementX;
        activeObj.set({
            lockMovementX: !isLocked,
            lockMovementY: !isLocked,
            lockRotation: !isLocked,
            lockScalingX: !isLocked,
            lockScalingY: !isLocked,
        });
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success(isLocked ? "Element unlocked!" : "Element locked on canvas!");
    };

    const handleFlipX = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;
        activeObj.set("flipX", !activeObj.flipX);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const handleFlipY = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;
        activeObj.set("flipY", !activeObj.flipY);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const handleUngroup = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) {
            toast.error("Please select a group or puzzle to ungroup!");
            return;
        }

        if (activeObj.type === "group" || (activeObj as any)._objects) {
            const group = activeObj as any;
            if (typeof group.toActiveSelection === "function") {
                const sel = group.toActiveSelection();
                const count = sel ? sel.getObjects().length : 0;
                c.discardActiveObject();
                c.requestRenderAll();
                c.fire("object:modified");
                toast.success(`Ungrouped ${count} objects for individual editing!`);
            } else {
                const items = [...(group._objects || group.getObjects())];
                c.discardActiveObject();
                c.remove(group);
                items.forEach((item: any) => {
                    delete item.group;
                    item.group = undefined;
                    c.add(item);
                    item.set({ selectable: true, evented: true });
                    item.setCoords();
                });
                c.requestRenderAll();
                c.fire("object:modified");
                toast.success(`Ungrouped ${items.length} objects for individual editing!`);
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
    };

    if (!selectedObjectId || !selectedObjectProps) {
        return (
            <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col items-center justify-center text-slate-400 text-center select-none z-20">
                <Layers className="w-10 h-10 mb-2 opacity-40" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Object Inspector</span>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                    Select any element or puzzle on the canvas to open the property studio.
                </p>
            </aside>
        );
    }

    const wsStats = solveAndGenerateWordSearch(wsConfig);
    const cwStats = solveAndGenerateCrossword(cwConfig);

    return (
        <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-[calc(100vh-4rem)] z-20 shadow-lg overflow-hidden">
            {/* Inspector Top Bar */}
            <div className="h-11 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    {isCrosswordSelected
                        ? "Crossword Studio"
                        : isWordSearchSelected
                        ? "Word Search Studio"
                        : isDoublePuzzleSelected
                        ? "Double Puzzle Studio"
                        : isFallenPhraseSelected
                        ? "Fallen Phrase Studio"
                        : isLetterTilesSelected
                        ? "Letter Tiles Studio"
                        : isMathSquaresSelected
                        ? "Math Squares Studio"
                        : isNumberBlocksSelected
                        ? "Number Blocks Studio"
                        : isHiddenMessageSelected
                        ? "Hidden Message Studio"
                        : isFillInSelected
                        ? "Fill-in-Blanks Studio"
                        : isScrambleSelected
                        ? "Word Scramble Studio"
                        : isMissingLettersSelected
                        ? "Missing Letters Studio"
                        : isSudokuSelected
                        ? "Sudoku Studio"
                        : isCryptoSelected
                        ? "Cryptogram Studio"
                        : isCrackCodeSelected
                        ? "Crack Code Studio"
                        : `${selectedObjectType || "Object"} Inspector`}
                </span>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950" onClick={handleUngroup} title="Ungroup Objects for Individual Editing">
                        <Unlink className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={handleToggleLock} title="Lock / Unlock Element">
                        <Lock className="w-3.5 h-3.5" />
                    </Button>
                    {(isWordSearchSelected || isCrosswordSelected) && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                                onClick={handleRegeneratePuzzle}
                                title="Regenerate Puzzle & Solution Layout"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950" onClick={handleSplitPuzzleComponents} title="Separate Components into Movable Blocks">
                                <Unlink className="w-3.5 h-3.5" />
                            </Button>
                        </>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={handleDuplicate} title="Duplicate">
                        <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950" onClick={handleDelete} title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>

            {/* Alignment & Spacing Quick Bar */}
            <div className="px-3 py-1.5 border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/80 flex items-center justify-between gap-1 text-slate-600 dark:text-slate-400 shrink-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Align:</span>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
                        onClick={handleAlignHorizontally}
                        title="Center Horizontally on Canvas"
                    >
                        <AlignHorizontalJustifyCenter className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
                        onClick={handleAlignVertically}
                        title="Center Vertically on Canvas"
                    >
                        <AlignVerticalJustifyCenter className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
                        onClick={handleAlignLeft}
                        title="Align Left"
                    >
                        <AlignLeft className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
                        onClick={handleAlignRight}
                        title="Align Right"
                    >
                        <AlignRight className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-bold border border-indigo-200 dark:border-indigo-800"
                        onClick={handleTidyUpPage}
                        title="1-Click Auto Tidy & Space Components (Title top, Grid center, Word Bank bottom)"
                    >
                        <LayoutGrid className="w-3 h-3 mr-1" />
                        <span className="text-[10px]">Tidy Page</span>
                    </Button>
                </div>
            </div>

            {/* DISCOVERY EDUCATION & STANDARD PUZZLE STUDIOS */}
            {isDoublePuzzleSelected ? (
                /* --- DOUBLE PUZZLE STUDIO --- */
                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Puzzle Title</Label>
                        <Input
                            value={doublePuzzleConfig.title}
                            onChange={(e) => handleApplyDoublePuzzleConfig({ ...doublePuzzleConfig, title: e.target.value })}
                            className="h-8 text-xs font-semibold"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Final Secret Message</Label>
                        <Input
                            value={doublePuzzleConfig.finalQuote}
                            onChange={(e) => handleApplyDoublePuzzleConfig({ ...doublePuzzleConfig, finalQuote: e.target.value })}
                            className="h-8 text-xs font-mono font-bold uppercase tracking-wider"
                        />
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <Label className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Show Solution Letters</Label>
                        <Checkbox
                            checked={!!doublePuzzleConfig.showAnswerKey}
                            onCheckedChange={(v) => handleApplyDoublePuzzleConfig({ ...doublePuzzleConfig, showAnswerKey: !!v })}
                        />
                    </div>
                </div>
            ) : isFallenPhraseSelected ? (
                /* --- FALLEN PHRASE STUDIO --- */
                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Puzzle Title</Label>
                        <Input
                            value={fallenPhraseConfig.title}
                            onChange={(e) => handleApplyFallenPhraseConfig({ ...fallenPhraseConfig, title: e.target.value })}
                            className="h-8 text-xs font-semibold"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Quote / Secret Phrase</Label>
                        <Textarea
                            value={fallenPhraseConfig.phrase}
                            onChange={(e) => handleApplyFallenPhraseConfig({ ...fallenPhraseConfig, phrase: e.target.value })}
                            className="text-xs h-20 uppercase font-mono"
                        />
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <Label className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Show Solution Phrase</Label>
                        <Checkbox
                            checked={!!fallenPhraseConfig.showAnswerKey}
                            onCheckedChange={(v) => handleApplyFallenPhraseConfig({ ...fallenPhraseConfig, showAnswerKey: !!v })}
                        />
                    </div>
                </div>
            ) : isLetterTilesSelected ? (
                /* --- LETTER TILES STUDIO --- */
                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Puzzle Title</Label>
                        <Input
                            value={letterTilesConfig.title}
                            onChange={(e) => handleApplyLetterTilesConfig({ ...letterTilesConfig, title: e.target.value })}
                            className="h-8 text-xs font-semibold"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Secret Quote / Phrase</Label>
                        <Textarea
                            value={letterTilesConfig.phrase}
                            onChange={(e) => handleApplyLetterTilesConfig({ ...letterTilesConfig, phrase: e.target.value })}
                            className="text-xs h-20 uppercase font-mono"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold">Tile Chunk Size</Label>
                        <Select value={(letterTilesConfig.chunkSize || 3).toString()} onValueChange={(v) => handleApplyLetterTilesConfig({ ...letterTilesConfig, chunkSize: parseInt(v) as any })}>
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2">2 Letters per Tile</SelectItem>
                                <SelectItem value="3">3 Letters per Tile</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <Label className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Show Solution Answer</Label>
                        <Checkbox
                            checked={!!letterTilesConfig.showAnswerKey}
                            onCheckedChange={(v) => handleApplyLetterTilesConfig({ ...letterTilesConfig, showAnswerKey: !!v })}
                        />
                    </div>
                </div>
            ) : isMathSquaresSelected ? (
                /* --- MATH SQUARES STUDIO --- */
                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Puzzle Title</Label>
                        <Input
                            value={mathSquaresConfig.title}
                            onChange={(e) => handleApplyMathSquaresConfig({ ...mathSquaresConfig, title: e.target.value })}
                            className="h-8 text-xs font-semibold"
                        />
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <Label className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Show Solution Numbers</Label>
                        <Checkbox
                            checked={!!mathSquaresConfig.showAnswerKey}
                            onCheckedChange={(v) => handleApplyMathSquaresConfig({ ...mathSquaresConfig, showAnswerKey: !!v })}
                        />
                    </div>
                </div>
            ) : isNumberBlocksSelected ? (
                /* --- NUMBER BLOCKS STUDIO --- */
                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Puzzle Title</Label>
                        <Input
                            value={numberBlocksConfig.title}
                            onChange={(e) => handleApplyNumberBlocksConfig({ ...numberBlocksConfig, title: e.target.value })}
                            className="h-8 text-xs font-semibold"
                        />
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <Label className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Show Solution Numbers</Label>
                        <Checkbox
                            checked={!!numberBlocksConfig.showAnswerKey}
                            onCheckedChange={(v) => handleApplyNumberBlocksConfig({ ...numberBlocksConfig, showAnswerKey: !!v })}
                        />
                    </div>
                </div>
            ) : isHiddenMessageSelected ? (
                /* --- HIDDEN MESSAGE WORD SEARCH STUDIO --- */
                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Puzzle Title</Label>
                        <Input
                            value={hiddenMessageConfig.title}
                            onChange={(e) => handleApplyHiddenMessageConfig({ ...hiddenMessageConfig, title: e.target.value })}
                            className="h-8 text-xs font-semibold"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Hidden Secret Message</Label>
                        <Input
                            value={hiddenMessageConfig.hiddenMessage}
                            onChange={(e) => handleApplyHiddenMessageConfig({ ...hiddenMessageConfig, hiddenMessage: e.target.value })}
                            className="h-8 text-xs font-mono font-bold uppercase"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Words (Comma Separated)</Label>
                        <Textarea
                            value={hiddenMessageConfig.words.join(", ")}
                            onChange={(e) => {
                                const list = e.target.value.split(",").map((w) => w.trim()).filter((w) => w.length > 0);
                                handleApplyHiddenMessageConfig({ ...hiddenMessageConfig, words: list });
                            }}
                            className="text-xs h-20 font-mono uppercase"
                        />
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <Label className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Show Hidden Message Solution</Label>
                        <Checkbox
                            checked={!!hiddenMessageConfig.showAnswerKey}
                            onCheckedChange={(v) => handleApplyHiddenMessageConfig({ ...hiddenMessageConfig, showAnswerKey: !!v })}
                        />
                    </div>
                </div>
            ) : isMissingVowelsSelected ? (
                /* --- MISSING VOWELS STUDIO --- */
                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Puzzle Title</Label>
                        <Input
                            value={missingVowelsConfig.title}
                            onChange={(e) => handleApplyMissingVowelsConfig({ ...missingVowelsConfig, title: e.target.value })}
                            className="h-8 text-xs font-semibold"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Words (Comma Separated)</Label>
                        <Textarea
                            value={missingVowelsConfig.words.join(", ")}
                            onChange={(e) => {
                                const list = e.target.value.split(",").map((w) => w.trim()).filter((w) => w.length > 0);
                                handleApplyMissingVowelsConfig({ ...missingVowelsConfig, words: list });
                            }}
                            className="text-xs h-24 font-mono uppercase"
                        />
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <Label className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Show Vowels Solution</Label>
                        <Checkbox
                            checked={!!missingVowelsConfig.showAnswerKey}
                            onCheckedChange={(v) => handleApplyMissingVowelsConfig({ ...missingVowelsConfig, showAnswerKey: !!v })}
                        />
                    </div>
                </div>
            ) : isCodewordSelected ? (
                /* --- CODEWORD STUDIO --- */
                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Puzzle Title</Label>
                        <Input
                            value={codewordConfig.title}
                            onChange={(e) => handleApplyCodewordConfig({ ...codewordConfig, title: e.target.value })}
                            className="h-8 text-xs font-semibold"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Words (Comma Separated)</Label>
                        <Textarea
                            value={codewordConfig.words.join(", ")}
                            onChange={(e) => {
                                const list = e.target.value.split(",").map((w) => w.trim()).filter((w) => w.length > 0);
                                handleApplyCodewordConfig({ ...codewordConfig, words: list });
                            }}
                            className="text-xs h-24 font-mono uppercase"
                        />
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <Label className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Show Code Letters Solution</Label>
                        <Checkbox
                            checked={!!codewordConfig.showAnswerKey}
                            onCheckedChange={(v) => handleApplyCodewordConfig({ ...codewordConfig, showAnswerKey: !!v })}
                        />
                    </div>
                </div>
            ) : isCrosswordSelected ? (
                /* --- CROSSWORD STUDIO --- */
                <Tabs defaultValue="general" className="flex-1 flex flex-col min-h-0">
                    <TabsList className="grid grid-cols-5 h-8 bg-slate-100 dark:bg-slate-800 p-1 m-1.5 rounded-xl shrink-0">
                        <TabsTrigger value="general" className="text-[9px] font-bold p-0">General</TabsTrigger>
                        <TabsTrigger value="grid" className="text-[9px] font-bold p-0">Grid</TabsTrigger>
                        <TabsTrigger value="words" className="text-[9px] font-bold p-0">Words</TabsTrigger>
                        <TabsTrigger value="clues" className="text-[9px] font-bold p-0">Clues</TabsTrigger>
                        <TabsTrigger value="style" className="text-[9px] font-bold p-0">Style</TabsTrigger>
                    </TabsList>
                    <TabsList className="grid grid-cols-5 h-8 bg-slate-100 dark:bg-slate-800 p-1 mx-1.5 mb-1.5 rounded-xl shrink-0">
                        <TabsTrigger value="layout" className="text-[9px] font-bold p-0">Layout</TabsTrigger>
                        <TabsTrigger value="solution" className="text-[9px] font-bold p-0">Solution</TabsTrigger>
                        <TabsTrigger value="hints" className="text-[9px] font-bold p-0">Hints</TabsTrigger>
                        <TabsTrigger value="stats" className="text-[9px] font-bold p-0">Stats</TabsTrigger>
                        <TabsTrigger value="presets" className="text-[9px] font-bold p-0">Presets</TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-y-auto p-3 space-y-4">
                        <TabsContent value="general" className="m-0 space-y-3">
                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Puzzle Title</Label>
                                <Input
                                    value={cwConfig.title}
                                    onChange={(e) => updateCwConfig((p) => ({ ...p, title: e.target.value }))}
                                    className="h-8 text-xs font-semibold"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="words" className="m-0 space-y-3">
                            <div className="space-y-1.5 p-2 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800">
                                <Label className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 block">Bulk Import (ANSWER: CLUE)</Label>
                                <Textarea
                                    value={crosswordWordsInputText}
                                    onChange={(e) => setCrosswordWordsInputText(e.target.value)}
                                    placeholder="LION: King of the jungle&#10;TIGER: Large wild cat"
                                    className="text-xs h-20 bg-white dark:bg-slate-900 font-mono"
                                />
                                <Button size="sm" className="w-full h-7 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg" onClick={handleParseCrosswordWords}>
                                    <RefreshCw className="w-3 h-3 mr-1" /> Parse & Update Grid
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="solution" className="m-0 space-y-3">
                            <div className="flex items-center justify-between p-2.5 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
                                <Label className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Show Solution Letters</Label>
                                <Checkbox
                                    checked={cwConfig.answerKey.showSolution}
                                    onCheckedChange={(v) => updateCwConfig((p) => ({ ...p, answerKey: { ...p.answerKey, showSolution: !!v } }))}
                                />
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            ) : isFillInSelected ? (
                /* --- FILL IN THE BLANKS STUDIO --- */
                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Puzzle Title</Label>
                        <Input
                            value={fillInConfig.title}
                            onChange={(e) => handleApplyFillInConfig({ ...fillInConfig, title: e.target.value })}
                            className="h-8 text-xs font-semibold"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Sentence (Use ____ for blanks)</Label>
                        <Textarea
                            value={fillInConfig.sentence}
                            onChange={(e) => handleApplyFillInConfig({ ...fillInConfig, sentence: e.target.value })}
                            className="text-xs min-h-[70px]"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Word Bank (Comma Separated)</Label>
                        <Input
                            value={fillInConfig.wordBank.join(", ")}
                            onChange={(e) => {
                                const list = e.target.value.split(",").map((w) => w.trim()).filter((w) => w.length > 0);
                                handleApplyFillInConfig({ ...fillInConfig, wordBank: list });
                            }}
                            className="h-8 text-xs font-mono"
                        />
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <Label className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Show Solution Key</Label>
                        <Checkbox
                            checked={!!fillInConfig.showAnswerKey}
                            onCheckedChange={(v) => handleApplyFillInConfig({ ...fillInConfig, showAnswerKey: !!v })}
                        />
                    </div>
                </div>
            ) : isWordSearchSelected ? (
                /* --- WORD SEARCH STUDIO --- */
                <Tabs defaultValue="general" className="flex-1 flex flex-col min-h-0">
                    <TabsList className="grid grid-cols-4 h-9 bg-slate-100 dark:bg-slate-800 p-1 m-2 rounded-xl shrink-0">
                        <TabsTrigger value="general" className="text-[10px] font-bold">General</TabsTrigger>
                        <TabsTrigger value="words" className="text-[10px] font-bold">Words</TabsTrigger>
                        <TabsTrigger value="grid" className="text-[10px] font-bold">Grid</TabsTrigger>
                        <TabsTrigger value="style" className="text-[10px] font-bold">Style</TabsTrigger>
                    </TabsList>
                    <div className="flex-1 overflow-y-auto p-3 space-y-4">
                        
                        {/* 1. GENERAL TAB */}
                        <TabsContent value="general" className="m-0 space-y-3">
                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Puzzle Title</Label>
                                <Input
                                    value={wsConfig.title}
                                    onChange={(e) => updateWsConfig((p) => ({ ...p, title: e.target.value }))}
                                    className="h-8 text-xs font-semibold"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Instructions / Subtitle</Label>
                                <Input
                                    value={wsConfig.instructions || wsConfig.subtitle || ""}
                                    onChange={(e) => updateWsConfig((p) => ({ ...p, instructions: e.target.value, subtitle: e.target.value }))}
                                    className="h-8 text-xs"
                                    placeholder="Find all hidden words in the grid!"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Difficulty Level</Label>
                                <Select value={wsConfig.difficulty || "medium"} onValueChange={(v) => updateWsConfig((p) => ({ ...p, difficulty: v as any }))}>
                                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="easy">Easy (Horizontal & Vertical)</SelectItem>
                                        <SelectItem value="medium">Medium (Includes Diagonals)</SelectItem>
                                        <SelectItem value="hard">Hard (Includes Reverse)</SelectItem>
                                        <SelectItem value="pro">Pro (Full 8-Direction Matrix)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                size="sm"
                                className="w-full h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm"
                                onClick={handleRegeneratePuzzle}
                            >
                                <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Regenerate Puzzle & Solution
                            </Button>

                            <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                                <Label className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Show Solution Key</Label>
                                <Checkbox
                                    checked={!!wsConfig.answerKey.showSolution}
                                    onCheckedChange={(v) => updateWsConfig((p) => ({ ...p, answerKey: { ...p.answerKey, showSolution: !!v } }))}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Highlight Solution Color</Label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={wsConfig.answerKey.color || "#bbf7d0"}
                                        onChange={(e) => updateWsConfig((p) => ({ ...p, answerKey: { ...p.answerKey, color: e.target.value } }))}
                                        className="w-10 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                                    />
                                    <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">{wsConfig.answerKey.color || "#bbf7d0"}</span>
                                </div>
                            </div>
                        </TabsContent>

                        {/* 2. WORDS TAB */}
                        <TabsContent value="words" className="m-0 space-y-3">
                            <div className="space-y-1.5 p-2 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300">Word List (Comma Separated)</Label>
                                    <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">{wsConfig.words.length} Words</span>
                                </div>
                                <Textarea
                                    value={wordsInputText}
                                    onChange={(e) => {
                                        setWordsInputText(e.target.value);
                                        const list = e.target.value.split(",").map((w) => w.trim()).filter((w) => w.length > 0);
                                        updateWsConfig((p) => ({
                                            ...p,
                                            words: list.map((w, i) => ({ id: `w-${i}-${Date.now()}`, word: w.toUpperCase(), displayText: w })),
                                        }));
                                    }}
                                    className="text-xs h-28 bg-white dark:bg-slate-900 font-mono uppercase"
                                    placeholder="LION, TIGER, ELEPHANT, GIRAFFE..."
                                />
                            </div>

                            <div className="space-y-2 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Word Direction Options</Label>
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-600 dark:text-slate-400">Horizontal (Left to Right)</span>
                                        <Checkbox checked={wsConfig.grid.directions.includes("H" as any)} onCheckedChange={(v) => {
                                            const dirs = new Set(wsConfig.grid.directions);
                                            if (v) dirs.add("H" as any); else dirs.delete("H" as any);
                                            updateWsConfig((p) => ({ ...p, grid: { ...p.grid, directions: Array.from(dirs) } }));
                                        }} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-600 dark:text-slate-400">Vertical (Top to Bottom)</span>
                                        <Checkbox checked={wsConfig.grid.directions.includes("V" as any)} onCheckedChange={(v) => {
                                            const dirs = new Set(wsConfig.grid.directions);
                                            if (v) dirs.add("V" as any); else dirs.delete("V" as any);
                                            updateWsConfig((p) => ({ ...p, grid: { ...p.grid, directions: Array.from(dirs) } }));
                                        }} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-600 dark:text-slate-400">Diagonal (Top-Left to Bottom-Right)</span>
                                        <Checkbox checked={wsConfig.grid.directions.includes("D" as any)} onCheckedChange={(v) => {
                                            const dirs = new Set(wsConfig.grid.directions);
                                            if (v) dirs.add("D" as any); else dirs.delete("D" as any);
                                            updateWsConfig((p) => ({ ...p, grid: { ...p.grid, directions: Array.from(dirs) } }));
                                        }} />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* 3. GRID TAB */}
                        <TabsContent value="grid" className="m-0 space-y-3">
                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Grid Dimensions</Label>
                                <Select
                                    value={wsConfig.grid.rows.toString()}
                                    onValueChange={(v) => {
                                        const sz = parseInt(v);
                                        updateWsConfig((p) => ({ ...p, grid: { ...p.grid, rows: sz, cols: sz } }));
                                    }}
                                >
                                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="8">8 × 8 Grid (Small / Kids)</SelectItem>
                                        <SelectItem value="10">10 × 10 Grid (Standard)</SelectItem>
                                        <SelectItem value="12">12 × 12 Grid (Medium)</SelectItem>
                                        <SelectItem value="15">15 × 15 Grid (Large)</SelectItem>
                                        <SelectItem value="20">20 × 20 Grid (Pro Challenge)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Cell Box Style</Label>
                                <Select
                                    value={wsConfig.grid.cellStyle || "clean"}
                                    onValueChange={(v) => updateWsConfig((p) => ({ ...p, grid: { ...p.grid, cellStyle: v as any } }))}
                                >
                                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="clean">Clean / Borderless</SelectItem>
                                        <SelectItem value="boxed">Square Box Grid</SelectItem>
                                        <SelectItem value="rounded">Soft Rounded Boxes</SelectItem>
                                        <SelectItem value="circle">Circular Cell Bubbles</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Cell Size ({wsConfig.grid.cellSize || 30}px)</Label>
                                <input
                                    type="range"
                                    min="20"
                                    max="48"
                                    value={wsConfig.grid.cellSize || 30}
                                    onChange={(e) => {
                                        const sz = parseInt(e.target.value);
                                        updateWsConfig((p) => ({ ...p, grid: { ...p.grid, cellSize: sz } }));
                                    }}
                                    className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer"
                                />
                            </div>
                        </TabsContent>

                        {/* 4. STYLE TAB */}
                        <TabsContent value="style" className="m-0 space-y-3">
                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Title Font Family</Label>
                                <Select
                                    value={wsConfig.appearance.titleFont || "Inter"}
                                    onValueChange={(v) => updateWsConfig((p) => ({ ...p, appearance: { ...p.appearance, titleFont: v } }))}
                                >
                                     <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                     <SelectContent>
                                        <SelectItem value="Inter">Inter (Clean Modern)</SelectItem>
                                        <SelectItem value="K-12 Handwriting">K-12 Handwriting</SelectItem>
                                        <SelectItem value="Courier New">Courier New (Typewriter)</SelectItem>
                                        <SelectItem value="Comic Sans MS">Comic Sans (Playful)</SelectItem>
                                        <SelectItem value="Georgia">Georgia (Classic Serif)</SelectItem>
                                        {customFonts.map((f) => (
                                            <SelectItem key={f.id} value={f.fontFamily}>
                                                ✨ {f.fontFamily} (Custom)
                                            </SelectItem>
                                        ))}
                                     </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Title & Header Color</Label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={wsConfig.appearance.titleColor || "#0f172a"}
                                        onChange={(e) => updateWsConfig((p) => ({ ...p, appearance: { ...p.appearance, titleColor: e.target.value } }))}
                                        className="w-10 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                                    />
                                    <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">{wsConfig.appearance.titleColor || "#0f172a"}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Grid Letter Text Color</Label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={wsConfig.appearance.gridLetterColor || "#0f172a"}
                                        onChange={(e) => updateWsConfig((p) => ({ ...p, appearance: { ...p.appearance, gridLetterColor: e.target.value } }))}
                                        className="w-10 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                                    />
                                    <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">{wsConfig.appearance.gridLetterColor || "#0f172a"}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Cell Background Color</Label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={wsConfig.appearance.cellBgColor !== "transparent" ? wsConfig.appearance.cellBgColor : "#ffffff"}
                                        onChange={(e) => updateWsConfig((p) => ({ ...p, appearance: { ...p.appearance, cellBgColor: e.target.value } }))}
                                        className="w-10 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                                    />
                                    <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">{wsConfig.appearance.cellBgColor || "#ffffff"}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Grid Line Border Color</Label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={wsConfig.appearance.gridBorderColor !== "transparent" ? wsConfig.appearance.gridBorderColor : "#cbd5e1"}
                                        onChange={(e) => updateWsConfig((p) => ({ ...p, appearance: { ...p.appearance, gridBorderColor: e.target.value } }))}
                                        className="w-10 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                                    />
                                    <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">{wsConfig.appearance.gridBorderColor || "#cbd5e1"}</span>
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            ) : (
                /* --- STANDARD ELEMENT PROPERTIES --- */
                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                    {/* Font Family Selector for Text Objects */}
                    {selectedObjectProps && (selectedObjectType === "i-text" || selectedObjectType === "text") && (
                        <div className="space-y-1 p-2 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                            <Label className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300">Font Family</Label>
                            <Select
                                value={selectedObjectProps.fontFamily || "Inter"}
                                onValueChange={(v) => {
                                    const c = fabricCanvasRef.current;
                                    if (!c) return;
                                    const activeObj = c.getActiveObject();
                                    if (activeObj) {
                                        activeObj.set({ fontFamily: v });
                                        c.requestRenderAll();
                                        c.fire("object:modified");
                                    }
                                }}
                            >
                                <SelectTrigger className="h-8 text-xs bg-white dark:bg-slate-900"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Inter">Inter</SelectItem>
                                    <SelectItem value="K-12 Handwriting">K-12 Handwriting</SelectItem>
                                    <SelectItem value="Courier New">Courier New</SelectItem>
                                    <SelectItem value="Comic Sans MS">Comic Sans</SelectItem>
                                    <SelectItem value="Georgia">Georgia</SelectItem>
                                    <SelectItem value="Arial">Arial</SelectItem>
                                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                    {customFonts.map((f) => (
                                        <SelectItem key={f.id} value={f.fontFamily}>
                                            ✨ {f.fontFamily} (Custom)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Color & Fill</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <span className="text-[10px] text-slate-500 font-semibold block mb-1">Fill Color</span>
                                <input
                                    type="color"
                                    value={typeof selectedObjectProps?.fill === "string" ? selectedObjectProps.fill : "#0f172a"}
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
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};
