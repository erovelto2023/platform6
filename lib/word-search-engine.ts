// =========================================================================
// CANVA-GRADE PROFESSIONAL WORD SEARCH ENGINE & SEEDED SOLVER
// =========================================================================

export type WordDirection = "H" | "HR" | "V" | "VR" | "D_TL_BR" | "D_TR_BL" | "D_BL_TR" | "D_BR_TL";

export type DifficultyLevel = "very_easy" | "easy" | "medium" | "hard" | "expert" | "custom";

export type CellStyleMode = "clean" | "boxed" | "rounded" | "circle";

export type WordBankLayoutMode = "columns_1" | "columns_2" | "columns_3" | "columns_4" | "boxed" | "bulleted" | "numbered" | "hidden";

export type AnswerKeyStyle = "circle" | "highlight" | "colored_lines" | "overlay";

export interface WordItem {
    id: string;
    word: string;
    displayText?: string;
    definition?: string;
    hint?: string;
    color?: string;
    difficulty?: DifficultyLevel;
    category?: string;
}

export interface WordSearchConfig {
    id?: string;
    title: string;
    subtitle?: string;
    instructions?: string;
    theme?: string;
    difficulty: DifficultyLevel;
    language?: string;
    category?: string;
    author?: string;

    // Grid Options
    grid: {
        rows: number;
        cols: number;
        cellSize: number;
        directions: WordDirection[];
        overlapMode: "smart" | "allow" | "none";
        randomSeed: number;
        fillType: "random" | "vowels" | "custom";
        customCharset?: string;
        cellStyle: CellStyleMode;
        letterCase: "uppercase" | "lowercase" | "titlecase";
    };

    // Word List
    words: WordItem[];

    // Appearance & Fonts
    appearance: {
        titleFont: string;
        titleFontSize: number;
        titleColor: string;
        
        gridFont: string;
        gridFontSize: number;
        gridLetterColor: string;
        gridBgColor: string;
        gridBorderColor: string;
        gridBorderThickness: number;
        cellBgColor: string;
        altRowColor?: string;

        wordBankFont: string;
        wordBankFontSize: number;
        wordBankColor: string;
    };

    // Word Bank Config
    wordBank: {
        layout: WordBankLayoutMode;
        columns: number;
        sorting: "alphabetical" | "original" | "length";
        showHintsOnly?: boolean;
    };

    // Answer Key
    answerKey: {
        showSolution: boolean;
        style: AnswerKeyStyle;
        color: string;
    };

    // Metadata & Stats
    metadata?: {
        created?: string;
        version?: string;
    };
}

// Preset Themes with curated word lists
export const WORD_SEARCH_THEMES: Record<string, { name: string; words: string[]; icon: string }> = {
    animals: {
        name: "Animals",
        icon: "🐾",
        words: ["LION", "TIGER", "BEAR", "ELEPHANT", "MONKEY", "GIRAFFE", "ZEBRA", "DOLPHIN", "PANDA", "CHEETAH"],
    },
    space: {
        name: "Space & Astronomy",
        icon: "🚀",
        words: ["PLANET", "GALAXY", "ASTEROID", "METEOR", "NEBULA", "JUPITER", "SATURN", "ROCKET", "COMET", "ECLIPSE"],
    },
    dinosaurs: {
        name: "Dinosaurs",
        icon: "🦖",
        words: ["REX", "RAPTOR", "FOSSIL", "TRIKE", "PTERODACTYL", "JURASSIC", "SAUR", "CARNIVORE", "STEGO", "BONES"],
    },
    math: {
        name: "Math & Numbers",
        icon: "🧮",
        words: ["SUM", "DIFFERENCE", "PRODUCT", "FRACTION", "DECIMAL", "EQUATION", "GEOMETRY", "POLYGON", "ANGLE", "RADIUS"],
    },
    science: {
        name: "Science & Nature",
        icon: "🔬",
        words: ["ATOM", "CELL", "ENERGY", "FORCE", "GRAVITY", "MAGNET", "MOLECULE", "ORGANISM", "PROTON", "SPECIES"],
    },
    ocean: {
        name: "Ocean Life",
        icon: "🌊",
        words: ["SHARK", "WHALE", "CORAL", "OCTOPUS", "TURTLE", "STARFISH", "JELLYFISH", "SEAL", "SUBMARINE", "REEF"],
    },
    food: {
        name: "Food & Snacks",
        icon: "🍕",
        words: ["PIZZA", "BURGER", "PASTA", "CHERRY", "BANANA", "CHEESE", "CHOCOLATE", "DONUT", "WAFFLE", "SUSHI"],
    },
    sports: {
        name: "Sports & Athletics",
        icon: "⚽",
        words: ["SOCCER", "TENNIS", "BASEBALL", "HOCKEY", "RUNNING", "STADIUM", "CHAMPION", "TROPHY", "WHISTLE", "TEAM"],
    },
};

// Seeded Pseudo-Random Number Generator (PRNG) for deterministic puzzle rebuilds
function seededRandom(seed: number) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

export function generateRandomSeed(): number {
    return Math.floor(Math.random() * 1000000) + 1;
}

// Placement Vectors for All 8 Directions
const DIRECTION_VECTORS: Record<WordDirection, [number, number]> = {
    H: [1, 0],          // Right
    HR: [-1, 0],        // Left
    V: [0, 1],          // Down
    VR: [0, -1],        // Up
    D_TL_BR: [1, 1],    // Diagonal Down-Right
    D_TR_BL: [-1, 1],   // Diagonal Down-Left
    D_BL_TR: [1, -1],   // Diagonal Up-Right
    D_BR_TL: [-1, -1],  // Diagonal Up-Left
};

export interface PlacementResult {
    grid: string[][];
    solutionGrid: boolean[][];
    placedWords: { word: string; startX: number; startY: number; dir: WordDirection }[];
    unplacedWords: string[];
    stats: {
        fillPercentage: number;
        wordCount: number;
        placedCount: number;
        avgLength: number;
        overlapCount: number;
    };
    warnings: string[];
}

export function solveAndGenerateWordSearch(config: WordSearchConfig): PlacementResult {
    const rows = config.grid.rows;
    const cols = config.grid.cols;
    let seed = config.grid.randomSeed || 12345;

    const prng = () => {
        const r = seededRandom(seed);
        seed += 1;
        return r;
    };

    // Clean and prepare words sorted longest first for optimal packing
    const rawWords = config.words.map((w) => ({
        original: w.word,
        cleaned: w.word.toUpperCase().replace(/[^A-Z0-9]/g, ""),
    })).filter((w) => w.cleaned.length > 0);

    // Sort longest first
    const sortedWords = [...rawWords].sort((a, b) => b.cleaned.length - a.cleaned.length);

    const grid: string[][] = Array.from({ length: rows }, () => Array(cols).fill(""));
    const solutionGrid: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));

    const placedWords: { word: string; startX: number; startY: number; dir: WordDirection }[] = [];
    const unplacedWords: string[] = [];
    const warnings: string[] = [];
    let overlapCount = 0;

    const allowedDirs: WordDirection[] = config.grid.directions.length > 0 ? config.grid.directions : ["H", "V", "D_TL_BR"];

    sortedWords.forEach(({ original, cleaned }) => {
        if (cleaned.length > Math.max(rows, cols)) {
            unplacedWords.push(original);
            warnings.push(`Word "${original}" exceeds grid size.`);
            return;
        }

        let placed = false;
        let attempts = 0;
        const maxAttempts = 150;

        while (!placed && attempts < maxAttempts) {
            attempts++;
            const dir = allowedDirs[Math.floor(prng() * allowedDirs.length)];
            const vector = DIRECTION_VECTORS[dir];
            if (!vector) continue;
            const [dx, dy] = vector;

            const minX = dx < 0 ? cleaned.length - 1 : 0;
            const maxX = dx > 0 ? cols - cleaned.length : cols - 1;
            const minY = dy < 0 ? cleaned.length - 1 : 0;
            const maxY = dy > 0 ? rows - cleaned.length : rows - 1;

            if (maxX < minX || maxY < minY) continue;

            const startX = Math.floor(prng() * (maxX - minX + 1)) + minX;
            const startY = Math.floor(prng() * (maxY - minY + 1)) + minY;

            let canPlace = true;
            let currentOverlaps = 0;

            for (let i = 0; i < cleaned.length; i++) {
                const x = startX + i * dx;
                const y = startY + i * dy;
                const existingChar = grid[y][x];

                if (existingChar !== "" && existingChar !== cleaned[i]) {
                    canPlace = false;
                    break;
                }
                if (existingChar === cleaned[i]) {
                    currentOverlaps++;
                }
            }

            if (canPlace) {
                for (let i = 0; i < cleaned.length; i++) {
                    const x = startX + i * dx;
                    const y = startY + i * dy;
                    grid[y][x] = cleaned[i];
                    solutionGrid[y][x] = true;
                }
                overlapCount += currentOverlaps;
                placedWords.push({ word: original, startX, startY, dir });
                placed = true;
            }
        }

        if (!placed) {
            unplacedWords.push(original);
            warnings.push(`Could not place "${original}". Try increasing grid size.`);
        }
    });

    // Fill remaining empty cells according to fillType
    const alphabet = config.grid.fillType === "vowels" ? "AEIOU" : (config.grid.customCharset || "ABCDEFGHIJKLMNOPQRSTUVWXYZ");

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === "") {
                const char = alphabet[Math.floor(prng() * alphabet.length)];
                grid[r][c] = char;
            }
        }
    }

    // Apply Letter Case Transformation
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (config.grid.letterCase === "lowercase") {
                grid[r][c] = grid[r][c].toLowerCase();
            }
        }
    }

    const totalCells = rows * cols;
    const filledCells = solutionGrid.flat().filter(Boolean).length;
    const fillPercentage = Math.round((filledCells / totalCells) * 100);
    const avgLength = rawWords.length > 0 ? Math.round((rawWords.reduce((a, b) => a + b.cleaned.length, 0) / rawWords.length) * 10) / 10 : 0;

    return {
        grid,
        solutionGrid,
        placedWords,
        unplacedWords,
        stats: {
            fillPercentage,
            wordCount: rawWords.length,
            placedCount: placedWords.length,
            avgLength,
            overlapCount,
        },
        warnings,
    };
}

// Default Professional Word Search Configuration (CLEAN BORDERLESS DEFAULT)
export function createDefaultWordSearchConfig(themeKey = "animals"): WordSearchConfig {
    const theme = WORD_SEARCH_THEMES[themeKey] || WORD_SEARCH_THEMES.animals;
    return {
        title: `${theme.name.toUpperCase()} WORD SEARCH`,
        subtitle: "Find all the hidden words in the grid below!",
        instructions: "Circle or highlight words going horizontally, vertically, or diagonally.",
        theme: theme.name,
        difficulty: "easy",
        language: "English",
        category: "General",
        author: "Worksheet Studio",

        grid: {
            rows: 10,
            cols: 10,
            cellSize: 34,
            directions: ["H", "V", "D_TL_BR"],
            overlapMode: "smart",
            randomSeed: generateRandomSeed(),
            fillType: "random",
            cellStyle: "clean", // CLEAN BORDERLESS BY DEFAULT
            letterCase: "uppercase",
        },

        words: theme.words.map((w, i) => ({
            id: `w-${i}-${Date.now()}`,
            word: w,
            displayText: w,
        })),

        appearance: {
            titleFont: "Inter",
            titleFontSize: 22,
            titleColor: "#0f172a",

            gridFont: "Inter",
            gridFontSize: 16,
            gridLetterColor: "#0f172a",
            gridBgColor: "transparent",
            gridBorderColor: "transparent",
            gridBorderThickness: 0,
            cellBgColor: "transparent",

            wordBankFont: "Inter",
            wordBankFontSize: 12,
            wordBankColor: "#334155",
        },

        wordBank: {
            layout: "columns_3",
            columns: 3,
            sorting: "alphabetical",
        },

        answerKey: {
            showSolution: false,
            style: "highlight",
            color: "#22c55e",
        },
    };
}
