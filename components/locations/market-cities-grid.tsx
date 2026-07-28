"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MapPin, ArrowLeft, Search as SearchIcon, Building } from "lucide-react";

interface City {
  name: string;
  slug: string;
  stateSlug: string;
}

interface MarketCitiesGridProps {
  cities: City[];
  stateName: string;
  stateSlug: string;
  initialQuery?: string;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function MarketCitiesGrid({ cities, stateName, stateSlug, initialQuery = "" }: MarketCitiesGridProps) {
  const [selectedLetter, setSelectedLetter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);

  // Group cities count by first letter
  const letterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const letter of ALPHABET) {
      counts[letter] = 0;
    }
    for (const city of cities) {
      const firstChar = (city.name || "")[0]?.toUpperCase();
      if (firstChar && counts[firstChar] !== undefined) {
        counts[firstChar]++;
      }
    }
    return counts;
  }, [cities]);

  // Filter cities by search query and selected letter
  const filteredCities = useMemo(() => {
    return cities.filter(city => {
      const matchesSearch = !searchQuery || city.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLetter = selectedLetter === "ALL" || city.name.toUpperCase().startsWith(selectedLetter);
      return matchesSearch && matchesLetter;
    });
  }, [cities, searchQuery, selectedLetter]);

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-cyan-500 pl-6">
        <div>
          <h2 className="text-3xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-3">
            <Building className="text-cyan-400" /> {stateName} Market Cities & Directories
          </h2>
          <p className="text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mt-1">
            Browse verified commercial centers, municipal hubs, and local business ecosystems across {stateName}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg">
            <MapPin size={14} className="text-cyan-400" />
            <span>{filteredCities.length} / {cities.length} Cities</span>
          </span>
        </div>
      </div>

      {/* Search Input & Letter Pagination Controls */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-2xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Filter ${cities.length} ${stateName} cities...`}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Active Filter Info */}
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span>Filter:</span>
            <span className="text-cyan-400 font-bold uppercase bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
              {selectedLetter === "ALL" ? "All Letters" : `Starts with '${selectedLetter}'`}
            </span>
          </div>
        </div>

        {/* A - Z Pagination Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/60">
          <button
            onClick={() => setSelectedLetter("ALL")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedLetter === "ALL"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 border border-cyan-400"
                : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            ALL ({cities.length})
          </button>

          {ALPHABET.map((letter) => {
            const count = letterCounts[letter] || 0;
            const isSelected = selectedLetter === letter;
            const hasCities = count > 0;

            return (
              <button
                key={letter}
                onClick={() => hasCities && setSelectedLetter(letter)}
                disabled={!hasCities}
                title={hasCities ? `${count} cities starting with ${letter}` : `No cities starting with ${letter}`}
                className={`w-9 h-9 rounded-lg text-xs font-mono font-bold uppercase transition-all flex flex-col items-center justify-center gap-0.5 relative ${
                  isSelected
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 border border-cyan-400 ring-2 ring-cyan-500/20"
                    : hasCities
                    ? "bg-slate-950 text-slate-300 border border-slate-800 hover:border-cyan-500/60 hover:text-cyan-400 cursor-pointer"
                    : "bg-slate-950/40 text-slate-600 border border-slate-900/50 cursor-not-allowed opacity-40"
                }`}
              >
                <span>{letter}</span>
                {hasCities && (
                  <span className={`text-[9px] font-normal leading-none ${isSelected ? "text-cyan-100" : "text-slate-500"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cities Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredCities.map((city) => (
          <Link
            key={city.slug}
            href={`/locations/${stateSlug}/${city.slug}`}
            className="group relative overflow-hidden bg-slate-900 border border-slate-800 hover:border-cyan-500 p-5 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300 shrink-0">
                  <MapPin size={20} />
                </div>
                <span className="font-bold text-slate-100 text-base group-hover:text-cyan-400 transition-colors leading-tight line-clamp-2">
                  {city.name}
                </span>
              </div>
              <ArrowLeft className="rotate-180 opacity-0 group-hover:opacity-100 transition-all text-cyan-400 -translate-x-2 group-hover:translate-x-0 shrink-0" size={16} />
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="text-[11px] text-slate-500">{stateName}</span>
              <span className="text-cyan-400 font-bold group-hover:underline">Explore City →</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredCities.length === 0 && (
        <div className="flex flex-col items-center justify-center p-16 border border-dashed border-slate-800 bg-slate-900/40 rounded-3xl text-center">
          <SearchIcon className="h-10 w-10 text-slate-600 mb-3 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-300 uppercase">No Cities Match Filter</h3>
          <p className="text-slate-500 text-xs font-mono mt-1 max-w-md">
            No cities starting with <span className="text-cyan-400 font-bold">"{selectedLetter}"</span> {searchQuery ? `or matching "${searchQuery}"` : ""} were found in {stateName}.
          </p>
          <button
            onClick={() => { setSelectedLetter("ALL"); setSearchQuery(""); }}
            className="mt-5 px-4 py-2 bg-slate-900 border border-slate-700 hover:border-cyan-500 text-cyan-400 hover:text-white text-xs font-mono font-bold rounded-xl transition-all"
          >
            Reset Filters (Show All {cities.length} Cities)
          </button>
        </div>
      )}
    </div>
  );
}
