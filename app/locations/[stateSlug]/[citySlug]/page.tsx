import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocation } from "@/lib/actions/location.actions";
import { CensusService } from "@/lib/services/census.service";
import { MarketService } from "@/lib/services/market.service";
import { CityCensusStats } from "@/components/locations/city-census-stats";
import { MarketPulse } from "@/components/locations/market-pulse";
import { ArrowLeft, Calculator } from "lucide-react";
import { Metadata } from "next";
import { getDirectoryProducts } from "@/lib/actions/directory-product.actions";
import RotatingAffiliateBanner from "@/components/glossary/RotatingAffiliateBanner";
import { TaxDirectoryList } from "@/components/locations/tax-directory-list";
import { getCPAsByLocation } from "@/lib/actions/cpa.actions";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { MetroRankings } from "@/components/locations/metro-rankings";
import { SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ stateSlug: string; citySlug: string }>;
}): Promise<Metadata> {
    const { stateSlug, citySlug } = await params;
    const city = await getLocation(citySlug, stateSlug);
    const state = await getLocation(stateSlug);

    if (!city || !state) return { title: 'City Not Found' };

    return {
        title: `${city.name}, ${state.name} | K Business Academy`,
        description: `Market information and demographic insights for ${city.name}, ${state.name}.`,
    };
}

export default async function CityPage({
    params,
}: {
    params: Promise<{ stateSlug: string; citySlug: string }>;
}) {
    const { stateSlug, citySlug } = await params;
    const city = await getLocation(citySlug, stateSlug);
    const state = await getLocation(stateSlug);

    if (!city || !state) {
        notFound();
    }

    // Fetch live market data from US Census
    const censusData = await CensusService.getCityDemographics(city.name, state.name);
    const { products } = await getDirectoryProducts();
    const cpas = await getCPAsByLocation(city.name, state.name);

    // Fetch Market Pulse (Free/Open Data)
    // Map state name to code for Ticketmaster/OSM
    const STATE_CODES: Record<string, string> = {
        "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
        "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
        "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
        "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
        "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO",
        "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
        "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
        "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
        "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT",
        "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"
    };
    const stateCode = STATE_CODES[state.name] || "";
    let marketPulse = null;
    try {
        marketPulse = await MarketService.getMarketPulse(city.name, state.name, stateCode);
    } catch (error) {
        console.error("Failed to fetch market pulse:", error);
    }

    // Fetch state newspapers for fallback/aggregation
    const stateDoc = await getLocation(stateSlug, "");
    const stateNewspapers = stateDoc?.newspapers || [];
    
    // Merge city and state newspapers, removing duplicates by name
    const allNewspapers = [...(city.newspapers || []), ...stateNewspapers];
    const uniqueNewspapersMap = new Map();
    allNewspapers.forEach(n => {
        if (!uniqueNewspapersMap.has(n.name)) {
            uniqueNewspapersMap.set(n.name, n);
        }
    });
    const displayNewspapers = Array.from(uniqueNewspapersMap.values());

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <SiteHeader />
            <div className="pt-24 px-6 md:px-12 lg:px-20">
            <header className="mb-12">
                <Link 
                    href={`/locations/${stateSlug}`}
                    className="inline-flex items-center gap-2 text-emerald-900/40 hover:text-emerald-600 transition-all mb-8 font-black uppercase tracking-widest text-[10px] group"
                >
                    <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to {state.name}
                </Link>
                
                <div className="max-w-5xl">
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-none mb-6 text-emerald-950">
                        {city.name}
                    </h1>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] uppercase font-black tracking-widest">Census Snapshot</Badge>
                        <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                            {state.name}
                        </span>
                        <span className="text-emerald-900/10">•</span>
                        <span className="text-emerald-900/40 text-[10px] font-black uppercase tracking-widest">Market Intelligence</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 space-y-20">
                {/* Metro Area Rankings */}
                {city.metroStats && (
                    <section>
                        <MetroRankings 
                            metroName={city.metroName || ""} 
                            stats={city.metroStats} 
                        />
                    </section>
                )}

                {/* Census Data Insight Dashboard */}
                <section>
                    <div className="flex items-center gap-3 mb-8 border-l-4 border-emerald-600 pl-4">
                        <h2 className="text-3xl font-black uppercase italic tracking-tight text-emerald-950">
                            Market Indicators
                        </h2>
                    </div>
                    <CityCensusStats 
                        data={censusData} 
                        cityName={city.name} 
                        zipCodes={city.zipCodes}
                        areaCodes={city.areaCodes}
                        timezone={city.timezone}
                    />
                    <MarketPulse data={marketPulse} cityName={city.name} newspapers={displayNewspapers} />
                </section>

                {/* Tax & Accounting Hub */}
                <section id="tax-directory">
                    <div className="flex items-center gap-3 mb-8 border-l-4 border-emerald-600 pl-4">
                        <div className="flex flex-col">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-emerald-950 leading-tight">
                                Tax & Accounting Hub
                            </h2>
                            <p className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em]">Verified Local Experts</p>
                        </div>
                        <div className="ml-auto p-2 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm">
                            <Calculator className="w-5 h-5 text-emerald-600" />
                        </div>
                    </div>
                    
                    <TaxDirectoryList 
                        listings={cpas} 
                        cityName={city.name} 
                        stateName={state.name} 
                    />
                </section>

                {/* Recommended Resources / Rotating Banner */}
                {products && products.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-8 border-l-4 border-emerald-600 pl-4">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-emerald-950">
                                Recommended Resources
                            </h2>
                        </div>
                        <div className="max-w-2xl mx-auto">
                            <RotatingAffiliateBanner products={products} />
                        </div>
                    </section>
                )}

                <section className="p-10 border border-emerald-500/20 border-2 rounded-[2.5rem] bg-emerald-500/5 text-center">
                    <h4 className="text-xl font-black uppercase text-emerald-900 mb-2 italic tracking-tighter">Your Market Roadmap</h4>
                    <p className="text-slate-600 font-medium italic max-w-2xl mx-auto text-sm">
                        Use the data above to determine your product market fit. Whether it&apos;s a $50 guide for toddlers or a $10,000 premium course for high-earning seniors, {city.name} has clear signals for your next big move.
                    </p>
                </section>
            </main>

            <footer className="mt-20 py-12 border-t border-emerald-50">
                <p className="text-[10px] text-emerald-900/40 font-black uppercase tracking-[0.3em] text-center">
                    © 2025 K Business Academy • US Census Bureau Verified Data
                </p>
            </footer>
            </div>
        </div>
    );
}
