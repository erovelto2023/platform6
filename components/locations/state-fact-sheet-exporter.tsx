"use client";

import { StateFactGroup } from "@/lib/utils/state-facts";
import { Button } from "@/components/ui/button";
import { Printer, FileText, Download, CheckCircle2 } from "lucide-react";

interface StateFactSheetExporterProps {
  stateName: string;
  facts: StateFactGroup;
  symbolsFromDb?: any;
}

export function StateFactSheetExporter({ stateName, facts, symbolsFromDb }: StateFactSheetExporterProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 print:hidden">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-base font-black text-slate-100 uppercase tracking-tight">
            {stateName} Fact Sheet Executive Summary
          </h4>
          <p className="text-xs text-slate-400">
            Print or save a formatted 1-page reference guide containing all key symbols, facts, and government resources.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <Button 
          onClick={handlePrint}
          className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase text-xs tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" /> Print / Export Fact Sheet
        </Button>
      </div>
    </div>
  );
}
