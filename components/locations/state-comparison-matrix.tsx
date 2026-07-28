"use client";

import { useState } from "react";
import { US_STATE_FACTS, getStateFacts, StateFactGroup } from "@/lib/utils/state-facts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scale, Plus, X, ArrowUpDown, Award, Check } from "lucide-react";

const ALL_STATE_KEYS = Object.keys(US_STATE_FACTS).sort();

export function StateComparisonMatrix() {
  const [selectedStates, setSelectedStates] = useState<string[]>(["alabama", "california", "florida", "texas"]);
  const [addDropdown, setAddDropdown] = useState<string>("");

  const handleAddState = (slug: string) => {
    if (slug && !selectedStates.includes(slug) && selectedStates.length < 5) {
      setSelectedStates([...selectedStates, slug]);
      setAddDropdown("");
    }
  };

  const handleRemoveState = (slug: string) => {
    if (selectedStates.length > 1) {
      setSelectedStates(selectedStates.filter(s => s !== slug));
    }
  };

  const stateFactList = selectedStates.map(key => ({
    key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    facts: getStateFacts(key)
  }));

  const metrics: { label: string; key: keyof StateFactGroup }[] = [
    { label: "Abbreviation", key: "abbreviation" },
    { label: "Capital City", key: "capital text-cyan-400 font-bold" as any },
    { label: "Statehood Date / Rank", key: "statehood" },
    { label: "Population Estimate", key: "population" },
    { label: "Total Territory", key: "landArea" },
    { label: "Largest City", key: "largestCity" },
    { label: "Timezone", key: "timezone" },
    { label: "Official Motto", key: "motto" },
    { label: "State Bird", key: "bird" },
    { label: "State Flower", key: "flower" },
    { label: "State Tree", key: "tree" },
    { label: "State Anthem", key: "song" },
    { label: "State Beverage", key: "beverage" },
    { label: "State Mineral / Gemstone", key: "mineral" },
  ];

  return (
    <div className="space-y-8">
      {/* Header & State Selector Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 mb-2">
              <Scale className="w-3.5 h-3.5 mr-1.5 inline" /> Side-by-Side Research Tool
            </Badge>
            <h2 className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-tight">
              US State Facts & Intelligence Matrix
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Select up to 5 states to compare demographics, land area, emblems, and heritage side-by-side.
            </p>
          </div>

          {/* Add State Dropdown */}
          {selectedStates.length < 5 && (
            <div className="flex items-center gap-2">
              <select 
                value={addDropdown}
                onChange={(e) => handleAddState(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 uppercase tracking-wider cursor-pointer"
              >
                <option value="">+ Add State to Compare...</option>
                {ALL_STATE_KEYS.filter(k => !selectedStates.includes(k)).map(key => (
                  <option key={key} value={key}>
                    {US_STATE_FACTS[key].abbreviation} - {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Selected State Tags */}
        <div className="flex flex-wrap gap-2.5">
          {stateFactList.map(st => (
            <div 
              key={st.key}
              className="bg-slate-950 border border-cyan-500/30 text-cyan-300 rounded-xl px-3.5 py-1.5 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider shadow-sm"
            >
              <span>{st.facts.abbreviation} • {st.name}</span>
              {selectedStates.length > 1 && (
                <button 
                  onClick={() => handleRemoveState(st.key)}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                  title="Remove state"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-x-auto shadow-2xl">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80">
              <th className="p-4 md:p-5 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider w-48">
                Metric / Attribute
              </th>
              {stateFactList.map(st => (
                <th key={st.key} className="p-4 md:p-5 border-l border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-slate-100 uppercase tracking-tight block">
                        {st.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                        {st.facts.nickname}
                      </span>
                    </div>
                    <Badge variant="outline" className="border-slate-700 text-slate-300 font-mono text-[10px]">
                      {st.facts.abbreviation}
                    </Badge>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs md:text-sm font-medium">
            {metrics.map((m, idx) => (
              <tr 
                key={m.label} 
                className={idx % 2 === 0 ? "bg-slate-900/40 hover:bg-slate-800/30 transition-colors" : "bg-slate-950/40 hover:bg-slate-800/30 transition-colors"}
              >
                <td className="p-4 font-mono font-bold text-slate-400 uppercase tracking-wider text-xs">
                  {m.label}
                </td>
                {stateFactList.map(st => {
                  const val = st.facts[m.key] || "—";
                  return (
                    <td key={st.key} className="p-4 border-l border-slate-800 text-slate-200">
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
