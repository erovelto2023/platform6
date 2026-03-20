"use client";

import { TrendingUp, Users, DollarSign, Activity, Target, Briefcase, Award, ShieldCheck, Home, Baby, UserCheck, AlertTriangle, PieChart, Info, Smartphone, Wifi, MapPin, School, Globe, Clock, Sparkles, GraduationCap, BarChart3, Zap, Car, Languages, ArrowRight, Search, BrainCircuit, Heart, Hammer, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AIBusinessAdvisor } from "./ai-business-advisor";
import { CityStats } from "@/lib/services/census.service";
import { useState, useMemo } from "react";


interface CityCensusStatsProps {
    data: CityStats | null;
    cityName: string;
    zipCodes?: string[];
    areaCodes?: string[];
    timezone?: string;
}

export function CityCensusStats({ data, cityName, zipCodes = [], areaCodes = [], timezone }: CityCensusStatsProps) {
    if (!data) {
        return (
            <div className="p-6 border border-dashed border-slate-200 rounded-3xl bg-slate-50 text-center">
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
            {data.isStateLevel && (
                <div className="p-4 border border-orange-500/20 rounded-2xl bg-orange-500/5 flex items-center gap-4">
                    <div className="p-2 bg-orange-500/10 rounded-xl">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-orange-500">Regional Profile Active</h4>
                        <p className="text-xs text-slate-600">
                            Specific Census data for {cityName} is limited. We're displaying state-wide averages as a regional benchmark for your business planning.
                        </p>
                    </div>
                </div>
            )}
            {/* Market Scorecard (Quick Stats) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white border-slate-200 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase text-slate-500">Population Reach</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-[#0e0021] italic tracking-tighter">{data.population.toLocaleString()}</div>
                        <Badge variant="outline" className={`mt-2 text-[8px] border-none font-black uppercase ${data.isStateLevel ? 'bg-orange-500/10 text-orange-400' : 'bg-purple-500/10 text-purple-400'}`}>
                            {data.isStateLevel ? "Regional Profile" : (isSmallTown ? "Small Market" : "Active Market")}
                        </Badge>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase text-slate-500">Median Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-[#0e0021] italic tracking-tighter">
                            {data.medianIncome > 0 ? `$${data.medianIncome.toLocaleString()}` : "N/A"}
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Per Year / Household</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase text-slate-500">Median Age</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-[#0e0021] italic tracking-tighter">{data.audience.medianAge} YRS</div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">
                            {data.audience.medianAge < 35 ? "Young Demo" : data.audience.medianAge > 50 ? "Mature Demo" : "Mixed Demo"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 rounded-2xl border-emerald-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase text-emerald-700">Pricing Ceiling</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-[#0e0021] italic tracking-tighter uppercase">{data.nicheInsights?.pricingStrategy.type.replace("-", " ")}</div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Optimal Strategy</p>
                    </CardContent>
                </Card>
            </div>

            {/* Layered Intelligence Tabs */}
            <Tabs defaultValue="audience" className="w-full">
                <TabsList className="bg-white border border-slate-200 p-1 rounded-xl mb-8 w-full justify-start overflow-x-auto h-auto no-scrollbar">
                    <TabsTrigger value="audience" className="px-6 py-2 rounded-lg data-[state=active]:bg-purple-500 data-[state=active]:text-white uppercase font-black text-[10px] tracking-widest text-slate-600 hover:text-[#8422dc] transition-colors">
                        Audience Validation
                    </TabsTrigger>
                    <TabsTrigger value="affordability" className="px-6 py-2 rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white uppercase font-black text-[10px] tracking-widest text-slate-600 hover:text-[#8422dc] transition-colors">
                        Affordability & Pricing
                    </TabsTrigger>
                    <TabsTrigger value="targeting" className="px-6 py-2 rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white uppercase font-black text-[10px] tracking-widest text-slate-600 hover:text-[#8422dc] transition-colors">
                        Targeting Intelligence
                    </TabsTrigger>
                    <TabsTrigger value="logistics" className="px-6 py-2 rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-white uppercase font-black text-[10px] tracking-widest text-slate-600 hover:text-[#8422dc] transition-colors">
                        Channel & Logistics
                    </TabsTrigger>
                    <TabsTrigger value="economy" className="px-6 py-2 rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white uppercase font-black text-[10px] tracking-widest text-slate-600 hover:text-[#8422dc] transition-colors">
                        Economy & Skills
                    </TabsTrigger>
                    <TabsTrigger value="advisor" className="px-6 py-2 rounded-lg data-[state=active]:bg-purple-500 data-[state=active]:text-white uppercase font-black text-[10px] tracking-widest text-slate-600 hover:text-[#8422dc] transition-colors flex items-center gap-2">
                        <Sparkles className="h-3 w-3" />
                        Business Advisor
                    </TabsTrigger>
                </TabsList>

                {/* Audience Validation Tab */}
                <TabsContent value="audience" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Local Identity Card */}
                        <Card className="bg-white border-purple-500/20 rounded-2xl border-l-4 border-l-purple-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-[#0e0021]">
                                    <MapPin className="h-4 w-4 text-purple-400" />
                                    Local Identity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-2 bg-white/60 rounded-xl border border-slate-200">
                                        <span className="text-[9px] font-black text-slate-500 uppercase">ZIP Codes</span>
                                        <div className="flex flex-wrap gap-1 justify-end max-w-[120px]">
                                            {zipCodes.length > 0 ? zipCodes.slice(0, 3).map(zip => (
                                                <Badge key={zip} variant="outline" className="text-[9px] h-4 bg-[#f8f9fa]/50 border-slate-200 text-slate-700">{zip}</Badge>
                                            )) : <span className="text-[9px] font-bold text-slate-600 italic">No data</span>}
                                            {zipCodes.length > 3 && <span className="text-[8px] text-slate-600 font-black">+{zipCodes.length - 3}</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-white/60 rounded-xl border border-slate-200">
                                        <span className="text-[9px] font-black text-slate-500 uppercase">Area Codes</span>
                                        <div className="flex flex-wrap gap-1 justify-end max-w-[120px]">
                                            {areaCodes.length > 0 ? areaCodes.map(ac => (
                                                <Badge key={ac} variant="outline" className="text-[9px] h-4 bg-purple-500/10 border-purple-500/20 text-purple-400">{ac}</Badge>
                                            )) : <span className="text-[9px] font-bold text-slate-600 italic">No data</span>}
                                        </div>
                                    </div>
                                    {timezone && (
                                        <div className="flex items-center justify-between p-2 bg-white/60 rounded-xl border border-slate-200">
                                            <span className="text-[9px] font-black text-slate-500 uppercase">Timezone</span>
                                            <span className="text-[10px] font-black text-[#0e0021]">{timezone}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-50 border-slate-200 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-[#0e0021]">
                                    <Baby className="h-4 w-4 text-purple-400" />
                                    Family Density
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="flex justify-between text-[8px] font-black uppercase text-slate-500 mb-1">
                                            <span>Married</span>
                                            <span>{data.audience.maritalStatus.marriedPct}%</span>
                                        </div>
                                        <Progress value={data.audience.maritalStatus.marriedPct} className="h-1 bg-slate-100" indicatorClassName="bg-purple-500" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[8px] font-black uppercase text-slate-500 mb-1">
                                            <span>Divorced</span>
                                            <span>{data.audience.maritalStatus.divorcedPct}%</span>
                                        </div>
                                        <Progress value={data.audience.maritalStatus.divorcedPct} className="h-1 bg-slate-100" indicatorClassName="bg-slate-500" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                                        <div className="text-xl font-black text-[#0e0021] italic">{data.audience.familyComposition.kidsUnder18Count.toLocaleString()}</div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Kids 0-18</p>
                                    </div>
                                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                                        <div className="text-xl font-black text-[#0e0021] italic">{data.audience.familyComposition.kids18to24Count.toLocaleString()}</div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Kids 18-24</p>
                                    </div>
                                </div>
                                <div className="pt-2 flex justify-between items-center bg-purple-500/5 p-2 rounded-lg border border-purple-500/10">
                                    <span className="text-[9px] font-black text-slate-600 uppercase">Avg HH Size</span>
                                    <span className="text-sm font-black text-purple-400">{data.audience.avgHouseholdSize}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-50 border-slate-200 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-[#0e0021]">
                                    <Users className="h-4 w-4 text-blue-400" />
                                    Age Brackets
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                                        <div className="text-xl font-black text-[#0e0021] italic">{data.audience.under18Pct}%</div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Under 18</p>
                                    </div>
                                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                                        <div className="text-xl font-black text-[#0e0021] italic">{data.audience.over65Pct}%</div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">65+ Senior</p>
                                    </div>
                                </div>
                                <p className="text-[10px] font-medium text-slate-600 italic">
                                    {data.audience.under18Pct > 25 ? "High concentration of families. Hot market for parenting and toys." : "Mature population. Focus on wealth management and health services."}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#f8f9fa]/20 border-slate-200 rounded-2xl lg:col-span-1 md:col-span-2">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-[#0e0021]">
                                    <UserCheck className="h-4 w-4 text-emerald-700" />
                                    Messaging Tone
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                                    <h4 className="text-sm font-black text-emerald-700 uppercase italic">Recommended Persona</h4>
                                    <p className="text-xs text-slate-600 font-medium leading-relaxed mt-2">
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
                        <Card className="bg-slate-50 border-slate-200 rounded-2xl lg:col-span-2">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase text-[#0e0021]">Household Income Distribution</CardTitle>
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
                                            <Progress value={b.val} className={`h-1.5 bg-slate-100`} indicatorClassName={b.color} />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="bg-slate-50 border-slate-200 rounded-2xl">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-black uppercase text-[#0e0021] flex items-center gap-2">
                                        <Home className="h-4 w-4 text-emerald-700" />
                                        Housing Reality
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Median Rent</span>
                                        <span className="text-sm font-black text-[#0e0021]">
                                            {data.affordability.medianRent > 0 
                                                ? `$${data.affordability.medianRent.toLocaleString()}` 
                                                : "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Median Mortgage</span>
                                        <span className="text-sm font-black text-[#0e0021]">
                                            {data.affordability.medianMortgage > 0 
                                                ? `$${data.affordability.medianMortgage.toLocaleString()}` 
                                                : "N/A"}
                                        </span>
                                    </div>
                                    <div className="pt-2">
                                        <div className="flex justify-between text-[10px] font-bold uppercase text-slate-600 mb-1">
                                            <span>Housing Cost Burden ({">"}30%)</span>
                                            <span className={data.affordability.costBurdenedPct > 35 ? "text-red-400" : "text-emerald-700"}>{data.affordability.costBurdenedPct}%</span>
                                        </div>
                                        <Progress value={data.affordability.costBurdenedPct} className="h-1 bg-slate-100" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/60 border-slate-200 rounded-2xl border-l-4 border-l-emerald-500">
                                <CardContent className="pt-6">
                                    <div className="text-2xl font-black text-[#0e0021] italic tracking-tighter">
                                        {data.affordability.perCapitaIncome > 0 ? `$${data.affordability.perCapitaIncome.toLocaleString()}` : "N/A"}
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Per Capita Income</p>
                                    <div className="mt-4 flex items-center gap-2">
                                        <TrendingUp className="h-3 w-3 text-emerald-700" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
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
                        <Card className="bg-slate-50 border-slate-200 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-[#0e0021]">
                                    <Target className="h-4 w-4 text-blue-400" />
                                    Gender Split
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black italic tracking-tighter text-[#0e0021] mb-2">
                                    {Math.round((data.gender.male / totalPop) * 100)}% M / {Math.round((data.gender.female / totalPop) * 100)}% F
                                </div>
                                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-blue-500" style={{ width: `${(data.gender.male / totalPop) * 100}%` }} />
                                    <div className="h-full bg-pink-500" style={{ width: `${(data.gender.female / totalPop) * 100}%` }} />
                                </div>
                                <div className="mt-4 grid grid-cols-2 text-[10px] font-bold uppercase text-slate-500">
                                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full" /> {data.gender.male.toLocaleString()} Male</div>
                                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-pink-500 rounded-full" /> {data.gender.female.toLocaleString()} Female</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-50 border-slate-200 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-[#0e0021]">
                                    <PieChart className="h-4 w-4 text-emerald-700" />
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
                                        <Progress value={(e.val / totalPop) * 100} className="h-1 bg-slate-100" indicatorClassName={e.color} />
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
                        <Card className="bg-slate-50 border-slate-200 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-[#0e0021]">
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
                                    <Progress value={data.digital.broadbandPct} className="h-1 bg-slate-100" indicatorClassName="bg-cyan-500" />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                                    <div className="flex items-center gap-2">
                                        <Smartphone className="h-3 w-3 text-slate-500" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase">Smartphone Only</span>
                                    </div>
                                    <span className="text-sm font-black text-[#0e0021]">{data.digital.smartphoneOnlyPct}%</span>
                                </div>
                                <p className="text-[9px] font-bold text-slate-600 uppercase italic mt-4">
                                    {data.digital.broadbandPct < 75 
                                        ? "⚠️ Low Broadband: Focus on mobile-first, low-bandwidth funnels." 
                                        : "🚀 High Connectivity: Great for live streaming and high-def video courses."}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Commute & Mobility */}
                        <Card className="bg-slate-50 border-slate-200 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-[#0e0021]">
                                    <Clock className="h-4 w-4 text-cyan-400" />
                                    Daily Mobility
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Car className="h-3 w-3 text-blue-400" />
                                            <span className="text-[8px] font-black text-slate-500 uppercase">Drive Alone</span>
                                        </div>
                                        <div className="text-lg font-black text-[#0e0021] italic">{data.mobility.drivePct}%</div>
                                    </div>
                                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Navigation className="h-3 w-3 text-emerald-700" />
                                            <span className="text-[8px] font-black text-slate-500 uppercase">Transit</span>
                                        </div>
                                        <div className="text-lg font-black text-[#0e0021] italic">{data.mobility.transitPct}%</div>
                                    </div>
                                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Heart className="h-3 w-3 text-pink-400" />
                                            <span className="text-[8px] font-black text-slate-500 uppercase">Walk/Bike</span>
                                        </div>
                                        <div className="text-lg font-black text-[#0e0021] italic">{data.mobility.walkPct + data.mobility.bikePct}%</div>
                                    </div>
                                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Home className="h-3 w-3 text-purple-400" />
                                            <span className="text-[8px] font-black text-slate-500 uppercase">WFH</span>
                                        </div>
                                        <div className="text-lg font-black text-[#0e0021] italic">{data.digital.workFromHomePct}%</div>
                                    </div>
                                </div>
                                
                                <div className="pt-2 border-t border-slate-200">
                                    <div className="text-2xl font-black text-[#0e0021] italic">{data.digital.meanCommuteMinutes} MIN</div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Avg Commute Time</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Education & Language */}
                        <Card className="bg-slate-50 border-slate-200 rounded-2xl lg:col-span-1 md:col-span-2">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-[#0e0021]">
                                    <School className="h-4 w-4 text-cyan-400" />
                                    Skillset & reach
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    {[
                                        { label: "Spanish speakers", val: data.logistics.languages.spanishPct },
                                        { label: "French speakers", val: data.logistics.languages.frenchPct },
                                        { label: "Italian speakers", val: data.logistics.languages.italianPct },
                                        { label: "German speakers", val: data.logistics.languages.germanPct },
                                        { label: "Chinese speakers", val: data.logistics.languages.chinesePct },
                                    ].filter(l => l.val > 0 || l.label === "Spanish speakers").map(lang => (
                                        <div key={lang.label} className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200">
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-3 w-3 text-cyan-500" />
                                                <span className="text-[9px] font-black text-slate-500 uppercase">{lang.label}</span>
                                            </div>
                                            <span className="text-[10px] font-black text-[#0e0021]">
                                                {lang.val === 0 ? "< 1%" : `${lang.val}%`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                                    <div className="text-xl font-black text-cyan-400 italic">{data.logistics.bachelorsDegreePct}%</div>
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Bachelor's Degree or Higher</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Economy & Skills Tab */}
                <TabsContent value="economy" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-slate-50 border-slate-200 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase text-[#0e0021] flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-orange-400" />
                                    Top Industries
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.economy.topIndustries.map((ind) => {
                                    const colors: Record<string, string> = {
                                        "Education/Health": "bg-blue-500",
                                        "Arts/Food": "bg-pink-500",
                                        "Retail": "bg-emerald-500",
                                        "Prof/Admin": "bg-purple-500",
                                        "Manufacturing": "bg-cyan-500",
                                        "Public Admin": "bg-slate-400",
                                        "Finance/Real Estate": "bg-amber-500",
                                        "Information": "bg-indigo-500",
                                        "Construction": "bg-orange-500",
                                        "Wholesale": "bg-lime-500",
                                        "Agri/Mining": "bg-brown-500", // Fallback color handled below
                                    };
                                    const colorClass = colors[ind.name] || "bg-slate-600";
                                    return (
                                        <div key={ind.name} className="space-y-1">
                                            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                                                <span>{ind.name}</span>
                                                <span>{ind.pct}%</span>
                                            </div>
                                            <Progress 
                                                value={ind.pct} 
                                                className="h-1 bg-slate-100" 
                                                indicatorClassName={colorClass} 
                                            />
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-50 border-slate-200 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase text-[#0e0021] flex items-center gap-2">
                                    <Award className="h-4 w-4 text-orange-400" />
                                    Worker Occupations
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.economy.topOccupations.map((occ) => {
                                    const colors: Record<string, string> = {
                                        "Management/Arts": "bg-purple-500",
                                        "Service": "bg-pink-500",
                                        "Sales/Office": "bg-blue-500",
                                        "Natural Resources/Construction": "bg-orange-500",
                                        "Production/Transport": "bg-cyan-400"
                                    };
                                    const colorClass = colors[occ.name] || "bg-slate-600";
                                    return (
                                        <div key={occ.name} className="space-y-1">
                                            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                                                <span>{occ.name}</span>
                                                <span>{occ.pct}%</span>
                                            </div>
                                            <Progress 
                                                value={occ.pct} 
                                                className="h-1 bg-slate-100" 
                                                indicatorClassName={colorClass} 
                                            />
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-50 border-slate-200 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase text-[#0e0021] flex items-center gap-2">
                                    <Heart className="h-4 w-4 text-pink-500" />
                                    Health & Wellness
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-pink-500/5 border border-pink-500/10 rounded-xl">
                                    <div className="text-2xl font-black text-pink-400 italic">{data.health.insurancePct}%</div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Health Insurance Coverage</p>
                                </div>
                                <p className="text-[9px] font-bold text-slate-600 uppercase italic leading-relaxed">
                                    {data.health.insurancePct > 90 
                                        ? "Strong coverage base. High potential for supplemental wellness and fitness services." 
                                        : "Coverage gap detected. Opportunity for budget-friendly health advocacy programs."}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-50 border-slate-200 rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase text-[#0e0021] flex items-center gap-2">
                                    <UserCheck className="h-4 w-4 text-emerald-700" />
                                    Employment Character
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-2 pt-2">
                                    <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200 border-l-4 border-l-cyan-500">
                                        <span className="text-[9px] font-black text-slate-500 uppercase uppercase">Private</span>
                                        <span className="text-sm font-black text-[#0e0021] italic">{data.economy.employmentType.private}%</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200 border-l-4 border-l-blue-500">
                                        <span className="text-[9px] font-black text-slate-500 uppercase uppercase">Public</span>
                                        <span className="text-sm font-black text-[#0e0021] italic">{data.economy.employmentType.public}%</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200 border-l-4 border-l-emerald-500">
                                        <span className="text-[9px] font-black text-slate-500 uppercase uppercase">SMB/Self</span>
                                        <span className="text-sm font-black text-[#0e0021] italic">{data.economy.employmentType.selfEmployed}%</span>
                                    </div>
                                </div>
                                <p className="text-[8px] font-bold text-slate-500 uppercase italic leading-tight">
                                    {data.economy.employmentType.selfEmployed > 10 
                                        ? "Strong entrepreneurial culture detected." 
                                        : "Traditional employment hub."}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* AI Business Advisor Tab */}
                <TabsContent value="advisor" className="space-y-6">
                    {data && <AIBusinessAdvisor 
                        data={data} 
                        cityName={cityName} 
                        zipCodes={zipCodes}
                        areaCodes={areaCodes}
                        timezone={timezone}
                    />}
                </TabsContent>

            </Tabs>

            {/* Niche Opportunity Spotlight */}
            {data.nicheInsights && (
                <div className="mt-12 space-y-6">
                    <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-purple-400" />
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#0e0021]">Niche Opportunity Spotlight</h3>
                        <Badge variant="outline" className="ml-auto bg-purple-500/10 text-purple-400 border-purple-500/20 text-[8px] uppercase font-black">AI Scored</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {data.nicheInsights.candidates.map((niche) => (
                            <Card key={niche.id} className="bg-white border-slate-200 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all border-b-2 border-b-purple-500/20 flex flex-col">
                                <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
                                    <CardTitle className="text-[10px] font-black uppercase text-slate-600">{niche.label}</CardTitle>
                                    <span className={`text-sm font-black italic ${niche.score >= 8 ? "text-emerald-700" : niche.score >= 5 ? "text-blue-400" : "text-amber-400"}`}>{niche.score}/10</span>
                                </CardHeader>
                                <CardContent className="p-4 flex-1 flex flex-col">
                                    <div className="text-lg font-black text-[#0e0021] italic leading-tight mb-2 uppercase">{niche.sublabel}</div>
                                    <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase mb-4">{niche.description}</p>
                                    
                                    <div className="mt-auto space-y-3">
                                        <div className="p-3 bg-[#f8f9fa]/40 rounded-xl border border-slate-200">
                                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Data Signals</p>
                                            <ul className="space-y-1">
                                                {niche.signals.map((signal, idx) => (
                                                    <li key={idx} className="flex items-center gap-2 text-[9px] font-bold text-slate-600 uppercase">
                                                        <div className="w-1 h-1 rounded-full bg-purple-500" />
                                                        {signal}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <Progress value={niche.score * 10} className="h-1 bg-slate-100" indicatorClassName={niche.score >= 8 ? "bg-emerald-500" : niche.score >= 5 ? "bg-blue-500" : "bg-amber-500"} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Quality & Footer */}
            <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between gap-6 opacity-60 transition-opacity hover:opacity-100">
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
                <Badge variant="outline" className="h-fit bg-white border-slate-200 text-slate-600 text-[8px] font-black uppercase py-0.5">
                    Ref ID: {data.year}-ACS5-PLACE-{cityName.toUpperCase()}
                </Badge>
            </div>
        </div>
    );
}
