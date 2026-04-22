"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  ShieldCheck, 
  ArrowRight, 
  Search,
  Scale,
  Calculator,
  Mail
} from "lucide-react";
import { useState, useMemo } from "react";

interface CPAListing {
  _id: string;
  name: string;
  city: string;
  state: string;
  address?: string;
  licenseNumber?: string;
  isFirm: boolean;
  phone?: string;
  fax?: string;
  email?: string;
  website?: string;
  services?: string[];
  slug: string;
}

interface TaxDirectoryListProps {
  listings: any[];
  cityName: string;
  stateName: string;
}

export function TaxDirectoryList({ listings, cityName, stateName }: TaxDirectoryListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredListings = useMemo(() => {
    return (listings || []).filter(l => 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.city && l.city.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [listings, searchQuery]);

  if (!listings || listings.length === 0) {
    return (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
                    <Scale className="w-6 h-6 text-emerald-600 animate-pulse" />
                </div>
                <h3 className="text-xl font-black text-emerald-950 uppercase italic mb-2 tracking-tighter">Tax Directory Initializing</h3>
                <p className="text-sm text-emerald-900/60 font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">
                    We are currently verifying and importing localized tax professional data for {cityName}. Check back soon for the full verified list.
                </p>
            </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Directory Search & Stats Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-white border border-slate-200 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-500/20">
            <Scale className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h4 className="text-sm font-black text-emerald-950 uppercase italic leading-none">{listings.length} VERIFIED FIRMS</h4>
            <p className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest mt-1">Found in {cityName}, {stateName}</p>
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by name..." 
            className="w-full bg-slate-50 border border-emerald-50 rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-emerald-950 placeholder:text-emerald-900/20 focus:outline-none focus:border-emerald-600/50 transition-all uppercase tracking-tight shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of CPA Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.slice(0, 51).map((cpa) => (
          <Card key={cpa._id} className="bg-white border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all border-b-2 border-b-emerald-500/20 flex flex-col group">
            <CardHeader className="p-5 pb-0 flex flex-row items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-500/20 text-[8px] uppercase font-black px-1.5 py-0">
                    {cpa.isFirm ? "CPA FIRM" : "INDIVIDUAL CPA"}
                  </Badge>
                  {cpa.licenseNumber && (
                    <span className="text-[8px] font-black text-emerald-900/40 uppercase">#{cpa.licenseNumber}</span>
                  )}
                </div>
                <CardTitle className="text-base font-black text-emerald-950 leading-tight uppercase italic group-hover:text-emerald-600 transition-colors line-clamp-2 min-h-[3rem]">
                  {cpa.name}
                </CardTitle>
              </div>
              <div className="p-2 bg-[#f8f9fa]/60 rounded-xl border border-slate-200 shrink-0">
                <Building2 className="w-4 h-4 text-slate-500" />
              </div>
            </CardHeader>
            
            <CardContent className="p-5 pt-4 flex-1 flex flex-col gap-3">
              <div className="space-y-1.5">
                {/* Address */}
                {cpa.address ? (
                  <div className="flex items-start gap-2 text-[10px] font-semibold text-emerald-900/60">
                    <MapPin className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{cpa.address}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[10px] font-black text-emerald-900/40 uppercase">
                    <MapPin className="w-3 h-3 text-emerald-500/40" />
                    {cpa.city}, {cpa.state}
                  </div>
                )}

                {/* Phone */}
                {cpa.phone && (
                  <a href={`tel:${cpa.phone}`} className="flex items-center gap-2 text-[10px] font-semibold text-emerald-900/60 hover:text-emerald-600 transition-colors group/link">
                    <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{cpa.phone}</span>
                  </a>
                )}

                {/* Email */}
                {cpa.email && (
                  <a href={`mailto:${cpa.email}`} className="flex items-center gap-2 text-[10px] font-semibold text-emerald-900/60 hover:text-emerald-600 transition-colors group/link">
                    <Mail className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{cpa.email}</span>
                  </a>
                )}
              </div>

              {/* Services */}
              {cpa.services && cpa.services.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {cpa.services.map((s: string) => (
                    <Badge key={s} variant="secondary" className="bg-slate-100 text-slate-600 text-[8px] font-black px-2 py-0">
                      {s}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-auto pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 bg-slate-50 border-emerald-50 text-emerald-900/60 text-[10px] font-black uppercase hover:text-emerald-600 hover:border-emerald-600 transition-all group/btn shadow-sm"
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(cpa.name + ' CPA ' + cpa.city)}`, '_blank')}
                >
                  <Search className="w-3 h-3 mr-1.5 group-hover/btn:scale-110" />
                  Search
                </Button>
                
                {cpa.website ? (
                  <Button 
                    size="sm" 
                    className="h-8 bg-emerald-500 hover:bg-emerald-400 text-white text-[10px] font-black uppercase shadow-lg shadow-emerald-500/10"
                    onClick={() => window.open(cpa.website, '_blank')}
                  >
                    <Globe className="w-3 h-3 mr-1.5" />
                    Website
                  </Button>
                ) : cpa.phone ? (
                  <a href={`tel:${cpa.phone}`} className="contents">
                    <Button 
                      size="sm" 
                      className="h-8 bg-emerald-500 hover:bg-emerald-400 text-white text-[10px] font-black uppercase shadow-lg shadow-emerald-500/10"
                    >
                      <Phone className="w-3 h-3 mr-1.5" />
                      Call
                    </Button>
                  </a>
                ) : (
                  <Button 
                    disabled 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-emerald-900/20 text-[10px] font-black uppercase bg-slate-50 cursor-not-allowed shadow-sm"
                  >
                    <Globe className="w-3 h-3 mr-1.5" />
                    No Site
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredListings.length > 51 && (
        <div className="p-8 border border-emerald-50 rounded-2xl bg-slate-50 text-center shadow-sm">
            <p className="text-emerald-900/40 text-[10px] font-black uppercase tracking-widest italic mb-4">Displaying top results for {cityName}. Showing 51 of {filteredListings.length} total firms.</p>
            <Button variant="outline" className="border-emerald-100 text-emerald-600 hover:bg-emerald-50 uppercase font-black text-xs tracking-widest transition-all shadow-sm">
                Load All Local Experts <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </div>
      )}

      {/* Trust Signifier */}
      <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4 shadow-sm">
        <ShieldCheck className="w-8 h-8 text-emerald-600/40 shrink-0" />
        <p className="text-[10px] font-bold text-emerald-900/40 leading-relaxed uppercase italic">
          K Business Academy verifies licensure through official State Board of Accountancy databases. 
          The directory is updated monthly to ensure you find the most reliable tax and accounting professionals in {stateName}.
        </p>
      </div>
    </div>
  );
}
