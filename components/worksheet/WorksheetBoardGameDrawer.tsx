"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    LayoutGrid, Search, X, Plus, Wand2,
    Boxes, Layers
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
} from "@/lib/worksheet-fabric";

interface WorksheetBoardGameDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
    onApplyTemplateConfig?: (config: BoardGameConfig) => void;
}

// â”€â”€â”€ Tailwind bg class â†’ hex color â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TW_HEX: Record<string, string> = {
    "slate-200": "#e2e8f0", "slate-600": "#475569", "slate-700": "#334155",
    "slate-800": "#1e293b", "slate-900": "#0f172a",
    "gray-600": "#4b5563", "gray-700": "#374151",
    "zinc-700": "#3f3f46", "zinc-800": "#27272a",
    "stone-500": "#78716c", "stone-600": "#57534e", "stone-700": "#44403c",
    "stone-900": "#1c1917",
    "red-400": "#f87171", "red-500": "#ef4444", "red-600": "#dc2626",
    "red-700": "#b91c1c", "red-800": "#991b1b", "red-900": "#7f1d1d", "red-950": "#450a0a",
    "orange-500": "#f97316", "orange-600": "#ea580c",
    "amber-100": "#fef3c7", "amber-400": "#fbbf24", "amber-500": "#f59e0b",
    "amber-600": "#d97706", "amber-700": "#b45309", "amber-800": "#92400e",
    "yellow-400": "#facc15", "yellow-500": "#eab308", "yellow-600": "#ca8a04",
    "lime-500": "#84cc16", "lime-600": "#65a30d",
    "green-500": "#22c55e", "green-600": "#16a34a", "green-700": "#15803d",
    "emerald-400": "#34d399", "emerald-500": "#10b981", "emerald-600": "#059669",
    "emerald-700": "#047857",
    "teal-500": "#14b8a6", "teal-600": "#0d9488", "teal-700": "#0f766e",
    "cyan-500": "#06b6d4", "cyan-600": "#0891b2",
    "sky-400": "#38bdf8", "sky-500": "#0ea5e9", "sky-600": "#0284c7",
    "sky-700": "#0369a1",
    "blue-400": "#60a5fa", "blue-500": "#3b82f6", "blue-600": "#2563eb",
    "blue-700": "#1d4ed8",
    "indigo-500": "#6366f1", "indigo-600": "#4f46e5", "indigo-700": "#4338ca",
    "violet-400": "#a78bfa", "violet-600": "#7c3aed", "violet-700": "#6d28d9",
    "violet-800": "#5b21b6",
    "purple-600": "#9333ea", "purple-700": "#7e22ce", "purple-800": "#6b21a8",
    "purple-900": "#581c87",
    "fuchsia-500": "#d946ef", "fuchsia-600": "#c026d3",
    "pink-300": "#f9a8d4", "pink-500": "#ec4899", "pink-600": "#db2777",
    "rose-400": "#fb7185", "rose-500": "#f43f5e", "rose-600": "#e11d48",
};
function twToHex(twClass: string): string {
    return TW_HEX[twClass.replace(/^bg-/, "")] ?? "#64748b";
}

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export type SpaceCategory =
    | "basic" | "movement" | "grid-hex" | "dungeon"
    | "resource" | "quest" | "action" | "pattern"
    | "combat" | "city" | "special" | "educational";

export interface SpaceComponentSpec {
    id: string;
    name: string;
    category: SpaceCategory;
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

// â”€â”€â”€ 156+ SPACE COMPONENT LIBRARY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const SPACE_COMPONENT_LIBRARY: SpaceComponentSpec[] = [
    // 1. BASIC (12) â”€ Candy Land, Chutes & Ladders, Monopoly
    { id: "start", name: "Start Space", category: "basic", icon: "ðŸš€", bg: "bg-emerald-500", border: "border-emerald-600", textColor: "text-white", type: "start", label: "START", description: "Player spawn / starting location (Candy Land, Monopoly).", shape: "rounded" },
    { id: "finish", name: "Finish Goal", category: "basic", icon: "ðŸ", bg: "bg-amber-400", border: "border-amber-500", textColor: "text-slate-950", type: "finish", label: "FINISH!", description: "End / victory space (Chutes & Ladders, Trouble).", shape: "rounded" },
    { id: "checkpoint", name: "Checkpoint Flag", category: "basic", icon: "ðŸš©", bg: "bg-sky-500", border: "border-sky-600", textColor: "text-white", type: "normal", label: "CHECKPOINT", description: "Progress save spot on long race tracks.", shape: "rounded" },
    { id: "safe-space", name: "Safe Haven", category: "basic", icon: "ðŸ›¡ï¸", bg: "bg-indigo-500", border: "border-indigo-600", textColor: "text-white", type: "normal", label: "SAFE ZONE", description: "Immunity from attacks & penalties (Sorry!, Parcheesi).", shape: "rounded" },
    { id: "home-space", name: "Home Base", category: "basic", icon: "ðŸ ", bg: "bg-teal-500", border: "border-teal-600", textColor: "text-white", type: "normal", label: "HOME", description: "Team sanctuary base (Trouble, Aggravation).", shape: "rounded" },
    { id: "end-turn", name: "End Turn Spot", category: "basic", icon: "ðŸ›‘", bg: "bg-rose-500", border: "border-rose-600", textColor: "text-white", type: "lose-turn", label: "END TURN", description: "Concludes player phase immediately.", shape: "rounded" },
    { id: "blank-space", name: "Blank Space", category: "basic", icon: "â¬œ", bg: "bg-slate-200", border: "border-slate-300", textColor: "text-slate-700", type: "normal", label: "", description: "Neutral empty space â€” no action, no penalty.", shape: "square" },
    { id: "numbered-space", name: "Numbered Space", category: "basic", icon: "#ï¸âƒ£", bg: "bg-blue-500", border: "border-blue-600", textColor: "text-white", type: "normal", label: "42", description: "Space with a custom number label (tracks & paths).", shape: "rounded" },
    { id: "colored-space", name: "Color Marker", category: "basic", icon: "ðŸŽ¨", bg: "bg-fuchsia-500", border: "border-fuchsia-600", textColor: "text-white", type: "normal", label: "COLOR", description: "Colored matching space (Candy Land color cards).", shape: "rounded" },
    { id: "goal-space", name: "Goal Zone", category: "basic", icon: "ðŸŽ¯", bg: "bg-amber-500", border: "border-amber-600", textColor: "text-white", type: "finish", label: "GOAL!", description: "Score-based objective space (Wingspan, Ticket to Ride).", shape: "rounded" },
    { id: "rest-space", name: "Rest Stop", category: "basic", icon: "ðŸ˜´", bg: "bg-violet-400", border: "border-violet-500", textColor: "text-white", type: "lose-turn", label: "REST STOP", description: "Player must rest and skip next turn.", shape: "rounded" },
    { id: "power-up", name: "Power-Up Star", category: "basic", icon: "â­", bg: "bg-yellow-400", border: "border-yellow-500", textColor: "text-slate-900", type: "bonus", label: "POWER UP!", description: "Grants a special power or ability boost.", shape: "rounded" },

    // 2. MOVEMENT (15) â”€ Sorry!, Chutes & Ladders, Warp zones
    { id: "move-forward-1", name: "Forward +1", category: "movement", icon: "â©", bg: "bg-green-500", border: "border-green-600", textColor: "text-white", type: "bonus", label: "+1 SPACE", description: "Advance 1 space forward.", shape: "rounded" },
    { id: "move-forward-2", name: "Forward +2", category: "movement", icon: "â–¶ï¸", bg: "bg-green-600", border: "border-green-700", textColor: "text-white", type: "bonus", label: "+2 SPACES", description: "Advance 2 spaces forward.", shape: "rounded" },
    { id: "move-forward-3", name: "Express Boost +3", category: "movement", icon: "ðŸš€", bg: "bg-emerald-600", border: "border-emerald-700", textColor: "text-white", type: "bonus", label: "+3 BOOST", description: "High-speed boost (Game of Life).", shape: "rounded" },
    { id: "move-back-1", name: "Slide Back -1", category: "movement", icon: "â—€ï¸", bg: "bg-rose-400", border: "border-rose-500", textColor: "text-white", type: "go-back", label: "-1 BACK", description: "Slip back 1 space (Chutes & Ladders).", shape: "rounded" },
    { id: "move-back-2", name: "Slide Back -2", category: "movement", icon: "âª", bg: "bg-rose-500", border: "border-rose-600", textColor: "text-white", type: "go-back", label: "-2 BACK", description: "Knocked backwards 2 spaces.", shape: "rounded" },
    { id: "move-back-3", name: "Major Setback -3", category: "movement", icon: "â®ï¸", bg: "bg-rose-600", border: "border-rose-700", textColor: "text-white", type: "go-back", label: "-3 BACK", description: "Major backwards setback.", shape: "rounded" },
    { id: "jump-ahead", name: "Jump Ahead", category: "movement", icon: "ðŸ¦˜", bg: "bg-lime-500", border: "border-lime-600", textColor: "text-slate-900", type: "bonus", label: "JUMP AHEAD!", description: "Leap to the next checkpoint space.", shape: "rounded" },
    { id: "jump-back", name: "Jump Back", category: "movement", icon: "ðŸ¸", bg: "bg-orange-500", border: "border-orange-600", textColor: "text-white", type: "go-back", label: "JUMP BACK!", description: "Jump backwards to the previous marked space.", shape: "rounded" },
    { id: "return-start", name: "Return to Start", category: "movement", icon: "ðŸŒ€", bg: "bg-red-600", border: "border-red-700", textColor: "text-white", type: "go-back", label: "GO TO START", description: "Sends player back to beginning (Chutes & Ladders).", shape: "rounded" },
    { id: "teleport-portal", name: "Portal Warp", category: "movement", icon: "ðŸ”®", bg: "bg-purple-600", border: "border-purple-700", textColor: "text-white", type: "teleport", label: "PORTAL WARP", description: "Warp to the twin portal (Tsuro, Magic Maze).", shape: "circle" },
    { id: "secret-tunnel", name: "Secret Shortcut", category: "movement", icon: "ðŸš‡", bg: "bg-amber-600", border: "border-amber-700", textColor: "text-white", type: "teleport", label: "SHORTCUT", description: "Bypass dangerous loops (Clank!, Candy Land).", shape: "rounded" },
    { id: "warp-space", name: "Warp Zone", category: "movement", icon: "ðŸŒŒ", bg: "bg-indigo-700", border: "border-indigo-800", textColor: "text-white", type: "teleport", label: "WARP ZONE", description: "Random teleport to any unlocked space.", shape: "circle" },
    { id: "move-to-finish", name: "Express to Finish", category: "movement", icon: "ðŸ†", bg: "bg-yellow-500", border: "border-yellow-600", textColor: "text-slate-900", type: "finish", label: "MOVE TO FINISH", description: "Instantly advances player to finish.", shape: "rounded" },
    { id: "swap-places", name: "Swap Position", category: "movement", icon: "ðŸ”„", bg: "bg-fuchsia-600", border: "border-fuchsia-700", textColor: "text-white", type: "question", label: "SWAP SPOTS", description: "Swap positions with any opponent (Sorry!).", shape: "rounded" },
    { id: "express-lane", name: "Express Lane", category: "movement", icon: "ðŸ›¤ï¸", bg: "bg-cyan-500", border: "border-cyan-600", textColor: "text-white", type: "bonus", label: "EXPRESS LANE", description: "Fast-track lane skipping several spaces.", shape: "rounded" },

    // 3. GRID & HEX (14) â”€ Chess, Checkers, Catan, Cascadia, Eclipse
    { id: "hex-forest", name: "Lumber Forest Hex", category: "grid-hex", icon: "ðŸŒ²", bg: "bg-emerald-600", border: "border-emerald-800", textColor: "text-white", type: "normal", label: "WOOD HEX", shape: "hexagon", description: "Resource tile for wood/lumber (Catan, Everdell)." },
    { id: "hex-mountain", name: "Ore Mountain Hex", category: "grid-hex", icon: "ðŸ”ï¸", bg: "bg-slate-600", border: "border-slate-800", textColor: "text-white", type: "normal", label: "ORE HEX", shape: "hexagon", description: "Resource tile for iron/ore (Catan, Terraforming Mars)." },
    { id: "hex-pasture", name: "Pasture Sheep Hex", category: "grid-hex", icon: "ðŸ‘", bg: "bg-lime-500", border: "border-lime-600", textColor: "text-slate-950", type: "normal", label: "WOOL HEX", shape: "hexagon", description: "Fertile pasture land tile (Catan)." },
    { id: "hex-water", name: "Ocean Cove Hex", category: "grid-hex", icon: "ðŸŒŠ", bg: "bg-sky-600", border: "border-sky-800", textColor: "text-white", type: "normal", label: "WATER HEX", shape: "hexagon", description: "Navigable water/ocean tile (Eclipse, Harbor)." },
    { id: "hex-desert", name: "Desert Barren Hex", category: "grid-hex", icon: "ðŸœï¸", bg: "bg-yellow-600", border: "border-yellow-800", textColor: "text-slate-900", type: "normal", label: "DESERT HEX", shape: "hexagon", description: "Barren desert â€” no resources (Catan)." },
    { id: "hex-fields", name: "Grain Fields Hex", category: "grid-hex", icon: "ðŸŒ¾", bg: "bg-amber-400", border: "border-amber-600", textColor: "text-slate-900", type: "normal", label: "GRAIN HEX", shape: "hexagon", description: "Wheat/grain harvest hex tile (Catan, Agricola)." },
    { id: "hex-port", name: "Trading Port Hex", category: "grid-hex", icon: "âš“", bg: "bg-teal-600", border: "border-teal-800", textColor: "text-white", type: "normal", label: "PORT HEX", shape: "hexagon", description: "Maritime trade port hex (Catan harbor nodes)." },
    { id: "chess-square-dark", name: "Dark Grid Tile", category: "grid-hex", icon: "â™Ÿï¸", bg: "bg-slate-800", border: "border-slate-900", textColor: "text-white", type: "normal", label: "", shape: "square", description: "Alternating dark grid tile (Chess, Checkers)." },
    { id: "chess-square-light", name: "Light Grid Tile", category: "grid-hex", icon: "â™”", bg: "bg-amber-100", border: "border-amber-300", textColor: "text-slate-900", type: "normal", label: "", shape: "square", description: "Alternating light grid tile (Chess, Checkers)." },
    { id: "grid-settlement", name: "Settlement Node", category: "grid-hex", icon: "ðŸ˜ï¸", bg: "bg-orange-500", border: "border-orange-600", textColor: "text-white", type: "normal", label: "SETTLEMENT", shape: "circle", description: "Village/settlement intersection node (Catan)." },
    { id: "grid-city", name: "City Node", category: "grid-hex", icon: "ðŸ™ï¸", bg: "bg-blue-700", border: "border-blue-900", textColor: "text-white", type: "normal", label: "CITY NODE", shape: "circle", description: "Upgraded city node (Catan, Carcassonne)." },
    { id: "grid-road", name: "Road Connection", category: "grid-hex", icon: "ðŸ›£ï¸", bg: "bg-stone-600", border: "border-stone-800", textColor: "text-white", type: "normal", label: "ROAD", shape: "square", description: "Road/path edge connecting two spaces." },
    { id: "blokus-piece", name: "Blokus Piece", category: "grid-hex", icon: "ðŸŸ¦", bg: "bg-blue-500", border: "border-blue-700", textColor: "text-white", type: "normal", label: "PIECE", shape: "square", description: "Colored polyomino piece tile (Blokus)." },
    { id: "santorini-dome", name: "Santorini Dome", category: "grid-hex", icon: "ðŸ•Œ", bg: "bg-sky-400", border: "border-sky-600", textColor: "text-white", type: "normal", label: "DOME", shape: "circle", description: "Three-tier building capped with dome (Santorini)." },

    // 4. DUNGEON (12) â”€ HeroQuest, Gloomhaven, Clank!
    { id: "dungeon-entrance", name: "Dungeon Gate", category: "dungeon", icon: "ðŸšª", bg: "bg-stone-700", border: "border-stone-900", textColor: "text-amber-300", type: "start", label: "DUNGEON GATE", description: "Entryway to underground crawl (HeroQuest, Gloomhaven).", shape: "square" },
    { id: "boss-chamber", name: "Boss Lair", category: "dungeon", icon: "ðŸ‰", bg: "bg-red-950", border: "border-red-600", textColor: "text-red-400", type: "finish", label: "BOSS LAIR", description: "Final boss room (Clank!, HeroQuest).", shape: "square" },
    { id: "treasure-chest", name: "Treasure Vault", category: "dungeon", icon: "ðŸ’Ž", bg: "bg-amber-500", border: "border-amber-600", textColor: "text-slate-950", type: "treasure", label: "GOLD CHEST", description: "Contains loot and victory rewards.", shape: "square" },
    { id: "trapdoor-pit", name: "Trap Pitfall", category: "dungeon", icon: "ðŸ•³ï¸", bg: "bg-stone-900", border: "border-red-900", textColor: "text-rose-400", type: "lose-turn", label: "SPIKE TRAP", description: "Damage or forced missed turn (Gloomhaven).", shape: "square" },
    { id: "locked-door", name: "Locked Gate", category: "dungeon", icon: "ðŸ”’", bg: "bg-zinc-800", border: "border-amber-500", textColor: "text-amber-400", type: "normal", label: "LOCKED GATE", description: "Requires key item to unlock (Betrayal, Descent).", shape: "square" },
    { id: "crossroads", name: "Branching Crossroads", category: "dungeon", icon: "ðŸ”€", bg: "bg-indigo-600", border: "border-indigo-800", textColor: "text-white", type: "question", label: "CHOOSE PATH", description: "Decision tree path selection (Betrayal, Game of Life).", shape: "square" },
    { id: "monster-room", name: "Monster Den", category: "dungeon", icon: "ðŸ‘¹", bg: "bg-red-800", border: "border-red-950", textColor: "text-orange-300", type: "lose-turn", label: "MONSTER DEN", description: "Combat encounter â€” fight to pass (Descent).", shape: "square" },
    { id: "healing-shrine", name: "Healing Shrine", category: "dungeon", icon: "ðŸ’Š", bg: "bg-emerald-700", border: "border-emerald-900", textColor: "text-emerald-200", type: "bonus", label: "HEALING SHRINE", description: "Restore health points (cooperative dungeon games).", shape: "square" },
    { id: "secret-passage", name: "Secret Passage", category: "dungeon", icon: "ðŸ—ï¸", bg: "bg-violet-800", border: "border-violet-950", textColor: "text-violet-200", type: "teleport", label: "SECRET PASSAGE", description: "Hidden shortcut passage (Clue, Betrayal).", shape: "square" },
    { id: "exit-room", name: "Escape Exit", category: "dungeon", icon: "ðŸƒ", bg: "bg-green-700", border: "border-green-900", textColor: "text-green-200", type: "finish", label: "ESCAPE EXIT", description: "Victory escape point â€” survive and exit!", shape: "square" },
    { id: "altar-room", name: "Ancient Altar", category: "dungeon", icon: "ðŸ•¯ï¸", bg: "bg-purple-900", border: "border-purple-950", textColor: "text-purple-200", type: "question", label: "ALTAR", description: "Mysterious altar where rituals grant powers (Arkham).", shape: "square" },
    { id: "armory-room", name: "Dungeon Armory", category: "dungeon", icon: "âš”ï¸", bg: "bg-zinc-700", border: "border-zinc-900", textColor: "text-amber-300", type: "bonus", label: "ARMORY", description: "Equip weapons and armor for upcoming battles.", shape: "square" },

    // 5. RESOURCE (14) â”€ Monopoly, Catan, Splendor, Wingspan
    { id: "coin-market", name: "Trading Post", category: "resource", icon: "ðŸª™", bg: "bg-yellow-500", border: "border-yellow-600", textColor: "text-slate-950", type: "treasure", label: "+10 COINS", description: "Marketplace for buy/sell operations (Monopoly, Splendor).", shape: "rounded" },
    { id: "card-draw", name: "Action Deck", category: "resource", icon: "ðŸƒ", bg: "bg-blue-600", border: "border-blue-700", textColor: "text-white", type: "draw-card", label: "DRAW CARD", description: "Draw an event or action card (Codenames, Wingspan).", shape: "rounded" },
    { id: "victory-points", name: "Star Trophy", category: "resource", icon: "ðŸ†", bg: "bg-amber-400", border: "border-amber-600", textColor: "text-slate-950", type: "bonus", label: "+5 VP", description: "Awards direct victory points (Splendor, 7 Wonders).", shape: "rounded" },
    { id: "energy-generator", name: "Energy Core", category: "resource", icon: "âš¡", bg: "bg-cyan-500", border: "border-cyan-600", textColor: "text-slate-950", type: "bonus", label: "+3 ENERGY", description: "Refuels engine power resources (Terraforming Mars).", shape: "rounded" },
    { id: "food-supply", name: "Food Supply", category: "resource", icon: "ðŸŽ", bg: "bg-red-500", border: "border-red-600", textColor: "text-white", type: "bonus", label: "+2 FOOD", description: "Gather food resources (Agricola, Wingspan).", shape: "rounded" },
    { id: "science-lab", name: "Research Lab", category: "resource", icon: "ðŸ”¬", bg: "bg-blue-700", border: "border-blue-800", textColor: "text-white", type: "bonus", label: "RESEARCH", description: "Advance science track (Pandemic, Terraforming Mars).", shape: "rounded" },
    { id: "factory-zone", name: "Production Factory", category: "resource", icon: "ðŸ­", bg: "bg-gray-700", border: "border-gray-800", textColor: "text-white", type: "bonus", label: "FACTORY", description: "Mass produce resources or goods (Century: Spice Road).", shape: "rounded" },
    { id: "trade-route", name: "Trade Route", category: "resource", icon: "ðŸš¢", bg: "bg-teal-600", border: "border-teal-800", textColor: "text-white", type: "bonus", label: "TRADE ROUTE", description: "Maritime trade between settlements (Catan, Jaipur).", shape: "rounded" },
    { id: "bank", name: "Central Bank", category: "resource", icon: "ðŸ¦", bg: "bg-green-700", border: "border-green-900", textColor: "text-white", type: "bonus", label: "BANK", description: "Exchange resources for currency (Monopoly bank).", shape: "rounded" },
    { id: "tax-collector", name: "Tax Collector", category: "resource", icon: "ðŸ’¸", bg: "bg-red-700", border: "border-red-900", textColor: "text-white", type: "lose-turn", label: "PAY TAX!", description: "Forced resource payment (Monopoly income tax).", shape: "rounded" },
    { id: "railroad-depot", name: "Railroad Depot", category: "resource", icon: "ðŸš‚", bg: "bg-stone-700", border: "border-stone-900", textColor: "text-amber-300", type: "bonus", label: "RAILROAD", description: "Train depot collecting route bonuses (Ticket to Ride).", shape: "rounded" },
    { id: "harbor-dock", name: "Harbor Dock", category: "resource", icon: "âš“", bg: "bg-sky-700", border: "border-sky-900", textColor: "text-white", type: "bonus", label: "HARBOR DOCK", description: "Sea trading port for 2:1 exchange (Catan).", shape: "rounded" },
    { id: "gem-mine", name: "Gem Mine", category: "resource", icon: "ðŸ’", bg: "bg-violet-600", border: "border-violet-800", textColor: "text-white", type: "bonus", label: "GEM MINE", description: "Collect gem tokens for purchases (Splendor).", shape: "rounded" },
    { id: "bird-feeder", name: "Bird Feeder", category: "resource", icon: "ðŸ¦", bg: "bg-lime-600", border: "border-lime-800", textColor: "text-white", type: "bonus", label: "BIRD FEEDER", description: "Take food dice from the feeder (Wingspan).", shape: "rounded" },

    // 6. QUEST & COOPERATIVE (12) â”€ Pandemic, Forbidden Island, Spirit Island
    { id: "ancient-shrine", name: "Sacred Shrine", category: "quest", icon: "â›©ï¸", bg: "bg-violet-600", border: "border-violet-800", textColor: "text-white", type: "question", label: "SACRED SHRINE", description: "Grants divine blessings or quests (Spirit Island, Tokaido).", shape: "rounded" },
    { id: "sinking-tile", name: "Sinking Island", category: "quest", icon: "ðŸŒŠ", bg: "bg-teal-700", border: "border-teal-900", textColor: "text-cyan-200", type: "lose-turn", label: "FLOODING TILE", description: "Submerges after turn end (Forbidden Island).", shape: "square" },
    { id: "hazard-zone", name: "Outbreak Hazard", category: "quest", icon: "â˜£ï¸", bg: "bg-yellow-600", border: "border-yellow-800", textColor: "text-slate-950", type: "lose-turn", label: "HAZARD ZONE", description: "Infection/contamination hotspot (Pandemic).", shape: "rounded" },
    { id: "clue-search", name: "Mystery Clue", category: "quest", icon: "ðŸ”", bg: "bg-slate-700", border: "border-amber-500", textColor: "text-amber-300", type: "question", label: "DISCOVER CLUE", description: "Reveals evidence (Clue/Cluedo, Eldritch Horror).", shape: "rounded" },
    { id: "mission-objective", name: "Mission Objective", category: "quest", icon: "ðŸ“‹", bg: "bg-blue-600", border: "border-blue-800", textColor: "text-white", type: "question", label: "MISSION", description: "Cooperative task all players complete together (Robinson Crusoe).", shape: "rounded" },
    { id: "rescue-point", name: "Rescue Zone", category: "quest", icon: "ðŸ†˜", bg: "bg-red-500", border: "border-red-700", textColor: "text-white", type: "bonus", label: "RESCUE ZONE", description: "Save trapped survivors from disaster (Dead of Winter).", shape: "rounded" },
    { id: "cure-station", name: "Cure Research", category: "quest", icon: "ðŸ’‰", bg: "bg-emerald-600", border: "border-emerald-800", textColor: "text-white", type: "bonus", label: "CURE FOUND!", description: "Discover a disease cure (Pandemic research station).", shape: "rounded" },
    { id: "artifact-vault", name: "Artifact Vault", category: "quest", icon: "ðŸº", bg: "bg-amber-700", border: "border-amber-900", textColor: "text-amber-200", type: "treasure", label: "ARTIFACT", description: "Sacred artifact collection zone (Forbidden Desert).", shape: "rounded" },
    { id: "corruption-zone", name: "Corruption Zone", category: "quest", icon: "ðŸŒ‘", bg: "bg-slate-900", border: "border-purple-700", textColor: "text-purple-300", type: "lose-turn", label: "CORRUPTED", description: "Spreading darkness to cleanse (Spirit Island).", shape: "rounded" },
    { id: "ally-camp", name: "Ally Base Camp", category: "quest", icon: "ðŸ•ï¸", bg: "bg-green-600", border: "border-green-800", textColor: "text-white", type: "bonus", label: "ALLY CAMP", description: "Team campsite for healing (Arkham Horror).", shape: "rounded" },
    { id: "investigation", name: "Investigation Site", category: "quest", icon: "ðŸ—‚ï¸", bg: "bg-indigo-600", border: "border-indigo-800", textColor: "text-white", type: "question", label: "INVESTIGATE", description: "Gather clues and evidence (Arkham Horror, Betrayal).", shape: "rounded" },
    { id: "spirit-power", name: "Spirit Power", category: "quest", icon: "ðŸŒ€", bg: "bg-purple-700", border: "border-purple-900", textColor: "text-purple-200", type: "bonus", label: "SPIRIT POWER", description: "Activate a spirit's unique power (Spirit Island).", shape: "circle" },

    // 7. ACTION & TRIVIA (14) â”€ Trivial Pursuit, Codenames, Sorry!, Taboo
    { id: "quiz-challenge", name: "Trivia Challenge", category: "action", icon: "â“", bg: "bg-indigo-600", border: "border-indigo-700", textColor: "text-white", type: "question", label: "TRIVIA Q&A", description: "Answer a question to proceed (Trivial Pursuit).", shape: "rounded" },
    { id: "roll-again", name: "Lucky Dice", category: "action", icon: "ðŸŽ²", bg: "bg-emerald-500", border: "border-emerald-600", textColor: "text-white", type: "roll-again", label: "ROLL AGAIN", description: "Grants an immediate extra turn (Yahtzee, Monopoly).", shape: "rounded" },
    { id: "dare-challenge", name: "Dare Challenge", category: "action", icon: "ðŸ˜ˆ", bg: "bg-red-600", border: "border-red-700", textColor: "text-white", type: "question", label: "TAKE A DARE!", description: "Complete a physical dare to stay on the space.", shape: "rounded" },
    { id: "mime-challenge", name: "Mime It!", category: "action", icon: "ðŸ¤«", bg: "bg-pink-500", border: "border-pink-600", textColor: "text-white", type: "question", label: "ACT IT OUT!", description: "Act out a word without speaking (Pictionary, Charades).", shape: "rounded" },
    { id: "draw-it", name: "Draw It!", category: "action", icon: "âœï¸", bg: "bg-amber-500", border: "border-amber-600", textColor: "text-slate-900", type: "question", label: "DRAW IT!", description: "Draw a word for teammates to guess (Pictionary, Telestrations).", shape: "rounded" },
    { id: "code-word", name: "Code Word", category: "action", icon: "ðŸ”‘", bg: "bg-blue-700", border: "border-blue-800", textColor: "text-white", type: "question", label: "CODE WORD", description: "One-word clue to link multiple words (Codenames).", shape: "rounded" },
    { id: "taboo-word", name: "Taboo Word", category: "action", icon: "ðŸš«", bg: "bg-red-700", border: "border-red-800", textColor: "text-white", type: "question", label: "TABOO!", description: "Describe without forbidden words (Taboo).", shape: "rounded" },
    { id: "wild-card", name: "Wild Card", category: "action", icon: "ðŸƒ", bg: "bg-fuchsia-600", border: "border-fuchsia-700", textColor: "text-white", type: "bonus", label: "WILD CARD!", description: "Player chooses any action from the action deck.", shape: "rounded" },
    { id: "skip-turn", name: "Lose a Turn", category: "action", icon: "â­ï¸", bg: "bg-gray-600", border: "border-gray-700", textColor: "text-white", type: "lose-turn", label: "SKIP TURN!", description: "Player loses their next turn (Trouble, Candy Land).", shape: "rounded" },
    { id: "extra-turn", name: "Bonus Turn", category: "action", icon: "ðŸŽ", bg: "bg-green-500", border: "border-green-600", textColor: "text-white", type: "bonus", label: "EXTRA TURN!", description: "Player earns an additional action turn.", shape: "rounded" },
    { id: "steal-resource", name: "Steal!", category: "action", icon: "ðŸ¦", bg: "bg-orange-600", border: "border-orange-700", textColor: "text-white", type: "question", label: "STEAL!", description: "Take 1 resource from any opponent player.", shape: "rounded" },
    { id: "vote-choice", name: "Group Vote", category: "action", icon: "ðŸ—³ï¸", bg: "bg-slate-600", border: "border-slate-800", textColor: "text-white", type: "question", label: "GROUP VOTE", description: "All players vote on an outcome together (social games).", shape: "rounded" },
    { id: "bluff-card", name: "Bluff Play", category: "action", icon: "ðŸŽ­", bg: "bg-purple-700", border: "border-purple-800", textColor: "text-white", type: "question", label: "BLUFF!", description: "Play a hidden bluff and see if opponents call it (Balderdash).", shape: "rounded" },
    { id: "spin-wheel", name: "Spin the Wheel", category: "action", icon: "ðŸŽ¡", bg: "bg-pink-600", border: "border-pink-700", textColor: "text-white", type: "roll-again", label: "SPIN!", description: "Spin the spinner for a random event (Game of Life).", shape: "circle" },

    // 8. PATTERN (12) â”€ Azul, Sagrada, Patchwork, Qwirkle, Cascadia
    { id: "azul-tile-blue", name: "Azure Blue Tile", category: "pattern", icon: "ðŸŸ¦", bg: "bg-blue-500", border: "border-blue-700", textColor: "text-white", type: "normal", label: "BLUE TILE", shape: "square", description: "Azul blue mosaic tile (Azul, Sagrada)." },
    { id: "azul-tile-red", name: "Crimson Red Tile", category: "pattern", icon: "ðŸŸ¥", bg: "bg-red-500", border: "border-red-700", textColor: "text-white", type: "normal", label: "RED TILE", shape: "square", description: "Azul red mosaic tile (Azul)." },
    { id: "azul-tile-yellow", name: "Golden Yellow Tile", category: "pattern", icon: "ðŸŸ¨", bg: "bg-yellow-400", border: "border-yellow-600", textColor: "text-slate-900", type: "normal", label: "YELLOW TILE", shape: "square", description: "Azul yellow mosaic tile (Azul)." },
    { id: "azul-tile-black", name: "Midnight Black Tile", category: "pattern", icon: "â¬›", bg: "bg-slate-900", border: "border-slate-700", textColor: "text-white", type: "normal", label: "BLACK TILE", shape: "square", description: "Azul black mosaic tile (Azul: Summer Pavilion)." },
    { id: "sagrada-die", name: "Sagrada Glass Die", category: "pattern", icon: "ðŸŽ²", bg: "bg-teal-500", border: "border-teal-700", textColor: "text-white", type: "normal", label: "GLASS DIE", shape: "circle", description: "Colored glass die for stained window (Sagrada)." },
    { id: "patchwork-light", name: "Light Fabric Patch", category: "pattern", icon: "ðŸ§©", bg: "bg-pink-300", border: "border-pink-500", textColor: "text-slate-800", type: "normal", label: "PATCH", shape: "square", description: "Light-colored quilt fabric patch (Patchwork)." },
    { id: "patchwork-dark", name: "Dark Fabric Patch", category: "pattern", icon: "ðŸŸ«", bg: "bg-amber-800", border: "border-amber-950", textColor: "text-amber-200", type: "normal", label: "PATCH", shape: "square", description: "Dark-colored quilt fabric patch (Patchwork)." },
    { id: "qwirkle-circle", name: "Qwirkle Circle", category: "pattern", icon: "ðŸ”µ", bg: "bg-blue-400", border: "border-blue-600", textColor: "text-white", type: "normal", label: "CIRCLE", shape: "circle", description: "Circle shape tile for matching rows (Qwirkle)." },
    { id: "qwirkle-star", name: "Qwirkle Star", category: "pattern", icon: "â­", bg: "bg-yellow-500", border: "border-yellow-700", textColor: "text-white", type: "normal", label: "STAR", shape: "circle", description: "Star shape tile for matching (Qwirkle)." },
    { id: "cascadia-habitat", name: "Cascadia Habitat", category: "pattern", icon: "ðŸ¦…", bg: "bg-emerald-700", border: "border-emerald-900", textColor: "text-white", type: "bonus", label: "WILDLIFE", shape: "hexagon", description: "Pacific Northwest wildlife habitat tile (Cascadia)." },
    { id: "kingdomino-tile", name: "Kingdomino Land", category: "pattern", icon: "ðŸ‘‘", bg: "bg-amber-600", border: "border-amber-800", textColor: "text-white", type: "normal", label: "LAND TILE", shape: "square", description: "Kingdom domino land tile (Kingdomino, Queendomino)." },
    { id: "mosaic-wildcard", name: "Mosaic Wild", category: "pattern", icon: "ðŸŒˆ", bg: "bg-fuchsia-500", border: "border-fuchsia-700", textColor: "text-white", type: "bonus", label: "WILD TILE", shape: "square", description: "Wild tile matching any color or shape in pattern games." },

    // 9. COMBAT (12) â”€ Risk, Blood Rage, Twilight Struggle, Scythe
    { id: "battle-zone", name: "Battle Zone", category: "combat", icon: "âš”ï¸", bg: "bg-red-700", border: "border-red-900", textColor: "text-red-200", type: "question", label: "BATTLE ZONE", description: "Territory battle â€” roll to resolve combat (Risk).", shape: "square" },
    { id: "fortification", name: "Fortified Position", category: "combat", icon: "ðŸ°", bg: "bg-stone-700", border: "border-stone-900", textColor: "text-amber-300", type: "normal", label: "FORTIFIED", description: "Defensive fortification giving combat bonuses (Twilight Struggle).", shape: "square" },
    { id: "siege-engine", name: "Siege Engine", category: "combat", icon: "ðŸª¨", bg: "bg-gray-700", border: "border-gray-900", textColor: "text-gray-200", type: "bonus", label: "SIEGE ENGINE", description: "Deploy siege equipment to break defenses.", shape: "square" },
    { id: "cavalry-charge", name: "Cavalry Charge", category: "combat", icon: "ðŸŽ", bg: "bg-amber-700", border: "border-amber-900", textColor: "text-amber-200", type: "bonus", label: "CAVALRY!", description: "Fast cavalry attack gaining bonus movement (War of Ring).", shape: "rounded" },
    { id: "diplomacy-post", name: "Diplomacy Post", category: "combat", icon: "ðŸ•Šï¸", bg: "bg-sky-600", border: "border-sky-800", textColor: "text-white", type: "bonus", label: "DIPLOMACY", description: "Negotiate a truce or alliance (Twilight Struggle).", shape: "rounded" },
    { id: "supply-line", name: "Supply Depot", category: "combat", icon: "ðŸ“¦", bg: "bg-orange-600", border: "border-orange-800", textColor: "text-white", type: "bonus", label: "SUPPLY LINE", description: "Logistics depot providing resource bonuses (War games).", shape: "square" },
    { id: "naval-power", name: "Naval Fleet", category: "combat", icon: "â›µ", bg: "bg-blue-700", border: "border-blue-900", textColor: "text-blue-200", type: "bonus", label: "NAVAL POWER", description: "Sea-based military power and control (Memoir '44).", shape: "square" },
    { id: "viking-raid", name: "Viking Raid", category: "combat", icon: "ðŸª“", bg: "bg-red-800", border: "border-red-950", textColor: "text-red-200", type: "question", label: "RAID!", description: "Viking raiding party attacks adjacent village (Blood Rage).", shape: "square" },
    { id: "mech-unit", name: "Mech Unit", category: "combat", icon: "ðŸ¤–", bg: "bg-slate-700", border: "border-slate-900", textColor: "text-cyan-300", type: "bonus", label: "MECH UNIT", description: "Powerful mech warrior claiming territory (Scythe).", shape: "square" },
    { id: "combat-loss", name: "Defeated!", category: "combat", icon: "ðŸ’€", bg: "bg-slate-900", border: "border-red-700", textColor: "text-red-400", type: "lose-turn", label: "DEFEATED!", description: "Combat loss â€” lose troops (Risk, Blood Rage).", shape: "square" },
    { id: "territory-control", name: "Territory Control", category: "combat", icon: "ðŸš©", bg: "bg-indigo-700", border: "border-indigo-900", textColor: "text-indigo-200", type: "bonus", label: "TERRITORY!", description: "Claim this territory for your faction (Risk, Small World).", shape: "square" },
    { id: "peace-treaty", name: "Peace Treaty", category: "combat", icon: "âœï¸", bg: "bg-emerald-600", border: "border-emerald-800", textColor: "text-white", type: "bonus", label: "PEACE TREATY", description: "Signed peace â€” no attacks this round.", shape: "rounded" },

    // 10. CITY (12) â”€ Ticket to Ride, Carcassonne, Pandemic
    { id: "city-district", name: "City District", category: "city", icon: "ðŸ™ï¸", bg: "bg-blue-600", border: "border-blue-800", textColor: "text-white", type: "normal", label: "CITY DISTRICT", description: "Urban city district node (Carcassonne, Pandemic).", shape: "square" },
    { id: "transit-station", name: "Transit Station", category: "city", icon: "ðŸš‰", bg: "bg-orange-500", border: "border-orange-700", textColor: "text-white", type: "teleport", label: "TRANSIT HUB", description: "Fast travel hub connecting distant nodes (Ticket to Ride).", shape: "rounded" },
    { id: "landmark", name: "Famous Landmark", category: "city", icon: "ðŸ—½", bg: "bg-amber-500", border: "border-amber-700", textColor: "text-slate-900", type: "bonus", label: "LANDMARK", description: "Score points visiting iconic landmarks (Tokaido).", shape: "rounded" },
    { id: "hospital", name: "Hospital", category: "city", icon: "ðŸ¥", bg: "bg-red-400", border: "border-red-600", textColor: "text-white", type: "bonus", label: "HOSPITAL", description: "Healing zone / treat infection (Pandemic).", shape: "square" },
    { id: "airport", name: "Airport", category: "city", icon: "âœˆï¸", bg: "bg-sky-500", border: "border-sky-700", textColor: "text-white", type: "teleport", label: "AIRPORT", description: "Fast-travel between distant cities (Ticket to Ride).", shape: "rounded" },
    { id: "train-route", name: "Train Route", category: "city", icon: "ðŸš‚", bg: "bg-stone-600", border: "border-stone-800", textColor: "text-white", type: "normal", label: "TRAIN ROUTE", description: "Railway connection between two cities (Ticket to Ride).", shape: "square" },
    { id: "sea-route", name: "Sea Route", category: "city", icon: "ðŸš¢", bg: "bg-cyan-600", border: "border-cyan-800", textColor: "text-white", type: "normal", label: "SEA ROUTE", description: "Maritime connection lane (Catan, Archipelago).", shape: "square" },
    { id: "research-center", name: "Research Center", category: "city", icon: "ðŸ”­", bg: "bg-indigo-600", border: "border-indigo-800", textColor: "text-white", type: "bonus", label: "RESEARCH CTR", description: "Share knowledge and cure diseases (Pandemic).", shape: "square" },
    { id: "outbreak-zone", name: "Outbreak Zone", category: "city", icon: "â˜£ï¸", bg: "bg-red-900", border: "border-red-950", textColor: "text-red-300", type: "lose-turn", label: "OUTBREAK!", description: "Disease outbreak â€” spread infection (Pandemic).", shape: "square" },
    { id: "border-crossing", name: "Border Crossing", category: "city", icon: "ðŸ›ƒ", bg: "bg-slate-600", border: "border-slate-800", textColor: "text-white", type: "question", label: "BORDER CHECK", description: "Toll gate or border control â€” pay to pass.", shape: "rounded" },
    { id: "monastery", name: "Monastery", category: "city", icon: "â›ª", bg: "bg-stone-500", border: "border-stone-700", textColor: "text-white", type: "bonus", label: "MONASTERY", description: "Score when surrounded by tiles (Carcassonne).", shape: "rounded" },
    { id: "cloister", name: "Cloister Garden", category: "city", icon: "ðŸŒ¿", bg: "bg-green-600", border: "border-green-800", textColor: "text-white", type: "bonus", label: "CLOISTER", description: "Peaceful garden space scoring bonus (Carcassonne, Isle of Skye).", shape: "rounded" },

    // 11. SPECIAL (10) â”€ Dixit, Mysterium, Telestrations, Just One, Decrypto
    { id: "mystery-card", name: "Mystery Card", category: "special", icon: "ðŸŽ´", bg: "bg-purple-800", border: "border-purple-950", textColor: "text-purple-200", type: "question", label: "MYSTERY CARD", description: "Draw a surreal image and tell your story (Dixit, Mysterium).", shape: "rounded" },
    { id: "chaos-event", name: "Chaos Event", category: "special", icon: "ðŸ’¥", bg: "bg-orange-600", border: "border-orange-800", textColor: "text-white", type: "question", label: "CHAOS EVENT!", description: "Unexpected event affecting all players (Pandemic, Arkham).", shape: "rounded" },
    { id: "divine-intervention", name: "Divine Intervention", category: "special", icon: "âœ¨", bg: "bg-yellow-400", border: "border-yellow-600", textColor: "text-slate-900", type: "bonus", label: "DIVINE GRACE!", description: "Miraculous event rescues a player from certain doom.", shape: "circle" },
    { id: "time-warp", name: "Time Warp", category: "special", icon: "â³", bg: "bg-violet-700", border: "border-violet-900", textColor: "text-violet-200", type: "bonus", label: "TIME WARP!", description: "Rewind an action from any previous turn.", shape: "circle" },
    { id: "mirror-dimension", name: "Mirror Dimension", category: "special", icon: "ðŸªž", bg: "bg-slate-700", border: "border-violet-700", textColor: "text-violet-300", type: "teleport", label: "MIRROR REALM", description: "Player swaps to a mirrored version of the board layout.", shape: "circle" },
    { id: "fate-spinner", name: "Fate Spinner", category: "special", icon: "ðŸŽ¡", bg: "bg-pink-600", border: "border-pink-800", textColor: "text-white", type: "roll-again", label: "FATE!", description: "Spin fate for a completely random outcome.", shape: "circle" },
    { id: "lucky-star", name: "Lucky Star", category: "special", icon: "ðŸŒŸ", bg: "bg-yellow-500", border: "border-yellow-700", textColor: "text-slate-900", type: "bonus", label: "LUCKY STAR!", description: "Pure luck bonus â€” gain coins, cards, or extra move.", shape: "circle" },
    { id: "the-mind-sync", name: "The Mind Sync", category: "special", icon: "ðŸ§ ", bg: "bg-teal-700", border: "border-teal-900", textColor: "text-teal-200", type: "question", label: "MIND SYNC!", description: "Play cards in order without speaking (The Mind).", shape: "rounded" },
    { id: "just-one-clue", name: "Just One Clue", category: "special", icon: "ðŸ’¬", bg: "bg-blue-500", border: "border-blue-700", textColor: "text-white", type: "question", label: "JUST ONE!", description: "Each player writes one clue word â€” duplicates removed (Just One).", shape: "rounded" },
    { id: "decrypto-signal", name: "Decrypto Signal", category: "special", icon: "ðŸ“¡", bg: "bg-green-700", border: "border-green-900", textColor: "text-green-200", type: "question", label: "DECODE IT!", description: "Transmit a coded message without revealing your code (Decrypto).", shape: "rounded" },

    // 12. EDUCATIONAL (12) ── Scrabble, Bananagrams, Scattergories, Trivial Pursuit
    { id: "word-challenge", name: "Word Challenge", category: "educational", icon: "📝", bg: "bg-blue-600", border: "border-blue-800", textColor: "text-white", type: "question", label: "WORD CHALLENGE!", description: "Spell a word correctly to advance (Scrabble, Bananagrams).", shape: "rounded" },
    { id: "math-problem", name: "Math Problem", category: "educational", icon: "➕", bg: "bg-green-600", border: "border-green-800", textColor: "text-white", type: "question", label: "SOLVE IT!", description: "Solve a math problem to move forward (classroom review games).", shape: "rounded" },
    { id: "science-fact", name: "Science Fact", category: "educational", icon: "🔬", bg: "bg-cyan-600", border: "border-cyan-800", textColor: "text-white", type: "question", label: "SCIENCE FACT!", description: "Answer a science question (classroom trivia games).", shape: "rounded" },
    { id: "history-event", name: "History Event", category: "educational", icon: "📜", bg: "bg-amber-700", border: "border-amber-900", textColor: "text-amber-200", type: "question", label: "HISTORY!", description: "Identify a historical event (Trivial Pursuit).", shape: "rounded" },
    { id: "geography-quiz", name: "Geography Quiz", category: "educational", icon: "🌍", bg: "bg-blue-500", border: "border-blue-700", textColor: "text-white", type: "question", label: "GEO QUIZ!", description: "Name a country, capital, or landmark (Trivial Pursuit).", shape: "rounded" },
    { id: "spelling-bee", name: "Spelling Bee", category: "educational", icon: "🐝", bg: "bg-yellow-500", border: "border-yellow-700", textColor: "text-slate-900", type: "question", label: "SPELL IT!", description: "Correctly spell the given word aloud (Scrabble, Spelling Bee).", shape: "rounded" },
    { id: "logic-puzzle", name: "Logic Puzzle", category: "educational", icon: "🧩", bg: "bg-indigo-600", border: "border-indigo-800", textColor: "text-white", type: "question", label: "LOGIC PUZZLE!", description: "Solve a pattern or logic sequence to advance.", shape: "rounded" },
    { id: "scrabble-tile", name: "Scrabble Letter Tile", category: "educational", icon: "🔠", bg: "bg-amber-100", border: "border-amber-300", textColor: "text-slate-900", type: "normal", label: "LETTER TILE", shape: "square", description: "Place a letter tile to build words (Scrabble)." },
    { id: "double-word-score", name: "Double Word Score", category: "educational", icon: "✌️", bg: "bg-pink-500", border: "border-pink-700", textColor: "text-white", type: "bonus", label: "DOUBLE WORD!", shape: "square", description: "Doubles the score of a word placed here (Scrabble)." },
    { id: "triple-letter-score", name: "Triple Letter Score", category: "educational", icon: "✖️", bg: "bg-blue-600", border: "border-blue-800", textColor: "text-white", type: "bonus", label: "TRIPLE LETTER!", shape: "square", description: "Triples the score of one letter placed here (Scrabble)." },
    { id: "category-sprint", name: "Category Sprint", category: "educational", icon: "📁", bg: "bg-purple-600", border: "border-purple-800", textColor: "text-white", type: "question", label: "CATEGORY SPRINT!", description: "Name 5 items in a category before time runs out (Scattergories).", shape: "rounded" },
    { id: "art-challenge", name: "Art Challenge", category: "educational", icon: "🎨", bg: "bg-rose-500", border: "border-rose-700", textColor: "text-white", type: "question", label: "CREATE ART!", description: "Draw or create something to share (Dixit, Pictionary, Telestrations).", shape: "rounded" },

    // 13. EXPANDED GAMES (22)
    { id: "card-grid", name: "Sequence Card Grid", category: "special", icon: "🃏", bg: "bg-blue-700", border: "border-blue-800", textColor: "text-white", type: "card_grid", label: "SEQUENCE", description: "Card placement grid for matching sequences (Sequence).", shape: "rounded" },
    { id: "number-tile", name: "Number Tile Rack", category: "pattern", icon: "🔢", bg: "bg-yellow-100", border: "border-amber-300", textColor: "text-amber-950", type: "number_tile", label: "TILE", description: "Numbered tile for set-making and runs (Rummikub).", shape: "square" },
    { id: "score-track", name: "Multi-Color Score Track", category: "pattern", icon: "🌈", bg: "bg-purple-600", border: "border-purple-800", textColor: "text-white", type: "score_track", label: "SCORE TRACK", description: "Scoring track for multi-color achievements (Ingenious).", shape: "rounded" },
    { id: "spice-convert", name: "Spice Cube Converter", category: "resource", icon: "🧂", bg: "bg-amber-500", border: "border-amber-600", textColor: "text-white", type: "spice_convert", label: "CONVERT", description: "Resource conversion engine tile (Century: Spice Road).", shape: "rounded" },
    { id: "landscape-auction", name: "Landscape Auction Tile", category: "resource", icon: "🏞️", bg: "bg-emerald-500", border: "border-emerald-600", textColor: "text-white", type: "landscape_auction", label: "AUCTION", description: "Auctionable landscape tile for scoring (Isle of Skye).", shape: "rounded" },
    { id: "spaceship-corridor", name: "Spaceship Corridor", category: "dungeon", icon: "🛸", bg: "bg-indigo-900", border: "border-indigo-950", textColor: "text-indigo-200", type: "spaceship_corridor", label: "CORRIDOR", description: "Sci-fi spaceship corridor tile (Clank! In! Space!).", shape: "rounded" },
    { id: "jungle-machete", name: "Jungle Machete Path", category: "dungeon", icon: "🗡️", bg: "bg-green-700", border: "border-green-800", textColor: "text-green-200", type: "jungle_machete", label: "MACHETE", description: "Dense jungle path requiring exploration (Quest for El Dorado).", shape: "rounded" },
    { id: "infantry-bunker", name: "Infantry Bunker", category: "combat", icon: "🎖️", bg: "bg-gray-600", border: "border-gray-700", textColor: "text-gray-200", type: "infantry_bunker", label: "BUNKER", description: "Military bunker with infantry unit defense (Memoir '44).", shape: "rounded" },
    { id: "pavilion-star", name: "Summer Pavilion Star", category: "pattern", icon: "✨", bg: "bg-amber-500", border: "border-amber-600", textColor: "text-amber-950", type: "pavilion_star", label: "STAR TILE", description: "Radial star tile for bonus scoring (Azul: Summer Pavilion).", shape: "rounded" },
    { id: "rail-route", name: "Rail Route Drawing", category: "city", icon: "🚃", bg: "bg-stone-500", border: "border-stone-600", textColor: "text-amber-100", type: "rail_route", label: "RAIL ROUTE", description: "Draw rail route connections on the grid (Railroad Ink).", shape: "rounded" },
    { id: "house-number", name: "Street House Number", category: "city", icon: "🏘️", bg: "bg-blue-200", border: "border-blue-400", textColor: "text-blue-900", type: "house_number", label: "HOUSE", description: "Residential street with house numbering (Welcome To...).", shape: "rounded" },
    { id: "cartography", name: "Cartography Terrain", category: "grid-hex", icon: "🗺️", bg: "bg-emerald-600", border: "border-emerald-800", textColor: "text-white", type: "cartography", label: "MAP", description: "Map terrain tile for scoring regions (Cartographers).", shape: "hexagon" },
    { id: "ecosystem", name: "Nature Ecosystem", category: "pattern", icon: "🌿", bg: "bg-emerald-500", border: "border-emerald-600", textColor: "text-emerald-100", type: "ecosystem", label: "ECOSYSTEM", description: "Nature pattern ecosystem harmony tile (Harmonies).", shape: "rounded" },
    { id: "alien-encounter", name: "Alien Encounter", category: "combat", icon: "👽", bg: "bg-slate-900", border: "border-red-900", textColor: "text-red-300", type: "alien_encounter", label: "ALIEN!", description: "Hostile alien encounter in ship corridors (Nemesis).", shape: "rounded" },
    { id: "hull-breach", name: "Hull Breach", category: "combat", icon: "💥", bg: "bg-stone-900", border: "border-red-600", textColor: "text-red-200", type: "hull_breach", label: "HULL BREACH", description: "Damaged ship hull section requiring repair (Nemesis).", shape: "rounded" },
    { id: "mission-comms", name: "Mission Comms", category: "quest", icon: "📡", bg: "bg-blue-800", border: "border-blue-900", textColor: "text-blue-200", type: "mission_comms", label: "MISSION", description: "Restricted communication mission card (The Crew).", shape: "rounded" },
    { id: "galactic-council", name: "Galactic Council", category: "combat", icon: "🏛️", bg: "bg-indigo-700", border: "border-indigo-900", textColor: "text-indigo-200", type: "galactic_council", label: "COUNCIL", description: "Political council voting and agenda space (Twilight Imperium).", shape: "rounded" },
    { id: "fellowship-path", name: "Fellowship Path", category: "quest", icon: "💍", bg: "bg-amber-800", border: "border-amber-950", textColor: "text-amber-100", type: "fellowship_path", label: "FELLOWSHIP", description: "Ring bearer fellowship journey path (War of the Ring).", shape: "rounded" },
    { id: "hero-ability", name: "Hero Ability Card", category: "dungeon", icon: "⚔️", bg: "bg-purple-600", border: "border-purple-800", textColor: "text-purple-200", type: "hero_ability", label: "HERO CARD", description: "Hero character ability and equipment tile (Descent).", shape: "rounded" },
    { id: "zoo-exhibit", name: "Zoo Exhibit", category: "resource", icon: "🦁", bg: "bg-emerald-600", border: "border-emerald-700", textColor: "text-emerald-100", type: "zoo_exhibit", label: "ZOO EXHIBIT", description: "Zoo exhibit enclosure for animal display (Ark Nova).", shape: "rounded" },
    { id: "animal-habitat", name: "Animal Habitat Hex", category: "grid-hex", icon: "🐘", bg: "bg-green-700", border: "border-green-900", textColor: "text-white", type: "animal_habitat", label: "HABITAT", description: "Hexagonal animal habitat conservation zone (Ark Nova).", shape: "hexagon" },
    { id: "ring-trail", name: "Ring Bearer Trail", category: "quest", icon: "🗻", bg: "bg-stone-800", border: "border-stone-900", textColor: "text-amber-100", type: "ring_trail", label: "DOOM TRAIL", description: "Perilous mountain trail to Mount Doom (War of the Ring).", shape: "rounded" },
    { id: "letter-space", name: "Lettered Space Tile", category: "basic", icon: "🔤", bg: "bg-yellow-50", border: "border-amber-300", textColor: "text-amber-900", type: "letter_space", label: "LETTER", description: "Alphabet letter tile for spelling and literacy (Scrabble, Word games).", shape: "square" },
    { id: "reverse-order", name: "Reverse Turn Order", category: "movement", icon: "🔄", bg: "bg-orange-500", border: "border-orange-600", textColor: "text-white", type: "reverse_order", label: "REVERSE", description: "Reverses direction of turn play order for all players.", shape: "rounded" },
    { id: "double-turn", name: "Double Turn Space", category: "movement", icon: "⏩", bg: "bg-emerald-500", border: "border-emerald-600", textColor: "text-white", type: "double_turn", label: "DOUBLE PLAY", description: "Gives active player two turns on their next go.", shape: "rounded" },
    { id: "odd-bonus", name: "Odd Roll Bonus", category: "action", icon: "⚖️", bg: "bg-teal-500", border: "border-teal-600", textColor: "text-white", type: "odd_bonus", label: "ODD BONUS", description: "Get bonus if rolling an odd number.", shape: "rounded" },
    { id: "team-challenge", name: "Team Challenge Space", category: "action", icon: "👥", bg: "bg-indigo-600", border: "border-indigo-700", textColor: "text-white", type: "team_challenge", label: "TEAM QUEST", description: "Cooperative group challenge involving the entire team.", shape: "rounded" },
    { id: "synonym-antonym", name: "Synonym & Antonym Space", category: "educational", icon: "✍️", bg: "bg-blue-600", border: "border-blue-700", textColor: "text-white", type: "synonym_antonym", label: "SYN / ANT", description: "Provide a synonym and antonym for the target word.", shape: "rounded" },
    { id: "fraction-problem", name: "Fraction Problem Space", category: "educational", icon: "🍕", bg: "bg-sky-500", border: "border-sky-600", textColor: "text-white", type: "fraction_problem", label: "FRACTIONS", description: "Solve a fraction or division puzzle to proceed.", shape: "rounded" },
    { id: "extra-life", name: "Extra Life / Shield Space", category: "resource", icon: "🛡️", bg: "bg-rose-500", border: "border-rose-600", textColor: "text-white", type: "extra_life", label: "GET SHIELD", description: "Earn an extra life or immunity shield protection.", shape: "rounded" },
];

// â”€â”€â”€ 25 BOARD LAYOUT TEMPLATE GENERATORS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const BOARD_TEMPLATE_GENERATORS: TemplateGeneratorSpec[] = [
    // Linear & Race
    { id: "tpl-linear-race", name: "Linear Race Track ðŸŽï¸", layout: "race-track", icon: "ðŸŽï¸", badge: "Family Race", description: "Classic perimeter oval race track â€” Candy Land, Speedways.", gameInspiration: "Candy Land, Chutes & Ladders, Sorry!", gradient: "from-pink-500 to-purple-600", totalSpaces: 28, cellShape: "rounded" },
    { id: "tpl-snake-path", name: "Snake Serpentine Trail ðŸ", layout: "snake", icon: "ðŸ", badge: "Serpentine", description: "Multi-row winding serpentine track with hazard traps and shortcuts.", gameInspiration: "Snakes and Ladders, Goose Game, Sorry!", gradient: "from-emerald-500 to-teal-700", totalSpaces: 32, cellShape: "rounded" },
    { id: "tpl-spiral-path", name: "Inward Spiral Path ðŸŒ€", layout: "spiral", icon: "ðŸŒ€", badge: "Spiral Journey", description: "Concentric outward-to-center spiral path leading to a central victory zone.", gameInspiration: "Labyrinth, Game of Life, Snakes and Ladders", gradient: "from-violet-500 to-purple-700", totalSpaces: 30, cellShape: "circle" },
    { id: "tpl-circular-track", name: "Circular Lap Track ðŸ”„", layout: "circle", icon: "ðŸ”„", badge: "Lap Race", description: "Continuous circular perimeter racing track where players lap the board.", gameInspiration: "Monopoly, Sequence, Trouble, Aggravation", gradient: "from-amber-500 to-orange-600", totalSpaces: 24, cellShape: "rounded" },
    { id: "tpl-figure-eight", name: "Figure-Eight Course â™¾ï¸", layout: "figure-eight", icon: "â™¾ï¸", badge: "Figure-Eight", description: "Dual-loop figure-eight track with a dangerous center crossover intersection.", gameInspiration: "Racing games, Camel Up, Tsuro", gradient: "from-red-500 to-pink-600", totalSpaces: 32, cellShape: "rounded" },
    { id: "tpl-road-trip", name: "Road Trip Adventure ðŸš—", layout: "linear", icon: "ðŸš—", badge: "Road Trip", description: "Linear road trip path through cities, rest stops, and scenic landmarks.", gameInspiration: "Game of Life, Ticket to Ride, Tokaido", gradient: "from-sky-400 to-blue-600", totalSpaces: 30, cellShape: "rounded" },
    // Grid & Hex
    { id: "tpl-hex-grid", name: "Catan Hexagon Empire ðŸ”·", layout: "hexagon-grid", icon: "ðŸ”·", badge: "Strategy Hex", description: "Interlocking hexagonal resource grid for empire building and tile placement.", gameInspiration: "Catan, Eclipse, Cascadia, Terraforming Mars", gradient: "from-amber-500 to-orange-600", totalSpaces: 24, cellShape: "hexagon" },
    { id: "tpl-square-grid", name: "Square Grid Board â¬›", layout: "zigzag", icon: "â¬›", badge: "Grid Board", description: "Classic square grid for Chess, Checkers, Blokus, Qwirkle, and pattern games.", gameInspiration: "Chess, Checkers, Blokus, Santorini, Hive, Qwirkle", gradient: "from-slate-600 to-slate-900", totalSpaces: 64, cellShape: "square" },
    // Adventure & Exploration
    { id: "tpl-dungeon-crawl", name: "Dungeon Crawl Modular ðŸ°", layout: "dungeon-crawl", icon: "ðŸ°", badge: "Co-op Dungeon", description: "Branching room chambers with corridors, locked gates, and a boss lair.", gameInspiration: "Gloomhaven, HeroQuest, Clank!, Mice & Mystics", gradient: "from-slate-700 to-zinc-900", totalSpaces: 26, cellShape: "square" },
    { id: "tpl-treasure-island", name: "Treasure Island Map ðŸ´â€â˜ ï¸", layout: "treasure-map", icon: "ðŸ´â€â˜ ï¸", badge: "Adventure Map", description: "Winding coastal trail through sea caves, reefs, and gold treasure chests.", gameInspiration: "Forbidden Island, Lost Cities, Pirates", gradient: "from-cyan-500 to-blue-700", totalSpaces: 30, cellShape: "circle" },
    { id: "tpl-island-exploration", name: "Island Exploration ðŸï¸", layout: "island-map", icon: "ðŸï¸", badge: "Island Quest", description: "Multi-island exploration map where players chart unknown territories.", gameInspiration: "Forbidden Island, Forbidden Desert, Cascadia", gradient: "from-teal-500 to-emerald-700", totalSpaces: 28, cellShape: "rounded" },
    { id: "tpl-castle-quest", name: "Castle Quest & Siege ðŸ¯", layout: "castle-quest", icon: "ðŸ¯", badge: "Castle Siege", description: "Castle walls, towers, drawbridge, and inner keep surrounding a royal throne room.", gameInspiration: "HeroQuest, Descent, Mice & Mystics, Lords of Waterdeep", gradient: "from-stone-500 to-slate-800", totalSpaces: 30, cellShape: "square" },
    { id: "tpl-jungle-trail", name: "Jungle Trail Expedition ðŸŒ¿", layout: "farm-trail", icon: "ðŸŒ¿", badge: "Jungle Trek", description: "Dense jungle expedition with bridges, rivers, hidden temples, and danger zones.", gameInspiration: "Clue, Robinson Crusoe, Takenoko", gradient: "from-green-600 to-emerald-900", totalSpaces: 28, cellShape: "rounded" },
    { id: "tpl-mountain-climb", name: "Mountain Peak Climb ðŸ”ï¸", layout: "mountain-climb", icon: "ðŸ”ï¸", badge: "Summit Climb", description: "Base camp to snowy peak elevation steps with weather hazard zones.", gameInspiration: "Everest, Pandemic, Mountain Trail Games", gradient: "from-stone-500 to-slate-800", totalSpaces: 25, cellShape: "rounded" },
    { id: "tpl-river-journey", name: "River Expedition ðŸš£", layout: "river-journey", icon: "ðŸš£", badge: "Water Rapids", description: "Flowing water rapids with dock stops, fishing spots, and bridges.", gameInspiration: "Century, Takenoko, Robinson Crusoe", gradient: "from-sky-400 to-cyan-600", totalSpaces: 26, cellShape: "rounded" },
    // City & Map Boards
    { id: "tpl-city-map", name: "City Map Network ðŸ™ï¸", layout: "city-grid", icon: "ðŸ™ï¸", badge: "City Network", description: "Urban city grid of districts, transit hubs, hospitals, and research centers.", gameInspiration: "Pandemic, Ticket to Ride, Carcassonne", gradient: "from-blue-600 to-indigo-800", totalSpaces: 30, cellShape: "square" },
    { id: "tpl-farm-path", name: "Farm Trail Adventure ðŸŒ¾", layout: "farm-trail", icon: "ðŸŒ¾", badge: "Farm Journey", description: "Peaceful farm trail through fields, barns, orchards, and harvest festivals.", gameInspiration: "Agricola, Stone Age, Tokaido, Everdell", gradient: "from-yellow-500 to-green-700", totalSpaces: 24, cellShape: "rounded" },
    // Strategy & Decision
    { id: "tpl-branching-path", name: "Choice Branching Trail ðŸ”€", layout: "branching-adventure", icon: "ðŸ”€", badge: "Decision Tree", description: "Multi-route adventure with high-risk shortcuts and decision hubs.", gameInspiration: "Game of Life, Clank!, Labyrinth, Choice Games", gradient: "from-indigo-500 to-violet-700", totalSpaces: 28, cellShape: "rounded" },
    { id: "tpl-maze-grid", name: "Maze Labyrinth Board ðŸ§©", layout: "maze-grid", icon: "ðŸ§©", badge: "Maze Puzzle", description: "Complex maze grid where players navigate shifting corridors and secret passages.", gameInspiration: "Labyrinth, Tsuro, Clue, Magic Maze", gradient: "from-purple-600 to-violet-900", totalSpaces: 30, cellShape: "square" },
    { id: "tpl-decision-tree", name: "Story Decision Tree ðŸ“–", layout: "story-tree", icon: "ðŸ“–", badge: "Story Branches", description: "Narrative decision tree where each choice branches to different story outcomes.", gameInspiration: "Choose Your Own Adventure, Betrayal at House, Clank!", gradient: "from-rose-500 to-red-700", totalSpaces: 24, cellShape: "rounded" },
    // Special & Educational
    { id: "tpl-space-mission", name: "Space Station Mission ðŸš€", layout: "space-mission", icon: "ðŸš€", badge: "Sci-Fi Galaxy", description: "Galactic warp gates, asteroid fields, and cosmic space station nodes.", gameInspiration: "Terraforming Mars, Clank! In! Space!, Eclipse", gradient: "from-blue-600 to-indigo-900", totalSpaces: 30, cellShape: "circle" },
    { id: "tpl-tournament-tree", name: "Tournament Bracket ðŸ†", layout: "tournament-bracket", icon: "ðŸ†", badge: "Championship", description: "Multi-round knockout championship tree for 8 or 16 player matches.", gameInspiration: "Tournament Brackets, Sports Leagues, Camel Up", gradient: "from-yellow-400 to-amber-600", totalSpaces: 15, cellShape: "square" },
    { id: "tpl-timeline-board", name: "History Timeline Board ðŸ“…", layout: "linear", icon: "ðŸ“…", badge: "Timeline", description: "Linear historical timeline with event markers, era checkpoints, and bonus trivia spaces.", gameInspiration: "Trivial Pursuit, Timeline Card Game, Educational Games", gradient: "from-amber-600 to-orange-800", totalSpaces: 28, cellShape: "rounded" },
    { id: "tpl-classroom-review", name: "Classroom Review Track ðŸŽ“", layout: "classroom-review", icon: "ðŸŽ“", badge: "Educational", description: "Teacher-friendly review game track with trivia zones, skip tiles, and reward stars.", gameInspiration: "Jeopardy, Quiz Bowl, Scrabble, Educational Board Games", gradient: "from-green-500 to-teal-700", totalSpaces: 24, cellShape: "rounded" },
    { id: "tpl-story-path", name: "Storybook Adventure Path ðŸ“š", layout: "story-tree", icon: "ðŸ“š", badge: "Storybook", description: "Illustrated narrative story path where players collect chapters of a collaborative tale.", gameInspiration: "Dixit, Telestrations, Once Upon a Time, Everdell", gradient: "from-pink-500 to-rose-700", totalSpaces: 24, cellShape: "rounded" },
];

// â”€â”€â”€ Category Metadata â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CATEGORY_META: Record<SpaceCategory, { label: string }> = {
    basic:       { label: "Basic" },
    movement:    { label: "Movement" },
    "grid-hex":  { label: "Grid/Hex" },
    dungeon:     { label: "Dungeon" },
    resource:    { label: "Resource" },
    quest:       { label: "Quest" },
    action:      { label: "Action" },
    pattern:     { label: "Pattern" },
    combat:      { label: "Combat" },
    city:        { label: "City" },
    special:     { label: "Special" },
    educational: { label: "School" },
};

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const WorksheetBoardGameDrawer: React.FC<WorksheetBoardGameDrawerProps> = ({
    isOpen,
    onClose,
    fabricCanvasRef,
    onApplyTemplateConfig,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<SpaceCategory | "all" | "templates">("all");

    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        SPACE_COMPONENT_LIBRARY.forEach((s) => { counts[s.category] = (counts[s.category] ?? 0) + 1; });
        return counts;
    }, []);

    const filteredComponents = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return SPACE_COMPONENT_LIBRARY.filter((item) => {
            const match = !q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.label.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
            const cat = activeTab === "all" || activeTab === item.category;
            return match && cat;
        });
    }, [searchQuery, activeTab]);

    const filteredTemplates = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return BOARD_TEMPLATE_GENERATORS.filter((tpl) =>
            !q || tpl.name.toLowerCase().includes(q) || tpl.description.toLowerCase().includes(q) || tpl.gameInspiration.toLowerCase().includes(q)
        );
    }, [searchQuery]);

    // Add component to canvas
    const handleAddComponentToCanvas = (spec: SpaceComponentSpec) => {
        const c = fabricCanvasRef.current;
        if (!c) { toast.error("Canvas is not ready!"); return; }

        const size = spec.shape === "hexagon" ? 64 : 56;
        const cx = (c.getWidth() / 2 - 80) + Math.random() * 60;
        const cy = (c.getHeight() / 2 - 60) + Math.random() * 60;
        const fillColor = twToHex(spec.bg);

        let baseShape: fabric.FabricObject;
        if (spec.shape === "hexagon") {
            const r = size / 2;
            const pts = Array.from({ length: 6 }, (_, i) => {
                const a = (i * Math.PI) / 3 - Math.PI / 6;
                return { x: r * Math.cos(a), y: r * Math.sin(a) };
            });
            baseShape = new fabric.Polygon(pts, { fill: fillColor, stroke: "#0f172a", strokeWidth: 2.5 });
        } else if (spec.shape === "circle") {
            baseShape = new fabric.Circle({ radius: size / 2, fill: fillColor, stroke: "#0f172a", strokeWidth: 2.5 });
        } else if (spec.shape === "diamond") {
            const h = size / 2;
            baseShape = new fabric.Polygon(
                [{ x: 0, y: -h }, { x: h, y: 0 }, { x: 0, y: h }, { x: -h, y: 0 }],
                { fill: fillColor, stroke: "#0f172a", strokeWidth: 2.5 }
            );
        } else {
            baseShape = new fabric.Rect({
                width: size, height: size,
                rx: spec.shape === "square" ? 4 : 12,
                ry: spec.shape === "square" ? 4 : 12,
                fill: fillColor, stroke: "#0f172a", strokeWidth: 2.5,
            });
        }

        const iconObj = new fabric.IText(spec.icon, {
            fontSize: 20, originX: "center", originY: "center",
            left: 0, top: spec.label ? -7 : 0, selectable: false,
        });

        const objects: fabric.FabricObject[] = [baseShape, iconObj];

        if (spec.label) {
            const labelObj = new fabric.IText(spec.label, {
                fontSize: 7.5, fontFamily: "Inter, sans-serif", fontWeight: "bold",
                fill: "#ffffff", originX: "center", originY: "center",
                left: 0, top: 15, selectable: false,
            });
            objects.push(labelObj);
        }

        const group = new fabric.Group(objects, {
            left: cx, top: cy,
            subTargetCheck: true,
            interactive: true,
        });

        (group as any).id = `comp-${spec.id}-${Date.now()}`;
        (group as any).customType = "board-game-space";
        (group as any).spaceType = spec.type;

        c.add(group);
        c.setActiveObject(group);
        c.requestRenderAll();
        c.fire("object:modified");
        toast.success(`Added ${spec.name}!`, { duration: 1500 });
    };

    // Generate board template
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
            group.set({ left: 80, top: 100 });
            c.add(group);
            c.setActiveObject(group);
            c.requestRenderAll();
            c.fire("object:modified");
            toast.success(`Generated ${tpl.name} board!`);
        }
        onClose();
    };

    if (!isOpen) return null;

    const showTemplates = activeTab === "all" || activeTab === "templates";
    const showComponents = activeTab !== "templates";

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="flex-1" onClick={onClose} />

            <div className="w-[580px] max-w-full bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="h-16 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
                            <LayoutGrid className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                Board Game Component Library
                                <span className="text-[9px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                                    {SPACE_COMPONENT_LIBRARY.length} components Â· {BOARD_TEMPLATE_GENERATORS.length} templates
                                </span>
                            </h2>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Inspired by 100 top board games â€” click to add to canvas.
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search: Catan hex, Pandemic, Chess, Portal, Triviaâ€¦"
                            className="pl-9 pr-8 text-xs h-9 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl"
                        />
                        {searchQuery && (
                            <button className="absolute right-2 top-2 text-slate-400 hover:text-slate-600" onClick={() => setSearchQuery("")}>
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Tabs â€” horizontally scrollable */}
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 shrink-0 overflow-x-auto scrollbar-none">
                    <div className="flex gap-1 min-w-max">
                        <button onClick={() => setActiveTab("all")} className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${activeTab === "all" ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                            All ({SPACE_COMPONENT_LIBRARY.length})
                        </button>
                        <button onClick={() => setActiveTab("templates")} className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${activeTab === "templates" ? "bg-indigo-600 text-white" : "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"}`}>
                            ðŸ—ºï¸ Templates ({BOARD_TEMPLATE_GENERATORS.length})
                        </button>
                        {(Object.keys(CATEGORY_META) as SpaceCategory[]).map((cat) => (
                            <button key={cat} onClick={() => setActiveTab(cat)} className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${activeTab === cat ? "bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                                {CATEGORY_META[cat].label} ({categoryCounts[cat] ?? 0})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">

                    {/* Templates Section */}
                    {showTemplates && (
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                                <Wand2 className="w-3.5 h-3.5" />
                                1-Click Board Templates â€” {filteredTemplates.length} layouts
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                                {filteredTemplates.map((tpl) => (
                                    <div key={tpl.id} className="group p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-indigo-400 hover:shadow-lg transition-all duration-200 flex flex-col">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="text-2xl p-1.5 rounded-xl bg-slate-50 dark:bg-slate-900">{tpl.icon}</div>
                                            <span className={`text-[9px] font-bold bg-gradient-to-r ${tpl.gradient} text-white px-1.5 py-0.5 rounded-full`}>{tpl.badge}</span>
                                        </div>
                                        <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors mb-1">{tpl.name}</h3>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 flex-1 mb-2">{tpl.description}</p>
                                        <p className="text-[9px] text-indigo-600 dark:text-indigo-400 font-medium mb-2.5">ðŸ’¡ {tpl.gameInspiration}</p>
                                        <button className="w-full h-7 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center gap-1.5 transition-colors" onClick={() => handleGenerateTemplate(tpl)}>
                                            <Wand2 className="w-3 h-3" /> Generate Board
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Components Section */}
                    {showComponents && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                    <Boxes className="w-3.5 h-3.5 text-emerald-500" />
                                    {activeTab === "all" ? "All Components" : `${CATEGORY_META[activeTab as SpaceCategory]?.label ?? ""} Components`}
                                </Label>
                                <span className="text-[10px] text-slate-400 font-mono">{filteredComponents.length} items</span>
                            </div>

                            {filteredComponents.length === 0 && (
                                <div className="py-12 text-center text-slate-400">
                                    <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm font-medium">No components found</p>
                                    <p className="text-xs mt-1">Try a different search term</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2.5">
                                {filteredComponents.map((spec) => (
                                    <div key={spec.id} className="group p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md transition-all flex flex-col">
                                        <div className="flex items-start gap-2.5 mb-2">
                                            <div className={`w-10 h-10 shrink-0 ${spec.shape === "circle" ? "rounded-full" : spec.shape === "hexagon" ? "rounded-xl" : "rounded-lg"} ${spec.bg} flex items-center justify-center text-xl shadow-sm border-2 ${spec.border}`}>
                                                {spec.icon}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 truncate leading-tight">{spec.name}</h4>
                                                <span className="text-[9px] font-semibold text-slate-400">{CATEGORY_META[spec.category]?.label}</span>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{spec.description}</p>
                                            </div>
                                        </div>
                                        {spec.label && (
                                            <div className={`self-start mb-2 px-1.5 py-0.5 rounded text-[9px] font-bold ${spec.bg} ${spec.textColor} opacity-90`}>
                                                {spec.label}
                                            </div>
                                        )}
                                        <button
                                            className="w-full h-7 text-[10px] font-bold border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:border-indigo-300 text-slate-600 dark:text-slate-400 hover:text-indigo-600 rounded-lg flex items-center justify-center gap-1 transition-all mt-auto"
                                            onClick={() => handleAddComponentToCanvas(spec)}
                                        >
                                            <Plus className="w-3 h-3" /> Add to Canvas
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 shrink-0">
                    <p className="text-[10px] text-slate-400 text-center">
                        {SPACE_COMPONENT_LIBRARY.length} components Â· 12 categories Â· {BOARD_TEMPLATE_GENERATORS.length} board templates Â· Top 100 board games inspired
                    </p>
                </div>
            </div>
        </div>
    );
};

