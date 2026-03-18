import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocation } from "@/lib/actions/location.actions";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft, Building2, Lightbulb, Users, Search } from "lucide-react";

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

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <header className="px-6 lg:px-10 h-16 flex items-center border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
                <div className="flex items-center gap-2 font-bold text-xl text-white">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white shadow-lg">
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
                <section className="w-full py-12 md:py-24 bg-slate-950 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_50%_30%,rgba(124,58,237,0.15),transparent_70%)]" />
                    <div className="container px-4 md:px-6 mx-auto relative z-10">
                        <Link 
                            href={`/locations/${stateSlug}`}
                            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 font-bold uppercase tracking-widest text-xs"
                        >
                            <ArrowLeft size={16} /> All {state.name} Cities
                        </Link>
                        
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-black uppercase tracking-widest border border-purple-500/20">
                                    {state.name}
                                </span>
                                <span className="text-slate-500">•</span>
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Business Directory</span>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 uppercase italic leading-none">
                                {city.name} <br/> 
                                <span className="text-purple-500">Business Hub</span>
                            </h1>
                            <p className="text-slate-400 text-lg md:text-2xl mb-8 font-medium leading-relaxed max-w-2xl">
                                Detailed insights, local niche opportunities, and entrepreneurial resources for {city.name}, {state.name}.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button className="bg-white text-black hover:bg-slate-200 font-black uppercase tracking-widest italic rounded-xl px-8 py-6">
                                    Explore Opportunities
                                </Button>
                                <Button variant="outline" className="border-slate-800 text-white hover:bg-slate-900 font-bold uppercase tracking-widest rounded-xl px-8 py-6">
                                    Local Resources
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Coming Soon Features */}
                <section className="w-full py-20 bg-slate-900/50">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/50 flex flex-col gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-2">
                                    <Search size={24} />
                                </div>
                                <h3 className="text-xl font-black uppercase italic">Niche Analysis</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Advanced data-driven insights into underserviced local niches in {city.name}. Coming soon.
                                </p>
                            </div>
                            <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/50 flex flex-col gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center text-pink-400 mb-2">
                                    <Users size={24} />
                                </div>
                                <h3 className="text-xl font-black uppercase italic">Community Experts</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Connect with local K Business Academy members and experts in your area. Coming soon.
                                </p>
                            </div>
                            <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/50 flex flex-col gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
                                    <Building2 size={24} />
                                </div>
                                <h3 className="text-xl font-black uppercase italic">Business Resources</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    A curated list of local service providers, from legal to accounting for {city.name} startups.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-800 bg-slate-950">
                <div className="container px-4 md:px-6 mx-auto text-center">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                        © 2025 K Business Academy. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
