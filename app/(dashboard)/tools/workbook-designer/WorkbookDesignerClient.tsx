"use client";

import React, { useRef, useState, useEffect } from "react";
import * as fabric from "fabric";
import toast from "react-hot-toast";
import { saveAs } from "file-saver";

import { useWorksheetStore } from "@/lib/worksheet-store";
import {
    createTracingTextPath,
    createQRCodeVector,
    createBarcodeVector,
    createPrimaryHandwritingLinedPaperGroup,
    createSnakePathMazeGroup,
    createSingleSnakePathFromSegment,
    PRE_DRAWN_SINGLE_PATH_SEGMENTS_100,
    createMathGridPaperGroup,
    createSpellingTestGroup,
    createFlashcardGridGroup,
    createLineToolObject,
    createStarPolygon,
    createSymbolVectorObject,
    registerCustomFontFace,
    addObjectsSafelyToCanvas,
    attachPuzzleMetadata,
    generateWordSearchComponentGroups,
    generateCrosswordComponentGroups,
    generateCrosswordObjects,
    generateFillInBlanksObjects,
    generateFillInBlanksObjectsFromConfig,
    generateCryptogramObjects,
    generateCryptogramObjectsFromConfig,
    generateCrackTheCodeObjects,
    generateCrackTheCodeObjectsFromConfig,
    generateSudokuObjects,
    generateSudokuObjectsFromConfig,
    generateKakuroObjects,
    generateMazeObjects,
    generateWordScrambleObjects,
    generateWordScrambleObjectsFromConfig,
    generateMissingLettersObjects,
    generateMissingLettersObjectsFromConfig,
    generateDoublePuzzleObjectsFromConfig,
    generateFallenPhraseObjectsFromConfig,
    generateLetterTilesObjectsFromConfig,
    generateMathSquaresObjectsFromConfig,
    generateNumberBlocksObjectsFromConfig,
    generateHiddenMessageSearchFromConfig,
    generateMissingVowelsObjectsFromConfig,
    generateCodewordObjectsFromConfig,
    generateMatchingPairsObjects,
    generateConnectTheDotsObjects,
    generateSpotTheDifferenceObjects,
    generateHiddenPictureObjects,
    generateColoringPageObjects,
    generateLogicGridObjects,
    generateCipherWheelObjects,
    generateSecretMessageObjects,
    generateDecodePuzzleObjects,
    generateRebusPuzzleObjects,
    generateAcrosticObjects,
    generateNumberSearchObjects,
    generateMathWorksheetObjects,
    generateTicTacToeObjects,
    generateDominoObjects,
} from "@/lib/worksheet-fabric";
import {
    createDefaultWordSearchConfig,
    WordSearchConfig
} from "@/lib/word-search-engine";
import {
    createDefaultCrosswordConfig,
    CrosswordConfig
} from "@/lib/crossword-engine";
import { generateWorksheetPDF, convertSvgToHighResDataUrl } from "@/lib/worksheet-pdf";
import { saveWorkbookProject } from "@/lib/workbook-api";

import { WorksheetHeader } from "@/components/worksheet/WorksheetHeader";
import { WorksheetSidebar } from "@/components/worksheet/WorksheetSidebar";
import { WorksheetCanvasContainer } from "@/components/worksheet/WorksheetCanvasContainer";
import { WorksheetPropertyPanel } from "@/components/worksheet/WorksheetPropertyPanel";
import { WorksheetPagesBar } from "@/components/worksheet/WorksheetPagesBar";
import { SnakePathGalleryModal } from "@/components/worksheet/SnakePathGalleryModal";
import type { SinglePathSegmentMeta } from "@/lib/worksheet-fabric";

export default function WorkbookDesignerClient() {
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [projectId, setProjectId] = useState<string | null>(null);
    const [isSegmentPickerOpen, setIsSegmentPickerOpen] = useState(false);

    const {
        name,
        setName,
        pages,
        currentPageIndex,
        getKdpSpecs,
        updateCurrentPageCanvas,
    } = useWorksheetStore();
    const kdpSpecs = getKdpSpecs();

    // Helper to insert objects onto canvas safely
    const handleInsertObjects = (
        objects: fabric.FabricObject[],
        title: string = "Activity",
        metadata: Record<string, any> = {}
    ) => {
        const c = fabricCanvasRef.current;
        if (!c) {
            toast.error("Canvas non-responsive. Try refreshing.");
            return;
        }
        try {
            addObjectsSafelyToCanvas(c, objects, title, metadata);
            toast.success(`${title} added to worksheet!`);
        } catch (err) {
            console.error("Insertion error:", err);
            toast.error("Could not render activity. Try again.");
        }
    };

    // Text & Tracing Handlers
    const handleAddText = (text: string, isHeader = false) => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const textObj = new fabric.IText(text, {
            fontSize: isHeader ? 24 : 16,
            fontFamily: "Inter",
            fontWeight: isHeader ? "bold" : "normal",
            fill: "#0f172a",
        });
        c.add(textObj);
        c.centerObject(textObj);
        c.setActiveObject(textObj);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const handleAddTracingText = async (text: string) => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const tracingObj = await createTracingTextPath(text);
        if (tracingObj) {
            c.add(tracingObj);
            c.centerObject(tracingObj);
            c.setActiveObject(tracingObj);
            c.requestRenderAll();
            c.fire("object:modified");
            toast.success("Dotted tracing text inserted!");
        } else {
            const fallbackText = new fabric.IText(text, {
                fontSize: 64,
                fontFamily: "Inter",
                fill: "transparent",
                stroke: "#475569",
                strokeWidth: 1.2,
                strokeDashArray: [4, 4],
                strokeLineCap: "round",
                strokeLineJoin: "round",
                objectCaching: false,
            });
            c.add(fallbackText);
            c.centerObject(fallbackText);
            c.setActiveObject(fallbackText);
            c.requestRenderAll();
            c.fire("object:modified");
        }
    };

    const handleAddShape = (type: "rect" | "circle" | "triangle" | "star" | "starburst") => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        let shape: fabric.FabricObject;
        if (type === "rect") {
            shape = new fabric.Rect({ width: 150, height: 100, fill: "#f1f5f9", stroke: "#0f172a", strokeWidth: 2, rx: 8, ry: 8 });
        } else if (type === "circle") {
            shape = new fabric.Circle({ radius: 60, fill: "#e0f2fe", stroke: "#0284c7", strokeWidth: 2 });
        } else if (type === "triangle") {
            shape = new fabric.Triangle({ width: 120, height: 100, fill: "#fef3c7", stroke: "#d97706", strokeWidth: 2 });
        } else if (type === "starburst") {
            shape = createStarPolygon(12, 60, 38, { fill: "#ffedd5", stroke: "#ea580c", strokeWidth: 2 });
        } else {
            shape = createStarPolygon(5, 55, 24, { fill: "#fef08a", stroke: "#ca8a04", strokeWidth: 2 });
        }
        c.add(shape);
        c.centerObject(shape);
        c.setActiveObject(shape);
        c.requestRenderAll();
        c.fire("object:modified");
    };

    const handleAddQRCode = async (qrText: string) => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const qrGroup = await createQRCodeVector(qrText);
        if (qrGroup) {
            c.add(qrGroup);
            c.centerObject(qrGroup);
            c.setActiveObject(qrGroup);
            c.requestRenderAll();
            c.fire("object:modified");
            toast.success("Vector QR Code generated!");
        }
    };

    const handleAddBarcode = async (barcodeVal: string) => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const barcodeGroup = await createBarcodeVector(barcodeVal);
        if (barcodeGroup) {
            c.add(barcodeGroup);
            c.centerObject(barcodeGroup);
            c.setActiveObject(barcodeGroup);
            c.requestRenderAll();
            c.fire("object:modified");
            toast.success("Vector Barcode generated!");
        }
    };

    // Separated Draggable Components Word Search Handler
    const handleAddWordSearch = (words: string[], title: string, gridSize: number, directions?: string[]) => {
        const c = fabricCanvasRef.current;
        if (!c) return;

        const config: WordSearchConfig = createDefaultWordSearchConfig();
        config.title = title || "WORD SEARCH";
        config.grid.rows = gridSize;
        config.grid.cols = gridSize;
        if (directions && directions.length > 0) {
            config.grid.directions = directions as any;
        }
        if (words && words.length > 0) {
            config.words = words.map((w, i) => ({ id: `w-${i}-${Date.now()}`, word: w, displayText: w }));
        }

        const { titleGroup, gridGroup, bankGroup } = generateWordSearchComponentGroups(config);
        const canvasW = c.width || 1275;

        const centerH = (obj: fabric.FabricObject) => {
            const br = obj.getBoundingRect();
            const newLeft = (canvasW - br.width) / 2;
            const leftOffset = (obj.left || 0) - br.left;
            obj.set({ left: newLeft + leftOffset });
            obj.setCoords();
        };

        if (titleGroup) {
            attachPuzzleMetadata(titleGroup, "word-search", "title", config);
            c.add(titleGroup);
            centerH(titleGroup);
            titleGroup.set({ top: 60 });
            titleGroup.setCoords();
        }

        const gridTop = 150;
        if (gridGroup) {
            attachPuzzleMetadata(gridGroup, "word-search", "grid", config);
            c.add(gridGroup);
            centerH(gridGroup);
            gridGroup.set({ top: gridTop });
            gridGroup.setCoords();
        }

        if (bankGroup) {
            const gridBr = gridGroup ? gridGroup.getBoundingRect() : null;
            const gridHeight = gridBr ? gridBr.height : (gridSize * 34);
            const bankTop = gridTop + gridHeight + 35;
            attachPuzzleMetadata(bankGroup, "word-search", "word-bank", config);
            c.add(bankGroup);
            centerH(bankGroup);
            bankGroup.set({ top: bankTop });
            bankGroup.setCoords();
        }

        c.setActiveObject(gridGroup);
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Word Search added! Fits cleanly inside KDP Safe Margin Zone.");
    };

    const handleAddCrossword = (title: string, items: { word: string; clue: string }[]) => {
        const c = fabricCanvasRef.current;
        if (!c) return;

        const config: CrosswordConfig = createDefaultCrosswordConfig();
        config.title = title || "CROSSWORD PUZZLE";
        if (items && items.length > 0) {
            config.words = items.map((item, idx) => ({
                id: `cw-${idx}-${Date.now()}`,
                word: item.word,
                clue: item.clue,
            }));
        }

        const { titleGroup, gridGroup, cluesGroup } = generateCrosswordComponentGroups(config);
        const canvasW = c.width || 1275;

        const centerH = (obj: fabric.FabricObject) => {
            const br = obj.getBoundingRect();
            const newLeft = (canvasW - br.width) / 2;
            const leftOffset = (obj.left || 0) - br.left;
            obj.set({ left: newLeft + leftOffset });
            obj.setCoords();
        };

        if (titleGroup) {
            attachPuzzleMetadata(titleGroup, "crossword", "title", config);
            c.add(titleGroup);
            centerH(titleGroup);
            titleGroup.set({ top: 60 });
            titleGroup.setCoords();
        }

        const gridTop = 150;
        if (gridGroup) {
            attachPuzzleMetadata(gridGroup, "crossword", "grid", config);
            c.add(gridGroup);
            centerH(gridGroup);
            gridGroup.set({ top: gridTop });
            gridGroup.setCoords();
        }

        if (cluesGroup) {
            const gridBr = gridGroup ? gridGroup.getBoundingRect() : null;
            const gridHeight = gridBr ? gridBr.height : 340;
            const cluesTop = gridTop + gridHeight + 35;
            attachPuzzleMetadata(cluesGroup, "crossword", "clues", config);
            c.add(cluesGroup);
            centerH(cluesGroup);
            cluesGroup.set({ top: cluesTop });
            cluesGroup.setCoords();
        }

        c.setActiveObject(gridGroup);
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Crossword Puzzle added! Select to edit in Crossword Studio.");
    };

    const handleAddFillInBlanks = (sentence: string, wordBank: string[]) => {
        const config = { title: "FILL IN THE BLANKS", sentence: sentence || "The ________ jumps over the ________ wall.", wordBank: wordBank || ["fox", "high", "quick"] };
        handleInsertObjects(generateFillInBlanksObjectsFromConfig(config), "Fill-in-the-Blanks", { customType: "fill-in-blanks", puzzleConfig: config });
    };

    const handleAddCryptogram = () => {
        const config = { title: "CRYPTOGRAM PUZZLE", phrase: "KNOWLEDGE IS POWER" };
        handleInsertObjects(generateCryptogramObjectsFromConfig(config), "Cryptogram Puzzle", { customType: "cryptogram", puzzleConfig: config });
    };

    const handleAddCrackTheCode = () => {
        const config = {
            title: "CRACK THE CODE!",
            secretCode: "682",
            clues: [
                "6 8 2  - One number is correct and well placed",
                "6 1 4  - One number is correct but wrong place",
                "2 0 6  - Two numbers are correct but wrong place",
                "7 3 8  - Nothing is correct",
            ],
        };
        handleInsertObjects(generateCrackTheCodeObjectsFromConfig(config), "Crack the Code!", { customType: "crack-the-code", puzzleConfig: config });
    };

    const handleAddSudoku = () => {
        const config = { title: "SUDOKU PUZZLE (MINI 4X4)", size: 4 as const, difficulty: "easy" as const };
        handleInsertObjects(generateSudokuObjectsFromConfig(config), "Sudoku Grid", { customType: "sudoku", puzzleConfig: config });
    };

    const handleAddWordScramble = (words: string[]) => {
        const config = { title: "WORD SCRAMBLE", words: words && words.length ? words : ["APPLE", "BANANA", "CHERRY"] };
        handleInsertObjects(generateWordScrambleObjectsFromConfig(config), "Word Scramble", { customType: "word-scramble", puzzleConfig: config });
    };

    const handleAddMissingLetters = (words: string[]) => {
        const config = { title: "MISSING LETTERS", words: words && words.length ? words : ["GUITAR", "PLANET", "SUMMER"] };
        handleInsertObjects(generateMissingLettersObjectsFromConfig(config), "Missing Letters", { customType: "missing-letters", puzzleConfig: config });
    };

    const handleAddKakuro = () => handleInsertObjects(generateKakuroObjects(), "Kakuro");
    const handleAddMaze = () => handleInsertObjects(generateMazeObjects(), "Maze Challenge");
    const handleAddMatchingPairs = () => handleInsertObjects(generateMatchingPairsObjects(), "Matching Pairs");
    const handleAddConnectTheDots = () => handleInsertObjects(generateConnectTheDotsObjects(), "Connect the Dots");
    const handleAddSpotTheDifference = () => handleInsertObjects(generateSpotTheDifferenceObjects(), "Spot the Difference");
    const handleAddHiddenPicture = () => handleInsertObjects(generateHiddenPictureObjects(), "Hidden Picture");
    const handleAddColoringPage = () => handleInsertObjects(generateColoringPageObjects(), "Coloring Page");
    const handleAddLogicGrid = () => handleInsertObjects(generateLogicGridObjects(), "Logic Grid");
    const handleAddCipherWheel = () => handleInsertObjects(generateCipherWheelObjects(), "Cipher Wheel");
    const handleAddSecretMessage = () => handleInsertObjects(generateSecretMessageObjects(), "Secret Message");
    const handleAddDecodePuzzle = () => handleInsertObjects(generateDecodePuzzleObjects(), "Decode Puzzle");
    const handleAddRebusPuzzle = () => handleInsertObjects(generateRebusPuzzleObjects(), "Rebus Puzzle");
    const handleAddAcrostic = () => handleInsertObjects(generateAcrosticObjects(), "Acrostic Poem");
    const handleAddNumberSearch = () => handleInsertObjects(generateNumberSearchObjects(), "Number Search");
    const handleAddMathWorksheet = (type: string, count: number, maxNum: number) => handleInsertObjects(generateMathWorksheetObjects(type, count, maxNum), "Math Problems");
    const handleAddTicTacToe = () => handleInsertObjects(generateTicTacToeObjects(), "Tic-Tac-Toe");
    const handleAddDominoPuzzle = () => handleInsertObjects(generateDominoObjects(), "Domino Puzzle");

    const handleAddDoublePuzzle = () => {
        const config = {
            title: "DOUBLE PUZZLE",
            words: [
                { word: "LEMON", clue: "Yellow sour fruit" },
                { word: "PEACH", clue: "Fuzzy summer fruit" },
                { word: "GRAPE", clue: "Small round fruit on vines" },
            ],
            finalQuote: "GREAT JOB",
        };
        handleInsertObjects(generateDoublePuzzleObjectsFromConfig(config), "Double Puzzle", { customType: "double-puzzle", puzzleConfig: config });
    };

    const handleAddFallenPhrase = () => {
        const config = { title: "FALLEN PHRASE PUZZLE", phrase: "PRACTICE MAKES PERFECT" };
        handleInsertObjects(generateFallenPhraseObjectsFromConfig(config), "Fallen Phrase", { customType: "fallen-phrase", puzzleConfig: config });
    };

    const handleAddLetterTiles = () => {
        const config = { title: "LETTER TILES PUZZLE", phrase: "WISDOM BEGINS IN WONDER", chunkSize: 3 as const };
        handleInsertObjects(generateLetterTilesObjectsFromConfig(config), "Letter Tiles", { customType: "letter-tiles", puzzleConfig: config });
    };

    const handleAddMathSquares = () => {
        const config = { title: "MATH SQUARES PUZZLE", size: 3 as const };
        handleInsertObjects(generateMathSquaresObjectsFromConfig(config), "Math Squares", { customType: "math-squares", puzzleConfig: config });
    };

    const handleAddNumberBlocks = () => {
        const config = { title: "NUMBER BLOCKS", rows: 4, cols: 4 };
        handleInsertObjects(generateNumberBlocksObjectsFromConfig(config), "Number Blocks", { customType: "number-blocks", puzzleConfig: config });
    };

    const handleAddHiddenMessageSearch = () => {
        const config = { title: "HIDDEN MESSAGE WORD SEARCH", words: ["STAR", "MOON", "SUN", "PLANET"], hiddenMessage: "DISCOVERY IS FUN", gridSize: 10 };
        handleInsertObjects(generateHiddenMessageSearchFromConfig(config), "Hidden Message Search", { customType: "hidden-message-search", puzzleConfig: config });
    };

    const handleAddMissingVowels = (words: string[]) => {
        const config = { title: "MISSING VOWELS PUZZLE", words: words && words.length ? words : ["ELEPHANT", "SUNSHINE", "BUTTERFLY"] };
        handleInsertObjects(generateMissingVowelsObjectsFromConfig(config), "Missing Vowels", { customType: "missing-vowels", puzzleConfig: config });
    };

    const handleAddCodeword = (words: string[]) => {
        const config = { title: "CODEWORD PUZZLE", words: words && words.length ? words : ["SECRET", "CIPHER", "PUZZLE"] };
        handleInsertObjects(generateCodewordObjectsFromConfig(config), "Codeword Puzzle", { customType: "codeword", puzzleConfig: config });
    };

    // Save Workbook Project Handler
    const handleSaveProject = async () => {
        try {
            setIsSaving(true);

            // 1. Sync current canvas state to current page store
            const c = fabricCanvasRef.current;
            let currentThumbnail = "";
            let latestPages = pages;
            if (c) {
                const currentJson = c.toJSON();
                try {
                    currentThumbnail = c.toDataURL({ format: "png", multiplier: 0.15 });
                } catch (e) {
                    // thumbnail optional
                }
                updateCurrentPageCanvas(currentJson, currentThumbnail);
                latestPages = useWorksheetStore.getState().pages;
            }

            // 2. Prepare payload
            const projectData = {
                name,
                width: kdpSpecs.canvasWidth,
                height: kdpSpecs.canvasHeight,
                currentPageIndex,
                pages: latestPages,
                thumbnail: currentThumbnail || latestPages[0]?.thumbnail,
            };

            // 3. Save to API
            const result = await saveWorkbookProject(projectData, projectId);
            const savedId = result.project?._id || result._id;

            if (savedId) {
                setProjectId(savedId);
            }
            toast.success("Project saved successfully!");
        } catch (err: any) {
            console.error("Save project error:", err);
            toast.error(err.message || "Failed to save project.");
        } finally {
            setIsSaving(false);
        }
    };

    // Load Project Handler
    const handleLoadProjectData = (id: string, projectData: any) => {
        setProjectId(id);
        if (projectData.name) setName(projectData.name);
        if (projectData.pages && projectData.pages.length > 0) {
            useWorksheetStore.setState({
                pages: projectData.pages,
                currentPageIndex: 0,
            });
            const c = fabricCanvasRef.current;
            if (c && projectData.pages[0]?.canvasJson) {
                c.loadFromJSON(projectData.pages[0].canvasJson).then(() => c.requestRenderAll());
            }
        }
    };

    // Ultra-HD 4K KDP-Compliant Print PDF Export Handler
    const handleExportPDF = async () => {
        try {
            toast.loading("Rendering Amazon KDP Print PDF...", { id: "pdf-export" });

            const highResImages: string[] = [];

            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                let svgString = "";

                if (i === currentPageIndex && fabricCanvasRef.current) {
                    svgString = fabricCanvasRef.current.toSVG();
                } else if (page.canvasJson) {
                    const staticCanvas = new fabric.StaticCanvas(undefined, { width: kdpSpecs.canvasWidth, height: kdpSpecs.canvasHeight });
                    await staticCanvas.loadFromJSON(page.canvasJson);
                    staticCanvas.renderAll();
                    svgString = staticCanvas.toSVG();
                    staticCanvas.dispose();
                }

                if (svgString) {
                    const highResDataUrl = await convertSvgToHighResDataUrl(svgString, kdpSpecs.canvasWidth, kdpSpecs.canvasHeight, 4);
                    if (highResDataUrl) {
                        highResImages.push(highResDataUrl);
                        continue;
                    }
                }

                if (page.thumbnail) {
                    highResImages.push(page.thumbnail);
                }
            }

            const pdfBytes = await generateWorksheetPDF({
                projectName: name,
                width: kdpSpecs.canvasWidth,
                height: kdpSpecs.canvasHeight,
                pages,
                highResImages,
            });

            const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
            saveAs(blob, `${name.replace(/\s+/g, "_")}_KDP_Print.pdf`);
            toast.success("Amazon KDP Compliant PDF Downloaded!", { id: "pdf-export" });
        } catch (err) {
            console.error("PDF Export error:", err);
            toast.error("Failed to generate PDF.", { id: "pdf-export" });
        }
    };

    const handleAddPrimaryLinedPaper = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const group = createPrimaryHandwritingLinedPaperGroup(6);
        c.add(group);
        c.centerObject(group);
        c.setActiveObject(group);
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Primary Handwriting Lined Paper inserted!");
    };

    const handleAddSnakePathMaze = () => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const group = createSnakePathMazeGroup();
        c.add(group);
        c.centerObject(group);
        c.setActiveObject(group);
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Snake Path Maze Activity inserted!");
    };

    const handleAddSinglePathSegment = (_segmentId?: number) => {
        // Open the segment picker gallery modal
        setIsSegmentPickerOpen(true);
    };

    const handleInsertSegmentFromPicker = (seg: SinglePathSegmentMeta) => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const group = createSingleSnakePathFromSegment(seg);
        c.add(group);
        c.centerObject(group);
        c.setActiveObject(group);
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success(`Path Segment #${seg.id} (${seg.category}) inserted!`);
    };

    const handleAddMathGridPaper = (gridType: "quarter" | "half" = "quarter") => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const group = createMathGridPaperGroup(gridType);
        c.add(group);
        c.centerObject(group);
        c.setActiveObject(group);
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Math Graph Grid Paper inserted!");
    };

    const handleAddSpellingTest = (count: 10 | 15 | 20 = 10) => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const group = createSpellingTestGroup(count);
        c.add(group);
        c.centerObject(group);
        c.setActiveObject(group);
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success(`Spelling Test Template (${count} Words) inserted!`);
    };

    const handleAddFlashcardGrid = (count: 4 | 8 = 4) => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const group = createFlashcardGridGroup(count);
        c.add(group);
        c.centerObject(group);
        c.setActiveObject(group);
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success(`Flashcard Cut Grid (${count} Cards) inserted!`);
    };

    const handleAddLineTool = (lineType: string) => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const lineObj = createLineToolObject(lineType);
        c.add(lineObj);
        c.centerObject(lineObj);
        c.setActiveObject(lineObj);
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success(`Inserted ${lineType.replace(/-/g, " ")}!`);
    };

    const handleAddSymbol = async (symbol: { id: string; name: string; svgString?: string; pathData?: string; textSymbol?: string }) => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        const obj = await createSymbolVectorObject(symbol);
        c.add(obj);
        c.centerObject(obj);
        c.setActiveObject(obj);
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success(`Inserted ${symbol.name}!`);
    };

    const { customFonts } = useWorksheetStore();

    useEffect(() => {
        if (customFonts && customFonts.length > 0) {
            customFonts.forEach((f) => {
                registerCustomFontFace(f.fontFamily, f.dataUrl);
            });
        }
    }, [customFonts]);

    const handleAddCustomImage = async (dataUrl: string, name: string) => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        try {
            const img = await fabric.Image.fromURL(dataUrl);
            if (img) {
                img.scaleToWidth(250);
                c.add(img);
                c.centerObject(img);
                c.setActiveObject(img);
                c.requestRenderAll();
                c.fire("object:modified");
                toast.success(`Inserted ${name} onto canvas!`);
            }
        } catch (err) {
            console.error("Failed to load image onto canvas:", err);
            toast.error("Failed to load image onto canvas.");
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-slate-100 dark:bg-slate-950 font-sans">
            <WorksheetHeader
                fabricCanvasRef={fabricCanvasRef}
                onExportPDF={handleExportPDF}
                onSaveProject={handleSaveProject}
                onLoadProjectData={handleLoadProjectData}
                isSaving={isSaving}
            />
            <div className="flex-1 flex overflow-hidden">
                <WorksheetSidebar
                    onAddText={handleAddText}
                    onAddTracingText={handleAddTracingText}
                    onAddShape={handleAddShape}
                    onAddQRCode={handleAddQRCode}
                    onAddBarcode={handleAddBarcode}
                    onAddWordSearch={handleAddWordSearch}
                    onAddCrossword={handleAddCrossword}
                    onAddFillInBlanks={handleAddFillInBlanks}
                    onAddCryptogram={handleAddCryptogram}
                    onAddCrackTheCode={handleAddCrackTheCode}
                    onAddSudoku={handleAddSudoku}
                    onAddKakuro={handleAddKakuro}
                    onAddMaze={handleAddMaze}
                    onAddWordScramble={handleAddWordScramble}
                    onAddMissingLetters={handleAddMissingLetters}
                    onAddMatchingPairs={handleAddMatchingPairs}
                    onAddConnectTheDots={handleAddConnectTheDots}
                    onAddSpotTheDifference={handleAddSpotTheDifference}
                    onAddHiddenPicture={handleAddHiddenPicture}
                    onAddColoringPage={handleAddColoringPage}
                    onAddLogicGrid={handleAddLogicGrid}
                    onAddCipherWheel={handleAddCipherWheel}
                    onAddSecretMessage={handleAddSecretMessage}
                    onAddDecodePuzzle={handleAddDecodePuzzle}
                    onAddRebusPuzzle={handleAddRebusPuzzle}
                    onAddAcrostic={handleAddAcrostic}
                    onAddNumberSearch={handleAddNumberSearch}
                    onAddMathWorksheet={handleAddMathWorksheet}
                    onAddTicTacToe={handleAddTicTacToe}
                    onAddDominoPuzzle={handleAddDominoPuzzle}
                    onAddDoublePuzzle={handleAddDoublePuzzle}
                    onAddFallenPhrase={handleAddFallenPhrase}
                    onAddLetterTiles={handleAddLetterTiles}
                    onAddMathSquares={handleAddMathSquares}
                    onAddNumberBlocks={handleAddNumberBlocks}
                    onAddHiddenMessageSearch={handleAddHiddenMessageSearch}
                    onAddMissingVowels={handleAddMissingVowels}
                    onAddCodeword={handleAddCodeword}
                    onAddPrimaryLinedPaper={handleAddPrimaryLinedPaper}
                    onAddSnakePathMaze={handleAddSnakePathMaze}
                    onAddSinglePathSegment={handleAddSinglePathSegment}
                    onAddMathGridPaper={handleAddMathGridPaper}
                    onAddSpellingTest={handleAddSpellingTest}
                    onAddFlashcardGrid={handleAddFlashcardGrid}
                    onAddLineTool={handleAddLineTool}
                    onAddSymbol={handleAddSymbol}
                    onAddCustomImage={handleAddCustomImage}
                    fabricCanvasRef={fabricCanvasRef}
                />
                <WorksheetCanvasContainer fabricCanvasRef={fabricCanvasRef} />
                <WorksheetPropertyPanel fabricCanvasRef={fabricCanvasRef} />
            </div>
            <WorksheetPagesBar fabricCanvasRef={fabricCanvasRef} />

            {/* Segment Picker Modal - opened from sidebar Insert Single Pre-Drawn Path button */}
            <SnakePathGalleryModal
                isOpen={isSegmentPickerOpen}
                initialView="single_segments"
                onClose={() => setIsSegmentPickerOpen(false)}
                onSelectTemplate={() => {}}
                onSelectSegment={(seg) => {
                    setIsSegmentPickerOpen(false);
                    handleInsertSegmentFromPicker(seg);
                }}
            />
        </div>
    );
}
