// =========================================================================
// WICCA, SACRED GEOMETRY, CELESTIAL, PLANETARY, ALCHEMY & RUNE SYMBOLS
// High-resolution SVG path vectors & Unicode glyph data
// =========================================================================

export interface WorksheetSymbol {
    id: string;
    name: string;
    category: string;
    pathData?: string;
    svgString?: string;
    textSymbol?: string;
    viewBox?: string;
}

export interface SymbolCategory {
    id: string;
    name: string;
    icon: string;
    symbols: WorksheetSymbol[];
}

export const WICCA_SYMBOL_CATEGORIES: SymbolCategory[] = [
    {
        id: "core-wicca",
        name: "Core Wicca & Sacred Geometry",
        icon: "✨",
        symbols: [
            {
                id: "pentacle",
                name: "Pentacle (In Circle)",
                category: "core-wicca",
                pathData: "M 50 5 A 45 45 0 1 0 50 95 A 45 45 0 1 0 50 5 Z M 50 14 L 61.8 50.2 L 100 50.2 L 69.1 72.6 L 80.9 99 L 50 86.4 L 19.1 99 L 30.9 72.6 L 0 50.2 L 38.2 50.2 Z",
            },
            {
                id: "pentagram",
                name: "Pentagram (5-Point Star)",
                category: "core-wicca",
                pathData: "M 50 5 L 63.8 37.4 L 98.8 37.4 L 70.5 58 L 81.3 90.5 L 50 70 L 18.7 90.5 L 29.5 58 L 1.2 37.4 L 36.2 37.4 Z",
            },
            {
                id: "triple-moon",
                name: "Triple Moon (Goddess)",
                category: "core-wicca",
                pathData: "M 40 10 A 30 30 0 1 0 40 70 A 24 24 0 1 1 40 10 Z M 80 14 A 26 26 0 1 0 80 66 A 26 26 0 1 0 80 14 Z M 120 10 A 30 30 0 1 1 120 70 A 24 24 0 1 0 120 10 Z",
            },
            {
                id: "triquetra",
                name: "Triquetra (Trinity Knot)",
                category: "core-wicca",
                pathData: "M 50 15 A 35 35 0 0 1 80 65 A 35 35 0 0 1 20 65 A 35 35 0 0 1 50 15 Z M 50 25 A 30 30 0 1 0 50 85 A 30 30 0 1 0 50 25 Z",
            },
            {
                id: "witches-knot",
                name: "Witches' Knot",
                category: "core-wicca",
                pathData: "M 50 10 A 40 40 0 1 0 50 90 A 40 40 0 1 0 50 10 Z M 50 10 C 20 10 20 90 50 90 C 80 90 80 10 50 10 Z M 10 50 C 10 20 90 20 90 50 C 90 80 10 80 10 50 Z",
            },
            {
                id: "spiral-goddess",
                name: "Spiral Goddess",
                category: "core-wicca",
                pathData: "M 15 25 A 30 30 0 0 1 65 25 M 40 25 A 10 10 0 1 0 40 45 A 10 10 0 1 0 40 25 Z M 40 45 Q 25 70 40 100 Q 55 70 40 45 Z M 40 75 m -6 0 a 6 6 0 1 0 12 0 a 12 12 0 1 0 -24 0 M 40 100 L 32 135 M 40 100 L 48 135",
            },
            {
                id: "horned-god",
                name: "Horned God Symbol",
                category: "core-wicca",
                pathData: "M 20 30 A 30 30 0 0 0 80 30 A 35 35 0 0 1 20 30 Z M 50 41 A 24 24 0 1 0 50 89 A 24 24 0 1 0 50 41 Z",
            },
            {
                id: "flower-of-life",
                name: "Flower of Life",
                category: "core-wicca",
                pathData: "M 50 4 A 46 46 0 1 0 50 96 A 46 46 0 1 0 50 4 Z M 50 28 A 22 22 0 1 0 50 72 A 22 22 0 1 0 50 28 Z M 28 39 A 22 22 0 1 0 72 39 A 22 22 0 1 0 28 39 Z M 28 61 A 22 22 0 1 0 72 61 A 22 22 0 1 0 28 61 Z",
            },
            {
                id: "seed-of-life",
                name: "Seed of Life",
                category: "core-wicca",
                pathData: "M 50 25 A 25 25 0 1 0 50 75 A 25 25 0 1 0 50 25 Z M 28.3 37.5 A 25 25 0 1 0 71.7 62.5 A 25 25 0 1 0 28.3 37.5 Z M 71.7 37.5 A 25 25 0 1 0 28.3 62.5 A 25 25 0 1 0 71.7 37.5 Z",
            },
            {
                id: "ankh",
                name: "Ankh (Key of Life)",
                category: "core-wicca",
                pathData: "M 40 8 C 28 8 22 18 22 32 C 22 46 28 56 40 56 C 52 56 58 46 58 32 C 58 18 52 8 40 8 Z M 12 62 L 68 62 M 40 62 L 40 112",
            },
            {
                id: "vegvisir",
                name: "Vegvísir (Norse Runic Compass)",
                category: "core-wicca",
                pathData: "M 60 6 A 54 54 0 1 0 60 114 A 54 54 0 1 0 60 6 Z M 60 10 L 60 110 M 10 60 L 110 60 M 25 25 L 95 95 M 95 25 L 25 95 M 60 52 A 8 8 0 1 0 60 68 A 8 8 0 1 0 60 52 Z",
            },
        ],
    },
    {
        id: "moon-sun",
        name: "Moon & Celestial",
        icon: "🌙",
        symbols: [
            {
                id: "crescent-moon-star",
                name: "Crescent Moon & Star",
                category: "moon-sun",
                pathData: "M 55 10 A 40 40 0 1 0 55 90 A 32 32 0 1 1 55 10 Z M 75 30 L 79 42 L 91 42 L 81 49 L 85 61 L 75 53 L 65 61 L 69 49 L 59 42 L 71 42 Z",
            },
            {
                id: "radiant-sun",
                name: "Radiant Sun",
                category: "moon-sun",
                pathData: "M 60 32 A 28 28 0 1 0 60 88 A 28 28 0 1 0 60 32 Z M 60 12 L 60 24 M 60 96 L 60 108 M 12 60 L 24 60 M 96 60 L 108 60 M 26 26 L 35 35 M 85 85 L 94 94 M 94 26 L 85 35 M 35 85 L 26 94",
            },
            {
                id: "sun-wheel",
                name: "Eight-Spoked Sun Wheel",
                category: "moon-sun",
                pathData: "M 50 6 A 44 44 0 1 0 50 94 A 44 44 0 1 0 50 6 Z M 50 40 A 10 10 0 1 0 50 60 A 10 10 0 1 0 50 40 Z M 50 6 L 50 94 M 6 50 L 94 50 M 19 19 L 81 81 M 81 19 L 19 81",
            },
            {
                id: "moon-phases-set",
                name: "5 Moon Phases",
                category: "moon-sun",
                pathData: "M 20 10 A 15 15 0 1 0 20 40 A 10 10 0 1 1 20 10 Z M 60 10 A 15 15 0 0 1 60 40 Z M 100 10 A 15 15 0 1 0 100 40 A 15 15 0 1 0 100 10 Z M 140 10 A 15 15 0 0 0 140 40 Z M 180 10 A 15 15 0 0 1 180 40 A 10 10 0 1 0 180 10 Z",
            },
        ],
    },
    {
        id: "planets-zodiac",
        name: "Planets & Zodiac",
        icon: "🪐",
        symbols: [
            { id: "sun-symbol", name: "Sun ☉", category: "planets-zodiac", textSymbol: "☉" },
            { id: "moon-symbol", name: "Moon ☽", category: "planets-zodiac", textSymbol: "☽" },
            { id: "mercury-symbol", name: "Mercury ☿", category: "planets-zodiac", textSymbol: "☿" },
            { id: "venus-symbol", name: "Venus ♀", category: "planets-zodiac", textSymbol: "♀" },
            { id: "earth-symbol", name: "Earth ⊕", category: "planets-zodiac", textSymbol: "⊕" },
            { id: "mars-symbol", name: "Mars ♂", category: "planets-zodiac", textSymbol: "♂" },
            { id: "jupiter-symbol", name: "Jupiter ♃", category: "planets-zodiac", textSymbol: "♃" },
            { id: "saturn-symbol", name: "Saturn ♄", category: "planets-zodiac", textSymbol: "♄" },
            { id: "uranus-symbol", name: "Uranus ♅", category: "planets-zodiac", textSymbol: "♅" },
            { id: "neptune-symbol", name: "Neptune ♆", category: "planets-zodiac", textSymbol: "♆" },
            { id: "pluto-symbol", name: "Pluto ♇", category: "planets-zodiac", textSymbol: "♇" },
            { id: "aries", name: "Aries ♈", category: "planets-zodiac", textSymbol: "♈" },
            { id: "taurus", name: "Taurus ♉", category: "planets-zodiac", textSymbol: "♉" },
            { id: "gemini", name: "Gemini ♊", category: "planets-zodiac", textSymbol: "♊" },
            { id: "cancer", name: "Cancer ♋", category: "planets-zodiac", textSymbol: "♋" },
            { id: "leo", name: "Leo ♌", category: "planets-zodiac", textSymbol: "♌" },
            { id: "virgo", name: "Virgo ♍", category: "planets-zodiac", textSymbol: "♍" },
            { id: "libra", name: "Libra ♎", category: "planets-zodiac", textSymbol: "♎" },
            { id: "scorpio", name: "Scorpio ♏", category: "planets-zodiac", textSymbol: "♏" },
            { id: "sagittarius", name: "Sagittarius ♐", category: "planets-zodiac", textSymbol: "♐" },
            { id: "capricorn", name: "Capricorn ♑", category: "planets-zodiac", textSymbol: "♑" },
            { id: "aquarius", name: "Aquarius ♒", category: "planets-zodiac", textSymbol: "♒" },
            { id: "pisces", name: "Pisces ♓", category: "planets-zodiac", textSymbol: "♓" },
        ],
    },
    {
        id: "elements-alchemy",
        name: "Elements & Alchemy",
        icon: "🜂",
        symbols: [
            {
                id: "element-fire",
                name: "Fire (Upward Triangle ▲)",
                category: "elements-alchemy",
                svgString: `<svg viewBox="0 0 80 80" width="80" height="80">
                    <polygon points="40,10 75,70 5,70" fill="none" stroke="#0f172a" stroke-width="4"/>
                </svg>`,
            },
            {
                id: "element-water",
                name: "Water (Downward Triangle ▼)",
                category: "elements-alchemy",
                svgString: `<svg viewBox="0 0 80 80" width="80" height="80">
                    <polygon points="40,70 75,10 5,10" fill="none" stroke="#0f172a" stroke-width="4"/>
                </svg>`,
            },
            {
                id: "element-air",
                name: "Air (Upward Triangle + Line)",
                category: "elements-alchemy",
                svgString: `<svg viewBox="0 0 80 80" width="80" height="80">
                    <polygon points="40,10 75,70 5,70" fill="none" stroke="#0f172a" stroke-width="4"/>
                    <line x1="15" y1="38" x2="65" y2="38" stroke="#0f172a" stroke-width="3"/>
                </svg>`,
            },
            {
                id: "element-earth",
                name: "Earth (Downward Triangle + Line)",
                category: "elements-alchemy",
                svgString: `<svg viewBox="0 0 80 80" width="80" height="80">
                    <polygon points="40,70 75,10 5,10" fill="none" stroke="#0f172a" stroke-width="4"/>
                    <line x1="15" y1="42" x2="65" y2="42" stroke="#0f172a" stroke-width="3"/>
                </svg>`,
            },
        ],
    },
    {
        id: "runes",
        name: "Elder Futhark Runes",
        icon: "ᚠ",
        symbols: [
            { id: "rune-fehu", name: "Fehu (Wealth) ᚠ", category: "runes", textSymbol: "ᚠ" },
            { id: "rune-uruz", name: "Uruz (Strength) ᚢ", category: "runes", textSymbol: "ᚢ" },
            { id: "rune-thurisaz", name: "Thurisaz (Protection) ᚮ", category: "runes", textSymbol: "ᚮ" },
            { id: "rune-ansuz", name: "Ansuz (Wisdom) ᚨ", category: "runes", textSymbol: "ᚨ" },
            { id: "rune-raidho", name: "Raidho (Journey) ᚱ", category: "runes", textSymbol: "ᚱ" },
            { id: "rune-kenaz", name: "Kenaz (Beacon) ᚲ", category: "runes", textSymbol: "ᚲ" },
            { id: "rune-gebo", name: "Gebo (Gift) ᚷ", category: "runes", textSymbol: "ᚷ" },
            { id: "rune-wunjo", name: "Wunjo (Joy) ᚹ", category: "runes", textSymbol: "ᚹ" },
            { id: "rune-hagalaz", name: "Hagalaz (Disruption) ᚺ", category: "runes", textSymbol: "ᚺ" },
            { id: "rune-nauthiz", name: "Nauthiz (Need) ᚾ", category: "runes", textSymbol: "ᚾ" },
            { id: "rune-isa", name: "Isa (Ice) ᛁ", category: "runes", textSymbol: "ᛁ" },
            { id: "rune-jera", name: "Jera (Harvest) ᛃ", category: "runes", textSymbol: "ᛃ" },
            { id: "rune-eihwaz", name: "Eihwaz (Yew Tree) ᛇ", category: "runes", textSymbol: "ᛇ" },
            { id: "rune-perthro", name: "Perthro (Mystery) ᛈ", category: "runes", textSymbol: "ᛈ" },
            { id: "rune-algiz", name: "Algiz (Elk / Protection) ᛉ", category: "runes", textSymbol: "ᛉ" },
            { id: "rune-sowilo", name: "Sowilo (Sun) ᛋ", category: "runes", textSymbol: "ᛋ" },
            { id: "rune-tiwaz", name: "Tiwaz (Honor) ᛏ", category: "runes", textSymbol: "ᛏ" },
            { id: "rune-berkano", name: "Berkano (Growth) ᛒ", category: "runes", textSymbol: "ᛒ" },
            { id: "rune-ehwaz", name: "Ehwaz (Horse / Movement) ᛖ", category: "runes", textSymbol: "ᛖ" },
            { id: "rune-mannaz", name: "Mannaz (Humanity) ᛗ", category: "runes", textSymbol: "ᛗ" },
            { id: "rune-laguz", name: "Laguz (Water / Flow) ᛚ", category: "runes", textSymbol: "ᛚ" },
            { id: "rune-ingwaz", name: "Ingwaz (Fertility) ᛝ", category: "runes", textSymbol: "ᛝ" },
            { id: "rune-dagaz", name: "Dagaz (Day / Dawn) ᛞ", category: "runes", textSymbol: "ᛞ" },
            { id: "rune-othala", name: "Othala (Ancestral Home) ᛟ", category: "runes", textSymbol: "ᛟ" },
        ],
    },
];
