"use client";

import React, { useRef, useState } from "react";
import * as fabric from "fabric";
import toast from "react-hot-toast";
import { saveAs } from "file-saver";

import { useWorksheetStore } from "@/lib/worksheet-store";
import {
    createTracingTextPath,
    createQRCodeVector,
    createBarcodeVector,
    addObjectsSafelyToCanvas,
    generateWordSearchComponentGroups,
    generateCrosswordObjects,
    generateFillInBlanksObjects,
    generateCryptogramObjects,
    generateCrackTheCodeObjects,
    generateSudokuObjects,
    generateKakuroObjects,
    generateMazeObjects,
    generateWordScrambleObjects,
    generateMissingLettersObjects,
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
import { generateWorksheetPDF, convertSvgToHighResDataUrl } from "@/lib/worksheet-pdf";
import { saveWorkbookProject } from "@/lib/workbook-api";

import { WorksheetHeader } from "@/components/worksheet/WorksheetHeader";
import { WorksheetSidebar } from "@/components/worksheet/WorksheetSidebar";
import { WorksheetCanvasContainer } from "@/components/worksheet/WorksheetCanvasContainer";
import { WorksheetPropertyPanel } from "@/components/worksheet/WorksheetPropertyPanel";
import { WorksheetPagesBar } from "@/components/worksheet/WorksheetPagesBar";

export default function WorkbookDesignerClient() {
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [projectId, setProjectId] = useState<string | null>(null);

    const { name, width, height, pages, currentPageIndex } = useWorksheetStore();

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
            left: 60,
            top: 60,
            fontSize: isHeader ? 24 : 16,
            fontFamily: "Inter",
            fontWeight: isHeader ? "bold" : "normal",
            fill: "#0f172a",
        });
        c.add(textObj);
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
            c.setActiveObject(tracingObj);
            c.requestRenderAll();
            c.fire("object:modified");
            toast.success("Dotted tracing text inserted!");
        } else {
            const fallbackText = new fabric.IText(text, {
                left: 60,
                top: 60,
                fontSize: 42,
                fontFamily: "Inter",
                fill: "transparent",
                stroke: "#475569",
                strokeWidth: 2,
                strokeDashArray: [6, 6],
            });
            c.add(fallbackText);
            c.setActiveObject(fallbackText);
            c.requestRenderAll();
            c.fire("object:modified");
        }
    };

    const handleAddShape = (type: "rect" | "circle" | "triangle" | "star") => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        let shape: fabric.FabricObject;
        if (type === "rect") {
            shape = new fabric.Rect({ left: 100, top: 100, width: 150, height: 100, fill: "#f1f5f9", stroke: "#0f172a", strokeWidth: 2, rx: 8, ry: 8 });
        } else if (type === "circle") {
            shape = new fabric.Circle({ left: 100, top: 100, radius: 60, fill: "#e0f2fe", stroke: "#0284c7", strokeWidth: 2 });
        } else if (type === "triangle") {
            shape = new fabric.Triangle({ left: 100, top: 100, width: 120, height: 100, fill: "#fef3c7", stroke: "#d97706", strokeWidth: 2 });
        } else {
            shape = new fabric.Rect({ left: 100, top: 100, width: 100, height: 100, fill: "#fef08a", stroke: "#ca8a04", strokeWidth: 2 });
        }
        c.add(shape);
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

        if (titleGroup) {
            (titleGroup as any).customType = "word-search";
            (titleGroup as any).wordSearchConfig = config;
            c.add(titleGroup);
        }

        if (gridGroup) {
            (gridGroup as any).customType = "word-search";
            (gridGroup as any).wordSearchConfig = config;
            c.add(gridGroup);
        }

        if (bankGroup) {
            (bankGroup as any).customType = "word-search";
            (bankGroup as any).wordSearchConfig = config;
            c.add(bankGroup);
        }

        c.setActiveObject(gridGroup);
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success("Word Search added! Title, Grid & Word Bank can be dragged independently.");
    };

    const handleAddCrossword = (title: string, items: { word: string; clue: string }[]) => handleInsertObjects(generateCrosswordObjects(title, items), "Crossword Puzzle");
    const handleAddFillInBlanks = (sentence: string, wordBank: string[]) => handleInsertObjects(generateFillInBlanksObjects(sentence, wordBank), "Fill-in-the-Blanks");
    const handleAddCryptogram = () => handleInsertObjects(generateCryptogramObjects(), "Cryptogram Puzzle");
    const handleAddCrackTheCode = () => handleInsertObjects(generateCrackTheCodeObjects(), "Crack the Code!");
    const handleAddSudoku = () => handleInsertObjects(generateSudokuObjects(), "Sudoku Grid");
    const handleAddKakuro = () => handleInsertObjects(generateKakuroObjects(), "Kakuro");
    const handleAddMaze = () => handleInsertObjects(generateMazeObjects(), "Maze Challenge");
    const handleAddWordScramble = (words: string[]) => handleInsertObjects(generateWordScrambleObjects(words), "Word Scramble");
    const handleAddMissingLetters = (words: string[]) => handleInsertObjects(generateMissingLettersObjects(words), "Missing Letters");
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

    const handleSaveProject = async () => {
        try {
            setIsSaving(true);
            const projectData = { name, width, height, pages, pageCount: pages.length };
            const result = await saveWorkbookProject(projectData, projectId);
            if (result && result._id) setProjectId(result._id);
            toast.success("Project saved successfully!");
        } catch (err) {
            console.error("Save project error:", err);
            toast.error("Failed to save project.");
        } finally {
            setIsSaving(false);
        }
    };

    // Ultra-HD 4K Razor-Sharp Vector PDF Export Handler
    const handleExportPDF = async () => {
        try {
            toast.loading("Rendering Ultra-HD Print PDF...", { id: "pdf-export" });

            const highResImages: string[] = [];

            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                let svgString = "";

                if (i === currentPageIndex && fabricCanvasRef.current) {
                    svgString = fabricCanvasRef.current.toSVG();
                } else if (page.canvasJson) {
                    const staticCanvas = new fabric.StaticCanvas(undefined, { width, height });
                    await staticCanvas.loadFromJSON(page.canvasJson);
                    staticCanvas.renderAll();
                    svgString = staticCanvas.toSVG();
                    staticCanvas.dispose();
                }

                if (svgString) {
                    const highResDataUrl = await convertSvgToHighResDataUrl(svgString, width, height, 4);
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
                width,
                height,
                pages,
                highResImages,
            });

            const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
            saveAs(blob, `${name.replace(/\s+/g, "_")}.pdf`);
            toast.success("Razor-sharp Print PDF Downloaded!", { id: "pdf-export" });
        } catch (err) {
            console.error("PDF Export error:", err);
            toast.error("Failed to generate PDF.", { id: "pdf-export" });
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-slate-100 dark:bg-slate-950 font-sans">
            <WorksheetHeader onExportPDF={handleExportPDF} onSaveProject={handleSaveProject} isSaving={isSaving} />
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
                />
                <WorksheetCanvasContainer fabricCanvasRef={fabricCanvasRef} />
                <WorksheetPropertyPanel fabricCanvasRef={fabricCanvasRef} />
            </div>
            <WorksheetPagesBar />
        </div>
    );
}
