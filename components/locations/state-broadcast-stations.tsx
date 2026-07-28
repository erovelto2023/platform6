"use client";

import { useState } from "react";
import { Radio, Search, ExternalLink, MapPin, Tv, ShieldCheck, Zap, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface BroadcastStation {
  callSign: string;
  facilityId?: number;
  type?: string;
  city?: string;
  state?: string;
  licensee?: string;
  network?: string;
  rfChannel?: number;
  virtualChannel?: number;
  dma?: string;
}

interface StateBroadcastStationsProps {
  stations?: BroadcastStation[];
  stateName: string;
}

export function StateBroadcastStations({ stations = [], stateName }: StateBroadcastStationsProps) {
  const [query, setQuery] = useState("");
  const [displayLimit, setDisplayLimit] = useState(24);

  const filtered = stations
    .filter(st =>
      st.callSign.toLowerCase().includes(query.toLowerCase()) ||
      (st.city && st.city.toLowerCase().includes(query.toLowerCase())) ||
      (st.licensee && st.licensee.toLowerCase().includes(query.toLowerCase())) ||
      (st.network && st.network.toLowerCase().includes(query.toLowerCase())) ||
      (st.dma && st.dma.toLowerCase().includes(query.toLowerCase()))
    )
    .sort((a, b) => a.callSign.localeCompare(b.callSign));

  const visibleStations = filtered.slice(0, displayLimit);
  const hasMore = displayLimit < filtered.length;

  const handleLoadMore = () => {
    setDisplayLimit(prev => prev + 24);
  };

  const handleShowAll = () => {
    setDisplayLimit(filtered.length);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-l-4 border-cyan-500 pl-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-3">
            <Radio className="text-cyan-400" /> {stateName} FCC Radio & TV Broadcast Stations
          </h2>
          <p className="text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mt-1">
            {stations.length} Official FCC Licensed Full-Service Broadcast & Media Networks in {stateName}
          </p>
        </div>
      </div>

      {/* Search & Counter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setDisplayLimit(24);
            }}
            placeholder={`Search ${stations.length} ${stateName} call signs (e.g. WABC, FOX, CBS, Austin)...`}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-lg"
          />
        </div>

        <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Showing <span className="text-cyan-400">{visibleStations.length}</span> of <span className="text-slate-200">{filtered.length}</span> Stations
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visibleStations.map((st, idx) => {
              const isNonComm = st.type && st.type.toLowerCase().includes("non-commercial");
              
              return (
                <div
                  key={idx}
                  className="group flex flex-col justify-between bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 transition-all duration-200 shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-sm">
                        <Tv size={18} />
                      </div>

                      {st.network && (
                        <Badge variant="outline" className="bg-cyan-950/80 border-cyan-800/80 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                          {st.network}
                        </Badge>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-100 group-hover:text-cyan-400 transition-colors leading-tight font-mono">
                        {st.callSign}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-1">
                        📍 {st.city}, {stateName}
                      </p>
                    </div>

                    {st.licensee && (
                      <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed">
                        <span className="text-slate-500 font-mono text-[11px] block uppercase">Licensee / Operator</span>
                        {st.licensee}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800 space-y-2">
                    {st.dma && (
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span className="text-slate-500">Market (DMA)</span>
                        <span className="text-slate-200 font-bold truncate max-w-[130px]">{st.dma}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500">Channels</span>
                      <span className="text-cyan-400 font-bold">
                        {st.virtualChannel ? `Ch ${st.virtualChannel}` : ''} {st.rfChannel ? `(RF ${st.rfChannel})` : ''}
                      </span>
                    </div>

                    <div className="pt-1">
                      <Badge 
                        variant="outline" 
                        className={isNonComm 
                          ? "bg-amber-950/40 border-amber-800/50 text-amber-300 text-[9px] font-mono uppercase"
                          : "bg-slate-950 border-slate-800 text-slate-400 text-[9px] font-mono uppercase"
                        }
                      >
                        {st.type || "Commercial Broadcast"}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More & Show All Controls */}
          {hasMore && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button
                onClick={handleLoadMore}
                className="bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 hover:text-white font-mono font-bold uppercase text-xs px-6 py-2.5 rounded-xl transition-all shadow-lg"
              >
                Load Next 24 Broadcast Stations
              </Button>
              <Button
                onClick={handleShowAll}
                variant="outline"
                className="bg-slate-950 border-slate-800 hover:border-cyan-500 text-cyan-400 font-mono font-bold uppercase text-xs px-6 py-2.5 rounded-xl transition-all"
              >
                Show All {filtered.length} Broadcast Stations
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 border border-dashed border-slate-800 bg-slate-900 rounded-3xl text-center shadow-xl">
          <Radio className="h-10 w-10 text-slate-600 mb-3" />
          <p className="text-slate-400 font-mono text-xs uppercase tracking-wider">
            No broadcast stations match your search query
          </p>
        </div>
      )}
    </div>
  );
}
