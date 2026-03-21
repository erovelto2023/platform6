import React from 'react';
import { Trophy, Briefcase, Factory, Users, Wallet, Star, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

const METRIC_DETAILS: Record<string, { description: string; insight: string }> = {
  "Small Business Count": {
    description: "Total number of local enterprises.",
    insight: "High counts signify a mature business ecosystem with robust support infrastructure."
  },
  "Small Manufacturers": {
    description: "Industrial backbone of the economy.",
    insight: "Strong rankings indicate high production capacity and local supply chain resilience."
  },
  "Employment Share": {
    description: "Percentage of locals employed by small firms.",
    insight: "High shares mean the economy is driven by local entrepreneurs rather than outside corporations."
  },
  "Payroll Share": {
    description: "Economic contribution of small business wages.",
    insight: "High rankings suggest small businesses are providing competitive, high-paying local jobs."
  },
  "Minority Owned": {
    description: "Diversity of ownership.",
    insight: "Indicates an inclusive environment with accessible capital for diverse communities."
  },
  "Women Owned": {
    description: "Gender equity in business ownership.",
    insight: "Strong performance shows a supportive ecosystem for female-led ventures and leadership."
  },
  "Veteran Owned": {
    description: "Leadership and discipline in the market.",
    insight: "Signifies a resilient, community-focused business community with strong operational skills."
  }
};

export function MetroRankings({ metroName, stats }: MetroRankingsProps) {
  if (!stats) return null;

  const rankingCards = [
    {
      title: "Small Business Count",
      value: stats.smallBusinessCount?.value.toLocaleString(),
      rank: stats.smallBusinessCount?.rank,
      icon: <Briefcase className="w-5 h-5 text-blue-400" />,
      suffix: "businesses"
    },
    {
      title: "Small Manufacturers",
      value: stats.smallManufacturerCount?.value.toLocaleString(),
      rank: stats.smallManufacturerCount?.rank,
      icon: <Factory className="w-5 h-5 text-emerald-400" />,
      suffix: "firms"
    },
    {
      title: "Employment Share",
      value: `${stats.employmentShare?.value}%`,
      rank: stats.employmentShare?.rank,
      icon: <Users className="w-5 h-5 text-purple-400" />,
      suffix: "of total workforce"
    },
    {
      title: "Payroll Share",
      value: `${stats.payrollShare?.value}%`,
      rank: stats.payrollShare?.rank,
      icon: <Wallet className="w-5 h-5 text-amber-400" />,
      suffix: "of total payroll"
    },
    {
      title: "Minority Owned",
      value: `${stats.minorityShare?.value}%`,
      rank: stats.minorityShare?.rank,
      icon: <Star className="w-5 h-5 text-rose-400" />,
      suffix: "of businesses"
    },
    {
      title: "Women Owned",
      value: `${stats.womenShare?.value}%`,
      rank: stats.womenShare?.rank,
      icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />,
      suffix: "of businesses"
    },
    {
      title: "Veteran Owned",
      value: `${stats.veteranShare?.value}%`,
      rank: stats.veteranShare?.rank,
      icon: <Trophy className="w-5 h-5 text-orange-400" />,
      suffix: "of businesses"
    }
  ].filter(card => card.rank !== undefined && card.rank > 0);

  if (rankingCards.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col border-l-4 border-purple-500 pl-4 mb-8">
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">
          Market Authority Rankings
        </h2>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
          {metroName} Metropolitan Statistical Area • 2025 Economic Projections
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rankingCards.map((card, index) => (
          <Card key={index} className="border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-all group relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-800 rounded-lg">
                  {card.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter">National Rank</span>
                  <span className="text-2xl font-black text-purple-400 italic leading-none">#{card.rank}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-zinc-100 mb-1">{card.value}</div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2 mb-2">
                {card.title}
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                {METRIC_DETAILS[card.title]?.insight}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 p-6 bg-zinc-900 border border-zinc-800 rounded-[2rem] flex items-start gap-4">
        <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 group">
           <Trophy size={24} className="group-hover:scale-110 transition-transform" />
        </div>
        <div>
          <h4 className="text-lg font-black text-white uppercase tracking-tight italic mb-1">Economic Significance</h4>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
            These rankings measure the competitive strength of the <strong>{metroName}</strong> market against 384 other U.S. metropolitan areas. 
            A top-tier ranking (low number) signifies a market with high entrepreneurial velocity and institutional stability, factors that directly impact your ROI for professional services and high-ticket consulting.
          </p>
        </div>
      </div>
    </div>
  );
}
