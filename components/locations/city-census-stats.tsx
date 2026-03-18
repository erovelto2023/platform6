import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CityCensusStatsProps {
    data: {
        population: number;
        medianIncome: number;
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

    const isHighIncome = data.medianIncome > 75000;
    const isLargeMarket = data.population > 50000;

    return (
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
                            {data.year} Census Estimate
                        </Badge>
                        {isLargeMarket && (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-none rounded-lg font-black text-[10px] uppercase">
                                High Density
                            </Badge>
                        )}
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
                            Real-time Affluence
                        </Badge>
                        {isHighIncome && (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-none rounded-lg font-black text-[10px] uppercase">
                                Premium Market
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Opportunity Score Card */}
            <Card className="bg-slate-900/40 border-slate-800 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all duration-500">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center justify-between">
                        Market Opportunity Score
                        <Activity className="h-4 w-4 text-blue-400" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-black italic tracking-tighter text-white mb-2">
                        {data.medianIncome > 0 ? "A+" : "B"}
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-none rounded-lg font-black text-[10px] uppercase">
                            Niche Viability: Strong
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
