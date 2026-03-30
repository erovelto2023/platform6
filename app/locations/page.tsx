import Link from "next/link";
import { getStates } from "@/lib/actions/location.actions";
import { Button } from "@/components/ui/button";
import { MapPin, Search as SearchIcon } from "lucide-react";
import { Search } from "@/components/ui/Search";
import { MainNav } from "@/components/shared/MainNav";

export const dynamic = 'force-dynamic';

export default async function LocationsPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string }>;
}) {
    const { query } = await searchParams;
    const result = await getStates(query);
    const states = Array.isArray(result) ? result : (result?.states || []);

    return (
        <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
            {/* Top Navigation Bar */}
            <MainNav />

            <main className="flex-1 mt-16">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-20 bg-[#f8f9fa] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),transparent_50%)]" />
                    <div className="container px-4 md:px-6 mx-auto relative z-10">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 text-[#f8fafc] uppercase italic">
                                US Business <span className="text-sky-500">Directory</span>
                            </h1>
                            <p className="text-slate-600 text-lg md:text-xl mb-10 font-medium max-w-2xl mx-auto">
                                Explore every state and city in the United States to discover unique local opportunities and business resources.
                            </p>
                            
                            <div className="max-w-xl mx-auto">
                                <Search placeholder="Search by state name..." />
                            </div>
                        </div>
                    </div>
                </section>

                {/* States Grid */}
                <section className="w-full py-12 bg-white min-h-[400px]">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex items-center justify-between mb-8 border-l-4 border-sky-500 pl-4">
                            <h2 className="text-2xl font-black text-[#f8fafc] uppercase italic tracking-tight">
                                {query ? `Results for "${query}"` : 'Browse by State'}
                            </h2>
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                                {states.length} States Found
                            </span>
                        </div>

                        {(!states || states.length === 0) ? (
                            <div className="flex flex-col items-center justify-center p-20 border border-dashed border-slate-300 bg-slate-50 rounded-[2rem] text-center">
                                <SearchIcon className="h-12 w-12 text-slate-700 mb-4" />
                                <h2 className="text-xl font-bold text-slate-500 uppercase italic">No Matches Found</h2>
                                <p className="text-slate-600 mt-2 max-w-sm text-sm">
                                    We couldn't find any states matching your search. Try a different term or browse the full list.
                                </p>
                                <Button 
                                    variant="link" 
                                    className="mt-4 text-sky-500 hover:text-sky-400 font-bold uppercase text-xs"
                                    onClick={() => window.location.href = '/locations'}
                                >
                                    Clear Search
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {states.map((state: any) => (
                                    <Link 
                                        key={state.slug}
                                        href={`/locations/${state.slug}`}
                                        className="group relative overflow-hidden bg-white border-slate-200/50 hover:bg-slate-100 p-6 rounded-2xl border border-slate-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-sky-500/10 active:scale-95"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-[#0284c7] transition-all duration-300">
                                                <MapPin size={20} />
                                            </div>
                                            <span className="font-bold text-slate-800 group-hover:text-[#0284c7] transition-colors">
                                                {state.name}
                                            </span>
                                        </div>
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-200 bg-[#f8f9fa]">
                <div className="container px-4 md:px-6 mx-auto text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                        © 2025 K Business Academy. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
