import * as fabric from "fabric";

/* ──────────────────────────────────────────────────────────────────
 *  Board Game Template Engine
 *  Generates rich, print-quality board game groups for the
 *  Worksheet Builder canvas.
 * ────────────────────────────────────────────────────────────────── */

export type BoardTemplateId =
    | "winding-path"
    | "monopoly"
    | "ludo"
    | "checkerboard"
    | "battleship";

export const BOARD_TEMPLATES: { id: BoardTemplateId; name: string; icon: string; desc: string }[] = [
    { id: "winding-path",   name: "Winding Path",      icon: "🎲", desc: "Candy Land / Crazy Race style winding S-curve" },
    { id: "monopoly",       name: "Property Board",     icon: "🏠", desc: "Monopoly-style perimeter property board" },
    { id: "ludo",           name: "Ludo / Parcheesi",   icon: "🎯", desc: "4-player cross board with home paths" },
    { id: "checkerboard",   name: "Checkerboard",       icon: "♟️", desc: "8×8 alternating grid for chess / checkers" },
    { id: "battleship",     name: "Battleship",         icon: "⚓", desc: "Classic naval combat grid with fleet deployment" },
];

export interface BoardTemplateConfig {
    template: BoardTemplateId;
    title: string;
    subtitle?: string;
    totalSpaces?: number;
    showNumbers?: boolean;
}

// ─── Color Palettes ─────────────────────────────────────────────
const VIVID = ["#E53935","#F57C00","#FDD835","#43A047","#1E88E5","#7B1FA2","#C2185B","#00838F"];
const MONOPOLY_GROUPS = ["#8B4513","#87CEEB","#C2185B","#F57C00","#E53935","#FDD835","#43A047","#1E88E5"];

// ─── Utility: shadow preset ────────────────────────────────────
const tileShadow = () => new fabric.Shadow({ color: "rgba(0,0,0,0.18)", blur: 4, offsetX: 0, offsetY: 2 });
const boardShadow = () => new fabric.Shadow({ color: "rgba(0,0,0,0.22)", blur: 24, offsetX: 0, offsetY: 8 });

/* ════════════════════════════════════════════════════════════════
 *  1.  WINDING PATH  (Candy Land / Crazy Race)
 * ════════════════════════════════════════════════════════════════ */
export function generateWindingPathBoard(config: BoardTemplateConfig): fabric.Group {
    const total = config.totalSpaces || 30;
    const bW = 560, bH = 700;
    const tS = 44;                       // tile size
    const cols = 7;
    const rows = Math.ceil(total / cols);

    const hW = bW / 2, hH = bH / 2;
    const lX = -hW + 60, rX = hW - 60;
    const tY = -hH + 110, bY = hH - 50;
    const usH = bY - tY;
    const rSp = rows > 1 ? usH / (rows - 1) : 0;
    const cSp = cols > 1 ? (rX - lX) / (cols - 1) : 0;

    const objs: fabric.Object[] = [];

    // Board card background with gradient-like effect
    objs.push(new fabric.Rect({
        left: 0, top: 0, width: bW, height: bH,
        rx: 18, ry: 18,
        fill: "#FFF9E6", stroke: "#8B4513", strokeWidth: 6,
        originX: "center", originY: "center",
        shadow: boardShadow(),
    }));

    // Decorative border pattern
    const borderColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"];
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const x = Math.cos(angle) * (bW / 2 - 15);
        const y = Math.sin(angle) * (bH / 2 - 15);
        objs.push(new fabric.Circle({
            left: x, top: y,
            radius: 6,
            fill: borderColors[i % borderColors.length],
            originX: "center", originY: "center",
        }));
    }

    // Title banner with decorative design
    objs.push(new fabric.Rect({
        left: 0, top: -hH + 45,
        width: bW - 50, height: 56,
        rx: 14, ry: 14,
        fill: "linear-gradient(90deg, #FF6B6B, #4ECDC4)",
        stroke: "#8B4513", strokeWidth: 3,
        originX: "center", originY: "center",
        shadow: new fabric.Shadow({ color: "rgba(0,0,0,0.15)", blur: 8, offsetX: 0, offsetY: 4 }),
    }));
    objs.push(new fabric.IText(config.title.toUpperCase(), {
        left: 0, top: -hH + 37,
        fontSize: 22, fontWeight: "900",
        fontFamily: "Impact, Arial Black, sans-serif",
        fill: "#2C3E50",
        originX: "center", originY: "center",
        shadow: new fabric.Shadow({ color: "rgba(255,255,255,0.5)", blur: 2, offsetX: 1, offsetY: 1 }),
    }));
    if (config.subtitle) {
        objs.push(new fabric.IText(config.subtitle, {
            left: 0, top: -hH + 58,
            fontSize: 11, fontWeight: "bold",
            fontFamily: "Inter, Arial, sans-serif",
            fill: "#34495E",
            originX: "center", originY: "center",
        }));
    }

    // Tile positions (serpentine with curved path)
    const tiles: { x: number; y: number }[] = [];
    for (let i = 0; i < total; i++) {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const even = r % 2 === 0;
        const col = even ? c : cols - 1 - c;
        
        // Add slight curve to positions for more organic feel
        const curveOffset = Math.sin(i * 0.3) * 8;
        tiles.push({ x: lX + col * cSp + curveOffset, y: bY - r * rSp });
    }

    // Build curved SVG path for the track with smooth bezier curves
    if (tiles.length >= 2) {
        let d = `M ${tiles[0].x.toFixed(1)} ${tiles[0].y.toFixed(1)}`;
        for (let i = 1; i < tiles.length; i++) {
            const prev = tiles[i - 1], curr = tiles[i];
            const pR = Math.floor((i - 1) / cols), cR = Math.floor(i / cols);
            if (pR !== cR) {
                // Smooth curved turn
                const turnR = 45;
                const right = pR % 2 === 0;
                const cpX = right ? Math.max(prev.x, curr.x) + turnR : Math.min(prev.x, curr.x) - turnR;
                const midY = (prev.y + curr.y) / 2;
                d += ` C ${cpX.toFixed(1)} ${prev.y.toFixed(1)}, ${cpX.toFixed(1)} ${curr.y.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
            } else {
                // Smooth curve between adjacent tiles
                const midX = (prev.x + curr.x) / 2;
                const midY = (prev.y + curr.y) / 2;
                d += ` Q ${midX.toFixed(1)} ${midY.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
            }
        }

        // Track with gradient-like layered strokes
        const trackColors = ["#8B4513", "#D2691E", "#DEB887"];
        trackColors.forEach((color, idx) => {
            objs.push(new fabric.Path(d, {
                fill: "none", stroke: color,
                strokeWidth: tS + 18 - idx * 6,
                strokeLineCap: "round", strokeLineJoin: "round",
                originX: "center", originY: "center",
                opacity: 1 - idx * 0.2,
            }));
        });
    }

    // Draw tiles with enhanced design
    tiles.forEach((p, idx) => {
        const isStart = idx === 0;
        const isFin = idx === total - 1;
        const color = isStart ? "#27AE60" : isFin ? "#E74C3C" : VIVID[idx % VIVID.length];

        // Tile with shadow and border
        objs.push(new fabric.Rect({
            left: p.x, top: p.y,
            width: tS, height: tS,
            rx: 8, ry: 8,
            fill: color, stroke: "#2C3E50",
            strokeWidth: isStart || isFin ? 4 : 2,
            originX: "center", originY: "center",
            shadow: new fabric.Shadow({ color: "rgba(0,0,0,0.3)", blur: 4, offsetX: 2, offsetY: 2 }),
        }));

        // Inner highlight for 3D effect
        objs.push(new fabric.Rect({
            left: p.x, top: p.y,
            width: tS - 8, height: tS - 8,
            rx: 4, ry: 4,
            fill: "transparent", stroke: "rgba(255,255,255,0.4)",
            strokeWidth: 2,
            originX: "center", originY: "center",
        }));

        if (isStart) {
            objs.push(new fabric.IText("▶ START", {
                left: p.x, top: p.y,
                fontSize: 8, fontWeight: "900", fill: "#fff",
                originX: "center", originY: "center",
                shadow: new fabric.Shadow({ color: "rgba(0,0,0,0.5)", blur: 2, offsetX: 0, offsetY: 1 }),
            }));
        } else if (isFin) {
            objs.push(new fabric.IText("🏁 FINISH", {
                left: p.x, top: p.y,
                fontSize: 7, fontWeight: "900", fill: "#fff",
                originX: "center", originY: "center",
                shadow: new fabric.Shadow({ color: "rgba(0,0,0,0.5)", blur: 2, offsetX: 0, offsetY: 1 }),
            }));
        } else if (config.showNumbers !== false) {
            objs.push(new fabric.IText(`${idx + 1}`, {
                left: p.x, top: p.y,
                fontSize: 15, fontWeight: "900", fill: "#fff",
                originX: "center", originY: "center",
                shadow: new fabric.Shadow({ color: "rgba(0,0,0,0.4)", blur: 3, offsetX: 0, offsetY: 1 }),
            }));
        }

        // Decorative elements on special spaces
        if (!isStart && !isFin && (idx + 1) % 5 === 0) {
            objs.push(new fabric.IText("⭐", {
                left: p.x, top: p.y - tS / 2 - 10,
                fontSize: 14, originX: "center", originY: "center",
            }));
        }
        
        // Add small decorative dots on every 3rd space
        if (!isStart && !isFin && (idx + 1) % 3 === 0) {
            objs.push(new fabric.Circle({
                left: p.x + tS / 2 - 5, top: p.y + tS / 2 - 5,
                radius: 3,
                fill: "rgba(255,255,255,0.6)",
                originX: "center", originY: "center",
            }));
        }
    });

    // Instructions footer with styled background
    objs.push(new fabric.Rect({
        left: 0, top: hH - 35,
        width: bW - 60, height: 24,
        rx: 8, ry: 8,
        fill: "#F8F9FA", stroke: "#DEE2E6", strokeWidth: 1,
        originX: "center", originY: "center",
    }));
    objs.push(new fabric.IText("🎲 Roll dice → Move → First to FINISH wins! 🏆", {
        left: 0, top: hH - 35,
        fontSize: 10, fontWeight: "bold", fontStyle: "italic",
        fill: "#495057", originX: "center", originY: "center",
    }));

    const group = new fabric.Group(objs, {
        left: 100, top: 50, selectable: true, subTargetCheck: true,
    });
    (group as any).customType = "board-game-template";
    (group as any).templateType = config.template;
    return group;
}


/* ════════════════════════════════════════════════════════════════
 *  3.  MONOPOLY / PROPERTY BOARD
 * ════════════════════════════════════════════════════════════════ */
export function generateMonopolyBoard(config: BoardTemplateConfig): fabric.Group {
    const bW = 600, bH = 600;
    const hW = bW / 2, hH = bH / 2;
    const cornerSize = 72;
    const sideSpaces = 9;                                 // per side
    const propW = (bW - cornerSize * 2) / sideSpaces;    // ~50.7
    const propH = cornerSize;

    const objs: fabric.Object[] = [];

    // Board background
    objs.push(new fabric.Rect({
        left: 0, top: 0, width: bW, height: bH,
        rx: 6, ry: 6,
        fill: "#C8E6C9", stroke: "#1B5E20", strokeWidth: 6,
        originX: "center", originY: "center",
        shadow: boardShadow(),
    }));

    // Inner area (lighter)
    objs.push(new fabric.Rect({
        left: 0, top: 0,
        width: bW - cornerSize * 2, height: bH - cornerSize * 2,
        fill: "#E8F5E9", stroke: "#2E7D32", strokeWidth: 1.5,
        originX: "center", originY: "center",
    }));

    // Center title
    objs.push(new fabric.IText(config.title.toUpperCase(), {
        left: 0, top: -20,
        fontSize: 28, fontWeight: "900",
        fontFamily: "Impact, Arial Black, sans-serif",
        fill: "#1B5E20", originX: "center", originY: "center",
    }));
    if (config.subtitle) {
        objs.push(new fabric.IText(config.subtitle, {
            left: 0, top: 10,
            fontSize: 11, fontWeight: "bold", fill: "#4CAF50",
            originX: "center", originY: "center",
        }));
    }

    // Center decorative dice
    objs.push(new fabric.IText("🎲", {
        left: -20, top: 40, fontSize: 28,
        originX: "center", originY: "center",
    }));
    objs.push(new fabric.IText("🎲", {
        left: 20, top: 45, fontSize: 24,
        originX: "center", originY: "center",
    }));

    // Property names (generic)
    const sideNames = [
        // Bottom side (right to left)
        ["Park Place","Boardwalk","Luxury Tax","Ocean Ave","Water Works","Palm Dr","Sunset Blvd","Maple St","Main St"],
        // Left side (bottom to top)
        ["1st Ave","2nd Ave","Income Tax","3rd Ave","Railroad","4th Ave","5th Ave","Electric Co","6th Ave"],
        // Top side (left to right)
        ["7th Ave","8th Ave","Community","9th Ave","Chance","10th Ave","11th Ave","12th Ave","Go Ahead"],
        // Right side (top to bottom)
        ["13th Ave","14th Ave","Penalty","15th Ave","Railroad","16th Ave","17th Ave","Free Park","18th Ave"],
    ];

    const groupColors = [
        ["#8B4513","#8B4513","#9E9E9E","#87CEEB","#87CEEB","#C2185B","#C2185B","#C2185B","#F57C00"],
        ["#F57C00","#F57C00","#9E9E9E","#E53935","#9E9E9E","#E53935","#E53935","#9E9E9E","#FDD835"],
        ["#FDD835","#FDD835","#9E9E9E","#43A047","#9E9E9E","#43A047","#43A047","#1E88E5","#1E88E5"],
        ["#1E88E5","#7B1FA2","#9E9E9E","#7B1FA2","#9E9E9E","#FF9800","#FF9800","#9E9E9E","#FF9800"],
    ];

    // Corner spaces
    const corners = [
        { x: hW - cornerSize / 2, y: hH - cornerSize / 2, label: "GO", icon: "➡️", bg: "#FFF9C4" },
        { x: -hW + cornerSize / 2, y: hH - cornerSize / 2, label: "JAIL", icon: "🔒", bg: "#FFCDD2" },
        { x: -hW + cornerSize / 2, y: -hH + cornerSize / 2, label: "FREE\nPARKING", icon: "🅿️", bg: "#C8E6C9" },
        { x: hW - cornerSize / 2, y: -hH + cornerSize / 2, label: "GO TO\nJAIL", icon: "👮", bg: "#FFCDD2" },
    ];

    corners.forEach(c => {
        objs.push(new fabric.Rect({
            left: c.x, top: c.y,
            width: cornerSize - 2, height: cornerSize - 2,
            rx: 4, ry: 4,
            fill: c.bg, stroke: "#333", strokeWidth: 2,
            originX: "center", originY: "center",
        }));
        objs.push(new fabric.IText(c.icon, {
            left: c.x, top: c.y - 10,
            fontSize: 18, originX: "center", originY: "center",
        }));
        objs.push(new fabric.IText(c.label, {
            left: c.x, top: c.y + 14,
            fontSize: 7, fontWeight: "900", fill: "#333",
            textAlign: "center",
            originX: "center", originY: "center",
        }));
    });

    // ─── Bottom side (right to left) ───
    for (let i = 0; i < sideSpaces; i++) {
        const x = hW - cornerSize - propW * (i + 0.5);
        const y = hH - propH / 2;

        objs.push(new fabric.Rect({
            left: x, top: y,
            width: propW - 1.5, height: propH - 2,
            fill: "#FFFDE7", stroke: "#333", strokeWidth: 1.5,
            originX: "center", originY: "center",
        }));
        // Color band at top
        objs.push(new fabric.Rect({
            left: x, top: y - propH / 2 + 9,
            width: propW - 3, height: 16,
            fill: groupColors[0][i], stroke: "#333", strokeWidth: 1,
            originX: "center", originY: "center",
        }));
        objs.push(new fabric.IText(sideNames[0][i], {
            left: x, top: y + 8,
            fontSize: 5, fontWeight: "bold", fill: "#333",
            textAlign: "center",
            originX: "center", originY: "center",
        }));
    }

    // ─── Left side (bottom to top) ───
    for (let i = 0; i < sideSpaces; i++) {
        const x = -hW + propH / 2;
        const y = hH - cornerSize - propW * (i + 0.5);

        objs.push(new fabric.Rect({
            left: x, top: y,
            width: propH - 2, height: propW - 1.5,
            fill: "#FFFDE7", stroke: "#333", strokeWidth: 1.5,
            originX: "center", originY: "center",
        }));
        // Color band on right edge
        objs.push(new fabric.Rect({
            left: x + propH / 2 - 9, top: y,
            width: 16, height: propW - 3,
            fill: groupColors[1][i], stroke: "#333", strokeWidth: 1,
            originX: "center", originY: "center",
        }));
        objs.push(new fabric.IText(sideNames[1][i], {
            left: x - 6, top: y,
            fontSize: 5, fontWeight: "bold", fill: "#333",
            textAlign: "center", angle: 90,
            originX: "center", originY: "center",
        }));
    }

    // ─── Top side (left to right) ───
    for (let i = 0; i < sideSpaces; i++) {
        const x = -hW + cornerSize + propW * (i + 0.5);
        const y = -hH + propH / 2;

        objs.push(new fabric.Rect({
            left: x, top: y,
            width: propW - 1.5, height: propH - 2,
            fill: "#FFFDE7", stroke: "#333", strokeWidth: 1.5,
            originX: "center", originY: "center",
        }));
        // Color band at bottom
        objs.push(new fabric.Rect({
            left: x, top: y + propH / 2 - 9,
            width: propW - 3, height: 16,
            fill: groupColors[2][i], stroke: "#333", strokeWidth: 1,
            originX: "center", originY: "center",
        }));
        objs.push(new fabric.IText(sideNames[2][i], {
            left: x, top: y - 8,
            fontSize: 5, fontWeight: "bold", fill: "#333",
            textAlign: "center",
            originX: "center", originY: "center",
        }));
    }

    // ─── Right side (top to bottom) ───
    for (let i = 0; i < sideSpaces; i++) {
        const x = hW - propH / 2;
        const y = -hH + cornerSize + propW * (i + 0.5);

        objs.push(new fabric.Rect({
            left: x, top: y,
            width: propH - 2, height: propW - 1.5,
            fill: "#FFFDE7", stroke: "#333", strokeWidth: 1.5,
            originX: "center", originY: "center",
        }));
        // Color band on left edge
        objs.push(new fabric.Rect({
            left: x - propH / 2 + 9, top: y,
            width: 16, height: propW - 3,
            fill: groupColors[3][i], stroke: "#333", strokeWidth: 1,
            originX: "center", originY: "center",
        }));
        objs.push(new fabric.IText(sideNames[3][i], {
            left: x + 6, top: y,
            fontSize: 5, fontWeight: "bold", fill: "#333",
            textAlign: "center", angle: -90,
            originX: "center", originY: "center",
        }));
    }

    const group = new fabric.Group(objs, {
        left: 100, top: 50, selectable: true, subTargetCheck: true,
    });
    (group as any).customType = "board-game-template";
    (group as any).templateType = config.template;
    return group;
}


/* ════════════════════════════════════════════════════════════════
 *  4.  LUDO / PARCHEESI
 * ════════════════════════════════════════════════════════════════ */
export function generateLudoBoard(config: BoardTemplateConfig): fabric.Group {
    const bW = 560, bH = 560;
    const hW = bW / 2, hH = bH / 2;
    const cell = 32;                                       // track cell size
    const armW = cell * 3;                                 // width of each arm
    const armL = cell * 6;                                 // length of each arm
    const homeR = armW / 2 + 4;                            // center home radius

    const objs: fabric.Object[] = [];

    // Board background
    objs.push(new fabric.Rect({
        left: 0, top: 0, width: bW, height: bH,
        rx: 12, ry: 12,
        fill: "#FAFAFA", stroke: "#222", strokeWidth: 5,
        originX: "center", originY: "center",
        shadow: boardShadow(),
    }));

    const quadrants = [
        { color: "#F44336", lightColor: "#FFCDD2", label: "RED",    dx: -1, dy: -1 },
        { color: "#2196F3", lightColor: "#BBDEFB", label: "BLUE",   dx: 1,  dy: -1 },
        { color: "#4CAF50", lightColor: "#C8E6C9", label: "GREEN",  dx: -1, dy: 1 },
        { color: "#FFC107", lightColor: "#FFF9C4", label: "YELLOW", dx: 1,  dy: 1 },
    ];

    const qSize = (bW - armW) / 2 - 10;

    // 4 colored quadrant backgrounds
    quadrants.forEach(q => {
        const cx = q.dx * (armW / 2 + qSize / 2 + 5);
        const cy = q.dy * (armW / 2 + qSize / 2 + 5);

        // Quadrant box
        objs.push(new fabric.Rect({
            left: cx, top: cy,
            width: qSize, height: qSize,
            rx: 8, ry: 8,
            fill: q.lightColor, stroke: q.color, strokeWidth: 3,
            originX: "center", originY: "center",
        }));

        // Home circle spots (4 per quadrant)
        const spotR = 14;
        const offsets = [
            { x: -qSize / 4, y: -qSize / 4 },
            { x: qSize / 4, y: -qSize / 4 },
            { x: -qSize / 4, y: qSize / 4 },
            { x: qSize / 4, y: qSize / 4 },
        ];
        offsets.forEach(off => {
            objs.push(new fabric.Circle({
                left: cx + off.x, top: cy + off.y,
                radius: spotR,
                fill: "#fff", stroke: q.color, strokeWidth: 2.5,
                originX: "center", originY: "center",
                shadow: tileShadow(),
            }));
            objs.push(new fabric.Circle({
                left: cx + off.x, top: cy + off.y,
                radius: spotR - 5,
                fill: q.color, stroke: "none", strokeWidth: 0,
                originX: "center", originY: "center",
            }));
        });

        // Quadrant label
        objs.push(new fabric.IText(q.label, {
            left: cx, top: cy,
            fontSize: 12, fontWeight: "900", fill: q.color,
            originX: "center", originY: "center",
            opacity: 0.4,
        }));
    });

    // ─── Cross arms (track paths) ───
    // Each arm is 3 cells wide × 6 cells long
    // Top arm
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 3; c++) {
            const x = (c - 1) * cell;
            const y = -(armW / 2 + (r + 0.5) * cell);
            const isHome = c === 1;
            const fillColor = isHome && r < 5 ? "#F44336" : (r + c) % 2 === 0 ? "#fff" : "#f5f5f5";
            objs.push(new fabric.Rect({
                left: x, top: y,
                width: cell - 1, height: cell - 1,
                fill: fillColor, stroke: "#999", strokeWidth: 1,
                originX: "center", originY: "center",
            }));
        }
    }
    // Bottom arm
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 3; c++) {
            const x = (c - 1) * cell;
            const y = armW / 2 + (r + 0.5) * cell;
            const isHome = c === 1;
            const fillColor = isHome && r < 5 ? "#4CAF50" : (r + c) % 2 === 0 ? "#fff" : "#f5f5f5";
            objs.push(new fabric.Rect({
                left: x, top: y,
                width: cell - 1, height: cell - 1,
                fill: fillColor, stroke: "#999", strokeWidth: 1,
                originX: "center", originY: "center",
            }));
        }
    }
    // Left arm
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 3; c++) {
            const x = -(armW / 2 + (r + 0.5) * cell);
            const y = (c - 1) * cell;
            const isHome = c === 1;
            const fillColor = isHome && r < 5 ? "#2196F3" : (r + c) % 2 === 0 ? "#fff" : "#f5f5f5";
            objs.push(new fabric.Rect({
                left: x, top: y,
                width: cell - 1, height: cell - 1,
                fill: fillColor, stroke: "#999", strokeWidth: 1,
                originX: "center", originY: "center",
            }));
        }
    }
    // Right arm
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 3; c++) {
            const x = armW / 2 + (r + 0.5) * cell;
            const y = (c - 1) * cell;
            const isHome = c === 1;
            const fillColor = isHome && r < 5 ? "#FFC107" : (r + c) % 2 === 0 ? "#fff" : "#f5f5f5";
            objs.push(new fabric.Rect({
                left: x, top: y,
                width: cell - 1, height: cell - 1,
                fill: fillColor, stroke: "#999", strokeWidth: 1,
                originX: "center", originY: "center",
            }));
        }
    }

    // Center home triangle/circle
    objs.push(new fabric.Circle({
        left: 0, top: 0,
        radius: armW / 2 + 2,
        fill: "#fff", stroke: "#333", strokeWidth: 2,
        originX: "center", originY: "center",
    }));

    // Center triangles (one per player color)
    const triColors = ["#F44336", "#2196F3", "#4CAF50", "#FFC107"];
    const triAngles = [0, 90, 180, 270];
    triColors.forEach((col, idx) => {
        const angle = triAngles[idx];
        const rad = (angle * Math.PI) / 180;
        const tipX = Math.sin(rad) * (armW / 2 - 8);
        const tipY = -Math.cos(rad) * (armW / 2 - 8);

        objs.push(new fabric.Circle({
            left: tipX * 0.4, top: tipY * 0.4,
            radius: 8,
            fill: col, stroke: "#fff", strokeWidth: 2,
            originX: "center", originY: "center",
        }));
    });

    // Star in center
    objs.push(new fabric.IText("⭐", {
        left: 0, top: 0, fontSize: 18,
        originX: "center", originY: "center",
    }));

    // Title at bottom
    objs.push(new fabric.IText(config.title.toUpperCase(), {
        left: 0, top: hH - 18,
        fontSize: 14, fontWeight: "900",
        fontFamily: "Impact, Arial Black, sans-serif",
        fill: "#333", originX: "center", originY: "center",
    }));

    const group = new fabric.Group(objs, {
        left: 100, top: 50, selectable: true, subTargetCheck: true,
    });
    (group as any).customType = "board-game-template";
    (group as any).templateType = config.template;
    return group;
}


/* ════════════════════════════════════════════════════════════════
 *  5.  CHECKERBOARD  (Chess / Checkers)
 * ════════════════════════════════════════════════════════════════ */
export function generateCheckerboard(config: BoardTemplateConfig): fabric.Group {
    const gridSize = 8;
    const cell = 56;
    const boardPx = gridSize * cell;
    const bW = boardPx + 60, bH = boardPx + 100;
    const hW = bW / 2, hH = bH / 2;

    const objs: fabric.Object[] = [];

    // Outer board (wood-like)
    objs.push(new fabric.Rect({
        left: 0, top: 0, width: bW, height: bH,
        rx: 8, ry: 8,
        fill: "#8D6E63", stroke: "#4E342E", strokeWidth: 5,
        originX: "center", originY: "center",
        shadow: boardShadow(),
    }));

    // Title
    objs.push(new fabric.IText(config.title.toUpperCase(), {
        left: 0, top: -hH + 22,
        fontSize: 18, fontWeight: "900",
        fontFamily: "Impact, Arial Black, sans-serif",
        fill: "#FFF8E1", originX: "center", originY: "center",
    }));

    // Grid start (top-left in centered coords)
    const gridStartX = -boardPx / 2;
    const gridStartY = -boardPx / 2 + 20;

    const darkColor = "#B71C1C";
    const lightColor = "#FFECB3";

    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const isDark = (r + c) % 2 === 1;
            const cx = gridStartX + c * cell + cell / 2;
            const cy = gridStartY + r * cell + cell / 2;

            objs.push(new fabric.Rect({
                left: cx, top: cy,
                width: cell - 1, height: cell - 1,
                fill: isDark ? darkColor : lightColor,
                stroke: "#333", strokeWidth: 1,
                originX: "center", originY: "center",
            }));
        }
    }

    // Border around grid
    objs.push(new fabric.Rect({
        left: 0, top: gridStartY + boardPx / 2,
        width: boardPx + 4, height: boardPx + 4,
        fill: "transparent", stroke: "#3E2723", strokeWidth: 3,
        originX: "center", originY: "center",
    }));

    // Column labels (a–h)
    const cols = "abcdefgh";
    for (let c = 0; c < gridSize; c++) {
        const cx = gridStartX + c * cell + cell / 2;
        objs.push(new fabric.IText(cols[c], {
            left: cx, top: gridStartY + boardPx + 14,
            fontSize: 12, fontWeight: "bold", fill: "#FFF8E1",
            originX: "center", originY: "center",
        }));
    }
    // Row labels (1–8)
    for (let r = 0; r < gridSize; r++) {
        const cy = gridStartY + r * cell + cell / 2;
        objs.push(new fabric.IText(`${gridSize - r}`, {
            left: gridStartX - 16, top: cy,
            fontSize: 12, fontWeight: "bold", fill: "#FFF8E1",
            originX: "center", originY: "center",
        }));
    }

    const group = new fabric.Group(objs, {
        left: 100, top: 50, selectable: true, subTargetCheck: true,
    });
    (group as any).customType = "board-game-template";
    (group as any).templateType = config.template;
    return group;
}


/* ════════════════════════════════════════════════════════════════
 *  6.  BATTLESHIP  (Naval Combat Grid)
 * ════════════════════════════════════════════════════════════════ */
export function generateBattleshipBoard(config: BoardTemplateConfig): fabric.Group {
    const gridSize = 10;
    const cellSize = 42;
    const boardPx = gridSize * cellSize;
    const bW = boardPx + 120, bH = boardPx + 140;
    const hW = bW / 2, hH = bH / 2;

    const gridLeft = -hW + 60;
    const gridTop = -hH + 70;

    const objs: fabric.Object[] = [];

    // Board background with ocean theme
    objs.push(new fabric.Rect({
        left: 0, top: 0, width: bW, height: bH,
        rx: 16, ry: 16,
        fill: "#E3F2FD", stroke: "#1565C0", strokeWidth: 5,
        originX: "center", originY: "center",
        shadow: boardShadow(),
    }));

    // Decorative wave pattern border
    const waveColors = ["#0288D1", "#03A9F4", "#29B6F6"];
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const x = Math.cos(angle) * (bW / 2 - 12);
        const y = Math.sin(angle) * (bH / 2 - 12);
        objs.push(new fabric.Circle({
            left: x, top: y,
            radius: 5,
            fill: waveColors[i % waveColors.length],
            originX: "center", originY: "center",
        }));
    }

    // Title banner with naval theme
    objs.push(new fabric.Rect({
        left: 0, top: -hH + 30,
        width: bW - 40, height: 44,
        rx: 10, ry: 10,
        fill: "linear-gradient(135deg, #0277BD, #01579B)",
        stroke: "#0D47A1", strokeWidth: 3,
        originX: "center", originY: "center",
        shadow: new fabric.Shadow({ color: "rgba(0,0,0,0.2)", blur: 6, offsetX: 0, offsetY: 3 }),
    }));
    objs.push(new fabric.IText(config.title.toUpperCase(), {
        left: 0, top: -hH + 24,
        fontSize: 18, fontWeight: "900",
        fontFamily: "Impact, Arial Black, sans-serif",
        fill: "#FFFFFF",
        originX: "center", originY: "center",
        shadow: new fabric.Shadow({ color: "rgba(0,0,0,0.3)", blur: 2, offsetX: 1, offsetY: 1 }),
    }));
    objs.push(new fabric.IText("⚓ NAVAL COMBAT", {
        left: 0, top: -hH + 42,
        fontSize: 9, fontWeight: "bold",
        fill: "#81D4FA",
        originX: "center", originY: "center",
    }));

    // Column labels (A-J)
    const cols = "ABCDEFGHIJ";
    for (let c = 0; c < gridSize; c++) {
        const cx = gridLeft + c * cellSize + cellSize / 2;
        objs.push(new fabric.IText(cols[c], {
            left: cx, top: gridTop - 14,
            fontSize: 11, fontWeight: "900", fill: "#0D47A1",
            originX: "center", originY: "center",
        }));
    }

    // Row labels (1-10)
    for (let r = 0; r < gridSize; r++) {
        const cy = gridTop + r * cellSize + cellSize / 2;
        objs.push(new fabric.IText(`${r + 1}`, {
            left: gridLeft - 14, top: cy,
            fontSize: 11, fontWeight: "900", fill: "#0D47A1",
            originX: "center", originY: "center",
        }));
    }

    // Grid cells with alternating pattern
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const cx = gridLeft + c * cellSize + cellSize / 2;
            const cy = gridTop + r * cellSize + cellSize / 2;
            const isEven = (r + c) % 2 === 0;

            objs.push(new fabric.Rect({
                left: cx, top: cy,
                width: cellSize - 1, height: cellSize - 1,
                fill: isEven ? "#FFFFFF" : "#E1F5FE",
                stroke: "#90CAF9", strokeWidth: 1,
                originX: "center", originY: "center",
            }));
        }
    }

    // Grid border
    objs.push(new fabric.Rect({
        left: gridLeft + boardPx / 2, top: gridTop + boardPx / 2,
        width: boardPx + 2, height: boardPx + 2,
        fill: "transparent", stroke: "#0D47A1", strokeWidth: 3,
        originX: "center", originY: "center",
    }));

    // Fleet legend section
    const legendY = gridTop + boardPx + 30;
    objs.push(new fabric.Rect({
        left: 0, top: legendY,
        width: bW - 40, height: 28,
        rx: 6, ry: 6,
        fill: "#F5F5F5", stroke: "#BDBDBD", strokeWidth: 1,
        originX: "center", originY: "center",
    }));

    const ships = [
        { name: "Carrier", size: 5, icon: "🚢" },
        { name: "Battleship", size: 4, icon: "⚓" },
        { name: "Destroyer", size: 3, icon: "⚡" },
        { name: "Submarine", size: 3, icon: "🔱" },
        { name: "Patrol Boat", size: 2, icon: "🛥️" },
    ];

    const legendStartX = -bW / 2 + 30;
    ships.forEach((ship, idx) => {
        const lx = legendStartX + idx * 85;
        objs.push(new fabric.IText(`${ship.icon} ${ship.name}`, {
            left: lx, top: legendY,
            fontSize: 8, fontWeight: "bold", fill: "#424242",
            originX: "center", originY: "center",
        }));
    });

    // Instructions footer
    objs.push(new fabric.IText("🎯 Call shots: A-5, J-10, etc. Sink all enemy ships to win!", {
        left: 0, top: hH - 20,
        fontSize: 9, fontWeight: "bold", fontStyle: "italic",
        fill: "#0277BD", originX: "center", originY: "center",
    }));

    const group = new fabric.Group(objs, {
        left: 100, top: 50, selectable: true, subTargetCheck: true,
    });
    (group as any).customType = "board-game-template";
    (group as any).templateType = config.template;
    return group;
}


/* ════════════════════════════════════════════════════════════════
 *  MASTER DISPATCHER
 * ════════════════════════════════════════════════════════════════ */
export function generateBoardTemplate(config: BoardTemplateConfig): fabric.Group {
    switch (config.template) {
        case "winding-path":   return generateWindingPathBoard(config);
        case "monopoly":       return generateMonopolyBoard(config);
        case "ludo":           return generateLudoBoard(config);
        case "checkerboard":   return generateCheckerboard(config);
        case "battleship":     return generateBattleshipBoard(config);
        default:               return generateWindingPathBoard(config);
    }
}
