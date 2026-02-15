import dynamic from "next/dynamic";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Whiteboard | K Business Academy",
    description: "A virtual whiteboard for brainstorming and planning.",
};

const ExcalidrawWrapper = dynamic(
    () => import("./_components/excalidraw-wrapper"),
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full flex items-center justify-center bg-slate-50 text-slate-400">
                Loading Whiteboard...
            </div>
        )
    }
);

export default function WhiteboardPage() {
    return (
        <div className="h-full w-full p-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[calc(100vh-140px)]">
                <ExcalidrawWrapper />
            </div>
        </div>
    );
}
