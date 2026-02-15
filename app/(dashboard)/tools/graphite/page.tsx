import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Graphite Editor | K Business Academy",
    description: "A free, open-source 2D vector graphics editor.",
};

export default function GraphitePage() {
    return (
        <div className="h-full w-full p-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[calc(100vh-140px)]">
                <iframe
                    src="https://editor.graphite.rs/"
                    className="w-full h-full border-none"
                    allow="clipboard-read; clipboard-write"
                    title="Graphite Editor"
                />
            </div>
        </div>
    );
}
