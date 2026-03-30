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
        <div className="flex flex-col min-h-screen bg-[#fefae0]">
            <SiteHeader />

            <main className="flex-1">
                <SimpleHeroSlideshow slides={heroSlides} autoplay={false} />

                {/* Explorer Section */}
                <section id="explorer" className="w-full py-24 bg-[#fefae0]">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-10">
                            <div className="max-w-2xl">
                                <span className="flex items-center gap-2 text-[#bc6c25] font-black tracking-[0.3em] text-xs mb-4 uppercase">
                                    <Globe size={16} /> Market Research
                                </span>
                                <h2 className="text-4xl md:text-6xl font-black text-[#283618] leading-[1.1]">
                                    See the Facts in Every State.
                                </h2>
                                <p className="mt-6 text-xl text-[#283618]/60 font-medium">
                                    Stop guessing what people want. Use our database to find real facts about your customers for $497/yr.
                                </p>
                            </div>
                            <div className="w-full md:w-96">
                                <Search placeholder="Search by region..." />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-10 border-l-4 border-[#606c38] pl-6 py-2 bg-[#606c38]/5 rounded-r-2xl">
                            <h3 className="text-xl font-black text-[#283618] uppercase tracking-tight italic">
                                {query ? `Matches for: "${query}"` : 'States and Regions'}
                            </h3>
                            <div className="ml-auto bg-[#606c38] text-[#fefae0] px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#606c38]/20">
                                {states.length} Regions Found
                            </div>
                        </div>

                        {(!states || states.length === 0) ? (
                            <div className="flex flex-col items-center justify-center p-32 bg-white rounded-[4rem] border border-[#283618]/5 text-center shadow-xl shadow-[#283618]/5">
                                <div className="w-20 h-20 bg-[#fefae0] rounded-full flex items-center justify-center text-[#bc6c25] mb-8">
                                    <SearchIcon size={40} />
                                </div>
                                <h2 className="text-3xl font-black text-[#283618] mb-4">No States Found.</h2>
                                <p className="text-[#283618]/50 max-w-sm mb-10 font-medium italic">
                                    We couldn't find any states matching your search. Try searching for something else.
                                </p>
                                <Link href="/locations">
                                    <Button className="bg-[#283618] hover:bg-[#606c38] text-[#fefae0] px-10 h-14 rounded-2xl font-black transition-all">
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
                                        className="group relative overflow-hidden bg-white p-8 rounded-[2rem] border border-[#283618]/5 transition-all duration-500 hover:shadow-2xl hover:shadow-[#606c38]/10 hover:-translate-y-2"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[#dda15e]/10 flex items-center justify-center text-[#bc6c25] group-hover:bg-[#606c38] group-hover:text-[#fefae0] transition-all duration-500 shadow-sm">
                                                <MapPin size={24} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-[#283618] text-lg group-hover:text-[#606c38] transition-colors leading-tight">
                                                    {state.name}
                                                </span>
                                                <span className="text-[10px] uppercase font-black tracking-widest text-[#283618]/30">Active Market</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#283618]/5">
                                            <span className="text-[10px] font-black text-[#bc6c25] uppercase tracking-widest group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
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
                <section className="w-full py-24 bg-[#283618]">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="bg-[#dda15e] rounded-[4rem] p-12 md:p-24 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
                            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#283618]/10 rounded-full blur-[100px]" />
                            <div className="md:w-2/3 relative z-10">
                                <span className="flex items-center gap-2 text-[#283618] font-black tracking-[0.3em] text-xs mb-8 uppercase">
                                    <ShieldCheck size={16} /> Exclusive Intelligence
                                </span>
                                <h2 className="text-4xl md:text-6xl font-black text-[#fefae0] mb-8 leading-tight italic">Know Your Niche.</h2>
                                <p className="text-xl text-[#283618] font-medium opacity-80 leading-relaxed">
                                    Our state data is the secret weapon for smart marketers. Stop selling to everyone and start selling to the right people based on real facts.
                                </p>
                            </div>
                            <div className="md:w-1/3 w-full relative z-10">
                                <Link href="/sign-up">
                                    <Button className="w-full bg-[#283618] hover:bg-[#606c38] text-[#fefae0] h-20 rounded-3xl font-black text-2xl shadow-2xl transition-all">
                                        Join for Data
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

             <footer className="py-12 bg-[#283618] text-[#fefae0]/40 border-t border-[#fefae0]/5">
                <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3 grayscale brightness-200 opacity-40">
                        <div className="w-10 h-10 bg-[#606c38] rounded-xl flex items-center justify-center font-black text-[#fefae0] text-xl">K</div>
                        <span className="font-bold tracking-tighter text-xl uppercase">K RESEARCH DATABASE</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest italic">© 2026 K Business Academy</p>
                    <nav className="flex gap-10">
                        <Link href="/courses" className="font-bold hover:text-[#dda15e] transition-colors text-sm">How it Works</Link>
                        <Link href="/library" className="font-bold hover:text-[#dda15e] transition-colors text-sm">Library</Link>
                        <Link href="#" className="font-bold hover:text-[#dda15e] transition-colors text-sm">Legal</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
