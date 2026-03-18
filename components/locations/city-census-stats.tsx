import { TrendingUp, Users, DollarSign, Activity, Target } from "lucide-react";
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
        <div className="space-y-8">
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

            {/* Ethnicity Ratios */}
            <div className="p-8 rounded-[2.5rem] bg-slate-900/20 border border-slate-800/50">
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
