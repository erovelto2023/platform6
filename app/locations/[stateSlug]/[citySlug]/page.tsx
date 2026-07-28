import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocation } from "@/lib/actions/location.actions";
import { CensusService } from "@/lib/services/census.service";
import { MarketService } from "@/lib/services/market.service";
import { CityCensusStats } from "@/components/locations/city-census-stats";
import { MarketPulse } from "@/components/locations/market-pulse";
import { ArrowLeft, Sparkles, MapPin, Search as SearchIcon } from "lucide-react";
import { Metadata } from "next";
import { getDirectoryProducts } from "@/lib/actions/directory-product.actions";
import RotatingAffiliateBanner from "@/components/glossary/RotatingAffiliateBanner";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { MetroRankings } from "@/components/locations/metro-rankings";
import { CitySearchTrends } from "@/components/locations/city-search-trends";
import { fetchLiveCitySearchTrends } from "@/lib/services/search-trends.service";
import { getStateNewspapers } from "@/lib/utils/state-newspapers";
import { MarketingCampaignToolkit } from "@/components/locations/marketing-campaign-toolkit";
import { LocalEventsRadar } from "@/components/locations/local-events-radar";
import { LocalAdRoiCalculator } from "@/components/locations/local-ad-roi-calculator";
import { CityComparisonModal } from "@/components/locations/city-comparison-modal";
import { SeasonalVelocityIndex } from "@/components/locations/seasonal-velocity-index";
import { LocalOpportunityGap } from "@/components/locations/local-opportunity-gap";
import { ExportMarketReportButton } from "@/components/locations/export-market-report-button";

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
    const searchTrends = await fetchLiveCitySearchTrends(city.name, state.name);

    // Fetch Market Pulse (Free/Open Data)
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
    const stateNewspapers = getStateNewspapers(stateSlug || state.name);
    
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
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
            <SiteHeader />
            <div className="pt-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full">
            <header className="mb-12">
                <Link 
                    href={`/locations/${stateSlug}`}
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-all mb-8 font-mono font-bold uppercase tracking-wider text-xs group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to {state.name} State Hub
                </Link>
                
                <div className="max-w-5xl">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest mb-4">
                        <MapPin size={14} /> {state.name} Market Center
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tight uppercase leading-none mb-6 text-slate-100">
                        {city.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
                            US Census & Live Google Intelligence
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-6">
                        <CityComparisonModal currentCity={city.name} currentState={state.name} currentStats={censusData} />
                        <ExportMarketReportButton cityName={city.name} stateName={state.name} />
                    </div>
                </div>
            </header>

            <main className="flex-1 space-y-16">
                {/* Live Google Search Trends */}
                <section>
                    <CitySearchTrends trends={searchTrends} cityName={city.name} stateName={state.name} />
                </section>

                {/* Local Ad Budget & ROI Estimator */}
                <section>
                    <LocalAdRoiCalculator 
                        cityName={city.name} 
                        population={censusData?.population || 14850} 
                        medianIncome={censusData?.medianIncome || 74200} 
                    />
                </section>

                {/* One-Click Local Marketing Toolkit */}
                <section>
                    <MarketingCampaignToolkit 
                        cityName={city.name} 
                        stateName={state.name} 
                        medianIncome={censusData?.medianIncome}
                        medianAge={censusData?.audience?.medianAge}
                        population={censusData?.population}
                    />
                </section>

                {/* Local Business Gap & Opportunity Spotlight */}
                <section>
                    <LocalOpportunityGap 
                        cityName={city.name} 
                        medianIncome={censusData?.medianIncome || 74200} 
                        medianAge={censusData?.audience?.medianAge || 38} 
                    />
                </section>

                {/* Seasonal Foot-Traffic Velocity Index */}
                <section>
                    <SeasonalVelocityIndex cityName={city.name} stateName={state.name} />
                </section>

                {/* State & Local Events Radar */}
                <section>
                    <LocalEventsRadar stateName={state.name} cityName={city.name} />
                </section>

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
                <section className="space-y-12">
                    <div className="border-l-4 border-cyan-500 pl-6">
                        <h2 className="text-3xl font-black uppercase tracking-tight text-slate-100">
                            Market Indicators
                        </h2>
                        <p className="text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mt-1">Census Demographics & Local Metrics</p>
                    </div>
                    <CityCensusStats 
                        data={censusData} 
                        cityName={city.name} 
                        stateName={state.name}
                        zipCodes={city.zipCodes}
                        areaCodes={city.areaCodes}
                        timezone={city.timezone}
                    />
                    <MarketPulse data={marketPulse} cityName={city.name} newspapers={displayNewspapers} />
                </section>

                {/* Recommended Resources / Rotating Banner */}
                {products && products.length > 0 && (
                    <section className="mb-12">
                        <div className="border-l-4 border-cyan-500 pl-6 mb-8">
                            <h2 className="text-3xl font-black uppercase tracking-tight text-slate-100">
                                Recommended Business Resources
                            </h2>
                        </div>
                        <div className="max-w-2xl mx-auto">
                            <RotatingAffiliateBanner products={products} />
                        </div>
                    </section>
                )}

                <section className="p-8 border border-slate-800 rounded-3xl bg-slate-900 text-center shadow-xl">
                    <h4 className="text-xl font-bold uppercase text-slate-100 mb-2">Market Execution Roadmap</h4>
                    <p className="text-slate-400 font-medium max-w-2xl mx-auto text-sm leading-relaxed">
                        Utilize live Google Search Autocomplete and US Census indicators above to validate digital demand, launch local campaigns, and evaluate product-market fit in {city.name}, {state.name}.
                    </p>
                </section>
            </main>

            <footer className="mt-20 py-12 border-t border-slate-800 text-center">
                <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                    © 2026 K Business Academy • Live Search Trends & US Census Bureau Verified
                </p>
            </footer>
            </div>
        </div>
    );
}
