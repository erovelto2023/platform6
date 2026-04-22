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
            <div className="border-l-4 border-emerald-600 pl-4">
                <h2 className="text-2xl font-black text-emerald-950 uppercase italic tracking-tight">
                    Higher Education
                </h2>
                <p className="text-emerald-900/40 text-[10px] font-bold uppercase tracking-widest mt-1">
                    {institutions.length} Colleges &amp; Universities in {stateName}
                </p>
            </div>

            {/* Search filter */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-900/40" size={16} />
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search institutions..."
                    className="w-full bg-white border border-emerald-100 rounded-xl pl-10 pr-4 py-2.5 text-sm text-emerald-950 placeholder:text-emerald-900/20 focus:outline-none focus:border-emerald-600 transition-colors shadow-sm"
                />
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {filtered.map((inst, idx) => {
                        let hostname = "";
                        try {
                            if (inst.url) {
                                hostname = new URL(inst.url).hostname.replace('www.', '');
                            }
                        } catch (e) {
                            hostname = inst.url || "";
                        }

                        return (
                            <a
                                key={idx}
                                href={inst.url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-start gap-3 bg-white border border-emerald-100 hover:border-emerald-600 rounded-xl p-4 transition-all duration-200 hover:bg-slate-50 shadow-sm"
                            >
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0 mt-0.5 shadow-sm">
                                    <GraduationCap size={15} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-emerald-950 group-hover:text-emerald-600 transition-colors leading-tight line-clamp-2 uppercase italic">
                                        {inst.name}
                                    </p>
                                    {inst.url && (
                                        <div className="flex items-center gap-1 mt-1">
                                            <ExternalLink size={10} className="text-emerald-900/20 group-hover:text-emerald-600 transition-colors" />
                                            <span className="text-[10px] text-emerald-900/40 font-bold uppercase group-hover:text-emerald-600 transition-colors truncate">
                                                {hostname}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </a>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-16 border border-dashed border-emerald-100 bg-white rounded-2xl text-center shadow-sm">
                    <GraduationCap className="h-10 w-10 text-emerald-900/20 mb-3" />
                    <p className="text-emerald-900/40 font-bold uppercase italic text-[10px]">
                        No institutions match your search
                    </p>
                </div>
            )}
        </div>
    );
}
