"use client";

import React, { useEffect, useRef, useCallback } from "react";
import * as fabric from "fabric";
import { useWorksheetStore } from "@/lib/worksheet-store";
import { createFreehandPath } from "@/lib/worksheet-fabric";

interface WorksheetCanvasContainerProps {
    fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
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

    // Debounced Save canvas state helper
    const saveStateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const saveState = useCallback(() => {
        if (isInternalStateUpdateRef.current) return;
        const c = fabricCanvasRef.current;
        if (!c) return;

        if (saveStateTimeoutRef.current) clearTimeout(saveStateTimeoutRef.current);

        saveStateTimeoutRef.current = setTimeout(() => {
            if (isInternalStateUpdateRef.current) return;
            try {
                const json = c.toJSON();
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
        }, 150);
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

        // Selection Listener
        const handleSelection = () => {
            const activeObj = c.getActiveObject();
            if (!activeObj) {
                setSelectedObject(null, null);
                return;
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
                    opacity: activeObj.opacity,
                    fontSize: (activeObj as any).fontSize,
                    fontFamily: (activeObj as any).fontFamily,
                }
            );
        };

        c.on("selection:created", handleSelection);
        c.on("selection:updated", handleSelection);
        c.on("selection:cleared", () => setSelectedObject(null, null));

        // Object modification listeners
        c.on("object:modified", saveState);

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

    // Perfect Freehand Pointer Events
    const handlePointerDown = (e: React.PointerEvent) => {
        if (activeTool !== "draw" || !canvasElRef.current) return;
        isDrawingRef.current = true;
        const rect = canvasElRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;
        strokePointsRef.current = [{ x, y, pressure: e.pressure || 0.5 }];
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDrawingRef.current || activeTool !== "draw" || !canvasElRef.current) return;
        const rect = canvasElRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;
        strokePointsRef.current.push({ x, y, pressure: e.pressure || 0.5 });
    };

    const handlePointerUp = () => {
        if (!isDrawingRef.current || activeTool !== "draw") return;
        isDrawingRef.current = false;
        const c = fabricCanvasRef.current;
        if (!c || strokePointsRef.current.length < 2) return;

        const pathObj = createFreehandPath(strokePointsRef.current, {
            size: brushSize,
            color: brushColor,
            thinning: brushThinning,
            smoothing: brushSmoothing,
        });

        if (pathObj) {
            c.add(pathObj);
            c.requestRenderAll();
            saveState();
        }
        strokePointsRef.current = [];
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
