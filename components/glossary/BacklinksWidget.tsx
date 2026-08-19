"use client";

import React from 'react';
import Link from 'next/link';
import { Network, ArrowRight, BookOpen, Layers, Sparkles } from 'lucide-react';

interface Backlink {
    term: string;
    slug: string;
    category?: string;
    snippet?: string;
}

interface BacklinksWidgetProps {
    currentTerm: string;
    currentSlug: string;
    allTerms: Array<{
        term: string;
        slug: string;
        category?: string;
        definition?: string;
        shortDefinition?: string;
        aeoSummary?: string;
    }>;
}

export default function BacklinksWidget({ currentTerm, currentSlug, allTerms = [] }: BacklinksWidgetProps) {
    const termLower = currentTerm.toLowerCase();

    // Find terms that reference the current term
    const backlinks: Backlink[] = [];

    allTerms.forEach(t => {
        if (t.slug === currentSlug) return;

        const def = (t.definition || '') + ' ' + (t.shortDefinition || '') + ' ' + (t.aeoSummary || '');
        if (def.toLowerCase().includes(termLower)) {
            // Extract snippet
            const idx = def.toLowerCase().indexOf(termLower);
            const start = Math.max(0, idx - 40);
            const end = Math.min(def.length, idx + termLower.length + 40);
            const snippet = (start > 0 ? '...' : '') + def.substring(start, end).trim() + (end < def.length ? '...' : '');

            backlinks.push({
                term: t.term,
                slug: t.slug,
                category: t.category,
                snippet
            });
        }
    });

    if (backlinks.length === 0) return null;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                    <Network className="text-purple-400" size={20} />
                    <div>
                        <h4 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wider">
                            Bi-Directional Backlinks & References ({backlinks.length})
                        </h4>
                        <p className="text-[11px] font-sans text-slate-400 mt-0.5">
                            Other terms and concepts in the knowledge graph that directly cite <strong className="text-slate-200">{currentTerm}</strong>.
                        </p>
                    </div>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800/80">
                    Obsidian Graph Links
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {backlinks.slice(0, 6).map((item, idx) => (
                    <Link
                        key={idx}
                        href={`/glossary/${item.slug}`}
                        className="p-4 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/80 rounded-2xl transition-all duration-300 group flex flex-col justify-between space-y-2"
                    >
                        <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="font-extrabold text-slate-100 text-xs group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                                    <BookOpen size={13} className="text-purple-400" />
                                    {item.term}
                                </span>
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                                    {item.category || 'General'}
                                </span>
                            </div>
                            <p className="text-[11px] font-mono text-slate-400 italic line-clamp-2">
                                &ldquo;{item.snippet}&rdquo;
                            </p>
                        </div>

                        <div className="flex items-center justify-end text-[10px] font-mono font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
                            View Concept Node <ArrowRight size={12} className="ml-1" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
