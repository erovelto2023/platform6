"use client";

import { useState, useTransition } from "react";
import { Download, Upload, FileText, CheckCircle2, AlertCircle, RefreshCw, FileCode, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { bulkImportPersonalOffers } from "@/lib/actions/personal-affiliate.actions";

interface AffiliateCatalogImportExportModalProps {
    offers: any[];
}

export default function AffiliateCatalogImportExportModal({ offers }: AffiliateCatalogImportExportModalProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [rawInput, setRawInput] = useState("");
    const [parsedPreview, setParsedPreview] = useState<any[]>([]);
    const [parseError, setParseError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');

    // --- EXPORT FUNCTIONS ---
    const handleExportJSON = () => {
        if (!offers || offers.length === 0) {
            toast.error("No offers available to export.");
            return;
        }

        const cleanData = offers.map(o => ({
            name: o.name,
            affiliateLink: o.affiliateLink,
            destinationLink: o.destinationLink || "",
            network: o.network || "Direct",
            productPrice: o.productPrice || "",
            commissionLevel: o.commissionLevel || "",
            payoutAmount: o.payoutAmount || "",
            notes: o.notes || "",
            clicks: o.clicks || 0
        }));

        const jsonString = JSON.stringify(cleanData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `affiliate-catalog-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`Exported ${offers.length} affiliate offers to JSON`);
    };

    const handleExportCSV = () => {
        if (!offers || offers.length === 0) {
            toast.error("No offers available to export.");
            return;
        }

        const headers = ["Name", "Affiliate Link", "Destination Link", "Network", "Product Price", "Commission Level", "Payout Amount", "Notes", "Clicks"];
        const rows = offers.map(o => [
            `"${(o.name || "").replace(/"/g, '""')}"`,
            `"${(o.affiliateLink || "").replace(/"/g, '""')}"`,
            `"${(o.destinationLink || "").replace(/"/g, '""')}"`,
            `"${(o.network || "Direct").replace(/"/g, '""')}"`,
            `"${(o.productPrice || "").replace(/"/g, '""')}"`,
            `"${(o.commissionLevel || "").replace(/"/g, '""')}"`,
            `"${(o.payoutAmount || "").replace(/"/g, '""')}"`,
            `"${(o.notes || "").replace(/"/g, '""')}"`,
            o.clicks || 0
        ]);

        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `affiliate-catalog-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`Exported ${offers.length} affiliate offers to CSV`);
    };

    // --- IMPORT PARSING ---
    const parseInputText = (text: string) => {
        const trimmed = text.trim();
        if (!trimmed) {
            setParsedPreview([]);
            setParseError(null);
            return;
        }

        // Try JSON parsing
        if (trimmed.startsWith("[") || trimmed.startsWith("{") || trimmed.includes("```")) {
            try {
                let jsonCandidate = trimmed;
                if (jsonCandidate.includes("```")) {
                    const match = jsonCandidate.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
                    if (match && match[1]) jsonCandidate = match[1].trim();
                    else jsonCandidate = jsonCandidate.replace(/```[a-z]*/gi, "").replace(/```/g, "").trim();
                }

                const startBracket = jsonCandidate.indexOf("[");
                const endBracket = jsonCandidate.lastIndexOf("]");
                if (startBracket !== -1 && endBracket > startBracket) {
                    jsonCandidate = jsonCandidate.substring(startBracket, endBracket + 1);
                }

                const parsed = JSON.parse(jsonCandidate);
                const items = Array.isArray(parsed) ? parsed : [parsed];
                const validItems = items.filter((i: any) => (i.name || i.product || i.title || i.Name) && (i.affiliateLink || i.url || i.link || i.AffiliateLink || i.URL));

                if (validItems.length === 0) {
                    setParseError("JSON parsed but found no items with valid 'name' and 'affiliateLink' properties.");
                    setParsedPreview([]);
                } else {
                    setParseError(null);
                    setParsedPreview(validItems);
                }
                return;
            } catch (err: any) {
                // Ignore and try CSV / Delimited
            }
        }

        // Delimited / CSV parsing fallback
        const lines = trimmed.split("\n").map(l => l.trim()).filter(l => l.length > 0 && !l.startsWith("```"));
        if (lines.length === 0) {
            setParsedPreview([]);
            setParseError("No valid lines found.");
            return;
        }

        let startIdx = 0;
        const firstLine = lines[0].toLowerCase();
        if (firstLine.includes("name") || firstLine.includes("affiliatelink") || firstLine.includes("url")) {
            startIdx = 1;
        }

        const items: any[] = [];
        for (let i = startIdx; i < lines.length; i++) {
            const line = lines[i];
            let delimiter = "|";
            if (line.includes("|")) delimiter = "|";
            else if (line.includes("\t")) delimiter = "\t";
            else if (line.includes(",")) delimiter = ",";

            const parts = line.split(delimiter).map(p => p.replace(/^"|"$/g, "").trim());
            const name = parts[0];
            const affiliateLink = parts[1];

            if (name && affiliateLink) {
                items.push({
                    name,
                    affiliateLink,
                    destinationLink: parts[2] || "",
                    network: parts[3] || "Direct",
                    productPrice: parts[4] || "",
                    commissionLevel: parts[5] || "",
                    payoutAmount: parts[6] || "",
                    notes: parts[7] || ""
                });
            }
        }

        if (items.length === 0) {
            setParseError("Could not parse entries. Use JSON, CSV, or pipe-separated lines: Name | Affiliate Link | Destination Link | Network | Price | Commission | Payout");
            setParsedPreview([]);
        } else {
            setParseError(null);
            setParsedPreview(items);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (content) {
                setRawInput(content);
                parseInputText(content);
            }
        };
        reader.readAsText(file);
    };

    const handleTextChange = (text: string) => {
        setRawInput(text);
        parseInputText(text);
    };

    const handleRunImport = () => {
        if (parsedPreview.length === 0) {
            toast.error("No valid offers ready for import.");
            return;
        }

        startTransition(async () => {
            const res = await bulkImportPersonalOffers(parsedPreview);
            if (res.success) {
                toast.success(`Successfully imported ${res.insertedCount} new offers and updated ${res.updatedCount} existing offers.`);
                setOpen(false);
                setRawInput("");
                setParsedPreview([]);
                router.refresh();
            } else {
                toast.error(res.error || "Import failed");
            }
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Export Dropdown / Actions */}
            <Button
                type="button"
                variant="outline"
                onClick={handleExportJSON}
                className="h-10 px-4 rounded-xl bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold gap-2 cursor-pointer"
                title="Export catalog as JSON file"
            >
                <FileCode size={15} className="text-cyan-400" /> Export JSON
            </Button>

            <Button
                type="button"
                variant="outline"
                onClick={handleExportCSV}
                className="h-10 px-4 rounded-xl bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold gap-2 cursor-pointer"
                title="Export catalog as CSV spreadsheet"
            >
                <Download size={15} className="text-emerald-400" /> Export CSV
            </Button>

            {/* Import Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        type="button"
                        className="h-10 px-4 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-100 text-xs font-mono font-bold gap-2 cursor-pointer shadow-md"
                    >
                        <Upload size={15} className="text-purple-400" /> Import Catalog
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl custom-scrollbar font-sans">
                    <DialogHeader>
                        <DialogTitle className="text-slate-100 font-black text-xl flex items-center gap-2">
                            <Upload className="text-cyan-400" size={22} /> Import Affiliate Catalog Offers
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 pt-2">
                        <p className="text-xs text-slate-400 font-mono">
                            Upload a <code className="text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">.json</code> or <code className="text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">.csv</code> file, or paste your offers directly below.
                        </p>

                        {/* Mode Selector */}
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                            <button
                                type="button"
                                onClick={() => setActiveTab('paste')}
                                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all ${
                                    activeTab === 'paste' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                                }`}
                            >
                                Paste Raw Text / JSON
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('upload')}
                                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all ${
                                    activeTab === 'upload' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                                }`}
                            >
                                Upload .JSON / .CSV File
                            </button>
                        </div>

                        {activeTab === 'paste' ? (
                            <div>
                                <textarea
                                    rows={8}
                                    value={rawInput}
                                    onChange={e => handleTextChange(e.target.value)}
                                    placeholder={`Paste JSON array or pipe-separated lines:\n[\n  {\n    "name": "ClickFunnels 2.0",\n    "affiliateLink": "https://...",\n    "network": "FirstPromoter",\n    "commissionLevel": "40% Monthly Recurring"\n  }\n]\n\nOR Pipe-separated:\nClickFunnels 2.0 | https://... | https://dest... | FirstPromoter | $197/mo | 40% Recurring | $78.80`}
                                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 custom-scrollbar"
                                />
                            </div>
                        ) : (
                            <div className="p-8 bg-slate-950 border border-dashed border-slate-800 rounded-2xl text-center space-y-4">
                                <FileText className="mx-auto text-slate-500" size={36} />
                                <div>
                                    <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg">
                                        <Upload size={16} /> Choose File (.json or .csv)
                                        <input
                                            type="file"
                                            accept=".json,.csv"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <p className="text-[11px] font-mono text-slate-500">Supports standard exported catalog files and CSV spreadsheets.</p>
                            </div>
                        )}

                        {/* Error Feedback */}
                        {parseError && (
                            <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-300 text-xs font-mono flex items-center gap-2">
                                <AlertCircle size={16} className="shrink-0" />
                                <span>{parseError}</span>
                            </div>
                        )}

                        {/* Parsed Preview Table */}
                        {parsedPreview.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-slate-800">
                                <div className="flex items-center justify-between font-mono text-xs text-slate-300">
                                    <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                                        <CheckCircle2 size={16} className="text-emerald-400" />
                                        Ready to Import ({parsedPreview.length} Offers Parsed)
                                    </span>
                                </div>

                                <div className="max-h-48 overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl p-3 custom-scrollbar text-xs font-mono space-y-2">
                                    {parsedPreview.slice(0, 10).map((item, idx) => (
                                        <div key={idx} className="p-2 bg-slate-900 rounded-lg border border-slate-800/80 flex items-center justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold text-slate-100 truncate">{item.name}</p>
                                                <p className="text-[10px] text-slate-400 truncate">{item.affiliateLink}</p>
                                            </div>
                                            <span className="px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800 text-[10px] font-bold shrink-0">
                                                {item.network || "Direct"}
                                            </span>
                                        </div>
                                    ))}
                                    {parsedPreview.length > 10 && (
                                        <p className="text-[10px] text-slate-500 italic text-center pt-1">
                                            ...and {parsedPreview.length - 10} more offers
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="rounded-xl border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleRunImport}
                                disabled={parsedPreview.length === 0 || isPending}
                                className="rounded-xl px-6 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                            >
                                {isPending ? (
                                    <>
                                        <RefreshCw size={16} className="animate-spin" /> Importing...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={16} /> Import {parsedPreview.length} Offers
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
