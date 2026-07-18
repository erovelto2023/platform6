"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrintButtonProps {
    className?: string;
    label?: string;
}

export function PrintButton({ className = "", label = "Print" }: PrintButtonProps) {
    return (
        <Button
            type="button"
            onClick={() => window.print()}
            className={`bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold border border-slate-800 rounded-xl px-4.5 py-2 flex items-center gap-2 no-print transition-colors ${className}`}
        >
            <Printer className="w-4 h-4 text-indigo-400" /> {label}
        </Button>
    );
}

export default PrintButton;
