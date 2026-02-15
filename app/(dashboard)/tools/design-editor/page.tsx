import { Metadata } from "next";
import ClientDesignEditor from "./_components/client-design-editor";

export const metadata: Metadata = {
    title: "Design Editor | K Business Academy",
    description: "Create stunning graphics and designs with our easy-to-use editor.",
};

export default function DesignEditorPage() {
    return (
        <div className="h-[calc(100vh-80px)] w-full overflow-hidden">
            <ClientDesignEditor />
        </div>
    );
}
