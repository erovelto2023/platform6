import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getLocation, getCitiesByState, syncStateData } from "@/lib/actions/location.actions";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft, Search as SearchIcon, Landmark, Star, Calendar, Globe2, Compass, Users, Gavel, Scale, Mail, Phone, ExternalLink, Bird, Flower2, TreeDeciduous, Quote, Music, Layers, AlertTriangle, DollarSign, TrendingUp } from "lucide-react";
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
    
    let state = await getLocation(stateSlug);

    if (!state) {
        notFound();
    }

    let syncError = null;

    // Auto-sync State Metadata if missing or partial (missing capital is our indicator)
    if (!state.capital?.name) {
        try {
            const result = await syncStateData(stateSlug, false);
            if (!result.success) {
                console.error(`[Sync Error] State metadata sync failed for ${stateSlug}:`, result.error);
                syncError = typeof result.error === 'string' ? result.error : JSON.stringify(result.error);
            } else {
                console.log(`[Sync] Metadata sync successful for ${stateSlug}`);
                state = await getLocation(stateSlug) || state;
            }
        } catch (error) {
            console.error(`[Sync Error] Exception during state metadata sync for ${stateSlug}:`, error);
            syncError = error instanceof Error ? error.message : 'Unknown sync error';
        }
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
                            <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 text-white uppercase italic leading-tight" suppressHydrationWarning>
                                {state.name} <span className="text-purple-500">Business Hub</span>
                            </h1>
                            <p className="text-slate-400 text-lg md:text-xl mb-10 font-medium max-w-2xl" suppressHydrationWarning>
                                Discover all city-level business insights and local resources across the state of {state.name}.
                            </p>
                            
                            <div className="max-w-xl" suppressHydrationWarning>
                                <Suspense fallback={<div className="h-12 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />}>
                                    <Search placeholder={`Search cities in ${state.name}...`} />
                                </Suspense>
                            </div>

                            {/* Sync Error Display */}
                            {syncError && (
                                <div className="mt-8 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl max-w-2xl flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Data Expansion Error</div>
                                        <div className="text-sm font-bold text-slate-300 leading-tight">{syncError}</div>
                                    </div>
                                    <SyncButton 
                                        action={syncStateData} 
                                        slug={stateSlug} 
                                        label="Retry Sync" 
                                        className="bg-red-500 hover:bg-red-400 text-white border-none font-black px-4 h-9 text-[10px] rounded-lg"
                                    />
                                </div>
                            )}

                        </div>
                    </div>
                </section>

                {/* Market & State Details Section */}
                <section className="w-full py-12 bg-slate-900 min-h-[600px]">
                    <div className="container px-4 md:px-6 mx-auto">
                        <Tabs defaultValue="cities" className="w-full">
                            <TabsList className="bg-slate-950/50 border border-slate-800 p-1 rounded-xl mb-10 w-full md:w-fit justify-start h-auto">
                                <TabsTrigger value="cities" className="px-8 py-2.5 rounded-lg data-[state=active]:bg-purple-500 data-[state=active]:text-white uppercase font-black text-[10px] tracking-widest text-slate-500 hover:text-white transition-all">
                                    Market Cities
                                </TabsTrigger>
                                <TabsTrigger value="details" className="px-8 py-2.5 rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white uppercase font-black text-[10px] tracking-widest text-slate-500 hover:text-white transition-all">
                                    State Details
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

                            {/* State Details Tab Content */}
                            <TabsContent value="details" className="space-y-12 w-full max-w-full" suppressHydrationWarning>
                                <div className="flex items-center justify-between border-l-4 border-emerald-500 pl-4 mb-4">
                                    <div>
                                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">State Information</h2>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Key Metrics & Cultural Details</p>
                                    </div>
                                </div>
                            {/* State Data Section */}
                            <div className="w-full" suppressHydrationWarning>
                                {state.capital?.name && (
                                    <div className="w-full" suppressHydrationWarning>
                                        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl">
                                            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Landmark className="h-3 w-3 text-purple-400" />
                                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Capital</span>
                                                </div>
                                                <div className="text-sm font-black text-white italic truncate" title={state.capital?.name} suppressHydrationWarning>{state.capital?.name}</div>
                                            </div>
                                            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Star className="h-3 w-3 text-pink-400" />
                                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Nickname</span>
                                                </div>
                                                <div className="text-sm font-black text-white italic truncate" title={state.nickname} suppressHydrationWarning>{state.nickname}</div>
                                            </div>
                                            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Calendar className="h-3 w-3 text-emerald-400" />
                                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Statehood</span>
                                                </div>
                                                <div className="text-sm font-black text-white italic" suppressHydrationWarning>{state.date}</div>
                                            </div>
                                            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Compass className="h-3 w-3 text-blue-400" />
                                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Region</span>
                                                </div>
                                                <div className="text-sm font-black text-white italic" suppressHydrationWarning>{state.census_bureau?.region}</div>
                                            </div>
                                            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Globe2 className="h-3 w-3 text-cyan-400" />
                                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Timezone</span>
                                                </div>
                                                <div className="text-sm font-black text-white italic truncate" title={state.time_zones?.[0]} suppressHydrationWarning>{state.time_zones?.[0]}</div>
                                            </div>
                                            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Users className="h-3 w-3 text-orange-400" />
                                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Demonym</span>
                                                </div>
                                                <div className="text-sm font-black text-white italic" suppressHydrationWarning>{state.demonym}</div>
                                            </div>
                                            {state.subdivisions && (
                                                <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Layers className="h-3 w-3 text-emerald-400" />
                                                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Subdivisions</span>
                                                    </div>
                                                    <div className="text-sm font-black text-white italic" suppressHydrationWarning>{state.subdivisions.length} Counties/Units</div>
                                                </div>
                                            )}
                                            {state.population?.total && (
                                                <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Users className="h-3 w-3 text-green-400" />
                                                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Population</span>
                                                    </div>
                                                    <div className="text-sm font-black text-white italic" suppressHydrationWarning>{state.population.total}</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Economic Data Section */}
                                        {(state.per_capita_income || state.median_household_income) && (
                                            <div className="mt-8 pt-8 border-t border-slate-800/50">
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-6 flex items-center gap-2">
                                                    <DollarSign className="h-3 w-3" /> Economic Indicators
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {state.per_capita_income && (
                                                        <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-2xl">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <TrendingUp className="h-3 w-3 text-green-400" />
                                                                <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">Per Capita Income</span>
                                                            </div>
                                                            <div className="text-xs font-bold text-slate-300 italic" suppressHydrationWarning>{state.per_capita_income}</div>
                                                        </div>
                                                    )}
                                                    {state.median_household_income && (
                                                        <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-2xl">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <DollarSign className="h-3 w-3 text-blue-400" />
                                                                <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">Median Household Income</span>
                                                            </div>
                                                            <div className="text-xs font-bold text-slate-300 italic" suppressHydrationWarning>{state.median_household_income}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Geographic Data Section */}
                                        {(state.area?.total_km || state.elevation?.max_ft) && (
                                            <div className="mt-8 pt-8 border-t border-slate-800/50">
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-6 flex items-center gap-2">
                                                    <Globe2 className="h-3 w-3" /> Geographic Data
                                                </h3>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {state.area?.total_km && (
                                                        <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-2xl">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <MapPin className="h-3 w-3 text-purple-400" />
                                                                <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">Total Area</span>
                                                            </div>
                                                            <div className="text-xs font-bold text-slate-300 italic">{state.area.total_km} km²</div>
                                                        </div>
                                                    )}
                                                    {state.area?.land_percent && (
                                                        <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-2xl">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Layers className="h-3 w-3 text-emerald-400" />
                                                                <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">Land Percentage</span>
                                                            </div>
                                                            <div className="text-xs font-bold text-slate-300 italic">{state.area.land_percent}</div>
                                                        </div>
                                                    )}
                                                    {state.elevation?.max_ft && (
                                                        <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-2xl">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <TrendingUp className="h-3 w-3 text-orange-400" />
                                                                <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">Highest Point</span>
                                                            </div>
                                                            <div className="text-xs font-bold text-slate-300 italic">{state.elevation.max_ft} ft</div>
                                                        </div>
                                                    )}
                                                    {state.elevation?.min_ft && (
                                                        <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-2xl">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <TrendingUp className="h-3 w-3 text-cyan-400" />
                                                                <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">Lowest Point</span>
                                                            </div>
                                                            <div className="text-xs font-bold text-slate-300 italic">{state.elevation.min_ft}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* State Symbols Section */}
                                        {state.symbols && (
                                            <div className="mt-8 pt-8 border-t border-slate-800/50">
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-6 flex items-center gap-2">
                                                    <Star className="h-3 w-3" /> State Cultural Symbols
                                                </h3>
                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                    {state.symbols.bird && (
                                                        <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-2xl">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Bird className="h-3 w-3 text-sky-400" />
                                                                <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">State Bird</span>
                                                            </div>
                                                            <div className="text-xs font-bold text-slate-300 italic">{state.symbols.bird}</div>
                                                        </div>
                                                    )}
                                                    {state.symbols.flower && (
                                                        <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-2xl">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Flower2 className="h-3 w-3 text-pink-400" />
                                                                <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">State Flower</span>
                                                            </div>
                                                            <div className="text-xs font-bold text-slate-300 italic">{state.symbols.flower}</div>
                                                        </div>
                                                    )}
                                                    {state.symbols.tree && (
                                                        <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-2xl">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <TreeDeciduous className="h-3 w-3 text-emerald-400" />
                                                                <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">State Tree</span>
                                                            </div>
                                                            <div className="text-xs font-bold text-slate-300 italic">{state.symbols.tree}</div>
                                                        </div>
                                                    )}
                                                    {state.symbols.motto && (
                                                        <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-2xl">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Quote className="h-3 w-3 text-purple-400" />
                                                                <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">State Motto</span>
                                                            </div>
                                                            <div className="text-xs font-bold text-slate-300 italic line-clamp-1">{state.symbols.motto}</div>
                                                        </div>
                                                    )}
                                                    {state.symbols.song && (
                                                        <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-2xl">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Music className="h-3 w-3 text-amber-400" />
                                                                <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">State Song</span>
                                                            </div>
                                                            <div className="text-xs font-bold text-slate-300 italic line-clamp-1">{state.symbols.song}</div>
                                                        </div>
                                                    )}
                                                    {state.symbols.folk_dance && (
                                                        <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-2xl">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Music className="h-3 w-3 text-purple-400" />
                                                                <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">Folk Dance</span>
                                                            </div>
                                                            <div className="text-xs font-bold text-slate-300 italic">{state.symbols.folk_dance}</div>
                                                        </div>
                                                    )}
                                                    {state.symbols.hero && (
                                                        <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-2xl">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Users className="h-3 w-3 text-blue-400" />
                                                                <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">State Hero</span>
                                                            </div>
                                                            <div className="text-xs font-bold text-slate-300 italic">{state.symbols.hero}</div>
                                                        </div>
                                                    )}
                                                    {state.symbols.fossil && (
                                                        <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-2xl">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Layers className="h-3 w-3 text-orange-400" />
                                                                <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">State Fossil</span>
                                                            </div>
                                                            <div className="text-xs font-bold text-slate-300 italic">{state.symbols.fossil}</div>
                                                        </div>
                                                    )}
                                                    {state.symbols.mineral && (
                                                        <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-2xl">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Layers className="h-3 w-3 text-cyan-400" />
                                                                <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">State Mineral</span>
                                                            </div>
                                                            <div className="text-xs font-bold text-slate-300 italic">{state.symbols.mineral}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Major Cities Section */}
                                        {state.cities && state.cities.length > 0 && (
                                            <div className="mt-8 pt-8 border-t border-slate-800/50">
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-6 flex items-center gap-2">
                                                    <MapPin className="h-3 w-3" /> Major Cities
                                                </h3>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                                    {state.cities.slice(0, 10).map((city: any, i: number) => (
                                                        <div key={i} className="bg-slate-950/40 border border-slate-800/50 p-3 rounded-xl">
                                                            <div className="text-xs font-bold text-slate-300 italic truncate" title={city.name}>{city.name}</div>
                                                            {city.population && (
                                                                <div className="text-[8px] text-slate-500 mt-1">{city.population}</div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-800 bg-slate-950">
                <div className="container px-4 md:px-6 mx-auto text-center">
                    <p className="text-xs text-slate-500 font-bold tracking-widest uppercase" suppressHydrationWarning>
                        © 2025 K Business Academy. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
