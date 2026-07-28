"use client";

import { useState } from "react";
import { PawPrint, Search, MapPin, TreePine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface DogPark {
  name: string;
  city?: string;
  description?: string;
  source?: string;
}

interface StateDogParksProps {
  parks?: DogPark[];
  stateName: string;
}

export function StateDogParksSection({ parks = [], stateName }: StateDogParksProps) {
  const [query, setQuery] = useState("");
  const [displayLimit, setDisplayLimit] = useState(30);

  const filtered = parks
    .filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.city && p.city.toLowerCase().includes(query.toLowerCase()))
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const visible = filtered.slice(0, displayLimit);
  const hasMore = displayLimit < filtered.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-l-4 border-emerald-500 pl-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-3">
            <PawPrint className="text-emerald-400" /> {stateName} Dog Parks
          </h2>
          <p className="text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mt-1">
            {parks.length} Off-Leash Dog Parks &amp; Pet-Friendly Recreation Areas in {stateName}
          </p>
        </div>
        <Badge
          variant="outline"
          className="bg-emerald-950/60 border-emerald-700 text-emerald-300 font-mono text-xs uppercase px-4 py-2 self-start"
        >
          Source: animalshelter.org
        </Badge>
      </div>

      {/* Search & Counter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setDisplayLimit(30);
            }}
            placeholder={`Search ${parks.length} dog parks in ${stateName}...`}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-lg"
          />
        </div>
        <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          Showing <span className="text-emerald-400">{visible.length}</span> of{" "}
          <span className="text-slate-200">{filtered.length}</span> Parks
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visible.map((park, idx) => (
              <div
                key={idx}
                className="group flex flex-col justify-between bg-slate-900 border border-slate-800 hover:border-emerald-500/60 rounded-2xl p-5 transition-all duration-200 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                      <TreePine size={18} />
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-emerald-950/60 border-emerald-800/60 text-emerald-300 font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5"
                    >
                      Off-Leash
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-100 group-hover:text-emerald-400 transition-colors leading-tight">
                      {park.name}
                    </h3>
                    {park.city && (
                      <p className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-1">
                        <MapPin size={10} className="text-emerald-500" />
                        {park.city}, {stateName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                    🐕 Pet-Friendly Recreation Area
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                onClick={() => setDisplayLimit((p) => p + 30)}
                className="bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-200 hover:text-white font-mono font-bold uppercase text-xs px-6 py-2.5 rounded-xl transition-all shadow-lg"
              >
                Load Next 30 Dog Parks
              </Button>
              <Button
                onClick={() => setDisplayLimit(filtered.length)}
                variant="outline"
                className="bg-slate-950 border-slate-800 hover:border-emerald-500 text-emerald-400 font-mono font-bold uppercase text-xs px-6 py-2.5 rounded-xl transition-all"
              >
                Show All {filtered.length} Dog Parks
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 border border-dashed border-slate-800 bg-slate-900 rounded-3xl text-center shadow-xl">
          <PawPrint className="h-10 w-10 text-slate-600 mb-3" />
          <p className="text-slate-400 font-mono text-xs uppercase tracking-wider">
            No dog parks match your search query
          </p>
        </div>
      )}
    </div>
  );
}
