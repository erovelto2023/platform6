"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Network, Sparkles, ArrowRight, Layers, BookOpen, Wrench, ShieldCheck } from 'lucide-react';

interface RelatedTerm {
    term: string;
    slug: string;
    category?: string;
    relationType?: 'parent' | 'child' | 'related' | 'tool';
}

interface ConceptGraphProps {
    currentTerm: string;
    currentSlug: string;
    category: string;
    parentTermSlug?: string;
    parentTermName?: string;
    relatedTerms: RelatedTerm[];
    recommendedTools?: any[];
}

export default function ConceptGraph({
    currentTerm,
    currentSlug,
    category,
    parentTermSlug,
    parentTermName,
    relatedTerms = [],
    recommendedTools = []
}: ConceptGraphProps) {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    // Build node graph
    const nodes: Array<{
        id: string;
        label: string;
        type: 'current' | 'parent' | 'child' | 'related' | 'tool';
        href?: string;
        category?: string;
    }> = [];

    // Current Term Center Node
    nodes.push({ id: currentSlug, label: currentTerm, type: 'current', category });

    // Parent Node
    if (parentTermSlug && parentTermName) {
        nodes.push({ id: parentTermSlug, label: parentTermName, type: 'parent', href: `/glossary/${parentTermSlug}`, category: 'Parent Concept' });
    }

    // Related & Child Terms (up to 6)
    relatedTerms.slice(0, 5).forEach((t, i) => {
        nodes.push({
            id: t.slug,
            label: t.term,
            type: i % 2 === 0 ? 'child' : 'related',
            href: `/glossary/${t.slug}`,
            category: t.category || category
        });
    });

    // Tools
    recommendedTools.slice(0, 2).forEach((tool, i) => {
        const toolName = typeof tool === 'string' ? tool : tool.context || tool.name || `Tool #${tool.productId}`;
        nodes.push({
            id: `tool-${i}`,
            label: toolName,
            type: 'tool',
            category: 'Recommended Tool'
        });
    });

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                        <Network size={16} /> Interactive Concept Knowledge Graph
                    </div>
                    <h3 className="text-lg font-black text-slate-100 uppercase tracking-tight mt-1">
                        Semantic Connections & Relationships
                    </h3>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shadow-sm shadow-cyan-400"></span> Active Node</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block"></span> Parent</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block"></span> Related</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span> Tool</span>
                </div>
            </div>

            {/* Mindmap Nodes Layout */}
            <div className="relative min-h-[300px] sm:min-h-[340px] flex items-center justify-center bg-slate-950/80 rounded-2xl border border-slate-800/80 p-6 overflow-hidden">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

                {/* Nodes Grid */}
                <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center gap-8">
                    {/* Top Parent Node */}
                    {parentTermSlug && parentTermName && (
                        <Link
                            href={`/glossary/${parentTermSlug}`}
                            onMouseEnter={() => setHoveredNode(parentTermSlug)}
                            onMouseLeave={() => setHoveredNode(null)}
                            className="px-4 py-2 bg-indigo-950/90 hover:bg-indigo-900 border border-indigo-700/80 text-indigo-200 rounded-xl text-xs font-mono font-bold transition-all shadow-lg hover:scale-105 flex items-center gap-2 cursor-pointer z-10"
                        >
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
                            <span>Parent: <strong className="text-white">{parentTermName}</strong></span>
                        </Link>
                    )}

                    {/* Center Active Node */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500 animate-tilt"></div>
                        <div className="relative px-6 py-3.5 bg-slate-900 border-2 border-cyan-400 text-white font-black text-sm md:text-base rounded-2xl shadow-2xl flex items-center gap-3">
                            <Sparkles size={18} className="text-cyan-400 animate-spin-slow" />
                            <span>{currentTerm}</span>
                            <span className="text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-800 text-cyan-400 px-2 py-0.5 rounded-full">
                                Center Node
                            </span>
                        </div>
                    </div>

                    {/* Related Concepts & Tools Orbit */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {nodes.filter(n => n.type !== 'current' && n.type !== 'parent').map((node, idx) => {
                            const isTool = node.type === 'tool';
                            const badgeColor = isTool 
                                ? 'bg-emerald-950/90 border-emerald-700/80 text-emerald-300 hover:border-emerald-400' 
                                : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-cyan-500 hover:text-cyan-300';

                            const content = (
                                <div
                                    onMouseEnter={() => setHoveredNode(node.id)}
                                    onMouseLeave={() => setHoveredNode(null)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer ${badgeColor} ${
                                        hoveredNode === node.id ? 'scale-105 shadow-cyan-500/20' : ''
                                    }`}
                                >
                                    {isTool ? <Wrench size={13} className="text-emerald-400" /> : <Layers size={13} className="text-purple-400" />}
                                    <span>{node.label}</span>
                                    {node.href && <ArrowRight size={12} className="opacity-60" />}
                                </div>
                            );

                            return node.href ? (
                                <Link key={node.id} href={node.href}>
                                    {content}
                                </Link>
                            ) : (
                                <div key={node.id}>{content}</div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            <p className="text-[11px] font-mono text-slate-400 text-center">
                Click any connected node to explore related entities, prerequisite concepts, or recommended tools.
            </p>
        </div>
    );
}
