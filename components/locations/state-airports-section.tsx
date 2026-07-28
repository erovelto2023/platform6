"use client";

import { useState } from "react";
import { Plane, Search, ExternalLink, MapPin, Building2, ShieldCheck, Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStateAirports, Airport } from "@/lib/utils/state-airports";

interface StateAirportsSectionProps {
  airports?: Airport[];
  stateName: string;
}

export function StateAirportsSection({ airports = [], stateName }: StateAirportsSectionProps) {
  const [query, setQuery] = useState("");
  const defaultAirports = getStateAirports(stateName);
  const displayList = airports.length > 0 ? airports : defaultAirports;

  const filtered = displayList
    .filter(ap =>
      ap.name.toLowerCase().includes(query.toLowerCase()) ||
      ap.code.toLowerCase().includes(query.toLowerCase()) ||
      ap.city.toLowerCase().includes(query.toLowerCase()) ||
      (ap.type && ap.type.toLowerCase().includes(query.toLowerCase()))
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-l-4 border-cyan-500 pl-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-3">
            <Plane className="text-cyan-400" /> {stateName} Commercial Airports & Aviation Hubs
          </h2>
          <p className="text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mt-1">
            {displayList.length} Major Commercial Hubs, International Airports & Freight Terminals in {stateName}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Search ${displayList.length} ${stateName} airports or IATA codes (e.g. LAX, ATL, Denver)...`}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-lg"
          />
        </div>

        <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Showing <span className="text-cyan-400">{filtered.length}</span> of <span className="text-slate-200">{displayList.length}</span> Airports
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ap, idx) => {
            const isLargeHub = ap.type && ap.type.includes("Large Hub");
            const isCargo = ap.type && ap.type.includes("Cargo");

            return (
              <div
                key={idx}
                className="group flex flex-col justify-between bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 transition-all duration-200 shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-cyan-400 bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl shadow-inner">
                      {ap.code}
                    </span>

                    <Badge
                      variant="outline"
                      className={
                        isLargeHub
                          ? "bg-cyan-950/80 border-cyan-800 text-cyan-300 text-[10px] font-mono font-bold uppercase"
                          : isCargo
                          ? "bg-amber-950/80 border-amber-800 text-amber-300 text-[10px] font-mono font-bold uppercase"
                          : "bg-slate-950 border-slate-800 text-slate-400 text-[10px] font-mono font-bold uppercase"
                      }
                    >
                      {ap.type}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors leading-snug">
                      {ap.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-1">
                      <MapPin size={12} className="text-slate-500" /> {ap.city}, {stateName}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono uppercase font-bold">FAA / IATA Hub</span>
                  <a
                    href={ap.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-950 hover:bg-cyan-600 border border-slate-800 hover:border-cyan-500 text-cyan-400 hover:text-white text-xs font-bold font-mono uppercase rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    Airport Portal <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 border border-dashed border-slate-800 bg-slate-900 rounded-3xl text-center shadow-xl">
          <Plane className="h-10 w-10 text-slate-600 mb-3" />
          <p className="text-slate-400 font-mono text-xs uppercase tracking-wider">
            No airports match your search query
          </p>
        </div>
      )}
    </div>
  );
}
