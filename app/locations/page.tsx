import Link from "next/link";
import { getStates } from "@/lib/actions/location.actions";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function LocationsPage() {
    const states = await getStates();

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
                <section className="w-full py-12 md:py-24 bg-slate-950 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),transparent_50%)]" />
                    <div className="container px-4 md:px-6 mx-auto relative z-10">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-white uppercase italic">
                                US Business <span className="text-purple-500">Directory</span>
                            </h1>
                            <p className="text-slate-400 text-lg md:text-xl mb-8 font-medium">
                                Explore every state and city in the United States to discover unique local opportunities and business resources.
                            </p>
                        </div>
                    </div>
                </section>

                {/* States Grid */}
                <section className="w-full py-12 bg-slate-900 min-h-[400px]">
                    <div className="container px-4 md:px-6 mx-auto">
                        {states.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 border border-slate-700/50 bg-slate-800/30 rounded-3xl text-center">
                                <MapPin className="h-12 w-12 text-slate-600 mb-4" />
                                <h2 className="text-xl font-bold text-slate-400 uppercase italic">No Locations Found</h2>
                                <p className="text-slate-500 mt-2 max-w-sm">
                                    Our directory is currently being updated. Please check back shortly for full access.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {states.map((state: any) => (
                                    <Link 
                                        key={state.slug}
                                        href={`/locations/${state.slug}`}
                                        className="group relative overflow-hidden bg-slate-800 hover:bg-slate-700 p-6 rounded-2xl border border-slate-700/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                                <MapPin size={20} />
                                            </div>
                                            <span className="font-bold text-white group-hover:text-purple-400 transition-colors">
                                                {state.name}
                                            </span>
                                        </div>
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
