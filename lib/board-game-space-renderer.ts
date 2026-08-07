/* ══════════════════════════════════════════════════════════════════
 *  Board Game Space Fabric.js Renderer
 *  Renders configurable space objects on the canvas
 * ══════════════════════════════════════════════════════════════════ */

import * as fabric from "fabric";
import { BoardGameSpaceConfig, SpaceShape, createSpaceFromPreset } from "./board-game-space-types";
import { SPACE_PRESETS } from "./board-game-space-presets";
import type { SpacePreset } from "./board-game-space-presets";

// ─── Shadow Helper ─────────────────────────────────────────────────
function createShadow(config: BoardGameSpaceConfig["appearance"]["shadow"]) {
    if (!config.enabled) return undefined;
    return new fabric.Shadow({
        color: config.color,
        blur: config.blur,
        offsetX: config.offsetX,
        offsetY: config.offsetY,
    });
}

// ─── Shape Renderers ───────────────────────────────────────────────
function renderSquare(
    config: BoardGameSpaceConfig["appearance"],
    shadow: fabric.Shadow | undefined
): fabric.Rect {
    return new fabric.Rect({
        width: config.size,
        height: config.size,
        rx: config.cornerRadius,
        ry: config.cornerRadius,
        fill: config.fill,
        stroke: config.border.color,
        strokeWidth: config.border.width,
        strokeDashArray: config.border.style === "dashed" ? [5, 5] : config.border.style === "dotted" ? [2, 2] : undefined,
        originX: "center",
        originY: "center",
        shadow,
        opacity: config.opacity,
    });
}

function renderCircle(
    config: BoardGameSpaceConfig["appearance"],
    shadow: fabric.Shadow | undefined
): fabric.Circle {
    return new fabric.Circle({
        radius: config.size / 2,
        fill: config.fill,
        stroke: config.border.color,
        strokeWidth: config.border.width,
        strokeDashArray: config.border.style === "dashed" ? [5, 5] : config.border.style === "dotted" ? [2, 2] : undefined,
        originX: "center",
        originY: "center",
        shadow,
        opacity: config.opacity,
    });
}

function renderHexagon(
    config: BoardGameSpaceConfig["appearance"],
    shadow: fabric.Shadow | undefined
): fabric.Polygon {
    const radius = config.size / 2;
    const points: fabric.Point[] = [];
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        points.push(new fabric.Point(Math.cos(angle) * radius, Math.sin(angle) * radius));
    }
    return new fabric.Polygon(points, {
        fill: config.fill,
        stroke: config.border.color,
        strokeWidth: config.border.width,
        strokeDashArray: config.border.style === "dashed" ? [5, 5] : config.border.style === "dotted" ? [2, 2] : undefined,
        originX: "center",
        originY: "center",
        shadow,
        opacity: config.opacity,
    });
}

function renderDiamond(
    config: BoardGameSpaceConfig["appearance"],
    shadow: fabric.Shadow | undefined
): fabric.Polygon {
    const half = config.size / 2;
    return new fabric.Polygon(
        [
            new fabric.Point(0, -half),
            new fabric.Point(half, 0),
            new fabric.Point(0, half),
            new fabric.Point(-half, 0),
        ],
        {
            fill: config.fill,
            stroke: config.border.color,
            strokeWidth: config.border.width,
            strokeDashArray: config.border.style === "dashed" ? [5, 5] : config.border.style === "dotted" ? [2, 2] : undefined,
            originX: "center",
            originY: "center",
            shadow,
            opacity: config.opacity,
        }
    );
}

function renderStar(
    config: BoardGameSpaceConfig["appearance"],
    shadow: fabric.Shadow | undefined
): fabric.Polygon {
    const outerRadius = config.size / 2;
    const innerRadius = config.size / 4;
    const points: fabric.Point[] = [];
    const spikes = 5;
    
    for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI / spikes) * i - Math.PI / 2;
        points.push(new fabric.Point(Math.cos(angle) * radius, Math.sin(angle) * radius));
    }
    
    return new fabric.Polygon(points, {
        fill: config.fill,
        stroke: config.border.color,
        strokeWidth: config.border.width,
        strokeDashArray: config.border.style === "dashed" ? [5, 5] : config.border.style === "dotted" ? [2, 2] : undefined,
        originX: "center",
        originY: "center",
        shadow,
        opacity: config.opacity,
    });
}

// ─── Pattern Renderer ───────────────────────────────────────────────
function renderPattern(
    config: BoardGameSpaceConfig["appearance"],
    baseShape: fabric.Rect | fabric.Circle | fabric.Polygon
): fabric.Rect | fabric.Circle | fabric.Polygon {
    if (!config.pattern || config.pattern === "none") return baseShape;
    
    // For now, we'll return the base shape
    // Pattern rendering could be expanded with fabric.Pattern
    return baseShape;
}

// ─── Content Renderers ────────────────────────────────────────────
function renderIcon(
    config: BoardGameSpaceConfig["appearance"]
): fabric.IText | null {
    if (!config.icon && !config.emoji) return null;
    
    return new fabric.IText(config.emoji || config.icon || "", {
        fontSize: 24,
        originX: "center",
        originY: "center",
        left: 0,
        top: -8,
        selectable: false,
    });
}

function renderTitle(
    config: BoardGameSpaceConfig["content"]
): fabric.IText | null {
    if (!config.title) return null;
    
    return new fabric.IText(config.title, {
        fontSize: 10,
        fontWeight: "bold",
        fontFamily: "Inter, Arial, sans-serif",
        fill: "#ffffff",
        originX: "center",
        originY: "center",
        left: 0,
        top: 12,
        selectable: false,
    });
}

function renderNumber(
    config: BoardGameSpaceConfig["content"]
): fabric.IText | null {
    if (config.number === undefined) return null;
    
    return new fabric.IText(String(config.number), {
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Inter, Arial, sans-serif",
        fill: "#ffffff",
        originX: "center",
        originY: "center",
        left: 0,
        top: 0,
        selectable: false,
    });
}

function renderLetter(
    config: BoardGameSpaceConfig["content"]
): fabric.IText | null {
    if (!config.letter) return null;
    
    return new fabric.IText(config.letter, {
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: "Inter, Arial, sans-serif",
        fill: "#ffffff",
        originX: "center",
        originY: "center",
        left: 0,
        top: 0,
        selectable: false,
    });
}

// ─── Main Render Function ───────────────────────────────────────────
export function renderBoardGameSpace(
    config: BoardGameSpaceConfig,
    x: number = 0,
    y: number = 0
): fabric.Group {
    const { appearance, content } = config;
    const shadow = createShadow(appearance.shadow);
    
    // Render base shape
    let baseShape: fabric.Rect | fabric.Circle | fabric.Polygon;
    
    switch (appearance.shape) {
        case "square":
            baseShape = renderSquare(appearance, shadow);
            break;
        case "circle":
            baseShape = renderCircle(appearance, shadow);
            break;
        case "hexagon":
            baseShape = renderHexagon(appearance, shadow);
            break;
        case "diamond":
            baseShape = renderDiamond(appearance, shadow);
            break;
        case "star":
            baseShape = renderStar(appearance, shadow);
            break;
        case "rounded":
        default:
            baseShape = renderSquare(appearance, shadow);
            break;
    }
    
    // Apply pattern if specified
    baseShape = renderPattern(appearance, baseShape);
    
    // Collect all objects to group
    const objects: fabric.Object[] = [baseShape];
    
    // Render content
    const icon = renderIcon(appearance);
    if (icon) objects.push(icon);
    
    const title = renderTitle(content);
    if (title) objects.push(title);
    
    const number = renderNumber(content);
    if (number) objects.push(number);
    
    const letter = renderLetter(content);
    if (letter) objects.push(letter);
    
    // Create group
    const group = new fabric.Group(objects, {
        left: x,
        top: y,
        originX: "center",
        originY: "center",
        subTargetCheck: true,
        selectable: true,
        hasControls: true,
        hasBorders: true,
    });
    
    // Attach metadata to group
    (group as any).id = config.metadata.id;
    (group as any).customType = "board-game-space";
    (group as any).spaceConfig = config;
    
    return group;
}

// ─── Update Existing Space on Canvas ───────────────────────────────
export function updateBoardGameSpace(
    group: fabric.Group,
    newConfig: BoardGameSpaceConfig
): void {
    const canvas = group.canvas;
    if (!canvas) return;
    
    // Remove old group
    canvas.remove(group);
    
    // Render new group at same position
    const newGroup = renderBoardGameSpace(newConfig, group.left || 0, group.top || 0);
    
    // Add new group
    canvas.add(newGroup);
    canvas.setActiveObject(newGroup);
    canvas.requestRenderAll();
    canvas.fire("object:modified");
}

// ─── Extract Config from Canvas Object ────────────────────────────
export function extractSpaceConfig(group: fabric.Group): BoardGameSpaceConfig | null {
    if ((group as any).spaceConfig) {
        return (group as any).spaceConfig;
    }
    return null;
}

// ─── Quick Preset Render ───────────────────────────────────────────
export function renderPreset(
    preset: SpacePreset,
    x: number = 0,
    y: number = 0,
    customId?: string
): fabric.Group {
    const config = createSpaceFromPreset(preset, customId);
    return renderBoardGameSpace(config, x, y);
}
