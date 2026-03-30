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
            title: 'Market Intelligence',
            subtitle: 'Strategic geographical data assets for professional business operations. Map your growth with precision.',
            backgroundImage: '/heroimages/locations_premium.png',
            ctaText: 'Explore Data',
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
                                    <Globe size={16} /> Global Infrastructure
                                </span>
                                <h2 className="text-4xl md:text-6xl font-black text-[#283618] leading-[1.1]">
                                    Intelligence Explorer.
                                </h2>
                                <p className="mt-6 text-xl text-[#283618]/60 font-medium">
                                    Access tactical data across the United States. Find markets, resources, and operational nodes.
                                </p>
                            </div>
                            <div className="w-full md:w-96">
                                <Search placeholder="Search by region..." />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-10 border-l-4 border-[#606c38] pl-6 py-2 bg-[#606c38]/5 rounded-r-2xl">
                            <h3 className="text-xl font-black text-[#283618] uppercase tracking-tight italic">
                                {query ? `Matched Analysis: "${query}"` : 'Tactical Regions'}
                            </h3>
                            <div className="ml-auto bg-[#606c38] text-[#fefae0] px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#606c38]/20">
                                {states.length} Active Nodes
                            </div>
                        </div>

                        {(!states || states.length === 0) ? (
                            <div className="flex flex-col items-center justify-center p-32 bg-white rounded-[4rem] border border-[#283618]/5 text-center shadow-xl shadow-[#283618]/5">
                                <div className="w-20 h-20 bg-[#fefae0] rounded-full flex items-center justify-center text-[#bc6c25] mb-8">
                                    <SearchIcon size={40} />
                                </div>
                                <h2 className="text-3xl font-black text-[#283618] mb-4">No Nodes Detected.</h2>
                                <p className="text-[#283618]/50 max-w-sm mb-10 font-medium italic">
                                    We couldn't find any regions matching your specific query. Try broadening your parameters.
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
                                                Analyze Node <ArrowRight size={14} />
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
                                <h2 className="text-4xl md:text-6xl font-black text-[#fefae0] mb-8 leading-tight italic">Expand Your Reach.</h2>
                                <p className="text-xl text-[#283618] font-medium opacity-80 leading-relaxed">
                                    K Business Academy members get priority access to deep-market data, localized resource maps, and strategic networking opportunities in every node.
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
                    <div className="flex items-center gap-2 grayscale brightness-200 opacity-40">
                        <div className="w-8 h-8 bg-[#606c38] rounded flex items-center justify-center font-black text-[#fefae0]">K</div>
                        <span className="font-bold tracking-tighter">K BUSINESS INTELLIGENCE</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest italic">© 2026 Global Intelligence Network</p>
                    <nav className="flex gap-10">
                        <Link href="/courses" className="font-bold hover:text-[#dda15e] transition-colors text-sm">Methodology</Link>
                        <Link href="/library" className="font-bold hover:text-[#dda15e] transition-colors text-sm">Archives</Link>
                        <Link href="#" className="font-bold hover:text-[#dda15e] transition-colors text-sm">Legal</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
