"use client";

import React, { useState } from 'react';
import { Quote, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';

interface CiteTermWidgetProps {
    term: string;
    slug: string;
    lastUpdated?: string;
}

export default function CiteTermWidget({ term, slug, lastUpdated }: CiteTermWidgetProps) {
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState<'APA' | 'MLA' | 'Harvard' | 'Markdown'>('APA');

    const year = lastUpdated ? new Date(lastUpdated).getFullYear() : 2026;
    const url = `https://kbusinessacademy.com/glossary/${slug}`;

    const citations = {
        APA: `KBusiness Academy. (${year}). ${term}. In KBusiness Digital Marketing & Online Business Glossary. Retrieved from ${url}`,
        MLA: `" ${term} ." KBusiness Academy Glossary, ${year}, ${url}. Accessed ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}.`,
        Harvard: `KBusiness Academy, ${year}. ${term}, KBusiness Academy Glossary. Available at: <${url}> [Accessed ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}].`,
        Markdown: `[${term} - Defined by KBusiness Academy Glossary](${url})`
    };

    const handleCopy = (format: 'APA' | 'MLA' | 'Harvard' | 'Markdown') => {
        navigator.clipboard.writeText(citations[format]);
        setCopiedFormat(format);
        setTimeout(() => setCopiedFormat(null), 2000);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                    <Quote className="text-cyan-400" size={18} />
                    <h4 className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
                        Cite This Definition
                    </h4>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 border border-cyan-800/80 px-2.5 py-0.5 rounded-full font-bold">
                    Academic & Web Citation
                </span>
            </div>

            <p className="text-xs font-sans text-slate-400">
                Use the pre-formatted citation below when referencing <strong className="text-slate-200">{term}</strong> in research papers, articles, or AI prompts.
            </p>

            {/* Format Selection Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                {(['APA', 'MLA', 'Harvard', 'Markdown'] as const).map(fmt => (
                    <button
                        key={fmt}
                        onClick={() => setSelectedTab(fmt)}
                        className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                            selectedTab === fmt
                                ? 'bg-cyan-600 text-white shadow-md'
                                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                    >
                        {fmt}
                    </button>
                ))}
            </div>

            {/* Citation Box & Copy Button */}
            <div className="relative bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed group">
                <div className="pr-10 select-all font-sans text-xs">
                    {citations[selectedTab]}
                </div>

                <button
                    onClick={() => handleCopy(selectedTab)}
                    className="absolute right-3 top-3 p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1 text-[11px] font-mono font-bold"
                    title={`Copy ${selectedTab} citation`}
                >
                    {copiedFormat === selectedTab ? (
                        <>
                            <Check size={14} className="text-emerald-400" /> Copied!
                        </>
                    ) : (
                        <>
                            <Copy size={14} /> Copy
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
