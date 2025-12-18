"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Undo, Redo, Type, Square, Image as ImageIcon,
    Download, Layers, Trash2, MoveUp, MoveDown,
    Upload, FileText, Save, FolderOpen, X,
    RotateCw, Circle, Triangle, BoxSelect, Search,
    LayoutTemplate, FilePlus, Minus, Plus, Settings,
    Printer, Grid, Eye, EyeOff,
    AlignLeft, AlignCenter, AlignRight, Bold, Italic,
    ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
    BringToFront, SendToBack, Copy,
    Star, PieChart, Grid3X3, UploadCloud, BookOpen, Zap,
    Gamepad2, ChevronDown, ChevronRight, Key, StepForward,
    Heart, Sun, Moon, Cloud, Smile, Flag, Music, Camera, Video, Mic, MapPin, Gift, Trophy, User, Users, Phone, Mail, Calendar, Clock, Home, Car, Plane, Bike, Leaf, Flower, TreeDeciduous, Loader2
} from "lucide-react";
import toast from "react-hot-toast";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { renderToStaticMarkup } from "react-dom/server";

import { CanvasElement, TextElement, ButtonElement, ImageElement, ShapeElement, LineElement, WordSearchElement, CrosswordElement, FillInTheBlankElement, CanvasElementJSON, PlacedWord, CrosswordCell, CrosswordClue, FillInTheBlankSegment } from "@/lib/canvas-utils";
import { saveWorkbookProject, loadWorkbookProject, loadWorkbookProjectsList, deleteWorkbookProject } from "@/lib/workbook-api";

// --- Types ---

interface PageData {
    id: string;
    elements: CanvasElement[];
    thumbnail?: string; // Data URL for thumbnail
}

interface ProjectState {
    name: string;
    width: number;
    height: number;
    pages: PageData[];
    currentPageIndex: number;
    marginsEnabled: boolean;
    bleedEnabled: boolean;
}

// --- Constants ---
const PAGE_SIZES = {
    "8.5x11": { w: 816, h: 1056, label: "Letter (8.5 x 11 in)" }, // 96 DPI
    "6x9": { w: 576, h: 864, label: "Trade (6 x 9 in)" },
    "8x10": { w: 768, h: 960, label: "8 x 10 in" },
    "A4": { w: 794, h: 1123, label: "A4 (210 x 297 mm)" },
};

const FONTS = [
    "Poppins", "Inter", "Roboto", "Oswald", "Playfair Display", "Lobster", "Arial", "Courier New", "Times New Roman"
];

const ACTIVITY_CATEGORIES = [
    {
        title: "Word & Letter Puzzles",
        items: [
            { id: "wordsearch", label: "Word Search" },
            { id: "crossword", label: "Crossword Puzzle" },
            { id: "fillin", label: "Fill-in-the-Blanks" },
            { id: "scramble", label: "Word Scramble" },
            { id: "missing", label: "Missing Letter" },
            { id: "tracing", label: "Alphabet Tracing" },
            { id: "secretcode", label: "Secret Code" },
            { id: "crackcode", label: "Crack-the-Code" },
            { id: "wordladder", label: "Word Ladder" },
            { id: "hangman", label: "Hangman" },
            { id: "matchpicture", label: "Match Word to Picture" },
            { id: "compound", label: "Compound Word Match" },
            { id: "opposites", label: "Opposites Match" },
        ]
    },
    {
        title: "Number & Math Puzzles",
        items: [
            { id: "sudoku", label: "Sudoku" },
            { id: "mathmaze", label: "Math Maze" },
            { id: "dottodot", label: "Dot-to-Dot" },
            { id: "numbersearch", label: "Number Search" },
            { id: "magicsquares", label: "Magic Squares" },
            { id: "mathbingo", label: "Math Bingo" },
            { id: "colorbynumber", label: "Color-by-Number" },
            { id: "fractions", label: "Fractions" },
            { id: "multiplication", label: "Multiplication Drills" },
            { id: "division", label: "Division Challenge" },
            { id: "placevalue", label: "Place Value Blocks" },
            { id: "tellingtime", label: "Telling Time" },
            { id: "countingmoney", label: "Counting Money" },
            { id: "measurement", label: "Measurement & Ruler" },
        ]
    },
    {
        title: "Logic Puzzles",
        items: [
            { id: "mazes", label: "Mazes" },
            { id: "logicgrid", label: "Logic Grid Puzzles" },
            { id: "patternmatching", label: "Pattern Matching" },
            { id: "spotthedifference", label: "Spot the Difference" },
            { id: "hiddenobject", label: "Find Hidden Object" },
            { id: "oddout", label: "Which One Doesn't Belong?" },
            { id: "sequencing", label: "Sequencing" },
            { id: "tangram", label: "Tangram" },
            { id: "shadowmatching", label: "Shadow Matching" },
            { id: "connectpath", label: "Connect-the-Path" },
            { id: "binary", label: "Binary Puzzles" },
            { id: "nonograms", label: "Nonograms / Picross" },
        ]
    },
    {
        title: "Language Arts",
        items: [
            { id: "readingcomp", label: "Reading Comprehension" },
            { id: "grammar", label: "Grammar Fix-It" },
            { id: "writingprompts", label: "Creative Writing Prompts" },
            { id: "handwriting", label: "Handwriting Practice" },
            { id: "sentencebuilding", label: "Sentence Building" },
            { id: "storysequencing", label: "Story Sequencing" },
            { id: "vocabulary", label: "Vocabulary Builder" },
            { id: "spelling", label: "Spelling Lists" },
            { id: "rhyming", label: "Rhyming Words" },
        ]
    },
    {
        title: "Science & Nature",
        items: [
            { id: "animalclass", label: "Animal Classification" },
            { id: "plantlifecycle", label: "Plant Life Cycle" },
            { id: "weathertracking", label: "Weather Tracking" },
            { id: "experiments", label: "Simple Experiments" },
            { id: "bodysystems", label: "Body Systems" },
            { id: "solarsystem", label: "Solar System" },
            { id: "statesofmatter", label: "States of Matter" },
            { id: "recycling", label: "Recycling" },
        ]
    },
    {
        title: "Geography & Social Studies",
        items: [
            { id: "usstates", label: "U.S. States Quiz" },
            { id: "worldmap", label: "World Map Labeling" },
            { id: "flags", label: "Country Flags" },
            { id: "communityhelpers", label: "Community Helpers" },
            { id: "historicalfigures", label: "Historical Figures" },
            { id: "landforms", label: "Landforms ID" },
            { id: "continents", label: "Continents & Oceans" },
            { id: "timeline", label: "Timeline Building" },
        ]
    },
    {
        title: "Art & Creativity",
        items: [
            { id: "coloring", label: "Coloring Pages" },
            { id: "symmetry", label: "Symmetry Drawing" },
            { id: "drawingguides", label: "Step-by-Step Drawing" },
            { id: "puppets", label: "Cut-and-Color Puppets" },
            { id: "characterdesign", label: "Design Character" },
            { id: "comicstrip", label: "Comic Strip" },
            { id: "patterncoloring", label: "Pattern Coloring" },
            { id: "paperdolls", label: "Paper Dolls" },
            { id: "stencils", label: "Stencil Sheets" },
        ]
    },
    {
        title: "Holiday & Seasonal",
        items: [
            { id: "halloweenmaze", label: "Halloween Maze" },
            { id: "christmaswordsearch", label: "Christmas Word Search" },
            { id: "eastercoloring", label: "Easter Coloring" },
            { id: "valentinecoupons", label: "Valentine's Coupons" },
            { id: "newyearresolutions", label: "New Year's Resolutions" },
            { id: "birthdayactivity", label: "Birthday Activity" },
            { id: "summerbingo", label: "Summer Bingo" },
            { id: "winterpatterns", label: "Winter Patterns" },
            { id: "thanksgivinggratitude", label: "Thanksgiving Gratitude" },
        ]
    },
    {
        title: "Behavior & Life Skills",
        items: [
            { id: "chorecharts", label: "Chore Charts" },
            { id: "dailyroutine", label: "Daily Routine" },
            { id: "goalsetting", label: "Goal Setting" },
            { id: "emotions", label: "Emotion Identification" },
            { id: "socialscenarios", label: "Social Scenarios" },
            { id: "mindfulness", label: "Mindfulness Coloring" },
            { id: "weekreview", label: "Week in Review" },
            { id: "habittracker", label: "Habit Tracker" },
        ]
    },
    {
        title: "Educational Games",
        items: [
            { id: "bingo", label: "Bingo" },
            { id: "flashcards", label: "Flash Cards" },
            { id: "memorymatch", label: "Memory Match" },
            { id: "boardgames", label: "Board Games" },
            { id: "scavengerhunt", label: "Scavenger Hunt" },
            { id: "rollandcolor", label: "Roll & Color" },
            { id: "dicegames", label: "Dice Games" },
            { id: "carddeck", label: "Card Deck Games" },
            { id: "spinthewheel", label: "Spin-the-Wheel" },
        ]
    },
    {
        title: "Preschool / Kindergarten",
        items: [
            { id: "cutpaste", label: "Cut & Paste Sorting" },
            { id: "shapescolors", label: "Shapes & Colors" },
            { id: "counting1to10", label: "Counting 1-10" },
            { id: "prewriting", label: "Pre-writing Tracing" },
            { id: "animalhomes", label: "Animal Homes" },
            { id: "bigsmall", label: "Big vs. Small" },
            { id: "simplemazes", label: "Simple Mazes" },
            { id: "findletter", label: "Find the Letter" },
            { id: "puzzlecards", label: "Puzzle Cards" },
        ]
    },
];

export default function WorkbookDesignerPage() {
    // --- Refs ---
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // --- State ---
    const [project, setProject] = useState<ProjectState>({
        name: "Untitled Project",
        width: 816, // 8.5x11 @ 96dpi
        height: 1056,
        pages: [{ id: "page-1", elements: [] }],
        currentPageIndex: 0,
        marginsEnabled: true,
        bleedEnabled: false,
    });

    // --- Auto-Save / Load ---
    useEffect(() => {
        const saved = localStorage.getItem("workbook-designer-project");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Re-hydrate elements (classes are lost in JSON)
                parsed.pages = parsed.pages.map((p: PageData) => ({
                    ...p,
                    elements: p.elements.map((el: any) => {
                        let newEl: CanvasElement | null = null;
                        if (el.type === 'text') newEl = new TextElement(el.name, el.x, el.y);
                        else if (el.type === 'shape') newEl = new ShapeElement(el.name, el.x, el.y, el.shapeType);
                        else if (el.type === 'image') newEl = new ImageElement(el.name, el.x, el.y);
                        else if (el.type === 'line') newEl = new LineElement(el.name, el.x, el.y);
                        else if (el.type === 'line') newEl = new LineElement(el.name, el.x, el.y);
                        else if (el.type === 'wordsearch') newEl = new WordSearchElement(el.name, el.x, el.y, el.grid, el.words, el.placedWords);
                        else if (el.type === 'crossword') newEl = new CrosswordElement(el.name, el.x, el.y, el.grid, el.clues);

                        if (newEl) Object.assign(newEl, el);
                        return newEl;
                    }).filter(Boolean)
                }));
                setProject(parsed);
                toast.success("Project loaded from auto-save");
            } catch (e) {
                console.error("Failed to load project", e);
            }
        }
    }, []);

    // Load saved projects list from MongoDB
    useEffect(() => {
        const loadProjects = async () => {
            try {
                const projectsList = await loadWorkbookProjectsList();
                setSavedProjects(projectsList);
            } catch (error) {
                console.error('Failed to load projects list', error);
            }
        };
        loadProjects();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem("workbook-designer-project", JSON.stringify(project));
        }, 1000);
        return () => clearTimeout(timer);
    }, [project]);

    // --- Thumbnail Auto-Gen ---
    useEffect(() => {
        const timer = setTimeout(() => {
            if (canvasRef.current) {
                // Use lower quality/resolution for thumbnail to save memory
                const dataUrl = canvasRef.current.toDataURL('image/png', 0.2);

                setProject(prev => {
                    const newPages = [...prev.pages];
                    // Only update if the page exists
                    if (newPages[prev.currentPageIndex]) {
                        newPages[prev.currentPageIndex] = {
                            ...newPages[prev.currentPageIndex],
                            thumbnail: dataUrl
                        };
                        return { ...prev, pages: newPages };
                    }
                    return prev;
                });
            }
        }, 500); // 500ms debounce
        return () => clearTimeout(timer);
    }, [project.pages[project.currentPageIndex]?.elements]); // Only re-run if elements change (ref stability relies on shallow copy in setProject)

    const [selectedElementIds, setSelectedElementIds] = useState<number[]>([]);
    const [selectionBox, setSelectionBox] = useState<{ startX: number, startY: number, currentX: number, currentY: number } | null>(null);
    const [activeToolTab, setActiveToolTab] = useState<string>("pages");
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // --- Activity State ---
    const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
    const [wordSearchWords, setWordSearchWords] = useState("HELLO\nWORLD\nPUZZLE\nGAME\nFUN");
    const [wordSearchSize, setWordSearchSize] = useState(15);
    const [wsTitle, setWsTitle] = useState("My Word Search");
    const [wsDifficulty, setWsDifficulty] = useState<'easy' | 'medium' | 'hard' | 'custom'>('medium');
    const [wsAllowBackwards, setWsAllowBackwards] = useState(true);
    const [wsAllowDiagonal, setWsAllowDiagonal] = useState(true);
    const [wsAllowOverlap, setWsAllowOverlap] = useState(true);
    const [wsFillType, setWsFillType] = useState<'random' | 'theme'>('random');
    const [wsHiddenMessage, setWsHiddenMessage] = useState("");
    const [wsShape, setWsShape] = useState<'square' | 'circle'>('square');

    // --- Crossword State ---
    const [cwTitle, setCwTitle] = useState("");
    const [cwInput, setCwInput] = useState("DOG : Man's best friend\nCAT : Feline pet\nBIRD : Has wings");
    const [cwDifficulty, setCwDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

    // --- Fill-in-the-Blank State ---
    const [fbTitle, setFbTitle] = useState("Fill in the Blanks");
    const [fbInput, setFbInput] = useState("The [apple] is red.\nThe [sky] is blue.\nI like to [run] in the park.");
    const [fbBlankStyle, setFbBlankStyle] = useState<'line' | 'box'>('line');
    const [fbShowWordBank, setFbShowWordBank] = useState(true);

    // --- Word Scramble State ---
    const [scrambleTitle, setScrambleTitle] = useState("Word Scramble");
    const [scrambleInput, setScrambleInput] = useState("APPLE\nBANANA\nORANGE\nGRAPE\nSTRAWBERRY");
    const [scrambleDifficulty, setScrambleDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [scrambleShowHints, setScrambleShowHints] = useState(false);
    const [scrambleShowAnswers, setScrambleShowAnswers] = useState(false);

    // --- Missing Letters State ---
    const [missingTitle, setMissingTitle] = useState("Missing Letters");
    const [missingInput, setMissingInput] = useState("APPLE\nBANANA\nORANGE\nGRAPE\nSTRAWBERRY");
    const [missingPattern, setMissingPattern] = useState<'vowels' | 'consonants' | 'random' | 'alternate'>('vowels');
    const [missingShowHints, setMissingShowHints] = useState(false);
    const [missingShowAnswers, setMissingShowAnswers] = useState(false);

    // --- Alphabet Tracing State ---
    const [tracingTitle, setTracingTitle] = useState("Alphabet Tracing");
    const [tracingLetters, setTracingLetters] = useState("ABC");
    const [tracingCase, setTracingCase] = useState<'uppercase' | 'lowercase' | 'both'>('uppercase');
    const [tracingRepeat, setTracingRepeat] = useState(3); // How many times to repeat each letter
    const [tracingStyle, setTracingStyle] = useState<'solid' | 'dashed' | 'dotted' | 'outline'>('dashed');
    const [tracingShowGuides, setTracingShowGuides] = useState(true);

    // --- Secret Code State ---
    const [secretCodeTitle, setSecretCodeTitle] = useState("Secret Code Challenge");
    const [secretCodeText, setSecretCodeText] = useState("HELLO WORLD");
    const [secretCodeCipher, setSecretCodeCipher] = useState<'symbols' | 'numbers' | 'caesar' | 'reverse'>('symbols');
    const [secretCodeDifficulty, setSecretCodeDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
    const [secretCodeShowKey, setSecretCodeShowKey] = useState(true);
    const [secretCodeShowAnswers, setSecretCodeShowAnswers] = useState(false);

    // --- Word Ladder State ---
    const [ladderTitle, setLadderTitle] = useState("Word Ladder");
    const [ladderStart, setLadderStart] = useState("COLD");
    const [ladderEnd, setLadderEnd] = useState("WARM");
    const [ladderDifficulty, setLadderDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
    const [ladderShowHints, setLadderShowHints] = useState(true);
    const [ladderManualChain, setLadderManualChain] = useState(""); // For manual solution entry

    // --- Hangman State ---
    const [hangmanTitle, setHangmanTitle] = useState("Hangman");
    const [hangmanWord, setHangmanWord] = useState("APPLE");
    const [hangmanHint, setHangmanHint] = useState("A red fruit");
    const [hangmanShowGallows, setHangmanShowGallows] = useState(true);
    const [hangmanShowAlphabet, setHangmanShowAlphabet] = useState(true);
    const [hangmanShowSolution, setHangmanShowSolution] = useState(false);

    // --- Match Picture State ---
    const [matchTitle, setMatchTitle] = useState("Match the Pictures");
    const [matchWords, setMatchWords] = useState("APPLE\nBANANA\nCAT\nDOG");
    const [matchStyle, setMatchStyle] = useState<'lines' | 'letters'>('lines');

    // --- Image Library State ---
    const [stockSearch, setStockSearch] = useState("nature");
    const [activeImageTab, setActiveImageTab] = useState("icons");
    const [stockImages, setStockImages] = useState<any[]>([]);
    const [stockLoading, setStockLoading] = useState(false);

    const handleStockSearch = async () => {
        if (!stockSearch.trim()) return;
        setStockLoading(true);
        setStockImages([]);

        try {
            const res = await fetch(`/api/openverse/images?q=${encodeURIComponent(stockSearch)}`);
            if (res.status === 503) {
                toast("Openverse keys missing. Using fallback images.", { icon: "⚠️" });
                throw new Error("Openverse keys missing");
            }
            if (!res.ok) {
                console.error(`API Error Status: ${res.status} ${res.statusText}`);
                const text = await res.text();
                console.error("API Error Body:", text);
                try {
                    const errorData = JSON.parse(text);
                    throw new Error(errorData.details || "Failed to fetch");
                } catch (e) {
                    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
                }
            }
            const data = await res.json();
            console.log("Openverse results:", data);
            setStockImages(data.results || []);
        } catch (err: any) {
            console.error(err);
            if (err.message !== "Openverse keys missing") {
                toast.error(`Openverse error: ${err.message}`);
            }
            // Fallback to Picsum
            const fallback = [...Array(50)].map((_, i) => ({
                id: `picsum-${i}`,
                url: `https://picsum.photos/seed/${stockSearch + i}/400`,
                thumbnail: `https://picsum.photos/seed/${stockSearch + i}/200`,
                title: "Stock Image"
            }));
            setStockImages(fallback);
        } finally {
            setStockLoading(false);
        }
    };

    const iconList = [
        { icon: Star, label: "Star" },
        { icon: Heart, label: "Heart" },
        { icon: Sun, label: "Sun" },
        { icon: Moon, label: "Moon" },
        { icon: Cloud, label: "Cloud" },
        { icon: Smile, label: "Smile" },
        { icon: Zap, label: "Zap" },
        { icon: Flag, label: "Flag" },
        { icon: Music, label: "Music" },
        { icon: Camera, label: "Camera" },
        { icon: Video, label: "Video" },
        { icon: Mic, label: "Mic" },
        { icon: MapPin, label: "MapPin" },
        { icon: Gift, label: "Gift" },
        { icon: Trophy, label: "Trophy" },
        { icon: User, label: "User" },
        { icon: Users, label: "Users" },
        { icon: Phone, label: "Phone" },
        { icon: Mail, label: "Mail" },
        { icon: Calendar, label: "Calendar" },
        { icon: Clock, label: "Clock" },
        { icon: Home, label: "Home" },
        { icon: Car, label: "Car" },
        { icon: Plane, label: "Plane" },
        { icon: Bike, label: "Bike" },
        { icon: Leaf, label: "Leaf" },
        { icon: Flower, label: "Flower" },
        { icon: TreeDeciduous, label: "Tree" },
    ];

    const addIconToCanvas = (Icon: any, label: string) => {
        // Render icon to SVG string
        const svgString = renderToStaticMarkup(<Icon size={100} color="black" />);
        // Convert to data URL
        const blob = new Blob([svgString], { type: 'image/svg+xml' });

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result as string;
            const newEl = new ImageElement(`Icon ${label}`, project.width / 2 - 50, project.height / 2 - 50);
            newEl.width = 100;
            newEl.height = 100;

            const img = new Image();
            img.src = base64data;
            img.onload = () => {
                newEl.image = img;
                newEl.src = base64data;
                updateCurrentPageElements([...elements, newEl]);
                setSelectedElementIds([newEl.id]);
            };
        };
    };

    const addStockImageToCanvas = (url: string) => {
        const newEl = new ImageElement("Stock Image", project.width / 2 - 100, project.height / 2 - 100);
        newEl.width = 200;
        newEl.height = 200;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;
        img.onload = () => {
            newEl.image = img;
            newEl.src = url;
            updateCurrentPageElements([...elements, newEl]);
            setSelectedElementIds([newEl.id]);
        };
        img.onerror = () => {
            toast.error("Failed to load image.");
        };
    };

    const [expandedCategories, setExpandedCategories] = useState<string[]>(["Word & Letter Puzzles"]);
    const [savedProjects, setSavedProjects] = useState<Array<{ id: string; name: string; lastModified: string; pageCount: number }>>([]);
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

    const toggleCategory = (title: string) => {
        setExpandedCategories(prev =>
            prev.includes(title)
                ? prev.filter(t => t !== title)
                : [...prev, title]
        );
    };

    // --- Derived State ---
    const currentPage = project.pages[project.currentPageIndex];
    const elements = currentPage.elements;

    // --- Initialization ---
    useEffect(() => {
        drawCanvas();
    }, [project, selectedElementIds, zoom]);

    // --- Canvas Logic ---
    const drawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions based on zoom
        canvas.width = project.width * zoom;
        canvas.height = project.height * zoom;

        // Scale context
        ctx.scale(zoom, zoom);

        // Clear
        ctx.clearRect(0, 0, project.width, project.height);

        // Background (White Paper)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, project.width, project.height);

        // Draw Elements
        elements.forEach(el => el.draw(ctx));

        // Draw Selection
        selectedElementIds.forEach(id => {
            const el = elements.find(e => e.id === id);
            if (el) {
                ctx.save();
                const centerX = el.x + el.width / 2;
                const centerY = el.y + el.height / 2;
                if (el.rotation !== 0) {
                    ctx.translate(centerX, centerY);
                    ctx.rotate((el.rotation * Math.PI) / 180);
                    ctx.translate(-centerX, -centerY);
                }
                ctx.strokeStyle = '#007bff';
                ctx.lineWidth = 2 / zoom;
                ctx.setLineDash([5 / zoom, 5 / zoom]);
                ctx.strokeRect(el.x, el.y, el.width, el.height);

                // Rotation handle (only for primary selection or all?) - Let's show for all
                ctx.beginPath();
                ctx.moveTo(el.x + el.width / 2, el.y);
                ctx.lineTo(el.x + el.width / 2, el.y - (20 / zoom));
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(el.x + el.width / 2, el.y - (20 / zoom), 4 / zoom, 0, 2 * Math.PI);
                ctx.fillStyle = '#007bff';
                ctx.fill();

                ctx.restore();
            }
        });

        // Draw Drag Selection Box
        if (selectionBox) {
            ctx.save();
            ctx.strokeStyle = '#007bff';
            ctx.lineWidth = 1 / zoom;
            ctx.setLineDash([5 / zoom, 5 / zoom]);
            ctx.fillStyle = 'rgba(0, 123, 255, 0.1)';

            const x = Math.min(selectionBox.startX, selectionBox.currentX);
            const y = Math.min(selectionBox.startY, selectionBox.currentY);
            const w = Math.abs(selectionBox.currentX - selectionBox.startX);
            const h = Math.abs(selectionBox.currentY - selectionBox.startY);

            ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, w, h);
            ctx.restore();
        }

        // Draw Margins / Bleed Guides
        if (project.marginsEnabled) {
            ctx.save();
            ctx.strokeStyle = "rgba(255, 0, 255, 0.3)"; // Magenta guide
            ctx.lineWidth = 1 / zoom;
            const margin = 48; // 0.5 inch approx
            ctx.strokeRect(margin, margin, project.width - margin * 2, project.height - margin * 2);
            ctx.restore();
        }

    }, [project, selectedElementIds, selectionBox, zoom, elements]);

    // --- State Management Helpers ---
    const updateProject = (updates: Partial<ProjectState>) => {
        setProject(prev => ({ ...prev, ...updates }));
    };

    const updateCurrentPageElements = (newElements: CanvasElement[]) => {
        const newPages = [...project.pages];
        newPages[project.currentPageIndex] = {
            ...newPages[project.currentPageIndex],
            elements: newElements
        };
        setProject(prev => ({ ...prev, pages: newPages }));
    };

    const updateSelectedElement = (updates: any) => {
        if (selectedElementIds.length === 0) return;
        const newElements = elements.map(el => {
            if (selectedElementIds.includes(el.id)) {
                const updated = Object.assign(Object.create(Object.getPrototypeOf(el)), el, updates);
                return updated;
            }
            return el;
        });
        updateCurrentPageElements(newElements);
    };

    // --- Interaction ---
    const getMousePos = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) / zoom,
            y: (e.clientY - rect.top) / zoom
        };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const pos = getMousePos(e);
        let clicked = null;
        for (let i = elements.length - 1; i >= 0; i--) {
            if (elements[i].isHit(pos.x, pos.y)) {
                clicked = elements[i];
                break;
            }
        }

        if (clicked) {
            if (e.shiftKey) {
                // Toggle selection
                if (selectedElementIds.includes(clicked.id)) {
                    setSelectedElementIds(prev => prev.filter(id => id !== clicked.id));
                } else {
                    setSelectedElementIds(prev => [...prev, clicked.id]);
                }
            } else {
                // If not already selected, select only this one
                if (!selectedElementIds.includes(clicked.id)) {
                    setSelectedElementIds([clicked.id]);
                }
                // If already selected, keep selection (to allow dragging multiple)
            }

            // Switch tabs based on clicked element type (only if single selection)
            if (!e.shiftKey && (!selectedElementIds.includes(clicked.id) || selectedElementIds.length <= 1)) {
                if (clicked instanceof TextElement) setActiveToolTab("text");
                else if (clicked instanceof WordSearchElement) setActiveToolTab("wordsearch-properties");
                else if (clicked instanceof CrosswordElement) setActiveToolTab("crossword-properties");
            }

            setIsDragging(true);
            setDragOffset({ x: pos.x, y: pos.y }); // Store initial mouse position for delta calculation
        } else {
            // Clicked on empty space
            if (!e.shiftKey) {
                setSelectedElementIds([]);
            }
            // Start selection box
            setSelectionBox({
                startX: pos.x,
                startY: pos.y,
                currentX: pos.x,
                currentY: pos.y
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const pos = getMousePos(e);

        if (isDragging && selectedElementIds.length > 0) {
            const dx = pos.x - dragOffset.x;
            const dy = pos.y - dragOffset.y;

            const newElements = elements.map(el => {
                if (selectedElementIds.includes(el.id)) {
                    el.x += dx;
                    el.y += dy;
                }
                return el;
            });
            updateCurrentPageElements(newElements);
            setDragOffset({ x: pos.x, y: pos.y }); // Update last pos
        } else if (selectionBox) {
            setSelectionBox(prev => prev ? { ...prev, currentX: pos.x, currentY: pos.y } : null);
        }
    };

    const handleMouseUp = () => {
        if (selectionBox) {
            // Calculate selection
            const x = Math.min(selectionBox.startX, selectionBox.currentX);
            const y = Math.min(selectionBox.startY, selectionBox.currentY);
            const w = Math.abs(selectionBox.currentX - selectionBox.startX);
            const h = Math.abs(selectionBox.currentY - selectionBox.startY);

            const selected = elements.filter(el =>
                el.x + el.width > x && el.x < x + w &&
                el.y + el.height > y && el.y < y + h
            ).map(el => el.id);

            setSelectedElementIds(prev => {
                // Merge unique IDs
                const newIds = [...prev];
                selected.forEach(id => {
                    if (!newIds.includes(id)) newIds.push(id);
                });
                return newIds;
            });

            setSelectionBox(null);
        }
        setIsDragging(false);
    };

    // --- Element Actions ---
    const addElement = (el: CanvasElement) => {
        updateCurrentPageElements([...elements, el]);
        setSelectedElementIds([el.id]);
        if (el instanceof TextElement) setActiveToolTab("text");
    };

    const deleteElements = (ids: number[]) => {
        updateCurrentPageElements(elements.filter(el => !ids.includes(el.id)));
        setSelectedElementIds(prev => prev.filter(id => !ids.includes(id)));
    };

    const clearPage = () => {
        if (confirm("Are you sure you want to clear the entire page? This cannot be undone.")) {
            updateCurrentPageElements([]);
            setSelectedElementIds([]);
        }
    };

    // --- Keyboard Shortcuts ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedElementIds.length > 0 && (e.key === 'Delete' || e.key === 'Backspace')) {
                const activeTag = document.activeElement?.tagName.toLowerCase();
                if (activeTag === 'input' || activeTag === 'textarea') return;
                deleteElements(selectedElementIds);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedElementIds, elements]);

    const duplicateElements = (ids: number[]) => {
        const newElements: CanvasElement[] = [];
        const newIds: number[] = [];

        ids.forEach(id => {
            const el = elements.find(e => e.id === id);
            if (!el) return;

            const json = el.toJSON();
            let newEl: CanvasElement | null = null;

            // Factory logic (simplified)
            if (json.type === 'text') {
                newEl = new TextElement(json.name, json.x + 20, json.y + 20);
                Object.assign(newEl, json);
            } else if (json.type === 'shape') {
                // @ts-ignore
                newEl = new ShapeElement(json.name, json.x + 20, json.y + 20, json.shapeType);
                Object.assign(newEl, json);
            } else if (json.type === 'image') {
                newEl = new ImageElement(json.name, json.x + 20, json.y + 20);
                Object.assign(newEl, json);
                // @ts-ignore
                if (json.src) (newEl as ImageElement).image.src = json.src;
            } else if (json.type === 'line') {
                // @ts-ignore
                newEl = new LineElement(json.name, json.x + 20, json.y + 20);
                Object.assign(newEl, json);
            } else if (json.type === 'wordsearch') {
                // @ts-ignore
                newEl = new WordSearchElement(json.name, json.x + 20, json.y + 20, json.grid, json.words, json.placedWords);
                Object.assign(newEl, json);
            } else if (json.type === 'crossword') {
                // @ts-ignore
                newEl = new CrosswordElement(json.name, json.x + 20, json.y + 20, json.grid, json.clues);
                Object.assign(newEl, json);
            }

            if (newEl) {
                newEl.id = Date.now() + Math.random();
                newEl.x = el.x + 20;
                newEl.y = el.y + 20;
                newElements.push(newEl);
                newIds.push(newEl.id);
            }
        });

        if (newElements.length > 0) {
            updateCurrentPageElements([...elements, ...newElements]);
            setSelectedElementIds(newIds);
        }
    };

    const moveLayer = (id: number, direction: 'up' | 'down' | 'top' | 'bottom') => {
        const index = elements.findIndex(el => el.id === id);
        if (index === -1) return;

        const newElements = [...elements];
        const el = newElements[index];
        newElements.splice(index, 1);

        if (direction === 'up') newElements.splice(Math.min(index + 1, newElements.length), 0, el);
        else if (direction === 'down') newElements.splice(Math.max(0, index - 1), 0, el);
        else if (direction === 'top') newElements.push(el);
        else if (direction === 'bottom') newElements.unshift(el);

        updateCurrentPageElements(newElements);
    };

    // --- Page Actions ---
    const addPage = () => {
        const newPage: PageData = {
            id: `page-${Date.now()}`,
            elements: []
        };
        setProject(prev => ({
            ...prev,
            pages: [...prev.pages, newPage],
            currentPageIndex: prev.pages.length // Switch to new page
        }));
    };

    const deletePage = (index: number) => {
        if (project.pages.length <= 1) {
            toast.error("Cannot delete the last page");
            return;
        }
        const newPages = project.pages.filter((_, i) => i !== index);
        setProject(prev => ({
            ...prev,
            pages: newPages,
            currentPageIndex: Math.min(prev.currentPageIndex, newPages.length - 1)
        }));
    };

    const duplicatePage = (index: number) => {
        const pageToClone = project.pages[index];
        // Deep clone elements
        const clonedElements = pageToClone.elements.map(el => {
            const json = el.toJSON();
            let newEl: CanvasElement | null = null;
            if (json.type === 'text') {
                newEl = new TextElement(json.name, json.x, json.y);
                Object.assign(newEl, json);
            } else if (json.type === 'button') {
                newEl = new ButtonElement(json.name, json.x, json.y);
                // @ts-ignore
                const { textElement, ...btnData } = json;
                Object.assign(newEl, btnData);
                // @ts-ignore
                if (textElement) Object.assign((newEl as ButtonElement).textElement, textElement);
            } else if (json.type === 'image') {
                newEl = new ImageElement(json.name, json.x, json.y);
                Object.assign(newEl, json);
                // @ts-ignore
                if (json.src) (newEl as ImageElement).image.src = json.src;
            } else if (json.type === 'shape') {
                // @ts-ignore
                newEl = new ShapeElement(json.name, json.x, json.y, json.shapeType);
                Object.assign(newEl, json);
            } else if (json.type === 'line') {
                // @ts-ignore
                newEl = new LineElement(json.name, json.x, json.y);
                Object.assign(newEl, json);
            } else if (json.type === 'wordsearch') {
                // @ts-ignore
                newEl = new WordSearchElement(json.name, json.x, json.y, json.grid, json.words, json.placedWords);
                Object.assign(newEl, json);
            } else if (json.type === 'crossword') {
                // @ts-ignore
                newEl = new CrosswordElement(json.name, json.x, json.y, json.grid, json.clues);
                Object.assign(newEl, json);
            }
            if (newEl) newEl.id = Date.now() + Math.random();
            return newEl;
        }).filter(Boolean) as CanvasElement[];

        const newPage: PageData = {
            id: `page-${Date.now()}`,
            elements: clonedElements
        };

        const newPages = [...project.pages];
        newPages.splice(index + 1, 0, newPage);

        setProject(prev => ({
            ...prev,
            pages: newPages,
            currentPageIndex: index + 1
        }));
    };

    // --- Activity Generators ---
    const handleGenerateWordSearch = () => {
        const words = wordSearchWords.split('\n')
            .map(w => w.trim().toUpperCase().replace(/[^A-Z]/g, ''))
            .filter(w => w.length > 0);

        // Remove duplicates
        const uniqueWords = Array.from(new Set(words));

        const size = wordSearchSize;
        const grid = Array(size).fill(null).map(() => Array(size).fill(''));
        const placedWords: PlacedWord[] = [];

        // Apply Shape Mask
        if (wsShape === 'circle') {
            const center = (size - 1) / 2;
            const radius = size / 2;
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    const dist = Math.sqrt(Math.pow(r - center, 2) + Math.pow(c - center, 2));
                    if (dist > radius) {
                        grid[r][c] = '#'; // Mark as blocked
                    }
                }
            }
        }

        // Determine directions based on settings
        let directions: [number, number][] = [];

        if (wsDifficulty === 'easy') {
            // Horizontal and Vertical only, forward
            directions = [[0, 1], [1, 0]];
        } else if (wsDifficulty === 'medium') {
            // + Diagonal forward
            directions = [[0, 1], [1, 0], [1, 1], [-1, 1]];
        } else if (wsDifficulty === 'hard') {
            // All 8 directions
            directions = [
                [0, 1], [1, 0], [1, 1], [-1, 1],
                [0, -1], [-1, 0], [-1, -1], [1, -1]
            ];
        } else {
            // Custom
            directions = [[0, 1], [1, 0]]; // Always allow basic
            if (wsAllowDiagonal) directions.push([1, 1], [-1, 1]);
            if (wsAllowBackwards) {
                directions.push([0, -1], [-1, 0]);
                if (wsAllowDiagonal) directions.push([-1, -1], [1, -1]);
            }
        }

        const placeWord = (word: string, grid: string[][]): boolean => {
            const possibleStarts = [];
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    possibleStarts.push({ r, c });
                }
            }
            // Shuffle starts
            possibleStarts.sort(() => Math.random() - 0.5);

            for (const start of possibleStarts) {
                const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);
                for (const [dr, dc] of shuffledDirs) {
                    let canPlace = true;
                    // Check bounds and overlap
                    for (let i = 0; i < word.length; i++) {
                        const nr = start.r + dr * i;
                        const nc = start.c + dc * i;

                        if (nr < 0 || nr >= size || nc < 0 || nc >= size) {
                            canPlace = false;
                            break;
                        }

                        const cell = grid[nr][nc];
                        if (cell === '#') { // Blocked by shape
                            canPlace = false;
                            break;
                        }
                        if (cell !== '') {
                            if (!wsAllowOverlap || cell !== word[i]) {
                                canPlace = false;
                                break;
                            }
                        }
                    }

                    if (canPlace) {
                        // Place word
                        for (let i = 0; i < word.length; i++) {
                            grid[start.r + dr * i][start.c + dc * i] = word[i];
                        }
                        placedWords.push({
                            word,
                            start: { r: start.r, c: start.c },
                            end: { r: start.r + dr * (word.length - 1), c: start.c + dc * (word.length - 1) },
                            direction: [dr, dc]
                        });
                        return true;
                    }
                }
            }
            return false;
        };

        // Sort words by length descending to place longest first
        uniqueWords.sort((a, b) => b.length - a.length);

        const unplacedWords = [];
        for (const word of uniqueWords) {
            if (!placeWord(word, grid)) {
                unplacedWords.push(word);
            }
        }

        if (unplacedWords.length > 0) {
            toast.error(`Could not place: ${unplacedWords.join(", ")}`);
        }

        // Fill empty spots
        let hiddenMsgIdx = 0;
        const cleanHiddenMsg = wsHiddenMessage.toUpperCase().replace(/[^A-Z]/g, '');

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (grid[r][c] === '#') {
                    grid[r][c] = ''; // Clear mask for rendering
                    continue;
                }

                if (!grid[r][c]) {
                    if (cleanHiddenMsg && hiddenMsgIdx < cleanHiddenMsg.length) {
                        // Fill with hidden message
                        grid[r][c] = cleanHiddenMsg[hiddenMsgIdx++];
                    } else if (wsFillType === 'random') {
                        grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                    } else {
                        // Theme fill - use letters from the words list to make it harder
                        const allLetters = uniqueWords.join('');
                        grid[r][c] = allLetters[Math.floor(Math.random() * allLetters.length)];
                    }
                }
            }
        }

        // Create elements to add
        const newElements: CanvasElement[] = [];

        // Add Title
        if (wsTitle) {
            const titleEl = new TextElement(wsTitle, project.width / 2, project.height / 2 - (size * 40) / 2 - 60);
            titleEl.text = wsTitle;
            titleEl.size = 32;
            titleEl.bold = true;
            newElements.push(titleEl);
        }

        const ws = new WordSearchElement("Word Search", project.width / 2 - (size * 40) / 2, project.height / 2 - (size * 40) / 2, grid, uniqueWords, placedWords);
        newElements.push(ws);

        // Add Word List (Wrapped)
        const wordListY = ws.y + ws.height + 40;
        const maxListWidth = project.width - 100;
        let currentLine = "";
        let formattedList = "";

        // Simple wrapping logic
        uniqueWords.forEach((word, idx) => {
            const testLine = currentLine + (currentLine ? "   " : "") + word;
            // Approximate width check (since we don't have canvas context here easily, use char count approx)
            // Avg char width ~10px at size 18
            if (testLine.length * 11 > maxListWidth) {
                formattedList += currentLine + "\n";
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        formattedList += currentLine;

        const wordListEl = new TextElement("Word List", project.width / 2, wordListY);
        wordListEl.text = formattedList;
        wordListEl.size = 18;
        wordListEl.align = 'center';
        wordListEl.x = project.width / 2;
        newElements.push(wordListEl);

        // Add all elements at once
        updateCurrentPageElements([...elements, ...newElements]);
        setSelectedElementIds([ws.id]);
        setActiveToolTab("wordsearch-properties"); // Auto-switch to properties
        toast.success("Word Search Generated!");
    };

    // --- Answer Key Generator ---
    const createAnswerKeyPage = (wsEl: WordSearchElement) => {
        // Create new page
        const newPageId = `page-${Date.now()}`;

        // Clone WS element
        const json = wsEl.toJSON();
        // @ts-ignore
        const solutionEl = new WordSearchElement(json.name, json.x, json.y, json.grid, json.words, json.placedWords);
        Object.assign(solutionEl, json);
        solutionEl.id = Date.now() + Math.random();
        solutionEl.showSolution = true; // Force solution on

        // Add "Answer Key" title
        const titleEl = new TextElement("Answer Key", wsEl.x, wsEl.y - 60);
        titleEl.size = 32;
        titleEl.bold = true;
        titleEl.align = 'center';
        titleEl.x = wsEl.x + wsEl.width / 2; // Center align

        const newPage: PageData = {
            id: newPageId,
            elements: [titleEl, solutionEl]
        };

        setProject(prev => ({
            ...prev,
            pages: [...prev.pages, newPage],
            currentPageIndex: prev.pages.length
        }));

        toast.success("Answer Key Page Created!");
        toast.success("Answer Key Page Created!");
    };

    const handleGenerateCrossword = () => {
        // Parse input
        const lines = cwInput.split('\n').filter(l => l.trim());
        const wordsData = lines.map(line => {
            const [word, clue] = line.split(':').map(s => s.trim());
            return { word: word.toUpperCase().replace(/[^A-Z]/g, ''), clue: clue || "No clue provided" };
        }).filter(w => w.word.length > 1);

        if (wordsData.length === 0) {
            toast.error("Please enter at least one valid word:clue pair.");
            return;
        }

        // Simple Crossword Generation (Backtracking / Randomized Placement)
        // This is a simplified version. A robust one would retry many times.
        const gridSize = 20;
        const grid: CrosswordCell[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill({ char: '', isActive: false }));
        const placedClues: CrosswordClue[] = [];

        // Sort by length desc
        wordsData.sort((a, b) => b.word.length - a.word.length);

        // Place first word in middle
        const firstWord = wordsData[0];
        const startRow = Math.floor(gridSize / 2);
        const startCol = Math.floor((gridSize - firstWord.word.length) / 2);

        for (let i = 0; i < firstWord.word.length; i++) {
            grid[startRow][startCol + i] = { char: firstWord.word[i], isActive: true };
        }
        placedClues.push({
            number: 1,
            direction: 'across',
            text: firstWord.clue,
            answer: firstWord.word,
            row: startRow,
            col: startCol
        });
        grid[startRow][startCol].number = 1;

        const placedWords = [firstWord.word];

        // Try to place remaining words
        for (let i = 1; i < wordsData.length; i++) {
            const current = wordsData[i];
            let placed = false;

            // Try to intersect with existing words
            // Shuffle existing placed words to vary structure? Or just iterate.
            // Iterate through every letter of current word
            for (let charIdx = 0; charIdx < current.word.length; charIdx++) {
                if (placed) break;
                const char = current.word[charIdx];

                // Find matching char in grid
                for (let r = 0; r < gridSize; r++) {
                    if (placed) break;
                    for (let c = 0; c < gridSize; c++) {
                        if (grid[r][c].char === char) {
                            // Found a potential intersection point at grid[r][c]
                            // Check if we can place vertically (if existing is horizontal) or vice versa

                            // Check Vertical Placement
                            // We need to place current word vertically such that current.word[charIdx] is at [r][c]
                            // Start of word would be at [r - charIdx][c]
                            const startR = r - charIdx;
                            const startC = c;

                            // Check bounds
                            if (startR < 0 || startR + current.word.length > gridSize) continue;

                            // Check collisions
                            let canPlaceVert = true;
                            for (let k = 0; k < current.word.length; k++) {
                                const nr = startR + k;
                                const nc = startC;
                                const existing = grid[nr][nc];

                                // Intersection point is valid
                                if (nr === r && nc === c) continue;

                                // If cell is already active, collision (unless it's the same letter, but we usually avoid double crossing for simplicity in this basic algo)
                                if (existing.isActive) {
                                    canPlaceVert = false;
                                    break;
                                }

                                // Check neighbors (don't place adjacent to other words unless crossing)
                                // Left
                                if (nc > 0 && grid[nr][nc - 1].isActive) { canPlaceVert = false; break; }
                                // Right
                                if (nc < gridSize - 1 && grid[nr][nc + 1].isActive) { canPlaceVert = false; break; }
                                // Top (only for first letter)
                                if (k === 0 && nr > 0 && grid[nr - 1][nc].isActive) { canPlaceVert = false; break; }
                                // Bottom (only for last letter)
                                if (k === current.word.length - 1 && nr < gridSize - 1 && grid[nr + 1][nc].isActive) { canPlaceVert = false; break; }
                            }

                            if (canPlaceVert) {
                                // Place it
                                for (let k = 0; k < current.word.length; k++) {
                                    grid[startR + k][startC] = { char: current.word[k], isActive: true };
                                }
                                // Assign number
                                let num = placedClues.length + 1;
                                // Check if start cell already has a number
                                if (grid[startR][startC].number) {
                                    num = grid[startR][startC].number!;
                                } else {
                                    grid[startR][startC].number = num;
                                }

                                placedClues.push({
                                    number: num,
                                    direction: 'down',
                                    text: current.clue,
                                    answer: current.word,
                                    row: startR,
                                    col: startC
                                });
                                placedWords.push(current.word);
                                placed = true;
                            }

                            if (placed) break;

                            // Check Horizontal Placement (similar logic)
                            // ... (omitted for brevity in this single-pass, but ideally we check both)
                            // For this MVP, let's just alternate or try both.
                            // Since first word is Across, let's try Down for intersections first.
                        }
                    }
                }
            }

            // If not placed, we might skip it or try to place it disconnected (if allowed)
            // For now, skip.
        }

        // Create Elements
        const newElements: CanvasElement[] = [];

        // Title
        if (cwTitle) {
            const t = new TextElement(cwTitle, project.width / 2, 50);
            t.text = cwTitle;
            t.size = 32;
            t.bold = true;
            newElements.push(t);
        }

        // Crossword Grid
        // Calculate bounds to center it
        let minR = gridSize, maxR = 0, minC = gridSize, maxC = 0;
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (grid[r][c].isActive) {
                    minR = Math.min(minR, r);
                    maxR = Math.max(maxR, r);
                    minC = Math.min(minC, c);
                    maxC = Math.max(maxC, c);
                }
            }
        }

        // Trim grid
        const rows = maxR - minR + 1;
        const cols = maxC - minC + 1;
        const trimmedGrid = Array(rows).fill(null).map((_, r) =>
            Array(cols).fill(null).map((_, c) => grid[minR + r][minC + c])
        );

        // Adjust clue coordinates
        // Not strictly needed for rendering since grid is self-contained, but good for data integrity

        const cw = new CrosswordElement("Crossword", project.width / 2 - (cols * 40) / 2, 100, trimmedGrid, placedClues);
        newElements.push(cw);

        // Clue List
        const cluesAcross = placedClues.filter(c => c.direction === 'across').sort((a, b) => a.number - b.number);
        const cluesDown = placedClues.filter(c => c.direction === 'down').sort((a, b) => a.number - b.number);

        let clueText = "ACROSS\n";
        cluesAcross.forEach(c => clueText += `${c.number}. ${c.text}\n`);
        clueText += "\nDOWN\n";
        cluesDown.forEach(c => clueText += `${c.number}. ${c.text}\n`);

        const cluesEl = new TextElement("Clues", project.width / 2, cw.y + cw.height + 20);
        cluesEl.text = clueText;
        cluesEl.size = 14;
        cluesEl.align = 'left';
        cluesEl.x = 100; // Left align roughly
        newElements.push(cluesEl);

        updateCurrentPageElements([...elements, ...newElements]);
        setSelectedElementIds([cw.id]);
        setActiveToolTab("crossword-properties");
        toast.success(`Generated Crossword with ${placedWords.length}/${wordsData.length} words`);
    };

    const handleGenerateFillInTheBlank = () => {
        if (!fbInput.trim()) {
            toast.error("Please enter some text.");
            return;
        }

        const newElements: CanvasElement[] = [];
        const wordBank: string[] = [];

        // Split input into lines
        const lines = fbInput.split('\n').filter(line => line.trim());

        let currentY = fbTitle ? 100 : 50;
        const lineSpacing = 40;

        // Process each line
        lines.forEach((line, index) => {
            const regex = /\[(.*?)\]/g;
            let processedText = line;
            let match;

            // Extract words for word bank
            while ((match = regex.exec(line)) !== null) {
                wordBank.push(match[1]);
            }

            // Replace [word] with blanks based on style
            if (fbBlankStyle === 'line') {
                processedText = line.replace(/\[(.*?)\]/g, '______');
            } else {
                processedText = line.replace(/\[(.*?)\]/g, '[      ]');
            }

            // Create a TextElement for this line
            const textEl = new TextElement(`Line ${index + 1}`, 50, currentY);
            textEl.text = processedText;
            textEl.size = 24;
            textEl.align = 'left';
            newElements.push(textEl);

            currentY += lineSpacing;
        });

        // Add title if provided
        if (fbTitle) {
            const titleEl = new TextElement("Title", project.width / 2, 50);
            titleEl.text = fbTitle;
            titleEl.size = 32;
            titleEl.bold = true;
            titleEl.align = 'center';
            newElements.unshift(titleEl); // Add to beginning
        }

        // Add word bank if enabled
        if (fbShowWordBank && wordBank.length > 0) {
            const shuffledBank = [...wordBank].sort(() => Math.random() - 0.5);
            const bankText = "Word Bank: " + shuffledBank.join(", ");

            const bankEl = new TextElement("Word Bank", 50, currentY + 20);
            bankEl.text = bankText;
            bankEl.size = 18;
            bankEl.align = 'left';
            newElements.push(bankEl);
        }

        updateCurrentPageElements([...elements, ...newElements]);
        if (newElements.length > 0) {
            setSelectedElementIds([newElements[0].id]);
        }
        toast.success(`Generated ${lines.length} fill-in-the-blank sentences`);
    };

    const handleGenerateWordScramble = () => {
        if (!scrambleInput.trim()) {
            toast.error("Please enter some words to scramble.");
            return;
        }

        // Helper function to scramble a word based on difficulty
        const scrambleWord = (word: string, difficulty: 'easy' | 'medium' | 'hard'): string => {
            const letters = word.split('');

            if (difficulty === 'easy') {
                // Easy: Keep first and last letter, scramble middle
                if (letters.length <= 3) return word;
                const first = letters[0];
                const last = letters[letters.length - 1];
                const middle = letters.slice(1, -1);

                // Shuffle middle
                for (let i = middle.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [middle[i], middle[j]] = [middle[j], middle[i]];
                }

                return first + middle.join('') + last;
            } else if (difficulty === 'medium') {
                // Medium: Full random shuffle
                for (let i = letters.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [letters[i], letters[j]] = [letters[j], letters[i]];
                }
                return letters.join('');
            } else {
                // Hard: Full shuffle + ensure it's different from original
                let scrambled = word;
                let attempts = 0;
                while (scrambled === word && attempts < 10) {
                    const shuffled = letters.slice();
                    for (let i = shuffled.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                    }
                    scrambled = shuffled.join('');
                    attempts++;
                }
                return scrambled;
            }
        };

        const newElements: CanvasElement[] = [];

        // Parse input - support "WORD" or "WORD : hint" format
        const lines = scrambleInput.split('\n').filter(line => line.trim());
        const wordData: Array<{ word: string; hint?: string; scrambled: string }> = [];

        lines.forEach(line => {
            const parts = line.split(':').map(p => p.trim());
            const word = parts[0].toUpperCase();
            const hint = parts[1];
            const scrambled = scrambleWord(word, scrambleDifficulty);

            wordData.push({ word, hint, scrambled });
        });

        let currentY = scrambleTitle ? 100 : 50;
        const lineSpacing = 40;

        // Add title if provided
        if (scrambleTitle) {
            const titleEl = new TextElement("Title", project.width / 2, 50);
            titleEl.text = scrambleTitle;
            titleEl.size = 32;
            titleEl.bold = true;
            titleEl.align = 'center';
            newElements.push(titleEl);
        }

        // Create scrambled word elements
        wordData.forEach((item, index) => {
            let displayText = `${index + 1}. ${item.scrambled}`;

            if (scrambleShowHints && item.hint) {
                displayText += `  (${item.hint})`;
            }

            const textEl = new TextElement(`Scramble ${index + 1}`, 50, currentY);
            textEl.text = displayText;
            textEl.size = 24;
            textEl.align = 'left';
            newElements.push(textEl);

            currentY += lineSpacing;
        });

        // Add answer key if enabled
        if (scrambleShowAnswers) {
            currentY += 20;
            const answerTitleEl = new TextElement("Answer Key Title", 50, currentY);
            answerTitleEl.text = "Answer Key:";
            answerTitleEl.size = 20;
            answerTitleEl.bold = true;
            answerTitleEl.align = 'left';
            newElements.push(answerTitleEl);

            currentY += 35;

            wordData.forEach((item, index) => {
                const answerEl = new TextElement(`Answer ${index + 1}`, 50, currentY);
                answerEl.text = `${index + 1}. ${item.word}`;
                answerEl.size = 18;
                answerEl.align = 'left';
                newElements.push(answerEl);

                currentY += 30;
            });
        }

        updateCurrentPageElements([...elements, ...newElements]);
        if (newElements.length > 0) {
            setSelectedElementIds([newElements[0].id]);
        }
        toast.success(`Generated ${wordData.length} scrambled words`);
    };

    const handleGenerateMissingLetters = () => {
        if (!missingInput.trim()) {
            toast.error("Please enter some words.");
            return;
        }

        // Helper function to remove letters based on pattern
        const removeLetter = (word: string, pattern: 'vowels' | 'consonants' | 'random' | 'alternate'): string => {
            const vowels = 'AEIOU';
            const letters = word.split('');

            if (pattern === 'vowels') {
                // Remove all vowels
                return letters.map(letter => vowels.includes(letter.toUpperCase()) ? '_' : letter).join(' ');
            } else if (pattern === 'consonants') {
                // Remove all consonants
                return letters.map(letter => !vowels.includes(letter.toUpperCase()) ? '_' : letter).join(' ');
            } else if (pattern === 'random') {
                // Remove 30-50% of letters randomly
                const removeCount = Math.floor(letters.length * (0.3 + Math.random() * 0.2));
                const indicesToRemove = new Set<number>();

                while (indicesToRemove.size < removeCount && indicesToRemove.size < letters.length - 1) {
                    const randomIndex = Math.floor(Math.random() * letters.length);
                    indicesToRemove.add(randomIndex);
                }

                return letters.map((letter, i) => indicesToRemove.has(i) ? '_' : letter).join(' ');
            } else {
                // Alternate: Remove every other letter
                return letters.map((letter, i) => i % 2 === 1 ? '_' : letter).join(' ');
            }
        };

        const newElements: CanvasElement[] = [];

        // Parse input - support "WORD" or "WORD : hint" format
        const lines = missingInput.split('\n').filter(line => line.trim());
        const wordData: Array<{ word: string; hint?: string; puzzle: string }> = [];

        lines.forEach(line => {
            const parts = line.split(':').map(p => p.trim());
            const word = parts[0].toUpperCase();
            const hint = parts[1];
            const puzzle = removeLetter(word, missingPattern);

            wordData.push({ word, hint, puzzle });
        });

        let currentY = missingTitle ? 100 : 50;
        const lineSpacing = 40;

        // Add title if provided
        if (missingTitle) {
            const titleEl = new TextElement("Title", project.width / 2, 50);
            titleEl.text = missingTitle;
            titleEl.size = 32;
            titleEl.bold = true;
            titleEl.align = 'center';
            newElements.push(titleEl);
        }

        // Create missing letter elements
        wordData.forEach((item, index) => {
            let displayText = `${index + 1}. ${item.puzzle}`;

            if (missingShowHints && item.hint) {
                displayText += `  (${item.hint})`;
            }

            const textEl = new TextElement(`Missing ${index + 1}`, 50, currentY);
            textEl.text = displayText;
            textEl.size = 24;
            textEl.align = 'left';
            textEl.font = 'Courier New'; // Monospace for better alignment
            newElements.push(textEl);

            currentY += lineSpacing;
        });

        // Add answer key if enabled
        if (missingShowAnswers) {
            currentY += 20;
            const answerTitleEl = new TextElement("Answer Key Title", 50, currentY);
            answerTitleEl.text = "Answer Key:";
            answerTitleEl.size = 20;
            answerTitleEl.bold = true;
            answerTitleEl.align = 'left';
            newElements.push(answerTitleEl);

            currentY += 35;

            wordData.forEach((item, index) => {
                const answerEl = new TextElement(`Answer ${index + 1}`, 50, currentY);
                answerEl.text = `${index + 1}. ${item.word}`;
                answerEl.size = 18;
                answerEl.align = 'left';
                newElements.push(answerEl);

                currentY += 30;
            });
        }

        updateCurrentPageElements([...elements, ...newElements]);
        if (newElements.length > 0) {
            setSelectedElementIds([newElements[0].id]);
        }
        toast.success(`Generated ${wordData.length} missing letter puzzles`);
    };

    const handleGenerateAlphabetTracing = () => {
        if (!tracingLetters.trim()) {
            toast.error("Please enter some letters to trace.");
            return;
        }

        const newElements: CanvasElement[] = [];

        // Parse letters - remove spaces and convert to uppercase
        const letters = tracingLetters.toUpperCase().replace(/\s/g, '').split('');

        let currentY = tracingTitle ? 120 : 80;
        const letterSpacing = 100; // Space between letter groups
        const rowHeight = 80; // Height for each letter row

        // Add title if provided
        if (tracingTitle) {
            const titleEl = new TextElement("Title", project.width / 2, 50);
            titleEl.text = tracingTitle;
            titleEl.size = 32;
            titleEl.bold = true;
            titleEl.align = 'center';
            newElements.push(titleEl);
        }

        // Create tracing elements for each letter
        letters.forEach((letter, index) => {
            const lettersToTrace: string[] = [];

            // Determine which case(s) to show
            if (tracingCase === 'uppercase') {
                lettersToTrace.push(letter.toUpperCase());
            } else if (tracingCase === 'lowercase') {
                lettersToTrace.push(letter.toLowerCase());
            } else {
                // Both cases
                lettersToTrace.push(letter.toUpperCase());
                lettersToTrace.push(letter.toLowerCase());
            }

            lettersToTrace.forEach((letterCase, caseIndex) => {
                // Create the tracing line with repeated letters
                const tracingText = letterCase + ' '.repeat(3) + letterCase.repeat(tracingRepeat - 1).split('').join(' '.repeat(3));

                const textEl = new TextElement(`Trace ${letterCase} ${index}`, 50, currentY);
                textEl.text = tracingText;
                textEl.size = 48;
                textEl.align = 'left';
                textEl.font = 'Arial'; // Clean, simple font

                // Apply tracing style
                if (tracingStyle === 'solid') {
                    textEl.color = '#CCCCCC'; // Light gray
                } else if (tracingStyle === 'dashed') {
                    textEl.color = '#BBBBBB'; // Slightly darker gray for dashed
                    // Note: Canvas text doesn't support dashed, but we can simulate with lighter color
                } else if (tracingStyle === 'dotted') {
                    textEl.color = '#DDDDDD'; // Very light gray for dotted effect
                } else if (tracingStyle === 'outline') {
                    textEl.color = '#FFFFFF'; // White fill
                    textEl.outline = true; // Enable outline
                }

                newElements.push(textEl);

                // Add guide lines if enabled (full width across page)
                if (tracingShowGuides) {
                    const pageMargin = 40;
                    const lineWidth = project.width - (pageMargin * 2);

                    // Baseline (bottom guide)
                    const baselineEl = new LineElement(`Baseline ${letterCase} ${index}`, pageMargin, currentY + 25);
                    baselineEl.width = lineWidth;
                    baselineEl.color = '#E0E0E0';
                    baselineEl.lineWidth = 1;
                    newElements.push(baselineEl);

                    // Top line (upper guide)
                    const toplineEl = new LineElement(`Topline ${letterCase} ${index}`, pageMargin, currentY - 25);
                    toplineEl.width = lineWidth;
                    toplineEl.color = '#E0E0E0';
                    toplineEl.lineWidth = 1;
                    newElements.push(toplineEl);

                    // Middle line (dashed)
                    const midlineEl = new LineElement(`Midline ${letterCase} ${index}`, pageMargin, currentY);
                    midlineEl.width = lineWidth;
                    midlineEl.color = '#F0F0F0';
                    midlineEl.lineWidth = 1;
                    newElements.push(midlineEl);
                }

                currentY += rowHeight;
            });

            // Add extra spacing between different letters
            if (index < letters.length - 1) {
                currentY += 20;
            }
        });

        updateCurrentPageElements([...elements, ...newElements]);
        if (newElements.length > 0) {
            setSelectedElementIds([newElements[0].id]);
        }
        toast.success(`Generated tracing worksheet for ${letters.length} letter(s)`);
    };

    const handleGenerateSecretCode = () => {
        if (!secretCodeText.trim()) {
            toast.error("Please enter text to encode");
            return;
        }

        const newElements: CanvasElement[] = [];
        let currentY = 100;

        // Title
        const titleEl = new TextElement(secretCodeTitle, project.width / 2, currentY);
        titleEl.text = secretCodeTitle;
        titleEl.size = 32;
        titleEl.bold = true;
        titleEl.align = 'center';
        titleEl.color = '#2563eb';
        newElements.push(titleEl);
        currentY += 60;

        // Generate cipher mapping
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const symbols = ['★', '◆', '●', '■', '▲', '♠', '♣', '♥', '♦', '☀', '☁', '☂', '☃', '☄', '★', '☆', '☉', '☊', '☋', '☌', '☍', '☎', '☏', '☐', '☑', '☒'];
        const cipherMap: { [key: string]: string } = {};
        const reverseMap: { [key: string]: string } = {};

        // Create cipher based on type
        if (secretCodeCipher === 'symbols') {
            alphabet.split('').forEach((letter, i) => {
                cipherMap[letter] = symbols[i];
                reverseMap[symbols[i]] = letter;
            });
        } else if (secretCodeCipher === 'numbers') {
            alphabet.split('').forEach((letter, i) => {
                cipherMap[letter] = (i + 1).toString();
                reverseMap[(i + 1).toString()] = letter;
            });
        } else if (secretCodeCipher === 'caesar') {
            // Caesar shift (ROT3)
            const shift = 3;
            alphabet.split('').forEach((letter, i) => {
                const shiftedIndex = (i + shift) % 26;
                cipherMap[letter] = alphabet[shiftedIndex];
                reverseMap[alphabet[shiftedIndex]] = letter;
            });
        } else if (secretCodeCipher === 'reverse') {
            // Reverse alphabet (A↔Z, B↔Y, etc.)
            alphabet.split('').forEach((letter, i) => {
                const reverseLetter = alphabet[25 - i];
                cipherMap[letter] = reverseLetter;
                reverseMap[reverseLetter] = letter;
            });
        }

        // Encode the text
        const encodedText = secretCodeText.toUpperCase().split('').map(char => {
            if (char === ' ') return '  '; // Double space for word breaks
            if (cipherMap[char]) return cipherMap[char];
            return char; // Keep punctuation as-is
        }).join(' ');

        // Display encoded message
        const instructionEl = new TextElement("Decode the secret message:", 50, currentY);
        instructionEl.text = "Decode the secret message:";
        instructionEl.size = 18;
        instructionEl.align = 'left';
        instructionEl.color = '#334155';
        newElements.push(instructionEl);
        currentY += 40;

        // Encoded text (larger, centered)
        const encodedEl = new TextElement("Encoded Message", project.width / 2, currentY);
        encodedEl.text = encodedText;
        encodedEl.size = secretCodeCipher === 'symbols' ? 28 : 24;
        encodedEl.align = 'center';
        encodedEl.color = '#1e293b';
        encodedEl.font = secretCodeCipher === 'symbols' ? 'Arial' : 'Courier New';
        newElements.push(encodedEl);
        currentY += 60;

        // Decoding space
        const decodeLabel = new TextElement("Your Answer:", 50, currentY);
        decodeLabel.text = "Your Answer:";
        decodeLabel.size = 16;
        decodeLabel.align = 'left';
        decodeLabel.color = '#64748b';
        newElements.push(decodeLabel);
        currentY += 30;

        // Answer line
        const answerLine = new LineElement("Answer Line", 50, currentY);
        answerLine.width = project.width - 100;
        answerLine.color = '#cbd5e1';
        answerLine.lineWidth = 1;
        newElements.push(answerLine);
        currentY += 50;

        // Show key based on difficulty
        if (secretCodeShowKey && secretCodeDifficulty === 'easy') {
            const keyTitle = new TextElement("Cipher Key:", 50, currentY);
            keyTitle.text = "Cipher Key:";
            keyTitle.size = 18;
            keyTitle.bold = true;
            keyTitle.align = 'left';
            keyTitle.color = '#334155';
            newElements.push(keyTitle);
            currentY += 35;

            // Display key in columns
            const lettersPerColumn = 13;
            const columnWidth = 200;

            alphabet.split('').forEach((letter, i) => {
                const column = Math.floor(i / lettersPerColumn);
                const row = i % lettersPerColumn;
                const x = 50 + (column * columnWidth);
                const y = currentY + (row * 25);

                const keyEntry = new TextElement(`Key ${letter}`, x, y);
                keyEntry.text = `${letter} = ${cipherMap[letter]}`;
                keyEntry.size = 14;
                keyEntry.align = 'left';
                keyEntry.color = '#475569';
                keyEntry.font = secretCodeCipher === 'symbols' ? 'Arial' : 'Courier New';
                newElements.push(keyEntry);
            });
            currentY += (lettersPerColumn * 25) + 20;
        } else if (secretCodeShowKey && secretCodeDifficulty === 'medium') {
            // Partial key - show only vowels and a few consonants
            const partialLetters = ['A', 'E', 'I', 'O', 'U', 'T', 'N', 'S', 'R'];
            const keyTitle = new TextElement("Partial Key (Hints):", 50, currentY);
            keyTitle.text = "Partial Key (Hints):";
            keyTitle.size = 18;
            keyTitle.bold = true;
            keyTitle.align = 'left';
            keyTitle.color = '#334155';
            newElements.push(keyTitle);
            currentY += 35;

            partialLetters.forEach((letter, i) => {
                const x = 50 + (i % 5) * 150;
                const y = currentY + Math.floor(i / 5) * 25;

                const keyEntry = new TextElement(`Hint ${letter}`, x, y);
                keyEntry.text = `${letter} = ${cipherMap[letter]}`;
                keyEntry.size = 14;
                keyEntry.align = 'left';
                keyEntry.color = '#475569';
                keyEntry.font = secretCodeCipher === 'symbols' ? 'Arial' : 'Courier New';
                newElements.push(keyEntry);
            });
            currentY += 60;
        }

        // Answer key (optional)
        if (secretCodeShowAnswers) {
            currentY += 30;
            const answerTitle = new TextElement("Answer:", 50, currentY);
            answerTitle.text = "Answer:";
            answerTitle.size = 16;
            answerTitle.bold = true;
            answerTitle.align = 'left';
            answerTitle.color = '#dc2626';
            newElements.push(answerTitle);
            currentY += 30;

            const answerText = new TextElement("Answer Text", project.width / 2, currentY);
            answerText.text = secretCodeText.toUpperCase();
            answerText.size = 20;
            answerText.align = 'center';
            answerText.color = '#dc2626';
            answerText.font = 'Courier New';
            newElements.push(answerText);
        }

        // Add elements to current page
        const updatedPages = [...project.pages];
        updatedPages[project.currentPageIndex] = {
            ...updatedPages[project.currentPageIndex],
            elements: [...updatedPages[project.currentPageIndex].elements, ...newElements]
        };
        setProject({ ...project, pages: updatedPages });

        if (newElements.length > 0) {
            setSelectedElementIds([newElements[0].id]);
        }
        toast.success("Secret code puzzle generated!");
    };

    const handleGenerateWordLadder = () => {
        const start = ladderStart.trim().toUpperCase();
        const end = ladderEnd.trim().toUpperCase();

        if (!start || !end) {
            toast.error("Please enter start and end words.");
            return;
        }

        if (start.length !== end.length) {
            toast.error("Start and end words must be the same length.");
            return;
        }

        const newElements: CanvasElement[] = [];
        let currentY = 100;

        // Title
        const titleEl = new TextElement(ladderTitle, project.width / 2, currentY);
        titleEl.text = ladderTitle;
        titleEl.size = 32;
        titleEl.bold = true;
        titleEl.align = 'center';
        titleEl.color = '#2563eb';
        newElements.push(titleEl);
        currentY += 80;

        // Determine steps
        let steps: string[] = [];
        if (ladderManualChain.trim()) {
            steps = ladderManualChain.split(',').map(s => s.trim().toUpperCase()).filter(s => s);
            // Validate manual chain
            const invalid = steps.some(s => s.length !== start.length);
            if (invalid) {
                toast.error("All steps must be the same length as start/end words.");
                return;
            }
        } else {
            // Generate blank steps based on difficulty
            const numSteps = ladderDifficulty === 'easy' ? 3 : ladderDifficulty === 'medium' ? 5 : 8;
            steps = Array(numSteps).fill('_'.repeat(start.length));
        }

        // Render Ladder
        const stepHeight = 90;
        const boxSize = 50;
        const gap = 10;
        const totalWidth = start.length * (boxSize + gap) - gap;
        const startX = (project.width - totalWidth) / 2;

        // Helper to draw a word row
        const drawRow = (word: string, y: number, isHint: boolean = false) => {
            for (let i = 0; i < start.length; i++) {
                const char = word[i];
                const x = startX + i * (boxSize + gap);

                // Box
                const box = new ShapeElement(`Box ${y}-${i}`, x, y, 'rectangle');
                box.width = boxSize;
                box.height = boxSize;
                box.strokeColor = '#334155';
                box.fillColor = 'transparent';
                box.strokeWidth = 2;
                newElements.push(box);

                // Letter (if not underscore or if hint)
                if (char !== '_' || isHint) {
                    // Center text in box:
                    // X: boxCenter - approxHalfWidth (assuming avg width ~20px, so -10)
                    // Y: boxTop + (boxHeight - fontSize) / 2
                    const text = new TextElement(`Char ${y}-${i}`, x + boxSize / 2 - 10, y + (boxSize - 28) / 2);
                    text.text = char === '_' ? '' : char;
                    text.size = 28;
                    text.align = 'center';
                    text.bold = true;
                    newElements.push(text);
                }
            }
        };

        // Start Word
        drawRow(start, currentY);

        // Arrow
        let arrowY = currentY + boxSize + 5;
        const arrow = new TextElement("Arrow Start", project.width / 2, arrowY);
        arrow.text = "↓";
        arrow.size = 24;
        arrow.align = 'center';
        newElements.push(arrow);

        currentY += stepHeight;

        // Steps
        steps.forEach((step, idx) => {
            drawRow('_'.repeat(start.length), currentY);

            // Arrow (except after last step if it connects to end word immediately, which it does)
            arrowY = currentY + boxSize + 5;
            const arrow = new TextElement(`Arrow ${idx}`, project.width / 2, arrowY);
            arrow.text = "↓";
            arrow.size = 24;
            arrow.align = 'center';
            newElements.push(arrow);

            currentY += stepHeight;
        });

        // End Word
        drawRow(end, currentY);

        // Add Answer Key if manual chain provided
        if (ladderManualChain.trim()) {
            // Create a text element with the solution
            const solutionText = `${start} -> ${steps.join(' -> ')} -> ${end}`;
            const solEl = new TextElement("Solution", 50, project.height - 50);
            solEl.text = "Solution: " + solutionText;
            solEl.size = 12;
            solEl.color = '#94a3b8'; // Light gray
            newElements.push(solEl);
        }

        updateCurrentPageElements([...elements, ...newElements]);
        if (newElements.length > 0) {
            setSelectedElementIds([newElements[0].id]);
        }
        toast.success("Word Ladder Generated!");
    };

    const handleGenerateHangman = () => {
        const word = hangmanWord.trim().toUpperCase();
        if (!word) {
            toast.error("Please enter a word or phrase.");
            return;
        }

        const newElements: CanvasElement[] = [];
        let currentY = 80;

        // Title
        const titleEl = new TextElement(hangmanTitle, project.width / 2, currentY);
        titleEl.text = hangmanTitle;
        titleEl.size = 32;
        titleEl.bold = true;
        titleEl.align = 'center';
        titleEl.color = '#2563eb';
        newElements.push(titleEl);
        currentY += 60;

        // Gallows
        if (hangmanShowGallows) {
            const gallowsX = project.width / 2 - 75; // Center the 150px base
            const gallowsY = currentY;

            // Base (Rect)
            const baseRect = new ShapeElement("Base", gallowsX, gallowsY + 200, 'rectangle');
            baseRect.width = 150;
            baseRect.height = 5;
            baseRect.fillColor = 'black';
            newElements.push(baseRect);

            // Vertical Pole
            const vPoleRect = new ShapeElement("VPole", gallowsX + 30, gallowsY, 'rectangle');
            vPoleRect.width = 5;
            vPoleRect.height = 200;
            vPoleRect.fillColor = 'black';
            newElements.push(vPoleRect);

            // Top Pole
            const topPoleRect = new ShapeElement("TopPole", gallowsX + 30, gallowsY, 'rectangle');
            topPoleRect.width = 100;
            topPoleRect.height = 5;
            topPoleRect.fillColor = 'black';
            newElements.push(topPoleRect);

            // Rope
            const rope = new ShapeElement("Rope", gallowsX + 125, gallowsY, 'rectangle');
            rope.width = 2;
            rope.height = 30;
            rope.fillColor = '#888';
            newElements.push(rope);

            currentY += 250;
        } else {
            currentY += 50;
        }

        // Word Blanks
        const charSize = 40;
        const charGap = 10;
        const totalWidth = word.length * (charSize + charGap) - charGap;
        let startX = (project.width - totalWidth) / 2;

        if (totalWidth > project.width - 100) {
            startX = 50; // Left align if too long
        }

        let x = startX;
        let y = currentY;

        for (let i = 0; i < word.length; i++) {
            const char = word[i];

            if (x + charSize > project.width - 50) {
                x = startX;
                y += 60;
            }

            if (char === ' ') {
                x += charSize + charGap;
                continue;
            }

            // Underscore
            const line = new LineElement(`Blank ${i}`, x, y + charSize);
            line.width = charSize;
            line.lineWidth = 2;
            newElements.push(line);

            // Solution Letter (Hidden or Shown)
            if (hangmanShowSolution) {
                const text = new TextElement(`Sol ${i}`, x + charSize / 2, y + charSize / 2);
                text.text = char;
                text.size = 24;
                text.align = 'center';
                text.color = '#ccc';
                newElements.push(text);
            }

            x += charSize + charGap;
        }

        currentY = y + 80;

        // Hint
        if (hangmanHint.trim()) {
            const hintEl = new TextElement("Hint", project.width / 2, currentY);
            hintEl.text = `Hint: ${hangmanHint}`;
            hintEl.size = 18;
            hintEl.italic = true;
            hintEl.align = 'center';
            hintEl.color = '#64748b';
            newElements.push(hintEl);
            currentY += 50;
        }

        // Alphabet Grid
        if (hangmanShowAlphabet) {
            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const alphaSize = 24;
            const alphaGap = 15;
            const alphaWidth = 13 * (alphaSize + alphaGap); // 13 per row
            const alphaStartX = (project.width - alphaWidth) / 2;

            let ax = alphaStartX;
            let ay = currentY + 20;

            for (let i = 0; i < alphabet.length; i++) {
                if (i === 13) {
                    ax = alphaStartX;
                    ay += 40;
                }

                const letter = new TextElement(`Alpha ${alphabet[i]}`, ax + alphaSize / 2, ay);
                letter.text = alphabet[i];
                letter.size = 20;
                letter.align = 'center';
                letter.color = '#94a3b8';
                newElements.push(letter);

                ax += alphaSize + alphaGap;
            }
        }

        updateCurrentPageElements([...elements, ...newElements]);
        if (newElements.length > 0) {
            setSelectedElementIds([newElements[0].id]);
        }
        toast.success("Hangman Puzzle Generated!");
    };

    const handleGenerateMatchPicture = () => {
        const words = matchWords.split('\n').filter(w => w.trim());
        if (words.length < 2) {
            toast.error("Please enter at least 2 words.");
            return;
        }

        const newElements: CanvasElement[] = [];
        let currentY = 100;

        // Title
        const titleEl = new TextElement(matchTitle, project.width / 2, currentY);
        titleEl.text = matchTitle;
        titleEl.size = 32;
        titleEl.bold = true;
        titleEl.align = 'center';
        titleEl.color = '#2563eb';
        newElements.push(titleEl);
        currentY += 80;

        // Layout
        const leftX = 150;
        const rightX = project.width - 150;
        const rowHeight = 120;
        const imgSize = 80;

        // Shuffle words for the right column
        const shuffledWords = [...words].sort(() => Math.random() - 0.5);

        words.forEach((word, i) => {
            const y = currentY + i * rowHeight;

            // Left: Image Placeholder
            const imgBox = new ShapeElement(`ImagePlaceholder ${i}`, leftX - imgSize / 2, y, 'rectangle');
            imgBox.width = imgSize;
            imgBox.height = imgSize;
            imgBox.strokeColor = '#334155';
            imgBox.fillColor = '#f1f5f9';
            imgBox.strokeWidth = 2;
            newElements.push(imgBox);

            const imgLabel = new TextElement(`Label ${i}`, leftX, y + imgSize / 2 - 10);
            imgLabel.text = "Image: " + word;
            imgLabel.size = 12;
            imgLabel.align = 'center';
            imgLabel.color = '#94a3b8';
            newElements.push(imgLabel);

            // Dot for connection (Left)
            if (matchStyle === 'lines') {
                const dotL = new ShapeElement(`DotL ${i}`, leftX + imgSize / 2 + 20, y + imgSize / 2 - 5, 'circle');
                dotL.width = 10;
                dotL.height = 10;
                dotL.fillColor = '#000';
                newElements.push(dotL);
            }
        });

        shuffledWords.forEach((word, i) => {
            const y = currentY + i * rowHeight;

            // Right: Word
            const text = new TextElement(`Word ${i}`, rightX, y + imgSize / 2);
            text.text = word;
            text.size = 24;
            text.align = 'center';
            newElements.push(text);

            // Dot for connection (Right)
            if (matchStyle === 'lines') {
                const dotR = new ShapeElement(`DotR ${i}`, rightX - 100, y + imgSize / 2 - 5, 'circle');
                dotR.width = 10;
                dotR.height = 10;
                dotR.fillColor = '#000';
                newElements.push(dotR);
            }
        });

        updateCurrentPageElements([...elements, ...newElements]);
        if (newElements.length > 0) {
            setSelectedElementIds([newElements[0].id]);
        }
        toast.success("Match Puzzle Generated!");
    };

    const exportToPDF = async () => {
        try {
            toast.loading("Generating PDF...");

            // Create PDF in portrait orientation, letter size (8.5" x 11")
            const pdf = new jsPDF({
                orientation: project.width > project.height ? 'landscape' : 'portrait',
                unit: 'px',
                format: [project.width, project.height]
            });

            // Process each page
            for (let pageIndex = 0; pageIndex < project.pages.length; pageIndex++) {
                const page = project.pages[pageIndex];

                // Create a temporary canvas for this page
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = project.width;
                tempCanvas.height = project.height;
                const tempCtx = tempCanvas.getContext('2d');

                if (!tempCtx) continue;

                // Fill background with white
                tempCtx.fillStyle = '#FFFFFF';
                tempCtx.fillRect(0, 0, project.width, project.height);

                // Draw all elements on this page
                page.elements.forEach(elJson => {
                    let element: CanvasElement | null = null;

                    // Recreate element from JSON
                    if (elJson.type === 'text') {
                        element = new TextElement(elJson.name, elJson.x, elJson.y);
                    } else if (elJson.type === 'image') {
                        element = new ImageElement(elJson.name, elJson.x, elJson.y);
                    } else if (elJson.type === 'shape') {
                        element = new ShapeElement(elJson.name, elJson.x, elJson.y);
                    } else if (elJson.type === 'line') {
                        element = new LineElement(elJson.name, elJson.x, elJson.y);
                    } else if (elJson.type === 'wordsearch') {
                        // @ts-ignore
                        element = new WordSearchElement(elJson.name, elJson.x, elJson.y, elJson.grid, elJson.words, elJson.placedWords);
                    } else if (elJson.type === 'crossword') {
                        // @ts-ignore
                        element = new CrosswordElement(elJson.name, elJson.x, elJson.y, elJson.grid, elJson.clues);
                    }

                    if (element) {
                        Object.assign(element, elJson);
                        element.draw(tempCtx);
                    }
                });

                // Convert canvas to image and add to PDF
                const imgData = tempCanvas.toDataURL('image/png');

                // Add new page if not the first page
                if (pageIndex > 0) {
                    pdf.addPage([project.width, project.height]);
                }

                pdf.addImage(imgData, 'PNG', 0, 0, project.width, project.height);
            }

            // Save the PDF
            const fileName = `${project.name || 'workbook'}.pdf`;
            pdf.save(fileName);

            toast.dismiss();
            toast.success(`PDF exported: ${fileName}`);
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to export PDF");
            console.error(error);
        }
    };

    const saveProject = async () => {
        try {
            // Convert project to JSON
            const projectData = {
                name: project.name,
                width: project.width,
                height: project.height,
                currentPageIndex: project.currentPageIndex,
                marginsEnabled: project.marginsEnabled,
                bleedEnabled: project.bleedEnabled,
                pages: project.pages.map(page => ({
                    id: page.id,
                    elements: page.elements.map(el => el.toJSON())
                }))
            };

            toast.loading("Saving project...");
            const dataWithThumbnail = { ...projectData, thumbnail: canvasRef.current?.toDataURL('image/png', 0.3) };

            const result = await saveWorkbookProject(dataWithThumbnail, currentProjectId);

            if (!currentProjectId && result.project._id) {
                setCurrentProjectId(result.project._id);
            }

            toast.dismiss();
            toast.success(`Project saved: ${project.name}`);

            // Reload projects list
            const projectsList = await loadWorkbookProjectsList();
            setSavedProjects(projectsList);
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to save project");
            console.error(error);
        }
    };

    const createNewProject = () => {
        if (confirm("Create a new project? Any unsaved changes will be lost.")) {
            setProject({
                name: "Untitled Project",
                width: 816,
                height: 1056,
                pages: [{ id: `page-${Date.now()}`, elements: [] }],
                currentPageIndex: 0,
                marginsEnabled: true,
                bleedEnabled: false,
            });
            setCurrentProjectId(null);
            setSelectedElementIds([]);
            toast.success("New project created");
        }
    };

    const loadProject = () => {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';

            input.onchange = async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const projectData = JSON.parse(event.target?.result as string);

                        // Reconstruct pages with elements
                        const loadedPages = projectData.pages.map((pageData: any) => {
                            const elements: CanvasElement[] = [];

                            pageData.elements.forEach((elJson: any) => {
                                let element: CanvasElement | null = null;

                                if (elJson.type === 'text') {
                                    element = new TextElement(elJson.name, elJson.x, elJson.y);
                                } else if (elJson.type === 'image') {
                                    element = new ImageElement(elJson.name, elJson.x, elJson.y);
                                } else if (elJson.type === 'shape') {
                                    element = new ShapeElement(elJson.name, elJson.x, elJson.y);
                                } else if (elJson.type === 'line') {
                                    element = new LineElement(elJson.name, elJson.x, elJson.y);
                                } else if (elJson.type === 'wordsearch') {
                                    // @ts-ignore
                                    element = new WordSearchElement(elJson.name, elJson.x, elJson.y, elJson.grid, elJson.words, elJson.placedWords);
                                } else if (elJson.type === 'crossword') {
                                    // @ts-ignore
                                    element = new CrosswordElement(elJson.name, elJson.x, elJson.y, elJson.grid, elJson.clues);
                                }

                                if (element) {
                                    Object.assign(element, elJson);
                                    elements.push(element);
                                }
                            });

                            return {
                                id: pageData.id,
                                elements
                            };
                        });

                        // Update project state
                        setProject({
                            name: projectData.name,
                            width: projectData.width,
                            height: projectData.height,
                            currentPageIndex: projectData.currentPageIndex || 0,
                            marginsEnabled: projectData.marginsEnabled ?? true,
                            bleedEnabled: projectData.bleedEnabled ?? false,
                            pages: loadedPages
                        });

                        toast.success(`Project loaded: ${file.name}`);
                    } catch (error) {
                        toast.error("Failed to load project file");
                        console.error(error);
                    }
                };

                reader.readAsText(file);
            };

            input.click();
        } catch (error) {
            toast.error("Failed to load project");
            console.error(error);
        }
    };

    const loadProjectById = async (projectId: string) => {
        try {
            toast.loading("Loading project...");

            const data = await loadWorkbookProject(projectId);
            const parsed = data.project;

            // Reconstruct pages with elements
            const loadedPages = parsed.pages.map((pageData: any) => {
                const elements: CanvasElement[] = [];

                pageData.elements.forEach((elJson: any) => {
                    let element: CanvasElement | null = null;

                    if (elJson.type === 'text') {
                        element = new TextElement(elJson.name, elJson.x, elJson.y);
                    } else if (elJson.type === 'image') {
                        element = new ImageElement(elJson.name, elJson.x, elJson.y);
                    } else if (elJson.type === 'shape') {
                        element = new ShapeElement(elJson.name, elJson.x, elJson.y);
                    } else if (elJson.type === 'line') {
                        element = new LineElement(elJson.name, elJson.x, elJson.y);
                    } else if (elJson.type === 'wordsearch') {
                        // @ts-ignore
                        element = new WordSearchElement(elJson.name, elJson.x, elJson.y, elJson.grid, elJson.words, elJson.placedWords);
                    } else if (elJson.type === 'crossword') {
                        // @ts-ignore
                        element = new CrosswordElement(elJson.name, elJson.x, elJson.y, elJson.grid, elJson.clues);
                    }

                    if (element) {
                        Object.assign(element, elJson);
                        elements.push(element);
                    }
                });

                return {
                    id: pageData.id,
                    elements
                };
            });

            // Update project state
            setProject({
                name: parsed.name,
                width: parsed.width,
                height: parsed.height,
                currentPageIndex: parsed.currentPageIndex || 0,
                marginsEnabled: parsed.marginsEnabled ?? true,
                bleedEnabled: parsed.bleedEnabled ?? false,
                pages: loadedPages
            });

            setCurrentProjectId(projectId);
            toast.dismiss();
            toast.success(`Project loaded: ${parsed.name}`);
        } catch (error) {
            toast.error("Failed to load project");
            console.error(error);
        }
    };

    const handleDeleteProject = async (projectId: string, projectName: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent loading the project when clicking delete

        if (!confirm(`Delete "${projectName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            toast.loading("Deleting project...");

            await deleteWorkbookProject(projectId);

            // If we're deleting the currently loaded project, create a new one
            if (currentProjectId === projectId) {
                setProject({
                    name: "Untitled Project",
                    width: 816,
                    height: 1056,
                    pages: [{ id: `page-${Date.now()}`, elements: [] }],
                    currentPageIndex: 0,
                    marginsEnabled: true,
                    bleedEnabled: false,
                });
                setCurrentProjectId(null);
            }

            // Reload projects list
            const projectsList = await loadWorkbookProjectsList();
            setSavedProjects(projectsList);

            toast.dismiss();
            toast.success(`Project "${projectName}" deleted`);
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to delete project");
            console.error(error);
        }
    };

    const renderSidebarContent = () => {
        switch (activeToolTab) {
            case "project":
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold">Project Settings</h3>
                        <div className="space-y-2">
                            <Label>Project Name</Label>
                            <Input value={project.name} onChange={(e) => updateProject({ name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Page Size</Label>
                            <Select
                                value={`${project.width}x${project.height}`}
                                onValueChange={(v) => {
                                    const [w, h] = v.split('x').map(Number);
                                    updateProject({ width: w, height: h });
                                }}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(PAGE_SIZES).map(([key, size]) => (
                                        <SelectItem key={key} value={`${size.w}x${size.h}`}>{size.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Show Margins</Label>
                            <Switch checked={project.marginsEnabled} onCheckedChange={(c) => updateProject({ marginsEnabled: c })} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Show Bleed</Label>
                            <Switch checked={project.bleedEnabled} onCheckedChange={(c) => updateProject({ bleedEnabled: c })} />
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Label>Project Actions</Label>
                            <Button
                                className="w-full"
                                onClick={createNewProject}
                                variant="default"
                            >
                                <FilePlus className="mr-2 h-4 w-4" />
                                New Project
                            </Button>
                            <p className="text-xs text-slate-500">
                                Start a fresh workbook from scratch
                            </p>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Label>Save / Load Project</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    className="w-full"
                                    onClick={saveProject}
                                    variant="outline"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    Save
                                </Button>
                                <Button
                                    className="w-full"
                                    onClick={loadProject}
                                    variant="outline"
                                >
                                    <FolderOpen className="mr-2 h-4 w-4" />
                                    Load
                                </Button>
                            </div>
                            <p className="text-xs text-slate-500">
                                Save your work as JSON to continue later
                            </p>
                            {savedProjects.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <Label className="text-xs">Saved Projects ({savedProjects.length})</Label>
                                    <ScrollArea className="h-[200px] w-full border rounded-md p-2">
                                        <div className="space-y-2">
                                            {savedProjects.map((proj) => (
                                                <div
                                                    key={proj.id}
                                                    className="p-2 border rounded hover:bg-slate-50 transition-colors group relative"
                                                >
                                                    <div
                                                        className="cursor-pointer"
                                                        onClick={() => loadProjectById(proj.id)}
                                                    >
                                                        <div className="font-medium text-sm pr-8">{proj.name}</div>
                                                        <div className="text-xs text-slate-500">
                                                            {proj.pageCount} page(s) • {new Date(proj.lastModified).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={(e) => handleDeleteProject(proj.id, proj.name, e)}
                                                    >
                                                        <Trash2 className="h-3 w-3 text-red-500" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>
                            )}
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Label>Export</Label>
                            <Button
                                className="w-full"
                                onClick={exportToPDF}
                                variant="default"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Export to PDF
                            </Button>
                            <p className="text-xs text-slate-500">
                                Compile all {project.pages.length} page(s) into a PDF document
                            </p>
                        </div>
                    </div>
                );
            case "saved":
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold">Saved Templates</h3>
                        <p className="text-sm text-slate-500">Save your favorite layouts and elements here for quick access.</p>
                        <div className="p-4 border border-dashed rounded-md text-center text-slate-400 text-sm">
                            No saved items yet.
                        </div>
                    </div>
                );
            case "activities":
                return (
                    <div className="space-y-4 h-full flex flex-col">
                        <h3 className="font-semibold">Activities</h3>
                        {!selectedActivity ? (
                            <div className="flex-1 overflow-y-auto pr-2 space-y-2 pb-4">
                                {ACTIVITY_CATEGORIES.map((category) => (
                                    <div key={category.title} className="border rounded-md overflow-hidden">
                                        <button
                                            className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 text-sm font-medium transition-colors"
                                            onClick={() => toggleCategory(category.title)}
                                        >
                                            {category.title}
                                            {expandedCategories.includes(category.title) ? (
                                                <ChevronDown className="h-4 w-4 text-slate-500" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4 text-slate-500" />
                                            )}
                                        </button>
                                        {expandedCategories.includes(category.title) && (
                                            <div className="p-2 bg-white grid gap-1">
                                                {category.items.map((item) => (
                                                    <Button
                                                        key={item.id}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="justify-start h-auto py-2 px-3 text-xs whitespace-normal text-left"
                                                        onClick={() => setSelectedActivity(item.id)}
                                                    >
                                                        {item.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Button variant="ghost" size="sm" onClick={() => setSelectedActivity(null)} className="mb-2">
                                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                                </Button>
                                {selectedActivity === 'wordsearch' && (
                                    <div className="space-y-4">
                                        <h4 className="font-medium">Word Search Generator</h4>

                                        <div className="space-y-2">
                                            <Label>Puzzle Title</Label>
                                            <Input value={wsTitle} onChange={(e) => setWsTitle(e.target.value)} placeholder="e.g. Ocean Animals" />
                                        </div>

                                        <Tabs defaultValue="settings">
                                            <TabsList className="w-full">
                                                <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
                                                <TabsTrigger value="words" className="flex-1">Words</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="settings" className="space-y-4 pt-2">
                                                <div className="space-y-2">
                                                    <Label>Difficulty</Label>
                                                    <Select value={wsDifficulty} onValueChange={(v: any) => setWsDifficulty(v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="easy">Easy (H/V only)</SelectItem>
                                                            <SelectItem value="medium">Medium (+ Diagonal)</SelectItem>
                                                            <SelectItem value="hard">Hard (All Directions)</SelectItem>
                                                            <SelectItem value="custom">Custom</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {wsDifficulty === 'custom' && (
                                                    <div className="space-y-2 border p-2 rounded-md bg-slate-50">
                                                        <div className="flex items-center justify-between">
                                                            <Label className="text-xs">Allow Diagonal</Label>
                                                            <Switch checked={wsAllowDiagonal} onCheckedChange={setWsAllowDiagonal} />
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <Label className="text-xs">Allow Backwards</Label>
                                                            <Switch checked={wsAllowBackwards} onCheckedChange={setWsAllowBackwards} />
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <Label className="text-xs">Allow Overlap</Label>
                                                            <Switch checked={wsAllowOverlap} onCheckedChange={setWsAllowOverlap} />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="space-y-2">
                                                    <Label>Grid Size ({wordSearchSize}x{wordSearchSize})</Label>
                                                    <Slider value={[wordSearchSize]} min={5} max={30} step={1} onValueChange={(v) => setWordSearchSize(v[0])} />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Fill Style</Label>
                                                    <Select value={wsFillType} onValueChange={(v: any) => setWsFillType(v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="random">Random Letters (A-Z)</SelectItem>
                                                            <SelectItem value="theme">Theme Letters (From Words)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Grid Shape</Label>
                                                    <Select value={wsShape} onValueChange={(v: any) => setWsShape(v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="square">Square</SelectItem>
                                                            <SelectItem value="circle">Circle</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Hidden Message (Optional)</Label>
                                                    <Input
                                                        value={wsHiddenMessage}
                                                        onChange={(e) => setWsHiddenMessage(e.target.value)}
                                                        placeholder="Secret phrase in empty spaces"
                                                    />
                                                    <p className="text-[10px] text-slate-500">
                                                        Unused letters will spell this out.
                                                    </p>
                                                </div>
                                            </TabsContent>
                                            <TabsContent value="words" className="space-y-4 pt-2">
                                                <div className="space-y-2">
                                                    <Label>Word List (one per line)</Label>
                                                    <textarea
                                                        className="w-full min-h-[200px] p-2 border rounded-md text-sm font-mono uppercase"
                                                        value={wordSearchWords}
                                                        onChange={(e) => setWordSearchWords(e.target.value.toUpperCase())}
                                                        placeholder="ENTER WORDS HERE"
                                                    />
                                                    <p className="text-xs text-slate-500 text-right">{wordSearchWords.split('\n').filter(w => w.trim()).length} words</p>
                                                </div>
                                            </TabsContent>
                                        </Tabs>

                                        <Button className="w-full mt-4" onClick={handleGenerateWordSearch}>
                                            Generate Puzzle
                                        </Button>
                                    </div>
                                )}
                                {selectedActivity === 'crossword' && (
                                    <div className="space-y-4">
                                        <h4 className="font-medium">Crossword Generator</h4>
                                        <div className="space-y-2">
                                            <Label>Title</Label>
                                            <Input value={cwTitle} onChange={(e) => setCwTitle(e.target.value)} placeholder="My Crossword" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Words & Clues (Format: WORD : Clue)</Label>
                                            <textarea
                                                className="w-full min-h-[200px] p-2 border rounded-md text-sm font-mono"
                                                value={cwInput}
                                                onChange={(e) => setCwInput(e.target.value)}
                                                placeholder="DOG : Man's best friend"
                                            />
                                        </div>
                                        <Button className="w-full" onClick={handleGenerateCrossword}>Generate Crossword</Button>
                                    </div>
                                )}
                                {selectedActivity === 'fillin' && (
                                    <div className="space-y-4">
                                        <h4 className="font-medium">Fill-in-the-Blank Generator</h4>
                                        <div className="space-y-2">
                                            <Label>Puzzle Title</Label>
                                            <Input value={fbTitle} onChange={(e) => setFbTitle(e.target.value)} placeholder="Fill in the Blanks" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Input Text (Use [brackets] for blanks)</Label>
                                            <textarea
                                                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={fbInput}
                                                onChange={(e) => setFbInput(e.target.value)}
                                                placeholder="The [apple] is red."
                                            />
                                            <p className="text-xs text-slate-500">
                                                Example: The [sun] is hot.
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Blank Style</Label>
                                            <Select value={fbBlankStyle} onValueChange={(v: any) => setFbBlankStyle(v)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="line">Underline (______)</SelectItem>
                                                    <SelectItem value="box">Box ([      ])</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center justify-between border p-2 rounded-md">
                                            <Label className="text-sm font-normal">Include Word Bank</Label>
                                            <Switch checked={fbShowWordBank} onCheckedChange={setFbShowWordBank} />
                                        </div>
                                        <Button className="w-full" onClick={handleGenerateFillInTheBlank}>Generate Puzzle</Button>
                                    </div>
                                )}
                                {selectedActivity === 'scramble' && (
                                    <div className="space-y-4">
                                        <h4 className="font-medium">Word Scramble Generator</h4>
                                        <div className="space-y-2">
                                            <Label>Puzzle Title</Label>
                                            <Input value={scrambleTitle} onChange={(e) => setScrambleTitle(e.target.value)} placeholder="Word Scramble" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Word List (one per line, optional hints with :)</Label>
                                            <textarea
                                                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={scrambleInput}
                                                onChange={(e) => setScrambleInput(e.target.value)}
                                                placeholder="APPLE : A red fruit&#10;BANANA : Yellow fruit&#10;ORANGE"
                                            />
                                            <p className="text-xs text-slate-500">
                                                Format: WORD or WORD : hint
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Difficulty</Label>
                                            <Select value={scrambleDifficulty} onValueChange={(v: any) => setScrambleDifficulty(v)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="easy">Easy (Keep first/last)</SelectItem>
                                                    <SelectItem value="medium">Medium (Full scramble)</SelectItem>
                                                    <SelectItem value="hard">Hard (Ensure different)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center justify-between border p-2 rounded-md">
                                            <Label className="text-sm font-normal">Show Hints</Label>
                                            <Switch checked={scrambleShowHints} onCheckedChange={setScrambleShowHints} />
                                        </div>
                                        <div className="flex items-center justify-between border p-2 rounded-md">
                                            <Label className="text-sm font-normal">Include Answer Key</Label>
                                            <Switch checked={scrambleShowAnswers} onCheckedChange={setScrambleShowAnswers} />
                                        </div>
                                        <Button className="w-full" onClick={handleGenerateWordScramble}>Generate Puzzle</Button>
                                    </div>
                                )}
                                {selectedActivity === 'missing' && (
                                    <div className="space-y-4">
                                        <h4 className="font-medium">Missing Letters Generator</h4>
                                        <div className="space-y-2">
                                            <Label>Puzzle Title</Label>
                                            <Input value={missingTitle} onChange={(e) => setMissingTitle(e.target.value)} placeholder="Missing Letters" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Word List (one per line, optional hints with :)</Label>
                                            <textarea
                                                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={missingInput}
                                                onChange={(e) => setMissingInput(e.target.value)}
                                                placeholder="APPLE : A red fruit&#10;BANANA : Yellow fruit&#10;ORANGE"
                                            />
                                            <p className="text-xs text-slate-500">
                                                Format: WORD or WORD : hint
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Missing Letter Pattern</Label>
                                            <Select value={missingPattern} onValueChange={(v: any) => setMissingPattern(v)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="vowels">Remove Vowels (A E I O U)</SelectItem>
                                                    <SelectItem value="consonants">Remove Consonants</SelectItem>
                                                    <SelectItem value="random">Random (30-50%)</SelectItem>
                                                    <SelectItem value="alternate">Alternate Letters</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center justify-between border p-2 rounded-md">
                                            <Label className="text-sm font-normal">Show Hints</Label>
                                            <Switch checked={missingShowHints} onCheckedChange={setMissingShowHints} />
                                        </div>
                                        <div className="flex items-center justify-between border p-2 rounded-md">
                                            <Label className="text-sm font-normal">Include Answer Key</Label>
                                            <Switch checked={missingShowAnswers} onCheckedChange={setMissingShowAnswers} />
                                        </div>
                                        <Button className="w-full" onClick={handleGenerateMissingLetters}>Generate Puzzle</Button>
                                    </div>
                                )}
                                {selectedActivity === 'tracing' && (
                                    <div className="space-y-4">
                                        <h4 className="font-medium">Alphabet Tracing Generator</h4>
                                        <div className="space-y-2">
                                            <Label>Worksheet Title</Label>
                                            <Input value={tracingTitle} onChange={(e) => setTracingTitle(e.target.value)} placeholder="Alphabet Tracing" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Letters to Trace</Label>
                                            <Input
                                                value={tracingLetters}
                                                onChange={(e) => setTracingLetters(e.target.value.toUpperCase())}
                                                placeholder="ABC or ABCDEFG"
                                                maxLength={26}
                                            />
                                            <p className="text-xs text-slate-500">
                                                Enter letters (e.g., ABC or full alphabet)
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Letter Case</Label>
                                            <Select value={tracingCase} onValueChange={(v: any) => setTracingCase(v)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="uppercase">Uppercase (A B C)</SelectItem>
                                                    <SelectItem value="lowercase">Lowercase (a b c)</SelectItem>
                                                    <SelectItem value="both">Both (A a, B b, C c)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Repetitions per Letter ({tracingRepeat})</Label>
                                            <Slider
                                                value={[tracingRepeat]}
                                                min={1}
                                                max={8}
                                                step={1}
                                                onValueChange={(v) => setTracingRepeat(v[0])}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tracing Style</Label>
                                            <Select value={tracingStyle} onValueChange={(v: any) => setTracingStyle(v)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="solid">Solid (Light Gray)</SelectItem>
                                                    <SelectItem value="dashed">Dashed (Medium Gray)</SelectItem>
                                                    <SelectItem value="dotted">Dotted (Very Light)</SelectItem>
                                                    <SelectItem value="outline">Outline Only</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center justify-between border p-2 rounded-md">
                                            <Label className="text-sm font-normal">Show Guide Lines</Label>
                                            <Switch checked={tracingShowGuides} onCheckedChange={setTracingShowGuides} />
                                        </div>
                                        <Button className="w-full" onClick={handleGenerateAlphabetTracing}>Generate Worksheet</Button>
                                    </div>
                                )}
                                {selectedActivity === 'secretcode' && (
                                    <div className="space-y-4">
                                        <h4 className="font-medium">Secret Code Generator</h4>

                                        <div className="space-y-2">
                                            <Label>Puzzle Title</Label>
                                            <Input
                                                value={secretCodeTitle}
                                                onChange={(e) => setSecretCodeTitle(e.target.value)}
                                                placeholder="Secret Code Challenge"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Message to Encode</Label>
                                            <Input
                                                value={secretCodeText}
                                                onChange={(e) => setSecretCodeText(e.target.value)}
                                                placeholder="HELLO WORLD"
                                            />
                                            <p className="text-xs text-slate-500">Enter the secret message (letters and spaces)</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Cipher Type</Label>
                                            <Select value={secretCodeCipher} onValueChange={(v: any) => setSecretCodeCipher(v)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="symbols">Symbols (★ ◆ ● ■)</SelectItem>
                                                    <SelectItem value="numbers">Numbers (1-26)</SelectItem>
                                                    <SelectItem value="caesar">Caesar Shift (ROT3)</SelectItem>
                                                    <SelectItem value="reverse">Reverse Alphabet</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Difficulty Level</Label>
                                            <Select value={secretCodeDifficulty} onValueChange={(v: any) => setSecretCodeDifficulty(v)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="easy">Easy (Full Key)</SelectItem>
                                                    <SelectItem value="medium">Medium (Partial Key)</SelectItem>
                                                    <SelectItem value="hard">Hard (No Key)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center justify-between border p-2 rounded-md">
                                            <Label className="text-sm font-normal">Show Cipher Key</Label>
                                            <Switch checked={secretCodeShowKey} onCheckedChange={setSecretCodeShowKey} />
                                        </div>

                                        <div className="flex items-center justify-between border p-2 rounded-md">
                                            <Label className="text-sm font-normal">Show Answer</Label>
                                            <Switch checked={secretCodeShowAnswers} onCheckedChange={setSecretCodeShowAnswers} />
                                        </div>

                                        <Button className="w-full" onClick={handleGenerateSecretCode}>
                                            <Key className="mr-2 h-4 w-4" />
                                            Generate Secret Code
                                        </Button>
                                    </div>
                                )}
                                {selectedActivity === 'wordladder' && (
                                    <div className="space-y-4">
                                        <h4 className="font-medium">Word Ladder Generator</h4>
                                        <div className="space-y-2">
                                            <Label>Puzzle Title</Label>
                                            <Input value={ladderTitle} onChange={(e) => setLadderTitle(e.target.value)} placeholder="Word Ladder" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-2">
                                                <Label>Start Word</Label>
                                                <Input value={ladderStart} onChange={(e) => setLadderStart(e.target.value.toUpperCase())} placeholder="COLD" maxLength={8} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>End Word</Label>
                                                <Input value={ladderEnd} onChange={(e) => setLadderEnd(e.target.value.toUpperCase())} placeholder="WARM" maxLength={8} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Difficulty (Steps)</Label>
                                            <Select value={ladderDifficulty} onValueChange={(v: any) => setLadderDifficulty(v)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="easy">Easy (3 Steps)</SelectItem>
                                                    <SelectItem value="medium">Medium (5 Steps)</SelectItem>
                                                    <SelectItem value="hard">Hard (8 Steps)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Manual Solution Chain (Optional)</Label>
                                            <Input
                                                value={ladderManualChain}
                                                onChange={(e) => setLadderManualChain(e.target.value.toUpperCase())}
                                                placeholder="CORD, CARD, WARD"
                                            />
                                            <p className="text-xs text-slate-500">
                                                Comma separated intermediate words. Leave empty to generate blank steps.
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between border p-2 rounded-md">
                                            <Label className="text-sm font-normal">Show Hints</Label>
                                            <Switch checked={ladderShowHints} onCheckedChange={setLadderShowHints} />
                                        </div>
                                        <Button className="w-full" onClick={handleGenerateWordLadder}>
                                            <StepForward className="mr-2 h-4 w-4" />
                                            Generate Ladder
                                        </Button>
                                    </div>
                                )}
                                {selectedActivity === 'hangman' && (
                                    <div className="space-y-4">
                                        <h4 className="font-medium">Hangman Generator</h4>
                                        <div className="space-y-2">
                                            <Label>Puzzle Title</Label>
                                            <Input value={hangmanTitle} onChange={(e) => setHangmanTitle(e.target.value)} placeholder="Hangman" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Word or Phrase</Label>
                                            <Input value={hangmanWord} onChange={(e) => setHangmanWord(e.target.value.toUpperCase())} placeholder="APPLE" />
                                            <p className="text-xs text-slate-500">Spaces will be preserved.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Hint (Optional)</Label>
                                            <Input value={hangmanHint} onChange={(e) => setHangmanHint(e.target.value)} placeholder="A red fruit" />
                                        </div>
                                        <div className="flex items-center justify-between border p-2 rounded-md">
                                            <Label className="text-sm font-normal">Show Gallows</Label>
                                            <Switch checked={hangmanShowGallows} onCheckedChange={setHangmanShowGallows} />
                                        </div>
                                        <div className="flex items-center justify-between border p-2 rounded-md">
                                            <Label className="text-sm font-normal">Show Alphabet Grid</Label>
                                            <Switch checked={hangmanShowAlphabet} onCheckedChange={setHangmanShowAlphabet} />
                                        </div>
                                        <div className="flex items-center justify-between border p-2 rounded-md">
                                            <Label className="text-sm font-normal">Show Solution</Label>
                                            <Switch checked={hangmanShowSolution} onCheckedChange={setHangmanShowSolution} />
                                        </div>
                                        <Button className="w-full" onClick={handleGenerateHangman}>
                                            <Gamepad2 className="mr-2 h-4 w-4" />
                                            Generate Hangman
                                        </Button>
                                    </div>
                                )}
                                {selectedActivity === 'matchpicture' && (
                                    <div className="space-y-4">
                                        <h4 className="font-medium">Match Picture Generator</h4>
                                        <div className="space-y-2">
                                            <Label>Puzzle Title</Label>
                                            <Input value={matchTitle} onChange={(e) => setMatchTitle(e.target.value)} placeholder="Match the Pictures" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Word List (one per line)</Label>
                                            <textarea
                                                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={matchWords}
                                                onChange={(e) => setMatchWords(e.target.value.toUpperCase())}
                                                placeholder="APPLE&#10;BANANA&#10;CAT"
                                            />
                                            <p className="text-xs text-slate-500">
                                                Enter words. Image placeholders will be created for you to fill.
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Matching Style</Label>
                                            <Select value={matchStyle} onValueChange={(v: any) => setMatchStyle(v)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="lines">Draw Lines</SelectItem>
                                                    {/* <SelectItem value="letters">Write Letters</SelectItem> */}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button className="w-full" onClick={handleGenerateMatchPicture}>
                                            <ImageIcon className="mr-2 h-4 w-4" />
                                            Generate Puzzle
                                        </Button>
                                    </div>
                                )}
                                {selectedActivity !== 'wordsearch' && selectedActivity !== 'crossword' && selectedActivity !== 'fillin' && selectedActivity !== 'scramble' && selectedActivity !== 'missing' && selectedActivity !== 'tracing' && selectedActivity !== 'secretcode' && selectedActivity !== 'wordladder' && selectedActivity !== 'hangman' && selectedActivity !== 'matchpicture' && (
                                    <div className="text-center p-4 text-slate-500 border border-dashed rounded-md">
                                        <p className="font-medium mb-1">
                                            {ACTIVITY_CATEGORIES.flatMap(c => c.items).find(i => i.id === selectedActivity)?.label}
                                        </p>
                                        <p className="text-xs">This activity generator is coming soon!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            case "pages":
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Pages ({project.pages.length})</h3>
                            <Button size="sm" onClick={addPage}><Plus className="h-4 w-4" /></Button>
                        </div>
                        <ScrollArea className="h-[calc(100vh-200px)]">
                            <div className="space-y-3 p-1">
                                {project.pages.map((page, idx) => (
                                    <div
                                        key={page.id}
                                        className={`relative group border rounded-md p-2 cursor-pointer transition-all ${idx === project.currentPageIndex ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-slate-50'}`}
                                        onClick={() => setProject(p => ({ ...p, currentPageIndex: idx }))}
                                    >
                                        <div className="aspect-[8.5/11] bg-white shadow-sm border flex items-center justify-center text-xs text-slate-400 mb-2 overflow-hidden relative">
                                            {page.thumbnail ? (
                                                <img src={page.thumbnail} alt={`Page ${idx + 1}`} className="w-full h-full object-contain" />
                                            ) : (
                                                <span>Page {idx + 1}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium">Page {idx + 1}</span>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); duplicatePage(idx); }} title="Duplicate">
                                                    <FilePlus className="h-3 w-3" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={(e) => { e.stopPropagation(); deletePage(idx); }} title="Delete">
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                );
            case "fillin-properties":
                const fbEl = elements.find(e => e.id === selectedElementIds[0]) as FillInTheBlankElement;
                if (!fbEl) return <div>Select a Fill-in-the-Blank puzzle</div>;
                return (
                    <div className="flex flex-col h-full">
                        <div className="mb-4 flex justify-between items-center">
                            <h3 className="font-bold text-sm">FILL-IN-THE-BLANK SETTINGS</h3>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSelectedElementIds([])}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <ScrollArea className="flex-1 pr-4">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Visibility</Label>
                                    <div className="flex items-center justify-between border p-2 rounded-md">
                                        <Label className="text-sm font-normal">Show Solution</Label>
                                        <Switch checked={fbEl.showSolution} onCheckedChange={(c) => updateSelectedElement({ showSolution: c })} />
                                    </div>
                                    <div className="flex items-center justify-between border p-2 rounded-md">
                                        <Label className="text-sm font-normal">Show Word Bank</Label>
                                        <Switch checked={fbEl.showWordBank} onCheckedChange={(c) => updateSelectedElement({ showWordBank: c })} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Style</Label>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-slate-500">Blank Style</Label>
                                        <Select value={fbEl.blankStyle} onValueChange={(v: any) => updateSelectedElement({ blankStyle: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="line">Underline</SelectItem>
                                                <SelectItem value="box">Box</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-slate-500">Font</Label>
                                        <Select value={fbEl.font} onValueChange={(v) => updateSelectedElement({ font: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {FONTS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-slate-500">Font Size ({fbEl.fontSize}px)</Label>
                                        <Slider value={[fbEl.fontSize]} min={12} max={48} step={1} onValueChange={(v) => updateSelectedElement({ fontSize: v[0] })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-slate-500">Line Height ({fbEl.lineHeight})</Label>
                                        <Slider value={[fbEl.lineHeight]} min={1} max={3} step={0.1} onValueChange={(v) => updateSelectedElement({ lineHeight: v[0] })} />
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                );

            case "wordsearch-properties":
                const wsEl = elements.find(el => el.id === selectedElementIds[0]) as WordSearchElement;
                if (!wsEl) return null;
                return (
                    <div className="flex flex-col h-full">
                        <div className="mb-4 flex justify-between items-center">
                            <h3 className="font-bold text-sm">WORD SEARCH SETTINGS</h3>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSelectedElementIds([])}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <ScrollArea className="flex-1 pr-4">
                            <div className="space-y-6">
                                <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
                                    <h4 className="font-semibold text-blue-800 mb-2 text-sm">Actions</h4>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => createAnswerKeyPage(wsEl)}>
                                        <FilePlus className="h-4 w-4 mr-2" /> Create Answer Key Page
                                    </Button>
                                    <p className="text-xs text-blue-600 mt-2">
                                        Creates a new page with the solution highlighted.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Visibility</Label>
                                    <div className="flex items-center justify-between border p-2 rounded-md">
                                        <Label className="text-sm font-normal">Show Solution</Label>
                                        <Switch checked={wsEl.showSolution} onCheckedChange={(c) => updateSelectedElement({ showSolution: c })} />
                                    </div>
                                    <div className="flex items-center justify-between border p-2 rounded-md">
                                        <Label className="text-sm font-normal">Show Grid Lines</Label>
                                        <Switch checked={wsEl.showGridLines} onCheckedChange={(c) => updateSelectedElement({ showGridLines: c })} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Style</Label>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-slate-500">Font</Label>
                                        <Select value={wsEl.font} onValueChange={(v) => updateSelectedElement({ font: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {FONTS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-slate-500">Font Size ({wsEl.fontSize}px)</Label>
                                        <Slider value={[wsEl.fontSize]} min={10} max={60} step={1} onValueChange={(v) => updateSelectedElement({ fontSize: v[0] })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-slate-500">Cell Size ({wsEl.cellSize}px)</Label>
                                        <Slider value={[wsEl.cellSize]} min={20} max={100} step={1} onValueChange={(v) => updateSelectedElement({ cellSize: v[0] })} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Colors</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <Label className="text-xs">Text</Label>
                                            <Input type="color" value={wsEl.color} onChange={(e) => updateSelectedElement({ color: e.target.value })} className="h-8" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Grid Lines</Label>
                                            <Input type="color" value={wsEl.strokeColor} onChange={(e) => updateSelectedElement({ strokeColor: e.target.value })} className="h-8" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Highlight</Label>
                                            <Input type="color" value={wsEl.highlightColor} onChange={(e) => updateSelectedElement({ highlightColor: e.target.value })} className="h-8" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                );
            case "crossword-properties":
                const cwEl = elements.find(el => el.id === selectedElementIds[0]) as CrosswordElement;
                if (!cwEl) return null;
                return (
                    <div className="flex flex-col h-full">
                        <div className="mb-4 flex justify-between items-center">
                            <h3 className="font-bold text-sm">CROSSWORD SETTINGS</h3>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSelectedElementIds([])}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <ScrollArea className="flex-1 pr-4">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Show Solution</Label>
                                    <Switch checked={cwEl.showSolution} onCheckedChange={(c) => updateSelectedElement({ showSolution: c })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Cell Size</Label>
                                    <Slider value={[cwEl.cellSize]} min={20} max={80} step={1} onValueChange={(v) => updateSelectedElement({ cellSize: v[0] })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Font Size</Label>
                                    <Slider value={[cwEl.fontSize]} min={10} max={40} step={1} onValueChange={(v) => updateSelectedElement({ fontSize: v[0] })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Color</Label>
                                    <Input type="color" value={cwEl.color} onChange={(e) => updateSelectedElement({ color: e.target.value })} className="h-8" />
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                );
            case "text":
                const selectedEl = elements.find(el => el.id === selectedElementIds[0]);
                const isTextSelected = selectedEl instanceof TextElement;

                if (isTextSelected) {
                    const textEl = selectedEl as TextElement;
                    return (
                        <div className="flex flex-col h-full">
                            <div className="mb-4 flex justify-between items-center">
                                <h3 className="font-bold text-sm">TEXT EDITOR</h3>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSelectedElementIds([])}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <Tabs defaultValue="style" className="flex-1 flex flex-col">
                                <TabsList className="grid w-full grid-cols-3 mb-4">
                                    <TabsTrigger value="style" className="text-xs">STYLE</TabsTrigger>
                                    <TabsTrigger value="type" className="text-xs">TYPE</TabsTrigger>
                                    <TabsTrigger value="arrange" className="text-xs">ARRANGE</TabsTrigger>
                                </TabsList>

                                <ScrollArea className="flex-1 -mx-4 px-4">
                                    <TabsContent value="style" className="space-y-4 mt-0">
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase text-slate-500">Text Color</Label>
                                            <div className="flex gap-2">
                                                <Input type="color" value={textEl.color} onChange={(e) => updateSelectedElement({ color: e.target.value })} className="w-10 h-10 p-1 cursor-pointer" />
                                                <Input value={textEl.color} onChange={(e) => updateSelectedElement({ color: e.target.value })} className="flex-1 font-mono" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase text-slate-500">Opacity</Label>
                                            <div className="flex items-center gap-2">
                                                <Slider
                                                    value={[textEl.opacity * 100]}
                                                    min={0} max={100} step={1}
                                                    onValueChange={(v) => updateSelectedElement({ opacity: v[0] / 100 })}
                                                    className="flex-1"
                                                />
                                                <span className="text-xs w-8 text-right">{Math.round(textEl.opacity * 100)}%</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs uppercase text-slate-500">Drop Shadow</Label>
                                                <Switch checked={textEl.shadow} onCheckedChange={(c) => updateSelectedElement({ shadow: c })} />
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t">
                                            <Button variant="outline" className="w-full" onClick={() => duplicateElements([textEl.id])}>
                                                <Copy className="h-4 w-4 mr-2" /> Duplicate
                                            </Button>
                                            <Button variant="destructive" className="w-full mt-2" onClick={() => deleteElements([textEl.id])}>
                                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                                            </Button>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="type" className="space-y-4 mt-0">
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase text-slate-500">Content</Label>
                                            <textarea
                                                className="w-full min-h-[80px] p-2 border rounded-md text-sm"
                                                value={textEl.text}
                                                onChange={(e) => updateSelectedElement({ text: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase text-slate-500">Font</Label>
                                            <Select value={textEl.font} onValueChange={(v) => updateSelectedElement({ font: v })}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {FONTS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <Button variant={textEl.bold ? "secondary" : "outline"} size="sm" onClick={() => updateSelectedElement({ bold: !textEl.bold })}>
                                                <Bold className="h-4 w-4" />
                                            </Button>
                                            <Button variant={textEl.italic ? "secondary" : "outline"} size="sm" onClick={() => updateSelectedElement({ italic: !textEl.italic })}>
                                                <Italic className="h-4 w-4" />
                                            </Button>
                                            <Button variant={textEl.outline ? "secondary" : "outline"} size="sm" onClick={() => updateSelectedElement({ outline: !textEl.outline })}>
                                                <span className="font-bold text-xs border border-black px-1">T</span>
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <Button variant={textEl.align === 'left' ? "secondary" : "outline"} size="sm" onClick={() => updateSelectedElement({ align: 'left' })}>
                                                <AlignLeft className="h-4 w-4" />
                                            </Button>
                                            <Button variant={textEl.align === 'center' ? "secondary" : "outline"} size="sm" onClick={() => updateSelectedElement({ align: 'center' })}>
                                                <AlignCenter className="h-4 w-4" />
                                            </Button>
                                            <Button variant={textEl.align === 'right' ? "secondary" : "outline"} size="sm" onClick={() => updateSelectedElement({ align: 'right' })}>
                                                <AlignRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase text-slate-500">Size ({textEl.size}px)</Label>
                                            <Slider
                                                value={[textEl.size]}
                                                min={8} max={200} step={1}
                                                onValueChange={(v) => updateSelectedElement({ size: v[0] })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase text-slate-500">Letter Spacing</Label>
                                            <Slider
                                                value={[textEl.letterSpacing || 0]}
                                                min={-10} max={50} step={1}
                                                onValueChange={(v) => updateSelectedElement({ letterSpacing: v[0] })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase text-slate-500">Line Height</Label>
                                            <Slider
                                                value={[textEl.lineHeight || 1.2]}
                                                min={0.5} max={3} step={0.1}
                                                onValueChange={(v) => updateSelectedElement({ lineHeight: v[0] })}
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="arrange" className="space-y-4 mt-0">
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase text-slate-500">Layer Order</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button variant="outline" size="sm" onClick={() => moveLayer(textEl.id, 'up')}>
                                                    <ArrowUp className="h-4 w-4 mr-2" /> Forward
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => moveLayer(textEl.id, 'down')}>
                                                    <ArrowDown className="h-4 w-4 mr-2" /> Backward
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => moveLayer(textEl.id, 'top')}>
                                                    <BringToFront className="h-4 w-4 mr-2" /> Front
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => moveLayer(textEl.id, 'bottom')}>
                                                    <SendToBack className="h-4 w-4 mr-2" /> Back
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase text-slate-500">Align to Page</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button variant="outline" size="sm" onClick={() => updateSelectedElement({ x: (project.width - textEl.width) / 2 })}>
                                                    Horiz. Center
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => updateSelectedElement({ y: (project.height - textEl.height) / 2 })}>
                                                    Vert. Center
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase text-slate-500">Rotation</Label>
                                            <div className="flex items-center gap-2">
                                                <Slider
                                                    value={[textEl.rotation]}
                                                    min={0} max={360} step={1}
                                                    onValueChange={(v) => updateSelectedElement({ rotation: v[0] })}
                                                    className="flex-1"
                                                />
                                                <Input
                                                    type="number"
                                                    value={textEl.rotation}
                                                    onChange={(e) => updateSelectedElement({ rotation: Number(e.target.value) })}
                                                    className="w-16 h-8"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase text-slate-500">Position</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <Label className="text-[10px] text-slate-400">X</Label>
                                                    <Input type="number" value={Math.round(textEl.x)} onChange={(e) => updateSelectedElement({ x: Number(e.target.value) })} className="h-8" />
                                                </div>
                                                <div>
                                                    <Label className="text-[10px] text-slate-400">Y</Label>
                                                    <Input type="number" value={Math.round(textEl.y)} onChange={(e) => updateSelectedElement({ y: Number(e.target.value) })} className="h-8" />
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </ScrollArea>
                            </Tabs>
                        </div>
                    );
                }

                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold">Add Text</h3>
                        <div className="grid gap-2">
                            <Button variant="outline" className="justify-start" onClick={() => addElement(new TextElement("Heading", project.width / 2 - 100, project.height / 2))}>
                                <Type className="mr-2 h-4 w-4" /> Add Heading
                            </Button>
                            <Button variant="outline" className="justify-start" onClick={() => {
                                const t = new TextElement("Body Text", project.width / 2 - 100, project.height / 2 + 50);
                                t.size = 24;
                                t.bold = false;
                                addElement(t);
                            }}>
                                <FileText className="mr-2 h-4 w-4" /> Add Body Text
                            </Button>
                        </div>
                    </div>
                );
            case "line":
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold">Lines</h3>
                        <div className="grid gap-2">
                            <Button variant="outline" className="justify-start" onClick={() => addElement(new LineElement("Line", project.width / 2 - 100, project.height / 2))}>
                                <Minus className="mr-2 h-4 w-4" /> Add Line
                            </Button>
                        </div>
                    </div>
                );
            case "box":
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold">Boxes</h3>
                        <div className="grid gap-2">
                            <Button variant="outline" className="justify-start" onClick={() => addElement(new ShapeElement("Rectangle", project.width / 2 - 50, project.height / 2 - 50, 'rectangle'))}>
                                <Square className="mr-2 h-4 w-4" /> Add Rectangle
                            </Button>
                        </div>
                    </div>
                );
            case "circle":
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold">Circles</h3>
                        <div className="grid gap-2">
                            <Button variant="outline" className="justify-start" onClick={() => addElement(new ShapeElement("Circle", project.width / 2 - 50, project.height / 2 - 50, 'circle'))}>
                                <Circle className="mr-2 h-4 w-4" /> Add Circle
                            </Button>
                        </div>
                    </div>
                );
            case "shapes":
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold">Shapes</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" className="flex flex-col h-20" onClick={() => addElement(new ShapeElement("Triangle", project.width / 2 - 50, project.height / 2 - 50, 'triangle'))}>
                                <Triangle className="h-8 w-8 mb-2" /> Triangle
                            </Button>
                        </div>
                    </div>
                );
            case "infographics":
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold">Infographics</h3>
                        <p className="text-sm text-slate-500">Charts and graphs coming soon.</p>
                    </div>
                );
            case "patterns":
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold">Patterns</h3>
                        <p className="text-sm text-slate-500">Background patterns coming soon.</p>
                    </div>
                );
            case "images":
                return (
                    <div className="space-y-4 h-full flex flex-col">
                        <h3 className="font-semibold">Image Library</h3>
                        <Tabs value={activeImageTab} onValueChange={setActiveImageTab} className="w-full flex-1 flex flex-col">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="icons">Icons</TabsTrigger>
                                <TabsTrigger value="stock">Stock Photos</TabsTrigger>
                            </TabsList>

                            <TabsContent value="icons" className="flex-1 mt-4">
                                <ScrollArea className="h-[calc(100vh-300px)]">
                                    <div className="grid grid-cols-4 gap-2 p-1">
                                        {iconList.map((item, i) => (
                                            <button
                                                key={i}
                                                className="flex flex-col items-center justify-center p-2 border rounded hover:bg-slate-100 aspect-square"
                                                onClick={() => addIconToCanvas(item.icon, item.label)}
                                            >
                                                <item.icon className="h-6 w-6 mb-1" />
                                                <span className="text-[10px] truncate w-full text-center">{item.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </TabsContent>

                            <TabsContent value="stock" className="flex-1 mt-4 space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        value={stockSearch}
                                        onChange={(e) => setStockSearch(e.target.value)}
                                        placeholder="Search Openverse..."
                                        onKeyDown={(e) => e.key === 'Enter' && handleStockSearch()}
                                    />
                                    <Button size="icon" variant="ghost" onClick={handleStockSearch} disabled={stockLoading}>
                                        {stockLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                    </Button>
                                </div>
                                <ScrollArea className="h-[calc(100vh-350px)]">
                                    <div className="grid grid-cols-2 gap-2 p-1">
                                        {stockImages.map((img, i) => (
                                            <button
                                                key={i}
                                                className="relative aspect-square border rounded overflow-hidden hover:opacity-80 group"
                                                onClick={() => addStockImageToCanvas(img.url)}
                                                title={img.title}
                                            >
                                                <img
                                                    src={img.thumbnail || img.url}
                                                    alt={img.title}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                                {img.license && <span className="absolute bottom-1 right-1 text-[8px] bg-black/50 text-white px-1 rounded">{img.license}</span>}
                                            </button>
                                        ))}
                                        {stockImages.length === 0 && !stockLoading && (
                                            <div className="col-span-2 text-center text-slate-400 py-8">
                                                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                <p className="text-xs">Search for free stock photos</p>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-center text-slate-400 mt-2">Powered by Openverse</p>
                                </ScrollArea>
                            </TabsContent>
                        </Tabs>
                    </div>
                );
            case "uploads":
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold">Uploads</h3>
                        <div className="space-y-4">
                            <div>
                                <Label>Upload Image</Label>
                                <Input type="file" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const url = URL.createObjectURL(file);
                                        const img = new ImageElement("Upload", project.width / 2 - 100, project.height / 2 - 100);
                                        img.image.src = url;
                                        addElement(img);
                                    }
                                }} />
                            </div>
                            <Separator />
                            <div>
                                <Label>Add from URL</Label>
                                <div className="flex gap-2 mt-2">
                                    <Input placeholder="https://..." id="img-url-input" />
                                    <Button onClick={() => {
                                        const input = document.getElementById('img-url-input') as HTMLInputElement;
                                        if (input.value) {
                                            const img = new ImageElement("URL Image", project.width / 2 - 100, project.height / 2 - 100);
                                            img.image.src = input.value;
                                            addElement(img);
                                        }
                                    }}>Add</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "picture-book":
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold">Picture Book</h3>
                        <p className="text-sm text-slate-500">Picture book templates coming soon.</p>
                    </div>
                );
            case "turbo":
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold">TT Turbo</h3>
                        <p className="text-sm text-slate-500">Advanced automation tools coming soon.</p>
                    </div>
                );
            default:
                return <div>Select a tool</div>;
        }
    };

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-slate-100">
            {/* Main Sidebar (Icons) */}
            <div className="w-20 bg-slate-900 flex flex-col items-center py-4 gap-2 z-20 overflow-y-auto no-scrollbar">
                <Button variant={activeToolTab === 'project' ? 'secondary' : 'ghost'} size="icon" className={activeToolTab !== 'project' ? "text-slate-400 hover:text-white" : ""} onClick={() => setActiveToolTab('project')} title="Project">
                    <FolderOpen className="h-5 w-5" />
                    <span className="sr-only">Project</span>
                </Button>
                <Button variant={activeToolTab === 'saved' ? 'secondary' : 'ghost'} size="icon" className={activeToolTab !== 'saved' ? "text-slate-400 hover:text-white" : ""} onClick={() => setActiveToolTab('saved')} title="Saved">
                    <Star className="h-5 w-5" />
                    <span className="sr-only">Saved</span>
                </Button>
                <Separator className="bg-slate-700 w-10 my-1" />
                <Button variant={activeToolTab === 'activities' ? 'secondary' : 'ghost'} size="icon" className={activeToolTab !== 'activities' ? "text-slate-400 hover:text-white" : ""} onClick={() => setActiveToolTab('activities')} title="Activities">
                    <Gamepad2 className="h-5 w-5" />
                    <span className="sr-only">Activities</span>
                </Button>
                <Button variant={activeToolTab === 'pages' ? 'secondary' : 'ghost'} size="icon" className={activeToolTab !== 'pages' ? "text-slate-400 hover:text-white" : ""} onClick={() => setActiveToolTab('pages')} title="Pages">
                    <LayoutTemplate className="h-5 w-5" />
                    <span className="sr-only">Pages</span>
                </Button>
                <Button variant={activeToolTab === 'text' ? 'secondary' : 'ghost'} size="icon" className={activeToolTab !== 'text' ? "text-slate-400 hover:text-white" : ""} onClick={() => setActiveToolTab('text')} title="Text">
                    <Type className="h-5 w-5" />
                    <span className="sr-only">Text</span>
                </Button>
                <Separator className="bg-slate-700 w-10 my-1" />
                <Button variant={activeToolTab === 'line' ? 'secondary' : 'ghost'} size="icon" className={activeToolTab !== 'line' ? "text-slate-400 hover:text-white" : ""} onClick={() => setActiveToolTab('line')} title="Line">
                    <Minus className="h-5 w-5" />
                    <span className="sr-only">Line</span>
                </Button>
                <Button variant={activeToolTab === 'box' ? 'secondary' : 'ghost'} size="icon" className={activeToolTab !== 'box' ? "text-slate-400 hover:text-white" : ""} onClick={() => setActiveToolTab('box')} title="Box">
                    <Square className="h-5 w-5" />
                    <span className="sr-only">Box</span>
                </Button>
                <Button variant={activeToolTab === 'circle' ? 'secondary' : 'ghost'} size="icon" className={activeToolTab !== 'circle' ? "text-slate-400 hover:text-white" : ""} onClick={() => setActiveToolTab('circle')} title="Circle">
                    <Circle className="h-5 w-5" />
                    <span className="sr-only">Circle</span>
                </Button>
                <Button variant={activeToolTab === 'shapes' ? 'secondary' : 'ghost'} size="icon" className={activeToolTab !== 'shapes' ? "text-slate-400 hover:text-white" : ""} onClick={() => setActiveToolTab('shapes')} title="Shapes">
                    <Triangle className="h-5 w-5" />
                    <span className="sr-only">Shapes</span>
                </Button>
                <Separator className="bg-slate-700 w-10 my-1" />
                <Button variant={activeToolTab === 'infographics' ? 'secondary' : 'ghost'} size="icon" className={activeToolTab !== 'infographics' ? "text-slate-400 hover:text-white" : ""} onClick={() => setActiveToolTab('infographics')} title="Infographics">
                    <PieChart className="h-5 w-5" />
                    <span className="sr-only">Infographics</span>
                </Button>
                <Button variant={activeToolTab === 'patterns' ? 'secondary' : 'ghost'} size="icon" className={activeToolTab !== 'patterns' ? "text-slate-400 hover:text-white" : ""} onClick={() => setActiveToolTab('patterns')} title="Patterns">
                    <Grid3X3 className="h-5 w-5" />
                    <span className="sr-only">Patterns</span>
                </Button>
                <Separator className="bg-slate-700 w-10 my-1" />
                <Button variant={activeToolTab === 'images' ? 'secondary' : 'ghost'} size="icon" className={activeToolTab !== 'images' ? "text-slate-400 hover:text-white" : ""} onClick={() => setActiveToolTab('images')} title="TT Images">
                    <ImageIcon className="h-5 w-5" />
                    <span className="sr-only">TT Images</span>
                </Button>
                <Button variant={activeToolTab === 'uploads' ? 'secondary' : 'ghost'} size="icon" className={activeToolTab !== 'uploads' ? "text-slate-400 hover:text-white" : ""} onClick={() => setActiveToolTab('uploads')} title="Uploads">
                    <UploadCloud className="h-5 w-5" />
                    <span className="sr-only">Uploads</span>
                </Button>
                <Separator className="bg-slate-700 w-10 my-1" />
                <Button variant={activeToolTab === 'picture-book' ? 'secondary' : 'ghost'} size="icon" className={activeToolTab !== 'picture-book' ? "text-slate-400 hover:text-white" : ""} onClick={() => setActiveToolTab('picture-book')} title="Picture Book">
                    <BookOpen className="h-5 w-5" />
                    <span className="sr-only">Picture Book</span>
                </Button>
                <Button variant={activeToolTab === 'turbo' ? 'secondary' : 'ghost'} size="icon" className={activeToolTab !== 'turbo' ? "text-slate-400 hover:text-white" : ""} onClick={() => setActiveToolTab('turbo')} title="TT Turbo">
                    <Zap className="h-5 w-5" />
                    <span className="sr-only">TT Turbo</span>
                </Button>
            </div>

            {/* Secondary Sidebar (Panel) */}
            <div className="w-80 bg-white border-r flex flex-col z-10">
                <div className="p-4 border-b">
                    <h2 className="font-bold text-lg truncate">{project.name}</h2>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                    {renderSidebarContent()}
                </div>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Toolbar */}
                <div className="h-14 bg-white border-b flex items-center justify-between px-4 shadow-sm z-10">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setZoom(z => Math.max(0.2, z - 0.1))}><Minus className="h-4 w-4" /></Button>
                        <span className="text-xs w-12 text-center">{Math.round(zoom * 100)}%</span>
                        <Button variant="ghost" size="sm" onClick={() => setZoom(z => Math.min(3, z + 0.1))}><Plus className="h-4 w-4" /></Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="destructive" size="sm" onClick={clearPage}>
                            <Trash2 className="h-4 w-4 mr-2" /> Clear Page
                        </Button>
                        <Button onClick={() => {
                            // Download current page as PNG
                            if (canvasRef.current) {
                                const link = document.createElement('a');
                                link.download = `${project.name}-page-${project.currentPageIndex + 1}.png`;
                                link.href = canvasRef.current.toDataURL();
                                link.click();
                            }
                        }}>
                            <Download className="h-4 w-4 mr-2" /> Download Page
                        </Button>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-slate-200/50" ref={containerRef}>
                    <div className="shadow-2xl bg-white" style={{ width: project.width * zoom, height: project.height * zoom }}>
                        <canvas
                            ref={canvasRef}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            className="block cursor-crosshair"
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                </div>
            </div>

            {/* Properties Panel (Right Side - Contextual) - Only for non-text and non-wordsearch elements (WS has its own panel) */}
            {selectedElementIds.length > 0 &&
                !(elements.find(e => e.id === selectedElementIds[0]) instanceof TextElement) &&
                !(elements.find(e => e.id === selectedElementIds[0]) instanceof WordSearchElement) &&
                !(elements.find(e => e.id === selectedElementIds[0]) instanceof CrosswordElement) && (
                    <div className="w-64 bg-white border-l p-4 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-sm">Properties</h3>
                            <Button variant="ghost" size="icon" onClick={() => deleteElements(selectedElementIds)} className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {(() => {
                                const el = elements.find(e => e.id === selectedElementIds[0]);
                                if (!el) return null;

                                return (
                                    <>
                                        <div className="space-y-1">
                                            <Label>Rotation</Label>
                                            <Slider
                                                value={[el.rotation]}
                                                min={0} max={360} step={1}
                                                onValueChange={(v) => updateSelectedElement({ rotation: v[0] })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Opacity</Label>
                                            <Slider
                                                value={[el.opacity * 100]}
                                                min={0} max={100} step={1}
                                                onValueChange={(v) => updateSelectedElement({ opacity: v[0] / 100 })}
                                            />
                                        </div>
                                        {el instanceof ShapeElement && (
                                            <div className="space-y-2">
                                                <Label>Fill Color</Label>
                                                <Input type="color" value={el.fillColor} onChange={(e) => updateSelectedElement({ fillColor: e.target.value })} />
                                                <Label>Stroke Color</Label>
                                                <Input type="color" value={el.strokeColor} onChange={(e) => updateSelectedElement({ strokeColor: e.target.value })} />
                                                <Label>Stroke Width</Label>
                                                <Slider
                                                    value={[el.strokeWidth]}
                                                    min={0} max={20} step={1}
                                                    onValueChange={(v) => updateSelectedElement({ strokeWidth: v[0] })}
                                                />
                                            </div>
                                        )}
                                        {el instanceof LineElement && (
                                            <div className="space-y-2">
                                                <Label>Color</Label>
                                                <Input type="color" value={el.color} onChange={(e) => updateSelectedElement({ color: e.target.value })} />
                                                <Label>Thickness</Label>
                                                <Input type="number" value={el.lineWidth} onChange={(e) => updateSelectedElement({ lineWidth: Number(e.target.value) })} />
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                )}
        </div>
    );
}
