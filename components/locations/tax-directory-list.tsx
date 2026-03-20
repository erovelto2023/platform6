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
  Briefcase
} from "lucide-react";
import { useState, useMemo } from "react";

interface CPAListing {
  _id: string;
  name: string;
  city: string;
  state: string;
  licenseNumber?: string;
  isFirm: boolean;
  phone?: string;
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
      <div className="p-12 border border-dashed border-slate-800 rounded-[2.5rem] bg-slate-900/10 text-center">
        <Calculator className="w-12 h-12 text-slate-700 mx-auto mb-4 opacity-20" />
        <h3 className="text-xl font-black uppercase italic text-slate-500">Tax Directory Initializing</h3>
        <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mt-2 max-w-sm mx-auto leading-relaxed">
          We are currently verifiying and importing the latest CPA license data for {cityName}. Check back shortly for the verified results.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Directory Search & Stats Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <Scale className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase italic leading-none">{listings.length} VERIFIED FIRMS</h4>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Found in {cityName}, {stateName}</p>
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by name..." 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all uppercase tracking-tight"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of CPA Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.slice(0, 51).map((cpa) => (
          <Card key={cpa._id} className="bg-slate-900/40 border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all border-b-2 border-b-emerald-500/20 flex flex-col group">
            <CardHeader className="p-5 pb-0 flex flex-row items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[8px] uppercase font-black px-1.5 py-0">
                    {cpa.isFirm ? "CPA FIRM" : "INDIVIDUAL CPA"}
                  </Badge>
                  {cpa.licenseNumber && (
                    <span className="text-[8px] font-black text-slate-600 uppercase">#{cpa.licenseNumber}</span>
                  )}
                </div>
                <CardTitle className="text-base font-black text-white leading-tight uppercase italic group-hover:text-emerald-400 transition-colors line-clamp-2 min-h-[3rem]">
                  {cpa.name}
                </CardTitle>
              </div>
              <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800 shrink-0">
                <Building2 className="w-4 h-4 text-slate-500" />
              </div>
            </CardHeader>
            
            <CardContent className="p-5 pt-4 flex-1 flex flex-col gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                  <MapPin className="w-3 h-3 text-emerald-500/50" />
                  {cpa.city}, {cpa.state}
                </div>
                {cpa.services && cpa.services.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {cpa.services.map((s: string) => (
                      <Badge key={s} variant="secondary" className="bg-slate-800 text-slate-400 text-[8px] font-black px-2 py-0">
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 h-8 bg-slate-950 border-slate-800 text-slate-400 text-[10px] font-black uppercase hover:text-emerald-400 hover:border-emerald-500/30 transition-all group/btn"
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(cpa.name + ' CPA ' + cpa.city)}`, '_blank')}
                >
                  <Search className="w-3 h-3 mr-2 group/btn-hover:scale-110" />
                  Details
                </Button>
                
                {cpa.website ? (
                  <Button 
                    size="sm" 
                    className="flex-1 h-8 bg-emerald-500 hover:bg-emerald-400 text-white text-[10px] font-black uppercase shadow-lg shadow-emerald-500/10"
                    onClick={() => window.open(cpa.website, '_blank')}
                  >
                    <Globe className="w-3 h-3 mr-2" />
                    Visit Site
                  </Button>
                ) : (
                  <Button 
                    disabled 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 h-8 text-slate-700 text-[10px] font-black uppercase bg-slate-900/40 cursor-not-allowed"
                  >
                    <Phone className="w-3 h-3 mr-2" />
                    Pending
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredListings.length > 51 && (
        <div className="p-8 border border-slate-800 rounded-2xl bg-slate-900/20 text-center">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic mb-4">Displaying top results for {cityName}. Showing 51 of {filteredListings.length} total firms.</p>
            <Button variant="outline" className="border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 uppercase font-black text-xs tracking-widest transition-all">
                Load All Local Experts <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </div>
      )}

      {/* Trust Signifier */}
      <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-4">
        <ShieldCheck className="w-8 h-8 text-emerald-500/40 shrink-0" />
        <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase italic">
          K Business Academy verifies licensure through official State Board of Accountancy databases. 
          The directory is updated monthly to ensure you find the most reliable tax and accounting professionals in {stateName}.
        </p>
      </div>
    </div>
  );
}
