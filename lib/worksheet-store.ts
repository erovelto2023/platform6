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

export interface WorksheetState {
    // Project Metadata
    name: string;
    width: number;
    height: number;
    pageSizeKey: string;

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
    bleedEnabled: boolean;

    // Active Tooling State
    activeTool: "select" | "draw" | "text" | "tracing" | "shape" | "pan";
    brushSize: number;
    brushColor: string;
    brushThinning: number;
    brushSmoothing: number;

    // Active Canvas Selection Info
    selectedObjectId: string | null;
    selectedObjectType: string | null;
    selectedObjectProps: any;

    // Actions
    setName: (name: string) => void;
    setPageSize: (sizeKey: string, width: number, height: number) => void;
    setCurrentPageIndex: (index: number) => void;
    addPage: () => void;
    duplicatePage: (index: number) => void;
    deletePage: (index: number) => void;
    reorderPages: (oldIndex: number, newIndex: number) => void;
    updateCurrentPageCanvas: (canvasJson: any, thumbnail?: string) => void;

    // Undo/Redo
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;

    setZoom: (zoom: number) => void;
    setShowGrid: (show: boolean) => void;
    setGridSnapping: (snap: boolean) => void;
    setMarginsEnabled: (enabled: boolean) => void;
    setBleedEnabled: (enabled: boolean) => void;

    setActiveTool: (tool: "select" | "draw" | "text" | "tracing" | "shape" | "pan") => void;
    setBrushProps: (props: Partial<{ size: number; color: string; thinning: number; smoothing: number }>) => void;

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
        // Limit history to 50 snapshots
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

        pages: initialPages,
        currentPageIndex: 0,

        history: [{ pages: JSON.parse(JSON.stringify(initialPages)), currentPageIndex: 0 }],
        historyIndex: 0,

        zoom: 1,
        showGrid: true,
        gridSnapping: true,
        gridSize: 24,
        marginsEnabled: true,
        bleedEnabled: false,

        activeTool: "select",
        brushSize: 8,
        brushColor: "#0f172a",
        brushThinning: 0.5,
        brushSmoothing: 0.5,

        selectedObjectId: null,
        selectedObjectType: null,
        selectedObjectProps: null,

        setName: (name: string) => set({ name }),

        setPageSize: (pageSizeKey: string, width: number, height: number) => set({ pageSizeKey, width, height }),

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

        duplicatePage: (index: number) => {
            const { pages } = get();
            if (index < 0 || index >= pages.length) return;
            const targetPage = pages[index];
            const newPage: WorksheetPage = {
                id: `page-${Date.now()}`,
                name: `${targetPage.name} (Copy)`,
                canvasJson: JSON.parse(JSON.stringify(targetPage.canvasJson)),
                thumbnail: targetPage.thumbnail,
            };
            const nextPages = [...pages];
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
        setBleedEnabled: (bleedEnabled: boolean) => set({ bleedEnabled }),

        setActiveTool: (activeTool: "select" | "draw" | "text" | "tracing" | "shape" | "pan") => set({ activeTool }),

        setBrushProps: (props: Partial<{ size: number; color: string; thinning: number; smoothing: number }>) =>
            set((state) => ({
                brushSize: props.size ?? state.brushSize,
                brushColor: props.color ?? state.brushColor,
                brushThinning: props.thinning ?? state.brushThinning,
                brushSmoothing: props.smoothing ?? state.brushSmoothing,
            })),

        setSelectedObject: (selectedObjectId: string | null, selectedObjectType: string | null, props: any = null) =>
            set({ selectedObjectId, selectedObjectType, selectedObjectProps: props }),

        updateSelectedObjectProps: (props: any) =>
            set((state) => ({
                selectedObjectProps: { ...state.selectedObjectProps, ...props },
            })),
    };
});
