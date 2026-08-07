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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
    Copy, Trash2, ArrowUp, ArrowDown, Grid3X3, Sparkles, RefreshCw, Layers,
    Palette, Type, FileText, CheckCircle2, ShieldAlert, BarChart3, Wand2, Settings2, HelpCircle,
    Plus, Lock, Unlock, Eye, BookOpen, LayoutGrid, Award, Sliders, Unlink, Split, Link2,
    AlignHorizontalJustifyCenter, AlignVerticalJustifyCenter, AlignLeft, AlignRight,
    FlipHorizontal, FlipVertical, RotateCw, Maximize2, Route, Scissors
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
    SnakePathMazeConfig,
    createDefaultSnakePathMazeConfig,
    generateSnakePathMazeObjectsFromConfig,
    PRE_DRAWN_PATH_TEMPLATES_100,
    PathTemplateMeta,
    PRE_DRAWN_SINGLE_PATH_SEGMENTS_100,
    SinglePathSegmentMeta,
    createSingleSnakePathFromSegment,
    handleUngroupFabricGroup,
    handleGroupFabricObjects,
    fuseSnakePathSegments,
    mergeAndLockEraserMasks,
    clearAllEraserMasks,
    generateBoardGameObjectsFromConfig,
    generatePrintableDiceGroup,
    generatePrintableSpinnerGroup,
    generatePrintableCardsGroup,
    generatePrintableTokensGroup,
} from "@/lib/worksheet-fabric";
import {
    BoardGameConfig,
    BOARD_GAME_THEMES,
    BoardThemeId,
    BoardLayoutType,
    createDefaultBoardGameConfig,
} from "@/lib/board-game-engine";
import { SnakePathGalleryModal } from "@/components/worksheet/SnakePathGalleryModal";
import { WorksheetBoardGameDrawer } from "@/components/worksheet/WorksheetBoardGameDrawer";

interface WorksheetPropertyPanelProps {
    fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
}

export const WorksheetPropertyPanel: React.FC<WorksheetPropertyPanelProps> = ({ fabricCanvasRef }) => {
    const { selectedObjectId, selectedObjectType, selectedObjectProps, setSelectedObject, currentPageIndex, customFonts, activeTool, setActiveTool, eraserSize, eraserShape, eraserMode, setEraserProps } = useWorksheetStore();

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
    const [dashGap, setDashGap] = useState<number>(8);

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

    const [snakeMazeConfig, setSnakeMazeConfig] = useState<SnakePathMazeConfig>(createDefaultSnakePathMazeConfig());
    const [isSnakeMazeSelected, setIsSnakeMazeSelected] = useState(false);

    const [boardGameConfig, setBoardGameConfig] = useState<BoardGameConfig>(createDefaultBoardGameConfig());
    const [isBoardGameSelected, setIsBoardGameSelected] = useState(false);

    const handleApplyBoardGameConfig = (newConfig: BoardGameConfig) => {
        setBoardGameConfig(newConfig);
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        let targetObj: any = activeObj;
        while (targetObj && !targetObj.customType) {
            if (targetObj.group) targetObj = targetObj.group;
            else break;
        }

        const left = targetObj ? targetObj.left || 60 : 60;
        const top = targetObj ? targetObj.top || 60 : 60;

        const newGroup = generateBoardGameObjectsFromConfig(newConfig);
        newGroup.set({ left, top });

        c.remove(targetObj || activeObj);
        c.add(newGroup);
        c.setActiveObject(newGroup);
        c.requestRenderAll();
        c.fire("object:modified");
    };
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
    const [isBoardGameDrawerOpen, setIsBoardGameDrawerOpen] = useState(false);
    const [multiSnakePathCount, setMultiSnakePathCount] = useState(0);
    const updateActiveObjectProperty = (props: Record<string, any>) => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject() as any;
        if (!activeObj) return;

        activeObj.set(props);
        if (activeObj.type === "group" && typeof activeObj.getObjects === "function") {
            activeObj.getObjects().forEach((child: any) => {
                if ("text" in props && (child.type === "i-text" || child.type === "text")) {
                    child.set({ text: props.text });
                    if (typeof child.initDimensions === "function") child.initDimensions();
                }
                if ("fontFamily" in props && (child.type === "i-text" || child.type === "text")) {
                    child.set({ fontFamily: props.fontFamily });
                    if (typeof child.initDimensions === "function") child.initDimensions();
                }
                if ("fontSize" in props && (child.type === "i-text" || child.type === "text")) {
                    child.set({ fontSize: props.fontSize });
                    if (typeof child.initDimensions === "function") child.initDimensions();
                }
                if ("lineHeight" in props && (child.type === "i-text" || child.type === "text")) {
                    child.set({ lineHeight: props.lineHeight });
                    if (typeof child.initDimensions === "function") child.initDimensions();
                }
                if ("textAlign" in props && (child.type === "i-text" || child.type === "text")) {
                    child.set({ textAlign: props.textAlign });
                }
                if ("stroke" in props && (child.stroke || child.type === "path" || child.type === "line")) {
                    child.set({ stroke: props.stroke });
                }
                if ("fill" in props && child.fill && child.fill !== "none" && child.fill !== "transparent") {
                    child.set({ fill: props.fill });
                }
                if ("strokeWidth" in props && typeof child.strokeWidth === "number") {
                    child.set({ strokeWidth: props.strokeWidth });
                }
                if ("strokeDashArray" in props) {
                    child.set({ strokeDashArray: props.strokeDashArray });
                }
            });
            if (typeof activeObj.addWithUpdate === "function") {
                activeObj.addWithUpdate();
            }
        }

        if (activeObj.type === "i-text" || activeObj.type === "text") {
            if (typeof activeObj.initDimensions === "function") {
                activeObj.initDimensions();
            }
            activeObj.setCoords();
        }

        c.requestRenderAll();
        c.fire("object:modified");

        const storeProps = useWorksheetStore.getState().selectedObjectProps || {};
        useWorksheetStore.getState().setSelectedObject(
            activeObj.id || "obj-" + Date.now(),
            activeObj.type || "object",
            {
                ...storeProps,
                ...props,
            }
        );
    };

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
        setIsSnakeMazeSelected(false);
        setIsBoardGameSelected(false);

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
        } else if (customType === "snake-path-maze") {
            setIsSnakeMazeSelected(true);
            const cfg: SnakePathMazeConfig = targetObj.puzzleConfig || createDefaultSnakePathMazeConfig();
            setSnakeMazeConfig(cfg);
        } else if (customType === "board-game") {
            setIsBoardGameSelected(true);
            const cfg: BoardGameConfig = targetObj.puzzleConfig || createDefaultBoardGameConfig();
            setBoardGameConfig(cfg);
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

        // Track multi-select snake paths for Fuse button
        const updateMultiSnake = () => {
            const active = c.getActiveObject();
            if (active && (active as any).type === "activeSelection") {
                const objs = (active as any).getObjects ? (active as any).getObjects() : [];
                const snakeCount = objs.filter((o: any) => o.customType === "snake-path" || o.customType === "snake-corridor-path").length;
                setMultiSnakePathCount(snakeCount);
            } else {
                setMultiSnakePathCount(0);
            }
        };
        c.on("selection:created", updateMultiSnake);
        c.on("selection:updated", updateMultiSnake);
        c.on("selection:cleared", updateMultiSnake);

        updateSelectionStateRef.current();

        return () => {
            c.off("selection:created", handleSelection);
            c.off("selection:updated", handleSelection);
            c.off("selection:cleared", handleSelection);
            c.off("selection:created", updateMultiSnake);
            c.off("selection:updated", updateMultiSnake);
            c.off("selection:cleared", updateMultiSnake);
        };
    }, [fabricCanvasRef, currentPageIndex, selectedObjectId]);

    const handleFuseSnakePaths = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObjs = c.getActiveObjects ? c.getActiveObjects() : [];
        if (activeObjs.length < 2) {
            toast.error("Select 2 or more path segments to fuse.");
            return;
        }
        const result = fuseSnakePathSegments(activeObjs, c);
        if (!result) {
            toast.error("Could not fuse selected elements. Ensure 2+ path segments are selected.");
        } else {
            toast.success("Path segments fused into a single continuous path!");
            setMultiSnakePathCount(0);
        }
    };

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
                const scaleX = oldObj.scaleX ?? 1;
                const scaleY = oldObj.scaleY ?? 1;
                const angle = oldObj.angle ?? 0;
                const comp = oldObj.puzzleComponent;

                if (comp === "title" && newTitle) {
                    c.remove(oldObj);
                    newTitle.set({ left, top, scaleX, scaleY, angle });
                    attachPuzzleMetadata(newTitle, "word-search", "title", newConfig);
                    c.add(newTitle);
                    if (activeComp === "title") activeToSelect = newTitle;
                } else if (comp === "grid" && newGrid) {
                    c.remove(oldObj);
                    newGrid.set({ left, top, scaleX, scaleY, angle });
                    attachPuzzleMetadata(newGrid, "word-search", "grid", newConfig);
                    c.add(newGrid);
                    if (activeComp === "grid") activeToSelect = newGrid;
                } else if (comp === "word-bank" && newBank) {
                    c.remove(oldObj);
                    newBank.set({ left, top, scaleX, scaleY, angle });
                    attachPuzzleMetadata(newBank, "word-search", "word-bank", newConfig);
                    c.add(newBank);
                    if (activeComp === "word-bank") activeToSelect = newBank;
                } else if (!comp) {
                    const newObjects = generateAdvancedWordSearchObjects(newConfig);
                    c.remove(oldObj);
                    const newGroup = new fabric.Group(newObjects, { left, top, scaleX, scaleY, angle, subTargetCheck: true });
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

    const handleApplySnakeMazeConfig = (newConfig: SnakePathMazeConfig) => {
        setSnakeMazeConfig(newConfig);
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        let targetObj: any = activeObj;
        while (targetObj && !targetObj.customType) {
            if (targetObj.group) targetObj = targetObj.group;
            else break;
        }

        const left = targetObj ? targetObj.left || 60 : 60;
        const top = targetObj ? targetObj.top || 60 : 60;

        const newGroup = generateSnakePathMazeObjectsFromConfig(newConfig);
        newGroup.set({ left, top });

        c.remove(targetObj || activeObj);
        c.add(newGroup);
        c.setActiveObject(newGroup);
        c.requestRenderAll();
        c.fire("object:modified");
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

    const handleAlignTop = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        if (activeObj.type === "activeSelection" || (activeObj as any)._objects) {
            const group = activeObj as fabric.Group;
            const objects = group.getObjects();
            if (objects.length > 0) {
                const minY = Math.min(...objects.map((o) => o.top || 0));
                objects.forEach((o) => o.set({ top: minY }));
                group.setCoords();
            }
        } else {
            activeObj.set({ top: 40 });
        }
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Aligned Top!");
    };

    const handleAlignMiddle = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        if (activeObj.type === "activeSelection" || (activeObj as any)._objects) {
            // Shift the ENTIRE GROUP together so combined bounding box is vertically centered on canvas
            // This preserves relative positions between objects (title stays above grid, grid above bank)
            const group = activeObj as fabric.Group;
            const objects = group.getObjects();
            const canvasH = c.height || 1056;
            c.discardActiveObject();

            // Compute combined bounding box in canvas coordinates
            let minTop = Infinity, maxBottom = -Infinity;
            objects.forEach((o) => {
                const br = o.getBoundingRect();
                minTop = Math.min(minTop, br.top);
                maxBottom = Math.max(maxBottom, br.top + br.height);
            });
            const combinedH = maxBottom - minTop;
            const targetTop = (canvasH - combinedH) / 2;
            const offset = targetTop - minTop;

            objects.forEach((o) => {
                o.set({ top: (o.top || 0) + offset });
                o.setCoords();
            });

            const sel = new fabric.ActiveSelection(objects, { canvas: c });
            c.setActiveObject(sel);
        } else {
            c.centerObjectV(activeObj);
        }
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Centered vertically on canvas!");
    };

    const handleAlignBottom = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        if (activeObj.type === "activeSelection" || (activeObj as any)._objects) {
            const group = activeObj as fabric.Group;
            const objects = group.getObjects();
            if (objects.length > 0) {
                const maxY = Math.max(...objects.map((o) => (o.top || 0) + (o.height || 0) * (o.scaleY || 1)));
                objects.forEach((o) => o.set({ top: maxY - (o.height || 0) * (o.scaleY || 1) }));
                group.setCoords();
            }
        } else {
            const canvasH = c.height || 792;
            const objH = activeObj.getBoundingRect().height;
            activeObj.set({ top: canvasH - objH - 40 });
        }
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Aligned Bottom!");
    };

    const handleAlignLeft = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        if (activeObj.type === "activeSelection" || (activeObj as any)._objects) {
            const group = activeObj as fabric.Group;
            const objects = group.getObjects();
            if (objects.length > 0) {
                const minX = Math.min(...objects.map((o) => o.left || 0));
                objects.forEach((o) => o.set({ left: minX }));
                group.setCoords();
            }
        } else {
            activeObj.set({ left: 40 });
        }
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Aligned Left!");
    };

    const handleAlignCenter = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        if (activeObj.type === "activeSelection" || (activeObj as any)._objects) {
            // Shift the ENTIRE GROUP together so combined bounding box is horizontally centered on canvas
            // This preserves relative positions between objects (left/right offsets maintained)
            const group = activeObj as fabric.Group;
            const objects = group.getObjects();
            const canvasW = c.width || 1275;
            c.discardActiveObject();

            // Compute combined bounding box in canvas coordinates
            let minLeft = Infinity, maxRight = -Infinity;
            objects.forEach((o) => {
                const br = o.getBoundingRect();
                minLeft = Math.min(minLeft, br.left);
                maxRight = Math.max(maxRight, br.left + br.width);
            });
            const combinedW = maxRight - minLeft;
            const targetLeft = (canvasW - combinedW) / 2;
            const offset = targetLeft - minLeft;

            objects.forEach((o) => {
                o.set({ left: (o.left || 0) + offset });
                o.setCoords();
            });

            const sel = new fabric.ActiveSelection(objects, { canvas: c });
            c.setActiveObject(sel);
        } else {
            c.centerObjectH(activeObj);
        }
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Centered horizontally on canvas!");
    };

    const handleAlignRight = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        if (activeObj.type === "activeSelection" || (activeObj as any)._objects) {
            const group = activeObj as fabric.Group;
            const objects = group.getObjects();
            if (objects.length > 0) {
                const maxX = Math.max(...objects.map((o) => (o.left || 0) + (o.width || 0) * (o.scaleX || 1)));
                objects.forEach((o) => o.set({ left: maxX - (o.width || 0) * (o.scaleX || 1) }));
                group.setCoords();
            }
        } else {
            const canvasW = c.width || 612;
            const objW = activeObj.getBoundingRect().width;
            activeObj.set({ left: canvasW - objW - 40 });
        }
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Aligned Right!");
    };

    const handleDistributeHorizontally = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        let objectsToSpace: fabric.FabricObject[] = [];
        if (activeObj.type === "activeSelection" || (activeObj as any)._objects) {
            objectsToSpace = (activeObj as fabric.Group).getObjects();
        } else {
            objectsToSpace = c.getObjects();
        }

        if (objectsToSpace.length < 3) {
            toast.info("Select at least 3 elements to space evenly horizontally!");
            return;
        }

        const sorted = [...objectsToSpace].sort((a, b) => (a.left || 0) - (b.left || 0));
        const first = sorted[0];
        const last = sorted[sorted.length - 1];

        const minLeft = first.left || 0;
        const maxLeft = last.left || 0;
        const totalSpan = maxLeft - minLeft;
        const step = totalSpan / (sorted.length - 1);

        sorted.forEach((obj, idx) => {
            obj.set({ left: minLeft + idx * step });
        });

        if (activeObj.type === "activeSelection") {
            (activeObj as fabric.Group).setCoords();
        }
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Spaced evenly horizontally!");
    };

    const handleDistributeVertically = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const activeObj = c.getActiveObject();
        if (!activeObj) return;

        let objectsToSpace: fabric.FabricObject[] = [];
        if (activeObj.type === "activeSelection" || (activeObj as any)._objects) {
            objectsToSpace = (activeObj as fabric.Group).getObjects();
        } else {
            objectsToSpace = c.getObjects();
        }

        if (objectsToSpace.length < 3) {
            toast.info("Select at least 3 elements to space evenly vertically!");
            return;
        }

        const sorted = [...objectsToSpace].sort((a, b) => (a.top || 0) - (b.top || 0));
        const first = sorted[0];
        const last = sorted[sorted.length - 1];

        const minTop = first.top || 0;
        const maxTop = last.top || 0;
        const totalSpan = maxTop - minTop;
        const step = totalSpan / (sorted.length - 1);

        sorted.forEach((obj, idx) => {
            obj.set({ top: minTop + idx * step });
        });

        if (activeObj.type === "activeSelection") {
            (activeObj as fabric.Group).setCoords();
        }
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Spaced evenly vertically!");
    };

    const handleTidyUpPage = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;

        const canvasW = c.width || 1275;
        const allObjs = c.getObjects();
        const titleGroup = allObjs.find((o: any) => o.puzzleComponent === "title");
        const gridGroup = allObjs.find((o: any) => o.puzzleComponent === "grid");
        const bankGroup = allObjs.find((o: any) => o.puzzleComponent === "word-bank" || o.puzzleComponent === "clues");

        const centerH = (obj: fabric.FabricObject) => {
            const br = obj.getBoundingRect();
            // Use explicit calculation: center based on rendered bounding rect width
            const newLeft = (canvasW - br.width) / 2;
            // Adjust: obj.left vs br.left offset (accounts for rotation, origin, scale)
            const leftOffset = (obj.left || 0) - br.left;
            obj.set({ left: newLeft + leftOffset });
            obj.setCoords();
        };

        const foundComponents = titleGroup || gridGroup || bankGroup;

        if (foundComponents) {
            if (titleGroup) {
                centerH(titleGroup);
                titleGroup.set({ top: 60 });
                titleGroup.setCoords();
            }

            const gridTop = 150;
            if (gridGroup) {
                centerH(gridGroup);
                gridGroup.set({ top: gridTop });
                gridGroup.setCoords();
            }

            if (bankGroup) {
                const gridBr = gridGroup ? gridGroup.getBoundingRect() : null;
                const gridHeight = gridBr ? gridBr.height : 320;
                const bankTop = gridTop + gridHeight + 35;
                centerH(bankGroup);
                bankGroup.set({ top: bankTop });
                bankGroup.setCoords();
            }
        } else {
            // Fallback: center whatever is selected on the canvas
            const activeObj = c.getActiveObject();
            if (activeObj) {
                c.centerObjectH(activeObj);
                c.centerObjectV(activeObj);
                activeObj.setCoords();
            }
        }

        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Page components tidied & centered!");
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

    const handleGroup = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const count = handleGroupFabricObjects(c);
        if (count > 0) {
            toast.success(`Grouped ${count} overlapping elements together!`);
        } else {
            toast.info("Tip: Hold Shift + click multiple items, drag a box over them, or stack text/images on top of your background tile to group!");
        }
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
    };

    if (selectedObjectType === "activeSelection") {
        return (
            <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-[calc(100vh-4rem)] z-20 shadow-lg overflow-hidden">
                <div className="h-11 px-4 border-b border-indigo-200 dark:border-indigo-800 flex items-center justify-between bg-indigo-50/80 dark:bg-indigo-950/40 shrink-0">
                    <span className="font-extrabold text-xs uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-500" />
                        Group Inspector
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded-full border border-indigo-400/30">
                        Multi-Selection
                    </span>
                </div>

                <div className="p-3 flex flex-col gap-3 overflow-y-auto flex-1">
                    <Accordion type="multiple" defaultValue={["group-ops", "align-ops"]} className="w-full space-y-2">
                        {/* 1. GROUP & UNGROUP OPERATIONS ACCORDION */}
                        <AccordionItem value="group-ops" className="border border-indigo-200 dark:border-indigo-800 rounded-xl px-3 bg-indigo-50/40 dark:bg-indigo-950/20">
                            <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                                <div className="flex items-center gap-2">
                                    <Link2 className="w-4 h-4 text-indigo-500" />
                                    <span>Group & Combine Tools</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-3 pt-1 pb-3">
                                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 flex flex-col gap-2">
                                    <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">Group Selected Objects</p>
                                    <p className="text-[10px] text-slate-500">Combine all highlighted elements into a single movable, resizable group.</p>
                                    <Button
                                        className="w-full h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-1.5"
                                        onClick={handleGroup}
                                    >
                                        <Link2 className="w-3.5 h-3.5" />
                                        Group Selected Elements
                                    </Button>
                                </div>

                                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 flex flex-col gap-2">
                                    <p className="text-xs font-bold text-amber-900 dark:text-amber-200">Deselect / Separate</p>
                                    <p className="text-[10px] text-slate-500">Release multi-selection back to single element editing mode.</p>
                                    <Button
                                        variant="outline"
                                        className="w-full h-8 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5"
                                        onClick={handleUngroup}
                                    >
                                        <Unlink className="w-3.5 h-3.5" />
                                        Separate Selection
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 2. MULTI-OBJECT ALIGNMENT & SPACING ACCORDION */}
                        <AccordionItem value="align-ops" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/50 dark:bg-slate-900/40">
                            <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                <div className="flex items-center gap-2">
                                    <LayoutGrid className="w-4 h-4 text-indigo-500" />
                                    <span>Alignment & Even Spacing</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-2 pt-1 pb-3">
                                <div className="grid grid-cols-3 gap-1.5">
                                    <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold" onClick={handleAlignTop}>Align Top</Button>
                                    <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold" onClick={handleAlignMiddle}>Align Middle</Button>
                                    <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold" onClick={handleAlignBottom}>Align Bottom</Button>
                                    <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold" onClick={handleAlignLeft}>Align Left</Button>
                                    <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold" onClick={handleAlignCenter}>Align Center</Button>
                                    <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold" onClick={handleAlignRight}>Align Right</Button>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5 pt-1">
                                    <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300" onClick={handleDistributeHorizontally}>Space Horizontally</Button>
                                    <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300" onClick={handleDistributeVertically}>Space Vertically</Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </aside>
        );
    }

    if (!selectedObjectId || !selectedObjectProps) {

        // When 2+ snake-path segments are multi-selected, show the Fuse panel
        if (multiSnakePathCount >= 2) {
            return (
                <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-[calc(100vh-4rem)] z-20 shadow-lg overflow-hidden">
                    {/* Fuse Panel Header */}
                    <div className="h-11 px-4 border-b border-amber-200 dark:border-amber-800 flex items-center justify-between bg-amber-50/80 dark:bg-amber-950/40 shrink-0">
                        <span className="font-extrabold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                            <Link2 className="w-3.5 h-3.5" />
                            Path Fuse Studio
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-300 rounded-full border border-amber-400/30">
                            {multiSnakePathCount} selected
                        </span>
                    </div>

                    {/* Fuse Action */}
                    <div className="p-5 flex flex-col gap-4">
                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-amber-500/20 rounded-lg">
                                    <Link2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-amber-800 dark:text-amber-200">Fuse {multiSnakePathCount} Path Segments</p>
                                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">Detects segment endpoints and chains them into one continuous path.</p>
                                </div>
                            </div>
                            <Button
                                className="w-full h-9 bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm rounded-xl shadow-sm"
                                onClick={handleFuseSnakePaths}
                            >
                                <Link2 className="w-4 h-4 mr-2" />
                                Fuse into Single Path
                            </Button>
                        </div>

                        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                            After fusing, the result is a single selectable path tube. You can Shift+click to select multiple snake-path segments on the canvas.
                        </p>
                    </div>
                </aside>
            );
        }

        if (activeTool === "eraser") {
            return (
                <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-[calc(100vh-4rem)] z-20 shadow-lg overflow-hidden select-none">
                    {/* Header */}
                    <div className="h-11 px-4 border-b border-rose-200 dark:border-rose-900/50 flex items-center justify-between bg-rose-50/80 dark:bg-rose-950/40 shrink-0">
                        <span className="font-extrabold text-xs uppercase tracking-wider text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                            <Scissors className="w-3.5 h-3.5 text-rose-500" />
                            Eraser Studio
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-500/20 text-rose-700 dark:text-rose-300 rounded-full border border-rose-400/30 capitalize">
                            {eraserMode} mode
                        </span>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                        {/* Erasing Mode Options */}
                        <div className="space-y-2 p-3 bg-rose-50/60 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800/60">
                            <Label className="text-xs font-bold text-rose-800 dark:text-rose-200">Select Erasing Mode</Label>
                            <div className="grid grid-cols-1 gap-1.5">
                                {[
                                    { id: "brush", label: "🧹 Precision Brush Eraser", desc: "Drag freehand to erase lines, corridor tubes, or image areas" },
                                    { id: "box", label: "⬛ Box / Area Erase", desc: "Drag a box to erase an entire rectangular zone" },
                                    { id: "cutter", label: "✂️ Segment Cutter", desc: "Draw a cut line across paths to split segments" },
                                    { id: "stroke", label: "🎯 Stroke Selector Erase", desc: "Click any line or stroke to delete just that segment" },
                                ].map((mode) => (
                                    <Button
                                        key={mode.id}
                                        size="sm"
                                        variant={eraserMode === mode.id ? "default" : "outline"}
                                        className={`h-auto py-2 px-2.5 justify-start text-left rounded-xl transition-all ${eraserMode === mode.id ? "bg-rose-600 text-white shadow-sm" : "bg-white dark:bg-slate-900 border-slate-200 text-slate-700 dark:text-slate-200"}`}
                                        onClick={() => setEraserProps({ mode: mode.id as any })}
                                    >
                                        <div>
                                            <p className="text-xs font-bold">{mode.label}</p>
                                            <p className="text-[10px] opacity-85 mt-0.5">{mode.desc}</p>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Tip Size Controls */}
                        <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">Eraser Tip Size</Label>
                                <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">{eraserSize}px</span>
                            </div>
                            <div className="grid grid-cols-4 gap-1.5">
                                {[8, 16, 32, 64].map((sz) => (
                                    <Button
                                        key={sz}
                                        size="sm"
                                        variant={eraserSize === sz ? "default" : "outline"}
                                        className={`h-7 text-xs font-bold ${eraserSize === sz ? "bg-rose-600 text-white" : "bg-white dark:bg-slate-900"}`}
                                        onClick={() => setEraserProps({ size: sz })}
                                    >
                                        {sz}px
                                    </Button>
                                ))}
                            </div>
                            <Slider
                                value={[eraserSize]}
                                min={4}
                                max={100}
                                step={1}
                                onValueChange={([val]) => setEraserProps({ size: val })}
                            />
                        </div>

                        {/* Tip Shape */}
                        <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                            <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">Eraser Tip Shape</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    size="sm"
                                    variant={eraserShape === "round" ? "default" : "outline"}
                                    className={`h-8 text-xs font-bold ${eraserShape === "round" ? "bg-rose-600 text-white" : "bg-white dark:bg-slate-900"}`}
                                    onClick={() => setEraserProps({ shape: "round" })}
                                >
                                    ● Round Tip
                                </Button>
                                <Button
                                    size="sm"
                                    variant={eraserShape === "square" ? "default" : "outline"}
                                    className={`h-8 text-xs font-bold ${eraserShape === "square" ? "bg-rose-600 text-white" : "bg-white dark:bg-slate-900"}`}
                                    onClick={() => setEraserProps({ shape: "square" })}
                                >
                                    ■ Square Tip
                                </Button>
                            </div>
                        </div>

                        {/* Merge & Lock Erased Cutouts Action */}
                        <div className="space-y-2 p-3 bg-amber-50/80 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
                            <Label className="text-xs font-extrabold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
                                <Link2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Permanently Fuse Erased Cutouts
                            </Label>
                            <p className="text-[10px] text-amber-700 dark:text-amber-300 leading-relaxed">
                                Combines white erased cutouts with underlying lines/shapes into a single locked object so erased gaps stay bound when moved or scaled.
                            </p>
                            <Button
                                size="sm"
                                className="w-full h-8 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shadow-sm"
                                onClick={() => {
                                    if (!fabricCanvasRef.current) return;
                                    const count = mergeAndLockEraserMasks(fabricCanvasRef.current);
                                    if (count > 0) {
                                        toast.success(`Merged ${count} erased cutout areas into a single locked object!`);
                                    } else {
                                        toast.info("No active eraser cutouts found on canvas to merge.");
                                    }
                                }}
                            >
                                <Link2 className="w-3.5 h-3.5 mr-1" /> Merge & Lock Erased Gaps
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="w-full h-7 text-[10px] font-bold border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300"
                                onClick={() => {
                                    if (!fabricCanvasRef.current) return;
                                    const count = clearAllEraserMasks(fabricCanvasRef.current);
                                    if (count > 0) {
                                        toast.success(`Cleared ${count} eraser cutouts and restored original lines.`);
                                    } else {
                                        toast.info("No eraser cutouts on canvas.");
                                    }
                                }}
                            >
                                <Trash2 className="w-3 h-3 mr-1" /> Restore Original Lines (Clear Eraser)
                            </Button>
                        </div>

                        {/* Quick Action: Finish Erasing */}
                        <Button
                            size="sm"
                            className="w-full h-9 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-sm"
                            onClick={() => setActiveTool("select")}
                        >
                            Finish Erasing (Select Mode)
                        </Button>
                    </div>
                </aside>
            );
        }

        return (
            <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col items-center justify-center text-slate-400 text-center select-none z-20">
                <Layers className="w-10 h-10 mb-2 opacity-40" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Object Inspector</span>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                    Select any element or puzzle on the canvas to open the property studio.
                </p>
                <p className="text-[10px] text-slate-400/60 mt-3 max-w-[200px]">
                    💡 Shift+click multiple snake path segments, then use the <strong>Fuse</strong> button to merge them.
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
                        : isBoardGameSelected
                        ? "Board Game Studio"
                        : `${selectedObjectType || "Object"} Inspector`}
                </span>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950" onClick={handleGroup} title="Group Selected Elements Together">
                        <Link2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950" onClick={handleUngroup} title="Ungroup Objects for Individual Editing">
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
            <div className="px-3 py-1.5 border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/80 flex items-center justify-between gap-1 text-slate-600 dark:text-slate-400 shrink-0 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Align & Space:</span>
                <div className="flex items-center gap-0.5 flex-wrap">
                    {/* Vertical Alignment */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                        onClick={handleAlignTop}
                        title="Align Tops"
                    >
                        <ArrowUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400"
                        onClick={handleAlignMiddle}
                        title="Align Middles (Vertical Center)"
                    >
                        <AlignVerticalJustifyCenter className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                        onClick={handleAlignBottom}
                        title="Align Bottoms"
                    >
                        <ArrowDown className="w-3.5 h-3.5" />
                    </Button>

                    <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-0.5" />

                    {/* Horizontal Alignment */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                        onClick={handleAlignLeft}
                        title="Align Lefts"
                    >
                        <AlignLeft className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400"
                        onClick={handleAlignCenter}
                        title="Align Centers (Horizontal)"
                    >
                        <AlignHorizontalJustifyCenter className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                        onClick={handleAlignRight}
                        title="Align Rights"
                    >
                        <AlignRight className="w-3.5 h-3.5" />
                    </Button>

                    <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-0.5" />

                    {/* Even Spacing / Distribution */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-emerald-600 dark:text-emerald-400"
                        onClick={handleDistributeHorizontally}
                        title="Space Evenly Horizontally"
                    >
                        <FlipHorizontal className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-emerald-600 dark:text-emerald-400"
                        onClick={handleDistributeVertically}
                        title="Space Evenly Vertically"
                    >
                        <FlipVertical className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-1.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-bold border border-indigo-200 dark:border-indigo-800 ml-0.5"
                        onClick={handleTidyUpPage}
                        title="1-Click Auto Tidy & Space Components (Title top, Grid center, Word Bank bottom)"
                    >
                        <LayoutGrid className="w-3 h-3 mr-0.5" />
                        <span className="text-[9px]">Tidy</span>
                    </Button>
                </div>
            </div>

            {/* Manual Transform Entry Fields (Width, Height, Angle, X, Y) */}
            {(() => {
                const c = fabricCanvasRef.current;
                if (!c) return null;
                const activeObj = c.getActiveObject();
                if (!activeObj) return null;

                const curWidth = Math.round((activeObj.width || 0) * (activeObj.scaleX || 1));
                const curHeight = Math.round((activeObj.height || 0) * (activeObj.scaleY || 1));
                const curAngle = Math.round(activeObj.angle || 0);
                const curLeft = Math.round(activeObj.left || 0);
                const curTop = Math.round(activeObj.top || 0);

                return (
                    <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 space-y-1.5 shrink-0">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Position & Size:</span>
                            <span className="text-[9px] font-mono text-slate-500 font-bold uppercase">{activeObj.type || "Object"}</span>
                        </div>
                        <div className="grid grid-cols-5 gap-1">
                            <div className="space-y-0.5">
                                <span className="text-[9px] font-bold text-slate-500 block text-center">W (px)</span>
                                <Input
                                    type="number"
                                    value={curWidth}
                                    onChange={(e) => {
                                        const newW = parseFloat(e.target.value);
                                        if (isNaN(newW) || newW <= 0) return;
                                        const origW = activeObj.width || 1;
                                        activeObj.set({ scaleX: newW / origW });
                                        activeObj.setCoords();
                                        c.requestRenderAll();
                                        c.fire("object:modified");
                                    }}
                                    className="h-6 px-1 text-[10px] font-mono text-center font-bold"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[9px] font-bold text-slate-500 block text-center">H (px)</span>
                                <Input
                                    type="number"
                                    value={curHeight}
                                    onChange={(e) => {
                                        const newH = parseFloat(e.target.value);
                                        if (isNaN(newH) || newH <= 0) return;
                                        const origH = activeObj.height || 1;
                                        activeObj.set({ scaleY: newH / origH });
                                        activeObj.setCoords();
                                        c.requestRenderAll();
                                        c.fire("object:modified");
                                    }}
                                    className="h-6 px-1 text-[10px] font-mono text-center font-bold"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 block text-center">Rotate (°)</span>
                                <Input
                                    type="number"
                                    value={curAngle}
                                    onChange={(e) => {
                                        const newA = parseFloat(e.target.value);
                                        if (isNaN(newA)) return;
                                        activeObj.set({ angle: (newA % 360 + 360) % 360 });
                                        activeObj.setCoords();
                                        c.requestRenderAll();
                                        c.fire("object:modified");
                                    }}
                                    className="h-6 px-1 text-[10px] font-mono text-center font-bold border-indigo-300 dark:border-indigo-700"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[9px] font-bold text-slate-500 block text-center">X (px)</span>
                                <Input
                                    type="number"
                                    value={curLeft}
                                    onChange={(e) => {
                                        const newX = parseFloat(e.target.value);
                                        if (isNaN(newX)) return;
                                        activeObj.set({ left: newX });
                                        activeObj.setCoords();
                                        c.requestRenderAll();
                                        c.fire("object:modified");
                                    }}
                                    className="h-6 px-1 text-[10px] font-mono text-center"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[9px] font-bold text-slate-500 block text-center">Y (px)</span>
                                <Input
                                    type="number"
                                    value={curTop}
                                    onChange={(e) => {
                                        const newY = parseFloat(e.target.value);
                                        if (isNaN(newY)) return;
                                        activeObj.set({ top: newY });
                                        activeObj.setCoords();
                                        c.requestRenderAll();
                                        c.fire("object:modified");
                                    }}
                                    className="h-6 px-1 text-[10px] font-mono text-center"
                                />
                            </div>
                        </div>
                    </div>
                );
            })()}

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
            ) : isSnakeMazeSelected ? (
                /* --- SNAKE PATH ACTIVITY MAZE STUDIO --- */
                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                        <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 rounded-lg">
                            <Route className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Snake Path Maze Studio</h4>
                            <p className="text-[10px] text-slate-500">Procedural path curves, custom item packs & answer keys</p>
                        </div>
                    </div>

                    {/* 100 Pre-Drawn Path Template Gallery Button */}
                    <Button
                        size="sm"
                        className="w-full h-9 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-sm"
                        onClick={() => setIsGalleryModalOpen(true)}
                    >
                        <BookOpen className="w-4 h-4 mr-1.5" /> 100 Pre-Drawn Path Template Gallery
                    </Button>

                    {/* Pre-Drawn Path Template Dropdown Selector (#1 to #100) */}
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300">Pick Pre-Drawn Path (#1 to #100)</Label>
                        <Select
                            value={String(snakeMazeConfig.selectedTemplateId || "")}
                            onValueChange={(val) => {
                                const templateId = parseInt(val);
                                const tmpl = PRE_DRAWN_PATH_TEMPLATES_100.find((t) => t.id === templateId);
                                if (tmpl) {
                                    handleApplySnakeMazeConfig({
                                        ...snakeMazeConfig,
                                        selectedTemplateId: templateId,
                                        pairCount: tmpl.pairCount,
                                        pathVariation: tmpl.variation,
                                        randomSeed: tmpl.seed,
                                        targetMapping: tmpl.mapping,
                                    });
                                }
                            }}
                        >
                            <SelectTrigger className="h-8 text-xs font-semibold">
                                <SelectValue placeholder="Select Pre-Drawn Template..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                                {PRE_DRAWN_PATH_TEMPLATES_100.map((tmpl) => (
                                    <SelectItem key={tmpl.id} value={String(tmpl.id)} className="text-xs">
                                        #{tmpl.id}: {tmpl.name.split(":")[1] || tmpl.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Quick Shuffle Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs font-bold border-indigo-200 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50"
                            onClick={() => handleApplySnakeMazeConfig({
                                ...snakeMazeConfig,
                                randomSeed: Math.floor(Math.random() * 90000) + 100
                            })}
                        >
                            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Shuffle Paths
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs font-bold border-purple-200 text-purple-700 dark:text-purple-300 hover:bg-purple-50"
                            onClick={() => {
                                const p = snakeMazeConfig.pairCount || 4;
                                const shuffled = Array.from({ length: p }, (_, i) => i).sort(() => Math.random() - 0.5);
                                handleApplySnakeMazeConfig({
                                    ...snakeMazeConfig,
                                    targetMapping: shuffled,
                                    randomSeed: Math.floor(Math.random() * 90000) + 100
                                });
                            }}
                        >
                            <Wand2 className="w-3.5 h-3.5 mr-1" /> Shuffle Targets
                        </Button>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Activity Title</Label>
                        <Input
                            value={snakeMazeConfig.title}
                            onChange={(e) => handleApplySnakeMazeConfig({ ...snakeMazeConfig, title: e.target.value })}
                            className="h-8 text-xs font-semibold"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Instructions Header</Label>
                        <Input
                            value={snakeMazeConfig.instructions}
                            onChange={(e) => handleApplySnakeMazeConfig({ ...snakeMazeConfig, instructions: e.target.value })}
                            className="h-8 text-xs"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="space-y-1">
                            <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Theme Preset (10 Packs)</Label>
                            <Select
                                value={snakeMazeConfig.theme}
                                onValueChange={(val: any) => handleApplySnakeMazeConfig({ ...snakeMazeConfig, theme: val })}
                            >
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="animals">🐍 Animals & Food</SelectItem>
                                    <SelectItem value="abc">🔤 ABC Upper/Lower</SelectItem>
                                    <SelectItem value="numbers">🔢 Numbers & Count</SelectItem>
                                    <SelectItem value="colors">🎨 Colors & Objects</SelectItem>
                                    <SelectItem value="fairytale">🏰 Fairytale Magic</SelectItem>
                                    <SelectItem value="space">🚀 Space & Planets</SelectItem>
                                    <SelectItem value="ocean">🐬 Ocean & Shells</SelectItem>
                                    <SelectItem value="vehicles">🚗 Vehicles & Roads</SelectItem>
                                    <SelectItem value="math">➕ Math Addition</SelectItem>
                                    <SelectItem value="custom">✏️ Custom Items</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Path Style Curve</Label>
                            <Select
                                value={snakeMazeConfig.pathVariation || "standard"}
                                onValueChange={(val: any) => handleApplySnakeMazeConfig({ ...snakeMazeConfig, pathVariation: val })}
                            >
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="standard">Smooth Curves</SelectItem>
                                    <SelectItem value="dense_cross">Dense Criss-Cross</SelectItem>
                                    <SelectItem value="zigzag_angles">Zigzag Angles</SelectItem>
                                    <SelectItem value="wavy_s">Wavy S-Curves</SelectItem>
                                    <SelectItem value="random_seed">Seeded Random</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Custom Text Lists */}
                    <div className="space-y-2 pt-1 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                        <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Edit Items / Emojis to Find</Label>
                        <div className="space-y-1">
                            <Label className="text-[10px] text-slate-500 font-bold uppercase">Top Entrance Items (Comma Separated)</Label>
                            <Input
                                value={snakeMazeConfig.customTopText || ""}
                                onChange={(e) => handleApplySnakeMazeConfig({ ...snakeMazeConfig, theme: "custom", customTopText: e.target.value })}
                                placeholder="🐍, 🐶, 🐱, 🐻"
                                className="h-7 text-xs font-mono"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] text-slate-500 font-bold uppercase">Bottom Target Items (Comma Separated)</Label>
                            <Input
                                value={snakeMazeConfig.customBottomText || ""}
                                onChange={(e) => handleApplySnakeMazeConfig({ ...snakeMazeConfig, theme: "custom", customBottomText: e.target.value })}
                                placeholder="🍎, 🍖, 🐟, 🍯"
                                className="h-7 text-xs font-mono"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Pair Count (2 to 6)</Label>
                            <Select
                                value={String(snakeMazeConfig.pairCount)}
                                onValueChange={(val) => handleApplySnakeMazeConfig({ ...snakeMazeConfig, pairCount: parseInt(val) })}
                            >
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2">2 Pairs (Easy)</SelectItem>
                                    <SelectItem value="3">3 Pairs (Medium)</SelectItem>
                                    <SelectItem value="4">4 Pairs (Standard)</SelectItem>
                                    <SelectItem value="5">5 Pairs (Advanced)</SelectItem>
                                    <SelectItem value="6">6 Pairs (Expert)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Icon Size Slider */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Icon / Text Size</Label>
                                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                    {snakeMazeConfig.iconSize || 36}px
                                </span>
                            </div>
                            <Slider
                                value={[snakeMazeConfig.iconSize || 36]}
                                min={24}
                                max={60}
                                step={2}
                                onValueChange={([val]) => handleApplySnakeMazeConfig({ ...snakeMazeConfig, iconSize: val })}
                            />
                        </div>
                    </div>

                    {/* Corridor Width Slider */}
                    <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">Corridor Tube Width</Label>
                            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                {snakeMazeConfig.corridorWidth}px
                            </span>
                        </div>
                        <Slider
                            value={[snakeMazeConfig.corridorWidth]}
                            min={12}
                            max={40}
                            step={2}
                            onValueChange={([val]) => handleApplySnakeMazeConfig({ ...snakeMazeConfig, corridorWidth: val })}
                        />
                    </div>

                    {/* Show Entrance Badges Toggle */}
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div>
                            <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Entrance Badges (①, ②, ③)</Label>
                            <p className="text-[10px] text-slate-500">Number markers above path entrances</p>
                        </div>
                        <Checkbox
                            checked={!!snakeMazeConfig.showBadges}
                            onCheckedChange={(v) => handleApplySnakeMazeConfig({ ...snakeMazeConfig, showBadges: !!v })}
                        />
                    </div>

                    {/* Show Solution Answer Key Toggle */}
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <div>
                            <Label className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">Auto Solution Answer Key</Label>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Show colored solution traces</p>
                        </div>
                        <Checkbox
                            checked={!!snakeMazeConfig.showSolution}
                            onCheckedChange={(v) => handleApplySnakeMazeConfig({ ...snakeMazeConfig, showSolution: !!v })}
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
                                <Select value={wsConfig.difficulty || "medium"} onValueChange={(v) => {
                                    const directionSets: Record<string, string[]> = {
                                        easy: ["H", "V"],
                                        medium: ["H", "V", "D_TL_BR", "D_TR_BL"],
                                        hard: ["H", "HR", "V", "VR", "D_TL_BR", "D_TR_BL"],
                                        pro: ["H", "HR", "V", "VR", "D_TL_BR", "D_TR_BL", "D_BL_TR", "D_BR_TL"],
                                    };
                                    updateWsConfig((p) => ({
                                        ...p,
                                        difficulty: v as any,
                                        grid: { ...p.grid, directions: (directionSets[v] || directionSets.medium) as any },
                                    }));
                                }}>
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
                                    {([
                                        { key: "H", label: "→ Horizontal (Left to Right)" },
                                        { key: "HR", label: "← Horizontal Reverse (Right to Left)" },
                                        { key: "V", label: "↓ Vertical (Top to Bottom)" },
                                        { key: "VR", label: "↑ Vertical Reverse (Bottom to Top)" },
                                        { key: "D_TL_BR", label: "↘ Diagonal (Top-Left → Bottom-Right)" },
                                        { key: "D_TR_BL", label: "↙ Diagonal (Top-Right → Bottom-Left)" },
                                        { key: "D_BL_TR", label: "↗ Diagonal (Bottom-Left → Top-Right)" },
                                        { key: "D_BR_TL", label: "↖ Diagonal (Bottom-Right → Top-Left)" },
                                    ] as { key: string; label: string }[]).map(({ key, label }) => (
                                        <div key={key} className="flex items-center justify-between">
                                            <span className="text-xs text-slate-600 dark:text-slate-400">{label}</span>
                                            <Checkbox checked={wsConfig.grid.directions.includes(key as any)} onCheckedChange={(v) => {
                                                const dirs = new Set(wsConfig.grid.directions);
                                                if (v) dirs.add(key as any); else dirs.delete(key as any);
                                                updateWsConfig((p) => ({ ...p, grid: { ...p.grid, directions: Array.from(dirs) } }));
                                            }} />
                                        </div>
                                    ))}
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
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            ) : isBoardGameSelected ? (
                /* --- BOARD GAME STUDIO INSPECTOR TABS --- */
                <Tabs defaultValue="board" className="w-full flex-1 flex flex-col min-h-0">
                    <TabsList className="grid grid-cols-3 h-10 m-3 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 shrink-0">
                        <TabsTrigger value="board" className="text-xs font-bold rounded-lg">Board Track</TabsTrigger>
                        <TabsTrigger value="theme" className="text-xs font-bold rounded-lg">Theme & Style</TabsTrigger>
                        <TabsTrigger value="accessories" className="text-xs font-bold rounded-lg">Accessories</TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-y-auto px-4 pb-6 min-h-0">
                        {/* TAB 1: BOARD TRACK & LAYOUT */}
                        <TabsContent value="board" className="space-y-4 m-0">
                            {/* Drawer Open Trigger Button */}
                            <Button
                                className="w-full h-9 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
                                onClick={() => setIsBoardGameDrawerOpen(true)}
                            >
                                <LayoutGrid className="w-4 h-4" />
                                Component & Template Drawer
                            </Button>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">Board Title</Label>
                                <Input
                                    value={boardGameConfig.title}
                                    onChange={(e) => handleApplyBoardGameConfig({ ...boardGameConfig, title: e.target.value })}
                                    className="h-8 text-xs font-bold bg-slate-50 dark:bg-slate-800"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">Subtitle / Instructions</Label>
                                <Input
                                    value={boardGameConfig.subtitle || ""}
                                    onChange={(e) => handleApplyBoardGameConfig({ ...boardGameConfig, subtitle: e.target.value })}
                                    className="h-8 text-xs bg-slate-50 dark:bg-slate-800"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">Board Track Shape</Label>
                                <Select
                                    value={boardGameConfig.layout}
                                    onValueChange={(val: BoardLayoutType) => handleApplyBoardGameConfig({ ...boardGameConfig, layout: val })}
                                >
                                    <SelectTrigger className="h-8 text-xs bg-slate-50 dark:bg-slate-800 capitalize font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="snake">🐍 Snake Winding Grid</SelectItem>
                                        <SelectItem value="spiral">🌀 Inward Spiral Track</SelectItem>
                                        <SelectItem value="circle">⭕ Perimeter Circle Ring</SelectItem>
                                        <SelectItem value="race-track">🏎️ Speedway Oval Circuit</SelectItem>
                                        <SelectItem value="treasure-map">🏴‍☠️ S-Winding Treasure Trail</SelectItem>
                                        <SelectItem value="figure-eight">♾️ Figure-Eight Dual Loop</SelectItem>
                                        <SelectItem value="hexagon-grid">⬡ Honeycomb Hexagon Grid</SelectItem>
                                        <SelectItem value="linear">➖ Linear Straight Track</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1 pt-1">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">Total Game Spaces</Label>
                                    <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">{boardGameConfig.totalSpaces} spaces</span>
                                </div>
                                <Slider
                                    value={[boardGameConfig.totalSpaces]}
                                    min={10}
                                    max={50}
                                    step={1}
                                    onValueChange={([val]) => handleApplyBoardGameConfig({ ...boardGameConfig, totalSpaces: val })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">Cell Space Shape</Label>
                                <div className="grid grid-cols-4 gap-1">
                                    {[
                                        { id: "rounded", label: "Rounded" },
                                        { id: "circle", label: "Circle" },
                                        { id: "square", label: "Square" },
                                        { id: "diamond", label: "Diamond" },
                                    ].map((s) => (
                                        <Button
                                            key={s.id}
                                            size="sm"
                                            variant={boardGameConfig.cellShape === s.id ? "default" : "outline"}
                                            className={`h-7 text-[10px] font-bold ${boardGameConfig.cellShape === s.id ? "bg-amber-600 text-white" : ""}`}
                                            onClick={() => handleApplyBoardGameConfig({ ...boardGameConfig, cellShape: s.id as any })}
                                        >
                                            {s.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        {/* TAB 2: THEME & STYLES */}
                        <TabsContent value="theme" className="space-y-3 m-0">
                            <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">Preset Theme Palette</Label>
                            <div className="grid grid-cols-1 gap-2">
                                {Object.values(BOARD_GAME_THEMES).map((t) => (
                                    <button
                                        key={t.id}
                                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${boardGameConfig.theme === t.id ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40 ring-2 ring-amber-400" : "border-slate-200 dark:border-slate-800 hover:bg-slate-50"}`}
                                        onClick={() => handleApplyBoardGameConfig({ ...boardGameConfig, theme: t.id })}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{t.icon}</span>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.name}</p>
                                                <p className="text-[10px] text-slate-500">Custom theme colors & badges</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {t.normalColors.slice(0, 3).map((c, i) => (
                                                <span key={i} className="w-3.5 h-3.5 rounded-full border border-slate-300" style={{ backgroundColor: c }} />
                                            ))}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </TabsContent>

                        {/* TAB 3: PRINTABLE ACCESSORIES */}
                        <TabsContent value="accessories" className="space-y-3 m-0">
                            <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Insert Companion Accessories</Label>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                Add printable foldout dice, pie spinners, question card sheets, and player token stands directly onto your worksheet page!
                            </p>
                            <div className="grid grid-cols-1 gap-2 pt-1">
                                <Button size="sm" variant="outline" className="h-9 font-bold text-xs justify-start border-amber-300 bg-amber-50/50 hover:bg-amber-100 text-amber-900 dark:text-amber-200" onClick={() => { const c = fabricCanvasRef.current; if (c) { const d = generatePrintableDiceGroup(); c.add(d); c.setActiveObject(d); c.requestRenderAll(); } }}>
                                    🎲 Insert Printable Foldout D6 Die
                                </Button>
                                <Button size="sm" variant="outline" className="h-9 font-bold text-xs justify-start border-amber-300 bg-amber-50/50 hover:bg-amber-100 text-amber-900 dark:text-amber-200" onClick={() => { const c = fabricCanvasRef.current; if (c) { const s = generatePrintableSpinnerGroup(); c.add(s); c.setActiveObject(s); c.requestRenderAll(); } }}>
                                    🎯 Insert Printable Pie Spinner
                                </Button>
                                <Button size="sm" variant="outline" className="h-9 font-bold text-xs justify-start border-amber-300 bg-amber-50/50 hover:bg-amber-100 text-amber-900 dark:text-amber-200" onClick={() => { const c = fabricCanvasRef.current; if (c) { const cd = generatePrintableCardsGroup(); c.add(cd); c.setActiveObject(cd); c.requestRenderAll(); } }}>
                                    🃏 Insert Printable Game Task Cards
                                </Button>
                                <Button size="sm" variant="outline" className="h-9 font-bold text-xs justify-start border-amber-300 bg-amber-50/50 hover:bg-amber-100 text-amber-900 dark:text-amber-200" onClick={() => { const c = fabricCanvasRef.current; if (c) { const tk = generatePrintableTokensGroup(); c.add(tk); c.setActiveObject(tk); c.requestRenderAll(); } }}>
                                    👑 Insert Player Tokens
                                </Button>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            ) : (
                /* --- STANDARD & DRAWING ELEMENT PROPERTIES --- */
                <div className="p-3 flex-1 overflow-y-auto">
                    <Accordion type="multiple" defaultValue={["text-style", "color-style", "line-style", "transform-style", "layer-style"]} className="w-full space-y-2">
                        {/* ACCORDION 1: MULTI-LINE TEXT & TYPOGRAPHY */}
                        {selectedObjectProps && (selectedObjectType === "i-text" || selectedObjectType === "text" || typeof selectedObjectProps.text === "string") && (
                            <AccordionItem value="text-style" className="border border-indigo-200 dark:border-indigo-800 rounded-xl px-3 bg-indigo-50/40 dark:bg-indigo-950/20">
                                <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                                    <div className="flex items-center gap-2">
                                        <Type className="w-4 h-4 text-indigo-500" />
                                        <span>Multi-Line Text & Typography</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-3 pt-1 pb-3">
                                    {/* Inline Multi-Line Text Editor */}
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">Text Content (Multi-Line)</Label>
                                        <Textarea
                                            value={selectedObjectProps.text || ""}
                                            onChange={(e) => updateActiveObjectProperty({ text: e.target.value })}
                                            className="text-xs font-sans h-20 bg-white dark:bg-slate-900 resize-y"
                                            placeholder="Type your multi-line text here..."
                                        />
                                    </div>

                                    {/* Font Family Selector */}
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">Font Family</Label>
                                        <Select
                                            value={selectedObjectProps.fontFamily || "Inter"}
                                            onValueChange={(v) => updateActiveObjectProperty({ fontFamily: v })}
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

                                    {/* Font Size & Line Height Sliders */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">Font Size</Label>
                                                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{selectedObjectProps.fontSize || 18}px</span>
                                            </div>
                                            <Slider
                                                value={[selectedObjectProps.fontSize || 18]}
                                                min={8}
                                                max={120}
                                                step={1}
                                                onValueChange={([val]) => updateActiveObjectProperty({ fontSize: val })}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">Line Spacing</Label>
                                                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{(selectedObjectProps.lineHeight || 1.2).toFixed(1)}</span>
                                            </div>
                                            <Slider
                                                value={[selectedObjectProps.lineHeight || 1.2]}
                                                min={0.8}
                                                max={2.5}
                                                step={0.1}
                                                onValueChange={([val]) => updateActiveObjectProperty({ lineHeight: val })}
                                            />
                                        </div>
                                    </div>

                                    {/* Text Alignment */}
                                    <div className="space-y-1 pt-1">
                                        <Label className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">Text Alignment</Label>
                                        <div className="grid grid-cols-3 gap-1">
                                            {[
                                                { id: "left", label: "Left" },
                                                { id: "center", label: "Center" },
                                                { id: "right", label: "Right" },
                                            ].map((align) => (
                                                <Button
                                                    key={align.id}
                                                    variant="outline"
                                                    size="sm"
                                                    className={`h-7 text-[10px] font-bold ${selectedObjectProps.textAlign === align.id ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-900"}`}
                                                    onClick={() => updateActiveObjectProperty({ textAlign: align.id })}
                                                >
                                                    {align.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )}

                        {/* ACCORDION 2: COLOR & INK SETTINGS */}
                        <AccordionItem value="color-style" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/50 dark:bg-slate-900/40">
                            <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                <div className="flex items-center gap-2">
                                    <Palette className="w-4 h-4 text-indigo-500" />
                                    <span>Color & Ink Settings</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-3 pt-1 pb-3">
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Stroke / Line Color */}
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Stroke / Line</span>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={typeof selectedObjectProps?.stroke === "string" ? selectedObjectProps.stroke : "#0f172a"}
                                                onChange={(e) => updateActiveObjectProperty({ stroke: e.target.value })}
                                                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 shrink-0"
                                            />
                                            <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400 truncate">
                                                {typeof selectedObjectProps?.stroke === "string" ? selectedObjectProps.stroke : "#0f172a"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Fill Color */}
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Fill Color</span>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={typeof selectedObjectProps?.fill === "string" && selectedObjectProps.fill !== "transparent" ? selectedObjectProps.fill : "#ffffff"}
                                                onChange={(e) => updateActiveObjectProperty({ fill: e.target.value })}
                                                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 shrink-0"
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={`h-8 text-[10px] font-bold px-2 ${selectedObjectProps?.fill === "transparent" || !selectedObjectProps?.fill ? "bg-indigo-50 border-indigo-300 text-indigo-600" : ""}`}
                                                onClick={() => updateActiveObjectProperty({ fill: "transparent" })}
                                                title="Clear Fill Color (Transparent)"
                                            >
                                                None
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Palette Swatches */}
                                <div className="flex items-center gap-1.5 pt-1">
                                    {["#0f172a", "#2563eb", "#ef4444", "#10b981", "#8b5cf6", "#f59e0b", "#000000", "#ffffff"].map((colorHex) => (
                                        <button
                                            key={colorHex}
                                            className="w-5 h-5 rounded-full border border-slate-300 hover:scale-125 transition-transform shadow-xs"
                                            style={{ backgroundColor: colorHex }}
                                            onClick={() => {
                                                const c = fabricCanvasRef.current;
                                                if (!c) return;
                                                const activeObj = c.getActiveObject();
                                                if (activeObj) {
                                                    if (activeObj.stroke || activeObj.type === "path" || activeObj.type === "line") {
                                                        updateActiveObjectProperty({ stroke: colorHex });
                                                    } else {
                                                        updateActiveObjectProperty({ fill: colorHex });
                                                    }
                                                }
                                            }}
                                        />
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* ACCORDION 3: LINE THICKNESS, DASHES & OPACITY */}
                        <AccordionItem value="line-style" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/50 dark:bg-slate-900/40">
                            <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                <div className="flex items-center gap-2">
                                    <Sliders className="w-4 h-4 text-indigo-500" />
                                    <span>Line Style, Pattern & Opacity</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-3 pt-1 pb-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">Line Thickness</Label>
                                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                        {selectedObjectProps?.strokeWidth || 1}px
                                    </span>
                                </div>
                                <Slider
                                    value={[selectedObjectProps?.strokeWidth || 1]}
                                    min={1}
                                    max={60}
                                    step={1}
                                    onValueChange={([val]) => updateActiveObjectProperty({ strokeWidth: val })}
                                />

                                {/* Dash Patterns */}
                                <div className="space-y-1 pt-1">
                                    <Label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Line Pattern</Label>
                                    <div className="grid grid-cols-4 gap-1">
                                        {[
                                            { label: "Solid", value: null },
                                            { label: "Dashed", value: [8, dashGap] },
                                            { label: "Dotted", value: [3, dashGap] },
                                            { label: "Long Dash", value: [16, dashGap] },
                                        ].map((dash) => (
                                            <Button
                                                key={dash.label}
                                                variant="outline"
                                                size="sm"
                                                className="h-7 text-[10px] font-bold px-1"
                                                onClick={() => updateActiveObjectProperty({ strokeDashArray: dash.value })}
                                            >
                                                {dash.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Dash Gap Spacing Slider */}
                                <div className="space-y-1 pt-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">Dash & Dot Spacing</Label>
                                        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                            {Array.isArray(selectedObjectProps?.strokeDashArray) && selectedObjectProps.strokeDashArray.length > 1
                                                ? selectedObjectProps.strokeDashArray[1]
                                                : dashGap}px
                                        </span>
                                    </div>
                                    <Slider
                                        value={[
                                            Array.isArray(selectedObjectProps?.strokeDashArray) && selectedObjectProps.strokeDashArray.length > 1
                                                ? selectedObjectProps.strokeDashArray[1]
                                                : dashGap,
                                        ]}
                                        min={2}
                                        max={40}
                                        step={1}
                                        onValueChange={([gapVal]) => {
                                            setDashGap(gapVal);
                                            const c = fabricCanvasRef.current;
                                            if (!c) return;
                                            const activeObj = c.getActiveObject();
                                            if (activeObj) {
                                                const currentDash = Array.isArray(activeObj.strokeDashArray) && activeObj.strokeDashArray.length > 0
                                                    ? activeObj.strokeDashArray[0]
                                                    : 8;
                                                updateActiveObjectProperty({ strokeDashArray: [currentDash, gapVal] });
                                            }
                                        }}
                                    />
                                </div>

                                {/* Opacity Slider */}
                                <div className="space-y-1 pt-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">Opacity / Transparency</Label>
                                        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                            {Math.round((selectedObjectProps?.opacity ?? 1) * 100)}%
                                        </span>
                                    </div>
                                    <Slider
                                        value={[(selectedObjectProps?.opacity ?? 1) * 100]}
                                        min={10}
                                        max={100}
                                        step={5}
                                        onValueChange={([val]) => {
                                            const opacityVal = val / 100;
                                            updateActiveObjectProperty({ opacity: opacityVal });
                                            if (selectedObjectProps) {
                                                selectedObjectProps.opacity = opacityVal;
                                            }
                                        }}
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* ACCORDION 4: SIZE, ROTATION & FLIP */}
                        <AccordionItem value="transform-style" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/50 dark:bg-slate-900/40">
                            <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                <div className="flex items-center gap-2">
                                    <Maximize2 className="w-4 h-4 text-indigo-500" />
                                    <span>Size, Rotation & Flip</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-3 pt-1 pb-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Width (px)</Label>
                                        <Input
                                            type="number"
                                            value={Math.round((selectedObjectProps?.width || 100) * (selectedObjectProps?.scaleX || 1))}
                                            onChange={(e) => {
                                                const c = fabricCanvasRef.current;
                                                if (!c) return;
                                                const activeObj = c.getActiveObject();
                                                if (activeObj && activeObj.width) {
                                                    const newW = parseFloat(e.target.value) || 10;
                                                    activeObj.set({ scaleX: newW / activeObj.width });
                                                    c.requestRenderAll();
                                                    c.fire("object:modified");
                                                }
                                            }}
                                            className="h-8 text-xs font-mono font-bold"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Height (px)</Label>
                                        <Input
                                            type="number"
                                            value={Math.round((selectedObjectProps?.height || 100) * (selectedObjectProps?.scaleY || 1))}
                                            onChange={(e) => {
                                                const c = fabricCanvasRef.current;
                                                if (!c) return;
                                                const activeObj = c.getActiveObject();
                                                if (activeObj && activeObj.height) {
                                                    const newH = parseFloat(e.target.value) || 10;
                                                    activeObj.set({ scaleY: newH / activeObj.height });
                                                    c.requestRenderAll();
                                                    c.fire("object:modified");
                                                }
                                            }}
                                            className="h-8 text-xs font-mono font-bold"
                                        />
                                    </div>
                                </div>

                                {/* Rotation Control */}
                                <div className="space-y-1 pt-1">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                            <RotateCw className="w-3 h-3 text-indigo-500" /> Rotation Angle
                                        </Label>
                                        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                            {Math.round(selectedObjectProps?.angle || 0)}°
                                        </span>
                                    </div>
                                    <Slider
                                        value={[Math.round(selectedObjectProps?.angle || 0)]}
                                        min={0}
                                        max={360}
                                        step={1}
                                        onValueChange={([val]) => {
                                            const c = fabricCanvasRef.current;
                                            if (!c) return;
                                            const activeObj = c.getActiveObject();
                                            if (activeObj) {
                                                activeObj.set({ angle: val });
                                                c.requestRenderAll();
                                                c.fire("object:modified");
                                            }
                                        }}
                                    />
                                </div>

                                {/* Flip Controls */}
                                <div className="flex items-center gap-2 pt-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 h-8 text-xs font-bold gap-1"
                                        onClick={() => {
                                            const c = fabricCanvasRef.current;
                                            if (!c) return;
                                            const activeObj = c.getActiveObject();
                                            if (activeObj) {
                                                activeObj.set({ flipX: !activeObj.flipX });
                                                c.requestRenderAll();
                                                c.fire("object:modified");
                                            }
                                        }}
                                    >
                                        <FlipHorizontal className="w-3.5 h-3.5" /> Flip Horiz
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 h-8 text-xs font-bold gap-1"
                                        onClick={() => {
                                            const c = fabricCanvasRef.current;
                                            if (!c) return;
                                            const activeObj = c.getActiveObject();
                                            if (activeObj) {
                                                activeObj.set({ flipY: !activeObj.flipY });
                                                c.requestRenderAll();
                                                c.fire("object:modified");
                                            }
                                        }}
                                    >
                                        <FlipVertical className="w-3.5 h-3.5" /> Flip Vert
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* ACCORDION 5: LAYER ARRANGEMENT & PATH FUSE */}
                        <AccordionItem value="layer-style" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/50 dark:bg-slate-900/40">
                            <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                <div className="flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-indigo-500" />
                                    <span>Layer Arrangement & Fuse</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-3 pt-1 pb-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-xs font-semibold justify-start gap-1.5"
                                        onClick={() => {
                                            const c = fabricCanvasRef.current;
                                            if (!c) return;
                                            const activeObj = c.getActiveObject();
                                            if (activeObj) {
                                                if ((c as any).bringObjectToFront) (c as any).bringObjectToFront(activeObj);
                                                else if ((c as any).bringToFront) (c as any).bringToFront(activeObj);
                                                c.requestRenderAll();
                                                c.fire("object:modified");
                                                toast.success("Brought to front");
                                            }
                                        }}
                                    >
                                        <ArrowUp className="w-3.5 h-3.5 text-indigo-500" /> Bring to Front
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-xs font-semibold justify-start gap-1.5"
                                        onClick={() => {
                                            const c = fabricCanvasRef.current;
                                            if (!c) return;
                                            const activeObj = c.getActiveObject();
                                            if (activeObj) {
                                                if ((c as any).sendObjectToBack) (c as any).sendObjectToBack(activeObj);
                                                else if ((c as any).sendToBack) (c as any).sendToBack(activeObj);
                                                c.requestRenderAll();
                                                c.fire("object:modified");
                                                toast.success("Sent to back");
                                            }
                                        }}
                                    >
                                        <ArrowDown className="w-3.5 h-3.5 text-indigo-500" /> Send to Back
                                    </Button>
                                </div>

                                {/* PATH SEGMENT FUSE CONTROL */}
                                {(() => {
                                    const activeObjs = fabricCanvasRef.current ? fabricCanvasRef.current.getActiveObjects() : [];
                                    const count = activeObjs.length;
                                    const canFuse = count >= 2 || selectedObjectType === "activeSelection" || selectedObjectType === "active-selection";

                                    return (
                                        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                                            <Button
                                                size="sm"
                                                disabled={!canFuse}
                                                className={`w-full h-8 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 ${
                                                    canFuse
                                                        ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/20 cursor-pointer"
                                                        : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50"
                                                }`}
                                                onClick={handleFuseSnakePaths}
                                                title={
                                                    canFuse
                                                        ? "Fuse selected path segments into one continuous path tube"
                                                        : "Select 2 or more path segments on the canvas to enable Fuse"
                                                }
                                            >
                                                <Link2 className="w-4 h-4" />
                                                Fuse Path Segments
                                            </Button>
                                        </div>
                                    );
                                })()}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            )}

            {/* 100 PRE-DRAWN PATH TEMPLATE GALLERY MODAL */}
            <SnakePathGalleryModal
                isOpen={isGalleryModalOpen}
                onClose={() => setIsGalleryModalOpen(false)}
                currentTemplateId={snakeMazeConfig.selectedTemplateId}
                onSelectTemplate={(tmpl) => {
                    handleApplySnakeMazeConfig({
                        ...snakeMazeConfig,
                        selectedTemplateId: tmpl.id,
                        pairCount: tmpl.pairCount,
                        pathVariation: tmpl.variation,
                        randomSeed: tmpl.seed,
                        targetMapping: tmpl.mapping,
                    });
                    toast.success(`Applied Pre-Drawn Path Maze #${tmpl.id}!`);
                }}
                onSelectSegment={(seg) => {
                    const c = fabricCanvasRef.current;
                    if (!c) return;
                    const pathGrp = createSingleSnakePathFromSegment(seg);
                    c.add(pathGrp);
                    c.setActiveObject(pathGrp);
                    c.requestRenderAll();
                    c.fire("object:modified");
                    toast.success(`Inserted Single Pre-Drawn Path Segment #${seg.id}!`);
                }}
            />
            <WorksheetBoardGameDrawer
                isOpen={isBoardGameDrawerOpen}
                onClose={() => setIsBoardGameDrawerOpen(false)}
                fabricCanvasRef={fabricCanvasRef}
                onApplyTemplateConfig={handleApplyBoardGameConfig}
            />
        </aside>
    );
};
