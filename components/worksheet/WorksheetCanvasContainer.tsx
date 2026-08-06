"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import * as fabric from "fabric";
import getStroke from "perfect-freehand";
import { toast } from "sonner";
import { useWorksheetStore } from "@/lib/worksheet-store";
import {
    createFreehandPath,
    getSvgPathFromFreehandStroke,
    generateWordSearchComponentGroups,
    generateAdvancedWordSearchObjects,
    generateCrosswordComponentGroups,
    generateAdvancedCrosswordObjects,
    attachPuzzleMetadata
} from "@/lib/worksheet-fabric";

interface WorksheetCanvasContainerProps {
    fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
}

const CUSTOM_PROPS = ["customType", "puzzleComponent", "wordSearchConfig", "crosswordConfig", "puzzleConfig", "id", "subTargetCheck"];

function hydrateCustomProperties(jsonObj: any, fabricObj: any) {
    if (!jsonObj || !fabricObj) return;
    CUSTOM_PROPS.forEach((prop) => {
        if (jsonObj[prop] !== undefined) {
            fabricObj[prop] = jsonObj[prop];
        }
    });
    if (Array.isArray(jsonObj.objects) && typeof fabricObj.getObjects === "function") {
        const children = fabricObj.getObjects();
        jsonObj.objects.forEach((childJson: any, idx: number) => {
            if (children[idx]) {
                hydrateCustomProperties(childJson, children[idx]);
            }
        });
    }
}

function keepEraserMasksOnTop(c: fabric.Canvas) {
    if (!c) return;
    const objects = c.getObjects();
    objects.forEach((obj: any) => {
        if (obj.customType && typeof obj.customType === "string" && obj.customType.startsWith("eraser")) {
            c.bringObjectToFront(obj);
        }
    });
}

export const WorksheetCanvasContainer: React.FC<WorksheetCanvasContainerProps> = ({ fabricCanvasRef }) => {
    const canvasElRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasWrapperRef = useRef<HTMLDivElement | null>(null);

    // Ref to prevent recursive saveState <-> loadFromJSON loops
    const isInternalStateUpdateRef = useRef(false);

    const {
        pages,
        currentPageIndex,
        zoom,
        showGrid,
        gridSnapping,
        gridSize,
        activeTool,
        brushSize,
        brushColor,
        brushThinning,
        brushSmoothing,
        brushStyle,
        brushOpacity,
        eraserSize,
        eraserShape,
        eraserMode,
        updateCurrentPageCanvas,
        setSelectedObject,
        showKdpGuides,
        kdpBleed,
        getKdpSpecs,
    } = useWorksheetStore();

    const kdpSpecs = getKdpSpecs();

    // Freehand stroke points ref
    const strokePointsRef = useRef<{ x: number; y: number; pressure?: number }[]>([]);
    const isDrawingRef = useRef(false);

    // Eraser pointer state
    const [liveBoxRect, setLiveBoxRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
    const [liveCutLine, setLiveCutLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
    const eraserStartRef = useRef<{ x: number; y: number } | null>(null);

    // Debounced Save canvas state helper
    const saveStateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const saveState = useCallback(() => {
        if (isInternalStateUpdateRef.current) return;
        const c = fabricCanvasRef.current;
        if (!c) return;

        try {
            const json = (c as any).toJSON(CUSTOM_PROPS);
            let thumbnail = "";
            try {
                thumbnail = c.toDataURL({ format: "png", multiplier: 0.15 });
            } catch (e) {
                // thumbnail generation optional
            }
            updateCurrentPageCanvas(json, thumbnail);
        } catch (err) {
            console.error("Canvas serialization error:", err);
        }
    }, [fabricCanvasRef, updateCurrentPageCanvas]);

    // Initialize Fabric Canvas
    useEffect(() => {
        if (!canvasElRef.current) return;

        const c = new fabric.Canvas(canvasElRef.current, {
            width: kdpSpecs.canvasWidth,
            height: kdpSpecs.canvasHeight,
            backgroundColor: "#ffffff",
            preserveObjectStacking: true,
            selection: true,
        });

        fabricCanvasRef.current = c;
        (window as any).__fabricCanvas = c;
        if (canvasElRef.current) {
            (canvasElRef.current as any).__fabricCanvas = c;
        }

        // Selection & Modification Listener for instant property sync
        const handleSelection = () => {
            const activeObj = c.getActiveObject();
            if (!activeObj) {
                setSelectedObject(null, null);
                return;
            }

            let textVal = (activeObj as any).text;
            let fontFamilyVal = (activeObj as any).fontFamily;
            let fontSizeVal = (activeObj as any).fontSize;
            let lineHeightVal = (activeObj as any).lineHeight;
            let textAlignVal = (activeObj as any).textAlign;
            let fontStyleVal = (activeObj as any).fontStyle;
            let fontWeightVal = (activeObj as any).fontWeight;

            if (activeObj.type === "group" && typeof (activeObj as any).getObjects === "function") {
                const childText = (activeObj as any).getObjects().find((o: any) => o.type === "i-text" || o.type === "text");
                if (childText) {
                    if (textVal === undefined) textVal = childText.text;
                    if (!fontFamilyVal) fontFamilyVal = childText.fontFamily;
                    if (!fontSizeVal) fontSizeVal = childText.fontSize;
                    if (!lineHeightVal) lineHeightVal = childText.lineHeight;
                    if (!textAlignVal) textAlignVal = childText.textAlign;
                    if (!fontStyleVal) fontStyleVal = childText.fontStyle;
                    if (!fontWeightVal) fontWeightVal = childText.fontWeight;
                }
            }

            setSelectedObject(
                (activeObj as any).id || "obj-" + Date.now(),
                activeObj.type || "object",
                {
                    left: activeObj.left,
                    top: activeObj.top,
                    width: activeObj.width,
                    height: activeObj.height,
                    scaleX: activeObj.scaleX,
                    scaleY: activeObj.scaleY,
                    angle: activeObj.angle,
                    fill: activeObj.fill,
                    stroke: activeObj.stroke,
                    strokeWidth: activeObj.strokeWidth,
                    strokeDashArray: activeObj.strokeDashArray,
                    strokeLineCap: activeObj.strokeLineCap,
                    strokeLineJoin: activeObj.strokeLineJoin,
                    opacity: activeObj.opacity,
                    text: textVal !== undefined ? textVal : (activeObj.type === "i-text" || activeObj.type === "text" ? "" : undefined),
                    fontSize: fontSizeVal ?? 18,
                    fontFamily: fontFamilyVal ?? "Inter",
                    lineHeight: lineHeightVal ?? 1.2,
                    textAlign: textAlignVal ?? "center",
                    fontStyle: fontStyleVal ?? "normal",
                    fontWeight: fontWeightVal ?? "normal",
                }
            );
        };

        c.on("selection:created", handleSelection);
        c.on("selection:updated", handleSelection);
        c.on("selection:cleared", () => setSelectedObject(null, null));
        c.on("text:changed", handleSelection);
        c.on("text:selection:changed", handleSelection);

        // Object modification listeners for instant page state sync
        c.on("object:added", saveState);
        c.on("object:modified", (e) => {
            saveState();
            handleSelection();
        });
        c.on("object:removed", saveState);

        return () => {
            try {
                c.dispose();
            } catch (e) {
                // Ignore DOM disposal race conditions
            }
            fabricCanvasRef.current = null;
        };
    }, [kdpSpecs.canvasWidth, kdpSpecs.canvasHeight]);

    // Load canvas JSON ONLY when currentPageIndex changes
    const prevPageIndexRef = useRef<number>(-1);
    useEffect(() => {
        const c = fabricCanvasRef.current;
        if (!c) return;

        const currentPage = pages[currentPageIndex];
        if (currentPage && currentPage.canvasJson) {
            if (prevPageIndexRef.current !== currentPageIndex) {
                prevPageIndexRef.current = currentPageIndex;
                isInternalStateUpdateRef.current = true;
                c.loadFromJSON(currentPage.canvasJson).then(() => {
                    if (currentPage.canvasJson && Array.isArray(currentPage.canvasJson.objects)) {
                        const fabricObjects = c.getObjects();
                        currentPage.canvasJson.objects.forEach((jsonObj: any, idx: number) => {
                            if (fabricObjects[idx]) {
                                hydrateCustomProperties(jsonObj, fabricObjects[idx]);
                            }
                        });
                    }

                    const objectsToProcess = [...c.getObjects()];
                    objectsToProcess.forEach((obj) => {
                        if (obj.type === "group") {
                            (obj as any).subTargetCheck = true;
                        }

                        const customType = (obj as any).customType;
                        const componentType = (obj as any).puzzleComponent;
                        const wsCfg = (obj as any).wordSearchConfig;
                        const cwCfg = (obj as any).crosswordConfig;

                        if (customType === "word-search" && wsCfg && wsCfg.answerKey && wsCfg.answerKey.showSolution) {
                            const left = obj.left || 60;
                            const top = obj.top || 130;
                            const { titleGroup, gridGroup, bankGroup } = generateWordSearchComponentGroups(wsCfg);

                            if (componentType === "grid" && gridGroup) {
                                c.remove(obj);
                                gridGroup.set({ left, top });
                                attachPuzzleMetadata(gridGroup, "word-search", "grid", wsCfg);
                                c.add(gridGroup);
                            } else if (componentType === "title" && titleGroup) {
                                c.remove(obj);
                                titleGroup.set({ left, top });
                                attachPuzzleMetadata(titleGroup, "word-search", "title", wsCfg);
                                c.add(titleGroup);
                            } else if (componentType === "word-bank" && bankGroup) {
                                c.remove(obj);
                                bankGroup.set({ left, top });
                                attachPuzzleMetadata(bankGroup, "word-search", "word-bank", wsCfg);
                                c.add(bankGroup);
                            } else if (!componentType) {
                                const newObjs = generateAdvancedWordSearchObjects(wsCfg);
                                c.remove(obj);
                                const newGrp = new fabric.Group(newObjs, { left, top, subTargetCheck: true });
                                attachPuzzleMetadata(newGrp, "word-search", "full", wsCfg);
                                c.add(newGrp);
                            }
                        } else if (customType === "crossword" && cwCfg && cwCfg.answerKey && cwCfg.answerKey.showSolution) {
                            const left = obj.left || 60;
                            const top = obj.top || 130;
                            const { titleGroup, gridGroup, cluesGroup } = generateCrosswordComponentGroups(cwCfg);

                            if (componentType === "grid" && gridGroup) {
                                c.remove(obj);
                                gridGroup.set({ left, top });
                                attachPuzzleMetadata(gridGroup, "crossword", "grid", cwCfg);
                                c.add(gridGroup);
                            } else if (componentType === "title" && titleGroup) {
                                c.remove(obj);
                                titleGroup.set({ left, top });
                                attachPuzzleMetadata(titleGroup, "crossword", "title", cwCfg);
                                c.add(titleGroup);
                            } else if (componentType === "clues" && cluesGroup) {
                                c.remove(obj);
                                cluesGroup.set({ left, top });
                                attachPuzzleMetadata(cluesGroup, "crossword", "clues", cwCfg);
                                c.add(cluesGroup);
                            } else if (!componentType) {
                                const newObjs = generateAdvancedCrosswordObjects(cwCfg);
                                c.remove(obj);
                                const newGrp = new fabric.Group(newObjs, { left, top, subTargetCheck: true });
                                attachPuzzleMetadata(newGrp, "crossword", "full", cwCfg);
                                c.add(newGrp);
                            }
                        }
                    });

                    c.requestRenderAll();
                    setTimeout(() => {
                        isInternalStateUpdateRef.current = false;
                    }, 100);
                });
            }
        }
    }, [currentPageIndex, pages, fabricCanvasRef]);

    // Update Dimensions & Grid Snapping
    useEffect(() => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        c.setDimensions({ width: kdpSpecs.canvasWidth, height: kdpSpecs.canvasHeight });

        const snapHandler = (options: any) => {
            if (!gridSnapping) return;
            const target = options.target;
            if (!target) return;

            target.set({
                left: Math.round((target.left || 0) / gridSize) * gridSize,
                top: Math.round((target.top || 0) / gridSize) * gridSize,
            });
        };

        c.on("object:moving", snapHandler);
        return () => {
            c.off("object:moving", snapHandler);
        };
    }, [kdpSpecs.canvasWidth, kdpSpecs.canvasHeight, gridSnapping, gridSize, fabricCanvasRef]);

    // Handle Active Tool Canvas Selection State (Pause Object Selection during Drawing/Erasing)
    useEffect(() => {
        const c = fabricCanvasRef.current;
        if (!c) return;
        if (activeTool === "eraser" || activeTool === "draw") {
            c.selection = false;
            c.discardActiveObject();
            c.getObjects().forEach((obj) => {
                obj.selectable = false;
            });
            keepEraserMasksOnTop(c);
            c.requestRenderAll();
        } else if (activeTool === "select") {
            c.selection = true;
            c.getObjects().forEach((obj) => {
                obj.selectable = true;
            });
            keepEraserMasksOnTop(c);
            c.requestRenderAll();
        }
    }, [activeTool, fabricCanvasRef]);

    const [liveStrokePathD, setLiveStrokePathD] = useState<string>("");
    const [penPos, setPenPos] = useState<{ x: number; y: number } | null>(null);

    // Pointer Event Handlers for Draw & Eraser Tools
    const handlePointerDown = (e: React.PointerEvent) => {
        if (!canvasElRef.current) return;
        const rect = canvasElRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;

        if (activeTool === "draw") {
            isDrawingRef.current = true;
            strokePointsRef.current = [{ x, y, pressure: e.pressure || 0.5 }];
            setPenPos({ x, y });
        } else if (activeTool === "eraser") {
            isDrawingRef.current = true;
            eraserStartRef.current = { x, y };
            strokePointsRef.current = [{ x, y }];
            setPenPos({ x, y });

            const c = fabricCanvasRef.current;
            if (c && eraserMode === "stroke") {
                // Stroke selector mode: find and remove targeted vector stroke or snake path under pointer
                const targetObj: any = c.findTarget(e.nativeEvent as any);
                if (targetObj) {
                    const actualObj = targetObj.target || targetObj;
                    c.remove(actualObj);
                    c.discardActiveObject();
                    c.requestRenderAll();
                    saveState();
                    toast.success("Erased targeted vector object/segment!");
                }
            }
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!canvasElRef.current) return;
        const rect = canvasElRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;

        if (activeTool === "draw") {
            setPenPos({ x, y });
            if (isDrawingRef.current) {
                strokePointsRef.current.push({ x, y, pressure: e.pressure || 0.5 });
                const pts = strokePointsRef.current.map((p) => [p.x, p.y, p.pressure ?? 0.5]);
                const stroke = getStroke(pts, {
                    size: brushSize,
                    thinning: brushThinning,
                    smoothing: brushSmoothing,
                    streamline: 0.5,
                });
                const d = getSvgPathFromFreehandStroke(stroke);
                setLiveStrokePathD(d);
            }
        } else if (activeTool === "eraser") {
            setPenPos({ x, y });
            if (isDrawingRef.current && eraserStartRef.current) {
                if (eraserMode === "brush") {
                    strokePointsRef.current.push({ x, y });
                    const pts = strokePointsRef.current;
                    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
                    for (let i = 1; i < pts.length; i++) {
                        d += ` L ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
                    }
                    setLiveStrokePathD(d);
                } else if (eraserMode === "box") {
                    const sx = eraserStartRef.current.x;
                    const sy = eraserStartRef.current.y;
                    setLiveBoxRect({
                        x: Math.min(sx, x),
                        y: Math.min(sy, y),
                        w: Math.abs(x - sx),
                        h: Math.abs(y - sy),
                    });
                } else if (eraserMode === "cutter") {
                    setLiveCutLine({
                        x1: eraserStartRef.current.x,
                        y1: eraserStartRef.current.y,
                        x2: x,
                        y2: y,
                    });
                }
            }
        }
    };

    const handlePointerUp = () => {
        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;
        const c = fabricCanvasRef.current;

        if (activeTool === "draw") {
            setLiveStrokePathD("");
            if (!c || strokePointsRef.current.length < 2) return;

            const pathObj = createFreehandPath(strokePointsRef.current, {
                size: brushSize,
                color: brushColor,
                thinning: brushThinning,
                smoothing: brushSmoothing,
                style: brushStyle,
                opacity: brushOpacity,
            });

            if (pathObj) {
                c.add(pathObj);
                c.discardActiveObject();
                c.requestRenderAll();
                saveState();
            }
            strokePointsRef.current = [];
        } else if (activeTool === "eraser") {
            setLiveStrokePathD("");
            eraserStartRef.current = null;
            if (!c) return;

            if (eraserMode === "brush") {
                const pts = strokePointsRef.current;
                if (pts.length >= 1) {
                    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
                    if (pts.length === 1) {
                        d += ` L ${(pts[0].x + 0.1).toFixed(1)} ${pts[0].y.toFixed(1)}`;
                    } else {
                        for (let i = 1; i < pts.length; i++) {
                            d += ` L ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
                        }
                    }

                    const eraserMask = new fabric.Path(d, {
                        fill: "transparent",
                        stroke: "#ffffff",
                        strokeWidth: eraserSize,
                        strokeLineCap: eraserShape === "round" ? "round" : "square",
                        strokeLineJoin: eraserShape === "round" ? "round" : "miter",
                        selectable: true,
                    });
                    (eraserMask as any).customType = "eraser-stroke";
                    c.add(eraserMask);
                    c.bringObjectToFront(eraserMask);
                    c.discardActiveObject();
                    c.requestRenderAll();
                    saveState();
                    toast.success(`Erased path area with ${eraserSize}px ${eraserShape} brush`);
                }
            } else if (eraserMode === "box" && liveBoxRect) {
                if (liveBoxRect.w > 4 && liveBoxRect.h > 4) {
                    const boxMask = new fabric.Rect({
                        left: liveBoxRect.x,
                        top: liveBoxRect.y,
                        width: liveBoxRect.w,
                        height: liveBoxRect.h,
                        fill: "#ffffff",
                        stroke: "none",
                        selectable: true,
                    });
                    (boxMask as any).customType = "eraser-box";
                    c.add(boxMask);
                    c.bringObjectToFront(boxMask);
                    c.discardActiveObject();
                    c.requestRenderAll();
                    saveState();
                    toast.success(`Erased ${Math.round(liveBoxRect.w)}×${Math.round(liveBoxRect.h)}px box area`);
                }
                setLiveBoxRect(null);
            } else if (eraserMode === "cutter" && liveCutLine) {
                const cutMask = new fabric.Line([liveCutLine.x1, liveCutLine.y1, liveCutLine.x2, liveCutLine.y2], {
                    stroke: "#ffffff",
                    strokeWidth: eraserSize,
                    strokeLineCap: eraserShape === "round" ? "round" : "square",
                    selectable: true,
                });
                (cutMask as any).customType = "eraser-cut";
                c.add(cutMask);
                c.bringObjectToFront(cutMask);
                c.discardActiveObject();
                c.requestRenderAll();
                saveState();
                toast.success("Cut line segment!");
                setLiveCutLine(null);
            }
            strokePointsRef.current = [];
        }
    };

    return (
        <div
            ref={containerRef}
            className="flex-1 bg-slate-200/70 dark:bg-slate-950 overflow-auto flex items-center justify-center p-8 relative select-none"
        >
            {/* Page Canvas Container with Shadow & Amazon KDP Overlay */}
            <div
                className="relative bg-white shadow-2xl transition-transform origin-center border border-slate-300 dark:border-slate-800"
                style={{
                    width: `${kdpSpecs.canvasWidth}px`,
                    height: `${kdpSpecs.canvasHeight}px`,
                    transform: `scale(${zoom})`,
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                {/* LIVE FREEHAND INK & PEN CURSOR OVERLAY */}
                {activeTool === "draw" && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible">
                        {liveStrokePathD && <path d={liveStrokePathD} fill={brushColor} />}
                        {penPos && (
                            <g transform={`translate(${penPos.x}, ${penPos.y})`}>
                                {/* Brush tip size indicator */}
                                <circle r={Math.max(brushSize / 2, 3)} fill={brushColor} opacity="0.65" stroke="#ffffff" strokeWidth="1.5" />
                                {/* Pen Tip Icon */}
                                <path
                                    d="M 0 0 L 14 -14 L 18 -10 L 4 4 Z M 0 0 L -3 5 L 2 3 Z"
                                    fill="#2563eb"
                                    stroke="#ffffff"
                                    strokeWidth="1"
                                />
                            </g>
                        )}
                    </svg>
                )}

                {/* LIVE ERASER CURSOR OVERLAY */}
                {activeTool === "eraser" && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible">
                        {eraserMode === "brush" && liveStrokePathD && (
                            <path
                                d={liveStrokePathD}
                                stroke="#ffffff"
                                strokeWidth={eraserSize}
                                strokeLinecap={eraserShape === "round" ? "round" : "square"}
                                strokeLinejoin={eraserShape === "round" ? "round" : "miter"}
                                fill="none"
                                opacity={0.85}
                            />
                        )}
                        {eraserMode === "box" && liveBoxRect && (
                            <rect
                                x={liveBoxRect.x}
                                y={liveBoxRect.y}
                                width={liveBoxRect.w}
                                height={liveBoxRect.h}
                                fill="rgba(244, 63, 94, 0.15)"
                                stroke="#f43f5e"
                                strokeWidth={2}
                                strokeDasharray="6 4"
                            />
                        )}
                        {eraserMode === "cutter" && liveCutLine && (
                            <line
                                x1={liveCutLine.x1}
                                y1={liveCutLine.y1}
                                x2={liveCutLine.x2}
                                y2={liveCutLine.y2}
                                stroke="#f43f5e"
                                strokeWidth={eraserSize}
                                strokeDasharray="4 4"
                                strokeLinecap={eraserShape === "round" ? "round" : "square"}
                            />
                        )}
                        {penPos && (
                            <rect
                                x={penPos.x - eraserSize / 2}
                                y={penPos.y - eraserSize / 2}
                                width={eraserSize}
                                height={eraserSize}
                                rx={eraserShape === "round" ? eraserSize / 2 : 2}
                                ry={eraserShape === "round" ? eraserSize / 2 : 2}
                                fill="rgba(244, 63, 94, 0.2)"
                                stroke="#f43f5e"
                                strokeWidth={2}
                                strokeDasharray="3 3"
                            />
                        )}
                    </svg>
                )}

                {/* SVG Grid Overlay */}
                {showGrid && (
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-25"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <pattern
                                id="worksheet-grid-pattern"
                                width={gridSize}
                                height={gridSize}
                                patternUnits="userSpaceOnUse"
                            >
                                <path
                                    d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                                    fill="none"
                                    stroke="#94a3b8"
                                    strokeWidth="0.5"
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#worksheet-grid-pattern)" />
                    </svg>
                )}

                {/* AMAZON KDP PRINT SAFETY GUIDES OVERLAY */}
                {showKdpGuides && (
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none z-20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* 1. Red Trim Line (where Amazon KDP blade cuts) */}
                        {kdpBleed && (
                            <rect
                                x={kdpSpecs.cutBleed / 2}
                                y={kdpSpecs.cutBleed}
                                width={kdpSpecs.trimWidth}
                                height={kdpSpecs.trimHeight}
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="1.5"
                                strokeDasharray="6,4"
                            />
                        )}

                        {/* 2. Orange Content Safety Zone (Keep text inside this box) */}
                        <rect
                            x={kdpSpecs.safeLeft}
                            y={kdpSpecs.safeTop}
                            width={kdpSpecs.safeWidth}
                            height={kdpSpecs.safeHeight}
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="1.5"
                            strokeDasharray="4,4"
                        />

                        {/* 3. Blue Inside Spine Gutter Zone */}
                        <rect
                            x={0}
                            y={kdpSpecs.cutBleed}
                            width={kdpSpecs.gutterMargin}
                            height={kdpSpecs.trimHeight}
                            fill="#3b82f6"
                            fillOpacity="0.08"
                            stroke="#3b82f6"
                            strokeWidth="1"
                            strokeDasharray="3,3"
                        />

                        {/* Legend Badge */}
                        <text x={kdpSpecs.safeLeft + 10} y={kdpSpecs.safeTop + 18} fill="#f59e0b" fontSize="11" fontWeight="bold" fontFamily="Inter">
                            KDP Safe Zone Margin (Keep text inside)
                        </text>
                        <text x={10} y={kdpSpecs.safeTop + 35} fill="#3b82f6" fontSize="10" fontWeight="bold" fontFamily="Inter">
                            Inside Spine Gutter ({kdpSpecs.gutterMargin}px)
                        </text>
                    </svg>
                )}

                {/* Fabric HTML5 Canvas Container Isolation */}
                <div ref={canvasWrapperRef} className="w-full h-full">
                    <canvas ref={canvasElRef} />
                </div>
            </div>
        </div>
    );
};
