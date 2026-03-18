import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getLocation, getCitiesByState, syncStateData, syncLegislativeData } from "@/lib/actions/location.actions";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft, Search as SearchIcon, Landmark, Star, Calendar, Globe2, Compass, Users, Gavel, Scale, Mail, Phone, ExternalLink } from "lucide-react";
import { Search } from "@/components/ui/Search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SyncButton } from "@/components/locations/SyncButton";
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
                                <Suspense fallback={<div className="h-12 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />}>
                                    <Search placeholder={`Search cities in ${state.name}...`} />
                                </Suspense>
                            </div>

                            {/* State Fast Facts Section */}
                            {state.stateData ? (
                                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl">
                                    <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Landmark className="h-3 w-3 text-purple-400" />
                                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Capital</span>
                                        </div>
                                        <div className="text-sm font-black text-white italic">{state.stateData.capital}</div>
                                    </div>
                                    <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Star className="h-3 w-3 text-pink-400" />
                                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Nickname</span>
                                        </div>
                                        <div className="text-sm font-black text-white italic truncate" title={state.stateData.nickname}>{state.stateData.nickname}</div>
                                    </div>
                                    <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="h-3 w-3 text-emerald-400" />
                                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Statehood</span>
                                        </div>
                                        <div className="text-sm font-black text-white italic">{state.stateData.statehoodDate}</div>
                                    </div>
                                    <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Compass className="h-3 w-3 text-blue-400" />
                                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Region</span>
                                        </div>
                                        <div className="text-sm font-black text-white italic">{state.stateData.region}</div>
                                    </div>
                                    <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Globe2 className="h-3 w-3 text-cyan-400" />
                                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Timezone</span>
                                        </div>
                                        <div className="text-sm font-black text-white italic truncate" title={state.stateData.timezone}>{state.stateData.timezone}</div>
                                    </div>
                                    <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users className="h-3 w-3 text-orange-400" />
                                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Demonym</span>
                                        </div>
                                        <div className="text-sm font-black text-white italic">{state.stateData.demonym}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-12">
                                    <SyncButton 
                                        action={syncStateData} 
                                        slug={stateSlug} 
                                        label="Load State Metadata" 
                                        icon={<Globe2 className="h-3 w-3" />}
                                        className="bg-slate-900/40 border-slate-800 text-slate-500 hover:text-purple-400 hover:border-purple-500/50 transition-all font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Market & Advocacy Insights Section */}
                <section className="w-full py-12 bg-slate-900 min-h-[600px]">
                    <div className="container px-4 md:px-6 mx-auto">
                        <Tabs defaultValue="cities" className="w-full">
                            <TabsList className="bg-slate-950/50 border border-slate-800 p-1 rounded-xl mb-10 w-full md:w-fit justify-start h-auto">
                                <TabsTrigger value="cities" className="px-8 py-2.5 rounded-lg data-[state=active]:bg-purple-500 data-[state=active]:text-white uppercase font-black text-[10px] tracking-widest text-slate-500 hover:text-white transition-all">
                                    Market Cities
                                </TabsTrigger>
                                <TabsTrigger value="legislation" className="px-8 py-2.5 rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white uppercase font-black text-[10px] tracking-widest text-slate-500 hover:text-white transition-all">
                                    Legislative Intelligence
                                </TabsTrigger>
                            </TabsList>

                            {/* Cities Tab Content */}
                            <TabsContent value="cities" className="space-y-8">
                                <div className="flex items-center justify-between mb-6 border-l-4 border-purple-500 pl-4">
                                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">
                                        {query ? `Results for "${query}"` : 'Explore Market Locations'}
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
                                            We couldn't find any cities matching your search.
                                        </p>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Legislative Intelligence Tab Content */}
                            <TabsContent value="legislation" className="space-y-12">
                                <div className="flex items-center justify-between border-l-4 border-blue-500 pl-4">
                                    <div>
                                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Legislative Intelligence</h2>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Regulatory Climate & Direct Advocacy</p>
                                    </div>
                                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[8px] uppercase font-black h-fit">Open States Data</Badge>
                                </div>

                                {state.legislativeData ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Legislators List */}
                                        <div className="lg:col-span-2 space-y-6">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                <Users className="h-4 w-4 text-blue-400" /> Key Representatives
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {state.legislativeData.legislators.map((leg: any, i: number) => (
                                                    <div key={i} className="bg-slate-800/20 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 hover:border-blue-500/30 transition-all">
                                                        <div className="w-14 h-14 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-700">
                                                            {leg.photo ? (
                                                                <img src={leg.photo} alt={leg.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-600"><Users size={24} /></div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-black text-white italic truncate">{leg.name}</div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge className={`${leg.party === 'Democratic' ? 'bg-blue-600' : 'bg-red-600'} text-white text-[8px] font-black uppercase px-1.5 h-4`}>
                                                                    {leg.party.substring(0, 1)}
                                                                </Badge>
                                                                <span className="text-[10px] font-bold text-slate-500 uppercase truncate">
                                                                    {leg.chamber} / Dist. {leg.district}
                                                                </span>
                                                            </div>
                                                            <div className="flex gap-2 mt-2">
                                                                {leg.email && <a href={`mailto:${leg.email}`} className="text-slate-500 hover:text-blue-400 transition-colors"><Mail size={14} /></a>}
                                                                {leg.phone && <a href={`tel:${leg.phone}`} className="text-slate-500 hover:text-blue-400 transition-colors"><Phone size={14} /></a>}
                                                                {leg.url && <a href={leg.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-400 transition-colors"><ExternalLink size={14} /></a>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Recent Bills */}
                                        <div className="space-y-6">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                <Gavel className="h-4 w-4 text-blue-400" /> Business Bills
                                            </h3>
                                            <div className="space-y-3">
                                                {state.legislativeData.recentBills.map((bill: any, i: number) => (
                                                    <div key={i} className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl hover:border-blue-500/20 transition-all group">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">{bill.identifier}</span>
                                                            <span className="text-[8px] font-black text-slate-600 uppercase">{bill.lastActionDate}</span>
                                                        </div>
                                                        <div className="text-xs font-bold text-slate-200 line-clamp-2 leading-relaxed mb-3 group-hover:text-blue-400 transition-colors">{bill.title}</div>
                                                        <div className="flex items-center justify-between">
                                                            <Badge variant="outline" className="border-slate-800 text-[8px] text-slate-500 font-black uppercase">{bill.status?.substring(0, 20)}...</Badge>
                                                            <a href={bill.url} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-white transition-colors"><ExternalLink size={12} /></a>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Scale className="h-3 w-3 text-blue-400" />
                                                    <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Risk Analysis</span>
                                                </div>
                                                <p className="text-[10px] font-medium text-slate-500 leading-relaxed uppercase">
                                                    {state.legislativeData.recentBills.length > 0 
                                                        ? "Active business legislation detected. Review tax and labor bills for operational impact."
                                                        : "No significant business-related bills pending in recent sessions."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-20 border border-dashed border-slate-800 bg-slate-800/20 rounded-[2rem] text-center">
                                        <Gavel className="h-12 w-12 text-slate-800 mb-4" />
                                        <h2 className="text-xl font-bold text-slate-600 uppercase italic">Legislation Not Synced</h2>
                                        <p className="text-slate-700 mt-2 max-w-sm text-sm uppercase font-bold tracking-tighter">
                                            Pull real-time legislator data and active business bills for {state.name}.
                                        </p>
                                        <div className="mt-8">
                                            <SyncButton 
                                                action={syncLegislativeData} 
                                                slug={stateSlug} 
                                                label="Sync Legislation Hub" 
                                                className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] h-12 px-10 rounded-xl shadow-lg shadow-blue-500/20"
                                            />
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
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
