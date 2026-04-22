import Link from "next/link";
import { getStates } from "@/lib/actions/location.actions";
import { Button } from "@/components/ui/button";
import { MapPin, Search as SearchIcon, Globe, ArrowRight, ShieldCheck } from "lucide-react";
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
            subtitle: "Stop guessing what people want. This database helps you find exactly what people are buying in every state. Access local news, population data, and more.",
            backgroundImage: '/heroimages/locations_premium.png',
            ctaText: 'See the Data',
            ctaLink: '#explorer',
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <SiteHeader />

            <main className="flex-1">
                <SimpleHeroSlideshow slides={heroSlides} autoplay={false} />

                {/* Explorer Section */}
                <section id="explorer" className="w-full py-24 bg-slate-50">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-10">
                            <div className="max-w-2xl">
                                <span className="flex items-center gap-2 text-emerald-600 font-black tracking-[0.3em] text-xs mb-4 uppercase">
                                    <Globe size={16} /> Market Research
                                </span>
                                <h2 className="text-4xl md:text-6xl font-black text-emerald-950 leading-[1.1] italic tracking-tighter">
                                    See the Facts in Every State.
                                </h2>
                                <p className="mt-6 text-xl text-emerald-900/60 font-medium italic">
                                    Stop guessing what people want. Use our database to find real facts about your customers.
                                </p>
                            </div>
                            <div className="w-full md:w-96">
                                <Search placeholder="Search by region..." />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-10 border-l-4 border-emerald-600 pl-6 py-2 bg-white rounded-r-2xl border border-emerald-50 shadow-sm">
                            <h3 className="text-xl font-black text-emerald-950 uppercase tracking-tight italic">
                                {query ? `Matches for: "${query}"` : 'States and Regions'}
                            </h3>
                            <div className="ml-auto bg-emerald-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200">
                                {states.length} Regions Found
                            </div>
                        </div>

                        {(!states || states.length === 0) ? (
                            <div className="flex flex-col items-center justify-center p-32 bg-white rounded-[4rem] border border-emerald-50 text-center shadow-xl shadow-emerald-200/20">
                                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-8">
                                    <SearchIcon size={40} />
                                </div>
                                <h2 className="text-3xl font-black text-emerald-950 mb-4 uppercase italic">No States Found.</h2>
                                <p className="text-emerald-900/40 max-w-sm mb-10 font-bold uppercase tracking-widest text-[10px]">
                                    We couldn't find any states matching your search. Try searching for something else.
                                </p>
                                <Link href="/locations">
                                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 h-14 rounded-2xl font-black transition-all">
                                        Reset Explorer
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {states.map((state: any) => (
                                    <Link 
                                        key={state.slug}
                                        href={`/locations/${state.slug}`}
                                        className="group relative overflow-hidden bg-white p-8 rounded-[2rem] border border-emerald-50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-100 hover:-translate-y-2 shadow-sm"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                                <MapPin size={24} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-emerald-950 text-lg group-hover:text-emerald-600 transition-colors leading-tight italic uppercase">
                                                    {state.name}
                                                </span>
                                                <span className="text-[9px] uppercase font-black tracking-widest text-emerald-900/40">Active Market</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-emerald-50">
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                                                See Details <ArrowRight size={14} />
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="w-full py-24 bg-slate-900">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="bg-emerald-600 rounded-[4rem] p-12 md:p-24 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
                            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
                            <div className="md:w-2/3 relative z-10">
                                <span className="flex items-center gap-2 text-white font-black tracking-[0.3em] text-xs mb-8 uppercase">
                                    <ShieldCheck size={16} /> Exclusive Intelligence
                                </span>
                                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight italic">Know Your Niche.</h2>
                                <p className="text-xl text-emerald-50 font-medium opacity-80 leading-relaxed">
                                    Our state data is the secret weapon for smart marketers. Stop selling to everyone and start selling to the right people based on real facts.
                                </p>
                            </div>
                            <div className="md:w-1/3 w-full relative z-10">
                                <Link href="/sign-up">
                                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white h-20 rounded-3xl font-black text-2xl shadow-2xl transition-all">
                                        Join for Data
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

             <footer className="py-12 bg-emerald-950 text-emerald-100/40 border-t border-emerald-900">
                <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center font-black text-white text-xl">K</div>
                        <span className="font-black tracking-tighter text-xl uppercase italic text-white">K RESEARCH DATABASE</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest italic text-emerald-100/20">© 2026 K Business Academy</p>
                    <nav className="flex gap-10">
                        <Link href="/courses" className="font-black hover:text-emerald-500 transition-colors text-xs uppercase tracking-widest">Courses</Link>
                        <Link href="/blog" className="font-black hover:text-emerald-500 transition-colors text-xs uppercase tracking-widest">Blog</Link>
                        <Link href="/questions" className="font-black hover:text-emerald-500 transition-colors text-xs uppercase tracking-widest">People Asked Questions</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
