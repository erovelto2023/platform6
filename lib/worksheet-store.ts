import { create } from "zustand";

export interface WorksheetPage {
    id: string;
    name: string;
    canvasJson: any;
    thumbnail?: string;
}

export interface DocumentSnapshot {
    pages: WorksheetPage[];
    currentPageIndex: number;
}

export interface KdpSpecs {
    trimWidth: number;          // in pixels @ 96 DPI
    trimHeight: number;         // in pixels @ 96 DPI
    canvasWidth: number;        // total page width including bleed
    canvasHeight: number;       // total page height including bleed
    gutterMargin: number;       // inside margin in px based on page count
    outsideMargin: number;      // top, bottom, outside margin in px
    cutBleed: number;           // 0.125" = 12px
    safeTop: number;
    safeLeft: number;
    safeWidth: number;
    safeHeight: number;
}

export interface CustomImageItem {
    id: string;
    name: string;
    dataUrl: string;
    addedAt: number;
}

export interface CustomFontItem {
    id: string;
    name: string;
    fontFamily: string;
    dataUrl: string;
    addedAt: number;
}

export interface WorksheetState {
    // Project Metadata
    name: string;
    width: number;
    height: number;
    pageSizeKey: string;

    // Amazon KDP Settings
    kdpBleed: boolean;
    kdpPageCount: number;
    showKdpGuides: boolean;

    // Multi-page State
    pages: WorksheetPage[];
    currentPageIndex: number;

    // Undo / Redo History Stack
    history: DocumentSnapshot[];
    historyIndex: number;

    // Viewport & Canvas Controls
    zoom: number;
    showGrid: boolean;
    gridSnapping: boolean;
    gridSize: number;
    marginsEnabled: boolean;

    // Active Tooling State
    activeTool: "select" | "draw" | "text" | "tracing" | "shape" | "line" | "eraser" | "pan";
    brushSize: number;
    brushColor: string;
    brushThinning: number;
    brushSmoothing: number;
    brushStyle: "pencil" | "pen" | "calligraphy" | "marker" | "highlighter" | "crayon" | "chalk" | "airbrush" | "watercolor" | "neon" | "glitter" | "vector";
    brushOpacity: number;
    fillColor: string;
    strokeColor: string;
    strokeWidth: number;
    strokeStyle: "solid" | "dashed" | "dotted";

    // Active Canvas Selection Info
    selectedObjectId: string | null;
    selectedObjectType: string | null;
    selectedObjectProps: any;

    // Custom User Library Assets
    customImages: CustomImageItem[];
    customFonts: CustomFontItem[];

    // Actions
    addCustomImage: (name: string, dataUrl: string) => void;
    removeCustomImage: (id: string) => void;
    addCustomFont: (name: string, fontFamily: string, dataUrl: string) => void;
    removeCustomFont: (id: string) => void;

    setName: (name: string) => void;
    setPageSize: (sizeKey: string, width: number, height: number) => void;
    setKdpBleed: (bleed: boolean) => void;
    setKdpPageCount: (count: number) => void;
    setShowKdpGuides: (show: boolean) => void;

    setCurrentPageIndex: (index: number) => void;
    addPage: () => void;
    duplicatePage: (index: number, currentCanvasJson?: any) => void;
    duplicatePageWithSolutions: (index: number, currentCanvasJson?: any) => void;
    deletePage: (index: number) => void;
    reorderPages: (oldIndex: number, newIndex: number) => void;
    updateCurrentPageCanvas: (canvasJson: any, thumbnail?: string) => void;

    // Helper method to compute exact KDP specs
    getKdpSpecs: () => KdpSpecs;

    // Undo/Redo
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;

    setZoom: (zoom: number) => void;
    setShowGrid: (show: boolean) => void;
    setGridSnapping: (snap: boolean) => void;
    setMarginsEnabled: (enabled: boolean) => void;

    setActiveTool: (tool: "select" | "draw" | "text" | "tracing" | "shape" | "line" | "eraser" | "pan") => void;
    setBrushProps: (props: Partial<{ size: number; color: string; thinning: number; smoothing: number; style: any; opacity: number; fillColor: string; strokeColor: string; strokeWidth: number; strokeStyle: any }>) => void;

    setSelectedObject: (id: string | null, type: string | null, props?: any) => void;
    updateSelectedObjectProps: (props: any) => void;
}

const initialPages: WorksheetPage[] = [
    {
        id: "page-1",
        name: "Page 1",
        canvasJson: { version: "5.3.0", objects: [] },
    },
];

export const useWorksheetStore = create<WorksheetState>((set, get) => {
    // Helper to push history state
    const pushHistory = (pages: WorksheetPage[], currentPageIndex: number) => {
        const { history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({
            pages: JSON.parse(JSON.stringify(pages)),
            currentPageIndex,
        });
        if (newHistory.length > 50) newHistory.shift();
        return {
            pages,
            currentPageIndex,
            history: newHistory,
            historyIndex: newHistory.length - 1,
        };
    };

    return {
        name: "Untitled Worksheet Project",
        width: 816, // Letter 8.5 x 11 in @ 96 DPI
        height: 1056,
        pageSizeKey: "8.5x11",

        // KDP Settings
        kdpBleed: false,
        kdpPageCount: 100,
        showKdpGuides: true,

        pages: initialPages,
        currentPageIndex: 0,

        history: [{ pages: JSON.parse(JSON.stringify(initialPages)), currentPageIndex: 0 }],
        historyIndex: 0,

        zoom: 0.7,
        showGrid: true,
        gridSnapping: true,
        gridSize: 24,
        marginsEnabled: true,

        activeTool: "select",
        brushSize: 8,
        brushColor: "#0f172a",
        brushThinning: 0.5,
        brushSmoothing: 0.5,
        brushStyle: "pen",
        brushOpacity: 1.0,
        fillColor: "#3b82f6",
        strokeColor: "#0f172a",
        strokeWidth: 2,
        strokeStyle: "solid",

        selectedObjectId: null,
        selectedObjectType: null,
        selectedObjectProps: null,

        customImages: [],
        customFonts: [],

        addCustomImage: (name: string, dataUrl: string) =>
            set((state) => ({
                customImages: [
                    { id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, name, dataUrl, addedAt: Date.now() },
                    ...state.customImages,
                ],
            })),

        removeCustomImage: (id: string) =>
            set((state) => ({
                customImages: state.customImages.filter((img) => img.id !== id),
            })),

        addCustomFont: (name: string, fontFamily: string, dataUrl: string) =>
            set((state) => ({
                customFonts: [
                    { id: `font_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, name, fontFamily, dataUrl, addedAt: Date.now() },
                    ...state.customFonts,
                ],
            })),

        removeCustomFont: (id: string) =>
            set((state) => ({
                customFonts: state.customFonts.filter((f) => f.id !== id),
            })),

        setName: (name: string) => set({ name }),

        setPageSize: (pageSizeKey: string, width: number, height: number) => set({ pageSizeKey, width, height }),

        setKdpBleed: (kdpBleed: boolean) => set({ kdpBleed }),
        setKdpPageCount: (kdpPageCount: number) => set({ kdpPageCount }),
        setShowKdpGuides: (showKdpGuides: boolean) => set({ showKdpGuides }),

        getKdpSpecs: (): KdpSpecs => {
            const { width, height, kdpBleed, kdpPageCount } = get();
            const dpi = 96;

            // Trim dimensions in px
            const trimWidth = width;
            const trimHeight = height;

            // Bleed calculations (0.125" = 12px @ 96 DPI)
            const cutBleed = kdpBleed ? Math.round(0.125 * dpi) : 0;
            const canvasWidth = trimWidth + cutBleed;
            const canvasHeight = trimHeight + (cutBleed * 2);

            // Gutter inside margin based on Amazon KDP page count table
            let gutterInches = 0.375;
            if (kdpPageCount >= 701) gutterInches = 0.875;
            else if (kdpPageCount >= 501) gutterInches = 0.750;
            else if (kdpPageCount >= 301) gutterInches = 0.625;
            else if (kdpPageCount >= 151) gutterInches = 0.500;

            const gutterMargin = Math.round(gutterInches * dpi);

            // Outside margin (0.25" without bleed, 0.375" with bleed)
            const outsideInches = kdpBleed ? 0.375 : 0.25;
            const outsideMargin = Math.round(outsideInches * dpi);

            const safeTop = cutBleed + outsideMargin;
            const safeLeft = gutterMargin;
            const safeWidth = canvasWidth - gutterMargin - outsideMargin;
            const safeHeight = canvasHeight - (cutBleed * 2) - (outsideMargin * 2);

            return {
                trimWidth,
                trimHeight,
                canvasWidth,
                canvasHeight,
                gutterMargin,
                outsideMargin,
                cutBleed,
                safeTop,
                safeLeft,
                safeWidth,
                safeHeight,
            };
        },

        setCurrentPageIndex: (currentPageIndex: number) => set({ currentPageIndex, selectedObjectId: null }),

        addPage: () => {
            const { pages } = get();
            const newPageIndex = pages.length + 1;
            const newPage: WorksheetPage = {
                id: `page-${Date.now()}`,
                name: `Page ${newPageIndex}`,
                canvasJson: { version: "5.3.0", objects: [] },
            };
            const nextPages = [...pages, newPage];
            set(pushHistory(nextPages, pages.length));
        },

        duplicatePage: (index: number, currentCanvasJson?: any) => {
            const { pages } = get();
            if (index < 0 || index >= pages.length) return;
            const targetPage = pages[index];
            const jsonToCopy = currentCanvasJson || targetPage.canvasJson;
            const clonedJson = JSON.parse(JSON.stringify(jsonToCopy));

            const newPage: WorksheetPage = {
                id: `page-${Date.now()}`,
                name: `${targetPage.name || "Page"} (Copy)`,
                canvasJson: clonedJson,
                thumbnail: targetPage.thumbnail,
            };

            const nextPages = [...pages];
            if (currentCanvasJson) {
                nextPages[index] = { ...targetPage, canvasJson: currentCanvasJson };
            }
            nextPages.splice(index + 1, 0, newPage);
            set(pushHistory(nextPages, index + 1));
        },

        duplicatePageWithSolutions: (index: number, currentCanvasJson?: any) => {
            const { pages } = get();
            if (index < 0 || index >= pages.length) return;
            const targetPage = pages[index];
            const jsonToCopy = currentCanvasJson || targetPage.canvasJson;
            const clonedJson = JSON.parse(JSON.stringify(jsonToCopy));

            if (clonedJson && Array.isArray(clonedJson.objects)) {
                const enableSolutions = (obj: any) => {
                    if (obj.wordSearchConfig) {
                        obj.wordSearchConfig.answerKey = obj.wordSearchConfig.answerKey || {};
                        obj.wordSearchConfig.answerKey.showSolution = true;
                    }
                    if (obj.crosswordConfig) {
                        obj.crosswordConfig.answerKey = obj.crosswordConfig.answerKey || {};
                        obj.crosswordConfig.answerKey.showSolution = true;
                    }
                    if (obj.puzzleConfig) {
                        obj.puzzleConfig.showAnswerKey = true;
                        obj.puzzleConfig.showSolution = true;
                    }
                    if (Array.isArray(obj.objects)) {
                        obj.objects.forEach(enableSolutions);
                    }
                };
                clonedJson.objects.forEach(enableSolutions);
            }

            const newPage: WorksheetPage = {
                id: `page-${Date.now()}`,
                name: `${targetPage.name || "Page"} (Solutions)`,
                canvasJson: clonedJson,
                thumbnail: targetPage.thumbnail,
            };

            const nextPages = [...pages];
            if (currentCanvasJson) {
                nextPages[index] = { ...targetPage, canvasJson: currentCanvasJson };
            }
            nextPages.splice(index + 1, 0, newPage);
            set(pushHistory(nextPages, index + 1));
        },

        deletePage: (index: number) => {
            const { pages, currentPageIndex } = get();
            if (pages.length <= 1) return;
            const nextPages = pages.filter((_, i) => i !== index);
            const nextPageIndex = Math.min(currentPageIndex, nextPages.length - 1);
            set(pushHistory(nextPages, nextPageIndex));
        },

        reorderPages: (oldIndex: number, newIndex: number) => {
            const { pages } = get();
            if (oldIndex < 0 || oldIndex >= pages.length || newIndex < 0 || newIndex >= pages.length) return;
            const updated = [...pages];
            const [moved] = updated.splice(oldIndex, 1);
            updated.splice(newIndex, 0, moved);
            set(pushHistory(updated, newIndex));
        },

        updateCurrentPageCanvas: (canvasJson: any, thumbnail?: string) => {
            const { pages, currentPageIndex } = get();
            if (!pages[currentPageIndex]) return;
            const updatedPages = [...pages];
            updatedPages[currentPageIndex] = {
                ...updatedPages[currentPageIndex],
                canvasJson,
                thumbnail: thumbnail || updatedPages[currentPageIndex].thumbnail,
            };
            set(pushHistory(updatedPages, currentPageIndex));
        },

        undo: () => {
            const { history, historyIndex } = get();
            if (historyIndex > 0) {
                const prevIndex = historyIndex - 1;
                const snapshot = history[prevIndex];
                set({
                    pages: JSON.parse(JSON.stringify(snapshot.pages)),
                    currentPageIndex: snapshot.currentPageIndex,
                    historyIndex: prevIndex,
                    selectedObjectId: null,
                });
            }
        },

        redo: () => {
            const { history, historyIndex } = get();
            if (historyIndex < history.length - 1) {
                const nextIndex = historyIndex + 1;
                const snapshot = history[nextIndex];
                set({
                    pages: JSON.parse(JSON.stringify(snapshot.pages)),
                    currentPageIndex: snapshot.currentPageIndex,
                    historyIndex: nextIndex,
                    selectedObjectId: null,
                });
            }
        },

        canUndo: () => get().historyIndex > 0,

        canRedo: () => get().historyIndex < get().history.length - 1,

        setZoom: (zoom: number) => set({ zoom }),
        setShowGrid: (showGrid: boolean) => set({ showGrid }),
        setGridSnapping: (gridSnapping: boolean) => set({ gridSnapping }),
        setMarginsEnabled: (marginsEnabled: boolean) => set({ marginsEnabled }),

        setActiveTool: (activeTool: "select" | "draw" | "text" | "tracing" | "shape" | "line" | "eraser" | "pan") => set({ activeTool }),

        setBrushProps: (props: Partial<{ size: number; color: string; thinning: number; smoothing: number; style: any; opacity: number; fillColor: string; strokeColor: string; strokeWidth: number; strokeStyle: any }>) =>
            set((state) => ({
                brushSize: props.size ?? state.brushSize,
                brushColor: props.color ?? state.brushColor,
                brushThinning: props.thinning ?? state.brushThinning,
                brushSmoothing: props.smoothing ?? state.brushSmoothing,
                brushStyle: props.style ?? state.brushStyle,
                brushOpacity: props.opacity ?? state.brushOpacity,
                fillColor: props.fillColor ?? state.fillColor,
                strokeColor: props.strokeColor ?? state.strokeColor,
                strokeWidth: props.strokeWidth ?? state.strokeWidth,
                strokeStyle: props.strokeStyle ?? state.strokeStyle,
            })),

        setSelectedObject: (selectedObjectId: string | null, selectedObjectType: string | null, props: any = null) =>
            set({ selectedObjectId, selectedObjectType, selectedObjectProps: props }),

        updateSelectedObjectProps: (props: any) =>
            set((state) => ({
                selectedObjectProps: { ...state.selectedObjectProps, ...props },
            })),
    };
});
