"use client";

import { useState } from "react";
import { GraduationCap, Search, ExternalLink, School, BookOpen } from "lucide-react";

interface Institution {
    name: string;
    url?: string;
    type?: string;
}

interface StateEducationSectionProps {
    institutions?: Institution[];
    stateName: string;
}

export function StateEducationSection({ institutions = [], stateName }: StateEducationSectionProps) {
    const [query, setQuery] = useState("");

    const isDelaware = stateName.toLowerCase().includes("delaware");

    const defaultInstitutions: Institution[] = isDelaware ? [
        { name: "University of Delaware", url: "https://www.udel.edu", type: "Public Research University" },
        { name: "Delaware State University", url: "https://www.desu.edu", type: "Public HBCU Land-Grant University" },
        { name: "Wilmington University", url: "https://www.wilmu.edu", type: "Private Doctoral Research University" },
        { name: "Delaware Technical Community College", url: "https://www.dtcc.edu", type: "Public Community College System" },
        { name: "Goldey-Beacom College", url: "https://www.gbc.edu", type: "Private Business & Professional College" },
        { name: "Delaware College of Art and Design", url: "https://www.dcad.edu", type: "Private Art & Design Academy" }
    ] : [
        { name: `University of ${stateName}`, url: `https://www.google.com/search?q=${encodeURIComponent("University of " + stateName)}`, type: "Flagship Public University" },
        { name: `${stateName} State University`, url: `https://www.google.com/search?q=${encodeURIComponent(stateName + " State University")}`, type: "Public State University" },
        { name: `${stateName} Community College System`, url: `https://www.google.com/search?q=${encodeURIComponent(stateName + " community colleges")}`, type: "Community & Vocational System" }
    ];

    const displayList = institutions.length > 0 ? institutions : defaultInstitutions;

    const filtered = displayList.filter(i =>
        i.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="border-l-4 border-cyan-500 pl-6">
                <h2 className="text-3xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-3">
                    <GraduationCap className="text-cyan-400" /> {stateName} Higher Education & Universities
                </h2>
                <p className="text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mt-1">
                    {displayList.length} Colleges, Universities & Higher Learning Centers in {stateName}
                </p>
            </div>

            {/* Search filter */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search universities or colleges..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-lg"
                />
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                className="group flex items-start gap-4 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 transition-all duration-200 shadow-xl"
                            >
                                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-all shrink-0 shadow-sm">
                                    <GraduationCap size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors leading-tight">
                                        {inst.name}
                                    </h3>
                                    <p className="text-xs text-slate-400 font-mono mt-1">
                                        {inst.type || "Higher Education Center"}
                                    </p>
                                    {inst.url && (
                                        <div className="flex items-center gap-1.5 mt-3 text-xs font-mono text-cyan-400 group-hover:text-cyan-300">
                                            <ExternalLink size={12} />
                                            <span className="truncate">{hostname}</span>
                                        </div>
                                    )}
                                </div>
                            </a>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-16 border border-dashed border-slate-800 bg-slate-900 rounded-3xl text-center shadow-xl">
                    <GraduationCap className="h-10 w-10 text-slate-600 mb-3" />
                    <p className="text-slate-400 font-mono text-xs uppercase tracking-wider">
                        No institutions match your search
                    </p>
                </div>
            )}
        </div>
    );
}
