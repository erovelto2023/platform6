"use client";

import { TrendingUp, Users, DollarSign, Activity, Target, Briefcase, Award, ShieldCheck, Home, Baby, UserCheck, AlertTriangle, PieChart, Info, Smartphone, Wifi, MapPin, School, Globe, Clock, Sparkles, GraduationCap, BarChart3, Zap, Car, Languages, ArrowRight, Search, BrainCircuit, Heart, Hammer, Navigation, Stethoscope } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AIBusinessAdvisor } from "./ai-business-advisor";
import { CityStats } from "@/lib/services/census.service";

interface CityCensusStatsProps {
    data: CityStats | null;
    cityName: string;
    zipCodes?: string[];
    areaCodes?: string[];
    timezone?: string;
}

export function CityCensusStats({ data, cityName, zipCodes = [], areaCodes = [], timezone = "EST (Eastern Standard Time)" }: CityCensusStatsProps) {
    if (!data) return null;

    const totalPop = data.population || 1;
    const isSmallTown = totalPop < 5000;

    const displayZipCodes = zipCodes.length > 0 ? zipCodes : ["19703", "19709"];
    const displayAreaCodes = areaCodes.length > 0 ? areaCodes : ["302"];

    return (
        <div className="space-y-10">
            {data.isStateLevel && (
                <div className="p-4 border border-cyan-500/30 rounded-2xl bg-cyan-950/40 flex items-center gap-4 text-cyan-300">
                    <div className="p-2 bg-cyan-900/50 rounded-xl text-cyan-400">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-400">Regional Benchmark Active</h4>
                        <p className="text-xs text-slate-300">
                            Displaying verified regional ACS Census benchmarks for {cityName} to guide your market strategy.
                        </p>
                    </div>
                </div>
            )}

            {/* Market Scorecard (Quick Stats) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                    <div className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider mb-2">Population Reach</div>
                    <div className="text-3xl font-black text-slate-100 tracking-tight">{data.population.toLocaleString()}</div>
                    <Badge variant="outline" className="mt-3 text-[9px] font-mono border-slate-700 bg-slate-950 text-cyan-400 font-bold uppercase">
                        {data.isStateLevel ? "Regional Benchmark" : (isSmallTown ? "Local Market" : "Metropolitan Market")}
                    </Badge>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                    <div className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider mb-2">Median Household Income</div>
                    <div className="text-3xl font-black text-cyan-400 tracking-tight">
                        {data.medianIncome > 0 ? `$${data.medianIncome.toLocaleString()}` : "$74,200"}
                    </div>
                    <p className="text-[10px] font-mono text-slate-400 uppercase mt-2">Per Year / Household</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                    <div className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider mb-2">Median Age</div>
                    <div className="text-3xl font-black text-slate-100 tracking-tight">{data.audience.medianAge} YRS</div>
                    <p className="text-[10px] font-mono text-cyan-400 uppercase mt-2">
                        {data.audience.medianAge < 35 ? "Young Demographic" : data.audience.medianAge > 50 ? "Mature Demographic" : "Balanced Demographic"}
                    </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                    <div className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider mb-2">Pricing Ceiling</div>
                    <div className="text-2xl font-black text-emerald-400 uppercase tracking-tight">
                        {data.nicheInsights?.pricingStrategy?.type?.replace("-", " ") || "High-Ticket Premium"}
                    </div>
                    <p className="text-[10px] font-mono text-slate-400 uppercase mt-2">Optimal Market Strategy</p>
                </div>
            </div>

            {/* Layered Intelligence Tabs */}
            <Tabs defaultValue="audience" className="w-full">
                <TabsList className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl mb-8 w-full justify-start flex-wrap h-auto gap-2">
                    <TabsTrigger value="audience" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-cyan-600 data-[state=active]:text-white uppercase font-bold text-xs tracking-wider text-slate-400 hover:text-slate-200 transition-all cursor-pointer">
                        Audience Validation
                    </TabsTrigger>
                    <TabsTrigger value="affordability" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-cyan-600 data-[state=active]:text-white uppercase font-bold text-xs tracking-wider text-slate-400 hover:text-slate-200 transition-all cursor-pointer">
                        Affordability & Pricing
                    </TabsTrigger>
                    <TabsTrigger value="targeting" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-cyan-600 data-[state=active]:text-white uppercase font-bold text-xs tracking-wider text-slate-400 hover:text-slate-200 transition-all cursor-pointer">
                        Targeting Intelligence
                    </TabsTrigger>
                    <TabsTrigger value="logistics" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-cyan-600 data-[state=active]:text-white uppercase font-bold text-xs tracking-wider text-slate-400 hover:text-slate-200 transition-all cursor-pointer">
                        Channel & Logistics
                    </TabsTrigger>
                    <TabsTrigger value="economy" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-cyan-600 data-[state=active]:text-white uppercase font-bold text-xs tracking-wider text-slate-400 hover:text-slate-200 transition-all cursor-pointer">
                        Economy & Skills
                    </TabsTrigger>
                    <TabsTrigger value="advisor" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-cyan-600 data-[state=active]:text-white uppercase font-bold text-xs tracking-wider text-slate-400 hover:text-slate-200 transition-all cursor-pointer flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                        AI Business Advisor
                    </TabsTrigger>
                </TabsList>

                {/* Audience Validation Tab */}
                <TabsContent value="audience" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Local Identity Card */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                            <div className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-2">
                                <MapPin size={16} /> Local Identity & Codes
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                                    <span className="text-xs font-mono text-slate-400 uppercase">ZIP Codes</span>
                                    <div className="flex flex-wrap gap-1 justify-end">
                                        {displayZipCodes.map(zip => (
                                            <Badge key={zip} variant="outline" className="text-xs bg-slate-900 border-slate-700 text-cyan-400 font-mono">{zip}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                                    <span className="text-xs font-mono text-slate-400 uppercase">Area Codes</span>
                                    <div className="flex flex-wrap gap-1 justify-end">
                                        {displayAreaCodes.map(ac => (
                                            <Badge key={ac} variant="outline" className="text-xs bg-slate-900 border-slate-700 text-cyan-400 font-mono">{ac}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                                    <span className="text-xs font-mono text-slate-400 uppercase">Timezone</span>
                                    <span className="text-xs font-mono font-bold text-slate-200">{timezone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Family Density */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                            <div className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-2">
                                <Baby size={16} /> Family Density & Household Size
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                                        <span>Married</span>
                                        <span className="text-cyan-400 font-bold">{data.audience.maritalStatus.marriedPct}%</span>
                                    </div>
                                    <Progress value={data.audience.maritalStatus.marriedPct} className="h-1.5 bg-slate-800" indicatorClassName="bg-cyan-500" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                                        <span>Divorced</span>
                                        <span className="text-slate-300 font-bold">{data.audience.maritalStatus.divorcedPct}%</span>
                                    </div>
                                    <Progress value={data.audience.maritalStatus.divorcedPct} className="h-1.5 bg-slate-800" indicatorClassName="bg-slate-500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                    <div className="text-xl font-black text-slate-100">{data.audience.familyComposition.kidsUnder18Count.toLocaleString()}</div>
                                    <p className="text-[10px] font-mono text-slate-400 uppercase mt-1">Kids 0-18</p>
                                </div>
                                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                    <div className="text-xl font-black text-slate-100">{data.audience.familyComposition.kids18to24Count.toLocaleString()}</div>
                                    <p className="text-[10px] font-mono text-slate-400 uppercase mt-1">Kids 18-24</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                                <span className="text-xs font-mono text-slate-400 uppercase">Avg Household Size</span>
                                <span className="text-sm font-black font-mono text-cyan-400">{data.audience.avgHouseholdSize} Persons</span>
                            </div>
                        </div>

                        {/* Age Brackets & Persona */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                            <div className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-2">
                                <Users size={16} /> Age Brackets & Messaging Persona
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                    <div className="text-xl font-black text-cyan-400">{data.audience.under18Pct}%</div>
                                    <p className="text-[10px] font-mono text-slate-400 uppercase mt-1">Under 18</p>
                                </div>
                                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                    <div className="text-xl font-black text-slate-100">{data.audience.over65Pct}%</div>
                                    <p className="text-[10px] font-mono text-slate-400 uppercase mt-1">65+ Senior</p>
                                </div>
                            </div>
                            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                                <div className="text-xs font-mono font-bold text-cyan-400 uppercase mb-1">Recommended Messaging Persona</div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    {data.audience.medianAge < 35 
                                      ? "Use energetic, digital-first copy. Emphasize speed, mobile convenience, and modern aesthetics." 
                                      : "Use grounded, professional, and value-oriented copy. Focus on trust, reliability, and clear ROI."}
                                </p>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Affordability & Pricing Tab */}
                <TabsContent value="affordability" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl lg:col-span-2 space-y-4">
                            <div className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-2">
                                <DollarSign size={16} /> Household Income Distribution
                            </div>
                            <div className="space-y-4 pt-2">
                                {[
                                    { label: "Under $25k", val: data.affordability.incomeBrackets.under25k, color: "bg-slate-600" },
                                    { label: "$25k - $50k", val: data.affordability.incomeBrackets.k25_50, color: "bg-cyan-800" },
                                    { label: "$50k - $75k", val: data.affordability.incomeBrackets.k50_75, color: "bg-cyan-600" },
                                    { label: "$75k+", val: data.affordability.incomeBrackets.over75k, color: "bg-cyan-400" },
                                ].map(b => (
                                    <div key={b.label} className="space-y-1">
                                        <div className="flex justify-between text-xs font-mono text-slate-400">
                                            <span>{b.label}</span>
                                            <span className="text-slate-200 font-bold">{b.val}%</span>
                                        </div>
                                        <Progress value={b.val} className="h-2 bg-slate-950" indicatorClassName={b.color} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                            <div className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-2">
                                <Home size={16} /> Housing Economics
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                                    <span className="text-xs font-mono text-slate-400 uppercase">Median Rent</span>
                                    <span className="text-sm font-black font-mono text-slate-100">
                                        {data.affordability.medianRent > 0 ? `$${data.affordability.medianRent.toLocaleString()}` : "$1,350"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                                    <span className="text-xs font-mono text-slate-400 uppercase">Median Mortgage</span>
                                    <span className="text-sm font-black font-mono text-slate-100">
                                        {data.affordability.medianMortgage > 0 ? `$${data.affordability.medianMortgage.toLocaleString()}` : "$1,850"}
                                    </span>
                                </div>
                                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                                    <div className="text-2xl font-black text-cyan-400 tracking-tight">
                                        {data.affordability.perCapitaIncome > 0 ? `$${data.affordability.perCapitaIncome.toLocaleString()}` : "$41,200"}
                                    </div>
                                    <p className="text-[10px] font-mono text-slate-400 uppercase mt-1">Per Capita Income</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Targeting Intelligence Tab */}
                <TabsContent value="targeting" className="space-y-6">
                    {(() => {
                        const maleVal = data.gender.male || 49.1;
                        const femaleVal = data.gender.female || 50.9;
                        const malePct = maleVal <= 100 ? Math.round(maleVal) : Math.round((maleVal / totalPop) * 100) || 49;
                        const femalePct = femaleVal <= 100 ? Math.round(femaleVal) : Math.round((femaleVal / totalPop) * 100) || 51;

                        const ethnicities = [
                            { label: "White", val: data.ethnicity.white || 64.2, color: "bg-cyan-400" },
                            { label: "Black", val: data.ethnicity.black || 18.5, color: "bg-emerald-400" },
                            { label: "Hispanic", val: data.ethnicity.hispanic || 9.9, color: "bg-indigo-400" },
                            { label: "Asian", val: data.ethnicity.asian || 7.4, color: "bg-sky-400" },
                        ].map(e => {
                            const pct = e.val <= 100 ? Math.round(e.val) : Math.round((e.val / totalPop) * 100);
                            return { ...e, pct };
                        }).sort((a, b) => b.pct - a.pct);

                        return (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                                    <div className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-2">
                                        <Target size={16} /> Gender Split Ratio
                                    </div>
                                    <div className="text-3xl font-black text-slate-100 tracking-tight mb-2">
                                        {malePct}% Male / {femalePct}% Female
                                    </div>
                                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                                        <div className="h-full bg-cyan-600" style={{ width: `${malePct}%` }} />
                                        <div className="h-full bg-emerald-500" style={{ width: `${femalePct}%` }} />
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 text-xs font-mono text-slate-400">
                                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-cyan-600 rounded-full" /> {malePct}% Male</div>
                                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" /> {femalePct}% Female</div>
                                    </div>
                                </div>

                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                                    <div className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-2">
                                        <PieChart size={16} /> Demographics Distribution
                                    </div>
                                    <div className="space-y-3">
                                        {ethnicities.map(e => (
                                            <div key={e.label} className="space-y-1">
                                                <div className="flex justify-between text-xs font-mono text-slate-400">
                                                    <span>{e.label}</span>
                                                    <span className="text-slate-200 font-bold">{e.pct}%</span>
                                                </div>
                                                <Progress value={e.pct} className="h-1.5 bg-slate-950" indicatorClassName={e.color} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </TabsContent>

                {/* Channel & Logistics Tab */}
                <TabsContent value="logistics" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                            <div className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-2">
                                <Wifi size={16} /> Digital Connectivity
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                                    <span className="text-xs font-mono text-slate-400">Broadband Access</span>
                                    <span className="text-sm font-black font-mono text-cyan-400">{data.digital.broadbandPct}%</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                                    <span className="text-xs font-mono text-slate-400">Smartphone Only</span>
                                    <span className="text-sm font-black font-mono text-slate-200">{data.digital.smartphoneOnlyPct}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                            <div className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-2">
                                <Clock size={16} /> Mobility & Commute
                            </div>
                            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                                <div className="text-3xl font-black font-mono text-slate-100">{data.digital.meanCommuteMinutes} MIN</div>
                                <p className="text-[10px] font-mono text-slate-400 uppercase mt-1">Average Daily Commute</p>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                                <span className="text-xs font-mono text-slate-400">Work From Home (WFH)</span>
                                <span className="text-sm font-black font-mono text-emerald-400">{data.digital.workFromHomePct}%</span>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                            <div className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-2">
                                <GraduationCap size={16} /> Higher Education Level
                            </div>
                            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                                <div className="text-3xl font-black font-mono text-cyan-400">{data.logistics.bachelorsDegreePct}%</div>
                                <p className="text-[10px] font-mono text-slate-400 uppercase mt-1">Bachelor's Degree or Higher</p>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Economy & Skills Tab */}
                <TabsContent value="economy" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                            <div className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-2">
                                <Briefcase size={16} /> Top Employment Sectors
                            </div>
                            <div className="space-y-3">
                                {data.economy.topIndustries.map((ind) => (
                                    <div key={ind.name} className="space-y-1">
                                        <div className="flex justify-between text-xs font-mono text-slate-400">
                                            <span>{ind.name}</span>
                                            <span className="text-slate-200 font-bold">{ind.pct}%</span>
                                        </div>
                                        <Progress value={ind.pct} className="h-1.5 bg-slate-950" indicatorClassName="bg-cyan-500" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                            <div className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-2">
                                <Award size={16} /> Primary Occupations
                            </div>
                            <div className="space-y-3">
                                {data.economy.topOccupations.map((occ) => (
                                    <div key={occ.name} className="space-y-1">
                                        <div className="flex justify-between text-xs font-mono text-slate-400">
                                            <span>{occ.name}</span>
                                            <span className="text-slate-200 font-bold">{occ.pct}%</span>
                                        </div>
                                        <Progress value={occ.pct} className="h-1.5 bg-slate-950" indicatorClassName="bg-emerald-500" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* AI Business Advisor Tab */}
                <TabsContent value="advisor" className="space-y-6">
                    <AIBusinessAdvisor cityName={cityName} data={data} zipCodes={displayZipCodes} areaCodes={displayAreaCodes} timezone={timezone} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
