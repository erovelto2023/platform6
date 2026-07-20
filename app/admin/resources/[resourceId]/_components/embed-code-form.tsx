"use client";

import { useState } from "react";
import { Copy, Check, Code, Link as LinkIcon, FileText, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmbedCodeFormProps {
    resource: {
        _id: string;
        title: string;
        description?: string;
        url: string;
        type?: string;
        category?: string;
        thumbnailUrl?: string;
    };
}

export const EmbedCodeForm = ({ resource }: EmbedCodeFormProps) => {
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const directUrl = resource.url || "#";
    const downloadLabel = `Download ${resource.title || "Resource"}`;
    
    // HTML Button Snippet
    const htmlButtonCode = `<a href="${directUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-md transition-all">
  📥 ${downloadLabel}
</a>`;

    // HTML Card Embed Snippet
    const htmlCardCode = `<div class="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl max-w-lg my-4 font-sans">
  <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
    ${resource.category || "General"} • ${(resource.type || "file").toUpperCase()}
  </span>
  <h4 class="text-lg font-bold text-white mt-3 mb-1">${resource.title}</h4>
  <p class="text-slate-300 text-xs leading-relaxed mb-4">${resource.description || "Access and download this resource."}</p>
  <a href="${directUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center w-full font-bold bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl transition-all text-sm shadow-md">
    Download ${(resource.type || "file").toUpperCase()}
  </a>
</div>`;

    // Shortcode Snippet
    const shortcodeCode = `[resource id="${resource._id}"]`;

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        toast.success("Code snippet copied to clipboard!");
        setTimeout(() => setCopiedKey(null), 2000);
    };

    return (
        <div className="mt-6 border bg-slate-900 text-slate-100 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-indigo-400" />
                    <h3 className="font-bold text-base text-white">Embed Code Snippets</h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">Paste into blog posts, pages & guides</span>
            </div>

            <Tabs defaultValue="html-btn" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-950/80 p-1 border border-slate-800 rounded-xl">
                    <TabsTrigger value="html-btn" className="text-xs font-semibold data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                        HTML Button
                    </TabsTrigger>
                    <TabsTrigger value="html-card" className="text-xs font-semibold data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                        HTML Card
                    </TabsTrigger>
                    <TabsTrigger value="url" className="text-xs font-semibold data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                        Direct Link
                    </TabsTrigger>
                    <TabsTrigger value="shortcode" className="text-xs font-semibold data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                        Shortcode
                    </TabsTrigger>
                </TabsList>

                {/* HTML Button Tab */}
                <TabsContent value="html-btn" className="space-y-2 pt-3">
                    <p className="text-xs text-slate-400">Ready-to-use styled download button snippet:</p>
                    <div className="relative bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
                        <pre className="whitespace-pre-wrap break-all">{htmlButtonCode}</pre>
                        <Button
                            onClick={() => copyToClipboard(htmlButtonCode, "btn")}
                            size="sm"
                            className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700 text-slate-200 h-7 text-xs px-2.5 rounded-md"
                        >
                            {copiedKey === "btn" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                            {copiedKey === "btn" ? "Copied" : "Copy Button Code"}
                        </Button>
                    </div>
                </TabsContent>

                {/* HTML Card Tab */}
                <TabsContent value="html-card" className="space-y-2 pt-3">
                    <p className="text-xs text-slate-400">Complete resource preview card widget snippet:</p>
                    <div className="relative bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto max-h-48">
                        <pre className="whitespace-pre-wrap break-all">{htmlCardCode}</pre>
                        <Button
                            onClick={() => copyToClipboard(htmlCardCode, "card")}
                            size="sm"
                            className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700 text-slate-200 h-7 text-xs px-2.5 rounded-md"
                        >
                            {copiedKey === "card" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                            {copiedKey === "card" ? "Copied" : "Copy Card Code"}
                        </Button>
                    </div>
                </TabsContent>

                {/* Direct Link Tab */}
                <TabsContent value="url" className="space-y-2 pt-3">
                    <p className="text-xs text-slate-400">Direct file target URL:</p>
                    <div className="relative bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-mono text-xs text-sky-300 overflow-x-auto flex items-center justify-between gap-3">
                        <span className="truncate">{directUrl}</span>
                        <Button
                            onClick={() => copyToClipboard(directUrl, "url")}
                            size="sm"
                            className="shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-200 h-7 text-xs px-2.5 rounded-md"
                        >
                            {copiedKey === "url" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                            {copiedKey === "url" ? "Copied" : "Copy Link"}
                        </Button>
                    </div>
                </TabsContent>

                {/* Shortcode Tab */}
                <TabsContent value="shortcode" className="space-y-2 pt-3">
                    <p className="text-xs text-slate-400">Shortcode snippet for custom shortcode renderers:</p>
                    <div className="relative bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-mono text-xs text-amber-300 flex items-center justify-between gap-3">
                        <span>{shortcodeCode}</span>
                        <Button
                            onClick={() => copyToClipboard(shortcodeCode, "shortcode")}
                            size="sm"
                            className="shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-200 h-7 text-xs px-2.5 rounded-md"
                        >
                            {copiedKey === "shortcode" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                            {copiedKey === "shortcode" ? "Copied" : "Copy Shortcode"}
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};
