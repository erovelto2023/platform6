import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
    title: "Design Editor | K Business Academy",
    description: "Create stunning graphics and designs with our easy-to-use editor.",
};

const DesignEditorDetails = dynamic(
    () => import("./_components/editor-wrapper"),
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full flex items-center justify-center bg-slate-50 text-slate-400">
                Loading Design Editor...
            </div>
        )
    }
);

export default function DesignEditorPage() {
    return (
        <div className="h-[calc(100vh-80px)] w-full overflow-hidden">
            <DesignEditorDetails />
        </div>
    );
}
