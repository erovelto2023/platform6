import { TrendingUp, Users, DollarSign, Activity, Target, Briefcase, Award, ShieldCheck, Home, Baby, UserCheck, AlertTriangle, PieChart, Info, Smartphone, Wifi, MapPin, School, Globe, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface CityCensusStatsProps {
    data: {
        population: number;
        medianIncome: number;
        gender: { male: number; female: number };
        ethnicity: { white: number; black: number; asian: number; hispanic: number };
        audience: {
            medianAge: number;
            under18Pct: number;
            over65Pct: number;
            householdsWithChildrenPct: number;
            avgHouseholdSize: number;
        };
        affordability: {
            povertyRate: number;
            perCapitaIncome: number;
            homeownershipRate: number;
            medianRent: number;
            medianMortgage: number;
            costBurdenedPct: number;
            incomeBrackets: {
                under25k: number;
                k25_50: number;
                k50_75: number;
                over75k: number;
            };
        };
        nicheInsights?: {
            candidates: Array<{
                id: string;
                label: string;
                score: number;
                sublabel: string;
                description: string;
            }>;
            pricingStrategy: { type: string; description: string };
        };
        digital: {
            broadbandPct: number;
            smartphoneOnlyPct: number;
            workFromHomePct: number;
            meanCommuteMinutes: number;
        };
        logistics: {
            bachelorsDegreePct: number;
            speakSpanishPct: number;
        };
        year: string;
    } | null;
    cityName: string;
}

export function CityCensusStats({ data, cityName }: CityCensusStatsProps) {
    if (!data) {
        return (
            <div className="p-6 border border-dashed border-slate-800 rounded-3xl bg-slate-900/10 text-center">
                <p className="text-slate-500 text-sm font-medium italic">
                    Market data for {cityName} is currently being processed. Check back soon.
                </p>
            </div>
        );
    }

    const totalPop = data.population || 1;
    const isSmallTown = totalPop < 5000;

    return (
        <div className="space-y-12">
            {/* Market Scorecard (Quick Stats) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-900/40 border-slate-800 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase text-slate-500">Population Reach</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-white italic tracking-tighter">{data.population.toLocaleString()}</div>
                        <Badge variant="outline" className="mt-2 text-[8px] bg-purple-500/10 text-purple-400 border-none font-black uppercase">
                            {isSmallTown ? "Small Market" : "Active Market"}
                        </Badge>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/40 border-slate-800 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase text-slate-500">Median Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-white italic tracking-tighter">
                            {data.medianIncome > 0 ? `$${data.medianIncome.toLocaleString()}` : "N/A"}
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Per Year / Household</p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/40 border-slate-800 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase text-slate-500">Median Age</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-white italic tracking-tighter">{data.audience.medianAge} YRS</div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">
                            {data.audience.medianAge < 35 ? "Young Demo" : data.audience.medianAge > 50 ? "Mature Demo" : "Mixed Demo"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/40 border-slate-800 rounded-2xl border-emerald-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase text-emerald-400">Pricing Ceiling</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-white italic tracking-tighter uppercase">{data.nicheInsights?.pricingStrategy.type.replace("-", " ")}</div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Optimal Strategy</p>
                    </CardContent>
                </Card>
            </div>

            {/* Layered Intelligence Tabs */}
            <Tabs defaultValue="audience" className="w-full">
                <TabsList className="bg-slate-900/40 border border-slate-800 p-1 rounded-xl mb-8 w-full justify-start overflow-x-auto h-auto no-scrollbar">
                    <TabsTrigger value="audience" className="px-6 py-2 rounded-lg data-[state=active]:bg-purple-500 data-[state=active]:text-white uppercase font-black text-[10px] tracking-widest text-slate-400 hover:text-white transition-colors">
                        Audience Validation
                    </TabsTrigger>
                    <TabsTrigger value="affordability" className="px-6 py-2 rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white uppercase font-black text-[10px] tracking-widest text-slate-400 hover:text-white transition-colors">
                        Affordability & Pricing
                    </TabsTrigger>
                    <TabsTrigger value="targeting" className="px-6 py-2 rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white uppercase font-black text-[10px] tracking-widest text-slate-400 hover:text-white transition-colors">
                        Targeting Intelligence
                    </TabsTrigger>
                    <TabsTrigger value="logistics" className="px-6 py-2 rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-white uppercase font-black text-[10px] tracking-widest text-slate-400 hover:text-white transition-colors">
                        Channel & Logistics
                    </TabsTrigger>
                </TabsList>

                {/* Audience Validation Tab */}
                <TabsContent value="audience" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="bg-slate-900/20 border-slate-800/50 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-white">
                                    <Baby className="h-4 w-4 text-purple-400" />
                                    Family Density
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500 mb-1">
                                        <span>HH with Children Under 18</span>
                                        <span>{data.audience.householdsWithChildrenPct}%</span>
                                    </div>
                                    <Progress value={data.audience.householdsWithChildrenPct} className="h-1 bg-slate-800" />
                                </div>
                                <div className="pt-2">
                                    <div className="text-2xl font-black text-white italic">{data.audience.avgHouseholdSize}</div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Avg Household Size</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/20 border-slate-800/50 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-white">
                                    <Users className="h-4 w-4 text-blue-400" />
                                    Age Brackets
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800">
                                        <div className="text-xl font-black text-white italic">{data.audience.under18Pct}%</div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Under 18</p>
                                    </div>
                                    <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800">
                                        <div className="text-xl font-black text-white italic">{data.audience.over65Pct}%</div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">65+ Senior</p>
                                    </div>
                                </div>
                                <p className="text-[10px] font-medium text-slate-600 italic">
                                    {data.audience.under18Pct > 25 ? "High concentration of families. Hot market for parenting and toys." : "Mature population. Focus on wealth management and health services."}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-950/20 border-slate-800/50 rounded-2xl lg:col-span-1 md:col-span-2">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-white">
                                    <UserCheck className="h-4 w-4 text-emerald-400" />
                                    Messaging Tone
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                                    <h4 className="text-sm font-black text-emerald-400 uppercase italic">Recommended Persona</h4>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2">
                                        {data.audience.medianAge < 35 
                                          ? "Use energetic, digital-first, and trend-aware copy. Focus on efficiency and 'the hustle'." 
                                          : "Use grounded, professional, and value-oriented messaging. Prioritize trust and long-term results."}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Affordability & Pricing Tab */}
                <TabsContent value="affordability" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="bg-slate-900/20 border-slate-800/50 rounded-2xl lg:col-span-2">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase text-white">Household Income Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 pt-2">
                                    {[
                                        { label: "Under $25k", val: data.affordability.incomeBrackets.under25k, color: "bg-red-500" },
                                        { label: "$25k - $50k", val: data.affordability.incomeBrackets.k25_50, color: "bg-orange-500" },
                                        { label: "$50k - $75k", val: data.affordability.incomeBrackets.k50_75, color: "bg-emerald-400" },
                                        { label: "$75k+", val: data.affordability.incomeBrackets.over75k, color: "bg-emerald-500" },
                                    ].map(b => (
                                        <div key={b.label} className="space-y-1">
                                            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                                                <span>{b.label}</span>
                                                <span>{b.val}%</span>
                                            </div>
                                            <Progress value={b.val} className={`h-1.5 bg-slate-800`} indicatorClassName={b.color} />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="bg-slate-900/20 border-slate-800/50 rounded-2xl">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-black uppercase text-white flex items-center gap-2">
                                        <Home className="h-4 w-4 text-emerald-400" />
                                        Housing Reality
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Median Rent</span>
                                        <span className="text-sm font-black text-white">
                                            {data.affordability.medianRent > 0 
                                                ? `$${data.affordability.medianRent.toLocaleString()}` 
                                                : "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Median Mortgage</span>
                                        <span className="text-sm font-black text-white">
                                            {data.affordability.medianMortgage > 0 
                                                ? `$${data.affordability.medianMortgage.toLocaleString()}` 
                                                : "N/A"}
                                        </span>
                                    </div>
                                    <div className="pt-2">
                                        <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 mb-1">
                                            <span>Housing Cost Burden ({">"}30%)</span>
                                            <span className={data.affordability.costBurdenedPct > 35 ? "text-red-400" : "text-emerald-400"}>{data.affordability.costBurdenedPct}%</span>
                                        </div>
                                        <Progress value={data.affordability.costBurdenedPct} className="h-1 bg-slate-800" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-900/60 border-slate-800 rounded-2xl border-l-4 border-l-emerald-500">
                                <CardContent className="pt-6">
                                    <div className="text-2xl font-black text-white italic tracking-tighter">
                                        {data.affordability.perCapitaIncome > 0 ? `$${data.affordability.perCapitaIncome.toLocaleString()}` : "N/A"}
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Per Capita Income</p>
                                    <div className="mt-4 flex items-center gap-2">
                                        <TrendingUp className="h-3 w-3 text-emerald-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                            Disposable Power: {data.affordability.povertyRate < 10 ? "High" : "Mixed"}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Targeting Intelligence Tab */}
                <TabsContent value="targeting" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-slate-900/20 border-slate-800/50 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-white">
                                    <Target className="h-4 w-4 text-blue-400" />
                                    Gender Split
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black italic tracking-tighter text-white mb-2">
                                    {Math.round((data.gender.male / totalPop) * 100)}% M / {Math.round((data.gender.female / totalPop) * 100)}% F
                                </div>
                                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-blue-500" style={{ width: `${(data.gender.male / totalPop) * 100}%` }} />
                                    <div className="h-full bg-pink-500" style={{ width: `${(data.gender.female / totalPop) * 100}%` }} />
                                </div>
                                <div className="mt-4 grid grid-cols-2 text-[10px] font-bold uppercase text-slate-500">
                                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full" /> {data.gender.male.toLocaleString()} Male</div>
                                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-pink-500 rounded-full" /> {data.gender.female.toLocaleString()} Female</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/20 border-slate-800/50 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-white">
                                    <PieChart className="h-4 w-4 text-emerald-400" />
                                    Ethnicity Ratios
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    { label: "White", val: data.ethnicity.white, color: "bg-blue-500" },
                                    { label: "Black", val: data.ethnicity.black, color: "bg-emerald-500" },
                                    { label: "Hispanic", val: data.ethnicity.hispanic, color: "bg-orange-500" },
                                    { label: "Asian", val: data.ethnicity.asian, color: "bg-purple-500" },
                                ].sort((a, b) => b.val - a.val).map(e => (
                                    <div key={e.label} className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                                            <span>{e.label}</span>
                                            <span>{Math.round((e.val / totalPop) * 100)}%</span>
                                        </div>
                                        <Progress value={(e.val / totalPop) * 100} className="h-1 bg-slate-800" indicatorClassName={e.color} />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Channel & Logistics Tab */}
                <TabsContent value="logistics" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Digital Connectivity */}
                        <Card className="bg-slate-900/20 border-slate-800/50 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-white">
                                    <Wifi className="h-4 w-4 text-cyan-400" />
                                    Digital Connectivity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500 mb-1">
                                        <span>Broadband Access</span>
                                        <span>{data.digital.broadbandPct}%</span>
                                    </div>
                                    <Progress value={data.digital.broadbandPct} className="h-1 bg-slate-800" indicatorClassName="bg-cyan-500" />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl border border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <Smartphone className="h-3 w-3 text-slate-500" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase">Smartphone Only</span>
                                    </div>
                                    <span className="text-sm font-black text-white">{data.digital.smartphoneOnlyPct}%</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Commute & Mobility */}
                        <Card className="bg-slate-900/20 border-slate-800/50 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-white">
                                    <Clock className="h-4 w-4 text-cyan-400" />
                                    Work Mobility
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500 mb-1">
                                        <span>Worked from Home</span>
                                        <span>{data.digital.workFromHomePct}%</span>
                                    </div>
                                    <Progress value={data.digital.workFromHomePct} className="h-1 bg-slate-800" indicatorClassName="bg-cyan-400" />
                                </div>
                                <div className="pt-2">
                                    <div className="text-2xl font-black text-white italic">{data.digital.meanCommuteMinutes} MIN</div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Avg Commute Time</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Education & Language */}
                        <Card className="bg-slate-900/20 border-slate-800/50 rounded-2xl lg:col-span-1 md:col-span-2">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-white">
                                    <School className="h-4 w-4 text-cyan-400" />
                                    Skillset & reach
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl border border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-3 w-3 text-cyan-500" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase">Spanish Speakers</span>
                                    </div>
                                    <span className="text-sm font-black text-white">{data.logistics.speakSpanishPct}%</span>
                                </div>
                                <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                                    <div className="text-xl font-black text-cyan-400 italic">{data.logistics.bachelorsDegreePct}%</div>
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Bachelor's Degree or Higher</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

            </Tabs>

            {/* Niche Opportunity Spotlight */}
            {data.nicheInsights && (
                <div className="mt-12 space-y-6">
                    <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-purple-400" />
                        <h3 className="text-sm font-black uppercase tracking-widest text-white">Niche Opportunity Spotlight</h3>
                        <Badge variant="outline" className="ml-auto bg-purple-500/10 text-purple-400 border-purple-500/20 text-[8px] uppercase font-black">AI Scored</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {data.nicheInsights.candidates.map((niche) => (
                            <Card key={niche.id} className="bg-slate-900/40 border-slate-800 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all border-b-2 border-b-purple-500/20">
                                <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
                                    <CardTitle className="text-[10px] font-black uppercase text-slate-400">{niche.label}</CardTitle>
                                    <span className={`text-sm font-black italic ${niche.score >= 8 ? "text-emerald-400" : niche.score >= 5 ? "text-blue-400" : "text-amber-400"}`}>{niche.score}/10</span>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="text-lg font-black text-white italic leading-tight mb-2 uppercase">{niche.sublabel}</div>
                                    <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase">{niche.description}</p>
                                    <div className="mt-4">
                                        <Progress value={niche.score * 10} className="h-1 bg-slate-800" indicatorClassName={niche.score >= 8 ? "bg-emerald-500" : niche.score >= 5 ? "bg-blue-500" : "bg-amber-500"} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Quality & Footer */}
            <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between gap-6 opacity-60 transition-opacity hover:opacity-100">
                <div className="flex items-start gap-3 max-w-lg">
                    <Info className="h-4 w-4 text-slate-500 mt-1" />
                    <p className="text-[10px] font-medium text-slate-500 leading-relaxed uppercase tracking-tighter">
                        Data sourced from ACS 2018-2022 5-Year Estimates. 
                        {isSmallTown && (
                          <span className="block text-orange-400 font-bold mt-1">
                            <AlertTriangle className="h-3 w-3 inline mr-1" /> Small population detected. Margin of error may be higher.
                          </span>
                        )}
                    </p>
                </div>
                <Badge variant="outline" className="h-fit bg-slate-900 border-slate-800 text-slate-600 text-[8px] font-black uppercase py-0.5">
                    Ref ID: {data.year}-ACS5-PLACE-{cityName.toUpperCase()}
                </Badge>
            </div>
        </div>
    );
}
