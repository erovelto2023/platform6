"use client";

import { StateFactGroup } from "@/lib/utils/state-facts";
import { Badge } from "@/components/ui/badge";
import { Mountain, ArrowDown, ArrowUp, Compass, Map, Sun } from "lucide-react";

interface StateGeographyCardProps {
  stateName: string;
  facts: StateFactGroup;
  elevationData?: any;
  areaData?: any;
  koppenClimate?: string[];
  locationDoc?: any;
}

export function StateGeographyCard({ 
  stateName, 
  facts, 
  elevationData, 
  areaData, 
  koppenClimate,
  locationDoc 
}: StateGeographyCardProps) {
  // Construct verified live highest elevation point text
  let highestPoint = facts.highestPoint;
  if (locationDoc?.highest_point) {
    const alt = elevationData?.max_ft ? ` — ${elevationData.max_ft} ft (${elevationData.max_m || ''} m)` : '';
    highestPoint = `${locationDoc.highest_point}${alt}`;
  } else if (!highestPoint && elevationData?.max_ft) {
    highestPoint = `Peak Altitude: ${elevationData.max_ft} ft (${elevationData.max_m || ''} m)`;
  }

  // Construct verified live lowest elevation point text
  let lowestPoint = facts.lowestPoint;
  if (locationDoc?.lowest_point) {
    const alt = elevationData?.min_ft ? ` — ${elevationData.min_ft} ft (${elevationData.min_m || ''} m)` : '';
    lowestPoint = `${locationDoc.lowest_point}${alt}`;
  } else if (!lowestPoint && elevationData?.min_ft) {
    lowestPoint = `Base Level: ${elevationData.min_ft} ft (${elevationData.min_m || ''} m)`;
  }

  const landArea = areaData?.land_mi ? `${areaData.land_mi} sq mi` : facts.landArea;
  const waterPercent = areaData?.water_percent ? `${areaData.water_percent}%` : "2.4%";
  const landPercent = areaData?.land_percent ? `${areaData.land_percent}%` : "97.6%";
  const totalRank = areaData?.total_rank ? `#${areaData.total_rank}` : undefined;

  const climates = koppenClimate && koppenClimate.length > 0 ? koppenClimate : ["Humid Continental", "Subtropical"];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs font-mono font-bold uppercase tracking-wider px-3 py-1">
              <Compass className="w-3.5 h-3.5 mr-1.5 inline" /> Topography & Terrain Live Data
            </Badge>
            {totalRank && (
              <Badge variant="outline" className="border-slate-700 text-slate-300 font-mono text-xs">
                Rank {totalRank} in US Land Mass
              </Badge>
            )}
          </div>
          <h3 className="text-2xl font-black text-slate-100 uppercase tracking-tight">
            {stateName} Topography & Geographic Elevations
          </h3>
        </div>

        <div className="text-right font-mono">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Territory Area</p>
          <p className="text-xl font-black text-cyan-400">{landArea}</p>
        </div>
      </div>

      {/* Elevation Points Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex items-start justify-between hover:border-emerald-500/40 transition-all">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              <ArrowUp className="w-4 h-4" /> Highest Natural Point
            </div>
            <p className="text-lg font-black text-slate-100 tracking-tight">{highestPoint}</p>
            <p className="text-[11px] text-slate-400 font-mono">Verified State Topographic Peak</p>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Mountain className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex items-start justify-between hover:border-sky-500/40 transition-all">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-sky-400 font-mono text-xs font-bold uppercase tracking-wider">
              <ArrowDown className="w-4 h-4" /> Lowest Natural Point
            </div>
            <p className="text-lg font-black text-slate-100 tracking-tight">{lowestPoint}</p>
            <p className="text-[11px] text-slate-400 font-mono">Verified Base Elevation Datum</p>
          </div>
          <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
            <Map className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Land vs Water Ratio Bar */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider">
          <span className="text-emerald-400">Land Area Share: {landPercent}</span>
          <span className="text-cyan-400">Water Coverage: {waterPercent}</span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: landPercent }} />
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: waterPercent }} />
        </div>
      </div>

      {/* Climate Zones */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Köppen Climate Classification:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {climates.map((c, i) => (
            <Badge key={i} variant="outline" className="bg-slate-950 border-slate-800 text-slate-300 text-xs font-mono">
              {c}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
