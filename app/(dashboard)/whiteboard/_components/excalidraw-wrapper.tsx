'use client';
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

export default function ExcalidrawWrapper({ libraryItems = [] }: { libraryItems?: any[] }) {
    return (
        <div style={{ height: "100%", width: "100%" }}>
            <Excalidraw
                initialData={{
                    libraryItems: libraryItems,
                    elements: JSON.parse(localStorage.getItem("whiteboard-data") || "[]"),
                    appState: {
                        ...JSON.parse(localStorage.getItem("whiteboard-app-state") || "{}"),
                        collaborators: new Map(),
                    },
                    scrollToContent: true
                }}
                onChange={(elements, appState) => {
                    localStorage.setItem("whiteboard-data", JSON.stringify(elements));
                    localStorage.setItem("whiteboard-app-state", JSON.stringify({
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
