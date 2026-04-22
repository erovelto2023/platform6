import React from 'react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Star, ArrowRight, TrendingUp } from "lucide-react";

interface NicheBox {
    _id: string;
    nicheName: string;
    nicheSlug: string;
    category: string;
    competition: string;
    marketSize: string;
    growthRate: string;
}

export function NicheAnalysis({ 
    cityName, 
    niches 
}: { 
    cityName: string; 
    niches: NicheBox[] 
}) {
    if (!niches || niches.length === 0) {
        return (
            <div className="p-8 rounded-3xl bg-slate-50 border border-emerald-100 text-center shadow-sm">
                <p className="text-emerald-900/40 font-bold uppercase tracking-widest text-xs italic">
                    Generating local niche data for {cityName}...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp className="text-emerald-600" size={20} />
                    <h3 className="text-2xl font-black uppercase italic text-emerald-950 tracking-tight">
                        Opportunities in <span className="text-emerald-600">{cityName}</span>
                    </h3>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {niches.map((niche) => (
                    <Card key={niche._id} className="bg-white border-emerald-100 hover:border-emerald-500/50 transition-all duration-300 rounded-3xl overflow-hidden group shadow-sm">
                        <CardHeader className="pb-3 px-6 pt-6">
                            <div className="flex justify-between items-start mb-2">
                                <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                    {niche.category}
                                </Badge>
                                {niche.competition === 'Low' && (
                                    <Star className="text-amber-500 fill-amber-500" size={12} />
                                )}
                            </div>
                            <CardTitle className="text-lg font-black uppercase italic text-emerald-950 group-hover:text-emerald-600 transition-colors">
                                {niche.nicheName}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-emerald-900/40 border-b border-emerald-50 pb-2">
                                    <span>Market Size</span>
                                    <span className="text-emerald-950">{niche.marketSize || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-emerald-900/40 border-b border-emerald-50 pb-2">
                                    <span>Growth</span>
                                    <span className="text-emerald-600">{niche.growthRate || 'Stable'}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-emerald-900/40">
                                    <span>Competition</span>
                                    <span className={`${
                                        niche.competition === 'Low' ? 'text-emerald-600' : 'text-emerald-950'
                                    }`}>{niche.competition}</span>
                                </div>
                            </div>
                            <Link href={`/niche-boxes/${niche.nicheSlug}`}>
                                <Button className="w-full bg-slate-50 hover:bg-emerald-600 text-emerald-950 hover:text-white font-black uppercase tracking-widest text-[10px] py-6 rounded-2xl transition-all group-hover:-translate-y-1 shadow-sm border border-emerald-100">
                                    Access Blueprint <ArrowRight size={14} className="ml-2" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
