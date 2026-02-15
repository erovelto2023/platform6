'use client';
import { Excalidraw } from "@excalidraw/excalidraw";

export default function ExcalidrawWrapper() {
    return (
        <div style={{ height: "100%", width: "100%" }}>
            <Excalidraw />
        </div>
    );
}
