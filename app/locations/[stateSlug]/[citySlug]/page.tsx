import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocation } from "@/lib/actions/location.actions";
import { CensusService } from "@/lib/services/census.service";
import { CityCensusStats } from "@/components/locations/city-census-stats";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

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
                </section>

                <section className="p-10 border border-dashed border-slate-800 rounded-[2.5rem] bg-slate-900/20 text-center">
                    <p className="text-slate-500 font-medium italic">
                        The foundation for {city.name} has been established using US Census data. Detailed niche analysis coming soon.
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
