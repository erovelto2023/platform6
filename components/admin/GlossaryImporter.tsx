"use client";

import { useState, useTransition } from "react";
import { bulkCreateGlossaryTerms } from "@/lib/actions/glossary.actions";
import { FileText, Save, List, AlertCircle, CheckCircle } from "lucide-react";

export default function GlossaryImporter() {
    const [isPending, startTransition] = useTransition();
    const [importData, setImportData] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleImport = async () => {
        if (!importData.trim()) {
            setMessage("Please paste some data first.");
            setStatus("error");
            return;
        }

        let parsedData;
        const trimmedData = importData.trim();
        const isJsonPrompt = trimmedData.startsWith('[') || trimmedData.startsWith('{');

        try {
            if (isJsonPrompt) {
                parsedData = JSON.parse(trimmedData);
                if (!Array.isArray(parsedData)) {
                    setMessage("JSON must be an array of objects.");
                    setStatus("error");
                    return;
                }
            } else {
                throw new Error("Fallback to text");
            }
        } catch (e: any) {
            if (isJsonPrompt) {
                setMessage(`JSON Error: ${e.message}. Please check your syntax.`);
                setStatus("error");
                return;
            }
            const lines = importData.split("\n").filter(line => line.trim());
            if (lines.length < 1) {
                setMessage("No data found in the input.");
                setStatus("error");
                return;
            }

            let startIdx = 0;
            const firstLine = lines[0].toLowerCase();
            if (firstLine.includes("term|") || (firstLine.includes("term") && firstLine.includes("definition"))) {
                startIdx = 1;
            }

            try {
                parsedData = lines.slice(startIdx).map((line, idx) => {
                    let delimiter = "|";
                    if (!line.includes("|")) {
                        if (line.includes("#")) delimiter = "#";
                        else if (line.includes("\t")) delimiter = "\t";
                    }

                    const parts = line.split(delimiter).map(p => p.trim());
                    if (parts.length < 2) {
                        throw new Error(`Line ${idx + startIdx + 1} is missing data. Use '${delimiter}' to separate columns.`);
                    }

                    return {
                        term: parts[0],
                        category: parts[1] || "General",
                        shortDefinition: parts[2] || parts[3] || parts[0],
                        definition: parts[3] || parts[2] || parts[0]
                    };
                });
            } catch (err: any) {
                setMessage(err.message || "Failed to parse data.");
                setStatus("error");
                return;
            }
        }

        startTransition(async () => {
            const result = await bulkCreateGlossaryTerms(parsedData);
            if (result.error) {
                setMessage("Error: " + result.error);
                setStatus("error");
            } else {
                setMessage(`Successfully imported ${result.count} terms!`);
                setStatus("success");
                setImportData("");
            }
        });
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-slate-900 text-white rounded-xl">
                    <FileText size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Bulk Content Importer</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">JSON or Pipe-Separated Data</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                        Data Input
                    </label>
                    <textarea
                        value={importData}
                        onChange={(e) => setImportData(e.target.value)}
                        placeholder="Paste your JSON array or | separated lines here..."
                        className="w-full h-96 p-6 rounded-2xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-black outline-none bg-slate-50 transition-all"
                    />
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 font-bold">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <List size={14} />
                            Format Guide
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase mb-2">Option 1: JSON Array</p>
                                <pre className="bg-black text-emerald-400 p-4 rounded-xl text-[10px] overflow-x-auto font-mono">
{`[
  {
    "term": "Example",
    "category": "Energy",
    "shortDefinition": "...",
    "definition": "..."
  }
]`}
                                </pre>
                            </div>

                            <div>
                                <p className="text-[10px] text-slate-400 uppercase mb-2">Option 2: Plain Text (| separated)</p>
                                <p className="text-[10px] text-slate-600 font-mono bg-white p-3 rounded-lg border border-slate-100 leading-relaxed">
                                    Term | Category | Short Def | Full Def
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <button
                    onClick={handleImport}
                    disabled={isPending || !importData}
                    className="w-full bg-black hover:bg-slate-800 disabled:opacity-50 text-white font-black py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                    {isPending ? "Processing..." : "Import Glossary Terms"}
                </button>

                {status !== 'idle' && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 font-bold ${status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {status === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <p className="text-sm">{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
