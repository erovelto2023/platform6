export type BoardLayoutType =
    | "snake"
    | "spiral"
    | "circle"
    | "race-track"
    | "treasure-map"
    | "figure-eight"
    | "hexagon-grid"
    | "linear"
    | "zigzag"
    | "island-map"
    | "dungeon-crawl"
    | "space-mission"
    | "branching-adventure"
    | "tournament-bracket"
    | "story-tree"
    | "city-grid"
    | "castle-quest"
    | "farm-trail"
    | "mountain-climb"
    | "river-journey"
    | "maze-grid"
    | "classroom-review";

export type BoardThemeId =
    | "candyland"
    | "pirates"
    | "space"
    | "dinosaurs"
    | "castle"
    | "racing"
    | "math-race"
    | "jungle"
    | "dungeon"
    | "cyberpunk"
    | "ocean"
    | "mystic-forest";

export type SpaceType =
    | "start"
    | "finish"
    | "normal"
    | "question"
    | "bonus"
    | "lose-turn"
    | "roll-again"
    | "go-forward"
    | "go-back"
    | "draw-card"
    | "teleport"
    | "treasure";

export type CellShape = "square" | "rounded" | "circle" | "hexagon" | "diamond";

export interface BoardGameSpace {
    id: string;
    number: number;
    type: SpaceType;
    label?: string;
    icon?: string;
    color?: string;
    borderColor?: string;
    textColor?: string;
    x?: number;
    y?: number;
}

export interface BoardGameConfig {
    id?: string;
    title: string;
    subtitle?: string;
    layout: BoardLayoutType;
    theme: BoardThemeId;
    totalSpaces: number;
    cellShape: CellShape;
    cellSize: number;
    showNumbers: boolean;
    showIcons: boolean;
    customSpaces?: BoardGameSpace[];
    customPositions?: { x: number; y: number }[];
    includeDice?: boolean;
    includeSpinner?: boolean;
    includeCards?: boolean;
    includeTokens?: boolean;
}

export interface ThemeDefinition {
    id: BoardThemeId;
    name: string;
    icon: string;
    startColor: string;
    finishColor: string;
    normalColors: string[];
    questionColor: string;
    bonusColor: string;
    penaltyColor: string;
    pathColor: string;
    borderColor: string;
    textColor: string;
    titleColor: string;
    badgeEmoji: string;
}

export const BOARD_GAME_THEMES: Record<BoardThemeId, ThemeDefinition> = {
    candyland: {
        id: "candyland",
        name: "Candy Adventure 🍭",
        icon: "🍭",
        startColor: "#22c55e",
        finishColor: "#eab308",
        normalColors: ["#f472b6", "#38bdf8", "#a78bfa", "#facc15", "#4ade80"],
        questionColor: "#818cf8",
        bonusColor: "#34d399",
        penaltyColor: "#fb7185",
        pathColor: "#fbcfe8",
        borderColor: "#db2777",
        textColor: "#0f172a",
        titleColor: "#be185d",
        badgeEmoji: "🍬",
    },
    pirates: {
        id: "pirates",
        name: "Treasure Cove 🏴‍☠️",
        icon: "🏴‍☠️",
        startColor: "#16a34a",
        finishColor: "#d97706",
        normalColors: ["#fef08a", "#fed7aa", "#e9d5ff", "#cbd5e1"],
        questionColor: "#0284c7",
        bonusColor: "#f59e0b",
        penaltyColor: "#dc2626",
        pathColor: "#fde68a",
        borderColor: "#78350f",
        textColor: "#1e1b4b",
        titleColor: "#92400e",
        badgeEmoji: "💎",
    },
    space: {
        id: "space",
        name: "Cosmic Expedition 🚀",
        icon: "🚀",
        startColor: "#10b981",
        finishColor: "#f59e0b",
        normalColors: ["#38bdf8", "#818cf8", "#c084fc", "#e879f9"],
        questionColor: "#0284c7",
        bonusColor: "#34d399",
        penaltyColor: "#f43f5e",
        pathColor: "#93c5fd",
        borderColor: "#1e1b4b",
        textColor: "#0f172a",
        titleColor: "#4338ca",
        badgeEmoji: "🛸",
    },
    dinosaurs: {
        id: "dinosaurs",
        name: "Dino Island 🦖",
        icon: "🦖",
        startColor: "#16a34a",
        finishColor: "#ca8a04",
        normalColors: ["#a3e635", "#fde047", "#fb923c", "#86efac"],
        questionColor: "#0284c7",
        bonusColor: "#22c55e",
        penaltyColor: "#ef4444",
        pathColor: "#bbf7d0",
        borderColor: "#14532d",
        textColor: "#052e16",
        titleColor: "#15803d",
        badgeEmoji: "🦕",
    },
    castle: {
        id: "castle",
        name: "Medieval Quest 🏰",
        icon: "🏰",
        startColor: "#10b981",
        finishColor: "#eab308",
        normalColors: ["#cbd5e1", "#e2e8f0", "#94a3b8", "#fef08a"],
        questionColor: "#6366f1",
        bonusColor: "#f59e0b",
        penaltyColor: "#e11d48",
        pathColor: "#e2e8f0",
        borderColor: "#334155",
        textColor: "#0f172a",
        titleColor: "#1e293b",
        badgeEmoji: "⚔️",
    },
    racing: {
        id: "racing",
        name: "Speedway Racing 🏎️",
        icon: "🏎️",
        startColor: "#22c55e",
        finishColor: "#ef4444",
        normalColors: ["#ffffff", "#f1f5f9", "#cbd5e1", "#fee2e2"],
        questionColor: "#3b82f6",
        bonusColor: "#10b981",
        penaltyColor: "#dc2626",
        pathColor: "#94a3b8",
        borderColor: "#0f172a",
        textColor: "#0f172a",
        titleColor: "#b91c1c",
        badgeEmoji: "🏁",
    },
    "math-race": {
        id: "math-race",
        name: "Math Challenge 🔢",
        icon: "🔢",
        startColor: "#10b981",
        finishColor: "#f59e0b",
        normalColors: ["#bae6fd", "#c7d2fe", "#ddd6fe", "#fef3c7"],
        questionColor: "#3b82f6",
        bonusColor: "#10b981",
        penaltyColor: "#f43f5e",
        pathColor: "#bfdbfe",
        borderColor: "#1d4ed8",
        textColor: "#0f172a",
        titleColor: "#1e40af",
        badgeEmoji: "➕",
    },
    jungle: {
        id: "jungle",
        name: "Jungle Safari 🌴",
        icon: "🌴",
        startColor: "#16a34a",
        finishColor: "#d97706",
        normalColors: ["#86efac", "#fef08a", "#fed7aa", "#bbf7d0"],
        questionColor: "#0284c7",
        bonusColor: "#22c55e",
        penaltyColor: "#e11d48",
        pathColor: "#dcfce7",
        borderColor: "#166534",
        textColor: "#052e16",
        titleColor: "#14532d",
        badgeEmoji: "🦁",
    },
    dungeon: {
        id: "dungeon",
        name: "Dungeon Vault 🏰",
        icon: "🏰",
        startColor: "#059669",
        finishColor: "#dc2626",
        normalColors: ["#475569", "#64748b", "#334155", "#94a3b8"],
        questionColor: "#7c3aed",
        bonusColor: "#d97706",
        penaltyColor: "#be123c",
        pathColor: "#1e293b",
        borderColor: "#0f172a",
        textColor: "#f8fafc",
        titleColor: "#e2e8f0",
        badgeEmoji: "⚔️",
    },
    cyberpunk: {
        id: "cyberpunk",
        name: "Neon Cyberpunk 🌆",
        icon: "🌆",
        startColor: "#10b981",
        finishColor: "#f43f5e",
        normalColors: ["#06b6d4", "#8b5cf6", "#d946ef", "#3b82f6"],
        questionColor: "#a855f7",
        bonusColor: "#22c55e",
        penaltyColor: "#f43f5e",
        pathColor: "#0f172a",
        borderColor: "#06b6d4",
        textColor: "#ffffff",
        titleColor: "#38bdf8",
        badgeEmoji: "⚡",
    },
    ocean: {
        id: "ocean",
        name: "Oceanic Depths 🌊",
        icon: "🌊",
        startColor: "#0d9488",
        finishColor: "#eab308",
        normalColors: ["#38bdf8", "#7dd3fc", "#0284c7", "#bae6fd"],
        questionColor: "#6366f1",
        bonusColor: "#10b981",
        penaltyColor: "#f43f5e",
        pathColor: "#e0f2fe",
        borderColor: "#0369a1",
        textColor: "#0f172a",
        titleColor: "#0c4a6e",
        badgeEmoji: "🐬",
    },
    "mystic-forest": {
        id: "mystic-forest",
        name: "Mystic Forest 🌲",
        icon: "🌲",
        startColor: "#15803d",
        finishColor: "#d97706",
        normalColors: ["#a7f3d0", "#6ee7b7", "#34d399", "#d9f99d"],
        questionColor: "#8b5cf6",
        bonusColor: "#10b981",
        penaltyColor: "#e11d48",
        pathColor: "#ecfdf5",
        borderColor: "#065f46",
        textColor: "#022c22",
        titleColor: "#047857",
        badgeEmoji: "🍄",
    },
};

export const SPACE_TYPE_METADATA: Record<SpaceType, { name: string; icon: string; defaultLabel: string }> = {
    start: { name: "Start Space", icon: "🚀", defaultLabel: "START" },
    finish: { name: "Finish Space", icon: "🏆", defaultLabel: "FINISH!" },
    normal: { name: "Normal Space", icon: "⭐", defaultLabel: "" },
    question: { name: "Question Space", icon: "❓", defaultLabel: "Ask?" },
    bonus: { name: "Bonus Move", icon: "🚀", defaultLabel: "+2 Move" },
    "lose-turn": { name: "Lose Turn", icon: "🛑", defaultLabel: "Lose Turn" },
    "roll-again": { name: "Roll Again", icon: "🎲", defaultLabel: "Roll Again" },
    "go-forward": { name: "Go Forward", icon: "⏩", defaultLabel: "Forward 3" },
    "go-back": { name: "Go Back", icon: "⏪", defaultLabel: "Back 2" },
    "draw-card": { name: "Draw Card", icon: "🃏", defaultLabel: "Draw Card" },
    teleport: { name: "Warp Portal", icon: "🌀", defaultLabel: "Warp" },
    treasure: { name: "Treasure Chest", icon: "💎", defaultLabel: "+50 Pts" },
};

export function createDefaultBoardGameConfig(theme: BoardThemeId = "candyland"): BoardGameConfig {
    return {
        title: "SUPER FUN BOARD GAME",
        subtitle: "Roll the dice, answer questions, and race to the finish line!",
        layout: "snake",
        theme,
        totalSpaces: 28,
        cellShape: "rounded",
        cellSize: 44,
        showNumbers: true,
        showIcons: true,
        includeDice: true,
        includeSpinner: false,
        includeCards: true,
        includeTokens: true,
    };
}

/**
 * Computes exact (x, y) coordinates for all N board spaces based on board layout.
 */
export function computeBoardGameSpacePositions(
    layout: BoardLayoutType,
    totalSpaces: number,
    boardW: number = 500,
    boardH: number = 420,
    cellSize: number = 44,
    customPositions?: { x: number; y: number }[]
): { x: number; y: number }[] {
    if (customPositions && customPositions.length > 0) {
        return customPositions;
    }
    const points: { x: number; y: number }[] = [];
    const count = Math.max(8, totalSpaces);

    const marginX = cellSize * 0.8;
    const marginY = cellSize * 0.8;
    const usableW = boardW - marginX * 2;
    const usableH = boardH - marginY * 2;

    if (layout === "snake" || layout === "zigzag") {
        // Multi-row serpentine grid
        const cols = Math.min(7, Math.ceil(Math.sqrt(count * 1.4)));
        const rows = Math.ceil(count / cols);
        const colSpacing = usableW / (cols - 1 || 1);
        const rowSpacing = usableH / (rows - 1 || 1);

        for (let i = 0; i < count; i++) {
            const r = Math.floor(i / cols);
            const c = i % cols;
            const isEvenRow = r % 2 === 0;
            const actualCol = isEvenRow ? c : cols - 1 - c;

            const x = marginX + actualCol * colSpacing;
            const y = marginY + (rows - 1 - r) * rowSpacing;
            points.push({ x, y });
        }
    } else if (layout === "spiral") {
        const centerX = boardW / 2;
        const centerY = boardH / 2;
        const maxR = Math.min(boardW, boardH) / 2 - marginX;

        for (let i = 0; i < count; i++) {
            const progress = i / (count - 1);
            const angle = progress * Math.PI * 5.5;
            const radius = maxR * (1 - progress * 0.75);
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            points.push({ x, y });
        }
    } else if (layout === "circle") {
        const centerX = boardW / 2;
        const centerY = boardH / 2;
        const rx = boardW / 2 - marginX;
        const ry = boardH / 2 - marginY;

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
            const x = centerX + Math.cos(angle) * rx;
            const y = centerY + Math.sin(angle) * ry;
            points.push({ x, y });
        }
    } else if (layout === "race-track") {
        const rx = usableW / 2;
        const ry = usableH / 2;
        const centerX = boardW / 2;
        const centerY = boardH / 2;

        for (let i = 0; i < count; i++) {
            const t = (i / count) * Math.PI * 2;
            const x = centerX + Math.sign(Math.cos(t)) * Math.pow(Math.abs(Math.cos(t)), 0.6) * rx;
            const y = centerY + Math.sign(Math.sin(t)) * Math.pow(Math.abs(Math.sin(t)), 0.6) * ry;
            points.push({ x, y });
        }
    } else if (layout === "treasure-map" || layout === "island-map") {
        for (let i = 0; i < count; i++) {
            const t = i / (count - 1);
            const x = marginX + t * usableW;
            const wave = Math.sin(t * Math.PI * 3.5) * (usableH * 0.35);
            const y = boardH / 2 + wave;
            points.push({ x, y });
        }
    } else if (layout === "figure-eight") {
        const centerX = boardW / 2;
        const centerY = boardH / 2;
        const scaleX = usableW * 0.45;
        const scaleY = usableH * 0.45;

        for (let i = 0; i < count; i++) {
            const t = (i / count) * Math.PI * 2;
            const x = centerX + (scaleX * Math.sin(t)) / (1 + Math.cos(t) * Math.cos(t));
            const y = centerY + (scaleY * Math.sin(t) * Math.cos(t)) / (1 + Math.cos(t) * Math.cos(t));
            points.push({ x, y });
        }
    } else if (layout === "hexagon-grid") {
        const cols = 6;
        const colW = usableW / cols;
        for (let i = 0; i < count; i++) {
            const r = Math.floor(i / cols);
            const c = i % cols;
            const offset = (r % 2) * (colW * 0.5);
            const x = marginX + c * colW + offset;
            const y = marginY + r * (cellSize * 1.15);
            points.push({ x, y });
        }
    } else if (layout === "dungeon-crawl") {
        // Modular rooms layout with connecting corridors
        const roomCenters = [
            { x: marginX, y: marginY + usableH * 0.5 },
            { x: marginX + usableW * 0.3, y: marginY },
            { x: marginX + usableW * 0.3, y: marginY + usableH },
            { x: marginX + usableW * 0.6, y: marginY + usableH * 0.2 },
            { x: marginX + usableW * 0.6, y: marginY + usableH * 0.8 },
            { x: marginX + usableW, y: marginY + usableH * 0.5 },
        ];
        for (let i = 0; i < count; i++) {
            const roomIdx = Math.floor((i / count) * roomCenters.length);
            const nextRoomIdx = Math.min(roomCenters.length - 1, roomIdx + 1);
            const subT = ((i / count) * roomCenters.length) % 1;
            const p1 = roomCenters[roomIdx];
            const p2 = roomCenters[nextRoomIdx];
            points.push({
                x: p1.x + (p2.x - p1.x) * subT,
                y: p1.y + (p2.y - p1.y) * subT,
            });
        }
    } else if (layout === "branching-adventure") {
        // Main path with split choices and re-merging nodes
        for (let i = 0; i < count; i++) {
            const t = i / (count - 1);
            const x = marginX + t * usableW;
            let offset = 0;
            if (i % 3 === 1) offset = -usableH * 0.25;
            else if (i % 3 === 2) offset = usableH * 0.25;
            const y = boardH / 2 + offset;
            points.push({ x, y });
        }
    } else if (layout === "tournament-bracket") {
        // Tree bracket layout from left to right
        const levels = Math.ceil(Math.log2(count));
        for (let i = 0; i < count; i++) {
            const level = Math.floor(Math.log2(i + 1));
            const posInLevel = (i + 1) - Math.pow(2, level);
            const totalInLevel = Math.pow(2, level);
            const x = marginX + (level / (levels || 1)) * usableW;
            const y = marginY + ((posInLevel + 0.5) / totalInLevel) * usableH;
            points.push({ x, y });
        }
    } else if (layout === "mountain-climb") {
        // Base to peak elevation steps
        for (let i = 0; i < count; i++) {
            const t = i / (count - 1);
            const x = marginX + t * usableW;
            const y = (boardH - marginY) - Math.pow(t, 0.8) * usableH;
            points.push({ x, y });
        }
    } else if (layout === "river-journey") {
        // Meandering horizontal river path
        for (let i = 0; i < count; i++) {
            const t = i / (count - 1);
            const x = marginX + t * usableW;
            const y = boardH / 2 + Math.cos(t * Math.PI * 4) * (usableH * 0.35);
            points.push({ x, y });
        }
    } else {
        const stepX = usableW / (count - 1 || 1);
        for (let i = 0; i < count; i++) {
            const x = marginX + i * stepX;
            const y = boardH / 2;
            points.push({ x, y });
        }
    }

    return points;
}

export function generateDefaultSpacesForConfig(config: BoardGameConfig): BoardGameSpace[] {
    const theme = BOARD_GAME_THEMES[config.theme] || BOARD_GAME_THEMES.candyland;
    const total = config.totalSpaces;
    const spaces: BoardGameSpace[] = [];

    for (let i = 0; i < total; i++) {
        const num = i + 1;
        let type: SpaceType = "normal";

        if (i === 0) {
            type = "start";
        } else if (i === total - 1) {
            type = "finish";
        } else if (i % 7 === 0) {
            type = "question";
        } else if (i % 9 === 0) {
            type = "bonus";
        } else if (i % 11 === 0) {
            type = "lose-turn";
        } else if (i % 13 === 0) {
            type = "roll-again";
        } else if (i % 15 === 0) {
            type = "draw-card";
        } else if (i % 17 === 0) {
            type = "teleport";
        }

        const meta = SPACE_TYPE_METADATA[type];
        let color = theme.normalColors[i % theme.normalColors.length];
        if (type === "start") color = theme.startColor;
        else if (type === "finish") color = theme.finishColor;
        else if (type === "question") color = theme.questionColor;
        else if (type === "bonus") color = theme.bonusColor;
        else if (type === "lose-turn") color = theme.penaltyColor;

        spaces.push({
            id: `space-${i + 1}`,
            number: num,
            type,
            label: meta.defaultLabel,
            icon: meta.icon,
            color,
            borderColor: theme.borderColor,
            textColor: theme.textColor,
        });
    }

    return spaces;
}

/**
 * Resamples N evenly spaced points along an array of raw path points.
 */
export function resamplePointsAlongPath(rawPoints: { x: number; y: number }[], totalSpaces: number): { x: number; y: number }[] {
    if (!rawPoints || rawPoints.length === 0) return [];
    if (rawPoints.length === 1) return Array(totalSpaces).fill(rawPoints[0]);

    const dists: number[] = [0];
    let totalLength = 0;
    for (let i = 1; i < rawPoints.length; i++) {
        const dx = rawPoints[i].x - rawPoints[i - 1].x;
        const dy = rawPoints[i].y - rawPoints[i - 1].y;
        const segLen = Math.sqrt(dx * dx + dy * dy);
        totalLength += segLen;
        dists.push(totalLength);
    }

    if (totalLength === 0) return Array(totalSpaces).fill(rawPoints[0]);

    const resampled: { x: number; y: number }[] = [];
    const step = totalLength / (totalSpaces - 1 || 1);

    for (let i = 0; i < totalSpaces; i++) {
        const targetDist = i * step;
        let segIdx = 0;
        while (segIdx < dists.length - 1 && dists[segIdx + 1] < targetDist) {
            segIdx++;
        }

        if (segIdx >= dists.length - 1) {
            resampled.push({ ...rawPoints[rawPoints.length - 1] });
        } else {
            const p1 = rawPoints[segIdx];
            const p2 = rawPoints[segIdx + 1];
            const d1 = dists[segIdx];
            const d2 = dists[segIdx + 1];
            const segRatio = d2 > d1 ? (targetDist - d1) / (d2 - d1) : 0;

            resampled.push({
                x: p1.x + (p2.x - p1.x) * segRatio,
                y: p1.y + (p2.y - p1.y) * segRatio,
            });
        }
    }

    return resampled;
}
