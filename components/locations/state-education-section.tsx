"use client";

import { useState } from "react";
import { GraduationCap, Search, ExternalLink } from "lucide-react";

interface Institution {
    name: string;
    url?: string;
}

interface StateEducationSectionProps {
    institutions: Institution[];
    stateName: string;
}

export function StateEducationSection({ institutions, stateName }: StateEducationSectionProps) {
    const [query, setQuery] = useState("");

    const filtered = institutions.filter(i =>
        i.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="border-l-4 border-blue-500 pl-4">
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">
                    Higher Education
                </h2>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                    {institutions.length} Colleges &amp; Universities in {stateName}
                </p>
            </div>

            {/* Search filter */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search institutions..."
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {filtered.map((inst, idx) => (
                        <a
                            key={idx}
                            href={inst.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start gap-3 bg-slate-950/60 border border-slate-800/60 hover:border-blue-500/40 rounded-xl p-4 transition-all duration-200 hover:bg-slate-900"
                        >
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all shrink-0 mt-0.5">
                                <GraduationCap size={15} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors leading-tight line-clamp-2">
                                    {inst.name}
                                </p>
                                {inst.url && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <ExternalLink size={10} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
                                        <span className="text-[10px] text-slate-600 group-hover:text-blue-400 transition-colors truncate">
                                            {new URL(inst.url).hostname.replace('www.', '')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-16 border border-dashed border-slate-700 bg-slate-800/20 rounded-2xl text-center">
                    <GraduationCap className="h-10 w-10 text-slate-700 mb-3" />
                    <p className="text-slate-500 font-bold uppercase italic text-sm">
                        No institutions match your search
                    </p>
                </div>
            )}
        </div>
    );
}
