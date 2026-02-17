'use client';
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

export default function ExcalidrawWrapper({ libraryItems = [], businessId = "default" }: { libraryItems?: any[], businessId?: string }) {
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
                onChange={(elements, appState) => {
                    localStorage.setItem(`whiteboard-data-${businessId}`, JSON.stringify(elements));
                    localStorage.setItem(`whiteboard-app-state-${businessId}`, JSON.stringify({
                        viewBackgroundColor: appState.viewBackgroundColor,
                        zoom: appState.zoom,
                        scrollX: appState.scrollX,
                        scrollY: appState.scrollY,
                    }));
                }}
            />
        </div>
    );
}
