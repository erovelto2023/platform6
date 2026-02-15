'use client';

import dynamic from "next/dynamic";

const DesignEditorDetails = dynamic(
    () => import("./editor-wrapper"),
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full flex items-center justify-center bg-slate-50 text-slate-400">
                Loading Design Editor...
            </div>
        )
    }
);

export default function ClientDesignEditor() {
    return <DesignEditorDetails />;
}
