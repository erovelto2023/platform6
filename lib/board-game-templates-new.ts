/* ══════════════════════════════════════════════════════════════════
 *  Professional Board Game Template Generators
 *  Layout generators inspired by popular board game mechanics
 * ══════════════════════════════════════════════════════════════════ */

import * as fabric from "fabric";
import { BoardGameSpaceConfig, createDefaultSpaceConfig } from "./board-game-space-types";
import { renderBoardGameSpace } from "./board-game-space-renderer";

// ─── Template Types ───────────────────────────────────────────────
export type BoardTemplateType =
    | "linear-race"
    | "snake-path"
    | "spiral-path"
    | "circular-track"
    | "figure-eight"
    | "branching-adventure"
    | "hex-grid"
    | "square-grid"
    | "treasure-map"
    | "dungeon-crawl"
    | "space-mission"
    | "island-exploration"
    | "castle-quest"
    | "city-map"
    | "farm-path"
    | "jungle-trail"
    | "road-trip"
    | "mountain-climb"
    | "river-journey"
    | "maze-board"
    | "timeline-board"
    | "story-path"
    | "decision-tree"
    | "classroom-review"
    | "tournament-bracket";

export interface BoardTemplateConfig {
    type: BoardTemplateType;
    totalSpaces: number;
    cellSize: number;
    cellShape: "square" | "rounded" | "circle" | "hexagon";
    title?: string;
    subtitle?: string;
}

export interface BoardTemplateSpec {
    id: BoardTemplateType;
    name: string;
    icon: string;
    category: "race" | "strategy" | "adventure" | "educational" | "puzzle";
    description: string;
    inspiration: string;
    defaultSpaces: number;
    recommendedShape: "square" | "rounded" | "circle" | "hexagon";
}

// ─── Template Specifications ───────────────────────────────────────
export const BOARD_TEMPLATES: BoardTemplateSpec[] = [
    {
        id: "linear-race",
        name: "Linear Race Track",
        icon: "🏎️",
        category: "race",
        description: "Straight path from start to finish",
        inspiration: "Candy Land, Chutes & Ladders",
        defaultSpaces: 28,
        recommendedShape: "rounded",
    },
    {
        id: "snake-path",
        name: "Snake Serpentine Path",
        icon: "🐍",
        category: "race",
        description: "Winding back-and-forth path",
        inspiration: "Snakes and Ladders, Goose Game",
        defaultSpaces: 32,
        recommendedShape: "rounded",
    },
    {
        id: "spiral-path",
        name: "Inward Spiral",
        icon: "🌀",
        category: "race",
        description: "Spiraling path to center",
        inspiration: "Labyrinth, Game of Life",
        defaultSpaces: 30,
        recommendedShape: "circle",
    },
    {
        id: "circular-track",
        icon: "🔵",
        name: "Circular Lap Track",
        category: "race",
        description: "Continuous circular track",
        inspiration: "Monopoly, Sequence",
        defaultSpaces: 24,
        recommendedShape: "rounded",
    },
    {
        id: "figure-eight",
        name: "Figure-Eight Course",
        icon: "♾️",
        category: "race",
        description: "Dual-loop figure-eight track",
        inspiration: "Racing games, Camel Up",
        defaultSpaces: 32,
        recommendedShape: "rounded",
    },
    {
        id: "branching-adventure",
        name: "Branching Adventure",
        icon: "🔀",
        category: "adventure",
        description: "Multi-path decision tree",
        inspiration: "Game of Life, Clank!",
        defaultSpaces: 28,
        recommendedShape: "rounded",
    },
    {
        id: "hex-grid",
        name: "Hexagon Grid Board",
        icon: "🔷",
        category: "strategy",
        description: "Interlocking hexagonal tiles",
        inspiration: "Catan, Eclipse, Cascadia",
        defaultSpaces: 24,
        recommendedShape: "hexagon",
    },
    {
        id: "square-grid",
        name: "Square Grid Board",
        icon: "⬛",
        category: "strategy",
        description: "Classic square grid layout",
        inspiration: "Chess, Checkers, Blokus",
        defaultSpaces: 64,
        recommendedShape: "square",
    },
    {
        id: "treasure-map",
        name: "Treasure Map",
        icon: "🗺️",
        category: "adventure",
        description: "Island map with treasure locations",
        inspiration: "Forbidden Island, Lost Cities",
        defaultSpaces: 30,
        recommendedShape: "circle",
    },
    {
        id: "dungeon-crawl",
        name: "Dungeon Crawl",
        icon: "🏰",
        category: "adventure",
        description: "Room-based dungeon layout",
        inspiration: "Gloomhaven, HeroQuest",
        defaultSpaces: 26,
        recommendedShape: "square",
    },
    {
        id: "space-mission",
        name: "Space Mission",
        icon: "🚀",
        category: "adventure",
        description: "Galactic space station layout",
        inspiration: "Terraforming Mars, Clank! In! Space!",
        defaultSpaces: 30,
        recommendedShape: "circle",
    },
    {
        id: "island-exploration",
        name: "Island Exploration",
        icon: "🏝️",
        category: "adventure",
        description: "Multi-island exploration map",
        inspiration: "Forbidden Island, Cascadia",
        defaultSpaces: 28,
        recommendedShape: "rounded",
    },
    {
        id: "castle-quest",
        name: "Castle Quest",
        icon: "🏯",
        category: "adventure",
        description: "Castle with towers and throne room",
        inspiration: "HeroQuest, Descent",
        defaultSpaces: 30,
        recommendedShape: "square",
    },
    {
        id: "city-map",
        name: "City Map Network",
        icon: "🏙️",
        category: "strategy",
        description: "Urban city grid of districts",
        inspiration: "Pandemic, Ticket to Ride",
        defaultSpaces: 30,
        recommendedShape: "square",
    },
    {
        id: "farm-path",
        name: "Farm Trail",
        icon: "🌾",
        category: "race",
        description: "Peaceful farm through fields",
        inspiration: "Agricola, Tokaido",
        defaultSpaces: 24,
        recommendedShape: "rounded",
    },
    {
        id: "jungle-trail",
        name: "Jungle Trail",
        icon: "🌿",
        category: "adventure",
        description: "Dense jungle with temples",
        inspiration: "Clue, Robinson Crusoe",
        defaultSpaces: 28,
        recommendedShape: "rounded",
    },
    {
        id: "road-trip",
        name: "Road Trip",
        icon: "🚗",
        category: "race",
        description: "Linear road through cities",
        inspiration: "Game of Life, Ticket to Ride",
        defaultSpaces: 30,
        recommendedShape: "rounded",
    },
    {
        id: "mountain-climb",
        name: "Mountain Climb",
        icon: "🏔️",
        category: "adventure",
        description: "Base camp to summit",
        inspiration: "Everest, Mountain Trail Games",
        defaultSpaces: 25,
        recommendedShape: "rounded",
    },
    {
        id: "river-journey",
        name: "River Journey",
        icon: "🚣",
        category: "adventure",
        description: "Flowing river with stops",
        inspiration: "Century, Takenoko",
        defaultSpaces: 26,
        recommendedShape: "rounded",
    },
    {
        id: "maze-board",
        name: "Maze Board",
        icon: "🧩",
        category: "puzzle",
        description: "Complex maze labyrinth",
        inspiration: "Labyrinth, Tsuro",
        defaultSpaces: 30,
        recommendedShape: "square",
    },
    {
        id: "timeline-board",
        name: "Timeline Board",
        icon: "📅",
        category: "educational",
        description: "Historical timeline layout",
        inspiration: "Timeline Card Game, Trivial Pursuit",
        defaultSpaces: 28,
        recommendedShape: "rounded",
    },
    {
        id: "story-path",
        name: "Story Path",
        icon: "📚",
        category: "adventure",
        description: "Narrative story chapters",
        inspiration: "Dixit, Telestrations",
        defaultSpaces: 24,
        recommendedShape: "rounded",
    },
    {
        id: "decision-tree",
        name: "Decision Tree",
        icon: "🌳",
        category: "puzzle",
        description: "Branching story decisions",
        inspiration: "Choose Your Own Adventure",
        defaultSpaces: 24,
        recommendedShape: "rounded",
    },
    {
        id: "classroom-review",
        name: "Classroom Review",
        icon: "🎓",
        category: "educational",
        description: "Teacher-friendly review track",
        inspiration: "Jeopardy, Quiz Bowl",
        defaultSpaces: 24,
        recommendedShape: "rounded",
    },
    {
        id: "tournament-bracket",
        name: "Tournament Bracket",
        icon: "🏆",
        category: "strategy",
        description: "Knockout championship tree",
        inspiration: "Sports brackets, Camel Up",
        defaultSpaces: 15,
        recommendedShape: "square",
    },
];

// ─── Position Calculation Helpers ─────────────────────────────────
interface Position {
    x: number;
    y: number;
}

function calculateLinearPositions(
    totalSpaces: number,
    cellSize: number,
    padding: number = 80
): Position[] {
    const positions: Position[] = [];
    const boardWidth = 800;
    const startX = padding;
    const endX = boardWidth - padding - cellSize;
    const y = 400;
    
    const step = (endX - startX) / (totalSpaces - 1);
    
    for (let i = 0; i < totalSpaces; i++) {
        positions.push({
            x: startX + i * step,
            y,
        });
    }
    
    return positions;
}

function calculateSnakePositions(
    totalSpaces: number,
    cellSize: number,
    cols: number = 8,
    padding: number = 80
): Position[] {
    const positions: Position[] = [];
    const boardWidth = 800;
    const startX = padding;
    const startY = padding + 50;
    const spacing = (boardWidth - 2 * padding) / (cols - 1);
    
    for (let i = 0; i < totalSpaces; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        
        const x = startX + col * spacing;
        const y = startY + row * (cellSize + 10);
        
        // Alternate direction on each row
        const actualX = row % 2 === 0 ? x : startX + (cols - 1 - col) * spacing;
        
        positions.push({ x: actualX, y });
    }
    
    return positions;
}

function calculateSpiralPositions(
    totalSpaces: number,
    cellSize: number,
    centerX: number = 400,
    centerY: number = 400
): Position[] {
    const positions: Position[] = [];
    const spacing = cellSize + 8;
    
    for (let i = 0; i < totalSpaces; i++) {
        const angle = i * 0.5;
        const radius = spacing * Math.sqrt(i);
        
        positions.push({
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
        });
    }
    
    return positions;
}

function calculateCircularPositions(
    totalSpaces: number,
    cellSize: number,
    centerX: number = 400,
    centerY: number = 400,
    radius: number = 250
): Position[] {
    const positions: Position[] = [];
    
    for (let i = 0; i < totalSpaces; i++) {
        const angle = (2 * Math.PI * i) / totalSpaces - Math.PI / 2;
        
        positions.push({
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
        });
    }
    
    return positions;
}

function calculateHexGridPositions(
    totalSpaces: number,
    cellSize: number,
    cols: number = 6,
    padding: number = 80
): Position[] {
    const positions: Position[] = [];
    const hexWidth = cellSize * 0.866; // sqrt(3)/2
    const hexHeight = cellSize * 0.75;
    const startX = padding;
    const startY = padding + 50;
    
    for (let i = 0; i < totalSpaces; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        
        const x = startX + col * hexWidth + (row % 2 === 1 ? hexWidth / 2 : 0);
        const y = startY + row * hexHeight;
        
        positions.push({ x, y });
    }
    
    return positions;
}

function calculateSquareGridPositions(
    totalSpaces: number,
    cellSize: number,
    cols: number = 8,
    padding: number = 80
): Position[] {
    const positions: Position[] = [];
    const boardWidth = 800;
    const spacing = (boardWidth - 2 * padding) / (cols - 1);
    const startX = padding;
    const startY = padding + 50;
    
    for (let i = 0; i < totalSpaces; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        
        positions.push({
            x: startX + col * spacing,
            y: startY + row * spacing,
        });
    }
    
    return positions;
}

// ─── Main Template Generator ───────────────────────────────────────
export function generateBoardTemplate(
    config: BoardTemplateConfig
): fabric.Group {
    const { type, totalSpaces, cellSize, cellShape, title, subtitle } = config;
    
    // Calculate positions based on template type
    let positions: Position[] = [];
    
    switch (type) {
        case "linear-race":
            positions = calculateLinearPositions(totalSpaces, cellSize);
            break;
        case "snake-path":
            positions = calculateSnakePositions(totalSpaces, cellSize);
            break;
        case "spiral-path":
            positions = calculateSpiralPositions(totalSpaces, cellSize);
            break;
        case "circular-track":
            positions = calculateCircularPositions(totalSpaces, cellSize);
            break;
        case "figure-eight":
            // Simplified figure-eight as two overlapping circles
            positions = calculateCircularPositions(Math.floor(totalSpaces / 2), cellSize, 300, 400, 150);
            const secondCircle = calculateCircularPositions(Math.ceil(totalSpaces / 2), cellSize, 500, 400, 150);
            positions = [...positions, ...secondCircle];
            break;
        case "hex-grid":
            positions = calculateHexGridPositions(totalSpaces, cellSize);
            break;
        case "square-grid":
            positions = calculateSquareGridPositions(totalSpaces, cellSize);
            break;
        default:
            // Default to snake path for unknown types
            positions = calculateSnakePositions(totalSpaces, cellSize);
    }
    
    // Create space objects
    const spaceObjects: fabric.Object[] = [];
    
    for (let i = 0; i < positions.length; i++) {
        const pos = positions[i];
        
        // Create default config for this space
        const spaceConfig = createDefaultSpaceConfig(
            i === 0 ? "basic" : "basic",
            i === 0 ? "start" : i === positions.length - 1 ? "finish" : "normal",
            `space-${i}`
        );
        
        // Update appearance based on cell shape
        spaceConfig.appearance.shape = cellShape;
        spaceConfig.appearance.size = cellSize;
        
        // Add number to content
        spaceConfig.content.number = i + 1;
        
        // Render the space
        const spaceGroup = renderBoardGameSpace(spaceConfig, pos.x, pos.y);
        spaceObjects.push(spaceGroup);
    }
    
    // Add title if provided
    if (title) {
        const titleText = new fabric.IText(title, {
            fontSize: 24,
            fontWeight: "bold",
            fontFamily: "Inter, Arial, sans-serif",
            fill: "#1e293b",
            left: 400,
            top: 30,
            originX: "center",
            originY: "center",
        });
        spaceObjects.push(titleText);
    }
    
    // Add subtitle if provided
    if (subtitle) {
        const subtitleText = new fabric.IText(subtitle, {
            fontSize: 14,
            fontFamily: "Inter, Arial, sans-serif",
            fill: "#64748b",
            left: 400,
            top: 60,
            originX: "center",
            originY: "center",
        });
        spaceObjects.push(subtitleText);
    }
    
    // Create main group
    const group = new fabric.Group(spaceObjects, {
        originX: "center",
        originY: "center",
        subTargetCheck: true,
        interactive: true,
    });
    
    // Attach metadata
    (group as any).id = `board-template-${type}-${Date.now()}`;
    (group as any).customType = "board-game-template";
    (group as any).templateConfig = config;
    
    return group;
}

// ─── Quick Template Generator ───────────────────────────────────────
export function generateQuickTemplate(
    type: BoardTemplateType,
    title?: string
): fabric.Group {
    const template = BOARD_TEMPLATES.find((t) => t.id === type);
    if (!template) {
        throw new Error(`Template type ${type} not found`);
    }
    
    return generateBoardTemplate({
        type,
        totalSpaces: template.defaultSpaces,
        cellSize: 56,
        cellShape: template.recommendedShape,
        title: title || template.name,
        subtitle: template.inspiration,
    });
}
