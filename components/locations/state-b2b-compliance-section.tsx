"use client";

import { useState } from "react";
import { Briefcase, Search, ExternalLink, MapPin, Building, ShieldCheck, Ticket, Rocket, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStateB2BVenture, B2BVentureItem } from "@/lib/utils/state-b2b-venture";
import { getStateCompliance, ComplianceItem } from "@/lib/utils/state-privacy-compliance";

interface StateB2BComplianceProps {
  b2bItems?: B2BVentureItem[];
  complianceItems?: ComplianceItem[];
  stateName: string;
}

export function StateB2BComplianceSection({ b2bItems = [], complianceItems = [], stateName }: StateB2BComplianceProps) {
  const [query, setQuery] = useState("");

  const defaultB2B = getStateB2BVenture(stateName);
  const defaultCompliance = getStateCompliance(stateName);

  const displayB2B = b2bItems.length > 0 ? b2bItems : defaultB2B;
  const displayCompliance = complianceItems.length > 0 ? complianceItems : defaultCompliance;

  const filteredB2B = displayB2B.filter(b =>
    b.name.toLowerCase().includes(query.toLowerCase()) ||
    b.type.toLowerCase().includes(query.toLowerCase()) ||
    b.city.toLowerCase().includes(query.toLowerCase()) ||
    b.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCompliance = displayCompliance.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase()) ||
    c.city.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-l-4 border-cyan-500 pl-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-3">
            <Rocket className="text-cyan-400" /> {stateName} Enterprise Employers, VC Funds & Regulatory Portals
          </h2>
          <p className="text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mt-1">
            Top State Employers, Venture Capital Funds, Accelerators, Privacy Laws & SOS Business Search
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
          placeholder={`Search ${stateName} enterprise employers, VC funds, privacy laws, or SOS search...`}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-lg"
        />
      </div>

      {/* 1. B2B Enterprises, VC Funds & Accelerators */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2">
          <Briefcase className="text-cyan-400" size={20} /> Major Employers, Venture Capital & Startup Ecosystem ({filteredB2B.length})
        </h3>

        {filteredB2B.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredB2B.map((item, idx) => {
              const isEmployer = item.type.includes("Employer");
              const isVc = item.type.includes("Venture Capital");

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
                          isEmployer
                            ? "bg-cyan-950/80 border-cyan-800 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5"
                            : isVc
                            ? "bg-purple-950/80 border-purple-800 text-purple-300 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5"
                            : "bg-emerald-950/80 border-emerald-800 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5"
                        }
                      >
                        {item.type}
                      </Badge>
                      <span className="text-xs text-slate-500 font-mono">📍 {item.city}</span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                      {item.name}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">Enterprise / Investor Portal</span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-slate-950 hover:bg-cyan-600 border border-slate-800 hover:border-cyan-500 text-cyan-400 hover:text-white text-xs font-bold font-mono uppercase rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      Visit Website <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 border border-dashed border-slate-800 bg-slate-900 rounded-2xl text-center text-slate-500 text-xs font-mono uppercase">
            No enterprise employers or VC hubs match search query
          </div>
        )}
      </div>

      {/* 2. Privacy Laws, SOS Business Search & Major Festivals */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        <h3 className="text-xl font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2">
          <Lock className="text-cyan-400" size={20} /> State Privacy Laws, Business Search Portals & Major Festivals ({filteredCompliance.length})
        </h3>

        {filteredCompliance.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCompliance.map((cmp, idx) => {
              const isPrivacy = cmp.category.includes("Privacy");
              const isSos = cmp.category.includes("SOS");

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
                          isPrivacy
                            ? "bg-amber-950/80 border-amber-800 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5"
                            : isSos
                            ? "bg-cyan-950/80 border-cyan-800 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5"
                            : "bg-pink-950/80 border-pink-800 text-pink-300 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5"
                        }
                      >
                        {cmp.category}
                      </Badge>
                      <span className="text-xs text-slate-500 font-mono">📍 {cmp.city}</span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                      {cmp.name}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {cmp.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">Official State Portal / Event</span>
                    <a
                      href={cmp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-slate-950 hover:bg-cyan-600 border border-slate-800 hover:border-cyan-500 text-cyan-400 hover:text-white text-xs font-bold font-mono uppercase rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      Official Resource <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 border border-dashed border-slate-800 bg-slate-900 rounded-2xl text-center text-slate-500 text-xs font-mono uppercase">
            No compliance portals or major festivals match search query
          </div>
        )}
      </div>
    </div>
  );
}
