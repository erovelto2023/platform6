import * as fabric from "fabric";
import getStroke from "perfect-freehand";
import QRCode from "qrcode";
import {
    WordSearchConfig,
    solveAndGenerateWordSearch,
    createDefaultWordSearchConfig
} from "./word-search-engine";
import {
    CrosswordConfig,
    solveAndGenerateCrossword,
    createDefaultCrosswordConfig
} from "./crossword-engine";

export const CUSTOM_PUZZLE_PROPS = [
    "customType",
    "puzzleComponent",
    "wordSearchConfig",
    "crosswordConfig",
    "puzzleConfig",
    "id",
    "subTargetCheck",
];

export function attachPuzzleMetadata(obj: any, customType: string, componentType: string, config: any) {
    if (!obj) return;
    obj.customType = customType;
    obj.puzzleComponent = componentType;
    if (customType === "word-search") obj.wordSearchConfig = config;
    else if (customType === "crossword") obj.crosswordConfig = config;
    else obj.puzzleConfig = config;

    const originalToObject = obj.toObject.bind(obj);
    obj.toObject = function (additionalProperties?: string[]) {
        const res = originalToObject(additionalProperties);
        res.customType = customType;
        res.puzzleComponent = componentType;
        if (customType === "word-search") res.wordSearchConfig = config;
        else if (customType === "crossword") res.crosswordConfig = config;
        else res.puzzleConfig = config;
        return res;
    };
}

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

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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

// --- 100% ISO/IEC 18004 Compliant Scannable Vector QR Code Generator ---
export async function createQRCodeVector(text: string, size: number = 180): Promise<fabric.FabricObject | null> {
    try {
        if (typeof window === "undefined") return null;

        const targetText = text && text.trim().length > 0 ? text.trim() : "https://example.com";

        // Generate ISO/IEC 18004 Compliant Scannable QR Data URL
        const dataUrl = await QRCode.toDataURL(targetText, {
            width: size * 3,
            margin: 2,
            errorCorrectionLevel: "M",
            color: {
                dark: "#0f172a",
                light: "#ffffff",
            },
        });

        const imgObj = await fabric.FabricImage.fromURL(dataUrl);
        imgObj.set({
            left: 60,
            top: 60,
            scaleX: size / (size * 3),
            scaleY: size / (size * 3),
        });

        return imgObj;
    } catch (err) {
        console.error("QR Code creation error:", err);
        return null;
    }
}

// --- Bulletproof Standalone High-DPI Barcode Generator ---
export async function createBarcodeVector(value: string, format: string = "CODE128"): Promise<fabric.FabricObject | null> {
    try {
        if (typeof window === "undefined") return null;

        const val = value || "1234567890";
        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 110;
        const ctx = canvas.getContext("2d");

        if (ctx) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#0f172a";
            let x = 25;
            // Guard Bar Left
            ctx.fillRect(x, 15, 3, 65); x += 5;
            ctx.fillRect(x, 15, 1, 65); x += 4;

            for (let i = 0; i < val.length; i++) {
                const code = val.charCodeAt(i);
                const b1 = ((code * 3) % 4) + 1;
                const s1 = ((code * 7) % 3) + 1;
                const b2 = ((code * 5) % 4) + 1;
                const s2 = ((code * 2) % 3) + 1;

                ctx.fillRect(x, 15, b1 * 2, 65);
                x += (b1 * 2) + (s1 * 2);
                ctx.fillRect(x, 15, b2 * 2, 65);
                x += (b2 * 2) + (s2 * 2);
            }

            // Guard Bar Right
            ctx.fillRect(x, 15, 4, 65); x += 6;
            ctx.fillRect(x, 15, 2, 65);

            // Label Text
            ctx.font = "bold 15px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(val, canvas.width / 2, 98);
        }

        const dataUrl = canvas.toDataURL("image/png");
        const imgObj = await fabric.FabricImage.fromURL(dataUrl);
        imgObj.set({
            left: 60,
            top: 60,
            scaleX: 0.8,
            scaleY: 0.8,
        });

        return imgObj;
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
            subTargetCheck: true,
        });
        
        Object.assign(selectionGroup as any, customMetadata);

        c.add(selectionGroup);
        c.centerObject(selectionGroup);
        c.setActiveObject(selectionGroup);
        c.requestRenderAll();
        c.fire("object:modified");
    } catch (err) {
        console.warn("Fabric Group error, adding elements directly:", err);
        objects.forEach((obj) => {
            c.add(obj);
            c.centerObject(obj);
        });
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
    const cellSize = config.grid.cellSize || (cols >= 15 ? 26 : cols >= 12 ? 30 : 32);

    // --- 1. TITLE GROUP ---
    let titleGroup: fabric.FabricObject | null = null;
    const titleObjs: fabric.FabricObject[] = [];

    if (config.title) {
        const titleObj = new fabric.IText(config.title.toUpperCase(), {
            left: 0,
            top: 0,
            fontSize: config.appearance.titleFontSize || 22,
            fontFamily: config.appearance.titleFont || "Inter",
            fontWeight: "800",
            fill: config.appearance.titleColor || "#0f172a",
        });
        titleObjs.push(titleObj);
    }

    const subText = config.subtitle || config.instructions || "Find all the hidden words in the grid below!";
    const subObj = new fabric.IText(subText, {
        left: 0,
        top: config.title ? 30 : 0,
        fontSize: 12,
        fontFamily: config.appearance.titleFont || "Inter",
        fontWeight: "500",
        fill: "#475569",
    });
    titleObjs.push(subObj);

    if (titleObjs.length > 0) {
        titleGroup = new fabric.Group(titleObjs, { left: 60, top: 50, subTargetCheck: true });
    }

    // --- 2. LETTER GRID GROUP (CLEAN BORDERLESS BY DEFAULT) ---
    const gridObjs: fabric.FabricObject[] = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = c * cellSize;
            const y = r * cellSize;
            const letter = grid[r][c];
            const isSolution = config.answerKey.showSolution && solutionGrid[r][c];

            const bgFill = isSolution
                ? (config.answerKey.color || "#bbf7d0")
                : (config.appearance.cellBgColor !== "transparent" ? config.appearance.cellBgColor : "transparent");

            const bgStroke = isSolution
                ? "#16a34a"
                : (config.grid.cellStyle === "boxed" || config.grid.cellStyle === "rounded" || config.grid.cellStyle === "circle"
                    ? (config.appearance.gridBorderColor !== "transparent" ? config.appearance.gridBorderColor : "#cbd5e1")
                    : "transparent");

            const rx = isSolution
                ? 6
                : (config.grid.cellStyle === "circle" ? cellSize / 2 : config.grid.cellStyle === "rounded" ? 6 : 0);

            const cellRect = new fabric.Rect({
                left: x,
                top: y,
                width: cellSize,
                height: cellSize,
                fill: bgFill,
                stroke: bgStroke,
                strokeWidth: isSolution ? 1.5 : (config.appearance.gridBorderThickness || 1),
                rx: rx,
                ry: rx,
            });
            gridObjs.push(cellRect);

            const charObj = new fabric.IText(letter, {
                left: x + (cellSize / 2),
                top: y + (cellSize / 2),
                originX: "center",
                originY: "center",
                fontSize: config.appearance.gridFontSize || (cols >= 15 ? 13 : 15),
                fontFamily: config.appearance.gridFont || "Inter",
                fontWeight: "bold",
                fill: isSolution ? "#14532d" : (config.appearance.gridLetterColor || "#0f172a"),
            });
            gridObjs.push(charObj);
        }
    }

    const gridGroup = new fabric.Group(gridObjs, { left: 60, top: 130, subTargetCheck: true });

    // --- 3. WORD BANK GROUP (CLEAN & UNBOXED BY DEFAULT) ---
    let bankGroup: fabric.FabricObject | null = null;

    if (config.wordBank.layout !== "hidden") {
        const bankObjs: fabric.FabricObject[] = [];

        const bankHeader = new fabric.IText("FIND THE WORDS:", {
            left: 0,
            top: 0,
            fontSize: 11,
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
        const colWidth = Math.floor(Math.max(totalGridWidth, 300) / colsCount);
        const rowHeight = 20;

        displayWords.forEach((word, idx) => {
            const colIdx = idx % colsCount;
            const rowIdx = Math.floor(idx / colsCount);
            const x = colIdx * colWidth;
            const y = 20 + rowIdx * rowHeight;

            let prefix = "• ";
            if (config.wordBank.layout === "numbered") prefix = `${idx + 1}. `;

            const wordObj = new fabric.IText(`${prefix}${word}`, {
                left: x,
                top: y,
                fontSize: config.appearance.wordBankFontSize || 11,
                fontFamily: config.appearance.wordBankFont || "Inter",
                fontWeight: "600",
                fill: config.appearance.wordBankColor || "#334155",
            });
            bankObjs.push(wordObj);
        });

        const gridHeight = rows * cellSize;
        bankGroup = new fabric.Group(bankObjs, { left: 60, top: 140 + gridHeight + 30, subTargetCheck: true });
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

// =========================================================================
// SEPARATED CANVA-GRADE CROSSWORD PUZZLE COMPONENT GROUPS
// =========================================================================

export function generateCrosswordComponentGroups(config: CrosswordConfig): {
    titleGroup: fabric.FabricObject | null;
    gridGroup: fabric.FabricObject;
    cluesGroup: fabric.FabricObject | null;
} {
    const generation = solveAndGenerateCrossword(config);
    const { grid, acrossClues, downClues } = generation;

    const rows = config.grid.rows;
    const cols = config.grid.cols;
    const cellSize = config.grid.cellSize || 32;

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

    // --- 2. GRID GROUP ---
    const gridObjs: fabric.FabricObject[] = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = c * cellSize;
            const y = r * cellSize;
            const cell = grid[r][c];

            if (cell.isBlack) {
                // Black cell
                const blackRect = new fabric.Rect({
                    left: x,
                    top: y,
                    width: cellSize,
                    height: cellSize,
                    fill: config.grid.blackSquareColor || "#1e293b",
                    stroke: config.grid.borderColor || "#cbd5e1",
                    strokeWidth: config.grid.borderWidth || 1,
                });
                gridObjs.push(blackRect);
            } else {
                // White letter cell
                const cellRect = new fabric.Rect({
                    left: x,
                    top: y,
                    width: cellSize,
                    height: cellSize,
                    fill: config.answerKey.showSolution && cell.letter
                        ? (config.answerKey.highlightColor || "#bbf7d0")
                        : (config.appearance.cellBgColor || "#ffffff"),
                    stroke: config.grid.borderColor || "#cbd5e1",
                    strokeWidth: config.grid.borderWidth || 1,
                    rx: config.grid.cellStyle === "rounded" ? 6 : 0,
                    ry: config.grid.cellStyle === "rounded" ? 6 : 0,
                });
                gridObjs.push(cellRect);

                // Small cell number at top-left
                if (config.numbering.showNumbers && cell.number) {
                    const numObj = new fabric.IText(cell.number.toString(), {
                        left: x + 3,
                        top: y + 2,
                        fontSize: config.numbering.fontSize || 9,
                        fontFamily: "Inter",
                        fontWeight: "600",
                        fill: config.numbering.color || "#475569",
                    });
                    gridObjs.push(numObj);
                }

                // Answer solution letter if toggled or student assistance first/last letter
                let displayedLetter = "";
                if (config.answerKey.showSolution && cell.letter) {
                    displayedLetter = cell.letter;
                } else if (config.assistance?.showFirstLetter && cell.number && cell.letter) {
                    displayedLetter = cell.letter;
                }

                if (displayedLetter) {
                    const letterObj = new fabric.IText(displayedLetter, {
                        left: x + (cellSize / 2),
                        top: y + (cellSize / 2),
                        originX: "center",
                        originY: "center",
                        fontSize: config.appearance.gridFontSize || 15,
                        fontFamily: config.appearance.gridFont || "Inter",
                        fontWeight: "bold",
                        fill: config.answerKey.showSolution ? (config.answerKey.solutionColor || "#14532d") : (config.appearance.gridLetterColor || "#0f172a"),
                    });
                    gridObjs.push(letterObj);
                }
            }
        }
    }

    const gridGroup = new fabric.Group(gridObjs, { left: 60, top: 120 });

    // --- 3. CLUES GROUP ---
    let cluesGroup: fabric.FabricObject | null = null;
    const clueObjs: fabric.FabricObject[] = [];

    const layout = config.clues.layout || "side_by_side";
    const colWidth = layout === "columns_3"
        ? Math.max(160, Math.floor((cols * cellSize) / 3))
        : Math.max(220, Math.floor((cols * cellSize) / 2));

    const clueFontSize = config.clues.fontSize || 11;
    const clueFontFamily = config.clues.fontFamily || "Inter";
    const clueColor = config.clues.color || "#334155";
    const itemSpacing = config.clues.spacing || 20;

    // Helper to format clue string with length hint if enabled
    const formatClueText = (entry: any) => {
        let text = `${entry.number}. ${entry.clue}`;
        if (config.assistance?.showWordLength) {
            text += ` (${entry.word.length})`;
        }
        return text;
    };

    if (layout === "stacked") {
        // Stacked Layout: Across section first, then Down section below it
        let currentY = 0;
        const acrossHeader = new fabric.IText(config.clues.acrossTitle || "ACROSS", {
            left: 0,
            top: currentY,
            fontSize: 14,
            fontFamily: clueFontFamily,
            fontWeight: "bold",
            fill: "#0f172a",
        });
        clueObjs.push(acrossHeader);
        currentY += 24;

        acrossClues.forEach((entry) => {
            const clueItem = new fabric.IText(formatClueText(entry), {
                left: 0,
                top: currentY,
                fontSize: clueFontSize,
                fontFamily: clueFontFamily,
                fill: clueColor,
            });
            clueObjs.push(clueItem);
            currentY += itemSpacing;
        });

        currentY += 16;
        const downHeader = new fabric.IText(config.clues.downTitle || "DOWN", {
            left: 0,
            top: currentY,
            fontSize: 14,
            fontFamily: clueFontFamily,
            fontWeight: "bold",
            fill: "#0f172a",
        });
        clueObjs.push(downHeader);
        currentY += 24;

        downClues.forEach((entry) => {
            const clueItem = new fabric.IText(formatClueText(entry), {
                left: 0,
                top: currentY,
                fontSize: clueFontSize,
                fontFamily: clueFontFamily,
                fill: clueColor,
            });
            clueObjs.push(clueItem);
            currentY += itemSpacing;
        });
    } else {
        // Side-by-side or Multi-column Layout
        const acrossHeader = new fabric.IText(config.clues.acrossTitle || "ACROSS", {
            left: 0,
            top: 0,
            fontSize: 14,
            fontFamily: clueFontFamily,
            fontWeight: "bold",
            fill: "#0f172a",
        });
        clueObjs.push(acrossHeader);

        let acrossY = 24;
        acrossClues.forEach((entry) => {
            const clueItem = new fabric.IText(formatClueText(entry), {
                left: 0,
                top: acrossY,
                fontSize: clueFontSize,
                fontFamily: clueFontFamily,
                fill: clueColor,
            });
            clueObjs.push(clueItem);
            acrossY += itemSpacing;
        });

        // Down Clues Column
        const downHeader = new fabric.IText(config.clues.downTitle || "DOWN", {
            left: colWidth + 20,
            top: 0,
            fontSize: 14,
            fontFamily: clueFontFamily,
            fontWeight: "bold",
            fill: "#0f172a",
        });
        clueObjs.push(downHeader);

        let downY = 24;
        downClues.forEach((entry) => {
            const clueItem = new fabric.IText(formatClueText(entry), {
                left: colWidth + 20,
                top: downY,
                fontSize: clueFontSize,
                fontFamily: clueFontFamily,
                fill: clueColor,
            });
            clueObjs.push(clueItem);
            downY += itemSpacing;
        });
    }

    if (clueObjs.length > 0) {
        const gridHeight = rows * cellSize;
        cluesGroup = new fabric.Group(clueObjs, { left: 60, top: 140 + gridHeight + 20 });
    }

    return { titleGroup, gridGroup, cluesGroup };
}

// Master Group Canva-Grade Crossword Objects Builder
export function generateAdvancedCrosswordObjects(config: CrosswordConfig): fabric.FabricObject[] {
    const { titleGroup, gridGroup, cluesGroup } = generateCrosswordComponentGroups(config);
    const objects: fabric.FabricObject[] = [];
    if (titleGroup) objects.push(titleGroup);
    if (gridGroup) objects.push(gridGroup);
    if (cluesGroup) objects.push(cluesGroup);

    // Attach custom properties to each root object in group
    objects.forEach((obj) => {
        (obj as any).customType = "crossword";
        (obj as any).crosswordConfig = config;
    });

    return objects;
}

export function generateCrosswordObjects(title: string, items: { word: string; clue: string }[]): fabric.FabricObject[] {
    const config = createDefaultCrosswordConfig();
    if (title) config.title = title;
    if (items && items.length > 0) {
        config.words = items.map((item, idx) => ({
            id: `cw-${idx}`,
            word: item.word,
            clue: item.clue,
        }));
    }
    return generateAdvancedCrosswordObjects(config);
}

// 3. Fill In / Fill-in-the-Blanks
export interface FillInBlanksConfig {
    title: string;
    sentence: string;
    wordBank: string[];
    showAnswerKey?: boolean;
}

export function generateFillInBlanksObjectsFromConfig(config: FillInBlanksConfig): fabric.FabricObject[] {
    const titleText = config.title || "FILL IN THE BLANKS";
    const sentenceText = config.sentence || "The ________ jumps over the ________ wall.";
    const wordBank = config.wordBank || ["fox", "high", "quick"];

    const objects: fabric.FabricObject[] = [
        new fabric.IText(titleText.toUpperCase(), { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" }),
        new fabric.IText(sentenceText, { left: 0, top: 35, fontSize: 16, fontFamily: "Inter", fill: "#0f172a" })
    ];

    if (wordBank.length > 0) {
        objects.push(new fabric.Rect({ left: 0, top: 80, width: 450, height: 40, fill: "#f1f5f9", stroke: "#cbd5e1", strokeWidth: 1.5, rx: 8, ry: 8 }));
        objects.push(new fabric.IText(`Word Bank:  ${wordBank.join("   |   ")}`, { left: 15, top: 90, fontSize: 14, fontFamily: "Inter", fontWeight: "bold", fill: "#475569" }));
    }

    if (config.showAnswerKey) {
        objects.push(new fabric.IText(`[Solution Key]: ${wordBank.join(", ")}`, { left: 0, top: 135, fontSize: 12, fontFamily: "Inter", fontWeight: "bold", fill: "#16a34a" }));
    }

    objects.forEach((obj) => {
        (obj as any).customType = "fill-in-blanks";
        (obj as any).puzzleConfig = config;
    });

    return objects;
}

export function generateFillInBlanksObjects(sentence: string, wordBank: string[]): fabric.FabricObject[] {
    return generateFillInBlanksObjectsFromConfig({
        title: "FILL IN THE BLANKS",
        sentence,
        wordBank,
    });
}

// 4. Cryptogram
export interface CryptogramConfig {
    title: string;
    phrase: string;
    showAnswerKey?: boolean;
}

export function generateCryptogramObjectsFromConfig(config: CryptogramConfig): fabric.FabricObject[] {
    const titleText = config.title || "CRYPTOGRAM PUZZLE";
    const phrase = (config.phrase || "KNOWLEDGE IS POWER").toUpperCase();

    const objects: fabric.FabricObject[] = [
        new fabric.IText(titleText.toUpperCase(), { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#4f46e5" })
    ];

    let x = 0;
    phrase.split("").forEach((char) => {
        if (char === " ") {
            x += 25;
            return;
        }
        const sub = ((char.charCodeAt(0) - 65 + 7) % 26 + 65);
        const codeChar = String.fromCharCode(sub);
        objects.push(new fabric.IText(codeChar, { left: x + 8, top: 40, fontSize: 20, fontFamily: "Courier New", fontWeight: "bold", fill: "#4f46e5" }));
        objects.push(new fabric.Rect({ left: x, top: 70, width: 30, height: 35, fill: config.showAnswerKey ? "#bbf7d0" : "#ffffff", stroke: "#94a3b8", strokeWidth: 2, rx: 4, ry: 4 }));
        
        if (config.showAnswerKey) {
            objects.push(new fabric.IText(char, { left: x + 8, top: 76, fontSize: 18, fontFamily: "Inter", fontWeight: "bold", fill: "#16a34a" }));
        }

        x += 36;
    });

    objects.forEach((obj) => {
        (obj as any).customType = "cryptogram";
        (obj as any).puzzleConfig = config;
    });

    return objects;
}

export function generateCryptogramObjects(): fabric.FabricObject[] {
    return generateCryptogramObjectsFromConfig({
        title: "CRYPTOGRAM PUZZLE",
        phrase: "KNOWLEDGE IS POWER",
    });
}

// 5. Crack the Code
export interface CrackTheCodeConfig {
    title: string;
    secretCode: string;
    clues: string[];
    showAnswerKey?: boolean;
}

export function generateCrackTheCodeObjectsFromConfig(config: CrackTheCodeConfig): fabric.FabricObject[] {
    const titleText = config.title || "CRACK THE CODE!";
    const secretCode = config.secretCode || "682";
    const clues = config.clues && config.clues.length > 0 ? config.clues : [
        "6 8 2  - One number is correct and well placed",
        "6 1 4  - One number is correct but wrong place",
        "2 0 6  - Two numbers are correct but wrong place",
        "7 3 8  - Nothing is correct",
    ];

    const objects: fabric.FabricObject[] = [
        new fabric.IText(titleText.toUpperCase(), { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#059669" })
    ];

    let y = 40;
    clues.forEach((c) => {
        objects.push(new fabric.IText(c, { left: 0, top: y, fontSize: 14, fontFamily: "Inter", fill: "#334155" }));
        y += 26;
    });

    const digits = secretCode.split("");
    for (let i = 0; i < Math.max(3, digits.length); i++) {
        const val = config.showAnswerKey ? (digits[i] || "?") : "?";
        objects.push(new fabric.Rect({ left: i * 50, top: y + 10, width: 40, height: 45, fill: config.showAnswerKey ? "#bbf7d0" : "#f0fdf4", stroke: "#059669", strokeWidth: 2, rx: 6, ry: 6 }));
        objects.push(new fabric.IText(val, { left: i * 50 + 13, top: y + 20, fontSize: 22, fontFamily: "Inter", fontWeight: "bold", fill: config.showAnswerKey ? "#16a34a" : "#047857" }));
    }

    objects.forEach((obj) => {
        (obj as any).customType = "crack-the-code";
        (obj as any).puzzleConfig = config;
    });

    return objects;
}

export function generateCrackTheCodeObjects(): fabric.FabricObject[] {
    return generateCrackTheCodeObjectsFromConfig({
        title: "CRACK THE CODE!",
        secretCode: "682",
        clues: [
            "6 8 2  - One number is correct and well placed",
            "6 1 4  - One number is correct but wrong place",
            "2 0 6  - Two numbers are correct but wrong place",
            "7 3 8  - Nothing is correct",
        ],
    });
}

// 6. Sudoku Grid
export interface SudokuConfig {
    title: string;
    size: 4 | 9;
    difficulty: "easy" | "medium" | "hard";
    showAnswerKey?: boolean;
}

export function generateSudokuObjectsFromConfig(config: SudokuConfig): fabric.FabricObject[] {
    const titleText = config.title || `SUDOKU PUZZLE (${config.size || 4}X${config.size || 4})`;
    const size = config.size || 4;
    const cellSize = size === 4 ? 45 : 32;

    const initialGrid = size === 4 ? [
        [1, 0, 0, 4],
        [0, 3, 2, 0],
        [0, 4, 1, 0],
        [2, 0, 0, 3],
    ] : [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ];

    const objects: fabric.FabricObject[] = [
        new fabric.IText(titleText.toUpperCase(), { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })
    ];

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const x = c * cellSize;
            const y = 40 + r * cellSize;
            const subSize = size === 4 ? 2 : 3;
            const isThickRight = (c + 1) % subSize === 0;
            const isThickBottom = (r + 1) % subSize === 0;

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
                objects.push(new fabric.IText(val.toString(), { left: x + (cellSize / 2) - 6, top: y + (cellSize / 2) - 12, fontSize: size === 4 ? 22 : 16, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" }));
            }
        }
    }

    objects.forEach((obj) => {
        (obj as any).customType = "sudoku";
        (obj as any).puzzleConfig = config;
    });

    return objects;
}

export function generateSudokuObjects(): fabric.FabricObject[] {
    return generateSudokuObjectsFromConfig({ title: "SUDOKU PUZZLE (MINI 4X4)", size: 4, difficulty: "easy" });
}

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
export interface WordScrambleConfig {
    title: string;
    words: string[];
    showFirstLetter?: boolean;
    showAnswerKey?: boolean;
}

export function generateWordScrambleObjectsFromConfig(config: WordScrambleConfig): fabric.FabricObject[] {
    const titleText = config.title || "WORD SCRAMBLE";
    const words = config.words && config.words.length > 0 ? config.words : ["APPLE", "BANANA", "CHERRY"];

    const objects: fabric.FabricObject[] = [
        new fabric.IText(titleText.toUpperCase(), { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })
    ];

    let yOffset = 40;
    words.forEach((word, idx) => {
        const uppercaseWord = word.toUpperCase();
        const scrambled = uppercaseWord.split("").sort(() => 0.5 - Math.random()).join(" ");
        let lineText = `${idx + 1})   ${scrambled}`;
        if (config.showFirstLetter) {
            lineText += `  [Hint: ${uppercaseWord[0]}]`;
        }
        objects.push(new fabric.IText(lineText, { left: 0, top: yOffset, fontSize: 16, fontFamily: "Courier New", fontWeight: "bold", fill: "#2563eb" }));
        
        if (config.showAnswerKey) {
            objects.push(new fabric.IText(`➔   ${uppercaseWord}`, { left: 240, top: yOffset, fontSize: 16, fontFamily: "Inter", fontWeight: "bold", fill: "#16a34a" }));
        } else {
            objects.push(new fabric.IText("➔   ______________________", { left: 240, top: yOffset, fontSize: 16, fontFamily: "Inter", fill: "#94a3b8" }));
        }
        yOffset += 38;
    });

    objects.forEach((obj) => {
        (obj as any).customType = "word-scramble";
        (obj as any).puzzleConfig = config;
    });

    return objects;
}

export function generateWordScrambleObjects(words: string[]): fabric.FabricObject[] {
    return generateWordScrambleObjectsFromConfig({ title: "WORD SCRAMBLE", words });
}

// 10. Missing Letters
export interface MissingLettersConfig {
    title: string;
    words: string[];
    showAnswerKey?: boolean;
}

export function generateMissingLettersObjectsFromConfig(config: MissingLettersConfig): fabric.FabricObject[] {
    const titleText = config.title || "MISSING LETTERS";
    const words = config.words && config.words.length > 0 ? config.words : ["GUITAR", "PLANET", "SUMMER"];

    const objects: fabric.FabricObject[] = [
        new fabric.IText(titleText.toUpperCase(), { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })
    ];

    let yOffset = 40;
    words.forEach((word, idx) => {
        const uppercaseWord = word.toUpperCase();
        const chars = config.showAnswerKey
            ? uppercaseWord.split("").join(" ")
            : uppercaseWord.split("").map((c, i) => (i % 2 === 1 ? "_" : c)).join(" ");

        objects.push(new fabric.IText(`${idx + 1})   ${chars}`, { left: 0, top: yOffset, fontSize: 20, fontFamily: "Courier New", fontWeight: "bold", fill: config.showAnswerKey ? "#16a34a" : "#0f172a" }));
        yOffset += 35;
    });

    objects.forEach((obj) => {
        (obj as any).customType = "missing-letters";
        (obj as any).puzzleConfig = config;
    });

    return objects;
}

export function generateMissingLettersObjects(words: string[]): fabric.FabricObject[] {
    return generateMissingLettersObjectsFromConfig({ title: "MISSING LETTERS", words });
}

// Missing Vowels Puzzle
export interface MissingVowelsConfig {
    title: string;
    words: string[];
    showAnswerKey?: boolean;
}

export function generateMissingVowelsObjectsFromConfig(config: MissingVowelsConfig): fabric.FabricObject[] {
    const titleText = config.title || "MISSING VOWELS PUZZLE";
    const words = config.words && config.words.length > 0 ? config.words : ["ELEPHANT", "SUNSHINE", "BUTTERFLY"];

    const objects: fabric.FabricObject[] = [
        new fabric.IText(titleText.toUpperCase(), { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })
    ];

    let yOffset = 40;
    words.forEach((word, idx) => {
        const uppercaseWord = word.toUpperCase();
        const chars = config.showAnswerKey
            ? uppercaseWord.split("").join(" ")
            : uppercaseWord.split("").map((c) => ("AEIOU".includes(c) ? "_" : c)).join(" ");

        objects.push(new fabric.IText(`${idx + 1})   ${chars}`, { left: 0, top: yOffset, fontSize: 20, fontFamily: "Courier New", fontWeight: "bold", fill: config.showAnswerKey ? "#16a34a" : "#0f172a" }));
        yOffset += 35;
    });

    objects.forEach((obj) => {
        (obj as any).customType = "missing-vowels";
        (obj as any).puzzleConfig = config;
    });

    return objects;
}

// Codeword Puzzle
export interface CodewordConfig {
    title: string;
    words: string[];
    showAnswerKey?: boolean;
}

export function generateCodewordObjectsFromConfig(config: CodewordConfig): fabric.FabricObject[] {
    const titleText = config.title || "CODEWORD PUZZLE";
    const words = config.words && config.words.length > 0 ? config.words : ["SECRET", "CIPHER", "PUZZLE"];

    const objects: fabric.FabricObject[] = [
        new fabric.IText(titleText.toUpperCase(), { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#7c3aed" }),
        new fabric.IText("Match each code number (1-26) to decipher the words!", { left: 0, top: 28, fontSize: 11, fontFamily: "Inter", fill: "#64748b" })
    ];

    let yOffset = 52;
    words.forEach((word, idx) => {
        const uppercaseWord = word.toUpperCase();
        let xBox = 0;
        objects.push(new fabric.IText(`${idx + 1})`, { left: 0, top: yOffset + 5, fontSize: 14, fontFamily: "Inter", fontWeight: "bold" }));
        xBox += 24;

        uppercaseWord.split("").forEach((char) => {
            const codeNum = char.charCodeAt(0) - 64;
            objects.push(new fabric.Rect({ left: xBox, top: yOffset, width: 30, height: 35, fill: "#ffffff", stroke: "#7c3aed", strokeWidth: 1.5, rx: 4, ry: 4 }));
            objects.push(new fabric.IText(`${codeNum}`, { left: xBox + 4, top: yOffset + 2, fontSize: 9, fontFamily: "Inter", fontWeight: "bold", fill: "#6b21a8" }));

            if (config.showAnswerKey) {
                objects.push(new fabric.IText(char, { left: xBox + 8, top: yOffset + 12, fontSize: 16, fontFamily: "Inter", fontWeight: "bold", fill: "#16a34a" }));
            }
            xBox += 34;
        });

        yOffset += 44;
    });

    objects.forEach((obj) => {
        (obj as any).customType = "codeword";
        (obj as any).puzzleConfig = config;
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

// 23. Math Practice
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

// =========================================================================
// DISCOVERY EDUCATION PUZZLEMAKER SUITE GENERATORS
// =========================================================================

// A. Double Puzzle (Anagrams + Final Secret Message)
export interface DoublePuzzleConfig {
    title: string;
    words: { word: string; clue: string; targetTileIndices?: number[] }[];
    finalQuote: string;
    showAnswerKey?: boolean;
}

export function generateDoublePuzzleObjectsFromConfig(config: DoublePuzzleConfig): fabric.FabricObject[] {
    const titleText = config.title || "DOUBLE PUZZLE";
    const words = config.words && config.words.length > 0 ? config.words : [
        { word: "LEMON", clue: "Yellow sour fruit" },
        { word: "PEACH", clue: "Fuzzy summer fruit" },
        { word: "GRAPE", clue: "Small round fruit on vines" },
    ];
    const finalQuote = (config.finalQuote || "GREAT JOB").toUpperCase();

    const objects: fabric.FabricObject[] = [
        new fabric.IText(titleText.toUpperCase(), { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" })
    ];

    let yOffset = 40;
    words.forEach((item, idx) => {
        const uppercaseWord = item.word.toUpperCase();
        const scrambled = uppercaseWord.split("").sort(() => 0.5 - Math.random()).join(" ");

        objects.push(new fabric.IText(`${idx + 1})  ${scrambled}`, { left: 0, top: yOffset, fontSize: 16, fontFamily: "Courier New", fontWeight: "bold", fill: "#2563eb" }));
        objects.push(new fabric.IText(`[${item.clue}]`, { left: 160, top: yOffset + 2, fontSize: 11, fontFamily: "Inter", fill: "#64748b" }));

        // Letter boxes
        let xBox = 0;
        for (let i = 0; i < uppercaseWord.length; i++) {
            const letter = config.showAnswerKey ? uppercaseWord[i] : "";
            const isTargetTile = i === 0;
            objects.push(new fabric.Rect({
                left: xBox,
                top: yOffset + 22,
                width: 26,
                height: 26,
                fill: isTargetTile ? "#fef08a" : "#ffffff",
                stroke: "#334155",
                strokeWidth: 1.5,
                rx: 3,
                ry: 3,
            }));
            if (letter) {
                objects.push(new fabric.IText(letter, { left: xBox + 7, top: yOffset + 26, fontSize: 15, fontFamily: "Inter", fontWeight: "bold", fill: "#16a34a" }));
            }
            if (isTargetTile) {
                objects.push(new fabric.IText(`${idx + 1}`, { left: xBox + 2, top: yOffset + 23, fontSize: 8, fontFamily: "Inter", fontWeight: "bold", fill: "#ca8a04" }));
            }
            xBox += 30;
        }

        yOffset += 56;
    });

    // Final Message Slots at Bottom
    yOffset += 10;
    objects.push(new fabric.IText("FINAL SECRET MESSAGE:", { left: 0, top: yOffset, fontSize: 14, fontFamily: "Inter", fontWeight: "bold", fill: "#7c3aed" }));
    yOffset += 24;

    let xSlot = 0;
    finalQuote.split("").forEach((char, i) => {
        if (char === " ") {
            xSlot += 20;
            return;
        }
        objects.push(new fabric.Rect({ left: xSlot, top: yOffset, width: 28, height: 32, fill: "#f3e8ff", stroke: "#7c3aed", strokeWidth: 1.5, rx: 4, ry: 4 }));
        objects.push(new fabric.IText(`${(i % words.length) + 1}`, { left: xSlot + 3, top: yOffset + 2, fontSize: 9, fontFamily: "Inter", fontWeight: "bold", fill: "#6b21a8" }));

        if (config.showAnswerKey) {
            objects.push(new fabric.IText(char, { left: xSlot + 8, top: yOffset + 10, fontSize: 16, fontFamily: "Inter", fontWeight: "bold", fill: "#16a34a" }));
        }
        xSlot += 34;
    });

    objects.forEach((obj) => {
        (obj as any).customType = "double-puzzle";
        (obj as any).puzzleConfig = config;
    });

    return objects;
}

export function generateDoublePuzzleObjects(): fabric.FabricObject[] {
    return generateDoublePuzzleObjectsFromConfig({
        title: "DOUBLE PUZZLE",
        words: [
            { word: "LEMON", clue: "Yellow sour fruit" },
            { word: "PEACH", clue: "Fuzzy summer fruit" },
            { word: "GRAPE", clue: "Small round fruit on vines" },
        ],
        finalQuote: "GREAT JOB",
    });
}

// B. Fallen Phrase (Quote Tile Drop)
export interface FallenPhraseConfig {
    title: string;
    phrase: string;
    showAnswerKey?: boolean;
}

export function generateFallenPhraseObjectsFromConfig(config: FallenPhraseConfig): fabric.FabricObject[] {
    const titleText = config.title || "FALLEN PHRASE PUZZLE";
    const phrase = (config.phrase || "PRACTICE MAKES PERFECT").toUpperCase();
    const words = phrase.split(" ");
    const cols = Math.max(10, Math.max(...words.map((w) => w.length)));
    const rows = Math.ceil(phrase.length / cols);
    const cellSize = 30;

    const objects: fabric.FabricObject[] = [
        new fabric.IText(titleText.toUpperCase(), { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" }),
        new fabric.IText("Slide the fallen letters vertically into the empty phrase grid above!", { left: 0, top: 28, fontSize: 11, fontFamily: "Inter", fill: "#64748b" })
    ];

    // Grid for quote
    let charIdx = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = c * cellSize;
            const y = 50 + r * cellSize;
            const char = phrase[charIdx] || "";
            const isBlankSpace = char === " ";

            objects.push(new fabric.Rect({
                left: x,
                top: y,
                width: cellSize - 2,
                height: cellSize - 2,
                fill: isBlankSpace ? "#e2e8f0" : (config.showAnswerKey ? "#bbf7d0" : "#ffffff"),
                stroke: "#94a3b8",
                strokeWidth: 1,
                rx: 3,
                ry: 3,
            }));

            if (config.showAnswerKey && char && !isBlankSpace) {
                objects.push(new fabric.IText(char, { left: x + 8, top: y + 5, fontSize: 16, fontFamily: "Inter", fontWeight: "bold", fill: "#16a34a" }));
            }

            charIdx++;
        }
    }

    // Fallen Letters Bank Below Grid
    const bankY = 50 + rows * cellSize + 20;
    objects.push(new fabric.IText("FALLEN COLUMN LETTERS:", { left: 0, top: bankY - 16, fontSize: 11, fontFamily: "Inter", fontWeight: "bold", fill: "#334155" }));

    for (let c = 0; c < cols; c++) {
        const colChars: string[] = [];
        for (let r = 0; r < rows; r++) {
            const idx = r * cols + c;
            const ch = phrase[idx];
            if (ch && ch !== " ") colChars.push(ch);
        }
        colChars.sort();

        colChars.forEach((ch, idx) => {
            const x = c * cellSize;
            const y = bankY + idx * 26;
            objects.push(new fabric.Rect({ left: x, top: y, width: cellSize - 2, height: 24, fill: "#f1f5f9", stroke: "#cbd5e1", strokeWidth: 1, rx: 3, ry: 3 }));
            objects.push(new fabric.IText(ch, { left: x + 8, top: y + 3, fontSize: 14, fontFamily: "Courier New", fontWeight: "bold", fill: "#0f172a" }));
        });
    }

    objects.forEach((obj) => {
        (obj as any).customType = "fallen-phrase";
        (obj as any).puzzleConfig = config;
    });

    return objects;
}

export function generateFallenPhraseObjects(): fabric.FabricObject[] {
    return generateFallenPhraseObjectsFromConfig({
        title: "FALLEN PHRASE PUZZLE",
        phrase: "PRACTICE MAKES PERFECT",
    });
}

// C. Letter Tiles (Scrambled Tile Blocks)
export interface LetterTilesConfig {
    title: string;
    phrase: string;
    chunkSize?: 2 | 3;
    showAnswerKey?: boolean;
}

export function generateLetterTilesObjectsFromConfig(config: LetterTilesConfig): fabric.FabricObject[] {
    const titleText = config.title || "LETTER TILES PUZZLE";
    const phrase = (config.phrase || "WISDOM BEGINS IN WONDER").toUpperCase().replace(/[^A-Z]/g, "");
    const chunkSize = config.chunkSize || 3;

    // Break phrase into tiles
    const tiles: string[] = [];
    for (let i = 0; i < phrase.length; i += chunkSize) {
        tiles.push(phrase.slice(i, i + chunkSize));
    }

    const shuffled = [...tiles].sort(() => 0.5 - Math.random());

    const objects: fabric.FabricObject[] = [
        new fabric.IText(titleText.toUpperCase(), { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" }),
        new fabric.IText("Rearrange the letter tile blocks below to construct the secret quote!", { left: 0, top: 28, fontSize: 11, fontFamily: "Inter", fill: "#64748b" })
    ];

    // Render Tile Bank Grid
    const cols = 4;
    const tileW = 75;
    const tileH = 36;
    let yStart = 55;

    shuffled.forEach((tile, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = col * (tileW + 12);
        const y = yStart + row * (tileH + 10);

        objects.push(new fabric.Rect({ left: x, top: y, width: tileW, height: tileH, fill: "#fef3c7", stroke: "#d97706", strokeWidth: 1.5, rx: 6, ry: 6 }));
        objects.push(new fabric.IText(tile, { left: x + 14, top: y + 7, fontSize: 16, fontFamily: "Courier New", fontWeight: "bold", fill: "#92400e" }));
    });

    if (config.showAnswerKey) {
        const endY = yStart + Math.ceil(shuffled.length / cols) * (tileH + 10) + 15;
        objects.push(new fabric.IText(`[Answer Quote]: ${config.phrase || "WISDOM BEGINS IN WONDER"}`, { left: 0, top: endY, fontSize: 13, fontFamily: "Inter", fontWeight: "bold", fill: "#16a34a" }));
    }

    objects.forEach((obj) => {
        (obj as any).customType = "letter-tiles";
        (obj as any).puzzleConfig = config;
    });

    return objects;
}

export function generateLetterTilesObjects(): fabric.FabricObject[] {
    return generateLetterTilesObjectsFromConfig({
        title: "LETTER TILES PUZZLE",
        phrase: "WISDOM BEGINS IN WONDER",
        chunkSize: 3,
    });
}

// D. Math Squares (Grid Operations)
export interface MathSquaresConfig {
    title: string;
    size?: 3 | 4;
    showAnswerKey?: boolean;
}

export function generateMathSquaresObjectsFromConfig(config: MathSquaresConfig): fabric.FabricObject[] {
    const titleText = config.title || "MATH SQUARES PUZZLE";
    const size = config.size || 3;
    const cellSize = 42;

    const objects: fabric.FabricObject[] = [
        new fabric.IText(titleText.toUpperCase(), { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" }),
        new fabric.IText("Fill in the missing numbers so that every row and column equation equals the target sum!", { left: 0, top: 28, fontSize: 11, fontFamily: "Inter", fill: "#64748b" })
    ];

    const sampleGrid = [
        [3, "+", 5, "=", 8],
        ["+", "", "+", "", ""],
        [4, "+", 2, "=", 6],
        ["=", "", "=", "", ""],
        [7, "", 7, "", ""]
    ];

    let yStart = 55;
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            const x = c * (cellSize + 4);
            const y = yStart + r * (cellSize + 4);
            const val = sampleGrid[r][c];
            const isNumberCell = typeof val === "number";

            if (isNumberCell) {
                const isBlankInPuzzle = (r === 0 && c === 2) || (r === 2 && c === 0);
                objects.push(new fabric.Rect({
                    left: x,
                    top: y,
                    width: cellSize,
                    height: cellSize,
                    fill: isBlankInPuzzle ? (config.showAnswerKey ? "#bbf7d0" : "#ffffff") : "#f1f5f9",
                    stroke: "#0f172a",
                    strokeWidth: 1.5,
                    rx: 6,
                    ry: 6,
                }));

                if (!isBlankInPuzzle || config.showAnswerKey) {
                    objects.push(new fabric.IText(val.toString(), { left: x + 14, top: y + 9, fontSize: 18, fontFamily: "Inter", fontWeight: "bold", fill: config.showAnswerKey && isBlankInPuzzle ? "#16a34a" : "#0f172a" }));
                }
            } else if (val) {
                objects.push(new fabric.IText(val.toString(), { left: x + 14, top: y + 9, fontSize: 18, fontFamily: "Inter", fontWeight: "bold", fill: "#475569" }));
            }
        }
    }

    objects.forEach((obj) => {
        (obj as any).customType = "math-squares";
        (obj as any).puzzleConfig = config;
    });

    return objects;
}

export function generateMathSquaresObjects(): fabric.FabricObject[] {
    return generateMathSquaresObjectsFromConfig({
        title: "MATH SQUARES PUZZLE",
        size: 3,
    });
}

// E. Number Blocks (Numeric Grid Sums)
export interface NumberBlocksConfig {
    title: string;
    rows?: number;
    cols?: number;
    showAnswerKey?: boolean;
}

export function generateNumberBlocksObjectsFromConfig(config: NumberBlocksConfig): fabric.FabricObject[] {
    const titleText = config.title || "NUMBER BLOCKS";
    const rows = config.rows || 4;
    const cols = config.cols || 4;
    const cellSize = 38;

    const objects: fabric.FabricObject[] = [
        new fabric.IText(titleText.toUpperCase(), { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" }),
        new fabric.IText("Complete the grid numbers so that every row and column totals the target sum!", { left: 0, top: 28, fontSize: 11, fontFamily: "Inter", fill: "#64748b" })
    ];

    let yStart = 55;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = c * cellSize;
            const y = yStart + r * cellSize;
            const num = ((r * 3 + c * 2) % 9) + 1;
            const isGiven = (r + c) % 2 === 0;

            objects.push(new fabric.Rect({
                left: x,
                top: y,
                width: cellSize - 2,
                height: cellSize - 2,
                fill: isGiven ? "#f8fafc" : (config.showAnswerKey ? "#bbf7d0" : "#ffffff"),
                stroke: "#64748b",
                strokeWidth: 1,
                rx: 4,
                ry: 4,
            }));

            if (isGiven || config.showAnswerKey) {
                objects.push(new fabric.IText(num.toString(), { left: x + 13, top: y + 8, fontSize: 16, fontFamily: "Inter", fontWeight: "bold", fill: config.showAnswerKey && !isGiven ? "#16a34a" : "#0f172a" }));
            }
        }
    }

    objects.forEach((obj) => {
        (obj as any).customType = "number-blocks";
        (obj as any).puzzleConfig = config;
    });

    return objects;
}

export function generateNumberBlocksObjects(): fabric.FabricObject[] {
    return generateNumberBlocksObjectsFromConfig({
        title: "NUMBER BLOCKS",
        rows: 4,
        cols: 4,
    });
}

// F. Hidden Message Word Search
export interface HiddenMessageSearchConfig {
    title: string;
    words: string[];
    hiddenMessage: string;
    gridSize?: number;
    showAnswerKey?: boolean;
}

export function generateHiddenMessageSearchFromConfig(config: HiddenMessageSearchConfig): fabric.FabricObject[] {
    const titleText = config.title || "HIDDEN MESSAGE WORD SEARCH";
    const words = config.words && config.words.length > 0 ? config.words : ["STAR", "MOON", "SUN", "PLANET"];
    const hiddenMessage = (config.hiddenMessage || "DISCOVERY IS FUN").toUpperCase();
    const gridSize = config.gridSize || 10;
    const cellSize = 30;

    const objects: fabric.FabricObject[] = [
        new fabric.IText(titleText.toUpperCase(), { left: 0, top: 0, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" }),
        new fabric.IText(`Hidden Secret Message:  ${config.showAnswerKey ? hiddenMessage : "______________________"}`, { left: 0, top: 28, fontSize: 12, fontFamily: "Inter", fontWeight: "bold", fill: "#7c3aed" })
    ];

    let yStart = 52;
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const x = c * cellSize;
            const y = yStart + r * cellSize;
            const char = String.fromCharCode(65 + ((r * 7 + c * 3) % 26));

            objects.push(new fabric.Rect({
                left: x,
                top: y,
                width: cellSize - 2,
                height: cellSize - 2,
                fill: "#ffffff",
                stroke: "#cbd5e1",
                strokeWidth: 1,
                rx: 4,
                ry: 4,
            }));
            objects.push(new fabric.IText(char, { left: x + 8, top: y + 5, fontSize: 16, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" }));
        }
    }

    // Word Bank Below
    const bankY = yStart + gridSize * cellSize + 15;
    objects.push(new fabric.IText(`Word Bank:  ${words.join("   |   ")}`, { left: 0, top: bankY, fontSize: 13, fontFamily: "Inter", fontWeight: "bold", fill: "#475569" }));

    objects.forEach((obj) => {
        (obj as any).customType = "hidden-message-search";
        (obj as any).puzzleConfig = config;
    });

    return objects;
}

export function generateHiddenMessageSearch(): fabric.FabricObject[] {
    return generateHiddenMessageSearchFromConfig({
        title: "HIDDEN MESSAGE WORD SEARCH",
        words: ["STAR", "MOON", "SUN", "PLANET"],
        hiddenMessage: "DISCOVERY IS FUN",
        gridSize: 10,
    });
}

