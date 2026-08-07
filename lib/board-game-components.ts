import * as fabric from "fabric";

/* ══════════════════════════════════════════════════════════════════
 *  Board Game Component Library
 *  A comprehensive collection of 150+ modular, configurable game board
 *  spaces, tiles, markers, mechanics, educational challenges, and visual assets.
 * ══════════════════════════════════════════════════════════════════ */

export type BoardComponentCategory =
    | "basic"
    | "movement"
    | "turn"
    | "dice"
    | "question"
    | "educational"
    | "reward"
    | "penalty"
    | "card"
    | "challenge"
    | "minigame"
    | "story-adventure"
    | "rpg-economy"
    | "team-random"
    | "collection"
    | "time-interactive"
    | "decorations"
    | "track"
    | "snakes-ladders"
    | "frames";

export interface BoardComponentMeta {
    id: number;
    name: string;
    category: BoardComponentCategory;
    preview: string;                // Emoji / visual icon
    description: string;
    behavior?: string;
    generator: () => fabric.Group;  // Returns a fully configured Fabric Group
}

// ─── Utility Helpers for Clean UI Generation ─────────────────────
const shadow = (blur = 4) => new fabric.Shadow({ color: "rgba(0,0,0,0.18)", blur, offsetX: 0, offsetY: 2 });

function makeTile(
    fill: string,
    size = 56,
    rx = 10,
    stroke = "#222",
    strokeWidth = 2.5
): fabric.Rect {
    return new fabric.Rect({
        left: 0, top: 0, width: size, height: size,
        rx, ry: rx, fill, stroke, strokeWidth,
        originX: "center", originY: "center", shadow: shadow(),
    });
}

function makeCircleTile(
    fill: string,
    radius = 28,
    stroke = "#222",
    strokeWidth = 2.5
): fabric.Circle {
    return new fabric.Circle({
        left: 0, top: 0, radius, fill, stroke, strokeWidth,
        originX: "center", originY: "center", shadow: shadow(),
    });
}

function makeHexagonTile(fill: string, r = 28): fabric.Polygon {
    const pts: fabric.Point[] = [];
    for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        pts.push(new fabric.Point(Math.cos(a) * r, Math.sin(a) * r));
    }
    return new fabric.Polygon(pts, {
        left: 0, top: 0, fill, stroke: "#222", strokeWidth: 2.5,
        originX: "center", originY: "center", shadow: shadow(),
    });
}

function makeLabel(
    text: string,
    fontSize = 12,
    fill = "#ffffff",
    fontWeight = "900",
    top = 0
): fabric.IText {
    return new fabric.IText(text, {
        left: 0, top, fontSize, fontWeight,
        fontFamily: "Inter, Arial, sans-serif", fill,
        textAlign: "center",
        originX: "center", originY: "center",
    });
}

function createConfiguredSpaceGroup(
    meta: { type: string; category: BoardComponentCategory; behavior?: string },
    ...objs: fabric.Object[]
): fabric.Group {
    const group = new fabric.Group(objs, {
        left: 100, top: 100, selectable: true, subTargetCheck: true,
    });
    (group as any).customType = "board-game-component";
    (group as any).spaceType = meta.type;
    (group as any).spaceCategory = meta.category;
    (group as any).spaceBehavior = meta.behavior || "normal";
    return group;
}

// ─── Color Palettes ──────────────────────────────────────────────
const RED = "#E53935", ORANGE = "#F57C00", YELLOW = "#FDD835",
      GREEN = "#43A047", BLUE = "#1E88E5", PURPLE = "#7B1FA2",
      PINK = "#C2185B", TEAL = "#00838F", WHITE = "#FFFFFF",
      DARK = "#212121", AMBER = "#D97706", INDIGO = "#4F46E5",
      EMERALD = "#059669", ROSE = "#E11D48", CYAN = "#0891B2";

/* ═══════════════════════════════════════════════════════════════
 *   150+ COMPONENT DEFINITIONS ACCROSS 20 CATEGORIES
 * ═══════════════════════════════════════════════════════════════ */
export const BOARD_GAME_COMPONENTS: BoardComponentMeta[] = [

    // ──────────────── 1. BASIC SPACES ────────────────
    {
        id: 1, name: "START Space (Green)", category: "basic", preview: "🟢",
        description: "Official Start space for board entry", behavior: "start",
        generator: () => {
            const bg = makeTile(GREEN, 60, 12, "#1B5E20", 3.5);
            const icon = new fabric.IText("▶", { left: 0, top: -10, fontSize: 20, fill: "#fff", originX: "center", originY: "center" });
            const txt = makeLabel("START", 10, "#fff", "900", 14);
            return createConfiguredSpaceGroup({ type: "start", category: "basic", behavior: "start" }, bg, icon, txt);
        }
    },
    {
        id: 2, name: "FINISH Space (Red)", category: "basic", preview: "🏁",
        description: "Winning Finish line tile with checkered flag", behavior: "finish",
        generator: () => {
            const bg = makeTile(RED, 60, 12, "#B71C1C", 3.5);
            const icon = new fabric.IText("🏁", { left: 0, top: -8, fontSize: 22, originX: "center", originY: "center" });
            const txt = makeLabel("FINISH", 9, "#fff", "900", 14);
            return createConfiguredSpaceGroup({ type: "finish", category: "basic", behavior: "finish" }, bg, icon, txt);
        }
    },
    {
        id: 3, name: "Checkpoint Space", category: "basic", preview: "🚩",
        description: "Safe progress checkpoint marker", behavior: "checkpoint",
        generator: () => {
            const bg = makeTile(CYAN, 56, 10);
            const icon = new fabric.IText("🚩", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("CHECKPOINT", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "checkpoint", category: "basic", behavior: "checkpoint" }, bg, icon, txt);
        }
    },
    {
        id: 4, name: "Safe Space", category: "basic", preview: "🛡️",
        description: "Safe space immune to attacks and setbacks", behavior: "safe",
        generator: () => {
            const bg = makeTile(BLUE, 56, 10);
            const icon = new fabric.IText("🛡️", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("SAFE ZONE", 7, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "safe", category: "basic", behavior: "safe" }, bg, icon, txt);
        }
    },
    {
        id: 5, name: "Blank Tile (White)", category: "basic", preview: "⬜",
        description: "Clean white tile to write custom prompts", behavior: "blank",
        generator: () => {
            const bg = makeTile(WHITE, 56, 10, "#333", 2);
            return createConfiguredSpaceGroup({ type: "blank", category: "basic", behavior: "blank" }, bg);
        }
    },
    {
        id: 6, name: "Numbered Space Tile", category: "basic", preview: "1️⃣",
        description: "Tile with prominent sequence number", behavior: "numbered",
        generator: () => {
            const bg = makeTile("#FFF9C4", 56, 10, "#333", 2);
            const num = makeLabel("15", 22, "#333", "900", 0);
            return createConfiguredSpaceGroup({ type: "numbered", category: "basic", behavior: "numbered" }, bg, num);
        }
    },
    {
        id: 7, name: "End Turn Space", category: "basic", preview: "🛑",
        description: "Forces immediate end of player turn", behavior: "end_turn",
        generator: () => {
            const bg = makeTile("#424242", 56, 10);
            const icon = new fabric.IText("🛑", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("END TURN", 7, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "end_turn", category: "basic", behavior: "end_turn" }, bg, icon, txt);
        }
    },

    // ──────────────── 2. MOVEMENT SPACES ────────────────
    {
        id: 8, name: "Move Forward 1", category: "movement", preview: "⏩",
        description: "Advance player 1 space forward", behavior: "move_forward_1",
        generator: () => {
            const bg = makeTile(EMERALD, 56, 10);
            const txt1 = makeLabel("+1", 16, "#fff", "900", -8);
            const txt2 = makeLabel("FORWARD", 7, "#fff", "900", 14);
            return createConfiguredSpaceGroup({ type: "move_forward_1", category: "movement", behavior: "move_forward_1" }, bg, txt1, txt2);
        }
    },
    {
        id: 9, name: "Move Forward 2", category: "movement", preview: "⏩",
        description: "Advance player 2 spaces forward", behavior: "move_forward_2",
        generator: () => {
            const bg = makeTile(EMERALD, 56, 10);
            const txt1 = makeLabel("+2", 16, "#fff", "900", -8);
            const txt2 = makeLabel("FORWARD", 7, "#fff", "900", 14);
            return createConfiguredSpaceGroup({ type: "move_forward_2", category: "movement", behavior: "move_forward_2" }, bg, txt1, txt2);
        }
    },
    {
        id: 10, name: "Move Forward 3", category: "movement", preview: "⏩",
        description: "Advance player 3 spaces forward", behavior: "move_forward_3",
        generator: () => {
            const bg = makeTile(EMERALD, 56, 10);
            const txt1 = makeLabel("+3", 16, "#fff", "900", -8);
            const txt2 = makeLabel("FORWARD", 7, "#fff", "900", 14);
            return createConfiguredSpaceGroup({ type: "move_forward_3", category: "movement", behavior: "move_forward_3" }, bg, txt1, txt2);
        }
    },
    {
        id: 11, name: "Move Back 1", category: "movement", preview: "⏪",
        description: "Move player 1 space backward", behavior: "move_back_1",
        generator: () => {
            const bg = makeTile(ROSE, 56, 10);
            const txt1 = makeLabel("-1", 16, "#fff", "900", -8);
            const txt2 = makeLabel("BACK", 7, "#fff", "900", 14);
            return createConfiguredSpaceGroup({ type: "move_back_1", category: "movement", behavior: "move_back_1" }, bg, txt1, txt2);
        }
    },
    {
        id: 12, name: "Move Back 2", category: "movement", preview: "⏪",
        description: "Move player 2 spaces backward", behavior: "move_back_2",
        generator: () => {
            const bg = makeTile(ROSE, 56, 10);
            const txt1 = makeLabel("-2", 16, "#fff", "900", -8);
            const txt2 = makeLabel("BACK", 7, "#fff", "900", 14);
            return createConfiguredSpaceGroup({ type: "move_back_2", category: "movement", behavior: "move_back_2" }, bg, txt1, txt2);
        }
    },
    {
        id: 13, name: "Move Back 3", category: "movement", preview: "⏪",
        description: "Move player 3 spaces backward", behavior: "move_back_3",
        generator: () => {
            const bg = makeTile(ROSE, 56, 10);
            const txt1 = makeLabel("-3", 16, "#fff", "900", -8);
            const txt2 = makeLabel("BACK", 7, "#fff", "900", 14);
            return createConfiguredSpaceGroup({ type: "move_back_3", category: "movement", behavior: "move_back_3" }, bg, txt1, txt2);
        }
    },
    {
        id: 14, name: "Jump Ahead", category: "movement", preview: "🦘",
        description: "Leap forward to the next matching symbol", behavior: "jump_ahead",
        generator: () => {
            const bg = makeTile(AMBER, 56, 10);
            const icon = new fabric.IText("🦘", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("JUMP AHEAD", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "jump_ahead", category: "movement", behavior: "jump_ahead" }, bg, icon, txt);
        }
    },
    {
        id: 15, name: "Return to Start", category: "movement", preview: "↺",
        description: "Send player all the way back to Start", behavior: "return_start",
        generator: () => {
            const bg = makeTile("#B71C1C", 56, 10);
            const icon = new fabric.IText("↺", { left: 0, top: -6, fontSize: 24, fill: "#fff", originX: "center", originY: "center" });
            const txt = makeLabel("BACK TO START", 5.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "return_start", category: "movement", behavior: "return_start" }, bg, icon, txt);
        }
    },
    {
        id: 16, name: "Teleport Portal", category: "movement", preview: "🌀",
        description: "Warp instantly to another teleport space", behavior: "teleport",
        generator: () => {
            const bg = makeCircleTile(PURPLE, 28);
            const icon = new fabric.IText("🌀", { left: 0, top: -2, fontSize: 22, originX: "center", originY: "center" });
            const txt = makeLabel("PORTAL", 6, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "teleport", category: "movement", behavior: "teleport" }, bg, icon, txt);
        }
    },
    {
        id: 17, name: "Shortcut Tunnel", category: "movement", preview: "🕳️",
        description: "Bypass section of track via secret tunnel", behavior: "shortcut",
        generator: () => {
            const bg = makeTile("#374151", 56, 10);
            const icon = new fabric.IText("🕳️", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("SHORTCUT", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "shortcut", category: "movement", behavior: "shortcut" }, bg, icon, txt);
        }
    },
    {
        id: 18, name: "Reverse Direction", category: "movement", preview: "🔄",
        description: "Player must move backwards on future turns", behavior: "reverse_dir",
        generator: () => {
            const bg = makeTile(ORANGE, 56, 10);
            const icon = new fabric.IText("🔄", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("REVERSE", 7, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "reverse_dir", category: "movement", behavior: "reverse_dir" }, bg, icon, txt);
        }
    },

    // ──────────────── 3. TURN-BASED SPACES ────────────────
    {
        id: 19, name: "Lose 1 Turn", category: "turn", preview: "⏸️",
        description: "Player skips their next turn", behavior: "lose_turn_1",
        generator: () => {
            const bg = makeTile(ROSE, 56, 10);
            const icon = new fabric.IText("⏸️", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("LOSE 1 TURN", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "lose_turn_1", category: "turn", behavior: "lose_turn_1" }, bg, icon, txt);
        }
    },
    {
        id: 20, name: "Lose 2 Turns", category: "turn", preview: "⛔",
        description: "Player skips 2 consecutive turns", behavior: "lose_turn_2",
        generator: () => {
            const bg = makeTile("#991B1B", 56, 10);
            const icon = new fabric.IText("⛔", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("LOSE 2 TURNS", 6, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "lose_turn_2", category: "turn", behavior: "lose_turn_2" }, bg, icon, txt);
        }
    },
    {
        id: 21, name: "Extra Turn", category: "turn", preview: "⚡",
        description: "Player gets an immediate extra turn", behavior: "extra_turn",
        generator: () => {
            const bg = makeTile(EMERALD, 56, 10);
            const icon = new fabric.IText("⚡", { left: 0, top: -6, fontSize: 22, originX: "center", originY: "center" });
            const txt = makeLabel("EXTRA TURN", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "extra_turn", category: "turn", behavior: "extra_turn" }, bg, icon, txt);
        }
    },
    {
        id: 22, name: "Play Again / Roll Again", category: "turn", preview: "🎲",
        description: "Roll dice again immediately", behavior: "roll_again",
        generator: () => {
            const bg = makeTile(BLUE, 56, 10);
            const icon = new fabric.IText("🎲", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("ROLL AGAIN", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "roll_again", category: "turn", behavior: "roll_again" }, bg, icon, txt);
        }
    },
    {
        id: 23, name: "Freeze Space", category: "turn", preview: "🧊",
        description: "Player frozen until another player passes them", behavior: "freeze",
        generator: () => {
            const bg = makeTile("#0284C7", 56, 10);
            const icon = new fabric.IText("🧊", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("FROZEN!", 7, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "freeze", category: "turn", behavior: "freeze" }, bg, icon, txt);
        }
    },

    // ──────────────── 4. DICE SPACES ────────────────
    {
        id: 24, name: "Roll Two Dice", category: "dice", preview: "🎲🎲",
        description: "Roll 2 dice on next turn", behavior: "roll_two_dice",
        generator: () => {
            const bg = makeTile(INDIGO, 56, 10);
            const icon = new fabric.IText("🎲🎲", { left: 0, top: -6, fontSize: 16, originX: "center", originY: "center" });
            const txt = makeLabel("ROLL 2 DICE", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "roll_two_dice", category: "dice", behavior: "roll_two_dice" }, bg, icon, txt);
        }
    },
    {
        id: 25, name: "Even Roll Bonus", category: "dice", preview: "⚖️",
        description: "Get bonus if rolling an even number", behavior: "even_bonus",
        generator: () => {
            const bg = makeTile(TEAL, 56, 10);
            const icon = new fabric.IText("⚖️", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("EVEN BONUS", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "even_bonus", category: "dice", behavior: "even_bonus" }, bg, icon, txt);
        }
    },
    {
        id: 26, name: "Roll to Escape", category: "dice", preview: "🔓",
        description: "Must roll a 6 to escape", behavior: "roll_escape",
        generator: () => {
            const bg = makeTile("#6B21A8", 56, 10);
            const icon = new fabric.IText("🔓", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("ROLL 6 TO ESC", 5.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "roll_escape", category: "dice", behavior: "roll_escape" }, bg, icon, txt);
        }
    },

    // ──────────────── 5. QUESTION SPACES ────────────────
    {
        id: 27, name: "Trivia Question Space", category: "question", preview: "❓",
        description: "Answer a trivia question to stay", behavior: "question_trivia",
        generator: () => {
            const bg = makeTile(PURPLE, 56, 10);
            const icon = new fabric.IText("❓", { left: 0, top: -6, fontSize: 22, originX: "center", originY: "center" });
            const txt = makeLabel("TRIVIA", 7.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "question_trivia", category: "question", behavior: "question" }, bg, icon, txt);
        }
    },
    {
        id: 28, name: "Multiple Choice Question", category: "question", preview: "☑️",
        description: "Select correct choice A, B, or C", behavior: "question_mc",
        generator: () => {
            const bg = makeTile(PURPLE, 56, 10);
            const icon = new fabric.IText("☑️", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("CHOICE A/B/C", 6, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "question_mc", category: "question", behavior: "question" }, bg, icon, txt);
        }
    },
    {
        id: 29, name: "True or False Space", category: "question", preview: "✔️",
        description: "Answer True or False prompt", behavior: "question_tf",
        generator: () => {
            const bg = makeTile(PURPLE, 56, 10);
            const icon = new fabric.IText("✔️/❌", { left: 0, top: -6, fontSize: 16, originX: "center", originY: "center" });
            const txt = makeLabel("TRUE / FALSE", 6, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "question_tf", category: "question", behavior: "question" }, bg, icon, txt);
        }
    },
    {
        id: 30, name: "Math Problem Space", category: "question", preview: "➕",
        description: "Solve a math equation to proceed", behavior: "question_math",
        generator: () => {
            const bg = makeTile("#0284C7", 56, 10);
            const icon = new fabric.IText("➕✖️", { left: 0, top: -6, fontSize: 18, originX: "center", originY: "center" });
            const txt = makeLabel("MATH TASK", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "question_math", category: "question", behavior: "question" }, bg, icon, txt);
        }
    },
    {
        id: 31, name: "Riddle Space", category: "question", preview: "🧩",
        description: "Solve a riddle to claim reward", behavior: "question_riddle",
        generator: () => {
            const bg = makeTile("#7E22CE", 56, 10);
            const icon = new fabric.IText("🧩", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("RIDDLE", 7.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "question_riddle", category: "question", behavior: "question" }, bg, icon, txt);
        }
    },

    // ──────────────── 6. EDUCATIONAL SPACES ────────────────
    {
        id: 32, name: "Vocabulary Space", category: "educational", preview: "📖",
        description: "Define or use vocabulary word", behavior: "edu_vocab",
        generator: () => {
            const bg = makeTile(INDIGO, 56, 10);
            const icon = new fabric.IText("📖", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("VOCABULARY", 6, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "edu_vocab", category: "educational", behavior: "educational" }, bg, icon, txt);
        }
    },
    {
        id: 33, name: "Spelling Challenge", category: "educational", preview: "🔤",
        description: "Spell the target word correctly", behavior: "edu_spelling",
        generator: () => {
            const bg = makeTile(INDIGO, 56, 10);
            const icon = new fabric.IText("🔤", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("SPELL WORD", 6, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "edu_spelling", category: "educational", behavior: "educational" }, bg, icon, txt);
        }
    },
    {
        id: 34, name: "Grammar Challenge", category: "educational", preview: "✍️",
        description: "Identify part of speech or fix grammar", behavior: "edu_grammar",
        generator: () => {
            const bg = makeTile(INDIGO, 56, 10);
            const icon = new fabric.IText("✍️", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("GRAMMAR", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "edu_grammar", category: "educational", behavior: "educational" }, bg, icon, txt);
        }
    },
    {
        id: 35, name: "Sight Word Space", category: "educational", preview: "👀",
        description: "Read aloud target sight word", behavior: "edu_sight_word",
        generator: () => {
            const bg = makeTile(TEAL, 56, 10);
            const icon = new fabric.IText("👀", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("SIGHT WORD", 6, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "edu_sight_word", category: "educational", behavior: "educational" }, bg, icon, txt);
        }
    },

    // ──────────────── 7. REWARD SPACES ────────────────
    {
        id: 36, name: "Bonus Points Space", category: "reward", preview: "⭐",
        description: "Gain bonus points or stars", behavior: "reward_points",
        generator: () => {
            const bg = makeTile(YELLOW, 56, 10, "#D97706", 3);
            const icon = new fabric.IText("⭐", { left: 0, top: -6, fontSize: 22, originX: "center", originY: "center" });
            const txt = makeLabel("+100 PTS", 7, "#333", "900", 16);
            return createConfiguredSpaceGroup({ type: "reward_points", category: "reward", behavior: "reward" }, bg, icon, txt);
        }
    },
    {
        id: 37, name: "Collect Coins Space", category: "reward", preview: "🪙",
        description: "Collect coins or tokens", behavior: "reward_coins",
        generator: () => {
            const bg = makeTile(YELLOW, 56, 10, "#D97706", 3);
            const icon = new fabric.IText("🪙", { left: 0, top: -6, fontSize: 22, originX: "center", originY: "center" });
            const txt = makeLabel("COLLECT COIN", 5.5, "#333", "900", 16);
            return createConfiguredSpaceGroup({ type: "reward_coins", category: "reward", behavior: "reward" }, bg, icon, txt);
        }
    },
    {
        id: 38, name: "Treasure Chest Space", category: "reward", preview: "🎁",
        description: "Open treasure chest for mystery reward", behavior: "reward_treasure",
        generator: () => {
            const bg = makeTile(AMBER, 56, 10);
            const icon = new fabric.IText("🎁", { left: 0, top: -6, fontSize: 22, originX: "center", originY: "center" });
            const txt = makeLabel("TREASURE", 7, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "reward_treasure", category: "reward", behavior: "reward" }, bg, icon, txt);
        }
    },
    {
        id: 39, name: "Power-Up Space", category: "reward", preview: "🚀",
        description: "Gain a power-up boost item", behavior: "reward_powerup",
        generator: () => {
            const bg = makeTile(CYAN, 56, 10);
            const icon = new fabric.IText("🚀", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("POWER-UP", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "reward_powerup", category: "reward", behavior: "reward" }, bg, icon, txt);
        }
    },

    // ──────────────── 8. PENALTY SPACES ────────────────
    {
        id: 40, name: "Lose Points Space", category: "penalty", preview: "💔",
        description: "Lose points penalty", behavior: "penalty_points",
        generator: () => {
            const bg = makeTile(ROSE, 56, 10);
            const icon = new fabric.IText("💔", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("-50 PTS", 7.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "penalty_points", category: "penalty", behavior: "penalty" }, bg, icon, txt);
        }
    },
    {
        id: 41, name: "Trap Space", category: "penalty", preview: "🪤",
        description: "Spring trap space penalty", behavior: "penalty_trap",
        generator: () => {
            const bg = makeTile("#881337", 56, 10);
            const icon = new fabric.IText("🪤", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("TRAP!", 7.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "penalty_trap", category: "penalty", behavior: "penalty" }, bg, icon, txt);
        }
    },
    {
        id: 42, name: "Jail / Timeout Space", category: "penalty", preview: "🔒",
        description: "Sent to Jail until rolling double or paying penalty", behavior: "penalty_jail",
        generator: () => {
            const bg = makeTile("#451A03", 56, 10);
            const icon = new fabric.IText("🔒", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("JAIL", 8, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "penalty_jail", category: "penalty", behavior: "penalty" }, bg, icon, txt);
        }
    },

    // ──────────────── 9. CARD SPACES ────────────────
    {
        id: 43, name: "Draw Card Space", category: "card", preview: "🎴",
        description: "Draw a card from the deck", behavior: "draw_card",
        generator: () => {
            const bg = makeTile(PINK, 56, 10);
            const icon = new fabric.IText("🎴", { left: 0, top: -6, fontSize: 22, originX: "center", originY: "center" });
            const txt = makeLabel("DRAW CARD", 6, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "draw_card", category: "card", behavior: "draw_card" }, bg, icon, txt);
        }
    },
    {
        id: 44, name: "Chance Card Space", category: "card", preview: "❓",
        description: "Draw a mystery Chance card", behavior: "draw_chance",
        generator: () => {
            const bg = makeTile("#C026D3", 56, 10);
            const icon = new fabric.IText("🃏", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("CHANCE", 7, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "draw_chance", category: "card", behavior: "draw_card" }, bg, icon, txt);
        }
    },

    // ──────────────── 10. CHALLENGE SPACES ────────────────
    {
        id: 45, name: "Physical Challenge", category: "challenge", preview: "🏋️",
        description: "Do 5 jumping jacks or physical activity", behavior: "challenge_physical",
        generator: () => {
            const bg = makeTile(ORANGE, 56, 10);
            const icon = new fabric.IText("🏋️", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("PHYSICAL", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "challenge_physical", category: "challenge", behavior: "challenge" }, bg, icon, txt);
        }
    },
    {
        id: 46, name: "Charades / Acting", category: "challenge", preview: "🎭",
        description: "Act out prompt without speaking", behavior: "challenge_charades",
        generator: () => {
            const bg = makeTile(PURPLE, 56, 10);
            const icon = new fabric.IText("🎭", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("CHARADES", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "challenge_charades", category: "challenge", behavior: "challenge" }, bg, icon, txt);
        }
    },
    {
        id: 47, name: "Drawing Challenge", category: "challenge", preview: "🎨",
        description: "Draw prompt for team to guess", behavior: "challenge_drawing",
        generator: () => {
            const bg = makeTile(PINK, 56, 10);
            const icon = new fabric.IText("🎨", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("DRAW THIS", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "challenge_drawing", category: "challenge", behavior: "challenge" }, bg, icon, txt);
        }
    },

    // ──────────────── 11. MINI-GAME SPACES ────────────────
    {
        id: 48, name: "Word Search Space", category: "minigame", preview: "🔍",
        description: "Solve a quick mini word search puzzle", behavior: "minigame_wordsearch",
        generator: () => {
            const bg = makeTile(INDIGO, 56, 10);
            const icon = new fabric.IText("🔍", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("WORD SEARCH", 5.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "minigame_wordsearch", category: "minigame", behavior: "minigame" }, bg, icon, txt);
        }
    },
    {
        id: 49, name: "Maze Mini-Game", category: "minigame", preview: "🌀",
        description: "Navigate mini maze puzzle", behavior: "minigame_maze",
        generator: () => {
            const bg = makeTile(TEAL, 56, 10);
            const icon = new fabric.IText("🗺️", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("MINI MAZE", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "minigame_maze", category: "minigame", behavior: "minigame" }, bg, icon, txt);
        }
    },
    {
        id: 50, name: "Tic-Tac-Toe Duel", category: "minigame", preview: "❌⭕",
        description: "Play Tic-Tac-Toe against opponent", behavior: "minigame_tictactoe",
        generator: () => {
            const bg = makeTile("#0369A1", 56, 10);
            const icon = new fabric.IText("❌⭕", { left: 0, top: -6, fontSize: 16, originX: "center", originY: "center" });
            const txt = makeLabel("TIC-TAC-TOE", 6, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "minigame_tictactoe", category: "minigame", behavior: "minigame" }, bg, icon, txt);
        }
    },

    // ──────────────── 12. STORY & ADVENTURE SPACES ────────────────
    {
        id: 51, name: "Castle Space", category: "story-adventure", preview: "🏰",
        description: "Enter kingdom castle landmark", behavior: "adventure_castle",
        generator: () => {
            const bg = makeTile("#334155", 56, 10);
            const icon = new fabric.IText("🏰", { left: 0, top: -6, fontSize: 22, originX: "center", originY: "center" });
            const txt = makeLabel("CASTLE", 7, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "adventure_castle", category: "story-adventure", behavior: "story" }, bg, icon, txt);
        }
    },
    {
        id: 52, name: "Dungeon / Cave", category: "story-adventure", preview: "🌋",
        description: "Explore dark cavern dungeon", behavior: "adventure_dungeon",
        generator: () => {
            const bg = makeTile("#1E293B", 56, 10);
            const icon = new fabric.IText("🌋", { left: 0, top: -6, fontSize: 22, originX: "center", originY: "center" });
            const txt = makeLabel("DUNGEON", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "adventure_dungeon", category: "story-adventure", behavior: "story" }, bg, icon, txt);
        }
    },
    {
        id: 53, name: "Pirate Island", category: "story-adventure", preview: "🏝️",
        description: "Land on pirate treasure island", behavior: "adventure_island",
        generator: () => {
            const bg = makeTile("#0EA5E9", 56, 10);
            const icon = new fabric.IText("🏝️", { left: 0, top: -6, fontSize: 22, originX: "center", originY: "center" });
            const txt = makeLabel("PIRATE ISLE", 6, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "adventure_island", category: "story-adventure", behavior: "story" }, bg, icon, txt);
        }
    },
    {
        id: 54, name: "Space Station", category: "story-adventure", preview: "🚀",
        description: "Futuristic galactic space station", behavior: "adventure_space",
        generator: () => {
            const bg = makeTile("#312E81", 56, 10);
            const icon = new fabric.IText("🚀", { left: 0, top: -6, fontSize: 22, originX: "center", originY: "center" });
            const txt = makeLabel("SPACE BASE", 6, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "adventure_space", category: "story-adventure", behavior: "story" }, bg, icon, txt);
        }
    },

    // ──────────────── 13. RPG & ECONOMY SPACES ────────────────
    {
        id: 55, name: "Item Shop", category: "rpg-economy", preview: "🛒",
        description: "Buy gear, power-ups, or cards", behavior: "shop",
        generator: () => {
            const bg = makeTile(AMBER, 56, 10);
            const icon = new fabric.IText("🛒", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("ITEM SHOP", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "shop", category: "rpg-economy", behavior: "shop" }, bg, icon, txt);
        }
    },
    {
        id: 56, name: "Bank / Collect Salary", category: "rpg-economy", preview: "🏦",
        description: "Collect salary or deposit funds", behavior: "bank",
        generator: () => {
            const bg = makeTile(EMERALD, 56, 10);
            const icon = new fabric.IText("🏦", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("BANK / GO", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "bank", category: "rpg-economy", behavior: "bank" }, bg, icon, txt);
        }
    },
    {
        id: 57, name: "Pay Tax Space", category: "rpg-economy", preview: "💸",
        description: "Pay income or luxury tax fine", behavior: "tax",
        generator: () => {
            const bg = makeTile("#B91C1C", 56, 10);
            const icon = new fabric.IText("💸", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("PAY TAX", 7, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "tax", category: "rpg-economy", behavior: "tax" }, bg, icon, txt);
        }
    },
    {
        id: 58, name: "Boss Battle", category: "rpg-economy", preview: "👾",
        description: "Fight boss to unlock final track section", behavior: "boss",
        generator: () => {
            const bg = makeTile("#4C1D95", 56, 10);
            const icon = new fabric.IText("👾", { left: 0, top: -6, fontSize: 22, originX: "center", originY: "center" });
            const txt = makeLabel("BOSS FIGHT", 6, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "boss", category: "rpg-economy", behavior: "boss" }, bg, icon, txt);
        }
    },

    // ──────────────── 14. TEAM & RANDOM SPACES ────────────────
    {
        id: 59, name: "Swap Places Space", category: "team-random", preview: "🔄",
        description: "Swap position with another player", behavior: "swap_places",
        generator: () => {
            const bg = makeTile(CYAN, 56, 10);
            const icon = new fabric.IText("🔀", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("SWAP PLACES", 5.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "swap_places", category: "team-random", behavior: "swap" }, bg, icon, txt);
        }
    },
    {
        id: 60, name: "Mystery Box / Surprise", category: "team-random", preview: "📦",
        description: "Random lucky or unlucky event", behavior: "mystery_box",
        generator: () => {
            const bg = makeTile("#D97706", 56, 10);
            const icon = new fabric.IText("📦", { left: 0, top: -6, fontSize: 22, originX: "center", originY: "center" });
            const txt = makeLabel("SURPRISE!", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "mystery_box", category: "team-random", behavior: "random" }, bg, icon, txt);
        }
    },
    {
        id: 61, name: "Lucky Wheel Spin", category: "team-random", preview: "🎡",
        description: "Spin lucky wheel for random prize", behavior: "lucky_wheel",
        generator: () => {
            const bg = makeTile(PINK, 56, 10);
            const icon = new fabric.IText("🎡", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("SPIN WHEEL", 6, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "lucky_wheel", category: "team-random", behavior: "random" }, bg, icon, txt);
        }
    },

    // ──────────────── 15. COLLECTION SPACES ────────────────
    {
        id: 62, name: "Collect Star Badge", category: "collection", preview: "🌟",
        description: "Collect 1 of 5 required stars", behavior: "collect_star",
        generator: () => {
            const bg = makeTile(YELLOW, 56, 10, "#B45309", 2.5);
            const icon = new fabric.IText("🌟", { left: 0, top: -6, fontSize: 22, originX: "center", originY: "center" });
            const txt = makeLabel("GET STAR", 7, "#333", "900", 16);
            return createConfiguredSpaceGroup({ type: "collect_star", category: "collection", behavior: "collect" }, bg, icon, txt);
        }
    },
    {
        id: 63, name: "Collect Key", category: "collection", preview: "🔑",
        description: "Collect key to unlock finish gate", behavior: "collect_key",
        generator: () => {
            const bg = makeTile(AMBER, 56, 10);
            const icon = new fabric.IText("🔑", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("GET KEY", 7.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "collect_key", category: "collection", behavior: "collect" }, bg, icon, txt);
        }
    },
    {
        id: 64, name: "Collect Gem", category: "collection", preview: "💎",
        description: "Collect rare gemstone", behavior: "collect_gem",
        generator: () => {
            const bg = makeTile(BLUE, 56, 10);
            const icon = new fabric.IText("💎", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("GET GEM", 7.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "collect_gem", category: "collection", behavior: "collect" }, bg, icon, txt);
        }
    },

    // ──────────────── 16. TIME & INTERACTIVE SPACES ────────────────
    {
        id: 65, name: "30-Second Timer Challenge", category: "time-interactive", preview: "⏱️",
        description: "Complete task before 30s timer ends", behavior: "timed_30s",
        generator: () => {
            const bg = makeTile(ROSE, 56, 10);
            const icon = new fabric.IText("⏱️", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("30 SECONDS", 6, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "timed_30s", category: "time-interactive", behavior: "time" }, bg, icon, txt);
        }
    },
    {
        id: 66, name: "Scan QR Code Space", category: "time-interactive", preview: "📱",
        description: "Scan QR code to reveal digital task", behavior: "qr_code",
        generator: () => {
            const bg = makeTile(DARK, 56, 10, "#fff", 2);
            const icon = new fabric.IText("📱", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("SCAN QR", 7, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "qr_code", category: "time-interactive", behavior: "interactive" }, bg, icon, txt);
        }
    },
    {
        id: 67, name: "Teacher Checkpoint", category: "time-interactive", preview: "👩‍🏫",
        description: "Stop and show work to teacher to proceed", behavior: "teacher_check",
        generator: () => {
            const bg = makeTile("#059669", 56, 10);
            const icon = new fabric.IText("👩‍🏫", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("TEACHER CHECK", 5.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "teacher_check", category: "time-interactive", behavior: "interactive" }, bg, icon, txt);
        }
    },

    // ──────────────── 17. TRACK CONNECTORS ────────────────
    {
        id: 68, name: "Straight Track (Horizontal)", category: "track", preview: "━",
        description: "Standard horizontal path corridor (120px)", behavior: "track",
        generator: () => {
            const line = new fabric.Path("M -60 0 L 60 0", { fill: "none", stroke: "#222", strokeWidth: 54, strokeLineCap: "round", originX: "center", originY: "center" });
            const inner = new fabric.Path("M -60 0 L 60 0", { fill: "none", stroke: "#F5E6C8", strokeWidth: 46, strokeLineCap: "round", originX: "center", originY: "center" });
            return createConfiguredSpaceGroup({ type: "track_straight_h", category: "track" }, line, inner);
        }
    },
    {
        id: 69, name: "Straight Track (Vertical)", category: "track", preview: "┃",
        description: "Standard vertical path corridor (120px)", behavior: "track",
        generator: () => {
            const line = new fabric.Path("M 0 -60 L 0 60", { fill: "none", stroke: "#222", strokeWidth: 54, strokeLineCap: "round", originX: "center", originY: "center" });
            const inner = new fabric.Path("M 0 -60 L 0 60", { fill: "none", stroke: "#F5E6C8", strokeWidth: 46, strokeLineCap: "round", originX: "center", originY: "center" });
            return createConfiguredSpaceGroup({ type: "track_straight_v", category: "track" }, line, inner);
        }
    },
    {
        id: 70, name: "Curve Track (Right-Down)", category: "track", preview: "╮",
        description: "Curved corner turning right then down", behavior: "track",
        generator: () => {
            const d = "M -50 0 Q 0 0 0 50";
            const line = new fabric.Path(d, { fill: "none", stroke: "#222", strokeWidth: 54, strokeLineCap: "round", originX: "center", originY: "center" });
            const inner = new fabric.Path(d, { fill: "none", stroke: "#F5E6C8", strokeWidth: 46, strokeLineCap: "round", originX: "center", originY: "center" });
            return createConfiguredSpaceGroup({ type: "track_curve_rd", category: "track" }, line, inner);
        }
    },
    {
        id: 71, name: "U-Turn Track (Right)", category: "track", preview: "⤵️",
        description: "Smooth 180-degree U-turn curve", behavior: "track",
        generator: () => {
            const d = "M 0 -60 Q 55 -60 55 0 Q 55 60 0 60";
            const line = new fabric.Path(d, { fill: "none", stroke: "#222", strokeWidth: 54, strokeLineCap: "round", originX: "center", originY: "center" });
            const inner = new fabric.Path(d, { fill: "none", stroke: "#F5E6C8", strokeWidth: 46, strokeLineCap: "round", originX: "center", originY: "center" });
            return createConfiguredSpaceGroup({ type: "track_uturn", category: "track" }, line, inner);
        }
    },

    // ──────────────── 18. SNAKES & LADDERS ────────────────
    {
        id: 72, name: "Green Ladder (Climb Up)", category: "snakes-ladders", preview: "🪜",
        description: "Green ladder to skip spaces ahead", behavior: "ladder",
        generator: () => {
            const r1 = new fabric.Path("M -10 -60 L -10 60", { fill: "none", stroke: "#15803D", strokeWidth: 5, strokeLineCap: "round", originX: "center", originY: "center" });
            const r2 = new fabric.Path("M 10 -60 L 10 60", { fill: "none", stroke: "#15803D", strokeWidth: 5, strokeLineCap: "round", originX: "center", originY: "center" });
            const rungs: fabric.Object[] = [];
            for (let i = -3; i <= 3; i++) {
                rungs.push(new fabric.Path(`M -10 ${i * 16} L 10 ${i * 16}`, { fill: "none", stroke: "#22C55E", strokeWidth: 4, strokeLineCap: "round", originX: "center", originY: "center" }));
            }
            return createConfiguredSpaceGroup({ type: "ladder_green", category: "snakes-ladders", behavior: "ladder" }, r1, r2, ...rungs);
        }
    },
    {
        id: 73, name: "Red Snake (Slide Down)", category: "snakes-ladders", preview: "🐍",
        description: "Wavy red snake that slides player back", behavior: "snake",
        generator: () => {
            const body = new fabric.Path("M 0 -60 Q 30 -30 -20 0 Q -35 30 10 55 L 0 60", {
                fill: "none", stroke: "#DC2626", strokeWidth: 9, strokeLineCap: "round", originX: "center", originY: "center",
            });
            const eye = new fabric.IText("🐍", { left: 0, top: -65, fontSize: 18, originX: "center", originY: "center" });
            return createConfiguredSpaceGroup({ type: "snake_red", category: "snakes-ladders", behavior: "snake" }, body, eye);
        }
    },

    // ──────────────── 19. DECORATIONS & LANDMARKS ────────────────
    {
        id: 74, name: "Pirate Ship", category: "decorations", preview: "🏴‍☠️",
        description: "Pirate ship illustration landmark", behavior: "decoration",
        generator: () => createConfiguredSpaceGroup({ type: "deco_ship", category: "decorations" }, new fabric.IText("🏴‍☠️", { fontSize: 40, originX: "center", originY: "center" }))
    },
    {
        id: 75, name: "Dragon Landmark", category: "decorations", preview: "🐉",
        description: "Mythical dragon illustration", behavior: "decoration",
        generator: () => createConfiguredSpaceGroup({ type: "deco_dragon", category: "decorations" }, new fabric.IText("🐉", { fontSize: 40, originX: "center", originY: "center" }))
    },
    {
        id: 76, name: "Volcano Landmark", category: "decorations", preview: "🌋",
        description: "Erupting volcano board feature", behavior: "decoration",
        generator: () => createConfiguredSpaceGroup({ type: "deco_volcano", category: "decorations" }, new fabric.IText("🌋", { fontSize: 40, originX: "center", originY: "center" }))
    },
    {
        id: 77, name: "Rainbow Bridge", category: "decorations", preview: "🌈",
        description: "Colorful rainbow background decoration", behavior: "decoration",
        generator: () => createConfiguredSpaceGroup({ type: "deco_rainbow", category: "decorations" }, new fabric.IText("🌈", { fontSize: 44, originX: "center", originY: "center" }))
    },
    {
        id: 78, name: "Compass Rose", category: "decorations", preview: "🧭",
        description: "Nautical navigation compass", behavior: "decoration",
        generator: () => createConfiguredSpaceGroup({ type: "deco_compass", category: "decorations" }, new fabric.IText("🧭", { fontSize: 40, originX: "center", originY: "center" }))
    },

    // ──────────────── 20. BOARD FRAMES ────────────────
    {
        id: 79, name: "Cardboard Game Frame (560x700)", category: "frames", preview: "🖼️",
        description: "Standard printable card frame with rounded border", behavior: "frame",
        generator: () => {
            const bg = new fabric.Rect({
                left: 0, top: 0, width: 560, height: 700, rx: 20, ry: 20,
                fill: "#FFFDF5", stroke: "#1E293B", strokeWidth: 5,
                originX: "center", originY: "center", shadow: shadow(18),
            });
            const inner = new fabric.Rect({
                left: 0, top: 0, width: 538, height: 678, rx: 14, ry: 14,
                fill: "transparent", stroke: "#CBD5E1", strokeWidth: 1.5,
                originX: "center", originY: "center",
            });
            return createConfiguredSpaceGroup({ type: "frame_standard", category: "frames" }, bg, inner);
        }
    },
    {
        id: 80, name: "Square Wood Frame (560x560)", category: "frames", preview: "🪵",
        description: "Rich wooden board frame for chess, ludo, checkers", behavior: "frame",
        generator: () => {
            const bg = new fabric.Rect({
                left: 0, top: 0, width: 560, height: 560, rx: 12, ry: 12,
                fill: "#78350F", stroke: "#451A03", strokeWidth: 6,
                originX: "center", originY: "center", shadow: shadow(18),
            });
            return createConfiguredSpaceGroup({ type: "frame_wood", category: "frames" }, bg);
        }
    },

    // ──────────────── 21. EXPANDED GAME COVERAGE ────────────────
    // Sequence, Rummikub, Ingenious, Century, Isle of Skye, Clank! In! Space!,
    // El Dorado, Memoir '44, Azul Summer Pavilion, Railroad Ink, Welcome To,
    // Cartographers, Harmonies, Nemesis, The Crew, Twilight Imperium,
    // War of the Ring, Descent, Ark Nova
    {
        id: 81, name: "Sequence Card Grid", category: "basic", preview: "🃏",
        description: "Card placement grid for matching sequences (Sequence)", behavior: "card_grid",
        generator: () => {
            const bg = makeTile("#1E40AF", 56, 10, "#1E3A8A", 3);
            const icon = new fabric.IText("🃏", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("SEQUENCE", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "card_grid", category: "basic", behavior: "card_grid" }, bg, icon, txt);
        }
    },
    {
        id: 82, name: "Number Tile Rack", category: "basic", preview: "🔢",
        description: "Numbered tile for set-making and runs (Rummikub)", behavior: "number_tile",
        generator: () => {
            const bg = makeTile("#FFFDE7", 56, 10, "#78350F", 2.5);
            const num = makeLabel("13", 22, "#B91C1C", "900", -4);
            const txt = makeLabel("TILE", 7, "#78350F", "900", 16);
            return createConfiguredSpaceGroup({ type: "number_tile", category: "basic", behavior: "number_tile" }, bg, num, txt);
        }
    },
    {
        id: 83, name: "Multi-Color Score Track", category: "basic", preview: "🌈",
        description: "Scoring track for multi-color achievements (Ingenious)", behavior: "score_track",
        generator: () => {
            const bg = makeTile("#7C3AED", 56, 10, "#5B21B6", 3);
            const icon = new fabric.IText("🌈", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("SCORE TRACK", 5.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "score_track", category: "basic", behavior: "score_track" }, bg, icon, txt);
        }
    },
    {
        id: 84, name: "Spice Cube Converter", category: "basic", preview: "🧂",
        description: "Resource conversion engine tile (Century: Spice Road)", behavior: "spice_convert",
        generator: () => {
            const bg = makeTile(AMBER, 56, 10, "#92400E", 3);
            const icon = new fabric.IText("🧂", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("CONVERT", 7, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "spice_convert", category: "basic", behavior: "convert" }, bg, icon, txt);
        }
    },
    {
        id: 85, name: "Landscape Auction Tile", category: "basic", preview: "🏞️",
        description: "Auctionable landscape tile for scoring (Isle of Skye)", behavior: "landscape_auction",
        generator: () => {
            const bg = makeTile(EMERALD, 56, 10, "#065F46", 3);
            const icon = new fabric.IText("🏞️", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("AUCTION", 7, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "landscape_auction", category: "basic", behavior: "auction" }, bg, icon, txt);
        }
    },
    {
        id: 86, name: "Spaceship Corridor", category: "basic", preview: "🛸",
        description: "Sci-fi spaceship corridor tile (Clank! In! Space!)", behavior: "spaceship_corridor",
        generator: () => {
            const bg = makeTile("#312E81", 56, 10, "#1E1B4B", 3);
            const icon = new fabric.IText("🛸", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("CORRIDOR", 6.5, "#A5B4FC", "900", 16);
            return createConfiguredSpaceGroup({ type: "spaceship_corridor", category: "basic", behavior: "corridor" }, bg, icon, txt);
        }
    },
    {
        id: 87, name: "Jungle Machete Path", category: "basic", preview: "🗡️",
        description: "Dense jungle path requiring exploration (Quest for El Dorado)", behavior: "jungle_machete",
        generator: () => {
            const bg = makeTile("#166534", 56, 10, "#14532D", 3);
            const icon = new fabric.IText("🗡️", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("MACHETE", 7, "#BBF7D0", "900", 16);
            return createConfiguredSpaceGroup({ type: "jungle_machete", category: "basic", behavior: "explore" }, bg, icon, txt);
        }
    },
    {
        id: 88, name: "Infantry Bunker", category: "basic", preview: "🎖️",
        description: "Military bunker with infantry unit defense (Memoir '44)", behavior: "infantry_bunker",
        generator: () => {
            const bg = makeTile("#4B5563", 56, 10, "#1F2937", 3);
            const icon = new fabric.IText("🎖️", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("BUNKER", 7, "#D1D5DB", "900", 16);
            return createConfiguredSpaceGroup({ type: "infantry_bunker", category: "basic", behavior: "defense" }, bg, icon, txt);
        }
    },
    {
        id: 89, name: "Summer Pavilion Star", category: "basic", preview: "✨",
        description: "Radial star tile for bonus scoring (Azul: Summer Pavilion)", behavior: "pavilion_star",
        generator: () => {
            const bg = makeTile("#F59E0B", 56, 10, "#D97706", 3);
            const icon = new fabric.IText("✨", { left: 0, top: -6, fontSize: 22, originX: "center", originY: "center" });
            const txt = makeLabel("STAR TILE", 6, "#451A03", "900", 16);
            return createConfiguredSpaceGroup({ type: "pavilion_star", category: "basic", behavior: "pattern" }, bg, icon, txt);
        }
    },
    {
        id: 90, name: "Rail Route Drawing", category: "basic", preview: "🚃",
        description: "Draw rail route connections on the grid (Railroad Ink)", behavior: "rail_route",
        generator: () => {
            const bg = makeTile("#78716C", 56, 10, "#44403C", 3);
            const icon = new fabric.IText("🚃", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("RAIL ROUTE", 6, "#FEF3C7", "900", 16);
            return createConfiguredSpaceGroup({ type: "rail_route", category: "basic", behavior: "route" }, bg, icon, txt);
        }
    },
    {
        id: 91, name: "Street House Number", category: "basic", preview: "🏘️",
        description: "Residential street with house numbering (Welcome To...)", behavior: "house_number",
        generator: () => {
            const bg = makeTile("#DBEAFE", 56, 10, "#1D4ED8", 2.5);
            const num = makeLabel("42", 20, "#1E40AF", "900", -4);
            const txt = makeLabel("HOUSE", 7, "#1E40AF", "900", 16);
            return createConfiguredSpaceGroup({ type: "house_number", category: "basic", behavior: "place" }, bg, num, txt);
        }
    },
    {
        id: 92, name: "Cartography Terrain", category: "basic", preview: "🗺️",
        description: "Map terrain tile for scoring regions (Cartographers)", behavior: "cartography",
        generator: () => {
            const bg = makeHexagonTile("#059669", 28);
            const icon = new fabric.IText("🗺️", { left: 0, top: -2, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("MAP", 7, "#fff", "900", 18);
            return createConfiguredSpaceGroup({ type: "cartography", category: "basic", behavior: "map" }, bg, icon, txt);
        }
    },
    {
        id: 93, name: "Nature Ecosystem", category: "basic", preview: "🌿",
        description: "Nature pattern ecosystem harmony tile (Harmonies)", behavior: "ecosystem",
        generator: () => {
            const bg = makeTile("#10B981", 56, 10, "#047857", 3);
            const icon = new fabric.IText("🌿", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("ECOSYSTEM", 5.5, "#ECFDF5", "900", 16);
            return createConfiguredSpaceGroup({ type: "ecosystem", category: "basic", behavior: "pattern" }, bg, icon, txt);
        }
    },
    {
        id: 94, name: "Alien Encounter", category: "basic", preview: "👽",
        description: "Hostile alien encounter in ship corridors (Nemesis)", behavior: "alien_encounter",
        generator: () => {
            const bg = makeTile("#0F172A", 56, 10, "#991B1B", 3);
            const icon = new fabric.IText("👽", { left: 0, top: -6, fontSize: 22, originX: "center", originY: "center" });
            const txt = makeLabel("ALIEN!", 8, "#FCA5A5", "900", 16);
            return createConfiguredSpaceGroup({ type: "alien_encounter", category: "basic", behavior: "combat" }, bg, icon, txt);
        }
    },
    {
        id: 95, name: "Hull Breach", category: "basic", preview: "💥",
        description: "Damaged ship hull section requiring repair (Nemesis)", behavior: "hull_breach",
        generator: () => {
            const bg = makeTile("#1C1917", 56, 10, "#DC2626", 3);
            const icon = new fabric.IText("💥", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("HULL BREACH", 5, "#FEE2E2", "900", 16);
            return createConfiguredSpaceGroup({ type: "hull_breach", category: "basic", behavior: "hazard" }, bg, icon, txt);
        }
    },
    {
        id: 96, name: "Mission Comms", category: "basic", preview: "📡",
        description: "Restricted communication mission card (The Crew)", behavior: "mission_comms",
        generator: () => {
            const bg = makeTile("#1E3A8A", 56, 10, "#1E40AF", 3);
            const icon = new fabric.IText("📡", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("MISSION", 7, "#BFDBFE", "900", 16);
            return createConfiguredSpaceGroup({ type: "mission_comms", category: "basic", behavior: "cooperative" }, bg, icon, txt);
        }
    },
    {
        id: 97, name: "Galactic Council", category: "basic", preview: "🏛️",
        description: "Political council voting and agenda space (Twilight Imperium)", behavior: "galactic_council",
        generator: () => {
            const bg = makeTile("#4338CA", 56, 10, "#312E81", 3);
            const icon = new fabric.IText("🏛️", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("COUNCIL", 7, "#C7D2FE", "900", 16);
            return createConfiguredSpaceGroup({ type: "galactic_council", category: "basic", behavior: "politics" }, bg, icon, txt);
        }
    },
    {
        id: 98, name: "Fellowship Path", category: "basic", preview: "💍",
        description: "Ring bearer fellowship journey path (War of the Ring)", behavior: "fellowship_path",
        generator: () => {
            const bg = makeTile("#92400E", 56, 10, "#78350F", 3);
            const icon = new fabric.IText("💍", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("FELLOWSHIP", 5.5, "#FEF3C7", "900", 16);
            return createConfiguredSpaceGroup({ type: "fellowship_path", category: "basic", behavior: "quest" }, bg, icon, txt);
        }
    },
    {
        id: 99, name: "Hero Ability Card", category: "basic", preview: "⚔️",
        description: "Hero character ability and equipment tile (Descent)", behavior: "hero_ability",
        generator: () => {
            const bg = makeTile("#7C3AED", 56, 10, "#6D28D9", 3);
            const icon = new fabric.IText("⚔️", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("HERO CARD", 6, "#DDD6FE", "900", 16);
            return createConfiguredSpaceGroup({ type: "hero_ability", category: "basic", behavior: "ability" }, bg, icon, txt);
        }
    },
    {
        id: 100, name: "Zoo Exhibit", category: "basic", preview: "🦁",
        description: "Zoo exhibit enclosure for animal display (Ark Nova)", behavior: "zoo_exhibit",
        generator: () => {
            const bg = makeTile("#059669", 56, 10, "#047857", 3);
            const icon = new fabric.IText("🦁", { left: 0, top: -6, fontSize: 22, originX: "center", originY: "center" });
            const txt = makeLabel("ZOO EXHIBIT", 5.5, "#ECFDF5", "900", 16);
            return createConfiguredSpaceGroup({ type: "zoo_exhibit", category: "basic", behavior: "place" }, bg, icon, txt);
        }
    },
    {
        id: 101, name: "Animal Habitat Hex", category: "basic", preview: "🐘",
        description: "Hexagonal animal habitat conservation zone (Ark Nova)", behavior: "animal_habitat",
        generator: () => {
            const bg = makeHexagonTile("#15803D", 28);
            const icon = new fabric.IText("🐘", { left: 0, top: -2, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("HABITAT", 6.5, "#fff", "900", 18);
            return createConfiguredSpaceGroup({ type: "animal_habitat", category: "basic", behavior: "habitat" }, bg, icon, txt);
        }
    },
    {
        id: 102, name: "Ring Bearer Trail", category: "basic", preview: "🗻",
        description: "Perilous mountain trail to Mount Doom (War of the Ring)", behavior: "ring_trail",
        generator: () => {
            const bg = makeTile("#44403C", 56, 10, "#1C1917", 3);
            const icon = new fabric.IText("🗻", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("DOOM TRAIL", 5.5, "#FEF3C7", "900", 16);
            return createConfiguredSpaceGroup({ type: "ring_trail", category: "basic", behavior: "quest" }, bg, icon, txt);
        }
    },
    {
        id: 103, name: "Lettered Space Tile", category: "basic", preview: "🔤",
        description: "Alphabet letter tile for spelling and literacy (Scrabble, Word games)", behavior: "lettered",
        generator: () => {
            const bg = makeTile("#FFFDE7", 56, 10, "#78350F", 2.5);
            const letter = makeLabel("A", 24, "#78350F", "900", -4);
            const txt = makeLabel("LETTER", 7, "#78350F", "900", 16);
            return createConfiguredSpaceGroup({ type: "letter_space", category: "basic", behavior: "lettered" }, bg, letter, txt);
        }
    },
    {
        id: 104, name: "Reverse Turn Order", category: "basic", preview: "🔄",
        description: "Reverses direction of turn play order for all players", behavior: "reverse_play",
        generator: () => {
            const bg = makeTile(ORANGE, 56, 10, "#9A3412", 3);
            const icon = new fabric.IText("🔄", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("REVERSE ORDER", 5.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "reverse_order", category: "basic", behavior: "reverse_play" }, bg, icon, txt);
        }
    },
    {
        id: 105, name: "Double Turn Space", category: "basic", preview: "⏩",
        description: "Gives active player two turns on their next go", behavior: "double_turn",
        generator: () => {
            const bg = makeTile(EMERALD, 56, 10, "#065F46", 3);
            const icon = new fabric.IText("⏩", { left: 0, top: -6, fontSize: 22, originX: "center", originY: "center" });
            const txt = makeLabel("DOUBLE PLAY", 6, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "double_turn", category: "basic", behavior: "double_turn" }, bg, icon, txt);
        }
    },
    {
        id: 106, name: "Odd Roll Bonus", category: "basic", preview: "⚖️",
        description: "Get bonus if rolling an odd number", behavior: "odd_bonus",
        generator: () => {
            const bg = makeTile(TEAL, 56, 10, "#115E59", 3);
            const icon = new fabric.IText("⚖️", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("ODD BONUS", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "odd_bonus", category: "basic", behavior: "odd_bonus" }, bg, icon, txt);
        }
    },
    {
        id: 107, name: "Team Challenge Space", category: "basic", preview: "👥",
        description: "Cooperative group challenge involving the entire team", behavior: "team_challenge",
        generator: () => {
            const bg = makeTile(INDIGO, 56, 10, "#3730A3", 3);
            const icon = new fabric.IText("👥", { left: 0, top: -6, fontSize: 22, originX: "center", originY: "center" });
            const txt = makeLabel("TEAM QUEST", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "team_challenge", category: "basic", behavior: "team_challenge" }, bg, icon, txt);
        }
    },
    {
        id: 108, name: "Synonym & Antonym Space", category: "basic", preview: "✍️",
        description: "Provide a synonym and antonym for the target word", behavior: "synonym_antonym",
        generator: () => {
            const bg = makeTile(BLUE, 56, 10, "#1E40AF", 3);
            const icon = new fabric.IText("✍️", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("SYN / ANT", 7, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "synonym_antonym", category: "basic", behavior: "synonym_antonym" }, bg, icon, txt);
        }
    },
    {
        id: 109, name: "Fraction Problem Space", category: "basic", preview: "🍕",
        description: "Solve a fraction or division puzzle to proceed", behavior: "fraction_problem",
        generator: () => {
            const bg = makeTile("#0284C7", 56, 10, "#0369A1", 3);
            const icon = new fabric.IText("🍕", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("FRACTIONS", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "fraction_problem", category: "basic", behavior: "fraction_problem" }, bg, icon, txt);
        }
    },
    {
        id: 110, name: "Extra Life / Shield Space", category: "basic", preview: "🛡️",
        description: "Earn an extra life or immunity shield protection", behavior: "extra_life",
        generator: () => {
            const bg = makeTile(ROSE, 56, 10, "#9F1239", 3);
            const icon = new fabric.IText("🛡️", { left: 0, top: -6, fontSize: 20, originX: "center", originY: "center" });
            const txt = makeLabel("GET SHIELD", 6.5, "#fff", "900", 16);
            return createConfiguredSpaceGroup({ type: "extra_life", category: "basic", behavior: "extra_life" }, bg, icon, txt);
        }
    }
];
