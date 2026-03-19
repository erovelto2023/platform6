import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocation } from "@/lib/actions/location.actions";
import { CensusService } from "@/lib/services/census.service";
import { MarketService } from "@/lib/services/market.service";
import { CityCensusStats } from "@/components/locations/city-census-stats";
import { MarketPulse } from "@/components/locations/market-pulse";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { getDirectoryProducts } from "@/lib/actions/directory-product.actions";
import RotatingAffiliateBanner from "@/components/glossary/RotatingAffiliateBanner";

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
        <div className="flex flex-col min-h-screen bg-slate-950 text-white p-6 md:p-12 lg:p-20">
            <header className="mb-12">
                <Link 
                    href={`/locations/${stateSlug}`}
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-purple-400 transition-all mb-8 font-bold uppercase tracking-widest text-xs group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to {state.name}
                </Link>
                
                <div className="max-w-5xl">
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-none mb-6">
                        {city.name}
                    </h1>
                    <div className="flex items-center gap-3">
                        <span className="px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-black uppercase tracking-widest border border-purple-500/20">
                            {state.name}
                        </span>
                        <span className="text-slate-700">•</span>
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Market Intelligence</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 space-y-12">
                {/* Census Data Insight Dashboard */}
                <section>
                    <div className="flex items-center gap-3 mb-8 border-l-4 border-purple-500 pl-4">
                        <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
                            Market Indicators
                        </h2>
                    </div>
                    <CityCensusStats data={censusData} cityName={city.name} />
                    <MarketPulse data={marketPulse} cityName={city.name} newspapers={displayNewspapers} />
                </section>

                {/* Recommended Resources / Rotating Banner */}
                {products && products.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-8 border-l-4 border-emerald-500 pl-4">
                            <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
                                Recommended Resources
                            </h2>
                        </div>
                        <div className="max-w-2xl mx-auto">
                            <RotatingAffiliateBanner products={products} />
                        </div>
                    </section>
                )}

                <section className="p-10 border border-emerald-500/20 border-2 rounded-[2.5rem] bg-emerald-500/5 text-center">
                    <h4 className="text-xl font-black uppercase text-emerald-400 mb-2 italic tracking-tighter">Your Market Roadmap</h4>
                    <p className="text-slate-400 font-medium italic max-w-2xl mx-auto text-sm">
                        Use the data above to determine your product market fit. Whether it&apos;s a $50 guide for toddlers or a $10,000 premium course for high-earning seniors, {city.name} has clear signals for your next big move.
                    </p>
                </section>
            </main>

            <footer className="mt-20 pt-8 border-t border-slate-900">
                <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">
                    © 2025 K Business Academy. Powered by US Census Bureau Data.
                </p>
            </footer>
        </div>
    );
}
