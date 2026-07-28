"use client";

import { StateFactGroup } from "@/lib/utils/state-facts";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Building2, Scale, PhoneCall, Hash, Globe, Clock, ShieldCheck, FileText } from "lucide-react";

interface StateAdminTelecomDirectoryProps {
  stateName: string;
  facts: StateFactGroup;
  locationDoc?: any;
}

export function StateAdminTelecomDirectory({ stateName, facts, locationDoc }: StateAdminTelecomDirectoryProps) {
  const sosUrl = locationDoc?.website || facts.sosUrl || `https://sos.${facts.abbreviation.toLowerCase()}.gov`;
  const taxUrl = facts.taxDeptUrl || `https://revenue.${facts.abbreviation.toLowerCase()}.gov`;
  const cpaUrl = locationDoc?.cpaBoardUrl || `https://www.nasba.org/stateboards/`;

  const fips = locationDoc?.fips || "Verified State FIPS";
  const federalRegion = locationDoc?.standard_federal_region || locationDoc?.census_bureau?.region || facts.region;
  const timezones = locationDoc?.time_zones?.join(", ") || facts.timezone;

  const areaCodes = locationDoc?.areaCodes?.length > 0 
    ? locationDoc.areaCodes.join(", ") 
    : (facts.areaCodesRange || "Multiple Regional Area Codes");

  const zipCodes = locationDoc?.zipCodes?.length > 0 
    ? `${locationDoc.zipCodes[0]} – ${locationDoc.zipCodes[locationDoc.zipCodes.length - 1]}` 
    : (facts.zipCodesRange || "Statewide Postal Zip Code Range");

  return (
    <div className="space-y-8">
      {/* Official Government Quick Actions */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs font-mono font-bold uppercase tracking-wider px-3 py-1">
                <Building2 className="w-3.5 h-3.5 mr-1.5 inline" /> Official State Filings & Agencies
              </Badge>
            </div>
            <h3 className="text-xl font-black text-slate-100 uppercase tracking-tight">
              {stateName} Government & Business Portals
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href={sosUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-slate-950 border border-slate-800 rounded-2xl hover:border-cyan-500/50 transition-all group flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-100 uppercase tracking-tight group-hover:text-cyan-300 transition-colors">
                Secretary of State
              </h4>
              <p className="text-xs text-slate-400 mt-1">LLC & Corporate Entity Filings</p>
            </div>
          </a>

          <a 
            href={taxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-slate-950 border border-slate-800 rounded-2xl hover:border-emerald-500/50 transition-all group flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 group-hover:scale-105 transition-transform">
                <Scale className="w-5 h-5" />
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-100 uppercase tracking-tight group-hover:text-emerald-300 transition-colors">
                Department of Revenue
              </h4>
              <p className="text-xs text-slate-400 mt-1">State Tax Forms & Business Licensing</p>
            </div>
          </a>

          <a 
            href={cpaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-slate-950 border border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-all group flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-100 uppercase tracking-tight group-hover:text-indigo-300 transition-colors">
                State CPA Board
              </h4>
              <p className="text-xs text-slate-400 mt-1">Accounting License Verification</p>
            </div>
          </a>
        </div>
      </div>

      {/* Postal & Telecom Details Grid */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Telecom, Postal & Federal Identifiers
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold">
              <PhoneCall className="w-3.5 h-3.5" /> Regional Area Codes
            </div>
            <p className="text-sm font-black text-slate-100 truncate">{areaCodes}</p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
              <Hash className="w-3.5 h-3.5" /> Postal Zip Code Range
            </div>
            <p className="text-sm font-black text-slate-100 truncate">{zipCodes}</p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold">
              <Globe className="w-3.5 h-3.5" /> Federal Census Region
            </div>
            <p className="text-sm font-black text-slate-100 truncate">{federalRegion}</p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-1">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold">
              <Clock className="w-3.5 h-3.5" /> Timezone(s)
            </div>
            <p className="text-sm font-black text-slate-100 truncate">{timezones}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
