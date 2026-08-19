import { useState, useTransition, useMemo } from "react";
import { bulkCreateGlossaryTerms } from "@/lib/actions/glossary.actions";
import { FileText, Save, List, AlertCircle, CheckCircle, Copy, Bot, Sparkles, Wrench, Search, Trash, Plus, Check } from "lucide-react";
import { IDirectoryProduct } from "@/lib/db/models/DirectoryProduct";

interface GlossaryImporterProps {
    products?: IDirectoryProduct[];
}

export default function GlossaryImporter({ products = [] }: GlossaryImporterProps) {
    const [isPending, startTransition] = useTransition();
    const [importData, setImportData] = useState("");
    const [bulkKeywords, setBulkKeywords] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [productSearch, setProductSearch] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<IDirectoryProduct[]>([]);

    const matchingProducts = useMemo(() => {
        if (!productSearch.trim()) return [];
        const query = productSearch.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(query) ||
            (p.category && p.category.toLowerCase().includes(query)) ||
            (p.niche && p.niche.toLowerCase().includes(query))
        ).slice(0, 10);
    }, [products, productSearch]);

    const handleAddSelectedProduct = (product: IDirectoryProduct) => {
        if (selectedProducts.some(p => p.id === product.id)) return;
        setSelectedProducts(prev => [...prev, product]);
        setProductSearch("");
    };

    const handleRemoveSelectedProduct = (productId: number) => {
        setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    };

    const MASTER_JSON_SCHEMA = `Generate a strict JSON array containing exactly ONE object for each of the keywords at the bottom of this prompt.

CRITICAL URL & PRODUCT GUIDELINES:
1. FIND REAL, LIVE URLs: You MUST find actual, functional URLs for authority websites, popular podcasts, and real Amazon products related to the keyword.
2. DO NOT HALLUCINATE OR PROTECT: Do not use "example.com", "yoursite.com", "test.com", "yoursocial.com", or any other placeholder domain. 
3. EMPTY IS BETTER THAN FAKE: If you cannot find a verified, live URL for an item, leave the "url" field as an empty string ("") or omit the item entirely.
4. RECOMMENDED TOOLS & PRODUCTS: You can link database product IDs in "recommendedTools": [{"productId": 101, "context": "Best for sales funnels"}].

The JSON MUST conform precisely to this schema structure and nothing else. Output ONLY the JSON array inside a standard code block, do not include any conversational text:

[
  {
    "term": "The Keyword Name",
    "slug": "url-friendly-version-of-the-keyword",
    "category": "Skills & Concepts",
    "subCategory": "Performance Marketing",
    "shortDefinition": "1-2 sentence quick definition under 50 words.",
    "definition": "Detailed, comprehensive explanation of what it means, why it exists, and where it is used. Include markdown headers (## Concept Overview) and paragraphs.",
    "aeoSummary": "Direct, fact-dense 50-word answer optimized for AI search engine citations (ChatGPT/SearchGPT/Perplexity).",
    "entityType": "Must be one of: 'Core Concept', 'Performance Metric', 'Revenue System', or 'Traffic Channel'",
    "parentTermSlug": "",
    "recommendedTools": [
      {"productId": 1, "context": "Best for automated sales funnels"}
    ],
    "origin": "History, Origin, and Etymology of the term.",
    "traditionalMeaning": "The traditional or classic historical understanding of the term.",
    "modernUsage": "Modern digital application and current industry context.",
    "expandedExplanation": "Expanded history and deeper conceptual context.",
    "howItWorks": "Mechanism or technical/strategic principle of how it works.",
    "benefits": "Key physical, emotional, strategic, or monetary benefits.",
    "commonPractices": "Common practices, exercises, or methods related to this concept.",
    "useCases": "Real-world use cases or practical application scenarios.",
    "whoUsesIt": "Target practitioners, audiences, or business roles who use it.",
    "beginnerExplanation": "Simplified explanation for absolute beginners.",
    "advancedPerspective": "Advanced, deep strategy interpretation.",
    "misconceptions": "Common misunderstandings or false myths.",
    "warningsOrNotes": "Safety, ethics, or compliance notes.",
    "guidedPractice": "Step-by-step mental or operational exercise.",
    "howItMakesMoney": "Detailed explanation of how this concept generates revenue or cuts costs.",
    "bestFor": "Ideal target audience or person best suited for this.",
    "startupCost": "Must be exactly one of: '$0', '<$100', or '$100+'",
    "skillRequired": "Must be exactly one of: 'Beginner', 'Intermediate', or 'Advanced'",
    "timeToFirstDollar": "Estimated time it realistically takes to make the first dollar (e.g. '1-30 days', '1-3 months').",
    "platformPreference": "Preferred software, platform, or environment (e.g. Shopify, WordPress, Mobile-first).",
    "lowPhysicalEffort": false,
    "gettingStartedChecklist": [
      "Step 1: Choose a niche",
      "Step 2: Set up tracking",
      "Step 3: Launch first test"
    ],
    "commonMistakes": "Common mistakes and pitfalls to avoid.",
    "realExamples": "Short case study of a real person or business using this concept.",
    "whyItMatters": "1-3 sentences explaining why someone in business/marketing should care.",
    "videoUrl": "Actual YouTube Video URL (e.g. https://www.youtube.com/watch?v=...) or ''",
    "takeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
    "headlines": ["Headline 1", "Headline 2", "Headline 3"],
    "youtubeTitles": ["YT Title 1", "YT Title 2"],
    "pinterestIdeas": ["Pin Idea 1", "Pin Idea 2"],
    "instagramIdeas": ["IG Idea 1", "IG Idea 2"],
    "amazonProducts": [
      {"name": "Real Amazon Product Name", "url": "Actual Amazon URL with &tag=weightlo0f57d-20 or ''"}
    ],
    "websitesRanking": [
      {"name": "Real Authority Website Name", "url": "Actual LIVE URL"}
    ],
    "podcastsRanking": [
      {"name": "Real Podcast Name", "url": "Actual Podcast URL"}
    ],
    "faqs": [
      {"question": "Common Question 1?", "answer": "Detailed answer 1"}
    ],
    "caseStudies": [
      {"title": "Case Study Title", "description": "Short explanation of case study", "url": ""}
    ],
    "synonyms": ["Alternative Name 1", "Alternative Name 2"],
    "metaTitle": "SEO Optimized Meta Title under 60 characters",
    "metaDescription": "SEO Meta Description under 160 characters",
    "keywords": ["keyword 1", "keyword 2"],
    "tags": ["tag1", "tag2"],
    "imagePrompt": "Detailed AI image prompt for Midjourney/DALL-E capturing the essence of this keyword.",
    "productPrompt": "AI prompt to help the user brainstorm a digital/physical product for this keyword.",
    "socialPrompt": "AI prompt to generate a viral social media content strategy for this keyword.",
    "isFeatured": false,
    "status": "Published"
  }
]`;

    // Safety net: Scrub common placeholder URLs
    const cleanUrl = (url: any) => {
        if (!url || typeof url !== 'string') return "";
        const u = url.trim().toLowerCase();
        if (
            u === "" ||
            u === "#" ||
            u.includes("example.com") ||
            u.includes("yoursite.com") ||
            u.includes("mysite.com") ||
            u.includes("domain.com") ||
            u.includes("insert_url") ||
            u === "http://" ||
            u === "https://"
        ) return "";
        return url.trim();
    };

    const normalizeKey = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    const handleImport = async () => {
        if (!importData.trim()) {
            setMessage("Please paste some data first.");
            setStatus("error");
            return;
        }

        let parsedData: any[] = [];
        let trimmedData = importData.trim();

        if (trimmedData.startsWith('```')) {
            const lines = trimmedData.split('\n');
            if (lines.length > 2) {
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

                parsedData = parsedData.map((item: any) => {
                    const newItem = { ...item };
                    const affiliateId = "weightlo0f57d-20";

                    if (newItem.amazonProducts) {
                        newItem.amazonProducts = newItem.amazonProducts.map((p: any) => {
                            let url = cleanUrl(p.url);
                            if (url && url.includes("amazon.com")) {
                                const separator = url.includes("?") ? "&" : "?";
                                if (!url.includes("tag=")) {
                                    url = `${url}${separator}tag=${affiliateId}`;
                                }
                            }
                            return { ...p, url };
                        });
                    }
                    if (newItem.websitesRanking) {
                        newItem.websitesRanking = newItem.websitesRanking.map((w: any) => ({ ...w, url: cleanUrl(w.url) }));
                    }
                    if (newItem.podcastsRanking) {
                        newItem.podcastsRanking = newItem.podcastsRanking.map((p: any) => ({ ...p, url: cleanUrl(p.url) }));
                    }
                    if (newItem.videoUrl) {
                        newItem.videoUrl = cleanUrl(newItem.videoUrl);
                    }
                    return newItem;
                });

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
            // Merge selected database products into recommendedTools & amazonProducts for all imported terms
            if (selectedProducts.length > 0) {
                parsedData = parsedData.map((item: any) => {
                    const currentTools = item.recommendedTools || [];
                    const currentAmazon = item.amazonProducts || [];

                    selectedProducts.forEach(prod => {
                        if (!currentTools.some((t: any) => t.productId === prod.id)) {
                            currentTools.push({ productId: prod.id, context: prod.name });
                        }
                        if (!currentAmazon.some((p: any) => p.name?.toLowerCase() === prod.name.toLowerCase())) {
                            currentAmazon.push({
                                name: prod.name,
                                url: prod.affiliateLink || `/catalog/${prod.slug || prod.id}`,
                                description: prod.shortDescription || prod.category || "Recommended Tool"
                            });
                        }
                    });

                    return {
                        ...item,
                        recommendedTools: currentTools,
                        amazonProducts: currentAmazon
                    };
                });
            }

            const result = await bulkCreateGlossaryTerms(parsedData);
            if (result.error) {
                setMessage("Error: " + result.error);
                setStatus("error");
            } else {
                // Smart Keyword Scrubbing: Remove ONLY keywords that were successfully imported
                const importedKeys = new Set(
                    parsedData.map((item: any) => normalizeKey(item.term || item.slug || ''))
                );

                let removedCount = 0;
                if (bulkKeywords.trim()) {
                    const currentLines = bulkKeywords.split('\n');
                    const remainingLines = currentLines.filter(line => {
                        const trimmed = line.trim();
                        if (!trimmed) return false;
                        const key = normalizeKey(trimmed);
                        const isImported = importedKeys.has(key);
                        if (isImported) removedCount++;
                        return !isImported;
                    });
                    setBulkKeywords(remainingLines.join('\n'));
                }

                setMessage(`Successfully imported ${result.count} terms! ${selectedProducts.length > 0 ? `Attached ${selectedProducts.length} product(s) to all imported terms.` : ''} ${removedCount > 0 ? `Removed ${removedCount} matching imported keyword(s) from your batch list.` : ''}`);
                setStatus("success");
                setImportData("");
            }
        });
    };

    return (
        <div className="bg-slate-900 p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-800 space-y-8 max-w-5xl mx-auto text-slate-100 font-sans">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-6">
                <div className="p-3 bg-slate-950 text-cyan-400 border border-slate-800 rounded-2xl">
                    <FileText size={22} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tight">Bulk Glossary Importer & AI Generator</h2>
                    <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mt-0.5">High-Coverage JSON & AI Schema Generation</p>
                </div>
            </div>

            {/* Product Database Selector for Bulk Import */}
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                        <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                            <Wrench size={16} /> Attach Directory Database Products to Imported Batch ({selectedProducts.length})
                        </h3>
                        <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                            Search your database of {products.length} products and select software/tools to attach automatically to ALL imported terms.
                        </p>
                    </div>
                    {selectedProducts.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setSelectedProducts([])}
                            className="text-[10px] font-mono text-rose-400 hover:underline"
                        >
                            Clear Selection
                        </button>
                    )}
                </div>

                {/* Product Search Input */}
                <div className="relative">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            value={productSearch}
                            onChange={e => setProductSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs font-mono text-slate-100 placeholder:text-slate-500 outline-none"
                            placeholder="Search product database (e.g. ClickFunnels, Canva, ChatGPT)..."
                        />
                        {productSearch && (
                            <button
                                type="button"
                                onClick={() => setProductSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-white"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Search Results Dropdown */}
                    {productSearch.trim() !== '' && (
                        <div className="mt-2 bg-slate-900 border border-cyan-800/80 rounded-2xl p-2 shadow-2xl max-h-56 overflow-y-auto space-y-1 z-20 absolute left-0 right-0">
                            {matchingProducts.length === 0 ? (
                                <div className="p-3 text-xs text-slate-400 italic text-center font-mono">
                                    No products found matching &ldquo;{productSearch}&rdquo;.
                                </div>
                            ) : (
                                matchingProducts.map(product => {
                                    const isSelected = selectedProducts.some(p => p.id === product.id);
                                    return (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between p-2.5 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800/80 transition-all gap-3"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0 ${product.logoColor || "bg-cyan-600"}`}>
                                                    {product.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-100 text-xs truncate">{product.name}</span>
                                                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                                                            {product.category || product.niche}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleAddSelectedProduct(product)}
                                                disabled={isSelected}
                                                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                                                    isSelected
                                                        ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                                                        : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-md"
                                                }`}
                                            >
                                                {isSelected ? "Attached" : "+ Select Product"}
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>

                {/* Selected Products Chips */}
                {selectedProducts.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {selectedProducts.map(product => (
                            <span
                                key={product.id}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono text-xs font-bold"
                            >
                                <Check size={12} className="text-cyan-400" />
                                {product.name}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSelectedProduct(product.id)}
                                    className="hover:text-rose-400 ml-1 transition-colors"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Data Input (JSON Array or Pipe-Separated Lines)
                    </label>
                    <textarea
                        value={importData}
                        onChange={(e) => setImportData(e.target.value)}
                        placeholder="Paste your JSON array here..."
                        className="w-full h-[450px] p-4 rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs focus:border-cyan-500 outline-none transition-all shadow-inner"
                    />
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                        <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-3">
                            <span className="flex items-center gap-2"><Bot size={16} /> Complete Field AI Prompt</span>
                            <button 
                                onClick={() => {
                                    const fullPrompt = `${MASTER_JSON_SCHEMA}\n\nPlease generate the robust JSON array for the following terms:\n1.\n2.\n3.`;
                                    navigator.clipboard.writeText(fullPrompt);
                                    alert('✅ Complete Glossary JSON Prompt copied to clipboard! (Covers ALL fields)');
                                }}
                                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold flex items-center gap-1 text-[11px] transition-all cursor-pointer shadow-md"
                            >
                                <Copy size={12} /> Copy Complete Prompt
                            </button>
                        </h3>

                        <div className="space-y-3 font-mono text-xs">
                            <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl text-[10px] overflow-x-auto border border-slate-800 whitespace-pre-wrap max-h-44">
                                {MASTER_JSON_SCHEMA}
                            </pre>
                            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-start gap-2 text-slate-400">
                                <AlertCircle size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                                <p className="text-[10px] leading-relaxed">
                                    <strong>Full Coverage Active:</strong> Includes AEO Snippet, Entity Node, Real-World Scenario, Intent Variations, Pathways, MMO Monetization, and Structured Data.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
                        <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                            <Sparkles size={16} />
                            Batch Keyword Prompt Assistant
                        </h3>

                        <div className="space-y-3">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">
                                Paste keywords list (One per line):
                            </p>
                            <textarea 
                                value={bulkKeywords}
                                onChange={(e) => setBulkKeywords(e.target.value)}
                                placeholder="Conversion Rate Optimization (CRO)..."
                                className="w-full h-28 p-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-100 text-xs focus:border-cyan-500 outline-none font-mono"
                            />
                            <button 
                                onClick={() => {
                                    const keywordsList = bulkKeywords.split('\n').filter(k => k.trim());
                                    const keywords = keywordsList.slice(0, 20).join('\n');
                                    if (!keywords) { alert('Please paste some keywords first.'); return; }
                                    
                                    const batchPrompt = `${MASTER_JSON_SCHEMA}\n\nPlease generate the robust JSON array for the following terms:\n${keywords}`;

                                    navigator.clipboard.writeText(batchPrompt);
                                    
                                    alert('✅ Prompt for top 20 keywords copied! Keywords REMAIN in your list until you click "Import Glossary Terms".');
                                }}
                                className="w-full py-3 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                            >
                                <Bot size={16} /> Copy Complete Prompt (Top 20 Keywords)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-800">
                <button
                    onClick={handleImport}
                    disabled={isPending || !importData}
                    className="flex-1 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:opacity-40 text-white font-extrabold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs cursor-pointer"
                >
                    {isPending ? "Processing Import..." : "Import Glossary Terms"}
                </button>
                <button
                    onClick={() => { setImportData(""); setMessage(""); setStatus("idle"); }}
                    disabled={isPending || !importData}
                    className="px-6 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition-all uppercase tracking-wider text-xs font-bold"
                >
                    Clear Input
                </button>
            </div>

            {status !== 'idle' && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 font-mono text-xs border ${status === 'success' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-rose-950 text-rose-300 border-rose-800'}`}>
                    {status === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
}
