import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocation, getCitiesByState } from "@/lib/actions/location.actions";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronLeft, ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function StatePage({
    params,
}: {
    params: Promise<{ stateSlug: string }>;
}) {
    const { stateSlug } = await params;
    const state = await getLocation(stateSlug);

    if (!state) {
        notFound();
    }

    const cities = await getCitiesByState(stateSlug);

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
                <section className="w-full py-12 md:py-24 bg-slate-950 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_10%,rgba(124,58,237,0.1),transparent_50%)]" />
                    <div className="container px-4 md:px-6 mx-auto relative z-10">
                        <Link 
                            href="/locations"
                            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 font-bold uppercase tracking-widest text-xs"
                        >
                            <ArrowLeft size={16} /> All States
                        </Link>
                        <div className="text-left max-w-3xl">
                            <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 text-white uppercase italic">
                                {state.name} <span className="text-purple-500">Business Hub</span>
                            </h1>
                            <p className="text-slate-400 text-lg md:text-xl mb-8 font-medium">
                                Discover all city-level business insights and local resources across the state of {state.name}.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Cities Grid */}
                <section className="w-full py-12 bg-slate-900">
                    <div className="container px-4 md:px-6 mx-auto">
                        <h2 className="text-2xl font-black text-white uppercase italic mb-8 border-l-4 border-purple-500 pl-4 tracking-tight">
                            Explore Cities
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {cities.map((city: any) => (
                                <Link 
                                    key={city.slug}
                                    href={`/locations/${stateSlug}/${city.slug}`}
                                    className="group relative overflow-hidden bg-slate-800 hover:bg-slate-700 p-6 rounded-2xl border border-slate-700/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                                <MapPin size={20} />
                                            </div>
                                            <span className="font-bold text-white group-hover:text-purple-400 transition-colors">
                                                {city.name}
                                            </span>
                                        </div>
                                        <ArrowLeft className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" size={16} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                        {cities.length === 0 && (
                            <div className="bg-slate-800/50 border border-slate-700/50 p-12 rounded-3xl text-center">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No cities listed for this state yet.</p>
                                <p className="text-slate-500 text-xs mt-2">More cities are being added daily.</p>
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
