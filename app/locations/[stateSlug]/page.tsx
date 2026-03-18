import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocation, getCitiesByState } from "@/lib/actions/location.actions";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft, Search as SearchIcon } from "lucide-react";
import { Search } from "@/components/ui/Search";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ stateSlug: string }>;
}): Promise<Metadata> {
    const { stateSlug } = await params;
    const state = await getLocation(stateSlug);
    
    if (!state) return { title: 'State Not Found' };

    return {
        title: `${state.name} Business Hub | K Business Academy`,
        description: `Explore local business opportunities, underserved niches, and entrepreneurial resources in the state of ${state.name}.`,
        openGraph: {
            title: `${state.name} Business Directory`,
            description: `Unlock business insights for ${state.name}.`,
        }
    };
}

export default async function StatePage({
    params,
    searchParams,
}: {
    params: Promise<{ stateSlug: string }>;
    searchParams: Promise<{ query?: string }>;
}) {
    const { stateSlug } = await params;
    const { query } = await searchParams;
    
    const state = await getLocation(stateSlug);

    if (!state) {
        notFound();
    }

    const cities = await getCitiesByState(stateSlug, query);

    return (
        <div className="flex flex-col min-h-screen bg-slate-950">
            {/* Header */}
            <header className="px-6 lg:px-10 h-16 flex items-center border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
                <div className="flex items-center gap-2 font-bold text-xl text-white">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-purple-500/50">
                            K
                        </div>
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            K Business Academy
                        </span>
                    </Link>
                </div>
                <nav className="ml-auto flex items-center gap-4 sm:gap-6">
                    <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/locations">
                        Directory
                    </Link>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-20 bg-slate-950 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_10%,rgba(124,58,237,0.1),transparent_50%)]" />
                    <div className="container px-4 md:px-6 mx-auto relative z-10">
                        <Link 
                            href="/locations"
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-purple-400 transition-all mb-8 font-bold uppercase tracking-widest text-xs group"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> All States
                        </Link>
                        <div className="text-left max-w-4xl">
                            <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 text-white uppercase italic leading-tight">
                                {state.name} <span className="text-purple-500">Business Hub</span>
                            </h1>
                            <p className="text-slate-400 text-lg md:text-xl mb-10 font-medium max-w-2xl">
                                Discover all city-level business insights and local resources across the state of {state.name}.
                            </p>
                            
                            <div className="max-w-xl">
                                <Search placeholder={`Search cities in ${state.name}...`} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cities Grid */}
                <section className="w-full py-12 bg-slate-900 min-h-[500px]">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex items-center justify-between mb-10 border-l-4 border-purple-500 pl-4">
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">
                                {query ? `Results for "${query}"` : 'Explore Cities'}
                            </h2>
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full">
                                {cities.length} Cities Found
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {cities.map((city: any) => (
                                <Link 
                                    key={city.slug}
                                    href={`/locations/${stateSlug}/${city.slug}`}
                                    className="group relative overflow-hidden bg-slate-800/40 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 active:scale-95"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                                                <MapPin size={20} />
                                            </div>
                                            <span className="font-bold text-slate-200 group-hover:text-white transition-colors">
                                                {city.name}
                                            </span>
                                        </div>
                                        <ArrowLeft className="rotate-180 opacity-0 group-hover:opacity-100 transition-all text-purple-400 -translate-x-2 group-hover:translate-x-0" size={16} />
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ))}
                        </div>
                        
                        {cities.length === 0 && (
                            <div className="flex flex-col items-center justify-center p-20 border border-dashed border-slate-700 bg-slate-800/20 rounded-[2rem] text-center">
                                <SearchIcon className="h-12 w-12 text-slate-700 mb-4" />
                                <h2 className="text-xl font-bold text-slate-500 uppercase italic">No Cities Found</h2>
                                <p className="text-slate-600 mt-2 max-w-sm text-sm">
                                    We couldn't find any cities in {state.name} matching your search.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-800 bg-slate-950">
                <div className="container px-4 md:px-6 mx-auto text-center">
                    <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">
                        © 2025 K Business Academy. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
