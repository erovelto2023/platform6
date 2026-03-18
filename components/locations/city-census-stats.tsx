import { TrendingUp, Users, DollarSign, Activity, Target, Briefcase, Award, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CityCensusStatsProps {
    data: {
        population: number;
        medianIncome: number;
        gender: {
            male: number;
            female: number;
        };
        ethnicity: {
            white: number;
            black: number;
            asian: number;
            hispanic: number;
        };
        ownerStats?: {
            totalFirms: number;
            womenOwned: { count: number; pct: number };
            veteranOwned: { count: number; pct: number };
            minorityOwned: { count: number; pct: number };
            isStateLevel: boolean;
        };
        nicheInsights?: {
            pottyTraining: { score: number; label: string };
            seniorCare: { score: number; label: string };
            luxuryLuxury: { score: number; label: string };
            pricingStrategy: { type: string; description: string };
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
    const malePct = Math.round((data.gender.male / totalPop) * 100);
    const femalePct = Math.round((data.gender.female / totalPop) * 100);

    const ethStats = [
        { label: "White", value: data.ethnicity.white, color: "bg-blue-500" },
        { label: "Black", value: data.ethnicity.black, color: "bg-emerald-500" },
        { label: "Hispanic", value: data.ethnicity.hispanic, color: "bg-orange-500" },
        { label: "Asian", value: data.ethnicity.asian, color: "bg-purple-500" },
    ].map(s => ({ ...s, pct: Math.round((s.value / totalPop) * 100) }))
     .sort((a, b) => b.value - a.value);

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Population Card */}
                <Card className="bg-slate-900/40 border-slate-800 rounded-3xl overflow-hidden group hover:border-purple-500/50 transition-all duration-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center justify-between">
                            Total Population
                            <Users className="h-4 w-4 text-purple-400" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black italic tracking-tighter text-white mb-2">
                            {data.population.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-none rounded-lg font-black text-[10px] uppercase">
                                {data.year} Official Data
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Income Card */}
                <Card className="bg-slate-900/40 border-slate-800 rounded-3xl overflow-hidden group hover:border-pink-500/50 transition-all duration-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center justify-between">
                            Median Household Income
                            <DollarSign className="h-4 w-4 text-pink-400" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black italic tracking-tighter text-white mb-2">
                            ${data.medianIncome.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-pink-500/10 text-pink-400 border-none rounded-lg font-black text-[10px] uppercase">
                                Spending Power: {data.medianIncome > 75000 ? "High" : "Moderate"}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Targeting Card */}
                <Card className="bg-slate-900/40 border-slate-800 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all duration-500 lg:col-span-1 md:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center justify-between">
                            Ad Targeting Reach
                            <Target className="h-4 w-4 text-blue-400" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black italic tracking-tighter text-white mb-2">
                            {malePct}% Male / {femalePct}% Female
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                            <div className="h-full bg-blue-500" style={{ width: `${malePct}%` }} />
                            <div className="h-full bg-pink-500" style={{ width: `${femalePct}%` }} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Niche Recommendation Engine */}
            {data.nicheInsights && (
                <section className="space-y-6">
                    <div className="flex items-end justify-between border-b border-slate-800 pb-4">
                        <div>
                            <Badge className="bg-purple-500 text-white rounded-md mb-2 font-black text-[10px] uppercase px-2 py-0">Experimental AI</Badge>
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                                Niche Explorer <span className="text-slate-700">for {cityName}</span>
                            </h2>
                        </div>
                        <div className="text-right hidden md:block">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pricing Roadmap</p>
                            <p className="text-sm font-bold text-emerald-400 italic">{data.nicheInsights.pricingStrategy.description}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Potty Training / Parenting */}
                        <Card className="bg-slate-900/60 border-slate-800 rounded-2xl overflow-hidden hover:bg-slate-900 transition-colors">
                            <CardHeader className="pb-2">
                                <div className="p-2 w-fit bg-blue-500/10 rounded-lg mb-2">
                                    <Activity className="h-4 w-4 text-blue-400" />
                                </div>
                                <CardTitle className="text-sm font-black uppercase tracking-wide text-white">Parenting / Kids</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${data.nicheInsights.pottyTraining.score * 10}%` }} />
                                    </div>
                                    <span className="text-xs font-black text-slate-500">{data.nicheInsights.pottyTraining.score}/10</span>
                                </div>
                                <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-none font-bold text-[10px] uppercase">
                                    {data.nicheInsights.pottyTraining.label}: Potty Training Products
                                </Badge>
                            </CardContent>
                        </Card>

                        {/* Senior Care */}
                        <Card className="bg-slate-900/60 border-slate-800 rounded-2xl overflow-hidden hover:bg-slate-900 transition-colors">
                            <CardHeader className="pb-2">
                                <div className="p-2 w-fit bg-emerald-500/10 rounded-lg mb-2">
                                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                </div>
                                <CardTitle className="text-sm font-black uppercase tracking-wide text-white">Senior Services</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${data.nicheInsights.seniorCare.score * 10}%` }} />
                                    </div>
                                    <span className="text-xs font-black text-slate-500">{data.nicheInsights.seniorCare.score}/10</span>
                                </div>
                                <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-none font-bold text-[10px] uppercase">
                                    {data.nicheInsights.seniorCare.label}: Assisted Living / Health
                                </Badge>
                            </CardContent>
                        </Card>

                        {/* Luxury / Hobbies */}
                        <Card className="bg-slate-900/60 border-slate-800 rounded-2xl overflow-hidden hover:bg-slate-900 transition-colors">
                            <CardHeader className="pb-2">
                                <div className="p-2 w-fit bg-orange-500/10 rounded-lg mb-2">
                                    <Award className="h-4 w-4 text-orange-400" />
                                </div>
                                <CardTitle className="text-sm font-black uppercase tracking-wide text-white">Premium Hobbies</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full">
                                        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${data.nicheInsights.luxuryLuxury.score * 10}%` }} />
                                    </div>
                                    <span className="text-xs font-black text-slate-500">{data.nicheInsights.luxuryLuxury.score}/10</span>
                                </div>
                                <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-none font-bold text-[10px] uppercase">
                                    {data.nicheInsights.luxuryLuxury.label}: Luxury Goods / Model Making
                                </Badge>
                            </CardContent>
                        </Card>

                        {/* Pricing Strategy */}
                        <Card className="bg-emerald-500/5 border-emerald-500/20 border-dashed border-2 rounded-2xl overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="p-2 w-fit bg-emerald-500/20 rounded-lg mb-2">
                                    <Briefcase className="h-4 w-4 text-emerald-400" />
                                </div>
                                <CardTitle className="text-sm font-black uppercase tracking-wide text-emerald-400">Pricing Strategy</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg font-black text-white italic tracking-tight mb-1 uppercase">
                                    {data.nicheInsights.pricingStrategy.type.replace("-", " ")}
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">
                                    Recommended based on purchasing power & disposable income.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            )}

            {/* Entrepreneurial Profile (ABS Data) */}
            {data.ownerStats && (
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-l-4 border-emerald-500 pl-4">
                        <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
                            Entrepreneurial Profile
                        </h2>
                        {data.ownerStats.isStateLevel && (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-black">
                                State-Level Benchmark
                            </Badge>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Women Owned */}
                        <Card className="bg-slate-900/40 border-slate-800/50 rounded-3xl overflow-hidden border-b-4 border-pink-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                    <Award className="h-3 w-3 text-pink-400" />
                                    Women-Owned Firms
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black text-white italic tracking-tighter mb-1">
                                    {data.ownerStats.womenOwned.pct}%
                                </div>
                                <p className="text-[10px] font-bold text-slate-600 uppercase">
                                    {data.ownerStats.womenOwned.count.toLocaleString()} registered firms
                                </p>
                            </CardContent>
                        </Card>

                        {/* Veteran Owned */}
                        <Card className="bg-slate-900/40 border-slate-800/50 rounded-3xl overflow-hidden border-b-4 border-blue-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                    <ShieldCheck className="h-3 w-3 text-blue-400" />
                                    Veteran-Owned Firms
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black text-white italic tracking-tighter mb-1">
                                    {data.ownerStats.veteranOwned.pct}%
                                </div>
                                <p className="text-[10px] font-bold text-slate-600 uppercase">
                                    {data.ownerStats.veteranOwned.count.toLocaleString()} registered firms
                                </p>
                            </CardContent>
                        </Card>

                        {/* Minority Owned */}
                        <Card className="bg-slate-900/40 border-slate-800/50 rounded-3xl overflow-hidden border-b-4 border-emerald-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                    <Briefcase className="h-3 w-3 text-emerald-400" />
                                    Minority-Owned Firms
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black text-white italic tracking-tighter mb-1">
                                    {data.ownerStats.minorityOwned.pct}%
                                </div>
                                <p className="text-[10px] font-bold text-slate-600 uppercase">
                                    {data.ownerStats.minorityOwned.count.toLocaleString()} registered firms
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            )}

            {/* Ethnicity Ratios */}
            <div className="p-8 rounded-[3rem] bg-slate-900/20 border border-slate-800/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h3 className="text-xl font-black uppercase italic text-white flex items-center gap-2">
                            <Activity className="h-5 w-5 text-emerald-400" />
                            Targeting Intelligence
                        </h3>
                        <p className="text-slate-500 text-sm font-medium mt-1">Detailed ethnic distribution for localized advertising campaigns.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {ethStats.map((stat) => (
                        <div key={stat.label} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                                <span className="text-lg font-black text-white italic">{stat.pct}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: `${stat.pct}%` }} />
                            </div>
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                                {stat.value.toLocaleString()} residents
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
