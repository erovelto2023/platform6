"use client";

import { useState, useTransition } from "react";
import { bulkCreateGlossaryTerms } from "@/lib/actions/glossary.actions";
import { FileText, Save, List, AlertCircle, CheckCircle, Copy, Bot } from "lucide-react";

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
        let trimmedData = importData.trim();
        
        // Strip markdown blocks if AI generated them
        if (trimmedData.startsWith('```')) {
            const lines = trimmedData.split('\n');
            if (lines.length > 2) {
                // remove first and last lines (e.g. ```json and ```)
                trimmedData = lines.slice(1, -1).join('\n').trim();
            }
        }
        
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
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                            <span className="flex items-center gap-2"><Bot size={14} /> AI Prompt Generator</span>
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(`Generate a strict JSON array containing exactly ONE object for each of the keywords at the bottom of this prompt.

The JSON MUST conform precisely to this schema structure and nothing else. Output ONLY the JSON array inside a standard code block, do not include any conversational text:

[
  {
    "term": "The Keyword",
    "category": "Broad Category (e.g. Marketing, Development)",
    "shortDefinition": "1-2 sentence quick definition under 50 words.",
    "definition": "Simple, beginner-friendly explanation of what it means, why it exists, and where it is used.",
    "origin": "History, Origin, and Etymology of the term.",
    "traditionalMeaning": "The traditional or classic meaning of the term.",
    "expandedExplanation": "Expanded history and a deeper explanation of the concept context.",
    "commonPractices": "Common practices or exercises related to this term.",
    "useCases": "A real-world use case or practical application.",
    "howItMakesMoney": "A detailed explanation of how this concept generates revenue.",
    "bestFor": "The ideal target audience or type of person best suited for this.",
    "startupCost": "Must be exactly one of: '$0', '<$100', or '$100+'",
    "skillRequired": "Must be exactly one of: 'Beginner', 'Intermediate', or 'Advanced'",
    "timeToFirstDollar": "Estimated time it realistically takes to make the first dollar.",
    "platformPreference": "The preferred software, platform, or environment.",
    "gettingStartedChecklist": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
    "whyItMatters": "1-3 sentences explaining why someone in business/marketing should care.",
    "videoUrl": "",
    "takeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
    "headlines": ["Headline 1", "Headline 2", "Headline 3", "Headline 4", "Headline 5"],
    "youtubeTitles": ["YT 1", "YT 2", "YT 3", "YT 4", "YT 5"],
    "pinterestIdeas": ["Pin 1", "Pin 2", "Pin 3", "Pin 4", "Pin 5"],
    "instagramIdeas": ["IG 1", "IG 2", "IG 3", "IG 4", "IG 5"],
    "amazonProducts": [
      {"name": "Product or Book Name 1", "url": ""},
      {"name": "Product or Book Name 2", "url": ""}
    ],
    "websitesRanking": [
      {"name": "Competitor/Authority Website 1", "url": "https://example.com"},
      {"name": "Competitor/Authority Website 2", "url": "https://example.com"}
    ],
    "podcastsRanking": [
      {"name": "Podcast Name 1", "url": "https://example.com"},
      {"name": "Podcast Name 2", "url": "https://example.com"}
    ],
    "faqs": [
      {"question": "Common Question 1?", "answer": "Answer 1"},
      {"question": "Common Question 2?", "answer": "Answer 2"}
    ],
    "caseStudies": [
      {"title": "Example Case Study", "description": "Short explanation of the case study in practice."}
    ],
    "metaTitle": "SEO Optimized Meta Title under 60 characters",
    "keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"]
  }
]

Please generate the robust JSON array for the following terms:
1.
2.
3.
`);
                                    alert('Prompt copied!');
                                }}
                                className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-md hover:bg-emerald-200 transition-colors flex items-center gap-1 text-[10px]"
                            >
                                <Copy size={12} /> Copy Prompt
                            </button>
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl text-[10px] overflow-x-auto font-mono whitespace-pre-wrap">
                                    Click "Copy Prompt" above. Paste it into ChatGPT/Claude, add your target keywords at the bottom, and then paste the resulting JSON code directly into the Data Input box on the left.
                                </pre>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 font-bold">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <List size={14} />
                            Fallback Formats
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] text-slate-600 font-mono bg-white p-3 rounded-lg border border-slate-100 leading-relaxed">
                                    Plain Text: Term | Category | Short Def | Full Def
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
