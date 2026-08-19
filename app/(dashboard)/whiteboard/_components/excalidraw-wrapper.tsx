'use client';

import { Excalidraw } from "@excalidraw/excalidraw";
import { useCallback, useRef, useEffect, useState, Component, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

function useDebouncedCallback<T extends (...args: any[]) => any>(callback: T, delay: number) {
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    return useCallback((...args: Parameters<T>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class WhiteboardErrorBoundary extends Component<{ children: ReactNode, businessId: string }, ErrorBoundaryState> {
    constructor(props: { children: ReactNode, businessId: string }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error("Whiteboard Error Caught:", error, errorInfo);
    }

    handleReset = () => {
        try {
            localStorage.removeItem(`whiteboard-data-${this.props.businessId}`);
            localStorage.removeItem(`whiteboard-app-state-${this.props.businessId}`);
        } catch(e) {}
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-full w-full flex flex-col items-center justify-center bg-slate-950 p-8 text-center font-sans space-y-4 rounded-xl border border-slate-800">
                    <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-100 uppercase tracking-tight">Whiteboard Canvas Recovered</h3>
                        <p className="text-xs font-mono text-slate-400 mt-1 max-w-md">
                            {this.state.error?.message || "An issue occurred while initializing the visual canvas."}
                        </p>
                    </div>
                    <button
                        onClick={this.handleReset}
                        className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                        <RotateCcw size={14} /> Clear Cache & Reset Canvas
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

function InnerExcalidrawWrapper({ libraryItems = [], businessId = "default" }: { libraryItems?: any[], businessId?: string }) {
    const [initialData, setInitialData] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const rawElements = localStorage.getItem(`whiteboard-data-${businessId}`);
            const rawAppState = localStorage.getItem(`whiteboard-app-state-${businessId}`);

            let parsedElements: any[] = [];
            if (rawElements) {
                try {
                    const parsed = JSON.parse(rawElements);
                    if (Array.isArray(parsed)) parsedElements = parsed;
                } catch (e) {
                    console.error("Corrupted whiteboard elements in localStorage:", e);
                }
            }

            let parsedAppState: any = {};
            if (rawAppState) {
                try {
                    const parsed = JSON.parse(rawAppState);
                    if (typeof parsed === 'object' && parsed !== null) parsedAppState = parsed;
                } catch (e) {
                    console.error("Corrupted whiteboard appState in localStorage:", e);
                }
            }

            setInitialData({
                libraryItems: Array.isArray(libraryItems) ? libraryItems : [],
                elements: parsedElements,
                appState: {
                    ...parsedAppState,
                    collaborators: new Map(),
                },
                scrollToContent: true
            });
        } catch (err) {
            console.error("Error reading whiteboard initial state:", err);
            setInitialData({
                libraryItems: [],
                elements: [],
                appState: { collaborators: new Map() },
                scrollToContent: true
            });
        }
    }, [businessId, libraryItems]);

    const saveToLocalStorage = useDebouncedCallback((elements, appState) => {
        try {
            localStorage.setItem(`whiteboard-data-${businessId}`, JSON.stringify(elements));
            localStorage.setItem(`whiteboard-app-state-${businessId}`, JSON.stringify({
                viewBackgroundColor: appState.viewBackgroundColor,
                zoom: appState.zoom,
                scrollX: appState.scrollX,
                scrollY: appState.scrollY,
            }));
        } catch (e) {
            console.error("Failed to save whiteboard data to localStorage:", e);
        }
    }, 1000);

    if (!mounted || !initialData) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-slate-950 text-cyan-400 font-mono text-xs">
                Loading Whiteboard Engine...
            </div>
        );
    }

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <Excalidraw
                initialData={initialData}
                onChange={saveToLocalStorage}
            />
        </div>
    );
}

export default function ExcalidrawWrapper({ libraryItems = [], businessId = "default" }: { libraryItems?: any[], businessId?: string }) {
    return (
        <WhiteboardErrorBoundary businessId={businessId}>
            <InnerExcalidrawWrapper libraryItems={libraryItems} businessId={businessId} />
        </WhiteboardErrorBoundary>
    );
}
