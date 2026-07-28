"use client";

import { Search, ExternalLink, Sparkles, TrendingUp, Compass, Home, Newspaper, CloudSun, MapPin } from "lucide-react";
import { CitySearchTrend } from "@/lib/services/search-trends.service";

interface CitySearchTrendsProps {
  trends: CitySearchTrend[];
  cityName: string;
  stateName: string;
}

export function CitySearchTrends({ trends, cityName, stateName }: CitySearchTrendsProps) {
  const getCategoryBadge = (cat: CitySearchTrend['category']) => {
    switch (cat) {
      case 'real-estate':
        return <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800"><Home size={10} /> Real Estate</span>;
      case 'news':
        return <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800"><Newspaper size={10} /> News</span>;
      case 'weather':
        return <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800"><CloudSun size={10} /> Weather</span>;
      case 'navigation':
        return <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800"><MapPin size={10} /> Navigation</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700"><Compass size={10} /> Local Query</span>;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles size={12} /> Live Google Autocomplete Data
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-2.5">
            <Search className="text-cyan-400" size={24} /> What People are Searching For in {cityName}
          </h2>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl">
          Real-Time Intent Trends ({cityName}, {stateName})
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {trends.map((item) => (
          <a
            key={item.rank}
            href={item.googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl hover:border-cyan-500/60 hover:bg-slate-950 transition-all cursor-pointer shadow-md"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400 text-xs font-mono font-bold group-hover:bg-cyan-600 group-hover:text-white transition-all flex-shrink-0">
                {item.rank}
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold text-slate-200 group-hover:text-cyan-400 transition-colors block truncate">
                  {item.query}
                </span>
                <div className="mt-1">{getCategoryBadge(item.category)}</div>
              </div>
            </div>
            <ExternalLink size={16} className="text-slate-600 group-hover:text-cyan-400 transition-colors flex-shrink-0 ml-2" />
          </a>
        ))}
      </div>

      <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl flex items-start gap-3">
        <TrendingUp className="text-cyan-400 mt-0.5 flex-shrink-0" size={16} />
        <p className="text-xs text-slate-400 leading-relaxed font-mono">
          <strong className="text-slate-200">Live Search Playbook:</strong> High search queries for real estate, weather, and map directions in {cityName} reveal high resident & visitor intent. Click any trend above to execute a live Google search.
        </p>
      </div>
    </div>
  );
}
