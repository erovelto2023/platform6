import { TrendingUp, Target, Calendar, BarChart3, Search, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MarketPulseData } from "@/lib/services/market.service";

interface MarketPulseProps {
    data: MarketPulseData | null;
    cityName: string;
    newspapers?: Array<{
        name: string;
        url: string;
        description?: string;
        type?: string;
    }>;
}

export function MarketPulse({ data, cityName, newspapers = [] }: MarketPulseProps) {
    console.log(`[MarketPulse] Rendering for ${cityName}:`, !!data);
    if (!data) return null;

    const { searchIntent, monthlyMomentum, events, businessDensity } = data;

    return (
        <div className="space-y-12 mt-12">
            <div className="flex items-center gap-3 mb-8 border-l-4 border-blue-500 pl-4">
                <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
                    Market Pulse (Live)
                </h2>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[8px] uppercase font-black">Real-Time Data</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Search Intent & Momentum */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-slate-900/40 border-slate-800 rounded-2xl overflow-hidden border-t-4 border-t-blue-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-white">
                                <Search className="h-4 w-4 text-blue-400" />
                                What People are Searching For in {cityName}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 mt-4">
                                {searchIntent.length > 0 ? (
                                    searchIntent.slice(0, 5).map((query, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800/50 hover:bg-slate-800/50 transition-colors group">
                                            <div className="text-blue-500 font-black italic text-sm">#0{i+1}</div>
                                            <div className="text-xs font-bold text-slate-300 uppercase tracking-tight group-hover:text-white">{query}</div>
                                            <Target className="h-3 w-3 text-slate-700 ml-auto group-hover:text-blue-500 transition-colors" />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-500 italic">No recent search patterns detected. Try again later.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <Card className="bg-slate-900/40 border-slate-800 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-black uppercase text-slate-500">City Momentum (30 Days)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-white italic tracking-tighter">
                                    {monthlyMomentum > 0 ? monthlyMomentum.toLocaleString() : "---"}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Monthly Wiki Traffic</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/40 border-slate-800 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-black uppercase text-slate-500">Opportunity Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-blue-400 italic tracking-tighter">
                                    {Math.min(99, Math.round((monthlyMomentum / 1000) * 10)) || "--"}/99
                                </div>
                                <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Niche Potential Index</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Local Events & Density */}
                <div className="space-y-6">
                    <Card className="bg-slate-900/40 border-slate-800 rounded-2xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-white">
                                <Calendar className="h-4 w-4 text-orange-400" />
                                Community & Niche Events
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 mt-4">
                                {events.length > 0 ? (
                                    events.map((event, i) => (
                                        <div key={i} className="border-b border-slate-800 pb-3 last:border-0 last:pb-0 hover:bg-slate-800/20 transition-colors p-1 rounded-sm">
                                            <div className="text-[10px] font-black text-white uppercase line-clamp-1">{event.name}</div>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-[8px] font-bold text-slate-500 uppercase">{event.date}</span>
                                                <Badge variant="outline" className="text-[7px] border-orange-500/30 text-orange-400 font-bold uppercase py-0 px-1 leading-tight">
                                                    {event.venue}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 border-dashed text-center">
                                        <p className="text-[10px] text-slate-600 font-bold uppercase italic leading-relaxed px-2">
                                            No major craft fairs or parades in current API window. <br/>
                                            <span className="text-blue-500/60 mt-2 block">Check local Facebook Groups for hyper-local niches.</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/40 border-slate-800 rounded-2xl border-l-4 border-l-cyan-500">
                         <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-white">
                                <BarChart3 className="h-4 w-4 text-cyan-400" />
                                Niche Density (OSM)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 mt-4">
                            {businessDensity && Object.entries(businessDensity).map(([label, count]) => (
                                <div key={label}>
                                    <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500 mb-1">
                                        <span>{label}</span>
                                        <span className="text-white font-black">{count}</span>
                                    </div>
                                    <Progress value={Math.min(100, (count / 50) * 100)} className="h-1 bg-slate-800" indicatorClassName="bg-cyan-500" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Local Media & Newspapers */}
            {newspapers.length > 0 && (
                <section>
                    <div className="flex items-center gap-3 mb-8 border-l-4 border-rose-500 pl-4">
                        <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
                            Local Media & Press
                        </h2>
                        <Badge variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[8px] uppercase font-black">Ad Targeting</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newspapers.map((paper, i) => (
                            <Card key={i} className="bg-slate-900/40 border-slate-800 rounded-2xl hover:border-rose-500/30 transition-all group">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-black uppercase text-white group-hover:text-rose-400 transition-colors">
                                        <a href={paper.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                            {paper.name}
                                            <Search className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                                        </a>
                                    </CardTitle>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-slate-600">{paper.type || 'Local'} Media</div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed line-clamp-3 italic">
                                        {paper.description || "Top source for local news and community happenings."}
                                    </p>
                                    <a 
                                        href={paper.url} 
                                        className="mt-4 inline-block text-[8px] font-black uppercase tracking-tighter text-rose-500 border-b border-rose-500/20 hover:border-rose-500"
                                    >
                                        Visit Publication
                                    </a>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            <div className="p-6 bg-slate-900/20 border border-slate-800 rounded-2xl flex items-start gap-3">
                <Info className="h-4 w-4 text-blue-500 mt-1" />
                <p className="text-[10px] font-medium text-slate-500 leading-relaxed uppercase">
                    MARKET PULSE USES 100% FREE AND OPEN DATA FROM **GOOGLE AUTOCOMPLETE**, **WIKIMEDIA**, AND **OPENSTREETMAP**. 
                    UNLIKE CENSUS DATA WHICH IS HISTORICAL, THESE INDICATORS REFLECT REAL-TIME MOMENTUM.
                </p>
            </div>
        </div>
    );
}
