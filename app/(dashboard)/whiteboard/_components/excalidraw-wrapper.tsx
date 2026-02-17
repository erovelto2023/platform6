'use client';
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useCallback, useRef } from "react";

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

export default function ExcalidrawWrapper({ libraryItems = [], businessId = "default" }: { libraryItems?: any[], businessId?: string }) {
    const saveToLocalStorage = useDebouncedCallback((elements, appState) => {
        localStorage.setItem(`whiteboard-data-${businessId}`, JSON.stringify(elements));
        localStorage.setItem(`whiteboard-app-state-${businessId}`, JSON.stringify({
            viewBackgroundColor: appState.viewBackgroundColor,
            zoom: appState.zoom,
            scrollX: appState.scrollX,
            scrollY: appState.scrollY,
        }));
    }, 1000);

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <Excalidraw
                initialData={{
                    libraryItems: libraryItems,
                    elements: JSON.parse(localStorage.getItem(`whiteboard-data-${businessId}`) || "[]"),
                    appState: {
                        ...JSON.parse(localStorage.getItem(`whiteboard-app-state-${businessId}`) || "{}"),
                        collaborators: new Map(),
                    },
                    scrollToContent: true
                }}
                onChange={saveToLocalStorage}
            />
        </div>
    );
}
