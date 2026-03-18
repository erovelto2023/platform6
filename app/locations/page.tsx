import Link from "next/link";
import { getStates } from "@/lib/actions/location.actions";
import { Button } from "@/components/ui/button";
import { MapPin, Search as SearchIcon } from "lucide-react";
import { Search } from "@/components/ui/Search";

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
        <div className="flex flex-col min-h-screen bg-slate-950">
            {/* Header - Simple Dark Theme */}
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
                    <Link href="/sign-up">
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                            Get Started
                        </Button>
                    </Link>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-20 bg-slate-950 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),transparent_50%)]" />
                    <div className="container px-4 md:px-6 mx-auto relative z-10">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 text-white uppercase italic">
                                US Business <span className="text-purple-500">Directory</span>
                            </h1>
                            <p className="text-slate-400 text-lg md:text-xl mb-10 font-medium max-w-2xl mx-auto">
                                Explore every state and city in the United States to discover unique local opportunities and business resources.
                            </p>
                            
                            <div className="max-w-xl mx-auto">
                                <Search placeholder="Search by state name..." />
                            </div>
                        </div>
                    </div>
                </section>

                {/* States Grid */}
                <section className="w-full py-12 bg-slate-900 min-h-[400px]">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex items-center justify-between mb-8 border-l-4 border-purple-500 pl-4">
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">
                                {query ? `Results for "${query}"` : 'Browse by State'}
                            </h2>
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full">
                                {states.length} States Found
                            </span>
                        </div>

                        {(!states || states.length === 0) ? (
                            <div className="flex flex-col items-center justify-center p-20 border border-dashed border-slate-700 bg-slate-800/20 rounded-[2rem] text-center">
                                <SearchIcon className="h-12 w-12 text-slate-700 mb-4" />
                                <h2 className="text-xl font-bold text-slate-500 uppercase italic">No Matches Found</h2>
                                <p className="text-slate-600 mt-2 max-w-sm text-sm">
                                    We couldn't find any states matching your search. Try a different term or browse the full list.
                                </p>
                                <Button 
                                    variant="link" 
                                    className="mt-4 text-purple-500 hover:text-purple-400 font-bold uppercase text-xs"
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
                                        className="group relative overflow-hidden bg-slate-800/40 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 active:scale-95"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                                                <MapPin size={20} />
                                            </div>
                                            <span className="font-bold text-slate-200 group-hover:text-white transition-colors">
                                                {state.name}
                                            </span>
                                        </div>
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-800 bg-slate-950">
                <div className="container px-4 md:px-6 mx-auto text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                        © 2025 K Business Academy. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
