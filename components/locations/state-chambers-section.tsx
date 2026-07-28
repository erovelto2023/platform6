"use client";

import { useState } from "react";
import { Building2, Search, ExternalLink, MapPin, Briefcase, Scale, ShieldCheck, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStateChambers, StateChamber } from "@/lib/utils/state-chambers";
import { getStateLegal, StateLegalAssoc } from "@/lib/utils/state-legal-associations";

interface StateChambersSectionProps {
  chambers?: StateChamber[];
  legalAssocs?: StateLegalAssoc[];
  stateName: string;
}

export function StateChambersSection({ chambers = [], legalAssocs = [], stateName }: StateChambersSectionProps) {
  const [query, setQuery] = useState("");

  const defaultChambers = getStateChambers(stateName);
  const defaultLegal = getStateLegal(stateName);

  const displayChambers = chambers.length > 0 ? chambers : defaultChambers;
  const displayLegal = legalAssocs.length > 0 ? legalAssocs : defaultLegal;

  const filteredChambers = displayChambers.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.type.toLowerCase().includes(query.toLowerCase()) ||
    c.city.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredLegal = displayLegal.filter(l =>
    l.name.toLowerCase().includes(query.toLowerCase()) ||
    l.type.toLowerCase().includes(query.toLowerCase()) ||
    l.city.toLowerCase().includes(query.toLowerCase()) ||
    l.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-l-4 border-cyan-500 pl-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-3">
            <Building2 className="text-cyan-400" /> {stateName} Business Growth & Legal Infrastructure
          </h2>
          <p className="text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mt-1">
            Chambers of Commerce, Economic Development Corporations (EDCs), SBDC Centers & State Bar Associations
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={`Search ${stateName} chambers, EDCs, or legal associations...`}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-lg"
        />
      </div>

      {/* 1. Chambers of Commerce & EDCs */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2">
          <Briefcase className="text-cyan-400" size={20} /> Chambers of Commerce & Economic Development Hubs ({filteredChambers.length})
        </h3>

        {filteredChambers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredChambers.map((ch, idx) => (
              <div
                key={idx}
                className="group bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-cyan-950/80 border-cyan-800 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5">
                      {ch.type}
                    </Badge>
                    <span className="text-xs text-slate-500 font-mono">📍 {ch.city}</span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                    {ch.name}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {ch.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">Verified State Agency / Chamber</span>
                  <a
                    href={ch.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-mono uppercase rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    Visit Portal <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 border border-dashed border-slate-800 bg-slate-900 rounded-2xl text-center text-slate-500 text-xs font-mono uppercase">
            No chambers or development hubs match search query
          </div>
        )}
      </div>

      {/* 2. Legal Infrastructure & State Bar Associations */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        <h3 className="text-xl font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2">
          <Scale className="text-cyan-400" size={20} /> Legal Infrastructure & State Bar Associations ({filteredLegal.length})
        </h3>

        {filteredLegal.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLegal.map((lg, idx) => (
              <div
                key={idx}
                className="group bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-amber-950/80 border-amber-800 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5">
                      {lg.type}
                    </Badge>
                    <span className="text-xs text-slate-500 font-mono">📍 {lg.city}</span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                    {lg.name}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {lg.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">Licensed Bar Association</span>
                  <a
                    href={lg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-950 hover:bg-cyan-600 border border-slate-800 hover:border-cyan-500 text-cyan-400 hover:text-white text-xs font-bold font-mono uppercase rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    Official Bar Portal <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 border border-dashed border-slate-800 bg-slate-900 rounded-2xl text-center text-slate-500 text-xs font-mono uppercase">
            No legal associations match search query
          </div>
        )}
      </div>
    </div>
  );
}
