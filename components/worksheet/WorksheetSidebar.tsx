"use client";

import React, { useState, useEffect } from "react";
import * as fabric from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Type, Grid3X3, Palette, Wand2, Plus, Sparkles, Layers, RefreshCw, Eye, EyeOff, HelpCircle, FileText,
    Pencil, Image as ImageIcon, QrCode, Barcode, ShieldAlert, Key, Brain, LayoutGrid, Award, Sliders, BookOpen, Search, Moon, Upload, Trash2, Route, Spline, Scissors, Gamepad2, Dices, PenTool,
    Lock, Unlock, ArrowUp, ArrowDown
} from "lucide-react";
import { useWorksheetStore } from "@/lib/worksheet-store";
import { WICCA_SYMBOL_CATEGORIES } from "@/lib/worksheet-symbols";
import {
    registerCustomFontFace,
    mergeAndLockEraserMasks,
    clearAllEraserMasks,
    generateBoardGameObjectsFromConfig,
    generatePrintableDiceGroup,
    generatePrintableSpinnerGroup,
    generatePrintableCardsGroup,
    generatePrintableTokensGroup,
    generatePrintableMoneyGroup,
    generatePrintableScorecardGroup,
} from "@/lib/worksheet-fabric";
import { createDefaultBoardGameConfig, BOARD_GAME_THEMES, BoardThemeId, BoardLayoutType, BoardGameConfig, CellShape, resamplePointsAlongPath } from "@/lib/board-game-engine";
import { BOARD_TEMPLATES, BoardTemplateId, generateBoardTemplate } from "@/lib/board-game-templates";
import { BoardGameComponentSidebarPanel } from "@/components/worksheet/BoardGameComponentSidebarPanel";
import { toast } from "sonner";

interface WorksheetSidebarProps {
    onAddText: (text: string, isHeader?: boolean) => void;
    onAddTracingText: (text: string, fontSize: number) => void;
    onAddShape: (type: "rect" | "circle" | "triangle" | "star" | "starburst") => void;
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
    onAddPrimaryLinedPaper?: () => void;
    onAddSnakePathMaze?: () => void;
    onAddSinglePathSegment?: (segmentId?: number) => void;
    onAddMathGridPaper?: (type?: "quarter" | "half") => void;
    onAddSpellingTest?: (count?: 10 | 15 | 20) => void;
    onAddFlashcardGrid?: (count?: 4 | 8) => void;
    onAddLineTool?: (lineType: string) => void;
    onAddSymbol?: (symbol: any) => void;
    onAddCustomImage?: (dataUrl: string, name: string) => void;
    fabricCanvasRef?: React.MutableRefObject<fabric.Canvas | null>;
    onAddBoardGame?: (config?: BoardGameConfig) => void;
}

function getObjectDisplayName(obj: fabric.FabricObject): { name: string; icon: string } {
    const type = obj.type;
    const customType = (obj as any).customType;

    // 1. Board Game templates or components
    if (customType === "board-game-template" || customType === "board-game-config") {
        return {
            name: `${(obj as any).templateType ? `Board Game (${(obj as any).templateType})` : "Board Game Template"}`,
            icon: "🎲",
        };
    }
    if (customType === "board-game-space" || customType === "board-game-component") {
        return {
            name: `Board Space: ${(obj as any).spaceType || "Normal"}`,
            icon: "🟢",
        };
    }

    // 2. Custom Activity modules / Puzzle containers
    if ((obj as any).puzzleConfig || (obj as any).isPuzzle) {
        const pType = (obj as any).puzzleConfig?.type || (obj as any).puzzleType || "Puzzle";
        return {
            name: `${pType.charAt(0).toUpperCase()}${pType.slice(1)} Container`,
            icon: "🧩",
        };
    }

    // 3. Native Fabric object types
    if (type === "i-text" || type === "textbox" || type === "text") {
        const text = (obj as any).text || "";
        const preview = text.trim().slice(0, 18) + (text.length > 18 ? "..." : "");
        return {
            name: preview ? `Text: "${preview}"` : "Text Block",
            icon: "✍️",
        };
    }
    if (type === "rect") {
        return { name: "Rectangle Shape", icon: "⬜" };
    }
    if (type === "circle") {
        return { name: "Circle Shape", icon: "⚪" };
    }
    if (type === "triangle") {
        return { name: "Triangle Shape", icon: "🔺" };
    }
    if (type === "polygon") {
        return { name: "Polygon / Star", icon: "⭐" };
    }
    if (type === "path") {
        return { name: "Drawing Path", icon: "〰️" };
    }
    if (type === "image") {
        return { name: "Uploaded Image", icon: "🖼️" };
    }
    if (type === "group") {
        const groupObjectsCount = (obj as fabric.Group).getObjects ? (obj as fabric.Group).getObjects().length : 0;
        return {
            name: `Grouped Object (${groupObjectsCount} items)`,
            icon: "📦",
        };
    }

    return { name: `Canvas ${type}`, icon: "🔳" };
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
    onAddPrimaryLinedPaper,
    onAddSnakePathMaze,
    onAddSinglePathSegment,
    onAddMathGridPaper,
    onAddSpellingTest,
    onAddFlashcardGrid,
    onAddLineTool,
    onAddSymbol,
    onAddCustomImage,
    fabricCanvasRef,
    onAddBoardGame,
}) => {
    const [activeTab, setActiveTab] = useState<"puzzles" | "text" | "freehand" | "shapes" | "symbols" | "uploads" | "preset" | "layers">("puzzles");
    const [symbolQuery, setSymbolQuery] = useState("");
    const [canvasVersion, setCanvasVersion] = useState(0);

    useEffect(() => {
        const c = fabricCanvasRef?.current;
        if (!c) return;

        const updateLayers = () => {
            setCanvasVersion((prev) => prev + 1);
        };

        c.on("object:added", updateLayers);
        c.on("object:removed", updateLayers);
        c.on("selection:created", updateLayers);
        c.on("selection:updated", updateLayers);
        c.on("selection:cleared", updateLayers);
        c.on("object:modified", updateLayers);
        c.on("after:render", updateLayers);

        return () => {
            c.off("object:added", updateLayers);
            c.off("object:removed", updateLayers);
            c.off("selection:created", updateLayers);
            c.off("selection:updated", updateLayers);
            c.off("selection:cleared", updateLayers);
            c.off("object:modified", updateLayers);
            c.off("after:render", updateLayers);
        };
    }, [fabricCanvasRef?.current]);

    const {
        activeTool,
        setActiveTool,
        brushSize,
        brushColor,
        brushThinning,
        brushSmoothing,
        brushStyle,
        setBrushProps,
        eraserSize,
        eraserShape,
        eraserMode,
        setEraserProps,
        customImages,
        customFonts,
        addCustomImage,
        removeCustomImage,
        addCustomFont,
        removeCustomFont,
    } = useWorksheetStore();

    // Board Game Studio State
    const [bgTitle, setBgTitle] = useState("SUPER FUN BOARD GAME");
    const [bgSubtitle, setBgSubtitle] = useState("Roll dice, answer questions & race to finish!");
    const [bgLayout, setBgLayout] = useState<BoardLayoutType>("snake");
    const [bgTheme, setBgTheme] = useState<BoardThemeId>("candyland");
    const [bgSpacesCount, setBgSpacesCount] = useState(28);
    const [bgCellShape, setBgCellShape] = useState<CellShape>("rounded");
    const [isDrawingBoardPath, setIsDrawingBoardPath] = useState(false);
    const [drawnPathPoints, setDrawnPathPoints] = useState<{ x: number; y: number }[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<BoardTemplateId>("winding-path");

    const getCanvasRef = (): fabric.Canvas | null => {
        if (fabricCanvasRef && fabricCanvasRef.current) return fabricCanvasRef.current;
        if ((window as any).__fabricCanvas) return (window as any).__fabricCanvas;
        const canvases = document.querySelectorAll("canvas");
        for (let i = 0; i < canvases.length; i++) {
            const fc = (canvases[i] as any).__fabricCanvas;
            if (fc) return fc;
        }
        return null;
    };

    const handleCreateBoardGame = () => {
        const c = getCanvasRef();
        if (!c) {
            toast.error("Canvas ref not found. Please try again.");
            return;
        }

        const config = createDefaultBoardGameConfig(bgTheme);
        config.title = bgTitle;
        config.subtitle = bgSubtitle;
        config.layout = bgLayout;
        config.totalSpaces = bgSpacesCount;
        config.cellShape = bgCellShape;

        const boardGroup = generateBoardGameObjectsFromConfig(config);
        c.add(boardGroup);
        c.centerObject(boardGroup);
        c.setActiveObject(boardGroup);
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Added Board Game to canvas!");
    };

    /** Activate freehand drawing mode so the user can draw a custom board path */
    const handleStartDrawPath = () => {
        const c = getCanvasRef();
        if (!c) {
            toast.error("Canvas not found. Please try again.");
            return;
        }

        setDrawnPathPoints([]);
        setIsDrawingBoardPath(true);

        // Enable Fabric free-drawing
        c.isDrawingMode = true;
        (c as any).freeDrawingBrush = new fabric.PencilBrush(c);
        (c as any).freeDrawingBrush.color = "#f59e0b";
        (c as any).freeDrawingBrush.width = 4;

        toast.info("🎯 Draw your board path on the canvas. When you release, click 'Convert Path → Board' to generate tiles.");

        // Listen for path:created to capture the drawn path
        const onPathCreated = (e: any) => {
            const pathObj = e.path || e.target;
            if (!pathObj || !pathObj.path) return;

            // Extract raw points from the fabric path commands
            const rawPts: { x: number; y: number }[] = [];
            const matrix = pathObj.calcTransformMatrix ? pathObj.calcTransformMatrix() : null;

            pathObj.path.forEach((cmd: any) => {
                if (!Array.isArray(cmd)) return;
                // SVG path commands: M x y, L x y, Q cx cy x y, C ...
                // We take the endpoint coords (last 2 numbers)
                if (cmd.length >= 3) {
                    const px = cmd[cmd.length - 2];
                    const py = cmd[cmd.length - 1];
                    if (typeof px === "number" && typeof py === "number") {
                        if (matrix) {
                            const tp = fabric.util.transformPoint(new fabric.Point(px, py), matrix);
                            rawPts.push({ x: tp.x, y: tp.y });
                        } else {
                            rawPts.push({ x: px, y: py });
                        }
                    }
                }
            });

            if (rawPts.length >= 2) {
                setDrawnPathPoints(rawPts);
                toast.success(`Captured path with ${rawPts.length} points! Click 'Convert Path → Board' to generate.`);
            } else {
                toast.warning("Path too short. Draw a longer path.");
            }

            // Turn off drawing mode
            c.isDrawingMode = false;
            c.off("path:created", onPathCreated);
        };

        c.on("path:created", onPathCreated);
    };

    /** Cancel draw mode without converting */
    const handleCancelDrawPath = () => {
        const c = getCanvasRef();
        if (c) {
            c.isDrawingMode = false;
        }
        setIsDrawingBoardPath(false);
        setDrawnPathPoints([]);
        toast.info("Drawing cancelled.");
    };

    /** Convert the captured drawn path into a board game */
    const handleConvertDrawnPath = () => {
        const c = getCanvasRef();
        if (!c) {
            toast.error("Canvas not found.");
            return;
        }
        if (drawnPathPoints.length < 2) {
            toast.error("No drawn path found. Draw a path first.");
            return;
        }

        // Resample the drawn path into N evenly-spaced tile positions
        const sampledPositions = resamplePointsAlongPath(drawnPathPoints, bgSpacesCount);

        // Compute bounding box of sampled positions
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        sampledPositions.forEach(p => {
            if (p.x < minX) minX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.x > maxX) maxX = p.x;
            if (p.y > maxY) maxY = p.y;
        });

        const pathW = maxX - minX || 1;
        const pathH = maxY - minY || 1;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        // Re-center positions relative to (0, 0) for the group
        const centeredPositions = sampledPositions.map(p => ({
            x: p.x - centerX,
            y: p.y - centerY,
        }));

        // Build the config with custom positions
        const config = createDefaultBoardGameConfig(bgTheme);
        config.title = bgTitle;
        config.subtitle = bgSubtitle;
        config.layout = bgLayout;
        config.totalSpaces = bgSpacesCount;
        config.cellShape = bgCellShape;
        config.customPositions = centeredPositions;

        const boardGroup = generateBoardGameObjectsFromConfig(config);

        // Remove the original drawn pencil path (the last path object on canvas)
        const allObjs = c.getObjects();
        for (let i = allObjs.length - 1; i >= 0; i--) {
            const obj = allObjs[i] as any;
            if (obj.type === "path" && obj.stroke === "#f59e0b") {
                c.remove(obj);
                break;
            }
        }

        c.add(boardGroup);
        c.centerObject(boardGroup);
        c.setActiveObject(boardGroup);
        c.requestRenderAll();
        c.fire("object:modified");

        // Reset state
        setIsDrawingBoardPath(false);
        setDrawnPathPoints([]);
        toast.success("✅ Board Game generated from your custom path!");
    };

    const handleAddPrintableDice = () => {
        const c = getCanvasRef();
        if (!c) return;
        const diceGroup = generatePrintableDiceGroup();
        c.add(diceGroup);
        c.centerObject(diceGroup);
        c.setActiveObject(diceGroup);
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Added Printable Foldout D6 Die template!");
    };

    const handleAddPrintableSpinner = () => {
        const c = getCanvasRef();
        if (!c) return;
        const spinnerGroup = generatePrintableSpinnerGroup();
        c.add(spinnerGroup);
        c.centerObject(spinnerGroup);
        c.setActiveObject(spinnerGroup);
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Added Printable Pie Spinner template!");
    };

    const handleAddPrintableCards = () => {
        const c = getCanvasRef();
        if (!c) return;
        const cardsGroup = generatePrintableCardsGroup();
        c.add(cardsGroup);
        c.centerObject(cardsGroup);
        c.setActiveObject(cardsGroup);
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Added Printable Task Cards grid!");
    };

    const handleAddPrintableTokens = () => {
        const c = getCanvasRef();
        if (!c) return;
        const tokensGroup = generatePrintableTokensGroup();
        c.add(tokensGroup);
        c.centerObject(tokensGroup);
        c.setActiveObject(tokensGroup);
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Added Printable Player Tokens!");
    };

    const handleAddPrintableMoney = () => {
        const c = getCanvasRef();
        if (!c) return;
        const moneyGroup = generatePrintableMoneyGroup();
        c.add(moneyGroup);
        c.centerObject(moneyGroup);
        c.setActiveObject(moneyGroup);
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Added Printable Play Money Sheet!");
    };

    const handleAddPrintableScorecard = () => {
        const c = getCanvasRef();
        if (!c) return;
        const scorecardGroup = generatePrintableScorecardGroup();
        c.add(scorecardGroup);
        c.centerObject(scorecardGroup);
        c.setActiveObject(scorecardGroup);
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Added Printable Game Scorecard & Tracker!");
    };

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
        if (wsDiag) dirs.push("D_TL_BR", "D_TR_BL");
        if (wsReverse) dirs.push("HR", "VR");
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
        <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-[calc(100vh-3.5rem)] z-20 shadow-sm overflow-hidden select-none shrink-0">
            {/* Primary Category Selector Sidebar Navigation */}
            <div className="grid grid-cols-8 h-12 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-1 gap-1 shrink-0">
                <button
                    className={`flex flex-col items-center justify-center rounded-lg transition-all ${activeTab === "puzzles" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                    onClick={() => setActiveTab("puzzles")}
                >
                    <Grid3X3 className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-bold">Puzzles</span>
                </button>

                <button
                    className={`flex flex-col items-center justify-center rounded-lg transition-all ${activeTab === "text" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                    onClick={() => setActiveTab("text")}
                >
                    <Type className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-bold">Text</span>
                </button>

                <button
                    className={`flex flex-col items-center justify-center rounded-lg transition-all ${activeTab === "freehand" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                    onClick={() => {
                        setActiveTab("freehand");
                        setActiveTool("draw");
                    }}
                >
                    <Pencil className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-bold">Draw</span>
                </button>

                <button
                    className={`flex flex-col items-center justify-center rounded-lg transition-all ${activeTab === "shapes" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                    onClick={() => setActiveTab("shapes")}
                >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-bold">Shapes</span>
                </button>

                <button
                    className={`flex flex-col items-center justify-center rounded-lg transition-all ${activeTab === "symbols" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                    onClick={() => setActiveTab("symbols")}
                >
                    <Moon className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-bold">Symbols</span>
                </button>

                <button
                    className={`flex flex-col items-center justify-center rounded-lg transition-all ${activeTab === "uploads" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                    onClick={() => setActiveTab("uploads")}
                >
                    <Upload className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-bold">Uploads</span>
                </button>

                <button
                    className={`flex flex-col items-center justify-center rounded-lg transition-all ${activeTab === "preset" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                    onClick={() => setActiveTab("preset")}
                >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-bold">Presets</span>
                </button>

                <button
                    className={`flex flex-col items-center justify-center rounded-lg transition-all ${activeTab === "layers" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                    onClick={() => setActiveTab("layers")}
                >
                    <Layers className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-bold">Layers</span>
                </button>
            </div>

            {/* Right Sub-Panel Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900 overflow-hidden">
                <div className="h-11 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        {activeTab === "puzzles" && "22 Standalone Activity & Puzzle Studios"}
                        {activeTab === "text" && "Typography & Tracing"}
                        {activeTab === "freehand" && "Smooth Ink Brush"}
                        {activeTab === "shapes" && "Shapes & QR / Barcodes"}
                        {activeTab === "preset" && "Worksheet Layout Templates"}
                        {activeTab === "layers" && "Canvas Layer Manager"}
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-3 pb-36 space-y-3 min-h-0">
                    {/* --- TAB 1: 22 INDIVIDUAL PUZZLE ACCORDIONS --- */}
                    {activeTab === "puzzles" && (
                        <div className="space-y-2">
                            <Accordion type="single" collapsible className="w-full space-y-2">

                                {/* 1. SNAKE PATH MAZE STUDIO (FEATURED) */}
                                <AccordionItem value="p-snake-path-maze" className="border border-indigo-300 dark:border-indigo-700 rounded-xl px-3 bg-indigo-50 dark:bg-indigo-950/50 shadow-sm">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                            <Route className="w-4 h-4" />
                                            <span>🐍 1. Snake Path Maze Studio</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Matching corridor path puzzle with custom themes, tube widths & auto answer keys.</p>
                                        <div className="grid grid-cols-1 gap-1.5">
                                            <Button size="sm" className="w-full h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm" onClick={() => onAddSnakePathMaze && onAddSnakePathMaze()}>
                                                <Plus className="w-3.5 h-3.5 mr-1" /> Add Snake Path Maze
                                            </Button>
                                            <Button size="sm" variant="outline" className="w-full h-8 border-indigo-200 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 text-xs font-bold rounded-lg" onClick={() => onAddSinglePathSegment && onAddSinglePathSegment()}>
                                                <Spline className="w-3.5 h-3.5 mr-1 text-indigo-500" /> Insert Single Pre-Drawn Path
                                            </Button>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* 2. BOARD GAME DESIGNER STUDIO (FEATURED) */}
                                <AccordionItem value="p-board-game-designer" className="border border-amber-300 dark:border-amber-700 rounded-xl px-3 bg-amber-50/90 dark:bg-amber-950/50 shadow-sm">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                            <Gamepad2 className="w-4 h-4" />
                                            <span>🎮 2. Board Game Designer Studio</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2.5 pt-1 pb-3">
                                        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Build custom printable board games using premium templates, modular space components, and accessories.</p>
                                        
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Board Game Title</Label>
                                            <Input value={bgTitle} onChange={(e) => setBgTitle(e.target.value)} className="h-7 text-xs bg-white dark:bg-slate-900" placeholder="SUPER FUN BOARD GAME" />
                                        </div>

                                        {/* ── BOARD GAME TEMPLATES ── */}
                                        <div className="pt-2 border-t border-amber-200 dark:border-amber-800 space-y-1.5">
                                            <Label className="text-[10px] font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">🎲 Premium Board Templates</Label>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400">One-click insert professionally-designed board game layouts.</p>
                                            <div className="grid grid-cols-1 gap-1.5">
                                                {BOARD_TEMPLATES.map((tmpl) => (
                                                    <Button
                                                        key={tmpl.id}
                                                        size="sm"
                                                        variant="outline"
                                                        className="w-full h-auto py-1.5 px-2 text-left bg-white dark:bg-slate-900 border-amber-200 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg"
                                                        onClick={() => {
                                                            const c = getCanvasRef();
                                                            if (!c) { toast.error("Canvas not found."); return; }
                                                            const group = generateBoardTemplate({
                                                                template: tmpl.id,
                                                                title: bgTitle,
                                                                subtitle: bgSubtitle,
                                                                totalSpaces: bgSpacesCount,
                                                                showNumbers: true,
                                                            });
                                                            c.add(group);
                                                            c.centerObject(group);
                                                            c.setActiveObject(group);
                                                            c.requestRenderAll();
                                                            c.fire("object:modified");
                                                            toast.success(`${tmpl.icon} ${tmpl.name} board inserted!`);
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-base">{tmpl.icon}</span>
                                                            <div>
                                                                <div className="text-[10px] font-bold text-amber-900 dark:text-amber-200">{tmpl.name}</div>
                                                                <div className="text-[9px] text-slate-500 dark:text-slate-400 font-normal">{tmpl.desc}</div>
                                                            </div>
                                                        </div>
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Embedded Modular Component Panel (One-click multi-add directly from sidebar) */}
                                        <BoardGameComponentSidebarPanel getCanvasRef={getCanvasRef} />

                                        {/* ── PRINTABLE ACCESSORIES ── */}
                                        <div className="pt-2 border-t border-amber-200 dark:border-amber-800 space-y-1.5">
                                            <Label className="text-[10px] font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">✂️ Printable Game Accessories</Label>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Foldouts, cut-outs, spinners, money, and scorecards for a complete printable game kit.</p>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                <Button size="sm" variant="outline" className="h-9 px-2 text-[10px] font-bold bg-white dark:bg-slate-900 border-amber-200 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-200 rounded-lg justify-start" onClick={handleAddPrintableDice}>
                                                    <Dices className="w-3.5 h-3.5 mr-1.5 text-amber-600 shrink-0" />
                                                    <span className="truncate">Foldout D6 Die</span>
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-9 px-2 text-[10px] font-bold bg-white dark:bg-slate-900 border-amber-200 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-200 rounded-lg justify-start" onClick={handleAddPrintableSpinner}>
                                                    <span className="mr-1.5 text-xs">🎯</span>
                                                    <span className="truncate">Pie Spinner</span>
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-9 px-2 text-[10px] font-bold bg-white dark:bg-slate-900 border-amber-200 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-200 rounded-lg justify-start" onClick={handleAddPrintableCards}>
                                                    <span className="mr-1.5 text-xs">🃏</span>
                                                    <span className="truncate">Task Cards</span>
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-9 px-2 text-[10px] font-bold bg-white dark:bg-slate-900 border-amber-200 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-200 rounded-lg justify-start" onClick={handleAddPrintableTokens}>
                                                    <span className="mr-1.5 text-xs">👑</span>
                                                    <span className="truncate">Player Tokens</span>
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-9 px-2 text-[10px] font-bold bg-white dark:bg-slate-900 border-amber-200 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-200 rounded-lg justify-start" onClick={handleAddPrintableMoney}>
                                                    <span className="mr-1.5 text-xs">💵</span>
                                                    <span className="truncate">Play Money</span>
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-9 px-2 text-[10px] font-bold bg-white dark:bg-slate-900 border-amber-200 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-200 rounded-lg justify-start" onClick={handleAddPrintableScorecard}>
                                                    <span className="mr-1.5 text-xs">🏆</span>
                                                    <span className="truncate">Score Tracker</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                
                                {/* 2. WORD SEARCH ACCORDION */}
                                <AccordionItem value="p-word-search" className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50/70 dark:bg-slate-800/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                            <Grid3X3 className="w-4 h-4" />
                                            <span>2. Word Search</span>
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

                                {/* 22. SNAKE PATH MAZE STUDIO ACCORDION */}
                                <AccordionItem value="p-snake-path-maze" className="border border-indigo-200 dark:border-indigo-800 rounded-xl px-3 bg-indigo-50/70 dark:bg-indigo-950/40">
                                    <AccordionTrigger className="hover:no-underline py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                            <Route className="w-4 h-4" />
                                            <span>22. Snake Path Maze Studio</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 pt-1 pb-3">
                                        <p className="text-[11px] text-slate-500">Matching corridor path puzzle with custom themes & answer keys.</p>
                                        <Button size="sm" className="w-full h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg" onClick={() => onAddSnakePathMaze && onAddSnakePathMaze()}>
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Snake Path Maze
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

                            {/* K-12 Educational Guideline Paper & Spelling Presets */}
                            <div className="space-y-2.5 p-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                                <Label className="text-xs font-bold text-blue-800 dark:text-blue-300">K-12 Primary Paper & Spelling Templates</Label>
                                <Button size="sm" className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg" onClick={() => onAddPrimaryLinedPaper && onAddPrimaryLinedPaper()}>
                                    + Add Primary Lined Paper (K-3)
                                </Button>
                                <Button size="sm" className="w-full h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg" onClick={() => onAddSnakePathMaze && onAddSnakePathMaze()}>
                                    🐍 Add Snake Path Maze Activity
                                </Button>
                                <div className="grid grid-cols-2 gap-1.5 pt-1">
                                    <Button size="sm" variant="outline" className="h-7 text-[11px] font-semibold bg-white dark:bg-slate-900" onClick={() => onAddSpellingTest && onAddSpellingTest(10)}>
                                        Spelling (10 Words)
                                    </Button>
                                    <Button size="sm" variant="outline" className="h-7 text-[11px] font-semibold bg-white dark:bg-slate-900" onClick={() => onAddSpellingTest && onAddSpellingTest(20)}>
                                        Spelling (20 Words)
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5">
                                    <Button size="sm" variant="outline" className="h-7 text-[11px] font-semibold bg-white dark:bg-slate-900" onClick={() => onAddMathGridPaper && onAddMathGridPaper("quarter")}>
                                        Math Grid (1/4")
                                    </Button>
                                    <Button size="sm" variant="outline" className="h-7 text-[11px] font-semibold bg-white dark:bg-slate-900" onClick={() => onAddFlashcardGrid && onAddFlashcardGrid(4)}>
                                        Flashcards (4 Grid)
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 3: FREEHAND DRAWING TOOLS & PEN STYLES --- */}
                    {activeTab === "freehand" && (
                        <div className="space-y-4">
                            {/* Ink Tool Activator */}
                            <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Active Canvas Mode</Label>
                                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-600 dark:text-indigo-400">{activeTool}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1.5">
                                    <Button size="sm" variant={activeTool === "select" ? "default" : "outline"} className="h-8 text-[11px] font-semibold px-1" onClick={() => setActiveTool("select")}>Select</Button>
                                    <Button size="sm" variant={activeTool === "draw" ? "default" : "outline"} className={`h-8 text-[11px] font-bold px-1 ${activeTool === "draw" ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}`} onClick={() => setActiveTool("draw")}>
                                        <Pencil className="w-3 h-3 mr-1" /> Draw
                                    </Button>
                                    <Button size="sm" variant={activeTool === "eraser" ? "default" : "outline"} className={`h-8 text-[11px] font-bold px-1 ${activeTool === "eraser" ? "bg-rose-600 hover:bg-rose-700 text-white" : "border-rose-200 text-rose-700 dark:text-rose-400"}`} onClick={() => setActiveTool("eraser")}>
                                        <Scissors className="w-3 h-3 mr-1" /> Erase
                                    </Button>
                                </div>
                            </div>

                            {/* Partial Eraser Tool Options Card */}
                            <div className="space-y-3 p-3 bg-rose-50/70 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800 shadow-xs">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-extrabold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                                        <Scissors className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Eraser Tool Options
                                    </Label>
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 capitalize">
                                        {eraserMode} mode
                                    </span>
                                </div>

                                {/* Erasing Options / Modes */}
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">Erasing Method</Label>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {[
                                            { id: "brush", label: "🧹 Precision Brush", desc: "Drag freehand to erase" },
                                            { id: "box", label: "⬛ Box Area Erase", desc: "Drag box to erase area" },
                                            { id: "cutter", label: "✂️ Segment Cutter", desc: "Cut line between points" },
                                            { id: "stroke", label: "🎯 Stroke Selector", desc: "Click stroke to delete" },
                                        ].map((mode) => (
                                            <Button
                                                key={mode.id}
                                                size="sm"
                                                variant={eraserMode === mode.id ? "default" : "outline"}
                                                className={`h-9 text-[10px] font-bold justify-start px-2 text-left ${eraserMode === mode.id ? "bg-rose-600 text-white shadow-xs" : "bg-white dark:bg-slate-900 border-slate-200"}`}
                                                onClick={() => {
                                                    setActiveTool("eraser");
                                                    setEraserProps({ mode: mode.id as any });
                                                }}
                                            >
                                                <div>
                                                    <p className="font-bold leading-none">{mode.label}</p>
                                                    <p className="text-[9px] font-normal opacity-80 mt-0.5">{mode.desc}</p>
                                                </div>
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Eraser Size Controls */}
                                <div className="space-y-1 pt-1">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Eraser Tip Size</Label>
                                        <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">{eraserSize}px</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-1">
                                        {[8, 16, 32, 64].map((sz) => (
                                            <Button
                                                key={sz}
                                                size="sm"
                                                variant={eraserSize === sz ? "default" : "outline"}
                                                className={`h-6 text-[10px] font-bold ${eraserSize === sz ? "bg-rose-600 text-white" : "bg-white dark:bg-slate-900"}`}
                                                onClick={() => setEraserProps({ size: sz })}
                                            >
                                                {sz}px
                                            </Button>
                                        ))}
                                    </div>
                                    <Input
                                        type="range"
                                        min="4"
                                        max="100"
                                        value={eraserSize}
                                        onChange={(e) => setEraserProps({ size: parseInt(e.target.value) || 24 })}
                                        className="h-6 cursor-pointer mt-1"
                                    />
                                </div>

                                {/* Eraser Tip Shape */}
                                <div className="space-y-1 pt-1">
                                    <Label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Eraser Tip Shape</Label>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        <Button
                                            size="sm"
                                            variant={eraserShape === "round" ? "default" : "outline"}
                                            className={`h-7 text-xs font-bold ${eraserShape === "round" ? "bg-rose-600 text-white" : "bg-white dark:bg-slate-900"}`}
                                            onClick={() => setEraserProps({ shape: "round" })}
                                        >
                                            ● Round Tip
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={eraserShape === "square" ? "default" : "outline"}
                                            className={`h-7 text-xs font-bold ${eraserShape === "square" ? "bg-rose-600 text-white" : "bg-white dark:bg-slate-900"}`}
                                            onClick={() => setEraserProps({ shape: "square" })}
                                        >
                                            ■ Square Tip
                                        </Button>
                                    </div>
                                </div>

                                {/* Fuse / Merge Action */}
                                <div className="pt-2 border-t border-rose-200 dark:border-rose-800/60 space-y-1.5">
                                    <Button
                                        size="sm"
                                        className="w-full h-8 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shadow-sm"
                                        onClick={() => {
                                            const canvasEl = document.querySelector(".canvas-container canvas") as any;
                                            const c = canvasEl?.__fabricCanvas;
                                            if (!c) return;
                                            const count = mergeAndLockEraserMasks(c);
                                            if (count > 0) {
                                                toast.success(`Fused ${count} erased cutout areas permanently into object!`);
                                            } else {
                                                toast.info("No active eraser cutouts found on canvas to merge.");
                                            }
                                        }}
                                    >
                                        🔗 Merge & Lock Erased Gaps
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full h-7 text-[10px] font-bold border-rose-300 text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:text-rose-300"
                                        onClick={() => {
                                            const canvasEl = document.querySelector(".canvas-container canvas") as any;
                                            const c = canvasEl?.__fabricCanvas;
                                            if (!c) return;
                                            const count = clearAllEraserMasks(c);
                                            if (count > 0) {
                                                toast.success(`Cleared ${count} eraser cutouts and restored original lines.`);
                                            } else {
                                                toast.info("No eraser cutouts on canvas.");
                                            }
                                        }}
                                    >
                                        <Trash2 className="w-3 h-3 mr-1" /> Restore Original Lines
                                    </Button>
                                </div>
                            </div>

                            {/* Pen Style Categories */}
                            <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Pen & Brush Styles</Label>
                                <div className="grid grid-cols-2 gap-1.5">
                                    {[
                                        { id: "pen", label: "Ballpoint Pen", icon: "🖋️", size: 4 },
                                        { id: "pencil", label: "Pencil", icon: "✏️", size: 2 },
                                        { id: "calligraphy", label: "Calligraphy", icon: "✒️", size: 8 },
                                        { id: "marker", label: "Felt Marker", icon: "🖍️", size: 14 },
                                        { id: "highlighter", label: "Highlighter", icon: "🖊️", size: 28 },
                                        { id: "crayon", label: "Crayon / Chalk", icon: "🎨", size: 10 },
                                        { id: "watercolor", label: "Watercolor", icon: "🖌️", size: 18 },
                                        { id: "neon", label: "Neon Glow", icon: "✨", size: 6 },
                                        { id: "snake", label: "Snake Path 🐍", icon: "🐍", size: 24 },
                                    ].map((pen) => (
                                        <Button
                                            key={pen.id}
                                            size="sm"
                                            variant={brushStyle === pen.id ? "default" : "outline"}
                                            className={`h-8 text-[11px] font-semibold justify-start px-2 ${brushStyle === pen.id ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-900"}`}
                                            onClick={() => {
                                                setActiveTool("draw");
                                                setBrushProps({ style: pen.id, size: pen.size });
                                            }}
                                        >
                                            <span className="mr-1.5 text-xs">{pen.icon}</span>
                                            <span className="truncate">{pen.label}</span>
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Preset Thicknesses */}
                            <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Stroke Thickness</Label>
                                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">{brushSize}px</span>
                                </div>
                                <div className="grid grid-cols-6 gap-1">
                                    {[2, 4, 8, 14, 24, 36].map((sz) => (
                                        <Button
                                            key={sz}
                                            size="sm"
                                            variant={brushSize === sz ? "default" : "outline"}
                                            className={`h-7 p-0 text-[10px] font-bold ${brushSize === sz ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-900"}`}
                                            onClick={() => setBrushProps({ size: sz })}
                                        >
                                            {sz}px
                                        </Button>
                                    ))}
                                </div>
                                <Input
                                    type="range"
                                    min="1"
                                    max="60"
                                    value={brushSize}
                                    onChange={(e) => setBrushProps({ size: parseInt(e.target.value) || 4 })}
                                    className="h-6 cursor-pointer mt-1"
                                />
                            </div>

                            {/* Color Swatches */}
                            <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Ink Color Palette</Label>
                                <div className="grid grid-cols-5 gap-1.5">
                                    {[
                                        "#0f172a", "#1e3a8a", "#b91c1c", "#047857", "#6b21a8",
                                        "#d97706", "#0284c7", "#db2777", "#ea580c", "#16a34a",
                                    ].map((c) => (
                                        <button
                                            key={c}
                                            className={`h-7 rounded-lg border transition-all ${brushColor === c ? "ring-2 ring-indigo-500 scale-105 border-white" : "border-transparent"}`}
                                            style={{ backgroundColor: c }}
                                            onClick={() => setBrushProps({ color: c })}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 4: SHAPES & DECORATIVE GRAPHICS --- */}
                    {activeTab === "shapes" && (
                        <div className="space-y-4">
                            {/* 16 Vector Line Tools */}
                            <div className="space-y-2 p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800">
                                <div className="flex items-center justify-between mb-1">
                                    <Label className="text-xs font-bold text-indigo-700 dark:text-indigo-300">16 Precision Line & Connector Tools</Label>
                                    <span className="text-[10px] font-semibold text-indigo-500">Vector</span>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5">
                                    {[
                                        { id: "straight-line", label: "Straight Line" },
                                        { id: "polyline", label: "Polyline" },
                                        { id: "curve", label: "Curve" },
                                        { id: "arc", label: "Arc" },
                                        { id: "bezier-curve", label: "Bezier Curve" },
                                        { id: "freehand-line", label: "Freehand Line" },
                                        { id: "arrow", label: "Arrow →" },
                                        { id: "double-arrow", label: "Double Arrow ↔" },
                                        { id: "elbow-connector", label: "Elbow Connector" },
                                        { id: "curved-connector", label: "Curved Connector" },
                                        { id: "orthogonal-connector", label: "Orthogonal Step" },
                                        { id: "dashed-line", label: "Dashed Line - - -" },
                                        { id: "dotted-line", label: "Dotted Line • • •" },
                                        { id: "zigzag", label: "Zigzag ∧∨∧" },
                                        { id: "wave", label: "Wave ~~~" },
                                        { id: "spiral", label: "Spiral 🌀" },
                                        { id: "snake-line", label: "Snake Path 🐍" },
                                    ].map((tool) => (
                                        <Button
                                            key={tool.id}
                                            size="sm"
                                            variant="outline"
                                            className="h-7 text-[11px] font-semibold bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-200 justify-start px-2"
                                            onClick={() => onAddLineTool && onAddLineTool(tool.id)}
                                        >
                                            {tool.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Basic & Decorative Shapes</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button size="sm" variant="outline" className="h-8 text-xs font-semibold bg-white dark:bg-slate-900" onClick={() => onAddShape("rect")}>Rectangle</Button>
                                    <Button size="sm" variant="outline" className="h-8 text-xs font-semibold bg-white dark:bg-slate-900" onClick={() => onAddShape("circle")}>Circle / Ellipse</Button>
                                    <Button size="sm" variant="outline" className="h-8 text-xs font-semibold bg-white dark:bg-slate-900" onClick={() => onAddShape("triangle")}>Triangle</Button>
                                    <Button size="sm" variant="outline" className="h-8 text-xs font-semibold bg-white dark:bg-slate-900" onClick={() => onAddShape("star")}>5-Point Star ⭐</Button>
                                    <Button size="sm" variant="outline" className="h-8 text-xs font-semibold bg-white dark:bg-slate-900 col-span-2" onClick={() => onAddShape("starburst")}>Explosion Starburst 💥</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 5: SYMBOL & VECTOR ASSET LIBRARY --- */}
                    {activeTab === "symbols" && (
                        <div className="space-y-3">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                                <Input
                                    placeholder="Search Wicca, Moon, Runes..."
                                    value={symbolQuery}
                                    onChange={(e) => setSymbolQuery(e.target.value)}
                                    className="pl-9 h-9 text-xs bg-slate-50 dark:bg-slate-800"
                                />
                            </div>

                            <Accordion type="multiple" defaultValue={["core-wicca", "moon-sun", "planets-zodiac", "runes"]} className="w-full space-y-2">
                                {WICCA_SYMBOL_CATEGORIES.map((cat) => {
                                    const matchingSymbols = cat.symbols.filter(s =>
                                        s.name.toLowerCase().includes(symbolQuery.toLowerCase()) ||
                                        cat.name.toLowerCase().includes(symbolQuery.toLowerCase())
                                    );

                                    if (symbolQuery && matchingSymbols.length === 0) return null;

                                    return (
                                        <AccordionItem key={cat.id} value={cat.id} className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-white dark:bg-slate-900">
                                            <AccordionTrigger className="py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:no-underline">
                                                <span className="flex items-center gap-2">
                                                    <span>{cat.icon}</span>
                                                    <span>{cat.name} ({matchingSymbols.length})</span>
                                                </span>
                                            </AccordionTrigger>
                                            <AccordionContent className="pt-1 pb-3">
                                                <div className="grid grid-cols-2 gap-1.5">
                                                    {matchingSymbols.map((s) => (
                                                        <Button
                                                            key={s.id}
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-9 text-[11px] font-semibold bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-200 justify-start px-2 truncate"
                                                            onClick={() => onAddSymbol && onAddSymbol(s)}
                                                            title={`Insert ${s.name}`}
                                                        >
                                                            <span className="truncate">{s.name}</span>
                                                        </Button>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>
                        </div>
                    )}

                    {/* --- TAB 6: MY UPLOADS & CUSTOM ASSETS --- */}
                    {activeTab === "uploads" && (
                        <div className="space-y-4">
                            {/* Image Upload Box */}
                            <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-800 space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                                        <ImageIcon className="w-3.5 h-3.5" /> My Image Library
                                    </Label>
                                    <span className="text-[10px] text-slate-400 font-medium">PNG, JPG, SVG</span>
                                </div>

                                <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-xl cursor-pointer hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition-all bg-white dark:bg-slate-900">
                                    <Upload className="w-6 h-6 text-indigo-500 mb-1" />
                                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Click to Upload Image</span>
                                    <span className="text-[10px] text-slate-400 mt-0.5">Supports PNG, JPG, SVG, WebP</span>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (evt) => {
                                                    const result = evt.target?.result as string;
                                                    if (result) {
                                                        addCustomImage(file.name, result);
                                                        toast.success(`Uploaded ${file.name} to My Library!`);
                                                    }
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>

                                {customImages.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 pt-2">
                                        {customImages.map((img) => (
                                            <div key={img.id} className="group relative border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-sm aspect-square flex items-center justify-center">
                                                <img src={img.dataUrl} alt={img.name} className="object-contain w-full h-full p-1 cursor-pointer" onClick={() => onAddCustomImage && onAddCustomImage(img.dataUrl, img.name)} />
                                                <button
                                                    className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-md"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeCustomImage(img.id);
                                                        toast.success("Image removed.");
                                                    }}
                                                    title="Delete from My Library"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Font Upload Box */}
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                        <Type className="w-3.5 h-3.5 text-indigo-500" /> My Custom Fonts
                                    </Label>
                                    <span className="text-[10px] text-slate-400 font-medium">TTF, OTF, WOFF</span>
                                </div>

                                <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all bg-white dark:bg-slate-900">
                                    <Upload className="w-5 h-5 text-slate-500 mb-1" />
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Upload Font (.ttf, .otf, .woff)</span>
                                    <input
                                        type="file"
                                        accept=".ttf, .otf, .woff, .woff2"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const fontFamily = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_");
                                                const reader = new FileReader();
                                                reader.onload = async (evt) => {
                                                    const result = evt.target?.result as string;
                                                    if (result) {
                                                        const success = await registerCustomFontFace(fontFamily, result);
                                                        if (success) {
                                                            addCustomFont(file.name, fontFamily, result);
                                                            toast.success(`Registered custom font "${fontFamily}"!`);
                                                        } else {
                                                            toast.error("Failed to load font file.");
                                                        }
                                                    }
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>

                                {customFonts.length > 0 && (
                                    <div className="space-y-1.5 pt-1">
                                        {customFonts.map((f) => (
                                            <div key={f.id} className="flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                                <div>
                                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[170px]" style={{ fontFamily: f.fontFamily }}>
                                                        {f.fontFamily}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">{f.name}</span>
                                                </div>
                                                <button
                                                    className="text-rose-500 hover:text-rose-700 p-1"
                                                    onClick={() => removeCustomFont(f.id)}
                                                    title="Remove Font"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- TAB 7: PRESETS --- */}
                    {activeTab === "preset" && (
                        <div className="space-y-3">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Standard KDP 8.5x11 Presets</span>
                                <p className="text-[11px] text-slate-500">Includes safe margins, bleed settings, and standard page headers.</p>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 8: LAYER MANAGER --- */}
                    {activeTab === "layers" && (() => {
                        const c = fabricCanvasRef?.current;
                        if (!c) return <div className="text-center py-8 text-slate-400 text-xs">Canvas not initialized</div>;
                        const objects = c.getObjects();
                        if (objects.length === 0) {
                            return (
                                <div className="text-center py-12 px-4 text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                                    <Layers className="w-8 h-8 opacity-30 mb-1" />
                                    <p className="font-bold">No Layers Found</p>
                                    <p className="text-[10px]">Add text, shapes, board games, or activity modules to design your sheet.</p>
                                </div>
                            );
                        }

                        const reversedObjects = [...objects].reverse();

                        return (
                            <div className="space-y-2 pb-24">
                                <div className="flex items-center justify-between px-1">
                                    <p className="text-[10px] text-slate-500 font-semibold">
                                        Manage layer order, visibility, and locking for every canvas component.
                                    </p>
                                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-200 dark:border-indigo-800">
                                        {objects.length} {objects.length === 1 ? "Layer" : "Layers"}
                                    </span>
                                </div>

                                <div className="space-y-1.5">
                                    {reversedObjects.map((obj, idx) => {
                                        const { name, icon } = getObjectDisplayName(obj);
                                        const activeObject = c.getActiveObject();
                                        const isSelected = activeObject === obj || (activeObject && activeObject.type === "activeSelection" && (activeObject as any)._objects?.includes(obj));
                                        const isLocked = !obj.selectable;
                                        const isVisible = obj.visible !== false;

                                        return (
                                            <div
                                                key={idx}
                                                className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-all ${
                                                    isSelected
                                                        ? "bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700 shadow-sm"
                                                        : "bg-slate-50/50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800/80 hover:bg-slate-100/60 dark:hover:bg-slate-900/60"
                                                }`}
                                            >
                                                {/* Left: Selectable Layer Item Info */}
                                                <button
                                                    className="flex items-center gap-2 flex-1 min-w-0 text-left py-1 pr-2 cursor-pointer select-none"
                                                    onClick={() => {
                                                        c.setActiveObject(obj);
                                                        c.requestRenderAll();
                                                        c.fire("object:modified");
                                                    }}
                                                >
                                                    <span className="text-base shrink-0 select-none">{icon}</span>
                                                    <span className={`font-semibold truncate text-[11px] select-none ${
                                                        isSelected ? "text-indigo-700 dark:text-indigo-300 font-bold" : "text-slate-700 dark:text-slate-300"
                                                    }`}>
                                                        {name}
                                                    </span>
                                                </button>

                                                {/* Right: Quick Action Controls */}
                                                <div className="flex items-center gap-0.5 shrink-0">
                                                    {/* Lock Toggle */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const nextVal = !obj.selectable;
                                                            obj.set({
                                                                selectable: nextVal,
                                                                evented: nextVal,
                                                                lockMovementX: !nextVal,
                                                                lockMovementY: !nextVal,
                                                                lockScalingX: !nextVal,
                                                                lockScalingY: !nextVal,
                                                                lockRotation: !nextVal,
                                                            });
                                                            if (!nextVal && c.getActiveObject() === obj) {
                                                                c.discardActiveObject();
                                                            }
                                                            c.requestRenderAll();
                                                            c.fire("object:modified");
                                                            toast.success(nextVal ? "Layer unlocked" : "Layer locked on canvas");
                                                        }}
                                                        className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${
                                                            isLocked ? "text-amber-500" : "text-slate-400 hover:text-slate-600"
                                                        }`}
                                                        title={isLocked ? "Unlock selection" : "Lock selection"}
                                                    >
                                                        {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                                                    </button>

                                                    {/* Visibility Toggle */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const nextVal = !isVisible;
                                                            obj.set({ visible: nextVal });
                                                            if (!nextVal && c.getActiveObject() === obj) {
                                                                c.discardActiveObject();
                                                            }
                                                            c.requestRenderAll();
                                                            c.fire("object:modified");
                                                        }}
                                                        className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${
                                                            !isVisible ? "text-slate-300 dark:text-slate-700" : "text-slate-400 hover:text-slate-600"
                                                        }`}
                                                        title={isVisible ? "Hide element" : "Show element"}
                                                    >
                                                        {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                                    </button>

                                                    {/* Move Up */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if ((c as any).bringForward) (c as any).bringForward(obj);
                                                            c.requestRenderAll();
                                                            c.fire("object:modified");
                                                        }}
                                                        disabled={idx === 0}
                                                        className={`p-1.5 rounded-lg transition-colors text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent`}
                                                        title="Move up one layer"
                                                    >
                                                        <ArrowUp className="w-3.5 h-3.5" />
                                                    </button>

                                                    {/* Move Down */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if ((c as any).sendBackwards) (c as any).sendBackwards(obj);
                                                            c.requestRenderAll();
                                                            c.fire("object:modified");
                                                        }}
                                                        disabled={idx === reversedObjects.length - 1}
                                                        className={`p-1.5 rounded-lg transition-colors text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent`}
                                                        title="Move down one layer"
                                                    >
                                                        <ArrowDown className="w-3.5 h-3.5" />
                                                    </button>

                                                    {/* Delete Layer */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            c.remove(obj);
                                                            c.discardActiveObject();
                                                            c.requestRenderAll();
                                                            c.fire("object:modified");
                                                            toast.success("Layer deleted");
                                                        }}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                                        title="Delete layer"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>
        </aside>
    );
};
