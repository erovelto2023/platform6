import * as fabric from "fabric";
import getStroke from "perfect-freehand";
import {
    WordSearchConfig,
    solveAndGenerateWordSearch,
    createDefaultWordSearchConfig
} from "./word-search-engine";

// --- Perfect Freehand Stroke Helper ---
export function getSvgPathFromFreehandStroke(stroke: number[][]): string {
    if (!stroke.length) return "";
    const d = stroke.reduce(
        (acc, [x0, y0], i, arr) => {
            const [x1, y1] = arr[(i + 1) % arr.length];
            acc.push(`Q ${x0} ${y0}, ${(x0 + x1) / 2} ${(y0 + y1) / 2}`);
            return acc;
        },
        [`M ${stroke[0][0]} ${stroke[0][1]}`]
    );
    d.push("Z");
    return d.join(" ");
}

export function createFreehandPath(
    points: { x: number; y: number; pressure?: number }[],
    options: { size?: number; color?: string; thinning?: number; smoothing?: number } = {}
): fabric.Path | null {
    if (points.length < 2) return null;
    const inputPoints = points.map((p) => [p.x, p.y, p.pressure ?? 0.5]);
    const stroke = getStroke(inputPoints, {
        size: options.size ?? 8,
        thinning: options.thinning ?? 0.5,
        smoothing: options.smoothing ?? 0.5,
        streamline: 0.5,
    });
    const pathData = getSvgPathFromFreehandStroke(stroke);
    if (!pathData) return null;

    return new fabric.Path(pathData, {
        fill: options.color ?? "#0f172a",
        stroke: "none",
        selectable: true,
    });
}

// --- Dotted Educational Font Tracing Helper (opentype.js dynamic import) ---
export async function createTracingTextPath(
    text: string,
    fontUrl: string = "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhiI2B.woff",
    options: { fontSize?: number; fill?: string; stroke?: string; strokeWidth?: number; dashArray?: number[] } = {}
): Promise<fabric.Path | null> {
    try {
        if (typeof window === "undefined") return null;

        const opentypeModule = await import("opentype.js");
        const opentype = (opentypeModule as any).default || opentypeModule;

        const font = await new Promise<any>((resolve, reject) => {
            opentype.load(fontUrl, (err: any, loadedFont: any) => {
                if (err || !loadedFont) reject(err || new Error("Failed to load font"));
                else resolve(loadedFont);
            });
        });

        const fontSize = options.fontSize ?? 48;
        const opentypePath = font.getPath(text, 0, fontSize, fontSize);
        const svgPathData = opentypePath.toPathData(2);

        if (!svgPathData) return null;

        return new fabric.Path(svgPathData, {
            fill: options.fill ?? "transparent",
            stroke: options.stroke ?? "#64748b",
            strokeWidth: options.strokeWidth ?? 2,
            strokeDashArray: options.dashArray ?? [6, 6],
            selectable: true,
        });
    } catch (err) {
        console.error("Tracing font creation error:", err);
        return null;
    }
}

// --- QR Code Generator ---
export async function createQRCodeVector(text: string, size: number = 150): Promise<fabric.Group | null> {
    try {
        if (typeof window === "undefined") return null;

        let svgString = "";
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const QRCode = require("qrcode");
            svgString = await QRCode.toString(text, { type: "svg", margin: 1, width: size });
        } catch {
            svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
                <rect x="10" y="10" width="30" height="30" fill="#0f172a"/>
                <rect x="15" y="15" width="20" height="20" fill="#ffffff"/>
                <rect x="20" y="20" width="10" height="10" fill="#0f172a"/>
                <rect x="60" y="10" width="30" height="30" fill="#0f172a"/>
                <rect x="65" y="15" width="20" height="20" fill="#ffffff"/>
                <rect x="70" y="20" width="10" height="10" fill="#0f172a"/>
                <rect x="10" y="60" width="30" height="30" fill="#0f172a"/>
                <rect x="15" y="65" width="20" height="20" fill="#ffffff"/>
                <rect x="20" y="70" width="10" height="10" fill="#0f172a"/>
                <rect x="50" y="50" width="12" height="12" fill="#0f172a"/>
                <rect x="70" y="50" width="12" height="12" fill="#0f172a"/>
                <rect x="50" y="70" width="12" height="12" fill="#0f172a"/>
                <rect x="70" y="70" width="12" height="12" fill="#0f172a"/>
            </svg>`;
        }

        const parsed = await fabric.loadSVGFromString(svgString);
        const validObjects = parsed.objects.filter((obj): obj is fabric.FabricObject => obj !== null);
        return new fabric.Group(validObjects, { left: 50, top: 50 });
    } catch (err) {
        console.error("QR Code creation error:", err);
        return null;
    }
}

// --- Barcode Generator ---
export async function createBarcodeVector(value: string, format: string = "CODE128"): Promise<fabric.Group | null> {
    try {
        if (typeof window === "undefined") return null;

        let JsBarcodeFn: any;
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            JsBarcodeFn = require("jsbarcode");
        } catch {
            const mod = await import("jsbarcode");
            JsBarcodeFn = (mod as any).default || mod;
        }

        const svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        JsBarcodeFn(svgNode, value, {
            format,
            width: 2,
            height: 60,
            displayValue: true,
        });
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgNode);
        const parsed = await fabric.loadSVGFromString(svgString);
        const validObjects = parsed.objects.filter((obj): obj is fabric.FabricObject => obj !== null);
        return new fabric.Group(validObjects, { left: 50, top: 50 });
    } catch (err) {
        console.error("Barcode creation error:", err);
        return null;
    }
}

// --- Safe Canvas Group Helper ---
export function addObjectsSafelyToCanvas(
    c: fabric.Canvas,
    objects: fabric.FabricObject[],
    groupTitle: string = "Activity",
    customMetadata: Record<string, any> = {}
) {
    if (!c || !objects || !objects.length) return;
    try {
        const selectionGroup = new fabric.Group(objects, {
            left: 60,
            top: 60,
            subTargetCheck: true,
        });
        
        Object.assign(selectionGroup as any, customMetadata);

        c.add(selectionGroup);
        c.setActiveObject(selectionGroup);
        c.requestRenderAll();
        c.fire("object:modified");
    } catch (err) {
        console.warn("Fabric Group error, adding elements directly:", err);
        objects.forEach((obj) => c.add(obj));
        c.requestRenderAll();
        c.fire("object:modified");
    }
}

// =========================================================================
// SEPARATED WORD SEARCH COMPONENT GROUPS (FOR INDEPENDENT CANVAS DRAGGING)
// =========================================================================

export function generateWordSearchComponentGroups(config: WordSearchConfig): {
    titleGroup: fabric.FabricObject | null;
    gridGroup: fabric.FabricObject;
    bankGroup: fabric.FabricObject | null;
} {
    const placement = solveAndGenerateWordSearch(config);
    const { grid, solutionGrid } = placement;

    const rows = config.grid.rows;
    const cols = config.grid.cols;
    const cellSize = config.grid.cellSize || (cols >= 15 ? 26 : cols >= 12 ? 30 : 34);

    // --- 1. TITLE GROUP ---
    let titleGroup: fabric.FabricObject | null = null;
    const titleObjs: fabric.FabricObject[] = [];

    if (config.title) {
        const titleObj = new fabric.IText(config.title.toUpperCase(), {
            left: 0,
            top: 0,
            fontSize: config.appearance.titleFontSize || 22,
            fontFamily: config.appearance.titleFont || "Inter",
            fontWeight: "bold",
            fill: config.appearance.titleColor || "#0f172a",
        });
        titleObjs.push(titleObj);
    }

    if (config.subtitle || config.instructions) {
        const text = config.subtitle || config.instructions || "";
        const subObj = new fabric.IText(text, {
            left: 0,
            top: config.title ? 28 : 0,
            fontSize: 12,
            fontFamily: config.appearance.titleFont || "Inter",
            fill: "#475569",
        });
        titleObjs.push(subObj);
    }

    if (titleObjs.length > 0) {
        titleGroup = new fabric.Group(titleObjs, { left: 60, top: 50 });
    }

    // --- 2. LETTER GRID GROUP (CLEAN BORDERLESS BY DEFAULT) ---
    const gridObjs: fabric.FabricObject[] = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = c * cellSize;
            const y = r * cellSize;
            const letter = grid[r][c];
            const isSolution = solutionGrid[r][c];

            // Render Cell Background ONLY if explicitly requested or showing solution
            if (config.answerKey.showSolution && isSolution) {
                const bgRect = new fabric.Rect({
                    left: x,
                    top: y,
                    width: cellSize - 2,
                    height: cellSize - 2,
                    fill: config.answerKey.color || "#bbf7d0",
                    stroke: "#16a34a",
                    strokeWidth: 2,
                    rx: 4,
                    ry: 4,
                });
                gridObjs.push(bgRect);
            } else if (config.grid.cellStyle === "boxed" || config.grid.cellStyle === "rounded" || config.grid.cellStyle === "circle") {
                const rx = config.grid.cellStyle === "circle" ? cellSize / 2 : config.grid.cellStyle === "rounded" ? 8 : 4;
                const bgRect = new fabric.Rect({
                    left: x,
                    top: y,
                    width: cellSize - 2,
                    height: cellSize - 2,
                    fill: config.appearance.cellBgColor !== "transparent" ? config.appearance.cellBgColor : "#ffffff",
                    stroke: config.appearance.gridBorderColor !== "transparent" ? config.appearance.gridBorderColor : "#cbd5e1",
                    strokeWidth: config.appearance.gridBorderThickness || 1,
                    rx: rx,
                    ry: rx,
                });
                gridObjs.push(bgRect);
            }

            // Cell Letter
            const charObj = new fabric.IText(letter, {
                left: x + (cellSize / 2) - 6,
                top: y + (cellSize / 2) - 10,
                fontSize: config.appearance.gridFontSize || (cols >= 15 ? 13 : 15),
                fontFamily: config.appearance.gridFont || "Inter",
                fontWeight: "bold",
                fill: config.answerKey.showSolution && isSolution ? "#14532d" : (config.appearance.gridLetterColor || "#0f172a"),
            });
            gridObjs.push(charObj);
        }
    }

    const gridGroup = new fabric.Group(gridObjs, { left: 60, top: 120 });

    // --- 3. WORD BANK GROUP ---
    let bankGroup: fabric.FabricObject | null = null;

    if (config.wordBank.layout !== "hidden") {
        const bankObjs: fabric.FabricObject[] = [];
        const bankHeader = new fabric.IText("FIND THE WORDS:", {
            left: 0,
            top: 0,
            fontSize: 13,
            fontFamily: config.appearance.wordBankFont || "Inter",
            fontWeight: "bold",
            fill: "#334155",
        });
        bankObjs.push(bankHeader);

        let displayWords = config.words.map((w) => w.word);
        if (config.wordBank.sorting === "alphabetical") {
            displayWords.sort((a, b) => a.localeCompare(b));
        } else if (config.wordBank.sorting === "length") {
            displayWords.sort((a, b) => a.length - b.length);
        }

        const colsCount = config.wordBank.columns || 3;
        const totalGridWidth = cols * cellSize;
        const colWidth = Math.floor(totalGridWidth / colsCount);
        const rowHeight = 22;

        displayWords.forEach((word, idx) => {
            const colIdx = idx % colsCount;
            const rowIdx = Math.floor(idx / colsCount);
            const x = colIdx * colWidth;
            const y = 24 + rowIdx * rowHeight;

            let prefix = "• ";
            if (config.wordBank.layout === "numbered") prefix = `${idx + 1}. `;

            const wordObj = new fabric.IText(`${prefix}${word}`, {
                left: x,
                top: y,
                fontSize: config.appearance.wordBankFontSize || 12,
                fontFamily: config.appearance.wordBankFont || "Inter",
                fontWeight: "600",
                fill: config.appearance.wordBankColor || "#334155",
            });
            bankObjs.push(wordObj);
        });

        const gridHeight = rows * cellSize;
        bankGroup = new fabric.Group(bankObjs, { left: 60, top: 140 + gridHeight + 20 });
    }

    return { titleGroup, gridGroup, bankGroup };
}

// Single-Group Backward Compatibility Builder
export function generateAdvancedWordSearchObjects(config: WordSearchConfig): fabric.FabricObject[] {
    const { titleGroup, gridGroup, bankGroup } = generateWordSearchComponentGroups(config);
    const objects: fabric.FabricObject[] = [];
    if (titleGroup) objects.push(titleGroup);
    if (gridGroup) objects.push(gridGroup);
    if (bankGroup) objects.push(bankGroup);
    return objects;
}

export function generateWordSearchObjects(
    title: string,
    words: string[],
    gridSize: number = 10,
    directions: string[] = ["H", "V", "D_TL_BR"]
): fabric.FabricObject[] {
    const config = createDefaultWordSearchConfig();
    config.title = title || "WORD SEARCH";
    config.grid.rows = gridSize;
    config.grid.cols = gridSize;
    config.grid.directions = directions as any;
    config.words = words.map((w, i) => ({ id: `w-${i}`, word: w }));
    return generateAdvancedWordSearchObjects(config);
}

// 2. Crossword
export function generateCrosswordObjects(title: string, items: { word: string; clue: string }[]): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText((title || "Crossword Puzzle").toUpperCase(), { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })];
    const cellSize = 34;
    let yOffset = 40;

    items.forEach((item, index) => {
        objects.push(new fabric.IText(`${index + 1}.`, { left: 0, top: yOffset + 6, fontSize: 14, fontFamily: "Inter", fontWeight: "bold", fill: "#475569" }));
        const wordUpper = item.word.toUpperCase();
        for (let i = 0; i < wordUpper.length; i++) {
            const x = 25 + i * (cellSize + 4);
            objects.push(new fabric.Rect({ left: x, top: yOffset, width: cellSize, height: cellSize, fill: "#ffffff", stroke: "#334155", strokeWidth: 2, rx: 4, ry: 4 }));
        }
        objects.push(new fabric.IText(`Clue: ${item.clue}`, { left: 30 + wordUpper.length * (cellSize + 4), top: yOffset + 8, fontSize: 13, fontFamily: "Inter", fill: "#64748b" }));
        yOffset += cellSize + 12;
    });

    return objects;
}

// 3. Fill In / Fill-in-the-Blanks
export function generateFillInBlanksObjects(sentence: string, wordBank: string[]): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("FILL IN THE BLANKS", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })];
    objects.push(new fabric.IText(sentence || "The ________ jumps over the ________ wall.", { left: 0, top: 35, fontSize: 18, fontFamily: "Inter", fill: "#0f172a" }));

    if (wordBank.length > 0) {
        objects.push(new fabric.Rect({ left: 0, top: 75, width: 450, height: 40, fill: "#f1f5f9", stroke: "#cbd5e1", strokeWidth: 1.5, rx: 8, ry: 8 }));
        objects.push(new fabric.IText(`Word Bank:  ${wordBank.join("   |   ")}`, { left: 15, top: 85, fontSize: 14, fontFamily: "Inter", fontWeight: "bold", fill: "#475569" }));
    }
    return objects;
}

// 4. Cryptogram
export function generateCryptogramObjects(): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("CRYPTOGRAM PUZZLE", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#4f46e5" })];
    const phrase = "KNOWLEDGE IS POWER";
    let x = 0;
    phrase.split("").forEach((char) => {
        if (char === " ") {
            x += 25;
            return;
        }
        const sub = ((char.charCodeAt(0) - 65 + 7) % 26 + 65);
        const codeChar = String.fromCharCode(sub);
        objects.push(new fabric.IText(codeChar, { left: x + 8, top: 40, fontSize: 20, fontFamily: "Courier New", fontWeight: "bold", fill: "#4f46e5" }));
        objects.push(new fabric.Rect({ left: x, top: 70, width: 30, height: 35, fill: "#ffffff", stroke: "#94a3b8", strokeWidth: 2, rx: 4, ry: 4 }));
        x += 36;
    });
    return objects;
}

// 5. Crack the Code
export function generateCrackTheCodeObjects(): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("CRACK THE CODE!", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#059669" })];
    const clues = [
        "6 8 2  - One number is correct and well placed",
        "6 1 4  - One number is correct but wrong place",
        "2 0 6  - Two numbers are correct but wrong place",
        "7 3 8  - Nothing is correct",
    ];
    let y = 40;
    clues.forEach((c) => {
        objects.push(new fabric.IText(c, { left: 0, top: y, fontSize: 14, fontFamily: "Inter", fill: "#334155" }));
        y += 26;
    });
    for (let i = 0; i < 3; i++) {
        objects.push(new fabric.Rect({ left: i * 50, top: y + 10, width: 40, height: 45, fill: "#f0fdf4", stroke: "#059669", strokeWidth: 2, rx: 6, ry: 6 }));
        objects.push(new fabric.IText("?", { left: i * 50 + 13, top: y + 20, fontSize: 22, fontFamily: "Inter", fontWeight: "bold", fill: "#047857" }));
    }
    return objects;
}

// 6. Sudoku Grid
export function generateSudokuObjects(): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("SUDOKU PUZZLE (MINI 4X4)", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })];
    const size = 4;
    const cellSize = 45;
    const initialGrid = [
        [1, 0, 0, 4],
        [0, 3, 2, 0],
        [0, 4, 1, 0],
        [2, 0, 0, 3],
    ];

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const x = c * cellSize;
            const y = 40 + r * cellSize;
            const isThickRight = (c + 1) % 2 === 0;
            const isThickBottom = (r + 1) % 2 === 0;

            const box = new fabric.Rect({
                left: x,
                top: y,
                width: cellSize,
                height: cellSize,
                fill: "#ffffff",
                stroke: "#1e293b",
                strokeWidth: (isThickRight || isThickBottom) ? 2 : 1,
            });
            objects.push(box);

            const val = initialGrid[r][c];
            if (val > 0) {
                objects.push(new fabric.IText(val.toString(), { left: x + 16, top: y + 10, fontSize: 22, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" }));
            }
        }
    }
    return objects;
}

// 7. Kakuro Cross Sums
export function generateKakuroObjects(): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("KAKURO (CROSS SUMS)", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })];
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            const x = c * 45;
            const y = 40 + r * 45;
            const isDark = (r === 0 && c === 0) || (r === 1 && c === 0) || (r === 0 && c === 1);
            objects.push(new fabric.Rect({ left: x, top: y, width: 45, height: 45, fill: isDark ? "#334155" : "#ffffff", stroke: "#0f172a", strokeWidth: 1.5 }));
            if (isDark) {
                objects.push(new fabric.IText("10\\", { left: x + 6, top: y + 12, fontSize: 11, fontFamily: "Inter", fill: "#ffffff" }));
            }
        }
    }
    return objects;
}

// 8. Maze Challenge
export function generateMazeObjects(): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("MAZE CHALLENGE!", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })];
    const outer = new fabric.Rect({ left: 0, top: 40, width: 240, height: 240, fill: "#ffffff", stroke: "#0f172a", strokeWidth: 3, rx: 8, ry: 8 });
    objects.push(outer);

    const walls = [
        { x: 0, y: 100, w: 160, h: 4 },
        { x: 80, y: 160, w: 160, h: 4 },
        { x: 80, y: 40, w: 4, h: 100 },
        { x: 160, y: 140, w: 4, h: 100 },
    ];
    walls.forEach((w) => objects.push(new fabric.Rect({ left: w.x, top: w.y, width: w.w, height: w.h, fill: "#0f172a" })));

    objects.push(new fabric.IText("START ➔", { left: 10, top: 45, fontSize: 12, fontFamily: "Inter", fontWeight: "bold", fill: "#16a34a" }));
    objects.push(new fabric.IText("FINISH 🏁", { left: 160, top: 255, fontSize: 12, fontFamily: "Inter", fontWeight: "bold", fill: "#dc2626" }));
    return objects;
}

// 9. Word Scramble
export function generateWordScrambleObjects(words: string[]): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("WORD SCRAMBLE", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })];
    let yOffset = 40;
    (words && words.length ? words : ["APPLE", "BANANA", "CHERRY"]).forEach((word, idx) => {
        const scrambled = word.split("").sort(() => Math.random() - 0.5).join(" ").toUpperCase();
        objects.push(new fabric.IText(`${idx + 1})   ${scrambled}`, { left: 0, top: yOffset, fontSize: 18, fontFamily: "Courier New", fontWeight: "bold", fill: "#2563eb" }));
        objects.push(new fabric.IText("➔   ______________________", { left: 200, top: yOffset, fontSize: 18, fontFamily: "Inter", fill: "#94a3b8" }));
        yOffset += 38;
    });
    return objects;
}

// 10. Missing Letters
export function generateMissingLettersObjects(words: string[]): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("MISSING LETTERS", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })];
    let yOffset = 40;
    (words && words.length ? words : ["GUITAR", "PLANET", "SUMMER"]).forEach((word, idx) => {
        const chars = word.toUpperCase().split("").map((c, i) => (i % 2 === 1 ? "_" : c)).join(" ");
        objects.push(new fabric.IText(`${idx + 1})   ${chars}`, { left: 0, top: yOffset, fontSize: 22, fontFamily: "Courier New", fontWeight: "bold", fill: "#0f172a" }));
        yOffset += 35;
    });
    return objects;
}

// 11. Matching Pairs
export function generateMatchingPairsObjects(): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("MATCHING PAIRS", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })];
    const leftCol = ["Sun", "Dog", "Apple", "Car"];
    const rightCol = ["Fruit", "Vehicle", "Star", "Animal"];

    leftCol.forEach((item, i) => {
        const y = 45 + i * 45;
        objects.push(new fabric.Rect({ left: 0, top: y, width: 130, height: 35, fill: "#f8fafc", stroke: "#94a3b8", strokeWidth: 1.5, rx: 6, ry: 6 }));
        objects.push(new fabric.IText(item, { left: 15, top: y + 8, fontSize: 14, fontFamily: "Inter", fontWeight: "bold" }));
        objects.push(new fabric.Circle({ left: 135, top: y + 12, radius: 5, fill: "#3b82f6" }));
    });

    rightCol.forEach((item, i) => {
        const y = 45 + i * 45;
        objects.push(new fabric.Circle({ left: 250, top: y + 12, radius: 5, fill: "#ef4444" }));
        objects.push(new fabric.Rect({ left: 265, top: y, width: 130, height: 35, fill: "#f8fafc", stroke: "#94a3b8", strokeWidth: 1.5, rx: 6, ry: 6 }));
        objects.push(new fabric.IText(item, { left: 280, top: y + 8, fontSize: 14, fontFamily: "Inter", fontWeight: "bold" }));
    });
    return objects;
}

// 12. Connect the Dots
export function generateConnectTheDotsObjects(): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("CONNECT THE DOTS", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })];
    const points = [
        { x: 100, y: 50, n: "1" },
        { x: 180, y: 80, n: "2" },
        { x: 200, y: 160, n: "3" },
        { x: 140, y: 220, n: "4" },
        { x: 60, y: 220, n: "5" },
        { x: 0, y: 160, n: "6" },
        { x: 20, y: 80, n: "7" },
    ];
    points.forEach((p) => {
        objects.push(new fabric.Circle({ left: p.x, top: p.y, radius: 6, fill: "#ef4444" }));
        objects.push(new fabric.IText(p.n, { left: p.x + 10, top: p.y - 10, fontSize: 14, fontFamily: "Inter", fontWeight: "bold" }));
    });
    return objects;
}

// 13. Spot the Difference
export function generateSpotTheDifferenceObjects(): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("SPOT THE DIFFERENCES", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })];
    objects.push(new fabric.Rect({ left: 0, top: 40, width: 200, height: 180, fill: "#f8fafc", stroke: "#0f172a", strokeWidth: 2, rx: 8, ry: 8 }));
    objects.push(new fabric.IText("Picture A", { left: 65, top: 45, fontSize: 14, fontFamily: "Inter", fontWeight: "bold" }));
    objects.push(new fabric.Circle({ left: 40, top: 90, radius: 25, fill: "#fbbf24" }));
    objects.push(new fabric.Triangle({ left: 120, top: 120, width: 40, height: 40, fill: "#3b82f6" }));

    objects.push(new fabric.Rect({ left: 220, top: 40, width: 200, height: 180, fill: "#f8fafc", stroke: "#0f172a", strokeWidth: 2, rx: 8, ry: 8 }));
    objects.push(new fabric.IText("Picture B", { left: 285, top: 45, fontSize: 14, fontFamily: "Inter", fontWeight: "bold" }));
    objects.push(new fabric.Circle({ left: 260, top: 90, radius: 25, fill: "#f59e0b" }));
    objects.push(new fabric.Rect({ left: 340, top: 120, width: 35, height: 35, fill: "#3b82f6" }));

    return objects;
}

// 14. Hidden Picture
export function generateHiddenPictureObjects(): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("HIDDEN PICTURE", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })];
    const frame = new fabric.Rect({ left: 0, top: 40, width: 420, height: 200, fill: "#f0fdf4", stroke: "#16a34a", strokeWidth: 2, rx: 8, ry: 8 });
    objects.push(frame);
    objects.push(new fabric.IText("Can you find the hidden Pencil ✏, Star ⭐, and Key 🔑?", { left: 20, top: 50, fontSize: 14, fontFamily: "Inter", fontWeight: "bold", fill: "#15803d" }));
    return objects;
}

// 15. Coloring Page
export function generateColoringPageObjects(): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("COLORING PAGE", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#ec4899" })];
    const star = new fabric.Rect({ left: 100, top: 50, width: 160, height: 160, fill: "transparent", stroke: "#0f172a", strokeWidth: 4, rx: 20, ry: 20 });
    const innerCircle = new fabric.Circle({ left: 130, top: 80, radius: 50, fill: "transparent", stroke: "#0f172a", strokeWidth: 4 });
    objects.push(star, innerCircle);
    return objects;
}

// 16. Logic Grid
export function generateLogicGridObjects(): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("LOGIC GRID PUZZLE", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })];
    const size = 3;
    const cellSize = 40;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const x = 80 + c * cellSize;
            const y = 40 + r * cellSize;
            objects.push(new fabric.Rect({ left: x, top: y, width: cellSize, height: cellSize, fill: "#ffffff", stroke: "#64748b", strokeWidth: 1 }));
        }
    }
    const names = ["Alice", "Bob", "Charlie"];
    names.forEach((n, i) => objects.push(new fabric.IText(n, { left: 0, top: 50 + i * 40, fontSize: 13, fontFamily: "Inter", fontWeight: "bold" })));
    return objects;
}

// 17. Cipher Wheel
export function generateCipherWheelObjects(): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("CIPHER WHEEL", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#7c3aed" })];
    const outer = new fabric.Circle({ left: 50, top: 40, radius: 100, fill: "#f3e8ff", stroke: "#7c3aed", strokeWidth: 3 });
    const inner = new fabric.Circle({ left: 90, top: 80, radius: 60, fill: "#ffffff", stroke: "#6b21a8", strokeWidth: 2 });
    const center = new fabric.Circle({ left: 145, top: 135, radius: 5, fill: "#7c3aed" });
    objects.push(outer, inner, center);
    return objects;
}

// 18. Secret Message
export function generateSecretMessageObjects(): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("SECRET MESSAGE", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })];
    objects.push(new fabric.IText("Decode the message using Symbol Guide:", { left: 0, top: 35, fontSize: 14, fontFamily: "Inter", fill: "#475569" }));
    objects.push(new fabric.IText("★ = A   ▲ = E   ● = O   ◆ = U", { left: 0, top: 60, fontSize: 16, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" }));
    objects.push(new fabric.IText("Message:   H ★ P P Y   D ★ Y !", { left: 0, top: 95, fontSize: 20, fontFamily: "Courier New", fontWeight: "bold", fill: "#2563eb" }));
    return objects;
}

// 19. Decode Puzzle
export function generateDecodePuzzleObjects(): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("DECODE PUZZLE", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })];
    objects.push(new fabric.IText("1=A, 2=B, 3=C, 4=D ... 26=Z", { left: 0, top: 35, fontSize: 13, fontFamily: "Inter", fill: "#64748b" }));
    objects.push(new fabric.IText("Numbers:   19 - 9 - 13 - 16 - 12 - 5", { left: 0, top: 65, fontSize: 18, fontFamily: "Courier New", fontWeight: "bold", fill: "#0f172a" }));
    objects.push(new fabric.IText("Decoded Word: _______________________", { left: 0, top: 100, fontSize: 16, fontFamily: "Inter", fill: "#94a3b8" }));
    return objects;
}

// 20. Rebus Puzzle
export function generateRebusPuzzleObjects(): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("REBUS PUZZLE", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })];
    const box = new fabric.Rect({ left: 0, top: 40, width: 220, height: 100, fill: "#f8fafc", stroke: "#0f172a", strokeWidth: 2, rx: 8, ry: 8 });
    const text = new fabric.IText("STAND\n----- \n TOWN", { left: 60, top: 55, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a", textAlign: "center" });
    const hint = new fabric.IText("Answer: _______________________", { left: 0, top: 155, fontSize: 16, fontFamily: "Inter", fill: "#475569" });
    objects.push(box, text, hint);
    return objects;
}

// 21. Acrostic Poem
export function generateAcrosticObjects(): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("ACROSTIC POEM", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })];
    const word = "SPRING";
    word.split("").forEach((char, i) => {
        const y = 40 + i * 32;
        objects.push(new fabric.IText(char, { left: 0, top: y, fontSize: 24, fontFamily: "Inter", fontWeight: "bold", fill: "#dc2626" }));
        objects.push(new fabric.IText(" ➔  ________________________________________", { left: 30, top: y + 4, fontSize: 16, fontFamily: "Inter", fill: "#94a3b8" }));
    });
    return objects;
}

// 22. Number Search
export function generateNumberSearchObjects(): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("NUMBER SEARCH", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })];
    const size = 6;
    const cellSize = 32;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const x = c * cellSize;
            const y = 35 + r * cellSize;
            const num = Math.floor(Math.random() * 9) + 1;
            objects.push(new fabric.Rect({ left: x, top: y, width: cellSize - 2, height: cellSize - 2, fill: "#fdf4ff", stroke: "#d8b4fe", strokeWidth: 1, rx: 4, ry: 4 }));
            objects.push(new fabric.IText(num.toString(), { left: x + 10, top: y + 6, fontSize: 16, fontFamily: "Courier New", fontWeight: "bold", fill: "#7e22ce" }));
        }
    }
    objects.push(new fabric.IText("Find: 4821, 9305, 1746", { left: 0, top: 45 + size * cellSize, fontSize: 13, fontFamily: "Inter", fill: "#475569" }));
    return objects;
}

// 23. Math Problems
export function generateMathWorksheetObjects(type: string = "addition", count: number = 10, maxNum: number = 20): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText(`MATH PRACTICE: ${type.toUpperCase()}`, { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })];
    const opSymbol = { addition: "+", subtraction: "-", multiplication: "×", division: "÷" }[type] || "+";
    const cols = 2;
    const colWidth = 240;
    const rowHeight = 55;

    for (let i = 0; i < count; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = col * colWidth;
        const y = 40 + row * rowHeight;

        let num1 = Math.floor(Math.random() * maxNum) + 1;
        let num2 = Math.floor(Math.random() * maxNum) + 1;
        if (type === "subtraction" && num1 < num2) [num1, num2] = [num2, num1];

        objects.push(new fabric.IText(`${i + 1})   ${num1} ${opSymbol} ${num2} =  ______`, { left: x, top: y, fontSize: 17, fontFamily: "Inter", fontWeight: "500", fill: "#1e293b" }));
    }
    return objects;
}

// 24. Tic Tac Toe Game Grid
export function generateTicTacToeObjects(): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("TIC-TAC-TOE", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })];
    for (let board = 0; board < 2; board++) {
        const startX = board * 200;
        const startY = 40;
        objects.push(new fabric.Rect({ left: startX, top: startY, width: 160, height: 160, fill: "#ffffff", stroke: "#0f172a", strokeWidth: 2, rx: 8, ry: 8 }));
        objects.push(new fabric.Rect({ left: startX + 53, top: startY, width: 3, height: 160, fill: "#0f172a" }));
        objects.push(new fabric.Rect({ left: startX + 106, top: startY, width: 3, height: 160, fill: "#0f172a" }));
        objects.push(new fabric.Rect({ left: startX, top: startY + 53, width: 160, height: 3, fill: "#0f172a" }));
        objects.push(new fabric.Rect({ left: startX, top: startY + 106, width: 160, height: 3, fill: "#0f172a" }));
    }
    return objects;
}

// 25. Domino Puzzle
export function generateDominoObjects(): fabric.FabricObject[] {
    const objects: fabric.FabricObject[] = [new fabric.IText("DOMINO MATH PUZZLE", { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })];
    for (let i = 0; i < 3; i++) {
        const x = i * 140;
        const y = 40;
        objects.push(new fabric.Rect({ left: x, top: y, width: 120, height: 60, fill: "#ffffff", stroke: "#0f172a", strokeWidth: 2, rx: 6, ry: 6 }));
        objects.push(new fabric.Rect({ left: x + 60, top: y, width: 2, height: 60, fill: "#0f172a" }));
        objects.push(new fabric.Circle({ left: x + 25, top: y + 25, radius: 5, fill: "#0f172a" }));
        objects.push(new fabric.Circle({ left: x + 85, top: y + 15, radius: 5, fill: "#0f172a" }));
        objects.push(new fabric.Circle({ left: x + 85, top: y + 35, radius: 5, fill: "#0f172a" }));
    }
    return objects;
}
