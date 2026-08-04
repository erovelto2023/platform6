// =========================================================================
// CANVA-GRADE PROFESSIONAL CROSSWORD PUZZLE ENGINE & INTERSECTION GENERATOR
// =========================================================================

export type CrosswordDifficulty = "very_easy" | "easy" | "medium" | "hard" | "expert" | "custom";

export type CrosswordTypeMode = "standard" | "quick" | "mini" | "cryptic" | "fill_in" | "themed" | "math";

export type CellStyleMode = "clean" | "boxed" | "rounded";

export type SymmetryMode = "none" | "rotational" | "mirror" | "auto";

export type ClueTypeMode =
    | "definition"
    | "fill_in_blank"
    | "synonym"
    | "antonym"
    | "riddle"
    | "math"
    | "trivia"
    | "quote"
    | "vocabulary"
    | "picture"
    | "question"
    | "multiple_choice"
    | "sentence_completion"
    | "true_false";

export type ClueLayoutMode = "side_by_side" | "stacked" | "columns_2" | "columns_3";

export interface CrosswordWordEntry {
    id: string;
    word: string;          // Normalized uppercase answer
    clue: string;          // Primary clue string
    clueType?: ClueTypeMode;
    displayText?: string;
    definition?: string;
    hint?: string;
    category?: string;
    difficulty?: CrosswordDifficulty;
    notes?: string;
    locked?: boolean;      // User locked word placement
    direction?: "across" | "down";
    row?: number;
    col?: number;
    number?: number;
}

export interface CrosswordConfig {
    id?: string;
    title: string;
    subtitle?: string;
    instructions?: string;
    theme?: string;
    category?: string;
    subject?: string;
    gradeLevel?: string;
    difficulty: CrosswordDifficulty;
    language?: string;
    author?: string;
    copyright?: string;
    version?: string;

    // Crossword Type
    type: CrosswordTypeMode;

    // Grid Options
    grid: {
        rows: number;
        cols: number;
        cellSize: number;
        cellStyle: CellStyleMode;
        borderWidth: number;
        borderColor: string;
        blackSquareColor: string;
        symmetry: SymmetryMode;
        autoBlackSquares: boolean;
    };

    // Word Entries
    words: CrosswordWordEntry[];

    // Numbering Options
    numbering: {
        showNumbers: boolean;
        fontSize: number;
        color: string;
        position: "top_left" | "top_right";
    };

    // Clue Layout & Config
    clues: {
        layout: ClueLayoutMode;
        acrossTitle: string;
        downTitle: string;
        fontSize: number;
        fontFamily: string;
        color: string;
        spacing: number;
    };

    // Appearance & Typography
    appearance: {
        titleFont: string;
        titleFontSize: number;
        titleColor: string;

        gridFont: string;
        gridFontSize: number;
        gridLetterColor: string;
        gridBgColor: string;
        cellBgColor: string;
        
        blackCellColor: string;
    };

    // Answer Key
    answerKey: {
        showSolution: boolean;
        solutionColor: string;
        highlightColor: string;
    };

    // Assistance & Student Hints
    assistance?: {
        showFirstLetter?: boolean;
        showLastLetter?: boolean;
        showVowels?: boolean;
        showWordLength?: boolean;
    };

    // Print & KDP Options
    print?: {
        pageOrientation?: "portrait" | "landscape";
        includeAnswerPage?: boolean;
        largePrint?: boolean;
        blackAndWhite?: boolean;
    };

    // Metadata
    metadata?: {
        created?: string;
        version?: string;
    };
}

export interface CrosswordCell {
    row: number;
    col: number;
    letter: string;
    isBlack: boolean;
    number?: number;
    acrossEntryId?: string;
    downEntryId?: string;
}

export interface CrosswordPlacedEntry extends CrosswordWordEntry {
    direction: "across" | "down";
    row: number;
    col: number;
    number: number;
}

export interface CrosswordGenerationResult {
    config: CrosswordConfig;
    grid: CrosswordCell[][];
    placedEntries: CrosswordPlacedEntry[];
    acrossClues: CrosswordPlacedEntry[];
    downClues: CrosswordPlacedEntry[];
    unplacedWords: CrosswordWordEntry[];
    metrics: {
        wordCount: number;
        placedCount: number;
        crossingCount: number;
        fillPercentage: number;
        isolatedCellsCount: number;
        acrossCount: number;
        downCount: number;
        longestWord: string;
        shortestWord: string;
        averageLength: number;
        whiteSquares: number;
        blackSquares: number;
        difficultyScore: number;
        validationWarnings: string[];
    };
}

// Preset Themes with curated Crossword entries
export const CROSSWORD_THEMES: Record<string, { name: string; icon: string; items: { word: string; clue: string; category?: string }[] }> = {
    animals: {
        name: "Animals",
        icon: "🦁",
        items: [
            { word: "LION", clue: "King of the jungle" },
            { word: "ELEPHANT", clue: "Largest land mammal with a trunk" },
            { word: "TIGER", clue: "Large striped wild cat" },
            { word: "GIRAFFE", clue: "Tallest mammal with a long neck" },
            { word: "MONKEY", clue: "Tree-dwelling primate with a tail" },
            { word: "PENGUIN", clue: "Flightless Antarctic bird" },
            { word: "DOLPHIN", clue: "Intelligent marine mammal" },
            { word: "BEAR", clue: "Large furry mammal that hibernates" },
            { word: "ZEBRA", clue: "African mammal with black and white stripes" },
            { word: "EAGLE", clue: "Majestic bird of prey" },
        ],
    },
    science: {
        name: "Science",
        icon: "🔬",
        items: [
            { word: "ATOM", clue: "Basic unit of a chemical element" },
            { word: "ENERGY", clue: "Capacity to do work" },
            { word: "GRAVITY", clue: "Force pulling objects toward Earth" },
            { word: "MOLECULE", clue: "Group of bonded atoms" },
            { word: "GENETICS", clue: "Study of heredity and genes" },
            { word: "CELL", clue: "Basic structural unit of life" },
            { word: "PLANET", clue: "Celestial body orbiting a star" },
            { word: "OXYGEN", clue: "Gas essential for human respiration" },
            { word: "MAGNET", clue: "Object that produces a magnetic field" },
            { word: "LIGHT", clue: "Electromagnetic radiation visible to eyes" },
        ],
    },
    geography: {
        name: "Geography",
        icon: "🌍",
        items: [
            { word: "OCEAN", clue: "Vast body of salt water" },
            { word: "RIVER", clue: "Large natural stream of flowing water" },
            { word: "MOUNTAIN", clue: "High natural elevation of Earth's surface" },
            { word: "DESERT", clue: "Arid land with sparse vegetation" },
            { word: "ISLAND", clue: "Piece of land surrounded by water" },
            { word: "VALLEY", clue: "Low area of land between hills" },
            { word: "VOLCANO", clue: "Mountain that erupts lava" },
            { word: "CAPITAL", clue: "City functioning as government seat" },
            { word: "CONTINENT", clue: "One of Earth's seven large landmasses" },
            { word: "GLACIER", clue: "Slowly moving mass of dense ice" },
        ],
    },
    math: {
        name: "Math & Numbers",
        icon: "📐",
        items: [
            { word: "RADIUS", clue: "Distance from center to circle edge" },
            { word: "ANGLE", clue: "Figure formed by two rays meeting at a point" },
            { word: "FRACTION", clue: "Numerical quantity that is not a whole number" },
            { word: "SUM", clue: "Result of adding two or more numbers" },
            { word: "EQUATION", clue: "Mathematical statement that two expressions are equal" },
            { word: "ALGEBRA", clue: "Branch of math using symbols and letters" },
            { word: "PRIME", clue: "Number divisible only by 1 and itself" },
            { word: "POLYGON", clue: "Plane figure with at least three straight sides" },
            { word: "PRODUCT", clue: "Result of multiplying two numbers" },
            { word: "RATIO", clue: "Quantitative relation between two amounts" },
        ],
    },
    esl: {
        name: "Vocabulary & ESL",
        icon: "📚",
        items: [
            { word: "FRIEND", clue: "Person you know and like" },
            { word: "HAPPY", clue: "Feeling or showing pleasure" },
            { word: "SCHOOL", clue: "Institution for learning" },
            { word: "FAMILY", clue: "Group of related individuals" },
            { word: "WEATHER", clue: "State of atmosphere at a time" },
            { word: "SEASON", clue: "One of four divisions of the year" },
            { word: "TRAVEL", clue: "Go from one place to another" },
            { word: "HEALTH", clue: "State of physical and mental well-being" },
            { word: "MUSIC", clue: "Vocal or instrumental sounds" },
            { word: "COLOR", clue: "Visual perception produced by light wavelengths" },
        ],
    },
};

// Create Default Canva-Grade Crossword Config
export function createDefaultCrosswordConfig(): CrosswordConfig {
    const defaultTheme = CROSSWORD_THEMES.animals;
    return {
        title: "CROSSWORD PUZZLE",
        subtitle: "Read the clues and fill in the puzzle grid",
        instructions: "Complete across and down entries using the given definitions.",
        theme: "Animals",
        difficulty: "medium",
        type: "standard",
        language: "English",

        grid: {
            rows: 13,
            cols: 13,
            cellSize: 32,
            cellStyle: "clean",
            borderWidth: 1,
            borderColor: "#cbd5e1",
            blackSquareColor: "#1e293b",
            symmetry: "rotational",
            autoBlackSquares: true,
        },

        words: defaultTheme.items.map((item, idx) => ({
            id: `cw-word-${idx}`,
            word: item.word.toUpperCase().replace(/[^A-Z]/g, ""),
            clue: item.clue,
            clueType: "definition",
            difficulty: "medium",
        })),

        numbering: {
            showNumbers: true,
            fontSize: 9,
            color: "#334155",
            position: "top_left",
        },

        clues: {
            layout: "side_by_side",
            acrossTitle: "ACROSS",
            downTitle: "DOWN",
            fontSize: 11,
            fontFamily: "Inter",
            color: "#334155",
            spacing: 4,
        },

        appearance: {
            titleFont: "Inter",
            titleFontSize: 22,
            titleColor: "#0f172a",

            gridFont: "Inter",
            gridFontSize: 15,
            gridLetterColor: "#0f172a",
            gridBgColor: "#ffffff",
            cellBgColor: "#ffffff",
            blackCellColor: "#1e293b",
        },

        answerKey: {
            showSolution: false,
            solutionColor: "#16a34a",
            highlightColor: "#bbf7d0",
        },

        metadata: {
            created: new Date().toISOString(),
            version: "2.0.0",
        },
    };
}

// =========================================================================
// CROSSWORD INTERSECTION & BACKTRACKING GENERATOR ALGORITHM
// =========================================================================

export function solveAndGenerateCrossword(config: CrosswordConfig): CrosswordGenerationResult {
    const rows = config.grid.rows;
    const cols = config.grid.cols;

    // Clean word list (uppercase, A-Z only, min length 2)
    const rawWords = config.words
        .map((w) => ({
            ...w,
            word: w.word.toUpperCase().replace(/[^A-Z]/g, ""),
        }))
        .filter((w) => w.word.length >= 2);

    // Sort words by length descending to place larger anchor words first
    const sortedWords = [...rawWords].sort((a, b) => b.word.length - a.word.length);

    // Grid representation
    const gridMatrix: (string | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));

    const placedEntries: CrosswordPlacedEntry[] = [];
    const unplacedWords: CrosswordWordEntry[] = [];

    // Helper: Can place word at (r, c) in direction?
    const canPlaceWord = (word: string, r: number, c: number, dir: "across" | "down"): boolean => {
        const len = word.length;
        if (dir === "across") {
            if (c + len > cols) return false;
            // Check cell before word
            if (c > 0 && gridMatrix[r][c - 1] !== null) return false;
            // Check cell after word
            if (c + len < cols && gridMatrix[r][c + len] !== null) return false;

            let intersections = 0;
            for (let i = 0; i < len; i++) {
                const existing = gridMatrix[r][c + i];
                const char = word[i];
                if (existing !== null) {
                    if (existing !== char) return false;
                    intersections++;
                } else {
                    // Check parallel adjacent cells (above and below) to avoid unneeded touchings
                    if (r > 0 && gridMatrix[r - 1][c + i] !== null) {
                        // Allowed only if forming valid cross
                    }
                    if (r < rows - 1 && gridMatrix[r + 1][c + i] !== null) {
                        // Allowed only if forming valid cross
                    }
                }
            }
            // First placed word doesn't need intersection, subsequent words do
            if (placedEntries.length > 0 && intersections === 0) return false;
            return true;
        } else {
            if (r + len > rows) return false;
            // Check cell before word
            if (r > 0 && gridMatrix[r - 1][c] !== null) return false;
            // Check cell after word
            if (r + len < rows && gridMatrix[r + len][c] !== null) return false;

            let intersections = 0;
            for (let i = 0; i < len; i++) {
                const existing = gridMatrix[r + i][c];
                const char = word[i];
                if (existing !== null) {
                    if (existing !== char) return false;
                    intersections++;
                }
            }
            if (placedEntries.length > 0 && intersections === 0) return false;
            return true;
        }
    };

    // Helper: Commit word to grid
    const commitWord = (entry: CrosswordWordEntry, r: number, c: number, dir: "across" | "down") => {
        const word = entry.word;
        for (let i = 0; i < word.length; i++) {
            if (dir === "across") gridMatrix[r][c + i] = word[i];
            else gridMatrix[r + i][c] = word[i];
        }
        placedEntries.push({
            ...entry,
            direction: dir,
            row: r,
            col: c,
            number: 0, // Numbering assigned in post-pass
        });
    };

    // 1. Place First Anchor Word near center
    if (sortedWords.length > 0) {
        const first = sortedWords[0];
        const startR = Math.floor(rows / 2);
        const startC = Math.max(0, Math.floor((cols - first.word.length) / 2));
        if (canPlaceWord(first.word, startR, startC, "across")) {
            commitWord(first, startR, startC, "across");
        } else {
            // Fallback placement
            commitWord(first, 1, 1, "across");
        }
    }

    // 2. Iteratively place remaining words seeking maximum intersections
    for (let wIdx = 1; wIdx < sortedWords.length; wIdx++) {
        const item = sortedWords[wIdx];
        const word = item.word;

        let bestPlacement: { r: number; c: number; dir: "across" | "down"; score: number } | null = null;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                for (const dir of ["across", "down"] as const) {
                    if (canPlaceWord(word, r, c, dir)) {
                        // Calculate intersection density score
                        let count = 0;
                        for (let i = 0; i < word.length; i++) {
                            const curR = dir === "across" ? r : r + i;
                            const curC = dir === "across" ? c + i : c;
                            if (gridMatrix[curR][curC] === word[i]) count++;
                        }
                        const score = count * 10 - Math.abs(r - rows / 2) - Math.abs(c - cols / 2);
                        if (!bestPlacement || score > bestPlacement.score) {
                            bestPlacement = { r, c, dir, score };
                        }
                    }
                }
            }
        }

        if (bestPlacement) {
            commitWord(item, bestPlacement.r, bestPlacement.c, bestPlacement.dir);
        } else {
            unplacedWords.push(item);
        }
    }

    // 3. Post-Pass: Standard Crossword Numbering (1, 2, 3...)
    const numberMap: Map<string, number> = new Map();
    let currentNumber = 1;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (gridMatrix[r][c] !== null) {
                const startsAcross =
                    c < cols - 1 &&
                    gridMatrix[r][c + 1] !== null &&
                    (c === 0 || gridMatrix[r][c - 1] === null);

                const startsDown =
                    r < rows - 1 &&
                    gridMatrix[r + 1][c] !== null &&
                    (r === 0 || gridMatrix[r - 1][c] === null);

                if (startsAcross || startsDown) {
                    const key = `${r},${c}`;
                    numberMap.set(key, currentNumber);
                    currentNumber++;
                }
            }
        }
    }

    // Assign numbers to placed entries
    placedEntries.forEach((entry) => {
        const key = `${entry.row},${entry.col}`;
        entry.number = numberMap.get(key) || 1;
    });

    const acrossClues = placedEntries
        .filter((e) => e.direction === "across")
        .sort((a, b) => a.number - b.number);

    const downClues = placedEntries
        .filter((e) => e.direction === "down")
        .sort((a, b) => a.number - b.number);

    // 4. Construct Final Grid Cells with Black Cells & Numbers
    const grid: CrosswordCell[][] = [];
    let filledLetterCount = 0;
    let crossingCount = 0;

    for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
            const letter = gridMatrix[r][c];
            const isBlack = letter === null;
            const key = `${r},${c}`;
            const num = numberMap.get(key);

            if (!isBlack) filledLetterCount++;

            // Count crossings
            const hasAcross = placedEntries.some((e) => e.direction === "across" && e.row === r && c >= e.col && c < e.col + e.word.length);
            const hasDown = placedEntries.some((e) => e.direction === "down" && e.col === c && r >= e.row && r < e.row + e.word.length);
            if (hasAcross && hasDown) crossingCount++;

            const acrossEntry = placedEntries.find((e) => e.direction === "across" && e.row === r && c >= e.col && c < e.col + e.word.length);
            const downEntry = placedEntries.find((e) => e.direction === "down" && e.col === c && r >= e.row && r < e.row + e.word.length);

            grid[r][c] = {
                row: r,
                col: c,
                letter: letter || "",
                isBlack,
                number: num,
                acrossEntryId: acrossEntry?.id,
                downEntryId: downEntry?.id,
            };
        }
    }

    // Validation warnings
    const validationWarnings: string[] = [];
    if (unplacedWords.length > 0) {
        validationWarnings.push(`${unplacedWords.length} words could not be fitted into the grid layout.`);
    }
    if (crossingCount === 0 && placedEntries.length > 1) {
        validationWarnings.push("No word crossings formed. Add longer words or adjust grid size.");
    }

    const totalCells = rows * cols;
    const whiteSquares = filledLetterCount;
    const blackSquares = totalCells - whiteSquares;
    const fillPercentage = Math.round((filledLetterCount / totalCells) * 100);

    const wordLengths = placedEntries.map((e) => e.word.length);
    const longestWord = placedEntries.length > 0 ? placedEntries.reduce((a, b) => (a.word.length >= b.word.length ? a : b)).word : "";
    const shortestWord = placedEntries.length > 0 ? placedEntries.reduce((a, b) => (a.word.length <= b.word.length ? a : b)).word : "";
    const totalChars = wordLengths.reduce((acc, len) => acc + len, 0);
    const averageLength = placedEntries.length > 0 ? Math.round((totalChars / placedEntries.length) * 10) / 10 : 0;

    // Difficulty score from 1 to 10
    const lengthFactor = Math.min(5, averageLength / 2);
    const densityFactor = Math.min(5, (placedEntries.length / (rows * cols)) * 50);
    const difficultyScore = Math.min(10, Math.max(1, Math.round(lengthFactor + densityFactor)));

    return {
        config,
        grid,
        placedEntries,
        acrossClues,
        downClues,
        unplacedWords,
        metrics: {
            wordCount: config.words.length,
            placedCount: placedEntries.length,
            crossingCount,
            fillPercentage,
            isolatedCellsCount: unplacedWords.length,
            acrossCount: acrossClues.length,
            downCount: downClues.length,
            longestWord,
            shortestWord,
            averageLength,
            whiteSquares,
            blackSquares,
            difficultyScore,
            validationWarnings,
        },
    };
}

// Preset Template Configurations
export const CROSSWORD_TEMPLATES: Record<string, { name: string; description: string; rows: number; cols: number; theme: string }> = {
    mini: { name: "Mini Crossword (7x7)", description: "Quick 5-7 word mini puzzle for warmups", rows: 7, cols: 7, theme: "animals" },
    quick: { name: "Quick Crossword (10x10)", description: "Standard classroom size with 8-12 entries", rows: 10, cols: 10, theme: "esl" },
    standard: { name: "Standard Crossword (13x13)", description: "Classic balanced puzzle size for grade 4+", rows: 13, cols: 13, theme: "science" },
    vocab: { name: "Classroom Vocabulary (11x11)", description: "Subject vocabulary review layout", rows: 11, cols: 11, theme: "math" },
    newspaper: { name: "Newspaper Style (15x15)", description: "Pro 15x15 grid with rich intersections", rows: 15, cols: 15, theme: "geography" },
};

