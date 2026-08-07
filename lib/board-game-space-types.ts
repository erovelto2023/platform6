/* ══════════════════════════════════════════════════════════════════
 *  Professional Board Game Space Type System
 *  Comprehensive configurable space objects for professional board game design
 * ══════════════════════════════════════════════════════════════════ */

// ─── Space Categories ────────────────────────────────────────────────
export type SpaceCategory =
    | "basic"
    | "movement"
    | "turn-based"
    | "dice"
    | "question"
    | "educational"
    | "reward"
    | "penalty"
    | "card"
    | "challenge"
    | "mini-game"
    | "story"
    | "adventure"
    | "rpg"
    | "economy"
    | "team"
    | "random"
    | "collection"
    | "time-based"
    | "interactive"
    | "special"
    | "decorative"
    | "game-board"
    | "board-piece"
    | "custom";

// ─── Space Types (23 Categories) ─────────────────────────────────────
export type SpaceType =
    // Basic Spaces
    | "start" | "finish" | "normal" | "blank" | "numbered" | "lettered"
    | "colored" | "checkpoint" | "safe" | "home" | "goal" | "end-turn"
    // Movement Spaces
    | "move-forward-1" | "move-forward-2" | "move-forward-3" | "move-forward-x"
    | "move-back-1" | "move-back-2" | "move-back-3" | "move-back-x"
    | "jump-ahead" | "jump-back" | "skip-checkpoint" | "return-start"
    | "return-checkpoint" | "move-finish" | "move-specific" | "teleport"
    | "portal" | "secret-tunnel" | "warp" | "shortcut" | "detour"
    | "reverse-direction" | "reverse-play-order"
    // Turn-Based Spaces
    | "lose-one-turn" | "lose-two-turns" | "skip-turn" | "skip-next-turn"
    | "miss-round" | "extra-turn" | "play-again" | "roll-again" | "spin-again"
    | "double-turn" | "end-turn-immediate" | "freeze-until-released"
    // Dice Spaces
    | "roll-again" | "roll-two-dice" | "roll-three-dice" | "highest-roll-wins"
    | "lowest-roll-wins" | "even-roll-bonus" | "odd-roll-bonus"
    | "exact-roll-required" | "roll-escape" | "roll-reward" | "roll-penalty"
    // Question Spaces
    | "trivia" | "multiple-choice" | "true-false" | "fill-blank" | "vocabulary"
    | "spelling" | "reading" | "writing-prompt" | "essay" | "math-problem"
    | "science" | "history" | "geography" | "picture" | "listening" | "memory"
    | "open-response" | "riddle" | "puzzle-question"
    // Educational Spaces
    | "vocab-word" | "define-word" | "spell-word" | "synonym" | "antonym"
    | "match-word" | "use-sentence" | "translate" | "reading-passage"
    | "solve-equation" | "fraction" | "measurement" | "grammar" | "phonics"
    | "sight-word" | "letter-recognition" | "shape-recognition" | "color-recognition"
    // Reward Spaces
    | "gain-points" | "bonus-points" | "double-points" | "triple-points"
    | "collect-coin" | "collect-token" | "collect-star" | "collect-gem"
    | "collect-card" | "earn-badge" | "earn-sticker" | "earn-life"
    | "gain-shield" | "gain-powerup" | "gain-key" | "treasure-chest"
    | "mystery-reward" | "lucky-space"
    // Penalty Spaces
    | "lose-points" | "lose-coins" | "lose-card" | "lose-token" | "lose-shield"
    | "lose-turn" | "go-back" | "return-start" | "return-checkpoint"
    | "pay-penalty" | "discard-item" | "lose-powerup" | "trap" | "quicksand"
    | "jail" | "timeout" | "hazard" | "monster-attack"
    // Card Spaces
    | "draw-card" | "draw-question" | "draw-action" | "draw-reward"
    | "draw-penalty" | "draw-mystery" | "draw-chance" | "draw-challenge"
    | "draw-event" | "draw-wild"
    // Challenge Spaces
    | "physical-challenge" | "mental-challenge" | "memory-challenge"
    | "puzzle-challenge" | "drawing-challenge" | "acting-challenge"
    | "charades" | "mimic" | "build-something" | "team-challenge"
    | "timed-challenge" | "speed-round"
    // Mini-Game Spaces
    | "word-search" | "crossword" | "maze" | "sudoku" | "crack-code"
    | "cryptogram" | "spot-difference" | "hidden-picture" | "dot-to-dot"
    | "color-by-number" | "connect-dots" | "tic-tac-toe" | "hangman"
    | "word-scramble" | "matching-game" | "memory-match"
    // Story Spaces
    | "story-event" | "read-story" | "make-choice" | "continue-story"
    | "character-encounter" | "dialogue" | "quest" | "mission"
    | "side-quest" | "boss-fight" | "rescue" | "discovery" | "find-treasure"
    | "secret-room"
    // Adventure Spaces
    | "cave" | "forest" | "castle" | "village" | "river" | "mountain"
    | "volcano" | "desert" | "ocean" | "island" | "space-station" | "planet"
    | "dungeon" | "temple" | "labyrinth"
    // RPG Spaces
    | "shop" | "heal" | "rest" | "upgrade" | "recruit-ally"
    | "gain-weapon" | "gain-armor" | "learn-skill" | "magic-portal"
    | "save-point" | "battle" | "boss-battle" | "random-encounter"
    // Economy Spaces
    | "bank" | "pay-tax" | "collect-salary" | "buy-item" | "sell-item"
    | "trade" | "auction" | "invest" | "collect-interest" | "bonus-income"
    | "fine" | "loan" | "marketplace"
    // Team Spaces
    | "swap-places" | "help-teammate" | "share-points" | "trade-cards"
    | "cooperative-challenge" | "team-bonus" | "team-penalty"
    // Random Spaces
    | "random-event" | "lucky-wheel" | "coin-flip" | "mystery-box"
    | "surprise" | "random-movement" | "random-reward" | "random-penalty"
    | "weather-change" | "chaos-space"
    // Collection Spaces
    | "collect-stamp" | "collect-puzzle-piece" | "collect-letter"
    | "collect-number" | "collect-ingredient" | "collect-tool"
    | "collect-artifact" | "collect-animal" | "collect-treasure"
    | "complete-set-bonus"
    // Time-Based Spaces
    | "30-second-challenge" | "1-minute-challenge" | "speed-question"
    | "countdown" | "timed-puzzle" | "race-clock"
    // Interactive Spaces
    | "scan-qr" | "watch-video" | "listen-audio" | "open-website"
    | "use-ar" | "teacher-checkpoint"
    // Special Spaces
    | "wild" | "choice" | "custom-action" | "rule-change" | "free-choice"
    | "player-choice" | "secret" | "hidden" | "bonus-round" | "final-challenge"
    | "instant-win" | "sudden-death" | "continue"
    // Decorative Spaces
    | "path-marker" | "footprints" | "arrow" | "direction-sign" | "flag"
    | "campfire" | "tree" | "bridge" | "rock" | "water" | "clouds"
    | "treasure-chest-deco" | "castle-deco" | "house" | "planet-deco" | "rocket"
    | "dragon" | "pirate-ship" | "rainbow" | "volcano-deco" | "mountain-deco"
    | "compass" | "signpost"
    // Game Board Patterns
    | "board-pattern"
    // Custom
    | "custom";

// ─── Shape Types ─────────────────────────────────────────────────────
export type SpaceShape = "square" | "rounded" | "circle" | "hexagon" | "diamond" | "star" | "custom";

// ─── Appearance Configuration ───────────────────────────────────────
export interface SpaceAppearance {
    shape: SpaceShape;
    size: number;
    fill: string;
    gradient?: { start: string; end: string; direction?: "horizontal" | "vertical" | "radial" };
    pattern?: "none" | "dots" | "lines" | "grid" | "stripes" | "checkerboard";
    border: {
        color: string;
        width: number;
        style: "solid" | "dashed" | "dotted" | "double";
    };
    cornerRadius: number;
    shadow: {
        enabled: boolean;
        color: string;
        blur: number;
        offsetX: number;
        offsetY: number;
    };
    opacity: number;
    backgroundImage?: string;
    icon?: string;
    emoji?: string;
    sticker?: string;
}

// ─── Content Configuration ─────────────────────────────────────────
export interface SpaceContent {
    title?: string;
    subtitle?: string;
    description?: string;
    number?: number;
    letter?: string;
    image?: string;
    illustration?: string;
    qrCode?: string;
    barcode?: string;
}

// ─── Behavior Configuration ─────────────────────────────────────────
export interface SpaceBehavior {
    action: string;
    trigger?: "land" | "pass" | "both";
    animation?: string;
    sound?: string;
    linkedCard?: string;
    linkedQuestion?: string;
    linkedWorksheet?: string;
    linkedAnswer?: string;
    value?: number; // For movement amounts, points, etc.
    options?: string[]; // For choice spaces
}

// ─── Metadata Configuration ────────────────────────────────────────
export interface SpaceMetadata {
    category: SpaceCategory;
    type: SpaceType;
    difficulty?: "easy" | "medium" | "hard" | "expert";
    subject?: string;
    gradeLevel?: string;
    theme?: string;
    tags?: string[];
    notes?: string;
    id: string;
}

// ─── Complete Space Configuration Object ───────────────────────────
export interface BoardGameSpaceConfig {
    appearance: SpaceAppearance;
    content: SpaceContent;
    behavior: SpaceBehavior;
    metadata: SpaceMetadata;
}

// ─── Smart Preset Types ────────────────────────────────────────────
export interface SpacePreset {
    id: string;
    name: string;
    category: SpaceCategory;
    type: SpaceType;
    icon: string;
    emoji: string;
    defaultConfig: Partial<BoardGameSpaceConfig>;
    description: string;
}

// ─── Default Appearance Presets ────────────────────────────────────
export const DEFAULT_APPEARANCES: Record<SpaceCategory, Partial<SpaceAppearance>> = {
    basic: { shape: "rounded", fill: "#4ade80", border: { color: "#166534", width: 2, style: "solid" } },
    movement: { shape: "rounded", fill: "#60a5fa", border: { color: "#1e40af", width: 2, style: "solid" } },
    "turn-based": { shape: "rounded", fill: "#fbbf24", border: { color: "#92400e", width: 2, style: "solid" } },
    dice: { shape: "circle", fill: "#a78bfa", border: { color: "#5b21b6", width: 2, style: "solid" } },
    question: { shape: "rounded", fill: "#f87171", border: { color: "#991b1b", width: 2, style: "solid" } },
    educational: { shape: "rounded", fill: "#2dd4bf", border: { color: "#115e59", width: 2, style: "solid" } },
    reward: { shape: "star", fill: "#fbbf24", border: { color: "#92400e", width: 2, style: "solid" } },
    penalty: { shape: "rounded", fill: "#f87171", border: { color: "#991b1b", width: 2, style: "dashed" } },
    card: { shape: "rounded", fill: "#c4b5fd", border: { color: "#5b21b6", width: 2, style: "solid" } },
    challenge: { shape: "diamond", fill: "#fb923c", border: { color: "#9a3412", width: 2, style: "solid" } },
    "mini-game": { shape: "hexagon", fill: "#34d399", border: { color: "#065f46", width: 2, style: "solid" } },
    story: { shape: "rounded", fill: "#a78bfa", border: { color: "#5b21b6", width: 2, style: "solid" } },
    adventure: { shape: "rounded", fill: "#059669", border: { color: "#064e3b", width: 2, style: "solid" } },
    rpg: { shape: "rounded", fill: "#7c3aed", border: { color: "#4c1d95", width: 2, style: "solid" } },
    economy: { shape: "rounded", fill: "#f59e0b", border: { color: "#92400e", width: 2, style: "solid" } },
    team: { shape: "rounded", fill: "#3b82f6", border: { color: "#1e40af", width: 2, style: "solid" } },
    random: { shape: "circle", fill: "#ec4899", border: { color: "#9d174d", width: 2, style: "dashed" } },
    collection: { shape: "rounded", fill: "#14b8a6", border: { color: "#0f766e", width: 2, style: "solid" } },
    "time-based": { shape: "rounded", fill: "#ef4444", border: { color: "#7f1d1d", width: 2, style: "solid" } },
    interactive: { shape: "rounded", fill: "#8b5cf6", border: { color: "#5b21b6", width: 2, style: "solid" } },
    special: { shape: "star", fill: "#fbbf24", border: { color: "#92400e", width: 3, style: "solid" } },
    decorative: { shape: "rounded", fill: "#94a3b8", border: { color: "#475569", width: 1, style: "solid" } },
    "game-board": { shape: "rounded", fill: "#e2e8f0", border: { color: "#64748b", width: 2, style: "solid" } },
    "board-piece": { shape: "rounded", fill: "#f1f5f9", border: { color: "#94a3b8", width: 2, style: "solid" } },
    custom: { shape: "rounded", fill: "#d1d5db", border: { color: "#4b5563", width: 2, style: "solid" } },
};

// ─── Helper Functions ─────────────────────────────────────────────
export function createDefaultSpaceConfig(
    category: SpaceCategory,
    type: SpaceType,
    id: string
): BoardGameSpaceConfig {
    const defaultAppearance = DEFAULT_APPEARANCES[category];
    return {
        appearance: {
            shape: defaultAppearance.shape || "rounded",
            size: 56,
            fill: defaultAppearance.fill || "#e2e8f0",
            border: defaultAppearance.border || { color: "#64748b", width: 2, style: "solid" },
            cornerRadius: 12,
            shadow: { enabled: true, color: "rgba(0,0,0,0.18)", blur: 4, offsetX: 0, offsetY: 2 },
            opacity: 1,
            ...defaultAppearance,
        },
        content: {},
        behavior: { action: type },
        metadata: {
            category,
            type,
            id,
        },
    };
}

export function createSpaceFromPreset(preset: SpacePreset, customId?: string): BoardGameSpaceConfig {
    const id = customId || `${preset.type}-${Date.now()}`;
    const baseConfig = createDefaultSpaceConfig(preset.category, preset.type, id);
    return {
        ...baseConfig,
        ...preset.defaultConfig,
        metadata: {
            ...baseConfig.metadata,
            ...preset.defaultConfig.metadata,
            id,
        },
    };
}
