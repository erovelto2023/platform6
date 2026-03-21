import React from 'react';
import { Trophy, Briefcase, Factory, Users, Wallet, Star, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MetroStats {
  value: number;
  rank: number;
}

interface MetroRankingsProps {
  metroName: string;
  stats: {
    smallBusinessCount?: MetroStats;
    smallManufacturerCount?: MetroStats;
    employmentShare?: MetroStats;
    payrollShare?: MetroStats;
    minorityShare?: MetroStats;
    womenShare?: MetroStats;
    veteranShare?: MetroStats;
  };
}

export function MetroRankings({ metroName, stats }: MetroRankingsProps) {
  if (!stats) return null;

  const rankingCards = [
    {
      title: "Small Business Count",
      value: stats.smallBusinessCount?.value.toLocaleString(),
      rank: stats.smallBusinessCount?.rank,
      icon: <Briefcase className="w-5 h-5 text-blue-500" />,
      suffix: "businesses"
    },
    {
      title: "Small Manufacturers",
      value: stats.smallManufacturerCount?.value.toLocaleString(),
      rank: stats.smallManufacturerCount?.rank,
      icon: <Factory className="w-5 h-5 text-emerald-500" />,
      suffix: "firms"
    },
    {
      title: "Employment Share",
      value: `${stats.employmentShare?.value}%`,
      rank: stats.employmentShare?.rank,
      icon: <Users className="w-5 h-5 text-purple-500" />,
      suffix: "of total workforce"
    },
    {
      title: "Payroll Share",
      value: `${stats.payrollShare?.value}%`,
      rank: stats.payrollShare?.rank,
      icon: <Wallet className="w-5 h-5 text-amber-500" />,
      suffix: "of total payroll"
    },
    {
      title: "Minority Owned",
      value: `${stats.minorityShare?.value}%`,
      rank: stats.minorityShare?.rank,
      icon: <Star className="w-5 h-5 text-rose-500" />,
      suffix: "of businesses"
    },
    {
      title: "Women Owned",
      value: `${stats.womenShare?.value}%`,
      rank: stats.womenShare?.rank,
      icon: <ShieldCheck className="w-5 h-5 text-indigo-500" />,
      suffix: "of businesses"
    },
    {
      title: "Veteran Owned",
      value: `${stats.veteranShare?.value}%`,
      rank: stats.veteranShare?.rank,
      icon: <Trophy className="w-5 h-5 text-orange-500" />,
      suffix: "of businesses"
    }
  ].filter(card => card.rank !== undefined && card.rank > 0);

  if (rankingCards.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col border-l-4 border-indigo-500 pl-4 mb-8">
        <h2 className="text-2xl font-black text-[#0e0021] uppercase italic tracking-tight">
          National Small Business Rankings
        </h2>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
          {metroName} Metropolitan Statistical Area
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rankingCards.map((card, index) => (
          <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white/50 backdrop-blur-sm overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-50 group-hover:bg-indigo-500 transition-colors" />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                  {card.icon}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">National Rank</span>
                  <span className="text-xl font-black text-indigo-600 italic">#{card.rank}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-800">{card.value}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                {card.title}
              </div>
              <div className="text-[9px] text-slate-400 italic mt-2 border-t border-slate-50 pt-2">
                {card.suffix}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-4 p-4 bg-blue-50/50 rounded-[1.5rem] border border-blue-100 flex items-start gap-3">
        <div className="p-2 bg-blue-100 rounded-full text-blue-600 mt-1">
           <Trophy size={16} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-800 uppercase tracking-tight">Market Insight</h4>
          <p className="text-xs text-blue-700 leading-relaxed max-w-2xl">
            These rankings compare the {metroName} metro area against 384 other metropolitan statistical areas in the United States. 
            Higher rankings (lower numbers) indicate a stronger relative performance in that specific metric.
          </p>
        </div>
      </div>
    </div>
  );
}
