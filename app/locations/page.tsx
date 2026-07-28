import Link from "next/link";
import { getStates } from "@/lib/actions/location.actions";
import { Button } from "@/components/ui/button";
import { MapPin, Search as SearchIcon, Globe, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Search } from "@/components/ui/Search";
import { SimpleHeroSlideshow } from "@/components/animations";
import { SiteHeader } from "@/components/shared/SiteHeader";

export const dynamic = 'force-dynamic';

export default async function LocationsPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string }>;
}) {
    const { query } = await searchParams;
    const result = await getStates(query);
    const states = Array.isArray(result) ? result : (result?.states || []);

    const heroSlides = [
        {
            title: 'Marketers Research Database.',
            subtitle: "Stop guessing what people want. Access real-time state facts, live search trends, public school directories, healthcare networks, and state newspapers.",
            backgroundImage: '/heroimages/locations_premium.png',
            ctaText: 'Explore Research Database',
            ctaLink: '#explorer',
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
            <SiteHeader />

            <main className="flex-1">
                <SimpleHeroSlideshow slides={heroSlides} autoplay={false} />

                {/* Explorer Section */}
                <section id="explorer" className="w-full py-20 bg-slate-950 border-t border-slate-800">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                            <div className="max-w-2xl">
                                <span className="inline-flex items-center gap-2 text-cyan-400 font-mono font-bold tracking-wider text-xs mb-3 uppercase">
                                    <Globe size={14} /> Market Intelligence Database
                                </span>
                                <h2 className="text-4xl md:text-6xl font-black text-slate-100 leading-tight uppercase tracking-tight">
                                    Explore Facts Across <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">Every US State</span>
                                </h2>
                                <p className="mt-4 text-lg text-slate-300 font-medium leading-relaxed">
                                    Access verified state symbols, statehood history, live search autocomplete trends, and state newspapers.
                                </p>
                            </div>
                            <div className="w-full md:w-96">
                                <Search placeholder="Search by state name..." />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-10 border-l-4 border-cyan-500 pl-6 py-3 bg-slate-900 rounded-r-2xl border border-slate-800 shadow-xl">
                            <h3 className="text-xl font-bold text-slate-100 uppercase tracking-tight">
                                {query ? `Matches for: "${query}"` : 'United States Regions & State Hubs'}
                            </h3>
                            <div className="ml-auto bg-cyan-950 border border-cyan-800 text-cyan-300 px-4 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider">
                                {states.length} States Available
                            </div>
                        </div>

                        {(!states || states.length === 0) ? (
                            <div className="flex flex-col items-center justify-center p-24 bg-slate-900 rounded-3xl border border-slate-800 text-center shadow-xl">
                                <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-cyan-400 mb-6">
                                    <SearchIcon size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-100 mb-3 uppercase">No States Found.</h2>
                                <p className="text-slate-400 max-w-sm mb-8 font-mono text-xs uppercase tracking-wider">
                                    We couldn't find any states matching your search. Try adjusting your query.
                                </p>
                                <Link href="/locations">
                                    <Button className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 h-12 rounded-xl font-bold transition-all">
                                        Reset Search
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {states.map((state: any) => (
                                    <Link 
                                        key={state.slug}
                                        href={`/locations/${state.slug}`}
                                        className="group relative overflow-hidden bg-slate-900 p-6 rounded-3xl border border-slate-800 transition-all duration-300 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/10"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300">
                                                <MapPin size={24} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-100 text-lg group-hover:text-cyan-400 transition-colors leading-tight uppercase">
                                                    {state.name}
                                                </span>
                                                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500">Active State Hub</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
                                            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                                                State Research <ArrowRight size={14} />
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="w-full py-20 bg-slate-950 border-t border-slate-800">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 border border-slate-800 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
                            <div className="md:w-2/3 relative z-10">
                                <span className="flex items-center gap-2 text-cyan-400 font-mono font-bold tracking-wider text-xs mb-4 uppercase">
                                    <ShieldCheck size={16} /> Market Intelligence Engine
                                </span>
                                <h2 className="text-3xl md:text-5xl font-black text-slate-100 mb-4 leading-tight uppercase tracking-tight">Know Your Niche Demand</h2>
                                <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">
                                    Empower your marketing campaigns with live search autocomplete, verified state symbols, demographic indicators, and news media outlets across every US state.
                                </p>
                            </div>
                            <div className="md:w-auto w-full relative z-10">
                                <Link href="/sign-up">
                                    <Button className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-500 text-white h-14 px-8 rounded-xl font-extrabold text-lg shadow-xl transition-all">
                                        Access Research Portal
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-12 bg-slate-950 text-slate-500 border-t border-slate-800">
                <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-cyan-600 rounded-xl flex items-center justify-center font-black text-white text-lg">K</div>
                        <span className="font-bold tracking-tight text-lg uppercase text-slate-100">K RESEARCH DATABASE</span>
                    </div>
                    <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">© 2026 K Business Academy</p>
                </div>
            </footer>
        </div>
    );
}
