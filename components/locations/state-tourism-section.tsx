"use client";

import { useState } from "react";
import { Compass, Search, ExternalLink, MapPin, Zap, Building, Home, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStateTourismUtilities, TourismUtilityItem } from "@/lib/utils/state-tourism-utilities";
import { getStateRealtorsCPAs, RealtorAssoc } from "@/lib/utils/state-real-estate-cpa";

interface StateTourismSectionProps {
  tourismItems?: TourismUtilityItem[];
  realtorCpas?: RealtorAssoc[];
  stateName: string;
}

export function StateTourismSection({ tourismItems = [], realtorCpas = [], stateName }: StateTourismSectionProps) {
  const [query, setQuery] = useState("");

  const defaultTourism = getStateTourismUtilities(stateName);
  const defaultRealtor = getStateRealtorsCPAs(stateName);

  const displayTourism = tourismItems.length > 0 ? tourismItems : defaultTourism;
  const displayRealtor = realtorCpas.length > 0 ? realtorCpas : defaultRealtor;

  const filteredTourism = displayTourism.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.category.toLowerCase().includes(query.toLowerCase()) ||
    t.city.toLowerCase().includes(query.toLowerCase()) ||
    t.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredRealtor = displayRealtor.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase()) ||
    r.type.toLowerCase().includes(query.toLowerCase()) ||
    r.city.toLowerCase().includes(query.toLowerCase()) ||
    r.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-l-4 border-cyan-500 pl-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-3">
            <Compass className="text-cyan-400" /> {stateName} Tourism, Utilities, Real Estate & CPAs
          </h2>
          <p className="text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mt-1">
            State Tourism Boards, Public Utility Commissions (PUC/PSC), Major Convention Centers, State Realtor® Associations & CPA Societies
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
          placeholder={`Search ${stateName} tourism boards, convention centers, PUCs, or REALTOR® associations...`}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-lg"
        />
      </div>

      {/* 1. Tourism Boards, Public Utility Commissions & Convention Centers */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2">
          <Landmark className="text-cyan-400" size={20} /> State Tourism Boards, Utility Commissions & Convention Centers ({filteredTourism.length})
        </h3>

        {filteredTourism.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTourism.map((tm, idx) => {
              const isPuc = tm.category.includes("Public Utility");
              const isConvention = tm.category.includes("Convention");

              return (
                <div
                  key={idx}
                  className="group bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={
                          isPuc
                            ? "bg-amber-950/80 border-amber-800 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5"
                            : isConvention
                            ? "bg-cyan-950/80 border-cyan-800 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5"
                            : "bg-emerald-950/80 border-emerald-800 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5"
                        }
                      >
                        {tm.category}
                      </Badge>
                      <span className="text-xs text-slate-500 font-mono">📍 {tm.city}</span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                      {tm.name}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {tm.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">Official State Entity / Venue</span>
                    <a
                      href={tm.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-slate-950 hover:bg-cyan-600 border border-slate-800 hover:border-cyan-500 text-cyan-400 hover:text-white text-xs font-bold font-mono uppercase rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      Official Portal <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 border border-dashed border-slate-800 bg-slate-900 rounded-2xl text-center text-slate-500 text-xs font-mono uppercase">
            No tourism entities or utility commissions match search query
          </div>
        )}
      </div>

      {/* 2. Real Estate REALTOR® Associations & CPA Societies */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        <h3 className="text-xl font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2">
          <Home className="text-cyan-400" size={20} /> State REALTOR® Associations & CPA Societies ({filteredRealtor.length})
        </h3>

        {filteredRealtor.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRealtor.map((rl, idx) => (
              <div
                key={idx}
                className="group bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-purple-950/80 border-purple-800 text-purple-300 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5">
                      {rl.type}
                    </Badge>
                    <span className="text-xs text-slate-500 font-mono">📍 {rl.city}</span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                    {rl.name}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {rl.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">State Professional Network</span>
                  <a
                    href={rl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-950 hover:bg-cyan-600 border border-slate-800 hover:border-cyan-500 text-cyan-400 hover:text-white text-xs font-bold font-mono uppercase rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    State Portal <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 border border-dashed border-slate-800 bg-slate-900 rounded-2xl text-center text-slate-500 text-xs font-mono uppercase">
            No real estate associations or CPA societies match search query
          </div>
        )}
      </div>
    </div>
  );
}
