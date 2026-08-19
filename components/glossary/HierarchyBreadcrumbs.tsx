"use client";

import React from 'react';
import Link from 'next/link';
import { Book, ChevronRight, Layers, FileText, Bookmark } from 'lucide-react';

interface HierarchyBreadcrumbsProps {
    category: string;
    subCategory?: string;
    entityType?: string;
    term: string;
    slug: string;
}

export default function HierarchyBreadcrumbs({
    category,
    subCategory,
    entityType,
    term,
    slug
}: HierarchyBreadcrumbsProps) {
    const shelfName = "Digital Business & Monetization Registry";
    const bookName = category || "General Concepts";
    const chapterName = subCategory || entityType || "Core Methodologies";

    return (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg mb-8">
            <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
                {/* Shelf */}
                <div className="flex items-center gap-1.5 text-slate-400">
                    <Book size={14} className="text-amber-400 shrink-0" />
                    <span className="font-bold text-slate-300">{shelfName}</span>
                </div>

                <ChevronRight size={14} className="text-slate-600 shrink-0" />

                {/* Book (Category) */}
                <Link
                    href={`/glossary?category=${encodeURIComponent(bookName)}`}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
                >
                    <Layers size={13} className="text-cyan-400 shrink-0" />
                    <span>{bookName}</span>
                </Link>

                <ChevronRight size={14} className="text-slate-600 shrink-0" />

                {/* Chapter (SubCategory / EntityType) */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold">
                    <Bookmark size={13} className="text-indigo-400 shrink-0" />
                    <span>{chapterName}</span>
                </div>

                <ChevronRight size={14} className="text-slate-600 shrink-0" />

                {/* Page (Term) */}
                <div className="flex items-center gap-1.5 font-black text-slate-100 bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 px-3 py-1 rounded-xl">
                    <FileText size={13} className="text-cyan-400 shrink-0" />
                    <span>{term}</span>
                </div>
            </div>
        </div>
    );
}
