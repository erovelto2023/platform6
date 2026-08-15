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
import {
    BoardGameConfig,
    BoardGameSpace,
    BOARD_GAME_THEMES,
    SPACE_TYPE_METADATA,
    computeBoardGameSpacePositions,
    generateDefaultSpacesForConfig,
    createDefaultBoardGameConfig,
} from "./board-game-engine";
import {
    ConnectDotsConfig,
    generateConnectDots,
    createDefaultConnectDotsConfig,
} from "./connect-dots-engine";

export const CUSTOM_PUZZLE_PROPS = [
    "customType",
    "puzzleComponent",
    "wordSearchConfig",
    "crosswordConfig",
    "connectDotsConfig",
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
    else if (customType === "connect-dots") obj.connectDotsConfig = config;
    else obj.puzzleConfig = config;

    const originalToObject = obj.toObject.bind(obj);
    obj.toObject = function (additionalProperties?: string[]) {
        const res = originalToObject(additionalProperties);
        res.customType = customType;
        res.puzzleComponent = componentType;
        if (customType === "word-search") res.wordSearchConfig = config;
        else if (customType === "crossword") res.crosswordConfig = config;
        else if (customType === "connect-dots") res.connectDotsConfig = config;
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

export function getCenterlineSvgPath(points: { x: number; y: number }[]): string {
    if (points.length < 2) return "";
    if (points.length === 2) {
        return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
    }

    const pathData: string[] = [`M ${points[0].x} ${points[0].y}`];
    for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        pathData.push(`Q ${points[i].x} ${points[i].y} ${xc} ${yc}`);
    }
    pathData.push(`L ${points[points.length - 1].x} ${points[points.length - 1].y}`);
    return pathData.join(" ");
}

export function createFreehandPath(
    points: { x: number; y: number; pressure?: number }[],
    options: { size?: number; color?: string; thinning?: number; smoothing?: number; style?: string; opacity?: number } = {}
): fabric.FabricObject | null {
    if (points.length < 2) return null;
    const inputPoints = points.map((p) => [p.x, p.y, p.pressure ?? 0.5]);

    let size = options.size ?? 8;
    let thinning = options.thinning ?? 0.5;
    let smoothing = options.smoothing ?? 0.5;
    let opacity = options.opacity ?? 1.0;
    const color = options.color ?? "#0f172a";

    if (options.style === "pencil") {
        thinning = 0.35;
        smoothing = 0.4;
        opacity = 0.85;
    } else if (options.style === "calligraphy" || options.style === "fountain_pen") {
        thinning = 0.75;
        smoothing = 0.6;
        size = size * 1.2;
    } else if (options.style === "marker") {
        thinning = -0.1;
        smoothing = 0.5;
        size = size * 1.4;
        opacity = 0.95;
    } else if (options.style === "highlighter") {
        thinning = -0.25;
        smoothing = 0.5;
        size = size * 2.2;
        opacity = 0.45;
    } else if (options.style === "crayon" || options.style === "chalk") {
        thinning = 0.2;
        smoothing = 0.3;
        opacity = 0.85;
    } else if (options.style === "watercolor" || options.style === "airbrush") {
        thinning = 0.4;
        smoothing = 0.6;
        size = size * 1.8;
        opacity = 0.6;
    } else if (options.style === "neon") {
        thinning = 0.1;
        opacity = 1.0;
    }

    if (options.style === "snake") {
        const centerSvg = getCenterlineSvgPath(points);
        if (!centerSvg) return null;

        const totalWidth = Math.max(options.size || 24, 12);
        const borderWidth = 2;
        const innerWidth = Math.max(totalWidth - (borderWidth * 2), 4);

        // White background mask creates clean space when lines overlap
        const maskPath = new fabric.Path(centerSvg, {
            fill: "transparent",
            stroke: "#ffffff",
            strokeWidth: totalWidth + 8,
            strokeLineCap: "butt",
            strokeLineJoin: "round",
        });

        // Outer dark border along open centerline
        const outerBorderPath = new fabric.Path(centerSvg, {
            fill: "transparent",
            stroke: options.color || "#000000",
            strokeWidth: totalWidth,
            strokeLineCap: "butt",
            strokeLineJoin: "round",
        });

        // Inner white corridor stroke erases center & leaves ends 100% OPEN!
        const innerWhitePath = new fabric.Path(centerSvg, {
            fill: "transparent",
            stroke: "#ffffff",
            strokeWidth: innerWidth,
            strokeLineCap: "butt",
            strokeLineJoin: "round",
        });

        const grp = new fabric.Group([maskPath, outerBorderPath, innerWhitePath], {
            opacity: opacity,
            selectable: true,
            subTargetCheck: true,
        });
        (grp as any).customType = "snake-path";
        return grp;
    }

    const stroke = getStroke(inputPoints, {
        size: size,
        thinning: thinning,
        smoothing: smoothing,
        streamline: 0.5,
    });
    const pathData = getSvgPathFromFreehandStroke(stroke);
    if (!pathData) return null;

    const pathObj = new fabric.Path(pathData, {
        fill: color,
        stroke: options.style === "neon" ? "#ffffff" : "none",
        strokeWidth: options.style === "neon" ? 1.5 : 0,
        opacity: opacity,
        selectable: true,
    });

    if (options.style === "neon") {
        pathObj.set({
            shadow: new fabric.Shadow({
                color: color,
                blur: 15,
                offsetX: 0,
                offsetY: 0,
            }),
        });
    }

    return pathObj;
}

// --- Dotted Educational Font Tracing Helper (opentype.js dynamic import) ---
export async function createTracingTextPath(
    text: string,
    fontUrl: string = "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-400-normal.ttf",
    options: { fontSize?: number; fill?: string; stroke?: string; strokeWidth?: number; dashArray?: number[] } = {}
): Promise<fabric.Path | null> {
    try {
        if (typeof window === "undefined") return null;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const opentypeModule = await import("opentype.js");
        const opentype = (opentypeModule as any).default || opentypeModule;

        let res = await fetch(fontUrl);
        if (!res.ok) {
            res = await fetch("https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-400-normal.ttf");
        }
        if (!res.ok) return null;

        const buffer = await res.arrayBuffer();
        const headerView = new Uint8Array(buffer.slice(0, 4));
        if (headerView[0] === 0x3C && headerView[1] === 0x21) {
            console.warn("Tracing font fetch returned HTML 404, falling back.");
            return null;
        }

        const font = opentype.parse(buffer);
        if (font.tables) {
            font.tables.gsub = null;
        }

        const fontSize = options.fontSize ?? 64;
        let opentypePath: any = null;
        try {
            opentypePath = font.getPath(text, 0, fontSize, fontSize);
        } catch (e) {
            console.warn("opentype.getPath error fallback:", e);
            return null;
        }

        if (!opentypePath) return null;
        const svgPathData = opentypePath.toPathData(2);

        if (!svgPathData) return null;

        return new fabric.Path(svgPathData, {
            fill: "transparent",
            stroke: options.stroke ?? "#475569",
            strokeWidth: options.strokeWidth ?? 1.2,
            strokeDashArray: options.dashArray ?? [4, 4],
            strokeLineCap: "round",
            strokeLineJoin: "round",
            objectCaching: false, // Crisp vector rendering
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

// Curated pastel palette for word search solution highlights (like the reference image)
const WORD_HIGHLIGHT_PALETTE = [
    "rgba(167, 139, 250, 0.45)",  // violet
    "rgba(251, 146, 60, 0.40)",   // orange
    "rgba(74, 222, 128, 0.40)",   // green
    "rgba(96, 165, 250, 0.45)",   // blue
    "rgba(251, 113, 133, 0.40)",  // pink
    "rgba(250, 204, 21, 0.40)",   // yellow
    "rgba(45, 212, 191, 0.40)",   // teal
    "rgba(192, 132, 252, 0.40)",  // purple
    "rgba(253, 164, 175, 0.40)",  // rose
    "rgba(134, 239, 172, 0.40)",  // emerald
    "rgba(147, 197, 253, 0.40)",  // sky
    "rgba(253, 186, 116, 0.40)",  // amber
    "rgba(110, 231, 183, 0.40)",  // mint
    "rgba(196, 181, 253, 0.40)",  // lavender
    "rgba(252, 165, 165, 0.40)",  // red-light
];

// Direction vectors used for highlight band positioning
const HIGHLIGHT_DIR_VECTORS: Record<string, [number, number]> = {
    H: [1, 0],
    HR: [-1, 0],
    V: [0, 1],
    VR: [0, -1],
    D_TL_BR: [1, 1],
    D_TR_BL: [-1, 1],
    D_BL_TR: [1, -1],
    D_BR_TL: [-1, -1],
};

export function generateWordSearchComponentGroups(config: WordSearchConfig): {
    titleGroup: fabric.FabricObject | null;
    gridGroup: fabric.FabricObject;
    bankGroup: fabric.FabricObject | null;
    bankHeader: fabric.FabricObject | null;
} {
    const placement = solveAndGenerateWordSearch(config);
    const { grid, solutionGrid, placedWords } = placement;

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

    // --- 2. LETTER GRID GROUP ---
    const gridObjs: fabric.FabricObject[] = [];
    const showSolution = config.answerKey.showSolution;

    // 2a. Cell backgrounds & borders (non-solution styling)
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = c * cellSize;
            const y = r * cellSize;

            // When showing solution, we draw highlight bands separately — cells get a subtle border only
            const bgFill = showSolution
                ? "transparent"
                : (config.appearance.cellBgColor !== "transparent" ? config.appearance.cellBgColor : "transparent");

            const bgStroke = showSolution
                ? "#e2e8f0"
                : (config.grid.cellStyle === "boxed" || config.grid.cellStyle === "rounded" || config.grid.cellStyle === "circle"
                    ? (config.appearance.gridBorderColor !== "transparent" ? config.appearance.gridBorderColor : "#cbd5e1")
                    : "transparent");

            const rx = config.grid.cellStyle === "circle" ? cellSize / 2 : config.grid.cellStyle === "rounded" ? 6 : 0;

            const cellRect = new fabric.Rect({
                left: x,
                top: y,
                width: cellSize,
                height: cellSize,
                fill: bgFill,
                stroke: bgStroke,
                strokeWidth: showSolution ? 0.5 : (config.appearance.gridBorderThickness || 1),
                rx: rx,
                ry: rx,
            });
            gridObjs.push(cellRect);
        }
    }

    // 2b. Solution highlight bands — per-word colored rounded rectangles
    if (showSolution && placedWords.length > 0) {
        placedWords.forEach((pw, wordIdx) => {
            const color = WORD_HIGHLIGHT_PALETTE[wordIdx % WORD_HIGHLIGHT_PALETTE.length];
            const vec = HIGHLIGHT_DIR_VECTORS[pw.dir];
            if (!vec) return;
            const [dx, dy] = vec;
            const wordLen = pw.word.toUpperCase().replace(/[^A-Z0-9]/g, "").length;

            // Compute start and end cell centers
            const startCx = pw.startX * cellSize + cellSize / 2;
            const startCy = pw.startY * cellSize + cellSize / 2;
            const endCx = (pw.startX + (wordLen - 1) * dx) * cellSize + cellSize / 2;
            const endCy = (pw.startY + (wordLen - 1) * dy) * cellSize + cellSize / 2;

            // Band center, dimensions, and rotation angle
            const bandCx = (startCx + endCx) / 2;
            const bandCy = (startCy + endCy) / 2;
            const bandLength = Math.sqrt((endCx - startCx) ** 2 + (endCy - startCy) ** 2) + cellSize * 0.85;
            const bandWidth = cellSize * 0.78;
            const angleDeg = Math.atan2(endCy - startCy, endCx - startCx) * (180 / Math.PI);

            const highlightBand = new fabric.Rect({
                left: bandCx,
                top: bandCy,
                originX: "center",
                originY: "center",
                width: bandLength,
                height: bandWidth,
                fill: color,
                rx: bandWidth / 2,
                ry: bandWidth / 2,
                angle: angleDeg,
                strokeWidth: 0,
            });
            gridObjs.push(highlightBand);
        });
    }

    // 2c. Letters on top
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = c * cellSize;
            const y = r * cellSize;
            const letter = grid[r][c];
            const isSolution = solutionGrid[r][c];

            // In solution mode: dim non-solution letters so highlighted words pop
            const letterColor = showSolution
                ? (isSolution ? "#0f172a" : "#94a3b8")
                : (config.appearance.gridLetterColor || "#0f172a");
            const letterWeight = showSolution
                ? (isSolution ? "800" : "500")
                : "bold";

            const charObj = new fabric.IText(letter, {
                left: x + (cellSize / 2),
                top: y + (cellSize / 2),
                originX: "center",
                originY: "center",
                fontSize: config.appearance.gridFontSize || (cols >= 15 ? 13 : 15),
                fontFamily: config.appearance.gridFont || "Inter",
                fontWeight: letterWeight,
                fill: letterColor,
            });
            gridObjs.push(charObj);
        }
    }

    const gridGroup = new fabric.Group(gridObjs, { left: 60, top: 130, subTargetCheck: true });

    // --- 3. WORD BANK GROUP (CLEAN & UNBOXED BY DEFAULT) ---
    let bankGroup: fabric.FabricObject | null = null;
    let bankHeader: fabric.FabricObject | null = null;

    if (config.wordBank.layout !== "hidden") {
        const bankObjs: fabric.FabricObject[] = [];

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
            const y = rowIdx * rowHeight;

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
        const bankTop = 140 + gridHeight + 30;
        bankGroup = new fabric.Group(bankObjs, { left: 60, top: bankTop, subTargetCheck: true });

        // Separate header centered over word list
        const bankWidth = colsCount * colWidth;
        bankHeader = new fabric.IText("FIND THE WORDS:", {
            left: 60 + (bankWidth / 2),
            top: bankTop - 20,
            fontSize: 11,
            fontFamily: config.appearance.wordBankFont || "Inter",
            fontWeight: "bold",
            fill: "#334155",
            originX: "center",
        });
    }

    return { titleGroup, gridGroup, bankGroup, bankHeader };
}

// Single-Group Backward Compatibility Builder
export function generateAdvancedWordSearchObjects(config: WordSearchConfig): fabric.FabricObject[] {
    const { titleGroup, gridGroup, bankGroup, bankHeader } = generateWordSearchComponentGroups(config);
    const objects: fabric.FabricObject[] = [];
    if (titleGroup) objects.push(titleGroup);
    if (gridGroup) objects.push(gridGroup);
    if (bankHeader) objects.push(bankHeader);
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
            const cell = grid[r]?.[c];

            if (!cell || cell.isBlack) {
                // Black cell or undefined cell
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
                    fill: config.appearance.cellBgColor || "#ffffff",
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
                        fontSize: Math.max(12, cellSize * 0.6),
                        fontFamily: config.appearance.gridFont || "Inter",
                        fontWeight: "bold",
                        fill: config.answerKey.showSolution ? (config.answerKey.solutionColor || "#14532d") : (config.appearance.gridLetterColor || "#0f172a"),
                        textAlign: "center",
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
        ? Math.max(180, Math.floor((cols * cellSize) / 3))
        : Math.max(280, Math.floor((cols * cellSize) / 2));

    const clueFontSize = config.clues.fontSize || 11;
    const clueFontFamily = config.clues.fontFamily || "Inter";
    const clueColor = config.clues.color || "#334155";
    const itemSpacing = config.clues.spacing || 28;

    // Helper to format clue string with length hint if enabled
    const formatClueText = (entry: any) => {
        let text = `${entry.number}. ${entry.clue}`;
        if (config.assistance?.showWordLength) {
            text += ` (${entry.word.length})`;
        }
        return text;
    };

    // Helper to create wrapped text for clues
    const createWrappedClueText = (text: string, x: number, y: number) => {
        const textObj = new fabric.Textbox(text, {
            left: x,
            top: y,
            fontSize: clueFontSize,
            fontFamily: clueFontFamily,
            fill: clueColor,
            width: colWidth,
            splitByGrapheme: true,
            lineHeight: 1.4,
            textAlign: 'left',
        });
        return textObj;
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
            const clueItem = createWrappedClueText(formatClueText(entry), 0, currentY);
            clueObjs.push(clueItem);
            currentY += clueItem.height || itemSpacing;
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
            const clueItem = createWrappedClueText(formatClueText(entry), 0, currentY);
            clueObjs.push(clueItem);
            currentY += clueItem.height || itemSpacing;
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
            const clueItem = createWrappedClueText(formatClueText(entry), 0, acrossY);
            clueObjs.push(clueItem);
            acrossY += clueItem.height || itemSpacing;
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
            const clueItem = createWrappedClueText(formatClueText(entry), colWidth + 20, downY);
            clueObjs.push(clueItem);
            downY += clueItem.height || itemSpacing;
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

// =========================================================================
// K-12 EDUCATIONAL TEMPLATES & DECORATIVE GRAPHICS GENERATORS
// =========================================================================

// 1. Primary K-3 Handwriting Lined Paper (Top solid, Middle dashed, Bottom solid)
export function createPrimaryHandwritingLinedPaperGroup(rowsCount: number = 6): fabric.Group {
    const objs: fabric.FabricObject[] = [];
    const width = 500;
    const rowHeight = 50;

    for (let i = 0; i < rowsCount; i++) {
        const y = i * (rowHeight + 24);

        // Top Line (Solid Blue)
        objs.push(new fabric.Line([0, y, width, y], { stroke: "#3b82f6", strokeWidth: 1.5 }));
        // Center Dashed Guideline (Red/Blue Dashed)
        objs.push(new fabric.Line([0, y + rowHeight / 2, width, y + rowHeight / 2], { stroke: "#ef4444", strokeWidth: 1, strokeDashArray: [6, 4] }));
        // Bottom Line (Solid Blue)
        objs.push(new fabric.Line([0, y + rowHeight, width, y + rowHeight], { stroke: "#3b82f6", strokeWidth: 1.5 }));
    }

    return new fabric.Group(objs, { left: 60, top: 100, subTargetCheck: true });
}

// 2. Math Graph Grid Paper Overlay (1/4" or 1/2")
export function createMathGridPaperGroup(gridType: "quarter" | "half" = "quarter"): fabric.Group {
    const objs: fabric.FabricObject[] = [];
    const cellSize = gridType === "half" ? 48 : 24;
    const cols = Math.floor(520 / cellSize);
    const rows = Math.floor(650 / cellSize);

    // Border Box
    objs.push(new fabric.Rect({
        left: 0,
        top: 0,
        width: cols * cellSize,
        height: rows * cellSize,
        fill: "#ffffff",
        stroke: "#0f172a",
        strokeWidth: 2,
    }));

    // Vertical Lines
    for (let c = 1; c < cols; c++) {
        const x = c * cellSize;
        objs.push(new fabric.Line([x, 0, x, rows * cellSize], { stroke: c % 4 === 0 ? "#94a3b8" : "#cbd5e1", strokeWidth: c % 4 === 0 ? 1 : 0.5 }));
    }

    // Horizontal Lines
    for (let r = 1; r < rows; r++) {
        const y = r * cellSize;
        objs.push(new fabric.Line([0, y, cols * cellSize, y], { stroke: r % 4 === 0 ? "#94a3b8" : "#cbd5e1", strokeWidth: r % 4 === 0 ? 1 : 0.5 }));
    }

    return new fabric.Group(objs, { left: 50, top: 80, subTargetCheck: true });
}

// 3. Spelling Test Template (Numbered rows with score box)
export function createSpellingTestGroup(wordCount: 10 | 15 | 20 = 10): fabric.Group {
    const objs: fabric.FabricObject[] = [];
    const width = 480;

    // Header Title
    objs.push(new fabric.IText("SPELLING TEST", { left: 0, top: 0, fontSize: 22, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" }));
    objs.push(new fabric.IText("Name: ______________________   Date: _________", { left: 0, top: 30, fontSize: 12, fontFamily: "Inter", fill: "#475569" }));

    // Score Box
    objs.push(new fabric.Rect({ left: 360, top: 0, width: 120, height: 45, fill: "#f8fafc", stroke: "#475569", strokeWidth: 1.5, rx: 6, ry: 6 }));
    objs.push(new fabric.IText("SCORE", { left: 398, top: 5, fontSize: 9, fontFamily: "Inter", fontWeight: "bold", fill: "#64748b" }));
    objs.push(new fabric.IText("___ / " + wordCount, { left: 392, top: 20, fontSize: 14, fontFamily: "Inter", fontWeight: "bold", fill: "#0f172a" }));

    // Numbered Lines
    const yStart = 65;
    const rowGap = wordCount === 20 ? 28 : wordCount === 15 ? 34 : 42;

    for (let i = 1; i <= wordCount; i++) {
        const y = yStart + (i - 1) * rowGap;
        objs.push(new fabric.IText(`${i}.`, { left: 0, top: y - 4, fontSize: 13, fontFamily: "Inter", fontWeight: "bold", fill: "#334155" }));
        objs.push(new fabric.Line([24, y + 16, width, y + 16], { stroke: "#94a3b8", strokeWidth: 1.2 }));
    }

    return new fabric.Group(objs, { left: 60, top: 60, subTargetCheck: true });
}

// 4. Flashcard / Game Card Cut Grid (4-card or 8-card)
export function createFlashcardGridGroup(cardsCount: 4 | 8 = 4): fabric.Group {
    const objs: fabric.FabricObject[] = [];
    const totalW = 500;
    const totalH = 640;

    const cols = 2;
    const rows = cardsCount === 8 ? 4 : 2;
    const cardW = totalW / cols;
    const cardH = totalH / rows;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = c * cardW;
            const y = r * cardH;

            // Cut border box
            objs.push(new fabric.Rect({
                left: x,
                top: y,
                width: cardW - 6,
                height: cardH - 6,
                fill: "#ffffff",
                stroke: "#94a3b8",
                strokeWidth: 1.5,
                strokeDashArray: [6, 4],
                rx: 8,
                ry: 8,
            }));

            // Scissors icon hint
            objs.push(new fabric.IText("✂ FLASHCARD " + (r * cols + c + 1), {
                left: x + 12,
                top: y + 12,
                fontSize: 10,
                fontFamily: "Inter",
                fontWeight: "bold",
                fill: "#94a3b8",
            }));
        }
    }

    return new fabric.Group(objs, { left: 50, top: 60, subTargetCheck: true });
}

// =========================================================================
// 16 ADVANCED LINE TOOLS GENERATOR
// =========================================================================

export function createLineToolObject(type: string): fabric.FabricObject {
    const defaultProps = {
        stroke: "#0f172a",
        strokeWidth: 2,
        fill: "transparent",
        selectable: true,
    };

    switch (type) {
        case "straight-line":
            return new fabric.Line([0, 0, 160, 0], defaultProps);

        case "polyline":
            return new fabric.Path("M 0 0 L 40 -30 L 80 30 L 120 -30 L 160 0", defaultProps);

        case "curve":
            return new fabric.Path("M 0 0 Q 80 -60 160 0", defaultProps);

        case "arc":
            return new fabric.Path("M 0 0 A 80 80 0 0 1 160 0", defaultProps);

        case "bezier-curve":
            return new fabric.Path("M 0 0 C 40 -70 120 70 160 0", defaultProps);

        case "freehand-line":
            return new fabric.Path("M 0 0 C 30 -20 50 20 80 -10 C 110 -40 130 30 160 0", {
                ...defaultProps,
                strokeLineCap: "round",
                strokeLineJoin: "round",
            });

        case "arrow": {
            const line = new fabric.Line([0, 0, 140, 0], defaultProps);
            const head = new fabric.Polygon(
                [
                    { x: 140, y: -6 },
                    { x: 154, y: 0 },
                    { x: 140, y: 6 },
                ],
                { fill: "#0f172a", stroke: "#0f172a", strokeWidth: 1 }
            );
            return new fabric.Group([line, head], { subTargetCheck: true });
        }

        case "double-arrow": {
            const line = new fabric.Line([14, 0, 140, 0], defaultProps);
            const headRight = new fabric.Polygon(
                [
                    { x: 140, y: -6 },
                    { x: 154, y: 0 },
                    { x: 140, y: 6 },
                ],
                { fill: "#0f172a", stroke: "#0f172a", strokeWidth: 1 }
            );
            const headLeft = new fabric.Polygon(
                [
                    { x: 14, y: -6 },
                    { x: 0, y: 0 },
                    { x: 14, y: 6 },
                ],
                { fill: "#0f172a", stroke: "#0f172a", strokeWidth: 1 }
            );
            return new fabric.Group([line, headLeft, headRight], { subTargetCheck: true });
        }

        case "elbow-connector":
            return new fabric.Path("M 0 0 L 0 60 L 140 60", defaultProps);

        case "curved-connector":
            return new fabric.Path("M 0 0 C 70 0 70 80 140 80", defaultProps);

        case "orthogonal-connector":
            return new fabric.Path("M 0 0 L 70 0 L 70 80 L 140 80", defaultProps);

        case "dashed-line":
            return new fabric.Line([0, 0, 160, 0], {
                ...defaultProps,
                strokeDashArray: [8, 6],
            });

        case "dotted-line":
            return new fabric.Line([0, 0, 160, 0], {
                ...defaultProps,
                strokeWidth: 3.5,
                strokeDashArray: [2, 6],
                strokeLineCap: "round",
            });

        case "zigzag":
            return new fabric.Path("M 0 0 L 15 -18 L 30 18 L 45 -18 L 60 18 L 75 -18 L 90 18 L 105 -18 L 120 18 L 135 -18 L 150 0", defaultProps);

        case "wave":
            return new fabric.Path("M 0 0 Q 20 -25 40 0 T 80 0 T 120 0 T 160 0", defaultProps);

        case "spiral":
            return new fabric.Path("M 50 50 m -10 0 a 10 10 0 1 0 20 0 a 20 20 0 1 0 -40 0 a 30 30 0 1 0 60 0 a 40 40 0 1 0 -80 0", defaultProps);

        case "snake-line": {
            const pathD = "M 0 0 C 40 -70 80 70 120 -70 C 160 70 200 -70 240 0";
            const maskPath = new fabric.Path(pathD, {
                fill: "transparent",
                stroke: "#ffffff",
                strokeWidth: 32,
                strokeLineCap: "butt",
                strokeLineJoin: "round",
            });
            const outerPath = new fabric.Path(pathD, {
                fill: "transparent",
                stroke: "#000000",
                strokeWidth: 24,
                strokeLineCap: "butt",
                strokeLineJoin: "round",
            });
            const innerPath = new fabric.Path(pathD, {
                fill: "transparent",
                stroke: "#ffffff",
                strokeWidth: 20,
                strokeLineCap: "butt",
                strokeLineJoin: "round",
            });
            const grp = new fabric.Group([maskPath, outerPath, innerPath], {
                selectable: true,
                subTargetCheck: true,
            });
            (grp as any).customType = "snake-line";
            return grp;
        }

        default:
            return new fabric.Line([0, 0, 160, 0], defaultProps);
    }
}

// 5-Point Star / Starburst Vector Polygon Generator
export function createStarPolygon(points: number = 5, outerRadius: number = 50, innerRadius: number = 22, options: any = {}): fabric.Polygon {
    const pts = [];
    const step = Math.PI / points;
    for (let i = 0; i < 2 * points; i++) {
        const rad = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = i * step - Math.PI / 2;
        pts.push({
            x: outerRadius + rad * Math.cos(angle),
            y: outerRadius + rad * Math.sin(angle),
        });
    }
    return new fabric.Polygon(pts, {
        fill: options.fill ?? "#fef08a",
        stroke: options.stroke ?? "#ca8a04",
        strokeWidth: options.strokeWidth ?? 2,
        strokeLineJoin: "round",
        selectable: true,
        ...options,
    });
}

// =========================================================================
// WICCA & SYMBOL VECTOR CONVERTER
// =========================================================================

export async function createSymbolVectorObject(symbol: {
    id: string;
    name: string;
    svgString?: string;
    pathData?: string;
    textSymbol?: string;
}): Promise<fabric.FabricObject> {
    if (symbol.pathData) {
        return new fabric.Path(symbol.pathData, {
            fill: "none",
            stroke: "#0f172a",
            strokeWidth: 3,
            strokeLineCap: "round",
            strokeLineJoin: "round",
            selectable: true,
        });
    }

    if (symbol.svgString) {
        let rawSvg = symbol.svgString;
        if (!rawSvg.includes("xmlns")) {
            rawSvg = rawSvg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
        }

        return new Promise((resolve) => {
            try {
                let resolved = false;
                const handleParsed = (results: any) => {
                    if (resolved) return;
                    resolved = true;
                    const objs = Array.isArray(results) ? results : (results?.objects || []);
                    const validObjs = objs.filter((o: any) => o != null);
                    if (validObjs.length > 0) {
                        const group = new fabric.Group(validObjs, {
                            left: 100,
                            top: 100,
                            selectable: true,
                            subTargetCheck: true,
                        });
                        resolve(group);
                    } else {
                        resolve(new fabric.Circle({ radius: 30, fill: "#f1f5f9", stroke: "#0f172a", strokeWidth: 2 }));
                    }
                };

                const res = fabric.loadSVGFromString(rawSvg, (results: any) => {
                    handleParsed(results);
                });

                if (res && typeof (res as any).then === "function") {
                    (res as any).then((parsed: any) => {
                        handleParsed(parsed);
                    }).catch(() => {
                        if (!resolved) {
                            resolved = true;
                            resolve(new fabric.Circle({ radius: 30, fill: "#f1f5f9", stroke: "#0f172a", strokeWidth: 2 }));
                        }
                    });
                }
            } catch {
                resolve(new fabric.Circle({ radius: 30, fill: "#f1f5f9", stroke: "#0f172a", strokeWidth: 2 }));
            }
        });
    }

    if (symbol.textSymbol) {
        return new fabric.IText(symbol.textSymbol, {
            fontSize: 72,
            fontFamily: "Segoe UI Symbol, Apple Color Emoji, Noto Color Emoji, sans-serif",
            fill: "#0f172a",
            selectable: true,
        });
    }

    return new fabric.Circle({ radius: 30, fill: "#f1f5f9", stroke: "#0f172a", strokeWidth: 2 });
}

// =========================================================================
// DYNAMIC DYNAMIC CUSTOM FONT LOADER (FontFace API)
// =========================================================================

export async function registerCustomFontFace(fontFamily: string, dataUrl: string): Promise<boolean> {
    try {
        if (typeof window === "undefined" || !("FontFace" in window)) return false;
        const font = new FontFace(fontFamily, `url(${dataUrl})`);
        await font.load();
        document.fonts.add(font);
        return true;
    } catch (err) {
        console.error("Failed to load custom font:", fontFamily, err);
        return false;
    }
}

export function handleGroupFabricObjects(canvas: fabric.Canvas): number {
    if (!canvas) return 0;
    const activeObj = canvas.getActiveObject();
    if (!activeObj) return 0;

    // 1. If user has an active multi-selection (Shift-click or drag-selected multiple items)
    if (activeObj.type === "activeSelection") {
        const selection = activeObj as fabric.ActiveSelection;
        const objects = [...selection.getObjects()];
        
        if (objects.length >= 2) {
            canvas.discardActiveObject();
            objects.forEach((obj) => canvas.remove(obj));

            const group = new fabric.Group(objects, {
                subTargetCheck: true,
                interactive: true,
            });

            canvas.add(group);
            canvas.setActiveObject(group);
            canvas.requestRenderAll();
            canvas.fire("object:modified");
            return objects.length;
        }
    }

    // 2. Smart Proximity & Overlap Grouping
    // If user clicked 1 object (e.g. text, shape, or background tile), find all overlapping objects under/over it!
    const targetRect = activeObj.getBoundingRect();
    const overlappingObjs = canvas.getObjects().filter((obj) => {
        if (obj === activeObj) return false;
        if ((obj as any).isGridLine || (obj as any).customType === "eraser-mask") return false;

        const r = obj.getBoundingRect();
        return !(
            r.left > targetRect.left + targetRect.width ||
            r.left + r.width < targetRect.left ||
            r.top > targetRect.top + targetRect.height ||
            r.top + r.height < targetRect.top
        );
    });

    if (overlappingObjs.length > 0) {
        const objectsToGroup = [activeObj, ...overlappingObjs];
        canvas.discardActiveObject();
        objectsToGroup.forEach((obj) => canvas.remove(obj));

        const group = new fabric.Group(objectsToGroup, {
            subTargetCheck: true,
            interactive: true,
        });

        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.requestRenderAll();
        canvas.fire("object:modified");
        return objectsToGroup.length;
    }

    return 0;
}

export function handleUngroupFabricGroup(group: any, canvas: fabric.Canvas): number {
    if (!group || !canvas) return 0;

    // Snake corridor tubes should stay connected as 1 single unified component!
    if (group.customType === "snake-corridor-path" || group.customType === "snake-path") {
        return -1;
    }

    // Board game patterns and pieces can be ungrouped
    const items = typeof group.getObjects === "function" ? [...group.getObjects()] : [...(group._objects || [])];
    if (items.length === 0) return 0;

    const matrix = group.calcTransformMatrix ? group.calcTransformMatrix() : [1, 0, 0, 1, group.left || 0, group.top || 0];

    canvas.discardActiveObject();
    canvas.remove(group);

    items.forEach((item: any) => {
        const pt = fabric.util.transformPoint(
            { x: item.left || 0, y: item.top || 0 },
            matrix
        );

        delete item.group;
        item.group = undefined;

        item.set>({
            left: pt.x,
            top: pt.y,
            scaleX: (item.scaleX || 1) * (group.scaleX || 1),
            scaleY: (item.scaleY || 1) * (group.scaleY || 1),
            angle: (item.angle || 0) + (group.angle || 0),
            selectable: true,
            evented: true,
        });

        item.setCoords();
        canvas.add(item);
    });

    canvas.requestRenderAll();
    canvas.fire("object:modified");
    return items.length;
}

/**
 * Parse the start and end points of a simple SVG path string.
 */
function getPathEndpoints(d: string): { start: { x: number; y: number }; end: { x: number; y: number } } {
    const tokens = d.trim().split(/[\s,]+/).filter(Boolean);
    let currentX = 0, currentY = 0;
    let startX = 0, startY = 0;
    let i = 0;
    let firstPoint = true;

    while (i < tokens.length) {
        const cmd = tokens[i];
        if (/^[MmLlCcQqTtSsAaZz]$/.test(cmd)) {
            i++;
            if (cmd === "M" || cmd === "m") {
                const x = parseFloat(tokens[i] || "0");
                const y = parseFloat(tokens[i + 1] || "0");
                i += 2;
                currentX = cmd === "M" ? x : currentX + x;
                currentY = cmd === "M" ? y : currentY + y;
                if (firstPoint) { startX = currentX; startY = currentY; firstPoint = false; }
            } else if (cmd === "L" || cmd === "l") {
                const x = parseFloat(tokens[i] || "0");
                const y = parseFloat(tokens[i + 1] || "0");
                i += 2;
                currentX = cmd === "L" ? x : currentX + x;
                currentY = cmd === "L" ? y : currentY + y;
            } else if (cmd === "C" || cmd === "c") {
                const ex = parseFloat(tokens[i + 4] || "0");
                const ey = parseFloat(tokens[i + 5] || "0");
                i += 6;
                currentX = cmd === "C" ? ex : currentX + ex;
                currentY = cmd === "C" ? ey : currentY + ey;
            } else if (cmd === "Q" || cmd === "q") {
                const ex = parseFloat(tokens[i + 2] || "0");
                const ey = parseFloat(tokens[i + 3] || "0");
                i += 4;
                currentX = cmd === "Q" ? ex : currentX + ex;
                currentY = cmd === "Q" ? ey : currentY + ey;
            } else {
                // Z or unknown
            }
        } else if (!isNaN(parseFloat(cmd))) {
            // Implicit lineto
            const x = parseFloat(tokens[i]);
            const y = parseFloat(tokens[i + 1] || "0");
            i += 2;
            currentX = x; currentY = y;
        } else {
            i++;
        }
    }

    return { start: { x: startX, y: startY }, end: { x: currentX, y: currentY } };
}

function _fuseDist(a: { x: number; y: number }, b: { x: number; y: number }): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * Fuse multiple path, group, or line objects into a single unified snake-path tube.
 * Chains segments by detecting nearest endpoint pairs and transforming local coords to absolute canvas space.
 */
export function fuseSnakePathSegments(
    groups: any[],
    canvas: fabric.Canvas,
    options: { width?: number; color?: string } = {}
): fabric.Group | null {
    if (!groups || groups.length < 2) return null;

    const candidateObjs = groups.filter((g) => {
        if (!g) return false;
        if (g.customType === "snake-path" || g.customType === "snake-corridor-path") return true;
        if (g.type === "path" || g.type === "group" || g.type === "line") return true;
        if (typeof g.getObjects === "function" && g.getObjects().length > 0) return true;
        return false;
    });

    if (candidateObjs.length < 2) return null;

    const segmentData: {
        d: string;
        start: { x: number; y: number };
        end: { x: number; y: number };
        strokeWidth: number;
        strokeColor: string;
    }[] = [];

    for (const obj of candidateObjs) {
        let pathObj: any = null;
        let parentMatrix = obj.calcTransformMatrix ? obj.calcTransformMatrix() : [1, 0, 0, 1, obj.left || 0, obj.top || 0];

        if (obj.type === "path") {
            pathObj = obj;
        } else if (typeof obj.getObjects === "function") {
            const children = obj.getObjects();
            pathObj = children.find((c: any) => c.type === "path" && c.stroke && c.stroke !== "#ffffff" && c.stroke !== "transparent");
            if (!pathObj) pathObj = children.find((c: any) => c.type === "path");
            if (pathObj) {
                const childMatrix = pathObj.calcTransformMatrix ? pathObj.calcTransformMatrix() : [1, 0, 0, 1, pathObj.left || 0, pathObj.top || 0];
                parentMatrix = childMatrix;
            }
        }

        if (!pathObj || !Array.isArray(pathObj.path)) continue;

        const pathArr: any[][] = pathObj.path;
        const offX = pathObj.pathOffset ? pathObj.pathOffset.x : 0;
        const offY = pathObj.pathOffset ? pathObj.pathOffset.y : 0;

        const transformedSegs: string[] = [];
        for (const seg of pathArr) {
            const cmd = seg[0];
            if (cmd === "M" || cmd === "L") {
                const p = fabric.util.transformPoint({ x: seg[1] - offX, y: seg[2] - offY }, parentMatrix);
                transformedSegs.push(`${cmd} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`);
            } else if (cmd === "C") {
                const p1 = fabric.util.transformPoint({ x: seg[1] - offX, y: seg[2] - offY }, parentMatrix);
                const p2 = fabric.util.transformPoint({ x: seg[3] - offX, y: seg[4] - offY }, parentMatrix);
                const p3 = fabric.util.transformPoint({ x: seg[5] - offX, y: seg[6] - offY }, parentMatrix);
                transformedSegs.push(`C ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`);
            } else if (cmd === "Q") {
                const p1 = fabric.util.transformPoint({ x: seg[1] - offX, y: seg[2] - offY }, parentMatrix);
                const p2 = fabric.util.transformPoint({ x: seg[3] - offX, y: seg[4] - offY }, parentMatrix);
                transformedSegs.push(`Q ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`);
            } else if (cmd === "Z" || cmd === "z") {
                transformedSegs.push("Z");
            }
        }

        const absD = transformedSegs.join(" ");
        if (!absD) continue;

        const eps = getPathEndpoints(absD);
        segmentData.push({
            d: absD,
            start: eps.start,
            end: eps.end,
            strokeWidth: pathObj.strokeWidth || 24,
            strokeColor: pathObj.stroke || "#000000",
        });
    }

    if (segmentData.length < 2) return null;

    const used = new Array(segmentData.length).fill(false);
    const chain: (typeof segmentData[0] & { flipped: boolean })[] = [{ ...segmentData[0], flipped: false }];
    used[0] = true;

    for (let step = 1; step < segmentData.length; step++) {
        const last = chain[chain.length - 1];
        const lastPt = last.flipped ? last.start : last.end;

        let bestIdx = -1;
        let bestDist = Infinity;
        let bestFlip = false;

        for (let j = 0; j < segmentData.length; j++) {
            if (used[j]) continue;
            const dS = _fuseDist(lastPt, segmentData[j].start);
            const dE = _fuseDist(lastPt, segmentData[j].end);
            if (dS < bestDist) { bestDist = dS; bestIdx = j; bestFlip = false; }
            if (dE < bestDist) { bestDist = dE; bestIdx = j; bestFlip = true; }
        }

        if (bestIdx < 0) break;
        used[bestIdx] = true;
        chain.push({ ...segmentData[bestIdx], flipped: bestFlip });
    }

    let fusedD = chain[0].d;
    for (let i = 1; i < chain.length; i++) {
        const prev = chain[i - 1];
        const curr = chain[i];
        const prevEnd = prev.flipped ? prev.start : prev.end;
        const currStart = curr.flipped ? curr.end : curr.start;

        if (_fuseDist(prevEnd, currStart) > 2) {
            fusedD += ` L ${currStart.x.toFixed(2)} ${currStart.y.toFixed(2)}`;
        }

        const stripped = curr.d.replace(/^\s*M\s+[-\d.]+\s+[-\d.]+\s*/i, "");
        fusedD += " " + stripped;
    }

    const width = options.width || chain[0].strokeWidth || 24;
    const outerW = width + 4;
    const color = options.color || (chain[0].strokeColor !== "#ffffff" ? chain[0].strokeColor : "#000000");

    const maskPath = new fabric.Path(fusedD, {
        fill: "transparent",
        stroke: "#ffffff",
        strokeWidth: outerW + 8,
        strokeLineCap: "butt",
        strokeLineJoin: "round",
    });

    const outerPath = new fabric.Path(fusedD, {
        fill: "transparent",
        stroke: color,
        strokeWidth: outerW,
        strokeLineCap: "butt",
        strokeLineJoin: "round",
    });

    const innerPath = new fabric.Path(fusedD, {
        fill: "transparent",
        stroke: "#ffffff",
        strokeWidth: width,
        strokeLineCap: "butt",
        strokeLineJoin: "round",
    });

    const avgLeft = candidateObjs.reduce((s, g) => s + (g.left || 0), 0) / candidateObjs.length;
    const avgTop = candidateObjs.reduce((s, g) => s + (g.top || 0), 0) / candidateObjs.length;

    const fusedGroup = new fabric.Group([maskPath, outerPath, innerPath], {
        left: avgLeft,
        top: avgTop,
        selectable: true,
        subTargetCheck: true,
    });
    (fusedGroup as any).customType = "snake-path";
    (fusedGroup as any).isFused = true;

    canvas.discardActiveObject();
    candidateObjs.forEach((g) => canvas.remove(g));
    canvas.add(fusedGroup);
    canvas.centerObject(fusedGroup);
    canvas.setActiveObject(fusedGroup);
    canvas.requestRenderAll();
    canvas.fire("object:modified");

    return fusedGroup;
}

function pseudoRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}


export interface SinglePathSegmentMeta {
    id: number;
    name: string;
    category: "sweeps" | "waves" | "loops" | "zigzags" | "serpentine";
    svgPathD: string;
}

export const PRE_DRAWN_SINGLE_PATH_SEGMENTS_100: SinglePathSegmentMeta[] = Array.from({ length: 100 }, (_, idx) => {
    const id = idx + 1;
    let category: "sweeps" | "waves" | "loops" | "zigzags" | "serpentine" = "sweeps";
    let svgPathD = "";
    let segName = "";

    const startX = 100;
    const startY = 40;
    const endY = 480;

    if (id <= 20) {
        category = "sweeps";
        const sub = (id - 1) % 20;
        const dir = sub % 2 === 0 ? 1 : -1;
        const amp = 40 + (sub % 5) * 22;
        const midY1 = 140 + (sub % 3) * 30;
        const midY2 = 320 + (sub % 4) * 20;
        const endX = startX + dir * ((sub % 6) * 18 - 30);

        if (sub % 4 === 0) {
            segName = `Parabolic Arc #${id}`;
            svgPathD = `M ${startX} ${startY} L ${startX} 90 C ${startX + amp * dir} ${midY1} ${startX + amp * dir} ${midY2} ${endX} 430 L ${endX} ${endY}`;
        } else if (sub % 4 === 1) {
            segName = `S-Curve Sweep #${id}`;
            svgPathD = `M ${startX} ${startY} C ${startX + amp * dir} 120 ${startX - amp * dir} 240 ${startX + amp * dir * 0.8} 360 C ${startX - amp * dir * 0.4} 420 ${endX} 450 ${endX} ${endY}`;
        } else if (sub % 4 === 2) {
            segName = `J-Hook Sweep #${id}`;
            svgPathD = `M ${startX} ${startY} L ${startX} 220 C ${startX} 340 ${startX + amp * dir} 380 ${startX + amp * dir * 0.7} 420 C ${startX + amp * dir * 0.3} 450 ${endX} 460 ${endX} ${endY}`;
        } else {
            segName = `Wide Bow Arc #${id}`;
            svgPathD = `M ${startX} ${startY} C ${startX - amp * dir * 0.5} 100 ${startX + amp * dir * 1.3} 220 ${startX + amp * dir * 1.1} 340 C ${startX + amp * dir * 0.5} 410 ${endX} 450 ${endX} ${endY}`;
        }
    } else if (id <= 40) {
        category = "waves";
        const sub = (id - 21) % 20;
        const dir = sub % 2 === 0 ? 1 : -1;
        const baseAmp = 35 + (sub % 4) * 15;
        const endX = startX + (sub % 5) * 16 - 32;

        if (sub % 3 === 0) {
            segName = `Expanding Ripple Wave #${id}`;
            const a1 = baseAmp * 0.6 * dir;
            const a2 = baseAmp * 1.1 * -dir;
            const a3 = baseAmp * 1.5 * dir;
            svgPathD = `M ${startX} ${startY} C ${startX + a1} 120 ${startX + a1} 170 ${startX} 210 C ${startX + a2} 260 ${startX + a2} 310 ${startX} 360 C ${startX + a3} 400 ${startX + a3} 440 ${endX} ${endY}`;
        } else if (sub % 3 === 1) {
            segName = `Sinusoidal Oscillation #${id}`;
            const a = baseAmp * dir;
            svgPathD = `M ${startX} ${startY} C ${startX + a} 110 ${startX + a} 160 ${startX} 210 C ${startX - a} 260 ${startX - a} 310 ${startX} 360 C ${startX + a * 0.8} 410 ${startX + a * 0.8} 440 ${endX} ${endY}`;
        } else {
            segName = `Accelerating Wave #${id}`;
            const a = baseAmp * dir;
            svgPathD = `M ${startX} ${startY} C ${startX + a} 100 ${startX + a} 150 ${startX} 190 C ${startX - a * 0.9} 230 ${startX - a * 0.9} 270 ${startX} 310 C ${startX + a * 0.8} 345 ${startX + a * 0.8} 380 ${startX} 415 C ${startX - a * 0.6} 445 ${endX} 465 ${endX} ${endY}`;
        }
    } else if (id <= 60) {
        category = "loops";
        const sub = (id - 41) % 20;
        const dir = sub % 2 === 0 ? 1 : -1;
        const loopR = 55 + (sub % 5) * 12;
        const endX = startX + (sub % 4) * 20 - 30;

        if (sub % 4 === 0) {
            segName = `360° Loop-the-Loop #${id}`;
            const midY = 220 + (sub % 3) * 25;
            svgPathD = `M ${startX} ${startY} L ${startX} ${midY - 60} C ${startX + loopR * dir} ${midY - 60} ${startX + loopR * dir} ${midY + 60} ${startX} ${midY + 60} C ${startX - loopR * dir} ${midY + 60} ${startX - loopR * dir} ${midY - 60} ${startX} ${midY - 60} C ${startX + loopR * dir * 0.6} ${midY - 60} ${startX + loopR * dir} ${midY + 100} ${endX} ${endY}`;
        } else if (sub % 4 === 1) {
            segName = `Teardrop Loop Twist #${id}`;
            const midY = 200;
            svgPathD = `M ${startX} ${startY} L ${startX} ${midY} C ${startX + loopR * 1.3 * dir} ${midY + 30} ${startX + loopR * 1.3 * dir} ${midY + 110} ${startX} ${midY + 110} C ${startX - loopR * 1.3 * dir} ${midY + 110} ${startX - loopR * 1.3 * dir} ${midY + 30} ${startX} ${midY} C ${startX + loopR * dir * 0.5} ${midY - 20} ${endX + 20 * dir} 380 ${endX} ${endY}`;
        } else if (sub % 4 === 2) {
            segName = `Double Loop-de-Loop #${id}`;
            const r1 = 45;
            const r2 = 45;
            svgPathD = `M ${startX} ${startY} L ${startX} 120 C ${startX + r1 * dir} 120 ${startX + r1 * dir} 210 ${startX} 210 C ${startX - r1 * dir} 210 ${startX - r1 * dir} 120 ${startX} 120 C ${startX + r1 * dir * 0.5} 120 ${startX} 240 ${startX} 280 C ${startX - r2 * dir} 280 ${startX - r2 * dir} 370 ${startX} 370 C ${startX + r2 * dir} 370 ${startX + r2 * dir} 280 ${startX} 280 L ${endX} ${endY}`;
        } else {
            segName = `Pretzel Swirl Loop #${id}`;
            const lw = loopR * dir;
            svgPathD = `M ${startX} ${startY} C ${startX + lw * 1.2} 120 ${startX - lw * 0.8} 200 ${startX + lw} 260 C ${startX + lw * 1.5} 300 ${startX - lw * 1.2} 360 ${startX} 390 C ${startX + lw * 0.5} 420 ${endX} 450 ${endX} ${endY}`;
        }
    } else if (id <= 80) {
        category = "zigzags";
        const sub = (id - 61) % 20;
        const dir = sub % 2 === 0 ? 1 : -1;
        const stepW = 55 + (sub % 5) * 14;

        if (sub % 4 === 0) {
            segName = `4-Point Zigzag #${id}`;
            const z1 = startX + stepW * dir;
            const z2 = startX - stepW * dir * 0.8;
            const z3 = startX + stepW * dir * 0.6;
            const endX = startX + (sub % 3) * 15 - 15;
            svgPathD = `M ${startX} ${startY} L ${startX} 110 L ${z1} 190 L ${z2} 280 L ${z3} 370 L ${endX} 440 L ${endX} ${endY}`;
        } else if (sub % 4 === 1) {
            segName = `Step-Stair Turn #${id}`;
            const x1 = startX + stepW * dir;
            const x3 = startX - stepW * dir * 0.5;
            svgPathD = `M ${startX} ${startY} L ${startX} 130 L ${x1} 130 L ${x1} 250 L ${x3} 250 L ${x3} 370 L ${startX} 370 L ${startX} ${endY}`;
        } else if (sub % 4 === 2) {
            segName = `Chevron Zigzag #${id}`;
            const z1 = startX + stepW * dir * 1.2;
            const z2 = startX - stepW * dir * 0.9;
            svgPathD = `M ${startX} ${startY} L ${startX} 100 Q ${startX} 130 ${z1 * 0.5} 150 L ${z1} 180 Q ${z1 + 20 * dir} 200 ${z1 * 0.5} 230 L ${z2} 290 Q ${z2 - 20 * dir} 310 ${z2 * 0.5} 340 L ${startX} 400 L ${startX} ${endY}`;
        } else {
            segName = `Lightning Bolt Turn #${id}`;
            const z1 = startX + stepW * dir * 1.4;
            const z2 = startX - stepW * dir * 0.7;
            svgPathD = `M ${startX} ${startY} L ${startX} 140 L ${z1} 220 L ${z2} 330 L ${startX} 420 L ${startX} ${endY}`;
        }
    } else {
        category = "serpentine";
        const sub = (id - 81) % 20;
        const dir = sub % 2 === 0 ? 1 : -1;
        const coilW = 65 + (sub % 5) * 15;
        const endX = startX + (sub % 4) * 20 - 30;

        if (sub % 4 === 0) {
            segName = `Triple-Coil Serpentine #${id}`;
            const c1 = coilW * dir;
            const c2 = -coilW * dir * 1.2;
            const c3 = coilW * dir * 0.9;
            svgPathD = `M ${startX} ${startY} C ${startX + c1} 110 ${startX + c1} 160 ${startX} 190 C ${startX + c2} 230 ${startX + c2} 290 ${startX} 330 C ${startX + c3} 370 ${startX + c3} 420 ${endX} ${endY}`;
        } else if (sub % 4 === 1) {
            segName = `Meandering River Bend #${id}`;
            const b1 = coilW * dir * 1.3;
            const b2 = -coilW * dir * 1.1;
            svgPathD = `M ${startX} ${startY} L ${startX} 80 C ${startX + b1} 120 ${startX + b1} 220 ${startX} 250 C ${startX + b2} 280 ${startX + b2} 380 ${endX} 420 L ${endX} ${endY}`;
        } else if (sub % 4 === 2) {
            segName = `Labyrinthine Swirl #${id}`;
            const b1 = coilW * dir;
            const b2 = -coilW * dir * 1.3;
            const b3 = coilW * dir * 0.8;
            svgPathD = `M ${startX} ${startY} C ${startX - b1 * 0.5} 90 ${startX + b1 * 1.2} 150 ${startX + b1} 210 C ${startX + b2 * 1.2} 260 ${startX + b2} 330 ${startX + b3} 380 C ${startX + b3 * 0.5} 420 ${endX} 450 ${endX} ${endY}`;
        } else {
            segName = `Hairpin Snake Corridor #${id}`;
            const h1 = coilW * dir * 1.2;
            const h2 = -coilW * dir * 1.2;
            svgPathD = `M ${startX} ${startY} L ${startX} 100 C ${startX + h1} 100 ${startX + h1} 210 ${startX} 210 C ${startX + h2} 210 ${startX + h2} 320 ${startX} 320 C ${startX + h1 * 0.7} 320 ${startX + h1 * 0.7} 430 ${endX} ${endY}`;
        }
    }

    return {
        id,
        name: segName,
        category,
        svgPathD,
    };
});

export function createSingleSnakePathFromSegment(
    segment: SinglePathSegmentMeta,
    options: { width?: number; color?: string } = {}
): fabric.Group {
    const width = options.width || 24;
    const outerW = width + 4;
    const d = segment.svgPathD;

    const mask = new fabric.Path(d, {
        fill: "transparent",
        stroke: "#ffffff",
        strokeWidth: outerW + 8,
        strokeLineCap: "butt",
        strokeLineJoin: "round",
    });

    const outer = new fabric.Path(d, {
        fill: "transparent",
        stroke: options.color || "#000000",
        strokeWidth: outerW,
        strokeLineCap: "butt",
        strokeLineJoin: "round",
    });

    const inner = new fabric.Path(d, {
        fill: "transparent",
        stroke: "#ffffff",
        strokeWidth: width,
        strokeLineCap: "butt",
        strokeLineJoin: "round",
    });

    const grp = new fabric.Group([mask, outer, inner], {
        left: 200,
        top: 150,
        selectable: true,
        subTargetCheck: true,
    });
    (grp as any).customType = "snake-path";
    (grp as any).segmentId = segment.id;
    return grp;
}

export interface PathTemplateMeta {
    id: number;
    name: string;
    category: "easy" | "medium" | "hard" | "expert";
    pairCount: number;
    variation: "standard" | "dense_cross" | "zigzag_angles" | "wavy_s" | "random_seed";
    seed: number;
    mapping: number[];
}

export const PRE_DRAWN_PATH_TEMPLATES_100: PathTemplateMeta[] = Array.from({ length: 100 }, (_, idx) => {
    const id = idx + 1;
    let category: "easy" | "medium" | "hard" | "expert" = "easy";
    let pairCount = 2;
    let variation: "standard" | "dense_cross" | "zigzag_angles" | "wavy_s" | "random_seed" = "standard";

    if (id <= 25) {
        category = "easy";
        pairCount = id <= 12 ? 2 : 3;
        variation = id % 3 === 0 ? "wavy_s" : "standard";
    } else if (id <= 50) {
        category = "medium";
        pairCount = 4;
        variation = id % 4 === 0 ? "zigzag_angles" : id % 3 === 0 ? "dense_cross" : "standard";
    } else if (id <= 75) {
        category = "hard";
        pairCount = id <= 62 ? 4 : 5;
        variation = id % 2 === 0 ? "dense_cross" : "wavy_s";
    } else {
        category = "expert";
        pairCount = id <= 88 ? 5 : 6;
        variation = id % 3 === 0 ? "zigzag_angles" : "random_seed";
    }

    const categoryNames = {
        easy: "Gentle Curve",
        medium: "Cross Corridor",
        hard: "Dense Intersect",
        expert: "Complex Web",
    };

    // Deterministic shuffle for target mappings
    const baseIndices = Array.from({ length: pairCount }, (_, i) => i);
    const mapping = baseIndices.slice().sort((a, b) => {
        const r = pseudoRandom(id * 97 + a * 13) - 0.5;
        return r;
    });

    return {
        id,
        name: `Path #${id}: ${categoryNames[category]} (${pairCount} Pairs)`,
        category,
        pairCount,
        variation,
        seed: id * 257 + 89,
        mapping,
    };
});

export interface SnakePathMazeConfig {
    title: string;
    instructions: string;
    pairCount: number; // 2 to 6
    theme: "animals" | "abc" | "numbers" | "colors" | "fairytale" | "space" | "ocean" | "vehicles" | "math" | "custom";
    corridorWidth: number; // 12 to 40
    pathVariation: "standard" | "dense_cross" | "zigzag_angles" | "wavy_s" | "random_seed";
    randomSeed: number;
    targetMapping?: number[];
    selectedTemplateId?: number;
    iconSize: number; // 24 to 64
    showBadges: boolean;
    showSolution: boolean;
    solutionColor?: string;
    customTopText?: string;
    customBottomText?: string;
}

export function createDefaultSnakePathMazeConfig(): SnakePathMazeConfig {
    return {
        title: "PATH MATCHING MAZE",
        instructions: "Trace each snake path corridor to connect the items!",
        pairCount: 4,
        theme: "animals",
        corridorWidth: 24,
        pathVariation: "standard",
        randomSeed: 101,
        targetMapping: [1, 2, 0, 3],
        iconSize: 36,
        showBadges: false,
        showSolution: false,
        solutionColor: "#ec4899",
        customTopText: "🐍 Snake, 🐦 Bird, 🪲 Beetle, 🦝 Raccoon",
        customBottomText: "🍎 Apple, 🐭 Mouse, 🫘 Seeds, 🌻 Sunflower",
    };
}

function generateProceduralMazePaths(pairs: number, variation: string, seed: number, mapping: number[]): string[] {
    const paths: string[] = [];
    const totalW = 520;
    const startXOffset = 80;
    const spacing = pairs > 1 ? totalW / (pairs - 1) : 0;

    for (let i = 0; i < pairs; i++) {
        const startX = startXOffset + i * spacing;
        const endTargetIdx = mapping[i] !== undefined ? mapping[i] : (i + 1) % pairs;
        const endX = startXOffset + endTargetIdx * spacing;

        const startY = 50;
        const endY = 520;
        const midY1 = 180;
        const midY2 = 360;

        let s1 = seed + i * 17;
        let randOffset1 = (pseudoRandom(s1) - 0.5) * 160;
        let randOffset2 = (pseudoRandom(s1 + 5) - 0.5) * 160;

        if (variation === "zigzag_angles") {
            const zx1 = startX + (endX - startX) * 0.3 + randOffset1 * 0.5;
            const zx2 = startX + (endX - startX) * 0.7 + randOffset2 * 0.5;
            paths.push(`M ${startX} ${startY} L ${startX} 100 L ${zx1} ${midY1} L ${zx2} ${midY2} L ${endX} 460 L ${endX} ${endY}`);
        } else if (variation === "dense_cross") {
            const cx1 = Math.max(40, Math.min(640, startXOffset + ((i + 2) % pairs) * spacing + randOffset1 * 0.8));
            const cx2 = Math.max(40, Math.min(640, startXOffset + ((i + 3) % pairs) * spacing + randOffset2 * 0.8));
            paths.push(`M ${startX} ${startY} L ${startX} 100 C ${startX} ${midY1 - 40} ${cx1} ${midY1} ${cx1} 270 C ${cx1} ${midY2} ${cx2} 400 ${endX} 460 L ${endX} ${endY}`);
        } else if (variation === "wavy_s") {
            const waveWidth = (i % 2 === 0 ? 1 : -1) * 90;
            const cx1 = (startX + endX) / 2 + waveWidth;
            const cx2 = (startX + endX) / 2 - waveWidth;
            paths.push(`M ${startX} ${startY} L ${startX} 100 C ${startX} 160 ${cx1} 220 ${cx1} 280 C ${cx1} 340 ${cx2} 400 ${endX} 460 L ${endX} ${endY}`);
        } else if (variation === "random_seed") {
            const rx1 = Math.max(60, Math.min(600, (startX + endX) / 2 + randOffset1 * 1.2));
            const rx2 = Math.max(60, Math.min(600, (startX + endX) / 2 + randOffset2 * 1.2));
            paths.push(`M ${startX} ${startY} L ${startX} 100 C ${startX} 160 ${rx1} 220 ${rx1} 280 C ${rx1} 340 ${rx2} 400 ${endX} 460 L ${endX} ${endY}`);
        } else {
            // Standard smooth curves
            const cx1 = (startX * 2 + endX) / 3 + randOffset1 * 0.4;
            const cx2 = (startX + endX * 2) / 3 + randOffset2 * 0.4;
            paths.push(`M ${startX} ${startY} L ${startX} 100 C ${startX} 160 ${cx1} 220 ${cx1} 280 C ${cx1} 340 ${cx2} 400 ${endX} 460 L ${endX} ${endY}`);
        }
    }
    return paths;
}

export function generateSnakePathMazeObjectsFromConfig(config: SnakePathMazeConfig): fabric.Group {
    const pairs = Math.min(Math.max(config.pairCount || 4, 2), 6);
    const width = config.corridorWidth || 24;
    const outerW = width + 4;
    const iconSize = config.iconSize || 36;
    const seed = config.randomSeed || 101;
    const variation = config.pathVariation || "standard";

    // Mapping array from top entrance -> bottom exit
    const mapping = config.targetMapping && config.targetMapping.length >= pairs
        ? config.targetMapping
        : Array.from({ length: pairs }, (_, i) => (i + 1) % pairs);

    const themeData = {
        animals: {
            top: ["🐍 Snake", "🐦 Bird", "🪲 Beetle", "🦝 Raccoon", "🦊 Fox", "🐰 Rabbit"],
            bottom: ["🍎 Apple", "🐭 Mouse", "🫘 Seeds", "🌻 Sunflower", "🍇 Grapes", "🥕 Carrot"],
        },
        abc: {
            top: ["A", "B", "C", "D", "E", "F"],
            bottom: ["🍎 Apple", "🍌 Banana", "🐱 Cat", "🐶 Dog", "🐘 Elephant", "🦊 Fox"],
        },
        numbers: {
            top: ["1", "2", "3", "4", "5", "6"],
            bottom: ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐⭐"],
        },
        colors: {
            top: ["🔴 Red", "🟡 Yellow", "🔵 Blue", "🟢 Green", "🟣 Purple", "🟠 Orange"],
            bottom: ["🍒 Cherry", "☀️ Sun", "☁️ Cloud", "🍃 Leaf", "🍇 Grape", "🍊 Carrot"],
        },
        fairytale: {
            top: ["🏰 Castle", "🐉 Dragon", "🧙 Wizard", "👸 Princess", "🦄 Unicorn", "⚔️ Knight"],
            bottom: ["👑 Crown", "💎 Gem", "🪄 Wand", "🪞 Mirror", "🌈 Rainbow", "🛡️ Shield"],
        },
        space: {
            top: ["🚀 Rocket", "👨‍🚀 Astronaut", "🛸 UFO", "☄️ Comet", "🌟 Star", "📡 Satellite"],
            bottom: ["🪐 Saturn", "🌙 Moon", "👾 Alien", "🌍 Earth", "☀️ Sun", "🌌 Galaxy"],
        },
        ocean: {
            top: ["🐬 Dolphin", "🐙 Octopus", "🦈 Shark", "🐢 Turtle", "🐳 Whale", "🦭 Seal"],
            bottom: ["🐚 Shell", "🦀 Crab", "🐟 Fish", "🪸 Coral", "⚓ Anchor", "🍤 Shrimp"],
        },
        vehicles: {
            top: ["🚗 Car", "✈️ Airplane", "🚂 Train", "⛵ Boat", "🚁 Helicopter", "🚀 Rocket"],
            bottom: ["⛽ Gas", "☁️ Cloud", "🛤️ Track", "🌊 Wave", "🏁 Flag", "🪐 Space"],
        },
        math: {
            top: ["2 + 3", "4 + 4", "9 - 2", "5 + 1", "10 - 4", "3 + 3"],
            bottom: ["5", "8", "7", "6", "6", "6"],
        },
        custom: {
            top: config.customTopText ? config.customTopText.split(",").map((s) => s.trim()).filter(Boolean) : ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"],
            bottom: config.customBottomText ? config.customBottomText.split(",").map((s) => s.trim()).filter(Boolean) : ["Target 1", "Target 2", "Target 3", "Target 4", "Target 5", "Target 6"],
        },
    };

    const activeTheme = themeData[config.theme] || themeData.animals;
    const topIcons = activeTheme.top.slice(0, pairs);

    // Map bottom icons according to targetMapping so bottom icons align with targets!
    const rawBottom = activeTheme.bottom.slice(0, pairs);
    const bottomIcons = Array.from({ length: pairs }, (_, idx) => {
        // Find which top item connects to bottom position idx
        const topIdx = mapping.indexOf(idx);
        return topIdx !== -1 && rawBottom[topIdx] ? rawBottom[topIdx] : rawBottom[idx];
    });

    const mazePaths = generateProceduralMazePaths(pairs, variation, seed, mapping);
    const objs: fabric.FabricObject[] = [];

    // Title & Subtitle
    if (config.title) {
        objs.push(
            new fabric.IText(config.title.toUpperCase(), {
                left: 340,
                top: -85,
                fontSize: 26,
                fontFamily: "Inter",
                fontWeight: "bold",
                fill: "#0f172a",
                originX: "center",
            })
        );
    }
    if (config.instructions) {
        objs.push(
            new fabric.IText(config.instructions, {
                left: 340,
                top: -50,
                fontSize: 14,
                fontFamily: "Inter",
                fill: "#64748b",
                originX: "center",
            })
        );
    }

    const badgeSymbols = ["①", "②", "③", "④", "⑤", "⑥"];

    mazePaths.forEach((d, idx) => {
        // White Background Mask (Non-connecting crossover gap)
        const mask = new fabric.Path(d, {
            fill: "transparent",
            stroke: "#ffffff",
            strokeWidth: outerW + 8,
            strokeLineCap: "butt",
            strokeLineJoin: "round",
        });

        // Outer Dark Border
        const outer = new fabric.Path(d, {
            fill: "transparent",
            stroke: "#000000",
            strokeWidth: outerW,
            strokeLineCap: "butt",
            strokeLineJoin: "round",
        });

        // Inner White Corridor (Leaves ends 100% open)
        const inner = new fabric.Path(d, {
            fill: "transparent",
            stroke: "#ffffff",
            strokeWidth: width,
            strokeLineCap: "butt",
            strokeLineJoin: "round",
        });

        const pathSubObjs: fabric.FabricObject[] = [mask, outer, inner];

        // Solution Key Trace
        if (config.showSolution) {
            const solColors = ["#ec4899", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];
            const solTrace = new fabric.Path(d, {
                fill: "transparent",
                stroke: config.solutionColor || solColors[idx % solColors.length],
                strokeWidth: Math.max(Math.round(width / 3), 4),
                strokeDashArray: [8, 6],
                strokeLineCap: "round",
                strokeLineJoin: "round",
            });
            pathSubObjs.push(solTrace);
        }

        const corridorGrp = new fabric.Group(pathSubObjs, {
            selectable: true,
            subTargetCheck: true,
        });
        (corridorGrp as any).customType = "snake-corridor-path";
        objs.push(corridorGrp);
    });

    const totalW = 520;
    const startXOffset = 80;
    const spacing = pairs > 1 ? totalW / (pairs - 1) : 0;

    // Top Characters
    topIcons.forEach((icon, i) => {
        const xPos = startXOffset + i * spacing;
        objs.push(
            new fabric.IText(icon, {
                left: xPos,
                top: 0,
                fontSize: iconSize,
                originX: "center",
            })
        );
        if (config.showBadges) {
            objs.push(
                new fabric.IText(badgeSymbols[i] || `${i + 1}`, {
                    left: xPos,
                    top: 38,
                    fontSize: 16,
                    fill: "#2563eb",
                    fontWeight: "bold",
                    originX: "center",
                })
            );
        }
    });

    // Bottom Targets
    bottomIcons.forEach((icon, i) => {
        const xPos = startXOffset + i * spacing;
        objs.push(
            new fabric.IText(icon, {
                left: xPos,
                top: 540,
                fontSize: iconSize,
                originX: "center",
            })
        );
    });

    const grp = new fabric.Group(objs, {
        left: 60,
        top: 100,
        selectable: true,
        subTargetCheck: true,
    });
    (grp as any).customType = "snake-path-maze";
    (grp as any).puzzleConfig = config;
    return grp;
}

export function createSnakePathMazeGroup(): fabric.Group {
    return generateSnakePathMazeObjectsFromConfig(createDefaultSnakePathMazeConfig());
}

/**
 * Merges and locks all active eraser white masks on canvas with their underlying vector lines/objects into a single unified group.
 * The erased gaps remain permanently bound to the lines so they never separate when moving or scaling!
 */
export function mergeAndLockEraserMasks(c: fabric.Canvas): number {
    if (!c) return 0;
    const allObjects = c.getObjects();
    const masks = allObjects.filter((o: any) => o.customType && typeof o.customType === "string" && o.customType.startsWith("eraser"));

    if (masks.length === 0) return 0;

    const targetObjs: any[] = [];
    masks.forEach((mask) => {
        const maskRect = mask.getBoundingRect();
        allObjects.forEach((obj: any) => {
            if (obj === mask || (obj.customType && typeof obj.customType === "string" && obj.customType.startsWith("eraser")) || obj.customType === "grid-overlay") {
                return;
            }
            const objRect = obj.getBoundingRect();
            const intersects = !(
                maskRect.left > objRect.left + objRect.width ||
                maskRect.left + maskRect.width < objRect.left ||
                maskRect.top > objRect.top + objRect.height ||
                maskRect.top + maskRect.height < objRect.top
            );

            if (intersects && !targetObjs.includes(obj)) {
                targetObjs.push(obj);
            }
        });
    });

    const itemsToMerge = [...targetObjs, ...masks];
    if (itemsToMerge.length === 0) return 0;

    c.discardActiveObject();
    itemsToMerge.forEach((obj) => c.remove(obj));

    const mergedGroup = new fabric.Group(itemsToMerge, {
        subTargetCheck: true,
        selectable: true,
    });
    (mergedGroup as any).customType = "erased-vector-group";

    c.add(mergedGroup);
    c.setActiveObject(mergedGroup);
    c.requestRenderAll();
    c.fire("object:modified");

    return masks.length;
}

/**
 * Clears all temporary eraser mask objects from canvas to restore original lines.
 */
export function clearAllEraserMasks(c: fabric.Canvas): number {
    if (!c) return 0;
    const masks = c.getObjects().filter((o: any) => o.customType && typeof o.customType === "string" && o.customType.startsWith("eraser"));
    if (masks.length === 0) return 0;

    c.discardActiveObject();
    masks.forEach((m) => c.remove(m));
    c.requestRenderAll();
    c.fire("object:modified");
    return masks.length;
}

/**
 * Generates a complete, interactive Board Game Fabric Group from a BoardGameConfig.
 */
export function generateBoardGameObjectsFromConfig(config: BoardGameConfig): fabric.Group {
    const theme = BOARD_GAME_THEMES[config.theme] || BOARD_GAME_THEMES.candyland;
    const spaces = config.customSpaces && config.customSpaces.length > 0
        ? config.customSpaces
        : generateDefaultSpacesForConfig(config);

    let boardWidth = 600;
    let boardHeight = 460;
    const cellSize = config.cellSize || 42;

    const trackW = 520;
    const trackH = 320;

    let positions: { x: number; y: number }[];

    if (config.customPositions && config.customPositions.length > 0) {
        // Custom drawn path positions are already centered at (0,0)
        positions = config.customPositions;

        // Compute bounding box of custom positions to size the card
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        positions.forEach(p => {
            if (p.x < minX) minX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.x > maxX) maxX = p.x;
            if (p.y > maxY) maxY = p.y;
        });
        const pad = cellSize * 1.5 + 40;
        boardWidth = Math.max(300, (maxX - minX) + pad * 2);
        boardHeight = Math.max(200, (maxY - minY) + pad * 2 + 60); // extra 60 for title
    } else {
        const rawPositions = computeBoardGameSpacePositions(config.layout, spaces.length, trackW, trackH, cellSize);
        positions = rawPositions.map((p) => ({
            x: p.x - trackW / 2,
            y: p.y - trackH / 2 + 30,
        }));
    }

    const objs: fabric.Object[] = [];

    // 1. Board Outer Card Background
    const cardBg = new fabric.Rect({
        left: 0,
        top: 0,
        width: boardWidth,
        height: boardHeight,
        rx: 24,
        ry: 24,
        fill: theme.pathColor,
        stroke: theme.borderColor,
        strokeWidth: 4,
        originX: "center",
        originY: "center",
        shadow: new fabric.Shadow({
            color: "rgba(0, 0, 0, 0.15)",
            blur: 16,
            offsetX: 0,
            offsetY: 6,
        }),
    });
    objs.push(cardBg);

    // 2. Board Title & Subtitle Header Banner
    const titleBanner = new fabric.Rect({
        left: 0,
        top: -boardHeight / 2 + 38,
        width: boardWidth - 40,
        height: 52,
        rx: 16,
        ry: 16,
        fill: "#ffffff",
        stroke: theme.borderColor,
        strokeWidth: 2,
        originX: "center",
        originY: "center",
        shadow: new fabric.Shadow({
            color: "rgba(0,0,0,0.06)",
            blur: 8,
            offsetX: 0,
            offsetY: 2,
        }),
    });
    objs.push(titleBanner);

    const titleText = new fabric.IText(`${theme.icon} ${config.title.toUpperCase()} ${theme.icon}`, {
        left: 0,
        top: -boardHeight / 2 + 30,
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Outfit, Inter, Arial, sans-serif",
        fill: theme.titleColor,
        originX: "center",
        originY: "center",
    });
    objs.push(titleText);

    if (config.subtitle) {
        const subText = new fabric.IText(config.subtitle, {
            left: 0,
            top: -boardHeight / 2 + 50,
            fontSize: 11,
            fontWeight: "normal",
            fontFamily: "Inter, Arial, sans-serif",
            fill: "#475569",
            originX: "center",
            originY: "center",
        });
        objs.push(subText);
    }

    // 3. Track Connecting Path Line
    if (positions.length >= 2) {
        let pathD = `M ${positions[0].x.toFixed(1)} ${positions[0].y.toFixed(1)}`;
        for (let i = 1; i < positions.length; i++) {
            pathD += ` L ${positions[i].x.toFixed(1)} ${positions[i].y.toFixed(1)}`;
        }

        const trackLine = new fabric.Path(pathD, {
            fill: "none",
            stroke: theme.borderColor,
            strokeWidth: 6,
            strokeDashArray: [10, 6],
            strokeLineCap: "round",
            strokeLineJoin: "round",
            opacity: 0.5,
            originX: "center",
            originY: "center",
        });
        objs.push(trackLine);
    }

    // 4. Board Spaces / Cells
    positions.forEach((pos, idx) => {
        const space = spaces[idx] || {
            number: idx + 1,
            type: "normal",
            label: "",
            icon: "⭐",
            color: theme.normalColors[idx % theme.normalColors.length],
            borderColor: theme.borderColor,
            textColor: theme.textColor,
        };

        const x = pos.x;
        const y = pos.y;
        const r = cellSize / 2;

        let cellShapeObj: fabric.Object;
        if (config.cellShape === "circle") {
            cellShapeObj = new fabric.Circle({
                left: x,
                top: y,
                radius: r,
                fill: space.color || theme.normalColors[idx % theme.normalColors.length],
                stroke: space.borderColor || theme.borderColor,
                strokeWidth: space.type === "start" || space.type === "finish" ? 3.5 : 2,
                originX: "center",
                originY: "center",
                shadow: new fabric.Shadow({
                    color: "rgba(0,0,0,0.12)",
                    blur: 6,
                    offsetX: 0,
                    offsetY: 3,
                }),
            });
        } else if (config.cellShape === "diamond") {
            cellShapeObj = new fabric.Rect({
                left: x,
                top: y,
                width: cellSize * 0.9,
                height: cellSize * 0.9,
                rx: 4,
                ry: 4,
                angle: 45,
                fill: space.color || theme.normalColors[idx % theme.normalColors.length],
                stroke: space.borderColor || theme.borderColor,
                strokeWidth: 2,
                originX: "center",
                originY: "center",
            });
        } else {
            cellShapeObj = new fabric.Rect({
                left: x,
                top: y,
                width: cellSize,
                height: cellSize,
                rx: config.cellShape === "rounded" ? 10 : 2,
                ry: config.cellShape === "rounded" ? 10 : 2,
                fill: space.color || theme.normalColors[idx % theme.normalColors.length],
                stroke: space.borderColor || theme.borderColor,
                strokeWidth: space.type === "start" || space.type === "finish" ? 3.5 : 2,
                originX: "center",
                originY: "center",
                shadow: new fabric.Shadow({
                    color: "rgba(0,0,0,0.12)",
                    blur: 6,
                    offsetX: 0,
                    offsetY: 3,
                }),
            });
        }
        objs.push(cellShapeObj);

        // Number Badge
        if (config.showNumbers) {
            const numText = new fabric.IText(`${space.number}`, {
                left: x - r + 8,
                top: y - r + 3,
                fontSize: 10,
                fontWeight: "extrabold",
                fill: "#1e293b",
                originX: "center",
                originY: "center",
            });
            objs.push(numText);
        }

        // Icon / Emoji
        if (config.showIcons && space.icon) {
            const iconText = new fabric.IText(space.icon, {
                left: x,
                top: space.label ? y - 4 : y,
                fontSize: space.type === "start" || space.type === "finish" ? 18 : 15,
                originX: "center",
                originY: "center",
            });
            objs.push(iconText);
        }

        // Label
        if (space.label) {
            const labelText = new fabric.IText(space.label, {
                left: x,
                top: y + r - 8,
                fontSize: 8,
                fontWeight: "bold",
                fill: space.textColor || "#0f172a",
                originX: "center",
                originY: "center",
            });
            objs.push(labelText);
        }
    });

    const boardGroup = new fabric.Group(objs, {
        left: 100,
        top: 100,
        selectable: true,
        subTargetCheck: true,
    });

    (boardGroup as any).customType = "board-game";
    (boardGroup as any).puzzleConfig = config;
    return boardGroup;
}

/**
 * Generates a printable 3D foldout D6 cube net template with cut/fold lines and tabs.
 */
export function generatePrintableDiceGroup(): fabric.Group {
    const objs: fabric.Object[] = [];
    const size = 50; // Each die face size

    // Card Box Outer Container
    const bg = new fabric.Rect({
        left: 0,
        top: 0,
        width: 320,
        height: 260,
        rx: 16,
        ry: 16,
        fill: "#f8fafc",
        stroke: "#94a3b8",
        strokeWidth: 2,
        strokeDashArray: [6, 4],
    });
    objs.push(bg);

    // Title
    const title = new fabric.IText("🎲 PRINTABLE D6 GAME DIE (CUT & FOLD)", {
        left: 160,
        top: 14,
        fontSize: 12,
        fontWeight: "bold",
        fill: "#1e293b",
        originX: "center",
    });
    objs.push(title);

    const sub = new fabric.IText("Cut along dashed outer line ✂️, fold on dotted lines, and glue tabs!", {
        left: 160,
        top: 32,
        fontSize: 9,
        fill: "#64748b",
        originX: "center",
    });
    objs.push(sub);

    // Cube Net Faces Position Layout (T-Shape):
    //       [Face 1]
    // [Face 2][Face 3][Face 4]
    //       [Face 5]
    //       [Face 6]
    const centerX = 160;
    const startY = 60;

    const faceCoords = [
        { face: 1, x: centerX, y: startY },
        { face: 2, x: centerX - size, y: startY + size },
        { face: 3, x: centerX, y: startY + size },
        { face: 4, x: centerX + size, y: startY + size },
        { face: 5, x: centerX, y: startY + size * 2 },
        { face: 6, x: centerX, y: startY + size * 3 },
    ];

    const pipPositions: Record<number, { x: number; y: number }[]> = {
        1: [{ x: 0.5, y: 0.5 }],
        2: [{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.75 }],
        3: [{ x: 0.25, y: 0.25 }, { x: 0.5, y: 0.5 }, { x: 0.75, y: 0.75 }],
        4: [{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.25 }, { x: 0.25, y: 0.75 }, { x: 0.75, y: 0.75 }],
        5: [{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.25 }, { x: 0.5, y: 0.5 }, { x: 0.25, y: 0.75 }, { x: 0.75, y: 0.75 }],
        6: [{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.25 }, { x: 0.25, y: 0.5 }, { x: 0.75, y: 0.5 }, { x: 0.25, y: 0.75 }, { x: 0.75, y: 0.75 }],
    };

    faceCoords.forEach(({ face, x, y }) => {
        // Face Square
        const rect = new fabric.Rect({
            left: x - size / 2,
            top: y,
            width: size,
            height: size,
            fill: "#ffffff",
            stroke: "#334155",
            strokeWidth: 2,
        });
        objs.push(rect);

        // Pips
        const pips = pipPositions[face] || [];
        pips.forEach((p) => {
            const circle = new fabric.Circle({
                left: x - size / 2 + p.x * size,
                top: y + p.y * size,
                radius: 4,
                fill: face === 1 ? "#dc2626" : "#0f172a",
                originX: "center",
                originY: "center",
            });
            objs.push(circle);
        });
    });

    const diceGroup = new fabric.Group(objs, {
        left: 80,
        top: 80,
        selectable: true,
        subTargetCheck: true,
    });
    (diceGroup as any).customType = "printable-dice";
    return diceGroup;
}

/**
 * Generates a printable circular pie spinner with 6 colored numbered sections & cutout arrow.
 */
export function generatePrintableSpinnerGroup(): fabric.Group {
    const objs: fabric.Object[] = [];
    const size = 260;
    const center = size / 2;
    const radius = 95;

    const bg = new fabric.Rect({
        left: 0,
        top: 0,
        width: size,
        height: size + 40,
        rx: 16,
        ry: 16,
        fill: "#ffffff",
        stroke: "#6366f1",
        strokeWidth: 2,
    });
    objs.push(bg);

    const title = new fabric.IText("🎯 PRINTABLE GAME SPINNER", {
        left: center,
        top: 14,
        fontSize: 12,
        fontWeight: "bold",
        fill: "#1e1b4b",
        originX: "center",
    });
    objs.push(title);

    const circle = new fabric.Circle({
        left: center,
        top: center + 10,
        radius,
        fill: "#f8fafc",
        stroke: "#334155",
        strokeWidth: 4,
        originX: "center",
        originY: "center",
    });
    objs.push(circle);

    const colors = ["#f472b6", "#38bdf8", "#4ade80", "#facc15", "#a78bfa", "#fb923c"];
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
        const lineX = center + Math.cos(angle) * radius;
        const lineY = center + 10 + Math.sin(angle) * radius;

        const line = new fabric.Line([center, center + 10, lineX, lineY], {
            stroke: "#334155",
            strokeWidth: 2,
        });
        objs.push(line);

        const numAngle = angle - Math.PI / 6;
        const numX = center + Math.cos(numAngle) * (radius * 0.65);
        const numY = center + 10 + Math.sin(numAngle) * (radius * 0.65);

        const numText = new fabric.IText(`${i + 1}`, {
            left: numX,
            top: numY,
            fontSize: 18,
            fontWeight: "bold",
            fill: "#0f172a",
            originX: "center",
            originY: "center",
        });
        objs.push(numText);
    }

    // Center Pivot Ring
    const pivot = new fabric.Circle({
        left: center,
        top: center + 10,
        radius: 12,
        fill: "#6366f1",
        stroke: "#ffffff",
        strokeWidth: 3,
        originX: "center",
        originY: "center",
    });
    objs.push(pivot);

    // Arrow Cutout Tip
    const arrowText = new fabric.IText("✂️ Cut arrow & attach with paper fastener / paperclip", {
        left: center,
        top: size + 16,
        fontSize: 9,
        fontWeight: "bold",
        fill: "#475569",
        originX: "center",
    });
    objs.push(arrowText);

    const spinnerGroup = new fabric.Group(objs, {
        left: 80,
        top: 80,
        selectable: true,
        subTargetCheck: true,
    });
    (spinnerGroup as any).customType = "printable-spinner";
    return spinnerGroup;
}

/**
 * Generates a 2x2 grid of printable Game Task / Question Cards.
 */
export function generatePrintableCardsGroup(): fabric.Group {
    const objs: fabric.Object[] = [];
    const cardW = 160;
    const cardH = 110;
    const gap = 16;

    const cardsData = [
        { type: "❓ QUESTION CARD", color: "#3b82f6", bg: "#eff6ff" },
        { type: "⚔️ CHALLENGE CARD", color: "#e11d48", bg: "#fff1f2" },
        { type: "🚀 BONUS CARD", color: "#10b981", bg: "#ecfdf5" },
        { type: "🃏 CHANCE CARD", color: "#8b5cf6", bg: "#f5f3ff" },
    ];

    cardsData.forEach((card, idx) => {
        const row = Math.floor(idx / 2);
        const col = idx % 2;
        const x = col * (cardW + gap);
        const y = row * (cardH + gap);

        const cardBg = new fabric.Rect({
            left: x,
            top: y,
            width: cardW,
            height: cardH,
            rx: 12,
            ry: 12,
            fill: card.bg,
            stroke: card.color,
            strokeWidth: 2,
        });
        objs.push(cardBg);

        const header = new fabric.IText(card.type, {
            left: x + cardW / 2,
            top: y + 10,
            fontSize: 10,
            fontWeight: "bold",
            fill: card.color,
            originX: "center",
        });
        objs.push(header);

        // Ruled writing lines
        for (let l = 0; l < 3; l++) {
            const line = new fabric.Line([x + 14, y + 36 + l * 18, x + cardW - 14, y + 36 + l * 18], {
                stroke: "#cbd5e1",
                strokeWidth: 1,
                strokeDashArray: [4, 4],
            });
            objs.push(line);
        }
    });

    const cardsGroup = new fabric.Group(objs, {
        left: 80,
        top: 80,
        selectable: true,
        subTargetCheck: true,
    });
    (cardsGroup as any).customType = "printable-cards";
    return cardsGroup;
}

/**
 * Generates 4 printable standing player game tokens with fold bases.
 */
export function generatePrintableTokensGroup(): fabric.Group {
    const objs: fabric.Object[] = [];
    const tokens = [
        { name: "Player 1", icon: "🚀", color: "#ef4444" },
        { name: "Player 2", icon: "🦖", color: "#3b82f6" },
        { name: "Player 3", icon: "🏴‍☠️", color: "#f59e0b" },
        { name: "Player 4", icon: "👑", color: "#10b981" },
    ];

    tokens.forEach((t, i) => {
        const x = i * 75;
        const y = 0;

        // Base Circle Stand
        const circle = new fabric.Circle({
            left: x + 30,
            top: y + 30,
            radius: 26,
            fill: "#ffffff",
            stroke: t.color,
            strokeWidth: 3,
            originX: "center",
            originY: "center",
        });
        objs.push(circle);

        const icon = new fabric.IText(t.icon, {
            left: x + 30,
            top: y + 24,
            fontSize: 22,
            originX: "center",
            originY: "center",
        });
        objs.push(icon);

        const label = new fabric.IText(t.name, {
            left: x + 30,
            top: y + 68,
            fontSize: 9,
            fontWeight: "bold",
            fill: "#1e293b",
            originX: "center",
        });
        objs.push(label);
    });

    const tokensGroup = new fabric.Group(objs, {
        left: 80,
        top: 80,
        selectable: true,
        subTargetCheck: true,
    });
    (tokensGroup as any).customType = "printable-tokens";
    return tokensGroup;
}

/**
 * Generates a sheet of printable play money / cash bills ($1, $5, $10, $20, $50, $100).
 */
export function generatePrintableMoneyGroup(): fabric.Group {
    const objs: fabric.Object[] = [];
    const billW = 140;
    const billH = 70;
    const gapX = 14;
    const gapY = 14;

    const bills = [
        { val: "$1", color: "#15803D", bg: "#F0FDF4", label: "ONE DOLLAR" },
        { val: "$5", color: "#1E40AF", bg: "#EFF6FF", label: "FIVE DOLLARS" },
        { val: "$10", color: "#B45309", bg: "#FFFBEB", label: "TEN DOLLARS" },
        { val: "$20", color: "#047857", bg: "#ECFDF5", label: "TWENTY DOLLARS" },
        { val: "$50", color: "#6B21A8", bg: "#FAF5FF", label: "FIFTY DOLLARS" },
        { val: "$100", color: "#BE185D", bg: "#FDF2F8", label: "ONE HUNDRED" },
    ];

    bills.forEach((b, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = col * (billW + gapX);
        const y = row * (billH + gapY);

        const card = new fabric.Rect({
            left: x, top: y, width: billW, height: billH, rx: 6, ry: 6,
            fill: b.bg, stroke: b.color, strokeWidth: 2,
        });
        const borderInner = new fabric.Rect({
            left: x + 4, top: y + 4, width: billW - 8, height: billH - 8, rx: 4, ry: 4,
            fill: "transparent", stroke: b.color, strokeWidth: 1, strokeDashArray: [3, 2],
        });
        const valLeft = new fabric.IText(b.val, {
            left: x + 12, top: y + 10, fontSize: 14, fontWeight: "900", fill: b.color,
        });
        const valRight = new fabric.IText(b.val, {
            left: x + billW - 12, top: y + billH - 10, fontSize: 14, fontWeight: "900", fill: b.color,
            originX: "right", originY: "bottom",
        });
        const labelText = new fabric.IText(b.label, {
            left: x + billW / 2, top: y + billH / 2, fontSize: 10, fontWeight: "900", fill: b.color,
            originX: "center", originY: "center",
        });

        objs.push(card, borderInner, valLeft, valRight, labelText);
    });

    const moneyGroup = new fabric.Group(objs, {
        left: 80, top: 80, selectable: true, subTargetCheck: true,
    });
    (moneyGroup as any).customType = "printable-money";
    return moneyGroup;
}

/**
 * Generates a printable game score sheet & player score tracker.
 */
export function generatePrintableScorecardGroup(): fabric.Group {
    const objs: fabric.Object[] = [];
    const w = 320;
    const h = 240;

    const bg = new fabric.Rect({
        left: 0, top: 0, width: w, height: h, rx: 12, ry: 12,
        fill: "#FFFDF5", stroke: "#D97706", strokeWidth: 2.5,
    });
    const headerBg = new fabric.Rect({
        left: 0, top: 0, width: w, height: 36, rx: 12, ry: 12,
        fill: "#D97706", stroke: "none", strokeWidth: 0,
    });
    const title = new fabric.IText("🏆 GAME SCORECARD & TRACKER", {
        left: w / 2, top: 18, fontSize: 11, fontWeight: "900", fill: "#ffffff",
        originX: "center", originY: "center",
    });

    objs.push(bg, headerBg, title);

    // Table Grid
    const colW = w / 4;
    const headers = ["PLAYER", "ROUND 1", "ROUND 2", "TOTAL"];
    headers.forEach((hTxt, i) => {
        const hLabel = new fabric.IText(hTxt, {
            left: i * colW + colW / 2, top: 48, fontSize: 9, fontWeight: "900", fill: "#78350F",
            originX: "center", originY: "center",
        });
        objs.push(hLabel);
    });

    // Horizontal & Vertical Grid Lines
    for (let r = 1; r <= 6; r++) {
        const lineY = 40 + r * 28;
        const line = new fabric.Line([12, lineY, w - 12, lineY], {
            stroke: "#FDE68A", strokeWidth: 1.5,
        });
        objs.push(line);
    }
    for (let c = 1; c < 4; c++) {
        const lineX = c * colW;
        const line = new fabric.Line([lineX, 36, lineX, h - 12], {
            stroke: "#FEF3C7", strokeWidth: 1.5,
        });
        objs.push(line);
    }

    const scoreGroup = new fabric.Group(objs, {
        left: 80, top: 80, selectable: true, subTargetCheck: true,
    });
    (scoreGroup as any).customType = "printable-scorecard";
    return scoreGroup;
}

// Connect the Dots Generator
export function generateConnectDotsComponentGroups(config: ConnectDotsConfig): {
    titleGroup: fabric.FabricObject | null;
    dotsGroup: fabric.FabricObject;
} {
    const generation = generateConnectDots(config);
    const { points, lines } = generation;

    const objs: fabric.FabricObject[] = [];

    // Title
    let titleGroup: fabric.FabricObject | null = null;
    if (config.title) {
        const titleText = new fabric.IText(config.title, {
            left: 0,
            top: 0,
            fontSize: 24,
            fontFamily: "Inter",
            fontWeight: "bold",
            fill: "#0f172a",
        });
        objs.push(titleText);

        if (config.subtitle) {
            const subtitleText = new fabric.IText(config.subtitle, {
                left: 0,
                top: 35,
                fontSize: 14,
                fontFamily: "Inter",
                fill: "#64748b",
            });
            objs.push(subtitleText);
        }

        titleGroup = new fabric.Group(objs.slice(0, objs.length), { left: 60, top: 50 });
    }

    // Dots and Lines Group
    const dotsObjs: fabric.FabricObject[] = [];

    // Add uploaded image if available (manual mode)
    if (config.shape === "custom" && (config as any).imageDataUrl) {
        // For now, skip image rendering to ensure points work first
        // TODO: Implement proper async image loading
    }

    // Background
    if (config.showBackground) {
        const bgRect = new fabric.Rect({
            left: 0,
            top: 0,
            width: config.canvasWidth,
            height: config.canvasHeight,
            fill: config.backgroundColor,
        });
        dotsObjs.push(bgRect);
    }

    // Draw SVG path if available and showPath is true
    if (config.showPath && config.svgPathData) {
        const pathObj = new fabric.Path(config.svgPathData, {
            left: 0,
            top: 0,
            stroke: "#94a3b8",
            strokeWidth: 1,
            fill: "transparent",
        });
        dotsObjs.push(pathObj);
    }

    // Draw lines (solution or guide)
    if (config.showLines || config.showSolution) {
        lines.forEach((line) => {
            const fromPoint = points[line.from];
            const toPoint = points[line.to];
            const lineObj = new fabric.Line(
                [fromPoint.x, fromPoint.y, toPoint.x, toPoint.y],
                {
                    stroke: config.showSolution ? config.solutionColor : config.lineColor,
                    strokeWidth: config.lineWidth,
                }
            );
            dotsObjs.push(lineObj);
        });
    }

    // Draw dots
    points.forEach((point) => {
        const dot = new fabric.Circle({
            left: point.x - config.dotSize / 2,
            top: point.y - config.dotSize / 2,
            radius: config.dotSize / 2,
            fill: config.dotColor,
            originX: "center",
            originY: "center",
        });
        dotsObjs.push(dot);

        // Draw numbers/labels
        if (config.showNumbers) {
            let labelText = point.number.toString();
            
            // Use custom label function if provided
            if (config.labelFunction) {
                try {
                    const result = config.labelFunction(0, point.number - 1);
                    if (result !== undefined && result !== null) {
                        labelText = String(result);
                    }
                } catch (e) {
                    console.error('Error applying label function:', e);
                }
            }
            
            // Ensure labelText is a valid string
            if (!labelText || typeof labelText !== 'string') {
                labelText = point.number.toString();
            }
            
            // Use custom label position if available, otherwise use default offsets
            const labelX = point.customLabelX !== undefined ? point.customLabelX : point.x + config.numberOffsetX;
            const labelY = point.customLabelY !== undefined ? point.customLabelY : point.y + config.numberOffsetY;
            
            const numberText = new fabric.IText(labelText, {
                left: labelX,
                top: labelY,
                fontSize: config.fontSize,
                fontFamily: "Inter",
                fontWeight: "bold",
                fill: config.fontColor,
            });
            dotsObjs.push(numberText);
        }
    });

    const dotsGroup = new fabric.Group(dotsObjs, { left: 60, top: 120 });

    return { titleGroup, dotsGroup };
}

export function generateConnectDotsObjects(config: ConnectDotsConfig): fabric.FabricObject[] {
    const { titleGroup, dotsGroup } = generateConnectDotsComponentGroups(config);
    const objects: fabric.FabricObject[] = [];
    if (titleGroup) objects.push(titleGroup);
    objects.push(dotsGroup);

    objects.forEach((obj) => {
        attachPuzzleMetadata(obj, "connect-dots", "ConnectDots", config);
    });

    return objects;
}

