"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    LayoutGrid, Search, X, Plus, Sparkles, Wand2, Compass, ShieldAlert,
    Swords, Boxes, Layers, MapPin, Trophy, Star, Route, Zap, Crown, Flame,
    ArrowRight, Check, Key, DoorOpen, Castle, Gem, Dices, Eye
} from "lucide-react";
import { toast } from "sonner";
import * as fabric from "fabric";
import {
    BoardGameConfig,
    BoardLayoutType,
    createDefaultBoardGameConfig,
} from "@/lib/board-game-engine";
import {
    generateBoardGameObjectsFromConfig,
    generatePrintableDiceGroup,
    generatePrintableSpinnerGroup,
    generatePrintableCardsGroup,
    generatePrintableTokensGroup,
} from "@/lib/worksheet-fabric";

interface WorksheetBoardGameDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
    onApplyTemplateConfig?: (config: BoardGameConfig) => void;
}

export interface SpaceComponentSpec {
    id: string;
    name: string;
    category: "basic" | "movement" | "grid-hex" | "dungeon" | "resource" | "quest" | "action";
    icon: string;
    bg: string;
    border: string;
    textColor: string;
    type: string;
    label: string;
    description: string;
    shape?: "square" | "circle" | "rounded" | "hexagon" | "diamond";
}

export interface TemplateGeneratorSpec {
    id: string;
    name: string;
    layout: BoardLayoutType;
    icon: string;
    badge: string;
    description: string;
    gameInspiration: string;
    gradient: string;
    totalSpaces: number;
    cellShape: "square" | "rounded" | "circle" | "hexagon";
}

// --- 60+ MODULAR SPACE COMPONENTS inspired by top 100 board games ---
export const SPACE_COMPONENT_LIBRARY: SpaceComponentSpec[] = [
    // 1. BASIC SPACES
    { id: "start", name: "Start Space 🚀", category: "basic", icon: "🚀", bg: "bg-emerald-500", border: "border-emerald-600", textColor: "text-white", type: "start", label: "START", description: "Player spawn and starting location (Candy Land, Monopoly)." },
    { id: "finish", name: "Finish Goal 🏁", category: "basic", icon: "🏁", bg: "bg-amber-400", border: "border-amber-500", textColor: "text-slate-950", type: "finish", label: "FINISH!", description: "End victory space (Chutes & Ladders, Trouble)." },
    { id: "checkpoint", name: "Checkpoint Flag 🚩", category: "basic", icon: "🚩", bg: "bg-sky-500", border: "border-sky-600", textColor: "text-white", type: "normal", label: "CHECKPOINT", description: "Progress save spot for long race tracks." },
    { id: "safe-space", name: "Safe Haven 🛡️", category: "basic", icon: "🛡️", bg: "bg-indigo-500", border: "border-indigo-600", textColor: "text-white", type: "normal", label: "SAFE ZONE", description: "Immunity from attacks and penalties (Sorry!, Parcheesi)." },
    { id: "home-space", name: "Home Base 🏠", category: "basic", icon: "🏠", bg: "bg-teal-500", border: "border-teal-600", textColor: "text-white", type: "normal", label: "HOME", description: "Team sanctuary base (Trouble, Aggravation)." },
    { id: "end-turn", name: "End Turn Spot 🛑", category: "basic", icon: "🛑", bg: "bg-rose-500", border: "border-rose-600", textColor: "text-white", type: "lose-turn", label: "END TURN", description: "Concludes player phase immediately." },

    // 2. MOVEMENT SPACES
    { id: "move-forward-1", name: "Forward +1 ⏩", category: "movement", icon: "⏩", bg: "bg-green-500", border: "border-green-600", textColor: "text-white", type: "bonus", label: "+1 SPACE", description: "Advance 1 space forward." },
    { id: "move-forward-3", name: "Express Boost +3 🚀", category: "movement", icon: "🚀", bg: "bg-emerald-600", border: "border-emerald-700", textColor: "text-white", type: "bonus", label: "+3 BOOST", description: "High-speed movement boost (Game of Life)." },
    { id: "move-back-2", name: "Slide Back -2 ⏪", category: "movement", icon: "⏪", bg: "bg-rose-500", border: "border-rose-600", textColor: "text-white", type: "go-back", label: "-2 BACK", description: "Knocks player backwards 2 spaces." },
    { id: "return-start", name: "Return to Start 🌀", category: "movement", icon: "🌀", bg: "bg-red-600", border: "border-red-700", textColor: "text-white", type: "go-back", label: "GO TO START", description: "Sends player back to beginning (Chutes & Ladders)." },
    { id: "teleport-portal", name: "Portal Warp 🔮", category: "movement", icon: "🔮", bg: "bg-purple-600", border: "border-purple-700", textColor: "text-white", type: "teleport", label: "PORTAL WARP", description: "Warp across the board to twin portal (Magic Maze)." },
    { id: "secret-tunnel", name: "Secret Shortcut 🚇", category: "movement", icon: "🚇", bg: "bg-amber-600", border: "border-amber-700", textColor: "text-white", type: "teleport", label: "SHORTCUT", description: "Bypasses dangerous board loops (Clank!, Candy Land)." },

    // 3. GRID & HEXAGON TILES
    { id: "hex-forest", name: "Lumber Forest Hex 🌲", category: "grid-hex", icon: "🌲", bg: "bg-emerald-600", border: "border-emerald-800", textColor: "text-white", type: "normal", label: "WOOD HEX", shape: "hexagon", description: "Resource tile for wood/lumber (Catan)." },
    { id: "hex-mountain", name: "Ore Mountain Hex 🏔️", category: "grid-hex", icon: "🏔️", bg: "bg-slate-600", border: "border-slate-800", textColor: "text-white", type: "normal", label: "ORE HEX", shape: "hexagon", description: "Resource tile for iron/ore (Catan, Terraforming Mars)." },
    { id: "hex-pasture", name: "Pasture Sheep Hex 🐑", category: "grid-hex", icon: "🐑", bg: "bg-lime-500", border: "border-lime-700", textColor: "text-slate-950", type: "normal", label: "WOOL HEX", shape: "hexagon", description: "Fertile pasture land tile." },
    { id: "hex-water", name: "Ocean Cove Hex 🌊", category: "grid-hex", icon: "🌊", bg: "bg-sky-600", border: "border-sky-800", textColor: "text-white", type: "normal", label: "WATER HEX", shape: "hexagon", description: "Navigable water/ocean tile (Eclipse, Harbor)." },
    { id: "chess-square-dark", name: "Dark Grid Tile ♟️", category: "grid-hex", icon: "♟️", bg: "bg-slate-800", border: "border-slate-900", textColor: "text-white", type: "normal", label: "", shape: "square", description: "Alternating dark grid tile (Chess, Checkers)." },
    { id: "chess-square-light", name: "Light Grid Tile ♔", category: "grid-hex", icon: "♔", bg: "bg-amber-100", border: "border-amber-300", textColor: "text-slate-900", type: "normal", label: "", shape: "square", description: "Alternating light grid tile." },

    // 4. DUNGEON CRAWL & BRANCHING
    { id: "dungeon-entrance", name: "Dungeon Gate 🚪", category: "dungeon", icon: "🚪", bg: "bg-stone-700", border: "border-stone-900", textColor: "text-amber-300", type: "start", label: "DUNGEON GATE", description: "Entryway to underground crawl (HeroQuest, Gloomhaven)." },
    { id: "boss-chamber", name: "Boss Lair 🐉", category: "dungeon", icon: "🐉", bg: "bg-red-950", border: "border-red-600", textColor: "text-red-400", type: "finish", label: "BOSS LAIR", description: "Final boss room encounter zone (Clank!, HeroQuest)." },
    { id: "treasure-chest", name: "Treasure Vault 💎", category: "dungeon", icon: "💎", bg: "bg-amber-500", border: "border-amber-600", textColor: "text-slate-950", type: "treasure", label: "GOLD CHEST", description: "Contains loot and victory rewards." },
    { id: "trapdoor-pit", name: "Trap Pitfall 🕳️", category: "dungeon", icon: "🕳️", bg: "bg-stone-900", border: "border-red-900", textColor: "text-rose-400", type: "lose-turn", label: "SPIKE TRAP", description: "Causes damage or forces missed turn." },
    { id: "locked-door", name: "Locked Gate 🔒", category: "dungeon", icon: "🔒", bg: "bg-zinc-800", border: "border-amber-500", textColor: "text-amber-400", type: "normal", label: "LOCKED GATE", description: "Requires key item to unlock (Betrayal, Descent)." },
    { id: "crossroads", name: "Branching Crossroads 🔀", category: "dungeon", icon: "🔀", bg: "bg-indigo-600", border: "border-indigo-800", textColor: "text-white", type: "question", label: "CHOOSE PATH", description: "Decision tree path selection (Game of Life, Choice)." },

    // 5. RESOURCE & ENGINE NODES
    { id: "coin-market", name: "Trading Post 🪙", category: "resource", icon: "🪙", bg: "bg-yellow-500", border: "border-yellow-600", textColor: "text-slate-950", type: "treasure", label: "+10 COINS", description: "Marketplace for buy/sell operations (Monopoly, Splendor)." },
    { id: "card-draw", name: "Action Deck 🃏", category: "resource", icon: "🃏", bg: "bg-blue-600", border: "border-blue-700", textColor: "text-white", type: "draw-card", label: "DRAW CARD", description: "Draw an event or action card (Codenames, Wingspan)." },
    { id: "victory-points", name: "Star Trophy 🏆", category: "resource", icon: "🏆", bg: "bg-amber-400", border: "border-amber-600", textColor: "text-slate-950", type: "bonus", label: "+5 VP", description: "Awards direct victory points." },
    { id: "energy-generator", name: "Energy Core ⚡", category: "resource", icon: "⚡", bg: "bg-cyan-500", border: "border-cyan-600", textColor: "text-slate-950", type: "bonus", label: "+3 ENERGY", description: "Refuels engine power resources (Terraforming Mars)." },

    // 6. QUEST & COOPERATIVE
    { id: "ancient-shrine", name: "Sacred Shrine ⛩️", category: "quest", icon: "⛩️", bg: "bg-violet-600", border: "border-violet-800", textColor: "text-white", type: "question", label: "SACRED SHRINE", description: "Grants divine blessings or quests (Spirit Island)." },
    { id: "sinking-tile", name: "Sinking Island 🌊", category: "quest", icon: "🌊", bg: "bg-teal-700", border: "border-teal-900", textColor: "text-cyan-200", type: "lose-turn", label: "FLOODING TILE", description: "Submerges tile after turn end (Forbidden Island)." },
    { id: "hazard-zone", name: "Outbreak Hazard ☣️", category: "quest", icon: "☣️", bg: "bg-yellow-600", border: "border-yellow-800", textColor: "text-slate-950", type: "lose-turn", label: "HAZARD ZONE", description: "Infection/contamination hotspot (Pandemic)." },
    { id: "clue-search", name: "Mystery Clue 🔍", category: "quest", icon: "🔍", bg: "bg-slate-700", border: "border-amber-500", textColor: "text-amber-300", type: "question", label: "DISCOVER CLUE", description: "Reveals evidence or answers (Clue, Eldritch Horror)." },

    // 7. ACTION & TRIVIA
    { id: "quiz-challenge", name: "Trivia Challenge ❓", category: "action", icon: "❓", bg: "bg-indigo-600", border: "border-indigo-700", textColor: "text-white", type: "question", label: "TRIVIA Q&A", description: "Answer question to proceed (Trivial Pursuit)." },
    { id: "roll-again", name: "Lucky Dice 🎲", category: "action", icon: "🎲", bg: "bg-emerald-500", border: "border-emerald-600", textColor: "text-white", type: "roll-again", label: "ROLL AGAIN", description: "Grants immediate extra turn (Yahtzee, Monopoly)." },
    { id: "swap-places", name: "Swap Position 🔄", category: "action", icon: "🔄", bg: "bg-fuchsia-600", border: "border-fuchsia-700", textColor: "text-white", type: "question", label: "SWAP SPOTS", description: "Swap positions with opponent (Sorry!)." },
];

// --- 25 BOARD LAYOUT TEMPLATE GENERATORS ---
export const BOARD_TEMPLATE_GENERATORS: TemplateGeneratorSpec[] = [
    { id: "tpl-linear-race", name: "Linear Race Track 🏎️", layout: "race-track", icon: "🏎️", badge: "Family Race", description: "Classic perimeter oval race track inspired by Candy Land & Speedways.", gameInspiration: "Candy Land, Chutes & Ladders, Speedway", gradient: "from-pink-500 to-purple-600", totalSpaces: 28, cellShape: "rounded" },
    { id: "tpl-snake-spiral", name: "Snake & Spiral Trail 🐍", layout: "snake", icon: "🐍", badge: "Serpentine", description: "Multi-row winding serpentine track with snakes, shortcuts, and hazard traps.", gameInspiration: "Snakes and Ladders, Goose Game", gradient: "from-emerald-500 to-teal-700", totalSpaces: 32, cellShape: "rounded" },
    { id: "tpl-hex-grid", name: "Catan Hexagon Empire 🔷", layout: "hexagon-grid", icon: "🔷", badge: "Strategy Hex", description: "Interlocking hexagonal resource grid for empire building and tile placement.", gameInspiration: "Catan, Eclipse, Cascadia, Terraforming Mars", gradient: "from-amber-500 to-orange-600", totalSpaces: 24, cellShape: "hexagon" },
    { id: "tpl-dungeon-crawl", name: "Dungeon Crawl Modular 🏰", layout: "dungeon-crawl", icon: "🏰", badge: "Co-op Dungeon", description: "Branching room chambers connected by corridors, locked gates, and boss lair.", gameInspiration: "Gloomhaven, HeroQuest, Clank!, Mice & Mystics", gradient: "from-slate-700 to-zinc-900", totalSpaces: 26, cellShape: "square" },
    { id: "tpl-treasure-island", name: "Treasure Island Map 🏴‍☠️", layout: "treasure-map", icon: "🏴‍☠️", badge: "Adventure Map", description: "Winding coastal trail through sea caves, reefs, and gold treasure chests.", gameInspiration: "Forbidden Island, Lost Cities, Pirates", gradient: "from-cyan-500 to-blue-700", totalSpaces: 30, cellShape: "circle" },
    { id: "tpl-branching-path", name: "Choice Branching Trail 🔀", layout: "branching-adventure", icon: "🔀", badge: "Decision Tree", description: "Multi-route adventure with high-risk shortcuts and decision hubs.", gameInspiration: "The Game of Life, Clank!, Choice Games", gradient: "from-indigo-500 to-violet-700", totalSpaces: 28, cellShape: "rounded" },
    { id: "tpl-tournament-tree", name: "Tournament Bracket 🏆", layout: "tournament-bracket", icon: "🏆", badge: "Championship", description: "Multi-round knockout championship tree for 8 or 16 player matches.", gameInspiration: "Tournament Brackets, Sports Leagues", gradient: "from-yellow-400 to-amber-600", totalSpaces: 15, cellShape: "square" },
    { id: "tpl-space-mission", name: "Space Station Mission 🚀", layout: "space-mission", icon: "🚀", badge: "Sci-Fi Galaxy", description: "Galactic warp gates, asteroid fields, and cosmic space station nodes.", gameInspiration: "Terraforming Mars, Clank! In! Space!", gradient: "from-blue-600 to-indigo-900", totalSpaces: 30, cellShape: "circle" },
    { id: "tpl-mountain-climb", name: "Mountain Peak Climb 🏔️", layout: "mountain-climb", icon: "🏔️", badge: "Elevation Expedition", description: "Base camp to snowy peak elevation steps with weather hazard zones.", gameInspiration: "Everest, Parcheesi, Mountain Trails", gradient: "from-stone-500 to-slate-800", totalSpaces: 25, cellShape: "rounded" },
    { id: "tpl-river-journey", name: "River Expedition 🚣", layout: "river-journey", icon: "🚣", badge: "Water Rapids", description: "Flowing water rapids with dock stops, fishing spots, and bridges.", gameInspiration: "Century, River Expeditions, Takenoko", gradient: "from-sky-400 to-cyan-600", totalSpaces: 26, cellShape: "rounded" },
];

export const WorksheetBoardGameDrawer: React.FC<WorksheetBoardGameDrawerProps> = ({
    isOpen,
    onClose,
    fabricCanvasRef,
    onApplyTemplateConfig,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    // Filter components based on search and category
    const filteredComponents = useMemo(() => {
        return SPACE_COMPONENT_LIBRARY.filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.label.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeTab === "all" || activeTab === item.category;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeTab]);

    // Filter templates based on search
    const filteredTemplates = useMemo(() => {
        return BOARD_TEMPLATE_GENERATORS.filter((tpl) => {
            return tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tpl.gameInspiration.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [searchQuery]);

    // Handle adding a single component tile to the canvas
    const handleAddComponentToCanvas = (spec: SpaceComponentSpec) => {
        const c = fabricCanvasRef.current;
        if (!c) {
            toast.error("Canvas is not ready!");
            return;
        }

        const size = spec.shape === "hexagon" ? 64 : 54;
        const left = 150 + Math.random() * 80;
        const top = 150 + Math.random() * 80;

        let baseShape: fabric.FabricObject;

        if (spec.shape === "hexagon") {
            const r = size / 2;
            const points = [];
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3 - Math.PI / 6;
                points.push({ x: r * Math.cos(angle), y: r * Math.sin(angle) });
            }
            baseShape = new fabric.Polygon(points, {
                fill: spec.bg.includes("emerald") ? "#059669" : spec.bg.includes("slate") ? "#475569" : spec.bg.includes("lime") ? "#84cc16" : "#0284c7",
                stroke: "#0f172a",
                strokeWidth: 2,
            });
        } else if (spec.shape === "circle") {
            baseShape = new fabric.Circle({
                radius: size / 2,
                fill: spec.bg.includes("emerald") ? "#10b981" : spec.bg.includes("rose") ? "#f43f5e" : spec.bg.includes("amber") ? "#f59e0b" : "#3b82f6",
                stroke: "#0f172a",
                strokeWidth: 2,
            });
        } else {
            baseShape = new fabric.Rect({
                width: size,
                height: size,
                rx: 10,
                ry: 10,
                fill: spec.bg.includes("emerald") ? "#059669" : spec.bg.includes("amber") ? "#f59e0b" : spec.bg.includes("purple") ? "#9333ea" : spec.bg.includes("rose") ? "#e11d48" : "#2563eb",
                stroke: "#0f172a",
                strokeWidth: 2,
            });
        }

        const iconObj = new fabric.IText(spec.icon, {
            fontSize: 22,
            left: baseShape.left,
            top: baseShape.top - 6,
            originX: "center",
            originY: "center",
        });

        const labelObj = new fabric.IText(spec.label, {
            fontSize: 9,
            fontFamily: "Inter",
            fontWeight: "bold",
            fill: "#ffffff",
            left: baseShape.left,
            top: baseShape.top + 14,
            originX: "center",
            originY: "center",
        });

        const group = new fabric.Group([baseShape, iconObj, labelObj], {
            left,
            top,
            subTargetCheck: true,
            interactive: true,
        });

        (group as any).id = `comp-${spec.id}-${Date.now()}`;
        (group as any).customType = "board-game-space";

        c.add(group);
        c.setActiveObject(group);
        c.requestRenderAll();
        c.fire("object:modified");

        toast.success(`Added ${spec.name} to canvas!`);
    };

    // Handle generating complete board template
    const handleGenerateTemplate = (tpl: TemplateGeneratorSpec) => {
        const config: BoardGameConfig = {
            ...createDefaultBoardGameConfig(),
            title: tpl.name.toUpperCase(),
            subtitle: `Inspired by ${tpl.gameInspiration}`,
            layout: tpl.layout,
            totalSpaces: tpl.totalSpaces,
            cellShape: tpl.cellShape,
        };

        if (onApplyTemplateConfig) {
            onApplyTemplateConfig(config);
        } else {
            const c = fabricCanvasRef.current;
            if (!c) return;
            const group = generateBoardGameObjectsFromConfig(config);
            group.set({ left: 100, top: 120 });
            c.add(group);
            c.setActiveObject(group);
            c.requestRenderAll();
            c.fire("object:modified");
            toast.success(`Generated ${tpl.name} board template!`);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Backdrop click to close */}
            <div className="flex-1" onClick={onClose} />

            {/* Slide-out Drawer Panel */}
            <div className="w-[540px] max-w-full bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md">
                            <LayoutGrid className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                Space Component & Template Drawer
                                <Badge variant="secondary" className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                                    Top 100 Inspired
                                </Badge>
                            </h2>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Drag or click components to customize your board game layout.
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Search & Tabs Controls */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
                    {/* Live Search Input */}
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search space components (e.g. Hex, Dungeon, Teleport, Gold)..."
                            className="pl-9 text-xs h-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl"
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 absolute right-2 top-1.5"
                                onClick={() => setSearchQuery("")}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        )}
                    </div>

                    {/* Category Filter Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="h-8 w-full justify-start overflow-x-auto bg-slate-100 dark:bg-slate-800 p-1 text-[11px]">
                            <TabsTrigger value="all" className="h-6 text-[10px] font-bold px-2.5">All ({SPACE_COMPONENT_LIBRARY.length})</TabsTrigger>
                            <TabsTrigger value="templates" className="h-6 text-[10px] font-bold px-2.5 text-indigo-600 dark:text-indigo-400">Templates ({BOARD_TEMPLATE_GENERATORS.length})</TabsTrigger>
                            <TabsTrigger value="basic" className="h-6 text-[10px] font-bold px-2.5">Basic</TabsTrigger>
                            <TabsTrigger value="movement" className="h-6 text-[10px] font-bold px-2.5">Movement</TabsTrigger>
                            <TabsTrigger value="grid-hex" className="h-6 text-[10px] font-bold px-2.5">Grid/Hex</TabsTrigger>
                            <TabsTrigger value="dungeon" className="h-6 text-[10px] font-bold px-2.5">Dungeon</TabsTrigger>
                            <TabsTrigger value="resource" className="h-6 text-[10px] font-bold px-2.5">Resource</TabsTrigger>
                            <TabsTrigger value="quest" className="h-6 text-[10px] font-bold px-2.5">Quests</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Main Scrollable Library Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* SECTION A: TEMPLATES (If All or Templates Tab active) */}
                    {(activeTab === "all" || activeTab === "templates") && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                                    <Wand2 className="w-3.5 h-3.5" /> 1-Click Board Templates inspired by Top 100 Games
                                </Label>
                                <span className="text-[10px] text-slate-400 font-mono">{filteredTemplates.length} layouts</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {filteredTemplates.map((tpl) => (
                                    <div
                                        key={tpl.id}
                                        className="group relative p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-start justify-between">
                                                <div className="text-2xl p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                                    {tpl.icon}
                                                </div>
                                                <Badge className={`text-[9px] font-bold bg-gradient-to-r ${tpl.gradient} text-white`}>
                                                    {tpl.badge}
                                                </Badge>
                                            </div>

                                            <div>
                                                <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {tpl.name}
                                                </h3>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                                    {tpl.description}
                                                </p>
                                            </div>

                                            <p className="text-[9px] text-indigo-600 dark:text-indigo-400 font-medium">
                                                💡 {tpl.gameInspiration}
                                            </p>
                                        </div>

                                        <Button
                                            className="w-full h-7 mt-3 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm flex items-center justify-center gap-1.5"
                                            onClick={() => handleGenerateTemplate(tpl)}
                                        >
                                            <Wand2 className="w-3 h-3" />
                                            Generate Board
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECTION B: MODULAR SPACE COMPONENTS */}
                    {activeTab !== "templates" && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                    <Boxes className="w-3.5 h-3.5 text-emerald-500" /> Modular Space Component Objects
                                </Label>
                                <span className="text-[10px] text-slate-400 font-mono">{filteredComponents.length} items</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5">
                                {filteredComponents.map((spec) => (
                                    <div
                                        key={spec.id}
                                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all flex flex-col justify-between"
                                    >
                                        <div className="flex items-start gap-2.5">
                                            <div className={`w-10 h-10 shrink-0 rounded-xl ${spec.bg} ${spec.textColor} flex items-center justify-center text-xl font-bold shadow-sm`}>
                                                {spec.icon}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 truncate">
                                                    {spec.name}
                                                </h4>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                                                    {spec.description}
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full h-7 mt-2.5 text-[10px] font-bold border-slate-300 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg flex items-center justify-center gap-1"
                                            onClick={() => handleAddComponentToCanvas(spec)}
                                        >
                                            <Plus className="w-3 h-3" /> Add Component
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
