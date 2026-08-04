"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const WorkbookDesignerClient = dynamic(
    () => import("./WorkbookDesignerClient"),
    {
        ssr: false,
        loading: () => (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                <p className="text-sm font-semibold">Loading Worksheet Designer Canvas...</p>
            </div>
        ),
    }
);

export default function WorkbookDesignerPage() {
    return <WorkbookDesignerClient />;
}
