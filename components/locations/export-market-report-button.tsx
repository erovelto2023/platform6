"use client";

import { Printer, Download, FileText, Check } from "lucide-react";
import { useState } from "react";

interface ExportMarketReportButtonProps {
    cityName: string;
    stateName?: string;
}

export function ExportMarketReportButton({ cityName, stateName = "South Carolina" }: ExportMarketReportButtonProps) {
    const [printing, setPrinting] = useState(false);

    const handlePrint = () => {
        setPrinting(true);
        setTimeout(() => {
            window.print();
            setPrinting(false);
        }, 300);
    };

    return (
        <button
            onClick={handlePrint}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition cursor-pointer shadow-lg hover:shadow-cyan-500/20"
        >
            {printing ? (
                <>
                    <Check size={14} /> Preparing Print Report...
                </>
            ) : (
                <>
                    <Printer size={14} /> Export Market Report (PDF)
                </>
            )}
        </button>
    );
}
